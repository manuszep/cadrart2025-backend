import { Controller } from '@nestjs/common';

import { CadrartBaseController } from '../../base/base.controller';
import { CadrartTag } from '../../entities/tag.entity';
import { CreateTagDto, UpdateTagDto, TagQueryDto } from '../../dto/tag.dto';

import { CadrartTagService } from './tag.service';

@Controller('tag')
export class CadrartTagController extends CadrartBaseController<CadrartTag, CreateTagDto, UpdateTagDto, TagQueryDto> {
  constructor(private readonly tagService: CadrartTagService) {
    super(tagService);
  }

  override getLabelForOption(entity: CadrartTag): string {
    return entity.name;
  }
}
