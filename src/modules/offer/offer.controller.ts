import { Controller, Get, Param, Res, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { Response } from 'express';
import { ECadrartOfferStatus, ICadrartEntitiesResponse } from '@manuszep/cadrart2025-common';

import { CadrartBaseController } from '../../base/base.controller';
import { CadrartOffer } from '../../entities/offer.entity';
import { CadrartJwtAuthGuard } from '../auth/jwt-auth.guard';

import { CadrartOfferService } from './offer.service';

@Controller('offer')
export class CadrartOfferController extends CadrartBaseController<CadrartOffer> {
  constructor(private readonly offerService: CadrartOfferService) {
    super(offerService);
  }

  override getLabelForOption(entity: CadrartOffer): string {
    return entity.number;
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Get()
  async findAll(
    @Res() res: Response,
    @Query()
    query: {
      page?: number;
      count?: number;
      createdAtLt?: string;
      createdAtGt?: string;
      status?: ECadrartOfferStatus;
    }
  ): Promise<Response<ICadrartEntitiesResponse<CadrartOffer>>> {
    const result = await this.offerService.findAll(
      query.page,
      query.count,
      query.createdAtLt,
      query.createdAtGt,
      query.status
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      entities: result.entities,
      total: result.total
    });
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Get('open')
  async findAllOpen(@Res() res: Response): Promise<Response<ICadrartEntitiesResponse<CadrartOffer>>> {
    const entities = await this.offerService.findAllOpen();

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      entities
    });
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Get('client/:id')
  async findAllByClient(
    @Res() res: Response,
    @Param('id') id: number
  ): Promise<Response<ICadrartEntitiesResponse<CadrartOffer>>> {
    const entities = await this.offerService.findAllByClient(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      entities
    });
  }
}
