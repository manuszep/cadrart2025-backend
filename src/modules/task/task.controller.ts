import { Controller } from '@nestjs/common';

import { CadrartBaseController } from '../../base/base.controller';
import { CadrartExtendedTask } from '../../entities/extended-task.view.entity';
import { CadrartSocketService } from '../../socket/socket.service';

import { CadrartTaskService } from './task.service';

@Controller('task')
export class CadrartTaskController extends CadrartBaseController<CadrartExtendedTask> {
  constructor(private readonly taskService: CadrartTaskService, private readonly localSocket: CadrartSocketService) {
    super(taskService, localSocket);
  }

  override getLabelForOption(entity: CadrartExtendedTask): string {
    return entity.articleName;
  }
}
