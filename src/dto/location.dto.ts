import { IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

import { BaseDto } from './base.dto';

export class CreateLocationDto extends BaseDto {
  @IsString()
  @MaxLength(50)
  name!: string;
}

export class UpdateLocationDto extends BaseDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;
}

export class LocationQueryDto {
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
