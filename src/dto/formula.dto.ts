import { IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

import { BaseDto } from './base.dto';

export class CreateFormulaDto extends BaseDto {
  @IsString()
  @MaxLength(50)
  name!: string;

  @IsString()
  @MaxLength(255)
  formula!: string;
}

export class UpdateFormulaDto extends BaseDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  formula?: string;
}

export class FormulaQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  count?: number;

  @IsOptional()
  @IsString()
  needle?: string;
}
