import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CadrartBaseService } from '../../base/base.service';
import { CadrartFormula } from '../../entities/formula.entity';

@Injectable()
export class CadrartFormulaService extends CadrartBaseService<CadrartFormula> {
  entityName = 'Formula';

  constructor(@InjectRepository(CadrartFormula) private formulasRepository: Repository<CadrartFormula>) {
    super(formulasRepository);
  }
}
