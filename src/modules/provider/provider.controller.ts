import { Controller, Get, Param, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import Fuse from 'fuse.js';
import { ICadrartEntitiesResponse } from '@manuszep/cadrart2025-common';

import { CadrartBaseController } from '../../base/base.controller';
import { CadrartProvider } from '../../entities/provider.entity';
import { CadrartSocketService } from '../../socket/socket.service';
import { CadrartJwtAuthGuard } from '../auth/jwt-auth.guard';

import { CadrartProviderService } from './provider.service';

@Controller('provider')
export class CadrartProviderController extends CadrartBaseController<CadrartProvider> {
  constructor(
    private readonly providerService: CadrartProviderService,
    private readonly localSocket: CadrartSocketService
  ) {
    super(providerService, localSocket);
  }

  override getLabelForOption(entity: CadrartProvider): string {
    return entity.name;
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Get('search/:name?')
  async searchByName(
    @Res() res: Response,
    @Param('name') name: string
  ): Promise<Response<ICadrartEntitiesResponse<CadrartProvider>>> {
    let entities: CadrartProvider[];

    if (name !== '' && typeof name !== 'undefined') {
      const r = await this.providerService.findAll();
      const options = { shouldSort: true, keys: ['name'] };
      const fuse = new Fuse(r.entities, options);

      entities = (fuse.search(name) as { item: CadrartProvider }[]).map((entry: { item: CadrartProvider }) => {
        return entry.item;
      });

      entities.filter((entity: CadrartProvider) => {
        return entity.name;
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
