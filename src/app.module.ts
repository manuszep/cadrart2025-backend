import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { DataSourceOptions } from 'typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
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
    CadrartVersionModule
  ],
  controllers: [],
  providers: []
})
export class CadrartAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpsRedirectMiddleware).forRoutes('*');
  }
}
