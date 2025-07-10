import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ECadrartOfferStatus } from '@manuszep/cadrart2025-common';

import { CadrartOffer } from '../entities/offer.entity';
import { CadrartTask } from '../entities/task.entity';
import { CadrartTeamMember } from '../entities/team-member.entity';
import { CadrartJob } from '../entities/job.entity';

interface IBusinessMetrics {
  activeOffers: number;
  completedOffers: number;
  activeInvoices: number;
  pendingTasks: number;
  completedTasks: number;
  activeUsers: number;
  fileUploads: number;
  activeJobs: number;
  completedJobs: number;
}

interface IOfferMetrics {
  total: number;
  active: number;
  completed: number;
  totalValue: number;
}

interface ITaskMetrics {
  total: number;
  pending: number;
  completed: number;
  overdue: number;
}

@Injectable()
export class BusinessMetricsService {
  private readonly logger = new Logger('BusinessMetrics');

  constructor(
    @InjectRepository(CadrartOffer) private offerRepo: Repository<CadrartOffer>,
    @InjectRepository(CadrartTask) private taskRepo: Repository<CadrartTask>,
    @InjectRepository(CadrartTeamMember) private teamMemberRepo: Repository<CadrartTeamMember>,
    @InjectRepository(CadrartJob) private jobRepo: Repository<CadrartJob>
  ) {}

  async getBusinessMetrics(): Promise<IBusinessMetrics> {
    try {
      const [activeOffers, completedOffers, pendingTasks, completedTasks, activeUsers, activeJobs, completedJobs] =
        await Promise.all([
          this.offerRepo.count({ where: { status: ECadrartOfferStatus.STATUS_CREATED } }),
          this.offerRepo.count({ where: { status: ECadrartOfferStatus.STATUS_DONE } }),
          this.taskRepo.count({ where: { doneCount: 0 } }),
          this.taskRepo.count({ where: { doneCount: 1 } }),
          this.teamMemberRepo.count(),
          this.jobRepo.count(),
          this.jobRepo.count()
        ]);

      // For file uploads, we'll need to implement a file tracking system
      // For now, we'll use a placeholder
      const fileUploads = 0;

      // Since there's no Invoice entity, we'll use a placeholder
      const activeInvoices = 0;

      return {
        activeOffers,
        completedOffers,
        activeInvoices,
        pendingTasks,
        completedTasks,
        activeUsers,
        fileUploads,
        activeJobs,
        completedJobs
      };
    } catch (error) {
      this.logger.error('Failed to get business metrics', error);
      return {
        activeOffers: 0,
        completedOffers: 0,
        activeInvoices: 0,
        pendingTasks: 0,
        completedTasks: 0,
        activeUsers: 0,
        fileUploads: 0,
        activeJobs: 0,
        completedJobs: 0
      };
    }
  }

  async getOfferMetrics(): Promise<IOfferMetrics> {
    try {
      const [totalOffers, activeOffers, completedOffers, totalValue] = await Promise.all([
        this.offerRepo.count(),
        this.offerRepo.count({ where: { status: ECadrartOfferStatus.STATUS_CREATED } }),
        this.offerRepo.count({ where: { status: ECadrartOfferStatus.STATUS_DONE } }),
        this.offerRepo
          .createQueryBuilder('offer')
          .select('SUM(offer.total)', 'total')
          .where('offer.status = :status', { status: ECadrartOfferStatus.STATUS_DONE })
          .getRawOne()
      ]);

      return {
        total: totalOffers,
        active: activeOffers,
        completed: completedOffers,
        totalValue: totalValue?.total || 0
      };
    } catch (error) {
      this.logger.error('Failed to get offer metrics', error);
      return {
        total: 0,
        active: 0,
        completed: 0,
        totalValue: 0
      };
    }
  }

  async getTaskMetrics(): Promise<ITaskMetrics> {
    try {
      const [totalTasks, pendingTasks, completedTasks, overdueTasks] = await Promise.all([
        this.taskRepo.count(),
        this.taskRepo.count({ where: { doneCount: 0 } }),
        this.taskRepo.count({ where: { doneCount: 1 } }),
        this.taskRepo.count({
          where: {
            doneCount: 0,
            job: {
              dueDate: new Date() // Tasks due today or before
            }
          }
        })
      ]);

      return {
        total: totalTasks,
        pending: pendingTasks,
        completed: completedTasks,
        overdue: overdueTasks
      };
    } catch (error) {
      this.logger.error('Failed to get task metrics', error);
      return {
        total: 0,
        pending: 0,
        completed: 0,
        overdue: 0
      };
    }
  }
}
