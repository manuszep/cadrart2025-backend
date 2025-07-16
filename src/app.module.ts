import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { DataSourceOptions } from 'typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { throttlerConfig } from './config/throttler.config';
import { CadrartSocketModule } from './socket/socket.module';
import {
  CadrartArticleModule,
  CadrartClientModule,
  CadrartFormulaModule,
  CadrartJobModule,
  CadrartLocationModule,
  CadrartOfferModule,
  CadrartProviderModule,
  CadrartTagModule,
  CadrartTaskModule,
  CadrartTeamMemberModule,
  CadrartVersionModule
} from './modules';
import { CadrartFileModule } from './modules/file/file.module';
import { CadrartAuthModule } from './modules/auth/auth.module';
import { HttpsRedirectMiddleware } from './middleware/https-redirect.middleware';
import { SecurityMiddleware } from './middleware/security.middleware';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { HealthController } from './controllers/health.controller';
import { MetricsController } from './controllers/metrics.controller';
import { TestModule } from './controllers/test.module';
import { MonitoringModule } from './services/monitoring.module';
import { ErrorLoggingInterceptor } from './interceptors/error-logging.interceptor';
import { MetricsAuthGuard } from './guards/metrics-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRoot(throttlerConfig),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const config: DataSourceOptions = {
          type: 'mysql',
          host: `${configService.get('CADRART_DB_HOST')}`,
          port: configService.get('CADRART_DB_PORT'),
          username: `${configService.get('CADRART_DB_USERNAME')}`,
          password: `${configService.get('CADRART_DB_PASSWORD')}`,
          database: `${configService.get('CADRART_DB_DATABASE')}`,
          entities: [`${__dirname}/entities/**.entity{.ts,.js}`],
          migrations: [`${__dirname}/migrations/*{.ts,.js}`],
          synchronize: false
        };

        return config;
      }
    }),
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          serveRoot: '/static',
          rootPath: configService.get<string>('STATIC_ROOT'),
          serveStaticOptions: {
            index: false
          }
        }
      ]
    }),
    MulterModule.register({
      storage: memoryStorage()
    }),
    JwtModule.register({}),
    MonitoringModule,
    CadrartSocketModule,
    CadrartArticleModule,
    CadrartClientModule,
    CadrartFileModule,
    CadrartFormulaModule,
    CadrartJobModule,
    CadrartLocationModule,
    CadrartOfferModule,
    CadrartProviderModule,
    CadrartTagModule,
    CadrartTaskModule,
    CadrartTeamMemberModule,
    CadrartAuthModule,
    CadrartVersionModule,
    TestModule
  ],
  controllers: [HealthController, MetricsController],
  providers: [
    MetricsAuthGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorLoggingInterceptor
    }
  ]
})
export class CadrartAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware, SecurityMiddleware, HttpsRedirectMiddleware).forRoutes('/');
  }
}
