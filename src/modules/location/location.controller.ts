import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import Fuse from 'fuse.js';
import { ICadrartEntitiesResponse } from '@manuszep/cadrart2025-common';

import { CadrartBaseController } from '../../base/base.controller';
import { CadrartLocation } from '../../entities/location.entity';
import { CadrartSocketService } from '../../socket/socket.service';
import { CadrartJwtAuthGuard } from '../auth/jwt-auth.guard';

import { CadrartLocationService } from './location.service';

@Controller('location')
export class CadrartLocationController extends CadrartBaseController<CadrartLocation> {
  constructor(
    private readonly locationService: CadrartLocationService,
    private readonly localSocket: CadrartSocketService,
  ) {
    super(locationService, localSocket);
  }

  override getLabelForOption(entity: CadrartLocation): string {
    return entity.name;
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Get('search/:name?')
  async search(
    @Res() res: Response,
    @Param('name') name: string,
  ): Promise<Response<ICadrartEntitiesResponse<CadrartLocation>>> {
    let entities: CadrartLocation[];

    if (name !== '' && typeof name !== 'undefined') {
      const r = await this.locationService.findAll();
      const options = { shouldSort: true, keys: ['name'], threshold: 0.3 };
      const fuse = new Fuse(r.entities, options);

      entities = (fuse.search(name) as { item: CadrartLocation }[]).map(
        (entry: { item: CadrartLocation }) => {
          return entry.item;
        },
      );

      entities.filter((entity: CadrartLocation) => {
        return entity.name;
      });
    } else {
      entities = [];
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      entities,
    });
  }
}
