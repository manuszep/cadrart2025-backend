import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.get('CADRART_DB_HOST'),
  port: configService.get('CADRART_DB_PORT'),
  username: `${configService.get('CADRART_DB_USERNAME')}`,
  password: `${configService.get('CADRART_DB_PASSWORD')}`,
  database: `${configService.get('CADRART_DB_DATABASE')}`,
  entities: [`${__dirname}/entities/**.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  synchronize: false,
});
