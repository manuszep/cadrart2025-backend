import { Controller } from '@nestjs/common';

import { CadrartBaseController } from '../../base/base.controller';
import { CadrartFormula } from '../../entities/formula.entity';
import { CreateFormulaDto, UpdateFormulaDto, FormulaQueryDto } from '../../dto/formula.dto';

import { CadrartFormulaService } from './formula.service';

@Controller('formula')
export class CadrartFormulaController extends CadrartBaseController<
  CadrartFormula,
  CreateFormulaDto,
  UpdateFormulaDto,
  FormulaQueryDto
> {
  constructor(private readonly formulaService: CadrartFormulaService) {
    super(formulaService);
  }

  override getLabelForOption(entity: CadrartFormula): string {
    return entity.name;
  }
}
