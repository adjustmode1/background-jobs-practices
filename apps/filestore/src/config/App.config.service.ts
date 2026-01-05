import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AppConfigInterface,
  DatabaseConfigInterface,
  MinioConfigInterface,
  RabbitMQConfigInterface,
  StorageConfigInterface,
  storageSettingsInterface,
  SwaggerConfigInterface,
} from './App.config.interface';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get<k>(key: string): k | undefined {
    return this.configService.get<k>(key);
  }

  getOrThrow<k>(key: string): unknown {
    return this.configService.getOrThrow<k>(key);
  }

  app(): AppConfigInterface {
    return this.configService.getOrThrow<AppConfigInterface>('app');
  }

  database(): DatabaseConfigInterface {
    return this.configService.getOrThrow<DatabaseConfigInterface>('database');
  }

  rabbitMQ(): RabbitMQConfigInterface {
    return this.configService.getOrThrow<RabbitMQConfigInterface>('rabbitmq');
  }

  minio(): MinioConfigInterface {
    return this.configService.getOrThrow<MinioConfigInterface>('minio');
  }

  storage(): StorageConfigInterface {
    return this.configService.getOrThrow<StorageConfigInterface>('storage');
  }

  storageSetting(): storageSettingsInterface {
    return this.configService.getOrThrow<storageSettingsInterface>(
      'storageSetting',
    );
  }

  swagger(): SwaggerConfigInterface {
    return this.configService.getOrThrow<SwaggerConfigInterface>('swagger');
  }
}
