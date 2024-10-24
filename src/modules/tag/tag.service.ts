import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CadrartBaseService } from '../../base/base.service';
import { CadrartTag } from '../../entities/tag.entity';

@Injectable()
export class CadrartTagService extends CadrartBaseService<CadrartTag> {
  entityName = 'Tag';

  constructor(@InjectRepository(CadrartTag) private tagsRepository: Repository<CadrartTag>) {
    super(tagsRepository);
  }
}
