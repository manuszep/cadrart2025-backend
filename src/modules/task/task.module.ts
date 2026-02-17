import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CadrartTask } from '../../entities/task.entity';
import { CadrartJob } from '../../entities/job.entity';
import { MonitoringModule } from '../../services/monitoring.module';
import { CadrartOfferModule } from '../offer/offer.module';

import { CadrartTaskService } from './task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CadrartTask]),
    TypeOrmModule.forFeature([CadrartJob]),
    CadrartOfferModule,
    MonitoringModule
  ],
  controllers: [],
  providers: [CadrartTaskService]
})
export class CadrartTaskModule {}
