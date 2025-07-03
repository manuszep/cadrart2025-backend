import { IsOptional, IsString, IsNumber, IsDateString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class BaseDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  id?: number;

  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @IsOptional()
  @IsDateString()
  updatedAt?: string;
}

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  count?: number = 10;

  @IsOptional()
  @IsString()
  needle?: string;
}
