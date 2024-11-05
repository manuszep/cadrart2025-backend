import { Controller, Get, Param, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import Fuse from 'fuse.js';
import { ICadrartEntitiesResponse } from '@manuszep/cadrart2025-common';

import { CadrartBaseController } from '../../base/base.controller';
import { CadrartClient } from '../../entities/client.entity';
import { CadrartSocketService } from '../../socket/socket.service';
import { CadrartJwtAuthGuard } from '../auth/jwt-auth.guard';

import { CadrartClientService } from './client.service';

@Controller('client')
export class CadrartClientController extends CadrartBaseController<CadrartClient> {
  constructor(
    private readonly clientService: CadrartClientService,
    private readonly localSocket: CadrartSocketService
  ) {
    super(clientService, localSocket);
  }

  override getLabelForOption(entity: CadrartClient): string {
    return `${entity.firstName} ${entity.lastName}`;
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Get('search/:name?')
  async search(
    @Res() res: Response,
    @Param('name') name: string
  ): Promise<Response<ICadrartEntitiesResponse<CadrartClient>>> {
    let entities: CadrartClient[];

    if (name !== '' && typeof name !== 'undefined') {
      const r = await this.clientService.findAll();
      const options = {
        shouldSort: true,
        keys: ['fullName'],
        threshold: 0.3,
        getFn: (o: CadrartClient): string => `${o.firstName} ${o.lastName}`
      };
      const fuse = new Fuse(r.entities, options);

      entities = (fuse.search(name) as { item: CadrartClient }[]).map((entry: { item: CadrartClient }) => {
        return entry.item;
      });

      entities.filter((entity: CadrartClient) => {
        return `${entity.firstName} ${entity.lastName}`;
      });
    } else {
      entities = [];
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      entities
    });
  }
}
