import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CadrartBaseService, ICadrartBaseServiceFindParam } from '../../base/base.service';
import { CadrartTag } from '../../entities/tag.entity';

@Injectable()
export class CadrartTagService extends CadrartBaseService<CadrartTag> {
  entityName = 'Tag';

  constructor(@InjectRepository(CadrartTag) private tagsRepository: Repository<CadrartTag>) {
    super(tagsRepository);
  }

  getSearchConfig(needle: string): ICadrartBaseServiceFindParam<CadrartTag> {
    if (!needle) {
      return [];
    }

    const pattern = `%${needle}%`;

    return [{ name: Like(pattern) }];
  }
}
