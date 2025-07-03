import { IsString, IsOptional, IsNumber, Min, Max, IsEmail } from 'class-validator';

import { BaseDto } from './base.dto';

export class CreateClientDto extends BaseDto {
  @IsString()
  lastName!: string;

  @IsString()
  firstName!: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEmail()
  mail?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  phone2?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  vat?: number = 21;

  @IsOptional()
  @IsNumber()
  tagId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  reduction?: number = 0;
}

export class UpdateClientDto extends CreateClientDto {
  @IsOptional()
  @IsNumber()
  id?: number;
}

export class ClientQueryDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  count?: number;

  @IsOptional()
  @IsString()
  needle?: string;
}
