import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CadrartBaseService, ICadrartBaseServiceFindParam } from '../../base/base.service';
import { CadrartTask } from '../../entities/task.entity';
import { CadrartJob } from '../../entities/job.entity';

@Injectable()
export class CadrartTaskService extends CadrartBaseService<CadrartTask> {
  entityName = 'Task';

  constructor(
    @InjectRepository(CadrartTask) private tasksRepository: Repository<CadrartTask>,
    @InjectRepository(CadrartJob) private jobsRepository: Repository<CadrartJob>
  ) {
    super(tasksRepository);
  }

  getSearchConfig(needle: string): ICadrartBaseServiceFindParam<CadrartTask> {
    if (!needle) {
      return [];
    }

    const pattern = `%${needle}%`;

    return [{ article: Like(pattern) }];
  }

  async doTask(id: number): Promise<CadrartTask> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['job']
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const job = await this.jobsRepository.findOne({ where: { id: task.job.id } });

    if (task.doneCount === job.count) {
      throw new BadRequestException('Task already done');
    }

    await this.tasksRepository.update(id, { doneCount: task.doneCount + 1 });

    // Return the updated task
    return this.tasksRepository.findOne({
      where: { id },
      relations: ['job']
    });
  }

  async undoTask(id: number): Promise<CadrartTask> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['job']
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.doneCount < 1) {
      throw new BadRequestException('Task not started');
    }

    await this.tasksRepository.update(id, { doneCount: task.doneCount - 1 });

    // Return the updated task
    return this.tasksRepository.findOne({
      where: { id },
      relations: ['job']
    });
  }

  async blockTask(id: number): Promise<CadrartTask> {
    throw new NotFoundException(`Task ${id} - blockTask not implemented yet`);
  }
}
