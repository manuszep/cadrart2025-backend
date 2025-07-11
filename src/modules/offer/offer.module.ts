import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CadrartOffer } from '../../entities/offer.entity';
import { MonitoringModule } from '../../services/monitoring.module';

import { CadrartOfferService } from './offer.service';
import { CadrartOfferController } from './offer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CadrartOffer]), MonitoringModule],
  controllers: [CadrartOfferController],
  providers: [CadrartOfferService]
})
export class CadrartOfferModule {}
