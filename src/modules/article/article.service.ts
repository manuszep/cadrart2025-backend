import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CadrartBaseService } from '../../base/base.service';
import { CadrartArticle } from '../../entities/article.entity';

@Injectable()
export class CadrartArticleService extends CadrartBaseService<CadrartArticle> {
  entityName = 'Article';
  override findAllrelations = ['formula', 'provider'];
  override findOnerelations = ['formula', 'provider'];

  constructor(@InjectRepository(CadrartArticle) private articlesRepository: Repository<CadrartArticle>) {
    super(articlesRepository);
  }

  async findCombinable(): Promise<CadrartArticle[]> {
    return this.articlesRepository.find({
      relations: this.findAllrelations,
      where: { combine: true }
    });
  }
}
