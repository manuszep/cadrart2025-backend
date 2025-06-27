import { Controller, Get, HttpStatus, Param, Put, Res, UseGuards, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { ECadrartArticleFamily, ICadrartEntitiesResponse, ICadrartExtendedTask } from '@manuszep/cadrart2025-common';

import { CadrartSocketService } from '../../socket/socket.service';
import { CadrartJwtAuthGuard } from '../auth/jwt-auth.guard';
import { CadrartOfferService } from '../offer/offer.service';

import { extractTasksFromOffers } from './task.mapper';
import { CadrartTaskService } from './task.service';

const familyRouteMapping = {
  assembly: ECadrartArticleFamily.ASSEMBLY,
  cardboard: ECadrartArticleFamily.CARDBOARD,
  glass: ECadrartArticleFamily.GLASS,
  pass: ECadrartArticleFamily.PASS,
  wood: ECadrartArticleFamily.WOOD
};

@Controller('task')
export class CadrartTaskController {
  constructor(
    private readonly socket: CadrartSocketService,
    private readonly offerService: CadrartOfferService,
    private readonly tasksService: CadrartTaskService
  ) {}

  getLabelForOption(entity: ICadrartExtendedTask): string {
    return entity.articleName;
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
      entities: extractTasksFromOffers(familyRouteMapping[family], result)
    });
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Put('/:id/do')
  async doTask(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number
  ): Promise<Response<{ statusCode: number; result: unknown }>> {
    const result = await this.tasksService.doTask(id);

    this.socket.socket?.emit('update', {
      name: this.tasksService.entityName,
      entity: { id }
    });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      result
    });
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Put('/:id/undo')
  async undoTask(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number
  ): Promise<Response<{ statusCode: number; result: unknown }>> {
    const result = await this.tasksService.undoTask(id);

    this.socket.socket?.emit('update', {
      name: this.tasksService.entityName,
      entity: { id }
    });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      result
    });
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Put('/:id/block')
  async blockTask(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number
  ): Promise<Response<{ statusCode: number; result: unknown }>> {
    const result = await this.tasksService.blockTask(id);

    this.socket.socket?.emit('update', {
      name: this.tasksService.entityName,
      entity: { id }
    });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      result
    });
  }
}
