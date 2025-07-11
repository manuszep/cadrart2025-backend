import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CadrartOffer } from '../entities/offer.entity';
import { CadrartTask } from '../entities/task.entity';
import { CadrartTeamMember } from '../entities/team-member.entity';
import { CadrartJob } from '../entities/job.entity';

import { MonitoringService } from './monitoring.service';
import { DatabaseMetricsService } from './database-metrics.service';
import { BusinessMetricsService } from './business-metrics.service';

@Module({
  imports: [TypeOrmModule.forFeature([CadrartOffer, CadrartTask, CadrartTeamMember, CadrartJob])],
  providers: [MonitoringService, DatabaseMetricsService, BusinessMetricsService],
  exports: [MonitoringService, DatabaseMetricsService, BusinessMetricsService]
})
export class MonitoringModule {}
