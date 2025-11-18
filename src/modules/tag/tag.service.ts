import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CadrartBaseService, ICadrartBaseServiceFindParam } from '../../base/base.service';
import { CadrartTag } from '../../entities/tag.entity';
import { CreateTagDto, UpdateTagDto } from '../../dto/tag.dto';
import { CadrartSocketService } from '../../socket/socket.service';

@Injectable()
export class CadrartTagService extends CadrartBaseService<CadrartTag, CreateTagDto, UpdateTagDto> {
  entityName = 'Tag';

  constructor(
    @InjectRepository(CadrartTag) private tagsRepository: Repository<CadrartTag>,
    protected readonly socket: CadrartSocketService
  ) {
    super(tagsRepository, socket);
  }

  getSearchConfig(needle: string): ICadrartBaseServiceFindParam<CadrartTag> {
    if (!needle) {
      return [];
    }

    const pattern = `%${needle}%`;

    return [{ name: Like(pattern) }];
  }
}
