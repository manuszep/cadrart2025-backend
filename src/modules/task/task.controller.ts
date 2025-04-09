import { Controller, Get, HttpStatus, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import {
  ECadrartArticleFamily,
  ICadrartEntitiesResponse,
  ICadrartExtendedTask,
  ICadrartJob,
  ICadrartOffer,
  ICadrartTask
} from '@manuszep/cadrart2025-common';

import { CadrartBaseController } from '../../base/base.controller';
import { CadrartSocketService } from '../../socket/socket.service';
import { CadrartJwtAuthGuard } from '../auth/jwt-auth.guard';
import { CadrartOfferService } from '../offer/offer.service';

const familyRouteMapping = {
  assembly: ECadrartArticleFamily.ASSEMBLY,
  cardboard: ECadrartArticleFamily.CARDBOARD,
  glass: ECadrartArticleFamily.GLASS,
  pass: ECadrartArticleFamily.PASS,
  wood: ECadrartArticleFamily.WOOD
};

@Controller('task')
export class CadrartTaskController extends CadrartBaseController<any> {
  constructor(
    private readonly localSocket: CadrartSocketService,
    private readonly offerService: CadrartOfferService
  ) {
    super(offerService, localSocket);
  }

  override getLabelForOption(entity: ICadrartExtendedTask): string {
    return entity.articleName;
  }

  private mapTaskToExtendedTask(
    task: ICadrartTask,
    job: ICadrartJob,
    offer: ICadrartOffer,
    rawTasks?: ICadrartTask[],
    allowNesting = true
  ): ICadrartExtendedTask {
    const jobTasks =
      task.article.family !== ECadrartArticleFamily.ASSEMBLY || !allowNesting
        ? []
        : rawTasks.map((jobTask) => this.mapTaskToExtendedTask(jobTask, job, offer, rawTasks, false));

    return {
      id: task.id,
      taskComment: task.comment,
      taskTotal: task.total,
      taskImage: task.image,
      taskDoneCount: task.doneCount,
      parent: task.parent ? this.mapTaskToExtendedTask(task.parent, job, offer, rawTasks) : null,
      jobId: job.id,
      jobTasks: jobTasks,
      jobCount: job.count,
      jobOrientation: job.orientation,
      jobMeasure: job.measure,
      jobDueDate: job.dueDate,
      jobStartDate: job.startDate,
      jobOpeningWidth: job.openingWidth,
      jobOpeningHeight: job.openingHeight,
      jobMarginWidth: job.marginWidth,
      jobMarginHeight: job.marginHeight,
      jobGlassWidth: job.glassWidth,
      jobGlassHeight: job.glassHeight,
      jobDescription: job.description,
      jobImage: job.image,
      jobLocation: job.location?.name,
      articleId: task.article.id,
      articleName: task.article.name,
      articlePlace: task.article.place,
      articleFamily: task.article.family,
      offerId: offer.id,
      offerStatus: offer.status,
      assignedToId: offer.assignedTo.id,
      assignedToFirstName: offer.assignedTo.firstName,
      assignedToLastName: offer.assignedTo.lastName,
      clientId: offer.client.id,
      clientFirstName: offer.client.firstName,
      clientLastName: offer.client.lastName
    };
  }

  private extractTasksFromJob(offer: ICadrartOffer, job: ICadrartJob): ICadrartExtendedTask[] {
    const rawTasks: ICadrartTask[] = [];

    job.tasks.forEach((task: ICadrartTask) => {
      rawTasks.push(task);

      if (task.children) {
        task.children.forEach((child: ICadrartTask) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { children, ...parent } = task;

          rawTasks.push(Object.assign({ parent: parent }, child));
        });
      }
    });

    return rawTasks.map((task) => this.mapTaskToExtendedTask(task, job, offer, rawTasks));
  }

  private extractTasksFromOffer(offer: ICadrartOffer): ICadrartExtendedTask[] {
    let tasks: ICadrartExtendedTask[] = [];

    offer.jobs?.forEach((job) => {
      if (!job.tasks) {
        return;
      }

      const jobTasks = this.extractTasksFromJob(offer, job);

      tasks = [...tasks, ...jobTasks];
    });

    return tasks;
  }

  private extractTasksFromOffers(
    articleFamily: ECadrartArticleFamily,
    offers: ICadrartOffer[]
  ): ICadrartExtendedTask[] {
    let tasks: ICadrartExtendedTask[] = [];

    offers.forEach((offer) => {
      const offerTasks = this.extractTasksFromOffer(offer);

      tasks = [...tasks, ...offerTasks];
    });

    return tasks.filter((task) => task.articleFamily === articleFamily);
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Get('/:family')
  async findAllByFamily(
    @Res() res: Response,
    @Param('family') family: string
  ): Promise<Response<ICadrartEntitiesResponse<ICadrartExtendedTask>>> {
    if (Object.keys(familyRouteMapping).indexOf(family) === -1) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid article family'
      });
    }

    const result = await this.offerService.findAllStarted();

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      entities: this.extractTasksFromOffers(familyRouteMapping[family], result)
    });
  }
}
