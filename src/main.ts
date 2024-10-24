import { NestFactory } from '@nestjs/core';
import { urlencoded, json } from 'express';
import cookieParser from 'cookie-parser';

import { CadrartAppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(CadrartAppModule, {
    cors: true,
    logger: console,
  });

  const config = app.get(ConfigService);

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());
  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
