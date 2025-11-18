import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CadrartBaseService, ICadrartBaseServiceFindParam } from '../../base/base.service';
import { CadrartProvider } from '../../entities/provider.entity';
import { CreateProviderDto, UpdateProviderDto } from '../../dto/provider.dto';
import { CadrartSocketService } from '../../socket/socket.service';

@Injectable()
export class CadrartProviderService extends CadrartBaseService<CadrartProvider, CreateProviderDto, UpdateProviderDto> {
  entityName = 'Provider';

  constructor(
    @InjectRepository(CadrartProvider)
    private providersRepository: Repository<CadrartProvider>,
    protected readonly socket: CadrartSocketService
  ) {
    super(providersRepository, socket);
  }

  getSearchConfig(needle: string): ICadrartBaseServiceFindParam<CadrartProvider> {
    if (!needle) {
      return [];
    }

    const pattern = `%${needle}%`;

    return [{ name: Like(pattern) }];
  }
}
