import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  PutObjectCommand,
  S3Client,
  ListPartsCommand,
  CompleteMultipartUploadCommand,
  UploadPartCommand,
  CreateMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import { AppConfigService } from '../config/App.config.service';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { CreateMultipartUploadOutput } from '@aws-sdk/client-s3/dist-types/models/models_0';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private client!: S3Client;
  private bucket: string;
  private tempBucket: string;

  constructor(private readonly appConfig: AppConfigService) {
    this.bucket = appConfig.storage().bucket;
    this.tempBucket = appConfig.storage().tempBucket;
  }

  onModuleInit() {
    const minioConfig = this.appConfig.minio();
    this.client = new S3Client({
      region: minioConfig.region,
      endpoint: minioConfig.endpoint,
      credentials: {
        accessKeyId: minioConfig.accessKey,
        secretAccessKey: minioConfig.secretKey,
      },
      forcePathStyle: true,
    });
  }

  createMultiPartUpload(
    objectName: string,
  ): Promise<CreateMultipartUploadOutput> {
    this.logger.verbose('.createMultiPartUpload', {
      bucket: this.tempBucket,
      objectName,
    });
    return this.client.send(
      new CreateMultipartUploadCommand({
        Bucket: this.tempBucket,
        Key: objectName,
      }),
    );
  }

  getPresignedURL(objectName: string): Promise<string> {
    return getSignedUrl(
      this.client,
      new PutObjectCommand({
        Bucket: this.tempBucket,
        Key: objectName,
      }),
    );
  }

  getMultipartPresignedURL(
    uploadId: string,
    objectName: string,
    partNumber: number,
  ): Promise<string> {
    return getSignedUrl(
      this.client,
      new UploadPartCommand({
        UploadId: uploadId,
        Bucket: this.tempBucket,
        Key: objectName,
        PartNumber: partNumber,
      }),
    );
  }

  completeUploadParts(uploadId: string, objectName: string, parts: Array<any>) {
    return this.client.send(
      new CompleteMultipartUploadCommand({
        Bucket: this.tempBucket,
        Key: objectName,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: parts,
        },
      }),
    );
  }

  listUploadedParts(uploadId: string, objectName: string) {
    return this.client.send(
      new ListPartsCommand({
        Bucket: this.tempBucket,
        UploadId: uploadId,
        Key: objectName,
      }),
    );
  }
}
