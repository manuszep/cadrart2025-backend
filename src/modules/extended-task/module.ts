import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CadrartExtendedTask } from '../../entities/extended-task.entity';
import { CadrartTask } from '../../entities/task.entity';
import { CadrartJob } from '../../entities/job.entity';
import { MonitoringModule } from '../../services/monitoring.module';
import { CadrartArticleModule } from '../article/article.module';
import { CadrartOfferModule } from '../offer/offer.module';

import { CadrartExtendedTaskController } from './controller';
import { CadrartExtendedTaskService } from './service';


@Module({
  imports: [
    TypeOrmModule.forFeature([CadrartExtendedTask, CadrartTask, CadrartJob]),
    CadrartArticleModule,
    CadrartOfferModule,
    MonitoringModule
  ],
  controllers: [CadrartExtendedTaskController],
  providers: [CadrartExtendedTaskService]
})
export class CadrartExtendedTaskModule {}
