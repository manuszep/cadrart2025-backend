import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CadrartJob } from '../../entities/job.entity';

import { CadrartJobService } from './job.service';

@Module({
  imports: [TypeOrmModule.forFeature([CadrartJob])],
  controllers: [],
  providers: [CadrartJobService]
})
export class CadrartJobModule {}
