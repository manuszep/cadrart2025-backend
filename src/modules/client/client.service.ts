import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CadrartBaseService } from '../../base/base.service';
import { CadrartClient } from '../../entities/client.entity';

@Injectable()
export class CadrartClientService extends CadrartBaseService<CadrartClient> {
  entityName = 'Client';
  override findAllrelations = ['tag'];
  override findOnerelations = ['tag'];

  constructor(@InjectRepository(CadrartClient) private clientsRepository: Repository<CadrartClient>) {
    super(clientsRepository);
  }
}
