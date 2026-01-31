import { Module } from '@nestjs/common';
import { FilestoreWorkerController } from './filestore-worker.controller';
import { FilestoreWorkerService } from './filestore-worker.service';
import { ConfigModule } from '@nestjs/config';
import { loadConfig } from '@app/common/configuration/load-configuration';
import { GlobalConfigSchema } from './config/App.config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => loadConfig(GlobalConfigSchema)],
    }),
  ],
  controllers: [FilestoreWorkerController],
  providers: [FilestoreWorkerService],
})
export class FilestoreWorkerModule {}
