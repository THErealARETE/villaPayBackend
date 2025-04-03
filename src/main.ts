import {
  BadRequestException,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from '@/app/app.module';
import { ENV_KEYS } from '@/common/constants';
import { ControllerResponse } from './common/entities';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port: number = configService.getOrThrow<number>(ENV_KEYS.APP_HTTP_PORT);

  const globalPrefix: string = configService.getOrThrow<string>(
    ENV_KEYS.APP_GLOBAL_PREFIX,
  );

  const versioningPrefix: string = configService.getOrThrow<string>(
    ENV_KEYS.APP_VERSIONING_PREFIX,
  );

  const version: string = configService.getOrThrow<string>(
    ENV_KEYS.APP_VERSIONING_VERSION,
  );

  const logger = new Logger();

  app.setGlobalPrefix(globalPrefix);

  //collection of smaller middleware functions that set security-related HTTP headers
  app.use(helmet());

  // ensure all endpoints are protected from receiving incorrect data
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => new BadRequestException(errors),
      whitelist: true,
      transform: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: version,
    prefix: versioningPrefix,
  });

  // documentation setup

  const config = new DocumentBuilder()
    .setTitle('Giveaway Villa API Docs')
    .setDescription('The Giveaway Villa API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
      },
      'Authorization',
    )
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      extraModels: [ControllerResponse],
    });
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(port);

  logger.log(`==========================================================`);

  logger.log(
    `🚀 Http Server running on ${await app.getUrl()}${globalPrefix}/${versioningPrefix}${version}`,
    'NestApplication',
  );

  logger.log(`==========================================================`);

  logger.log(`==========================================================`);

  logger.log(
    `🚀 Application Docs is running on ${await app.getUrl()}/docs`,
    'NestApplication',
  );

  logger.log(`==========================================================`);
}
bootstrap();
