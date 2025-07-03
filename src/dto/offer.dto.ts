import { IsString, IsOptional, IsNumber, Min, Max, IsEnum, IsArray, ValidateNested, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ECadrartOfferStatus } from '@manuszep/cadrart2025-common';

import { BaseDto } from './base.dto';

export class CreateOfferDto extends BaseDto {
  @IsString()
  @MaxLength(50)
  number!: string;

  @IsOptional()
  @IsNumber()
  clientId?: number;

  @IsOptional()
  @IsNumber()
  assignedToId?: number;

  @IsOptional()
  @IsEnum(ECadrartOfferStatus)
  status?: ECadrartOfferStatus = ECadrartOfferStatus.STATUS_CREATED;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  adjustedReduction?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  adjustedVat?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateJobDto)
  jobs?: CreateJobDto[];
}

export class UpdateOfferDto extends CreateOfferDto {
  @IsOptional()
  @IsNumber()
  id?: number;
}

export class OfferQueryDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  count?: number;

  @IsOptional()
  @IsString()
  needle?: string;

  @IsOptional()
  @IsString()
  createdAtLt?: string;

  @IsOptional()
  @IsString()
  createdAtGt?: string;

  @IsOptional()
  @IsEnum(ECadrartOfferStatus)
  status?: ECadrartOfferStatus;
}

export class CreateJobDto extends BaseDto {
  @IsOptional()
  @IsNumber()
  offerId?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  count?: number = 1;

  @IsOptional()
  @IsString()
  orientation?: string = 'VERTICAL';

  @IsOptional()
  @IsString()
  measure?: string = 'MEASURE_GLASS';

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  openingWidth?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  openingHeight?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  marginWidth?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  marginHeight?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  glassWidth?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  glassHeight?: number = 0;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  image?: string;
}
