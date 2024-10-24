import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ICadrartEntitiesResponse } from '@manuszep/cadrart2025-common';

import { CadrartBaseController } from '../../base/base.controller';
import { CadrartArticle } from '../../entities/article.entity';
import { CadrartSocketService } from '../../socket/socket.service';
import { CadrartJwtAuthGuard } from '../auth/jwt-auth.guard';

import { CadrartArticleService } from './article.service';

@Controller('article')
export class CadrartArticleController extends CadrartBaseController<CadrartArticle> {
  constructor(
    private readonly articleService: CadrartArticleService,
    private readonly localSocket: CadrartSocketService,
  ) {
    super(articleService, localSocket);
  }

  override getLabelForOption(entity: CadrartArticle): string {
    return entity.name;
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Get('combinable')
  async getCombinable(
    @Res() res: Response,
  ): Promise<Response<ICadrartEntitiesResponse<CadrartArticle>>> {
    const entities = await this.articleService.findCombinable();

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      entities,
    });
  }
}
