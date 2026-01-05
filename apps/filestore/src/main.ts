import { NestFactory } from '@nestjs/core';
import { FilestoreModule } from './filestore.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppConfigService } from './config/App.config.service';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(FilestoreModule);

  const config = app.get<AppConfigService>(AppConfigService);

  const port = config.app().port;
  const isEnableSwagger = config.swagger().enable;

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  if (isEnableSwagger) {
    const swaggerPath = config.swagger().path;
    const documentConfig = new DocumentBuilder()
      .setTitle('Filestore')
      .setDescription('Filestore')
      .build();
    const document = SwaggerModule.createDocument(app, documentConfig);
    SwaggerModule.setup(swaggerPath, app, document);
    logger.log(`Enable swagger at: /${swaggerPath}`);
  }

  await app.listen(port);
  logger.log(`Server running on ${port}`);
}
bootstrap();
