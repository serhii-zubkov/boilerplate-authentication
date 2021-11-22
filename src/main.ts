import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigurationService } from 'modules/common/config/config.service';
import { LoggerService } from 'modules/common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService('Nest'),
  });

  const config = app.get<ConfigurationService>(ConfigurationService);

  app.setGlobalPrefix(config.get('prefix'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const swaggerConf = config.get<{
    path: string;
    title: string;
    description: string;
    version: string;
    tags: string[];
  }>('swagger');
  let swaggerBuilder = new DocumentBuilder()
    .setTitle(swaggerConf.title)
    .setDescription(swaggerConf.description)
    .setVersion(swaggerConf.version)
    .addBearerAuth();

  swaggerConf.tags.forEach((tag) => {
    swaggerBuilder = swaggerBuilder.addTag(tag);
  });
  const document = SwaggerModule.createDocument(app, swaggerBuilder.build());
  SwaggerModule.setup(swaggerConf.path, app, document);

  await app.listen(3000);
}
bootstrap();
