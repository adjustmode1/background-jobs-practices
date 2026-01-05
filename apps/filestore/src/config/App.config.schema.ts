import { z } from 'zod';

export const AppSchema = z.object({
  port: z.number(),
  name: z.string(),
});

export const DatabaseSchema = z.object({
  host: z.string(),
  port: z.number(),
  username: z.string(),
  password: z.string(),
  database: z.string(),
});

export const RabbitMQSchema = z.object({
  host: z.string(),
  port: z.number(),
  username: z.string(),
  password: z.string(),
});

export const MinioSchema = z.object({
  endpoint: z.string(),
  region: z.string(),
  useSSL: z.boolean(),
  accessKey: z.string(),
  secretKey: z.string(),
});

export const StorageSchema = z.object({
  bucket: z.string(),
  tempBucket: z.string(),
});

export const SwaggerSchema = z.object({
  enable: z.boolean(),
  path: z.string(),
});

export const StorageSettingSchema = z.object({
  maxChunks: z.number(),
  maxChunkSize: z.number(),
  maxInitChunk: z.number(),
});

export const GlobalConfigSchema = z.object({
  app: AppSchema,
  database: DatabaseSchema,
  rabbitmq: RabbitMQSchema,
  minio: MinioSchema,
  storage: StorageSchema,
  swagger: SwaggerSchema,
  storageSetting: StorageSettingSchema,
});

export type AppConfig = z.infer<typeof GlobalConfigSchema>;
