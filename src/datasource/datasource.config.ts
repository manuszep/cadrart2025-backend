import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CadrartTypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('CADRART_DB_HOST'),
      port: +this.configService.get<number>('CADRART_DB_PORT'),
      username: this.configService.get<string>('CADRART_DB_USERNAME'),
      password: this.configService.get<string>('CADRART_DB_PASSWORD'),
      database: this.configService.get<string>('CADRART_DB_DATABASE'),
      entities: [`${__dirname}/../**/**.entity{.ts,.js}`],
      synchronize: false,
    };
  }
}
