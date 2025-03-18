import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CadrartBaseService } from '../../base/base.service';
import { CadrartLocation } from '../../entities/location.entity';

@Injectable()
export class CadrartLocationService extends CadrartBaseService<CadrartLocation> {
  entityName = 'Location';

  constructor(@InjectRepository(CadrartLocation) locationsRepository: Repository<CadrartLocation>) {
    super(locationsRepository);
  }

  async search(needle: string): Promise<CadrartLocation[]> {
    const pattern = `%${needle}%`;

    return this.repository.find({
      where: [{ name: Like(pattern) }]
    });
  }
}
