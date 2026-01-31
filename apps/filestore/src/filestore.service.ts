import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MinioService } from './minio/minio.service';
import { AppConfigService } from './config/App.config.service';
import { InitUploadRo } from './ro/init-upload.ro';
import { nanoid } from 'nanoid';
import { Repository } from 'typeorm';
import { ChunkRo } from './ro/chunk.ro';
import { RedisService } from './redis/redis.service';
import { getKeyUpload } from './utils/redis.key';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { NotFoundError } from 'rxjs';
import { FileEntity } from '@app/common/database/entites/file.entity';
import { FileStatusEnum } from '@app/common/database/enums/file.enum';

@Injectable()
export class FilestoreService {
  private readonly maxChunks: number;
  private readonly maxChunkSize: number;
  private readonly maxInitChunk: number;
  private readonly logger = new Logger(FilestoreService.name);

  constructor(
    private readonly appConfig: AppConfigService,
    private readonly minioService: MinioService,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly redis: RedisService,
  ) {
    this.maxChunkSize = appConfig.storageSetting().maxChunkSize;
    this.maxChunks = appConfig.storageSetting().maxChunks;
    this.maxInitChunk = appConfig.storageSetting().maxInitChunk;
  }

  async initUpload(
    userId: string,
    fileSize: number,
    filename: string,
  ): Promise<InitUploadRo> {
    const uploadKey = nanoid();
    const now = new Date();
    const fileId = randomUUID();
    const fileData = this.fileRepository.create({
      id: fileId,
      name: filename,
      fileType: 'application/pdf',
      fileSize: fileSize,
      checksum: '',
      status: FileStatusEnum.INIT,
      folder: '/documents',
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    });

    if (fileSize >= this.maxChunkSize) {
      this.logger.verbose('Upload multipart file', fileId);
      const uploadData =
        await this.minioService.createMultiPartUpload(uploadKey);
      const numberParts = Math.ceil(fileSize / this.maxChunkSize);
      const shouldCreatedParts = Math.min(numberParts, this.maxInitChunk);
      const chunks = await this.generateMultipartPresigned(
        uploadData.UploadId as string,
        uploadData.Key as string,
        shouldCreatedParts,
      );

      await this.fileRepository.save(fileData);

      this.redis.set(
        getKeyUpload(fileData.id),
        JSON.stringify({
          uploadId: uploadData.UploadId,
          key: uploadKey,
          folder: '/documents',
        }),
      );
      return {
        data: chunks,
        chunkSize: this.maxChunkSize,
        fileId: fileId,
        nextStep: 'UPLOAD_CHUNK',
      };
    } else {
      this.logger.verbose('Upload file ', fileId);
      await this.fileRepository.save(fileData);
      this.redis.set(
        getKeyUpload(fileData.id),
        JSON.stringify({
          uploadId: '',
          key: uploadKey,
          folder: '/documents',
        }),
      );
      return {
        data: [
          {
            link: await this.generatePresignedURL(userId, fileData.id),
            part: 1,
          },
        ],
        fileId: fileId,
        chunkSize: fileSize,
        nextStep: 'UPLOAD_FILE',
      };
    }
  }

  async completeUpload(fileId: string) {
    const { uploadId, key } = await this.getUploadDataFromFileId(fileId);

    const uploadedParts = await this.minioService.listUploadedParts(
      uploadId,
      key,
    );

    if (!uploadedParts.Parts) {
      throw new NotFoundError(`Uploaded file id ${uploadId} not found`);
    }

    const result = await this.minioService.completeUploadParts(
      uploadId,
      key,
      uploadedParts.Parts,
    );
    // TODO: send to rabbitMQ

    return result;
  }

  async getUploadDataFromFileId(fileId: string) {
    const uploadData = await this.redis.get(getKeyUpload(fileId));

    if (!uploadData) {
      throw new NotFoundException(`Upload id ${fileId} not found`);
    }
    const { uploadId, key, folder } = JSON.parse(uploadData) as Record<
      string,
      string
    >;

    return {
      uploadId,
      key,
      folder,
    };
  }

  async listParts(fileId: string) {
    const { uploadId, key } = await this.getUploadDataFromFileId(fileId);

    return this.minioService.listUploadedParts(uploadId, key);
  }

  async generateMultipartPresigned(
    uploadId: string,
    objectName: string,
    numberPart: number,
  ): Promise<Array<ChunkRo>> {
    const listPresignedURL: Array<ChunkRo> = [];

    for (let index = 0; index < numberPart; index++) {
      const presigned = await this.minioService.getMultipartPresignedURL(
        uploadId,
        objectName,
        index + 1,
      );
      listPresignedURL.push({
        link: presigned,
        part: index + 1,
      });
    }

    return listPresignedURL;
  }

  async generatePresignedURL(
    userId: string,
    objectName: string,
  ): Promise<string> {
    return this.minioService.getPresignedURL(`${userId}_${objectName}`);
  }
}
