import {
  IsString,
  IsOptional,
  IsNumber,
  MaxLength,
  IsEnum,
  IsDateString,
  ValidateNested,
  IsArray
} from 'class-validator';
import { Type } from 'class-transformer';
import { ECadrartJobMeasureType, ECadrartJobOrientation } from '@manuszep/cadrart2025-common';

import { BaseDto } from './base.dto';

export class CreateJobDto extends BaseDto {
  @IsNumber()
  @Type(() => Number)
  offer!: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  count?: number;

  @IsOptional()
  @IsEnum(ECadrartJobOrientation)
  orientation?: ECadrartJobOrientation;

  @IsOptional()
  @IsEnum(ECadrartJobMeasureType)
  measure?: ECadrartJobMeasureType;

  @IsOptional()
  @IsString()
  location?: string; // Should be JSON string or object, adjust as needed

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  openingWidth?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  openingHeight?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  marginWidth?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  marginHeight?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  glassWidth?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  glassHeight?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Number)
  tasks?: number[];

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  image?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  total?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalBeforeReduction?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalWithVat?: number;
}

export class UpdateJobDto extends BaseDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offer?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  count?: number;

  @IsOptional()
  @IsEnum(ECadrartJobOrientation)
  orientation?: ECadrartJobOrientation;

  @IsOptional()
  @IsEnum(ECadrartJobMeasureType)
  measure?: ECadrartJobMeasureType;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  openingWidth?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  openingHeight?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  marginWidth?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  marginHeight?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  glassWidth?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  glassHeight?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Number)
  tasks?: number[];

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  image?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  total?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalBeforeReduction?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalWithVat?: number;
}

export class JobQueryDto {
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
