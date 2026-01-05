import { Module } from '@nestjs/common';
import { FilestoreController } from './filestore.controller';
import { FilestoreService } from './filestore.service';
import { ConfigModule } from '@nestjs/config';
import { loadConfig } from '@app/common/configuration/load-configuration';
import { GlobalConfigSchema } from './config/App.config.schema';
import { AppConfigService } from './config/App.config.service';
import { MinioModule } from './minio/minio.module';
import { AppConfigModule } from './config/App.config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => loadConfig(GlobalConfigSchema)],
    }),
    AppConfigModule,
    MinioModule,
  ],
  controllers: [FilestoreController],
  providers: [FilestoreService, AppConfigService],
  exports: [AppConfigService],
})
export class FilestoreModule {}
