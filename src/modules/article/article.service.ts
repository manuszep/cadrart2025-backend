import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CadrartBaseService, ICadrartBaseServiceFindParam } from '../../base/base.service';
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

  getSearchConfig(needle: string): ICadrartBaseServiceFindParam<CadrartArticle> {
    if (!needle) {
      return [];
    }

    const pattern = `%${needle}%`;

    return [{ name: Like(pattern) }, { place: Like(pattern) }, { provider: { name: Like(pattern) } }];
  }
}
