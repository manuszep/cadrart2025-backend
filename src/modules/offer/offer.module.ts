import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CadrartOffer } from '../../entities/offer.entity';

import { CadrartOfferService } from './offer.service';
import { CadrartOfferController } from './offer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CadrartOffer])],
  controllers: [CadrartOfferController],
  providers: [CadrartOfferService]
})
export class CadrartOfferModule {}
