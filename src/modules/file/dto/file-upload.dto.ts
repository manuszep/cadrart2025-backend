import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class FileUploadDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  quality?: number = 80;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  maxWidth?: number = 1600;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  maxHeight?: number = 1600;
}

export interface IFileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fileType?: string;
  mimeType?: string;
  size?: number;
  dimensions?: {
    width: number;
    height: number;
  };
}
