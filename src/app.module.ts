import { Module } from '@nestjs/common';
import { CadrartAppController } from './app.controller';
import { CadrartTypeOrmModule } from './datasource/typeorm.module';

@Module({
  imports: [CadrartTypeOrmModule],
  controllers: [CadrartAppController],
  providers: [],
})
export class CadrartAppModule {}
