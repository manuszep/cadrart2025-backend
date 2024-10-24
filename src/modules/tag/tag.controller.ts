import { Controller } from '@nestjs/common';

import { CadrartBaseController } from '../../base/base.controller';
import { CadrartTag } from '../../entities/tag.entity';
import { CadrartSocketService } from '../../socket/socket.service';

import { CadrartTagService } from './tag.service';

@Controller('tag')
export class CadrartTagController extends CadrartBaseController<CadrartTag> {
  constructor(private readonly tagService: CadrartTagService, private readonly localSocket: CadrartSocketService) {
    super(tagService, localSocket);
  }

  override getLabelForOption(entity: CadrartTag): string {
    return entity.name;
  }
}