import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  PutObjectCommand,
  S3Client,
  ListPartsCommand,
  CompleteMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import { AppConfigService } from '../config/App.config.service';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private client!: S3Client;
  private bucket: string;
  private bucketTemp: string;

  constructor(private readonly appConfig: AppConfigService) {
    this.bucket = appConfig.storage().bucket;
    this.bucketTemp = appConfig.storage().bucketTemp;
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

  getPresignedURL(objectName: string): Promise<string> {
    return getSignedUrl(
      this.client,
      new PutObjectCommand({
        Bucket: this.bucketTemp,
        Key: objectName,
      }),
    );
  }

  completeUploadParts(uploadId: string, objectName: string) {
    return this.client.send(
      new CompleteMultipartUploadCommand({
        Bucket: this.bucketTemp,
        Key: objectName,
        UploadId: uploadId,
      }),
    );
  }

  listUploadedParts(uploadId: string, objectName: string) {
    return this.client.send(
      new ListPartsCommand({
        Bucket: this.bucketTemp,
        UploadId: uploadId,
        Key: objectName,
      }),
    );
  }
}
