import { Injectable, BadRequestException } from '@nestjs/common';
import sharp from 'sharp';

import { IFileValidationResult } from '../dto/file-upload.dto';
import {
  getAllowedMimeTypes,
  getAllowedExtensions,
  getMaxFileSize,
  getMaxDimensions,
  getMinDimensions
} from '../config/file-upload.config';

@Injectable()
export class CadrartFileValidationService {
  private readonly allowedMimeTypes = getAllowedMimeTypes();
  private readonly allowedExtensions = getAllowedExtensions();
  private readonly maxFileSize = getMaxFileSize();
  private readonly maxDimensions = getMaxDimensions();
  private readonly minDimensions = getMinDimensions();

  constructor() {}

  async validateFile(file: Express.Multer.File): Promise<IFileValidationResult> {
    const result: IFileValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Check if file exists
    if (!file || !file.buffer) {
      result.isValid = false;
      result.errors.push('No file provided or file is empty');
      return result;
    }

    // Check file size
    await this.validateFileSize(file, result);

    // Check file type
    await this.validateFileType(file, result);

    // Check image dimensions
    await this.validateImageDimensions(file, result);

    return result;
  }

  private async validateFileSize(file: Express.Multer.File, result: IFileValidationResult): Promise<void> {
    result.size = file.size;

    if (file.size > this.maxFileSize) {
      result.isValid = false;
      result.errors.push(
        `File size (${this.formatBytes(file.size)}) exceeds maximum allowed size (${this.formatBytes(this.maxFileSize)})`
      );
    } else if (file.size === 0) {
      result.isValid = false;
      result.errors.push('File is empty');
    } else if (file.size < 100) {
      result.warnings.push('File size is very small, may be corrupted');
    }
  }

  private async validateFileType(file: Express.Multer.File, result: IFileValidationResult): Promise<void> {
    try {
      const { fileTypeFromBuffer } = await import('file-type');
      const detectedType = await fileTypeFromBuffer(file.buffer);

      if (!detectedType) {
        result.isValid = false;
        result.errors.push('Unable to detect file type');
        return;
      }

      result.fileType = detectedType.ext;
      result.mimeType = detectedType.mime;

      // Check if detected type matches allowed types
      if (!this.allowedExtensions.includes(detectedType.ext)) {
        result.isValid = false;
        result.errors.push(
          `File type '${detectedType.ext}' is not allowed. Allowed types: ${this.allowedExtensions.join(', ')}`
        );
      }

      if (!this.allowedMimeTypes.includes(detectedType.mime)) {
        result.isValid = false;
        result.errors.push(
          `MIME type '${detectedType.mime}' is not allowed. Allowed types: ${this.allowedMimeTypes.join(', ')}`
        );
      }

      // Additional check for file extension vs actual content
      if (file.originalname) {
        const extension = file.originalname.split('.').pop()?.toLowerCase();
        if (extension && extension !== detectedType.ext) {
          result.warnings.push(`File extension (${extension}) doesn't match detected type (${detectedType.ext})`);
        }
      }
    } catch (error) {
      result.isValid = false;
      result.errors.push(`Error detecting file type: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async validateImageDimensions(file: Express.Multer.File, result: IFileValidationResult): Promise<void> {
    try {
      const metadata = await sharp(file.buffer).metadata();

      if (!metadata.width || !metadata.height) {
        result.isValid = false;
        result.errors.push('Unable to determine image dimensions');
        return;
      }

      result.dimensions = {
        width: metadata.width,
        height: metadata.height
      };

      // Check minimum dimensions
      if (metadata.width < this.minDimensions.width || metadata.height < this.minDimensions.height) {
        result.isValid = false;
        result.errors.push(
          `Image dimensions (${metadata.width}x${metadata.height}) are too small. Minimum: ${this.minDimensions.width}x${this.minDimensions.height}`
        );
      }

      // Check maximum dimensions
      if (metadata.width > this.maxDimensions.width || metadata.height > this.maxDimensions.height) {
        result.isValid = false;
        result.errors.push(
          `Image dimensions (${metadata.width}x${metadata.height}) are too large. Maximum: ${this.maxDimensions.width}x${this.maxDimensions.height}`
        );
      }

      // Check aspect ratio for extreme values
      const aspectRatio = metadata.width / metadata.height;
      if (aspectRatio > 10 || aspectRatio < 0.1) {
        result.warnings.push('Image has extreme aspect ratio, may not display well');
      }
    } catch (error) {
      result.isValid = false;
      result.errors.push(
        `Error validating image dimensions: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  throwIfInvalid(result: IFileValidationResult): void {
    if (!result.isValid) {
      throw new BadRequestException({
        message: 'File validation failed',
        errors: result.errors,
        warnings: result.warnings
      });
    }
  }
}
