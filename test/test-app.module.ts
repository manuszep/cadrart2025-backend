import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { DataSourceOptions } from 'typeorm';

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
} from '../src/modules';
import { CadrartFileModule } from '../src/modules/file/file.module';
import { CadrartAuthModule } from '../src/modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
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
          entities: [`${__dirname}/../src/entities/**.entity{.ts,.js}`],
          migrations: [`${__dirname}/../src/migrations/*{.ts,.js}`],
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
    // Exclude WebSocket module for tests to avoid port conflicts
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
export class TestAppModule {}
