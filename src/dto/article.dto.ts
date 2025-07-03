import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean, Min, Max, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ECadrartArticlePriceMethod, ECadrartArticleFamily } from '@manuszep/cadrart2025-common';

import { BaseDto } from './base.dto';

export class CreateArticleDto extends BaseDto {
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  place?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99999.99)
  @Type(() => Number)
  buyPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99999.99)
  @Type(() => Number)
  sellPrice?: number;

  @IsOptional()
  @IsEnum(ECadrartArticlePriceMethod)
  getPriceMethod?: ECadrartArticlePriceMethod;

  @IsOptional()
  @IsEnum(ECadrartArticleFamily)
  family?: ECadrartArticleFamily;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999.99)
  @Type(() => Number)
  maxReduction?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  provider?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  formula?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  providerRef?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99999.99)
  @Type(() => Number)
  maxLength?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99999.99)
  @Type(() => Number)
  maxWidth?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  combine?: boolean;
}

export class UpdateArticleDto extends BaseDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  place?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99999.99)
  @Type(() => Number)
  buyPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99999.99)
  @Type(() => Number)
  sellPrice?: number;

  @IsOptional()
  @IsEnum(ECadrartArticlePriceMethod)
  getPriceMethod?: ECadrartArticlePriceMethod;

  @IsOptional()
  @IsEnum(ECadrartArticleFamily)
  family?: ECadrartArticleFamily;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999.99)
  @Type(() => Number)
  maxReduction?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  provider?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  formula?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  providerRef?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99999.99)
  @Type(() => Number)
  maxLength?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99999.99)
  @Type(() => Number)
  maxWidth?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  combine?: boolean;
}

export class ArticleQueryDto {
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

  @IsOptional()
  @IsEnum(ECadrartArticleFamily)
  family?: ECadrartArticleFamily;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  combinable?: boolean;
}
