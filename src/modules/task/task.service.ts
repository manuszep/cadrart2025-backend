import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { ECadrartOfferStatus } from '@manuszep/cadrart2025-common';

import { CadrartBaseService } from '../../base/base.service';
import { CadrartExtendedTask } from '../../entities/extended-task.view.entity';
import { CadrartTask } from '../../entities/task.entity';

@Injectable()
export class CadrartTaskService extends CadrartBaseService<CadrartExtendedTask> {
  entityName = 'Task';

  override findAllOptions: FindManyOptions<CadrartExtendedTask> = {
    where: {
      offerStatus: ECadrartOfferStatus.STATUS_STARTED
    },
    order: {
      jobDueDate: 'ASC'
    }
  };

  constructor(
    @InjectRepository(CadrartExtendedTask)
    private extendedTasksRepository: Repository<CadrartExtendedTask>,
    @InjectRepository(CadrartTask)
    private tasksRepository: Repository<CadrartTask>
  ) {
    super(extendedTasksRepository);
  }
}
