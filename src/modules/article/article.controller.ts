import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ICadrartEntitiesResponse } from '@manuszep/cadrart2025-common';

import { CadrartBaseController } from '../../base/base.controller';
import { CadrartArticle } from '../../entities/article.entity';
import { CadrartJwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateArticleDto, UpdateArticleDto, ArticleQueryDto } from '../../dto/article.dto';

import { CadrartArticleService } from './article.service';

@Controller('article')
export class CadrartArticleController extends CadrartBaseController<
  CadrartArticle,
  CreateArticleDto,
  UpdateArticleDto,
  ArticleQueryDto
> {
  constructor(private readonly articleService: CadrartArticleService) {
    super(articleService);
  }

  override getLabelForOption(entity: CadrartArticle): string {
    return entity.name;
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Get('combinable')
  async getCombinable(@Res() res: Response): Promise<Response<ICadrartEntitiesResponse<CadrartArticle>>> {
    const entities = await this.articleService.findCombinable();

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      entities
    });
  }
}
