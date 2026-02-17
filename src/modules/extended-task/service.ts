import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { In, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ECadrartArticleFamily, ICadrartExtendedTask } from '@manuszep/cadrart2025-common';

import { CadrartBaseService, ICadrartBaseServiceFindParam } from '../../base/base.service';
import { CadrartTask } from '../../entities/task.entity';
import { MonitoringService } from '../../services/monitoring.service';
import { CadrartSocketService } from '../../socket/socket.service';
import { CadrartExtendedTask } from '../../entities/extended-task.entity';
import { CadrartJob } from '../../entities/job.entity';
import { CadrartOfferService } from '../offer/offer.service';
import { CadrartArticleService } from '../article/article.service';

@Injectable()
export class CadrartExtendedTaskService extends CadrartBaseService<CadrartExtendedTask> {
  entityName = 'ExtendedTask';

  constructor(
    @InjectRepository(CadrartExtendedTask) protected repository: Repository<CadrartExtendedTask>,
    @InjectRepository(CadrartTask) private taskRepository: Repository<CadrartTask>,
    @InjectRepository(CadrartJob) private jobRepository: Repository<CadrartJob>,
    private readonly articleService: CadrartArticleService,
    private readonly offerService: CadrartOfferService,
    private monitoringService: MonitoringService,
    protected readonly socket: CadrartSocketService
  ) {
    super(repository, socket);
  }

  async findByFamily(family: ECadrartArticleFamily): Promise<ICadrartExtendedTask[]> {
    const familyTasks = await this.repository.find({
      where: { articleFamily: family }
    });

    if (familyTasks.length === 0) {
      return [];
    }

    // Collect all jobIds and parentIds to fetch related tasks
    const jobIds = [...new Set(familyTasks.map((t) => t.jobId))];
    const parentIds = [...new Set(familyTasks.map((t) => t.parentId).filter((id) => id !== null))];

    // Fetch all tasks for these jobs and all parent tasks
    const allRelatedTasks = await this.repository.find({
      where: [
        { jobId: In(jobIds) },
        { id: In(parentIds) }
      ]
    });

    const taskMap = new Map<number, CadrartExtendedTask>();
    allRelatedTasks.forEach((t) => taskMap.set(t.id, t));

    // Map to ICadrartExtendedTask structure
    return familyTasks.map((task) => {
      const jobTasks = allRelatedTasks
        .filter((t) => t.jobId === task.jobId)
        .map((t) => this.mapToInterface(t));

      const parentTask = task.parentId ? taskMap.get(task.parentId) : null;

      return {
        ...this.mapToInterface(task),
        jobTasks,
        parent: parentTask ? this.mapToInterface(parentTask) : null
      };
    });
  }

  private mapToInterface(task: CadrartExtendedTask): ICadrartExtendedTask {
    const { parentId, ...rest } = task;
    return {
      ...rest,
      parent: parentId, // Default to ID, will be replaced by object if nested
      jobTasks: []
    } as unknown as ICadrartExtendedTask;
  }

  getSearchConfig(needle: string): ICadrartBaseServiceFindParam<CadrartExtendedTask> {
    if (!needle) {
      return [];
    }

    const pattern = `%${needle}%`;

    return [{ articleName: Like(pattern) }];
  }

  async doTask(id: number): Promise<number> {
    const task = await this.taskRepository.findOne({
      where: { id: id },
      relations: ['job']
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const job = await this.jobRepository.findOne({ where: { id: task.job.id } });

    if (task.doneCount === job.count) {
      throw new BadRequestException('Task already done');
    }

    await this.taskRepository.update(id, { doneCount: task.doneCount + 1 });

    // Check if task is now completed
    const updatedTask = await this.taskRepository.findOne({
      where: { id },
      relations: ['job', 'job.offer']
    });

    if (updatedTask.doneCount === job.count) {
      // Record task completion
      this.monitoringService.recordBusinessEvent('taskCompleted');

      await this.offerService.checkAndUpdateOfferStatus(updatedTask.job.offer);
    }

    this.socket.socket?.emit('update', {
      name: 'Task',
      entity: { id }
    });

    return id;
  }

  async undoTask(id: number): Promise<number> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['job', 'job.offer']
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.doneCount < 1) {
      throw new BadRequestException('Task not started');
    }

    await this.taskRepository.update(id, { doneCount: task.doneCount - 1 });

    await this.offerService.checkAndUpdateOfferStatus(task.job.offer);

    this.socket.socket?.emit('update', {
      name: 'Task',
      entity: { id }
    });

    return id;
  }

  async blockTask(id: number): Promise<number> {
    const task = await this.taskRepository.findOne({
      where: { id: id }
    });

    this.articleService.setOutOfStock(task.article.id);

    return id;
  }
}
