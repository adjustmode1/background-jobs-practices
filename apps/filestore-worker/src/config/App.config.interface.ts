export interface DatabaseConfigInterface {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface RabbitMQConfigInterface {
  host: string;
  port: number;
  username: string;
  password: string;
}

export interface MinioConfigInterface {
  endpoint: string;
  region: string;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
}

export interface StorageConfigInterface {
  bucket: string;
  tempBucket: string;
}

export interface storageSettingsInterface {
  maxChunks: number;
  maxChunkSize: number;
  maxInitChunk: number;
}
