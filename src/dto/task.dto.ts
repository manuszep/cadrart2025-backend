import { IsString, IsOptional, IsNumber, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDto } from './base.dto';

export class CreateTaskDto extends BaseDto {
  @IsNumber()
  @Type(() => Number)
  job!: number;

  @IsString()
  article!: string; // Should be JSON string or object, adjust as needed

  @IsOptional()
  @IsString()
  @MaxLength(255)
  comment?: string;

  @IsNumber()
  @Type(() => Number)
  total!: number;

  @IsNumber()
  @Type(() => Number)
  totalBeforeReduction!: number;

  @IsNumber()
  @Type(() => Number)
  totalWithVat!: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  image?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  children?: CreateTaskDto[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  parent?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  doneCount?: number;
}

export class UpdateTaskDto extends BaseDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  job?: number;

  @IsOptional()
  @IsString()
  article?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  comment?: string;

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

  @IsOptional()
  @IsString()
  @MaxLength(100)
  image?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateTaskDto)
  children?: UpdateTaskDto[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  parent?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  doneCount?: number;
}

export class TaskQueryDto {
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
