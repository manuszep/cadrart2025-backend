import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CadrartOfferService } from '../offer/offer.service';
import { CadrartOffer } from '../../entities/offer.entity';
import { CadrartTask } from '../../entities/task.entity';
import { CadrartJob } from '../../entities/job.entity';
import { MonitoringModule } from '../../services/monitoring.module';

import { CadrartTaskController } from './task.controller';
import { CadrartTaskService } from './task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CadrartOffer]),
    TypeOrmModule.forFeature([CadrartTask]),
    TypeOrmModule.forFeature([CadrartJob]),
    MonitoringModule
  ],
  controllers: [CadrartTaskController],
  providers: [CadrartOfferService, CadrartTaskService]
})
export class CadrartTaskModule {}
