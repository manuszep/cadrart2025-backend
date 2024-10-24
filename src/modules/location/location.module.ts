import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CadrartLocation } from '../../entities/location.entity';

import { CadrartLocationService } from './location.service';
import { CadrartLocationController } from './location.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CadrartLocation])],
  controllers: [CadrartLocationController],
  providers: [CadrartLocationService]
})
export class CadrartLocationModule {}
