import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CadrartBaseService } from '../../base/base.service';
import { CadrartLocation } from '../../entities/location.entity';

@Injectable()
export class CadrartLocationService extends CadrartBaseService<CadrartLocation> {
  entityName = 'Location';

  constructor(@InjectRepository(CadrartLocation) locationsRepository: Repository<CadrartLocation>) {
    super(locationsRepository);
  }
}
