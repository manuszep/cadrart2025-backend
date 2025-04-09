import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CadrartOfferService } from '../offer/offer.service';
import { CadrartOffer } from '../../entities/offer.entity';

import { CadrartTaskController } from './task.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CadrartOffer])],
  controllers: [CadrartTaskController],
  providers: [CadrartOfferService]
})
export class CadrartTaskModule {}
