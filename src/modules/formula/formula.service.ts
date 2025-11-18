import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CadrartBaseService, ICadrartBaseServiceFindParam } from '../../base/base.service';
import { CadrartFormula } from '../../entities/formula.entity';
import { CadrartSocketService } from '../../socket/socket.service';

@Injectable()
export class CadrartFormulaService extends CadrartBaseService<CadrartFormula> {
  entityName = 'Formula';

  constructor(
    @InjectRepository(CadrartFormula) private formulasRepository: Repository<CadrartFormula>,
    protected readonly socket: CadrartSocketService
  ) {
    super(formulasRepository, socket);
  }

  getSearchConfig(needle: string): ICadrartBaseServiceFindParam<CadrartFormula> {
    if (!needle) {
      return [];
    }

    const pattern = `%${needle}%`;

    return [{ name: Like(pattern) }];
  }
}
