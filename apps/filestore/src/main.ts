import { NestFactory } from '@nestjs/core';
import { FilestoreModule } from './filestore.module';

async function bootstrap() {
  const app = await NestFactory.create(FilestoreModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
