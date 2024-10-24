import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CadrartTask } from '../../entities/task.entity';
import { CadrartExtendedTask } from '../../entities/extended-task.view.entity';

import { CadrartTaskService } from './task.service';
import { CadrartTaskController } from './task.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CadrartTask, CadrartExtendedTask])],
  controllers: [CadrartTaskController],
  providers: [CadrartTaskService]
})
export class CadrartTaskModule {}
