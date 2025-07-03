import { IsString, IsOptional, IsNumber, MaxLength, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

import { BaseDto } from './base.dto';

export class CreateStockDto extends BaseDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  articleName?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  article?: number;

  @IsOptional()
  @IsDateString()
  orderDate?: string;

  @IsOptional()
  @IsDateString()
  deliveryDate?: string;
}

export class UpdateStockDto extends BaseDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  articleName?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  article?: number;

  @IsOptional()
  @IsDateString()
  orderDate?: string;

  @IsOptional()
  @IsDateString()
  deliveryDate?: string;
}

export class StockQueryDto {
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
