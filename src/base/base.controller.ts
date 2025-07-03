import { Body, Delete, Get, HttpStatus, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import {
  ICadrartEntitiesResponse,
  ICadrartEntityListOption,
  ICadrartEntityResponse,
  ICadrartListOption,
  ICadrartResponse
} from '@manuszep/cadrart2025-common';

import { CadrartSocketService } from '../socket/socket.service';
import { CadrartJwtAuthGuard } from '../modules/auth/jwt-auth.guard';

import { CadrartBaseService, ICadrartBaseEntity } from './base.service';

export class CadrartBaseController<
  T extends ICadrartBaseEntity,
  CreateDto = unknown,
  UpdateDto = unknown,
  QueryDto = Record<string, unknown>
> {
  constructor(
    private readonly service: CadrartBaseService<T>,
    private readonly socket: CadrartSocketService
  ) {}

  getLabelForOption(entity: T): string {
    return (entity as unknown as { name: string }).name;
  }

  convertEntitiesToOptions(entities: T[]): ICadrartListOption[] {
    return entities.map((entity: T) => {
      return {
        label: this.getLabelForOption(entity),
        value: (entity as unknown as { id: number }).id
      };
    });
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Post()
  async create(@Res() res: Response, @Body() body: CreateDto): Promise<Response<ICadrartEntityResponse<T>>> {
    const entity = await this.service.create(body);

    this.socket.socket?.emit('create', {
      name: this.service.entityName,
      entity
    });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      entity
    });
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Get()
  async findAll(@Res() res: Response, @Query() query: QueryDto): Promise<Response<ICadrartEntitiesResponse<T>>> {
    // Assume QueryDto has page, count, needle
    const { page, count, needle } = query as Record<string, unknown>;
    const result = await this.service.findAll(page as number, count as number, needle as string);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      entities: result.entities,
      total: result.total
    });
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Get('/asOptions')
  async findAllAsListOptions(
    @Res() res: Response
  ): Promise<Response<ICadrartEntitiesResponse<ICadrartEntityListOption>>> {
    const result = await this.service.findAll(1, 1000);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      entities: this.convertEntitiesToOptions(result.entities)
    });
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string): Promise<Response<ICadrartEntityResponse<T>>> {
    const entity = await this.service.findOne(id);

    if (!entity)
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: `ERROR_404_${this.service.entityName.toUpperCase()}_FIND_ONE`,
        entity: {}
      });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      entity
    });
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Put(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: UpdateDto
  ): Promise<Response<ICadrartEntityResponse<T>>> {
    const entity = await this.service.update(id, body);

    this.socket.socket?.emit('update', {
      name: this.service.entityName,
      entity
    });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      entity
    });
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string): Promise<Response<ICadrartResponse>> {
    try {
      await this.service.remove(id);
    } catch {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `ERROR.API.${this.service.entityName.toUpperCase()}.DELETE`
      });
    }

    this.socket.socket?.emit('delete', {
      name: this.service.entityName,
      id
    });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      id
    });
  }
}
