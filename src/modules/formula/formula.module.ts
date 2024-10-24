import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CadrartFormula } from '../../entities/formula.entity';

import { CadrartFormulaService } from './formula.service';
import { CadrartFormulaController } from './formula.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CadrartFormula])],
  controllers: [CadrartFormulaController],
  providers: [CadrartFormulaService]
})
export class CadrartFormulaModule {}
