import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CadrartBaseService, ICadrartBaseServiceFindParam } from '../../base/base.service';
import { CadrartProvider } from '../../entities/provider.entity';

@Injectable()
export class CadrartProviderService extends CadrartBaseService<CadrartProvider> {
  entityName = 'Provider';

  constructor(
    @InjectRepository(CadrartProvider)
    private providersRepository: Repository<CadrartProvider>
  ) {
    super(providersRepository);
  }

  getSearchConfig(needle: string): ICadrartBaseServiceFindParam<CadrartProvider> {
    if (!needle) {
      return [];
    }

    const pattern = `%${needle}%`;

    return [{ name: Like(pattern) }];
  }
}
