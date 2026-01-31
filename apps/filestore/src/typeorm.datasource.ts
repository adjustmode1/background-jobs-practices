import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { loadConfig } from '@app/common/configuration/load-configuration';
import { GlobalConfigSchema } from './config/App.config.schema';

const config = new ConfigService(loadConfig(GlobalConfigSchema));

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.getOrThrow('database.host'),
  port: Number(config.getOrThrow('database.port')),
  username: config.getOrThrow('database.username'),
  password: config.getOrThrow('database.password'),
  database: config.getOrThrow('database.database'),

  entities: [__dirname + '/entities/*.entity.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],

  synchronize: false,
});
