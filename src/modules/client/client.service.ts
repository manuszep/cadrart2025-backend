import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CadrartBaseService, ICadrartBaseServiceFindParam } from '../../base/base.service';
import { CadrartClient } from '../../entities/client.entity';

@Injectable()
export class CadrartClientService extends CadrartBaseService<CadrartClient> {
  entityName = 'Client';
  override findAllrelations = ['tag'];
  override findOnerelations = ['tag'];

  constructor(@InjectRepository(CadrartClient) private clientsRepository: Repository<CadrartClient>) {
    super(clientsRepository);
  }

  getSearchConfig(needle: string): ICadrartBaseServiceFindParam<CadrartClient> {
    if (!needle) {
      return [];
    }

    const pattern = `%${needle}%`;

    return [
      { firstName: Like(pattern) },
      { lastName: Like(pattern) },
      { company: Like(pattern) },
      { tag: Like(pattern) }
    ];
  }
}
