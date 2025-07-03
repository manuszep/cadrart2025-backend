import { NestFactory } from '@nestjs/core';
import { urlencoded, json } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

import { CadrartAppModule } from './app.module';
import { corsConfig } from './utils/cors.config';
import { getHelmetConfig } from './config/security.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(CadrartAppModule, {
    cors: corsConfig,
    logger: console
  });

  // Security headers with Helmet.js
  app.use(helmet(getHelmetConfig()));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}
bootstrap();
