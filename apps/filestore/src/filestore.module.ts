import { Module } from '@nestjs/common';
import { FilestoreController } from './filestore.controller';
import { FilestoreService } from './filestore.service';
import { ConfigModule } from '@nestjs/config';
import { loadConfig } from '@app/common/configuration/load-configuration';
import { GlobalConfigSchema } from './config/App.config.schema';
import { AppConfigService } from './config/App.config.service';
import { MinioModule } from './minio/minio.module';
import { AppConfigModule } from './config/App.config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './redis/redis.module';
import { FileEntity } from '@app/common/database/entites/file.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => loadConfig(GlobalConfigSchema)],
    }),
    TypeOrmModule.forFeature([FileEntity]),
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        type: 'postgres',
        host: config.database().host,
        port: config.database().port,
        username: config.database().username,
        password: config.database().password,
        database: config.database().database,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    RedisModule,
    AppConfigModule,
    MinioModule,
  ],
  controllers: [FilestoreController],
  providers: [FilestoreService, AppConfigService],
  exports: [AppConfigService],
})
export class FilestoreModule {}
