import { IsString, IsOptional, IsNumber, MaxLength, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

import { BaseDto } from './base.dto';

export class CreateProviderDto extends BaseDto {
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  vat?: string;

  @IsOptional()
  @IsString()
  @MaxLength(34)
  iban?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  mail?: string;
}

export class UpdateProviderDto extends BaseDto {
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
  @MaxLength(255)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  vat?: string;

  @IsOptional()
  @IsString()
  @MaxLength(34)
  iban?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  mail?: string;
}

export class ProviderQueryDto {
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
