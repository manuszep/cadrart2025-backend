import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CadrartBaseService } from '../../base/base.service';
import { CadrartJob } from '../../entities/job.entity';

@Injectable()
export class CadrartJobService extends CadrartBaseService<CadrartJob> {
  entityName = 'Job';

  constructor(@InjectRepository(CadrartJob) locationsRepository: Repository<CadrartJob>) {
    super(locationsRepository);
  }
}
