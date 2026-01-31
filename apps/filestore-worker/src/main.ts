import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { FilestoreWorkerModule } from './filestore-worker.module';
import { AppConfigService } from './config/App.config.service';

async function bootstrap() {
  const app = await NestFactory.create(FilestoreWorkerModule);

  const configService = app.get(AppConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [],
      queue: '',
      queueOptions: {
        durable: true,
      },
      prefetchCount: 1,
      noAck: false,
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
