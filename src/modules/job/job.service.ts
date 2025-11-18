import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CadrartBaseService } from '../../base/base.service';
import { CadrartJob } from '../../entities/job.entity';
import { CadrartSocketService } from '../../socket/socket.service';

@Injectable()
export class CadrartJobService extends CadrartBaseService<CadrartJob> {
  entityName = 'Job';

  constructor(
    @InjectRepository(CadrartJob) locationsRepository: Repository<CadrartJob>,
    protected readonly socket: CadrartSocketService
  ) {
    super(locationsRepository, socket);
  }
}
