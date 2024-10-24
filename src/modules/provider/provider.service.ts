import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CadrartBaseService } from '../../base/base.service';
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
}
