import { Injectable } from '@nestjs/common';
import { MinioService } from './minio/minio.service';
import { AppConfigService } from './config/App.config.service';
import { InitUploadRo } from './ro/init-upload.ro';
import { nanoid } from 'nanoid';

@Injectable()
export class FilestoreService {
  private readonly maxChunks: number;
  private readonly maxChunkSize: number;
  private readonly maxInitChunk: number;

  constructor(
    private readonly appConfig: AppConfigService,
    private readonly minioService: MinioService,
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
    const fileId = nanoid();

    if (fileSize >= this.maxChunkSize) {
      const numberParts = Math.ceil(fileSize / this.maxChunkSize);
      const shouldCreatedParts = Math.min(numberParts, this.maxInitChunk);
      const chunks = await this.generateMultipartPresigned(
        userId,
        fileId,
        shouldCreatedParts,
      );

      // TODO: add to database
      console.log('Upload multipart file ', filename);

      return {
        data: chunks,
        nextStep: 'UPLOAD_CHUNK',
      };
    } else {
      // TODO: add to database
      console.log('Upload file ', filename);

      return {
        data: [await this.generatePresignedURL(userId, fileId)],
        nextStep: 'UPLOAD_FILE',
      };
    }
  }

  async completeMultipartUpload(
    userId: string,
    uploadId: string,
    objectName: string,
  ) {
    return this.minioService.completeUploadParts(uploadId, objectName);
  }

  async listParts(
    uploadId: string,
  ) {
    return ['']
  }

  async generateMultipartPresigned(
    userId: string,
    objectName: string,
    numberPart: number,
  ): Promise<Array<string>> {
    const listPresignedURL: Array<Promise<string>> = [];

    for (let index = 0; index < numberPart; index++) {
      listPresignedURL.push(
        this.minioService.getPresignedURL(`${userId}_${objectName}_${index}`),
      );
    }
    return Promise.all(listPresignedURL);
  }

  async generatePresignedURL(
    userId: string,
    objectName: string,
  ): Promise<string> {
    return this.minioService.getPresignedURL(`${userId}_${objectName}`);
  }
}
