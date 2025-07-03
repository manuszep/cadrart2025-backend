import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import helmet from 'helmet';

import { CadrartVersionModule } from '../src/modules/version/version.module';

describe('Helmet Security Headers (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), CadrartVersionModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(
      helmet({
        frameguard: { action: 'deny' },
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", 'wss:', 'ws:'],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
          }
        },
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' }
      })
    );
    app.use(helmet.xssFilter());
    app.enableCors({
      origin: ['http://localhost:4200'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    });
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should include security headers', () => {
    return request(app.getHttpServer())
      .get('/api/version')
      .expect(200)
      .expect((res) => {
        // Check for essential security headers
        expect(res.headers).toHaveProperty('x-frame-options');
        expect(res.headers).toHaveProperty('x-content-type-options');
        expect(res.headers).toHaveProperty('x-xss-protection');
        expect(res.headers).toHaveProperty('strict-transport-security');
        expect(res.headers).toHaveProperty('content-security-policy');

        // Verify specific header values
        expect(res.headers['x-frame-options']).toBe('DENY');
        expect(res.headers['x-content-type-options']).toBe('nosniff');
        expect(res.headers['x-xss-protection']).toBe('0');
      });
  });

  it('should have proper CORS headers', () => {
    return request(app.getHttpServer())
      .options('/api/version')
      .set('Origin', 'http://localhost:4200')
      .expect(204)
      .expect((res) => {
        expect(res.headers).toHaveProperty('access-control-allow-origin');
        expect(res.headers['access-control-allow-origin']).toBe('http://localhost:4200');
      });
  });
});
