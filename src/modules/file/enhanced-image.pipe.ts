import * as path from 'path';
import * as fs from 'fs';

import { forwardRef, Inject, PipeTransform, Type } from '@nestjs/common';
import sharp from 'sharp';
import { ConfigService } from '@nestjs/config';

import { CadrartFileValidationService } from './services/file-validation.service';
import { IFileValidationResult } from './dto/file-upload.dto';
import { getQualitySettings, getResizeSettings } from './config/file-upload.config';

export const cadrartEnhancedSharpPipe: (
  directory: string
) => Type<PipeTransform<Express.Multer.File, Promise<string>>> = createCadrartEnhancedSharpPipe;

export function createCadrartEnhancedSharpPipe(
  directory: string
): Type<PipeTransform<Express.Multer.File, Promise<string>>> {
  class CadrartEnhancedSharpPipe implements PipeTransform<Express.Multer.File, Promise<string>> {
    constructor(
      @Inject(forwardRef(() => ConfigService)) private config: ConfigService,
      @Inject(forwardRef(() => CadrartFileValidationService)) private validationService: CadrartFileValidationService
    ) {}

    async transform(image: Express.Multer.File): Promise<string> {
      // Step 1: Validate the file
      const validationResult = await this.validationService.validateFile(image);
      this.validationService.throwIfInvalid(validationResult);

      // Step 2: Process the image if validation passes
      return this.processImage(image, directory, validationResult);
    }

    private async processImage(
      image: Express.Multer.File,
      directory: string,
      validationResult: IFileValidationResult
    ): Promise<string> {
      const dir = `${this.config.get('STATIC_ROOT')}/uploads/${directory}`;
      const filenameBase = `${Date.now()}`;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const qualitySettings = getQualitySettings();
      const resizeSettings = getResizeSettings();

      // Use validation results to determine optimal processing
      const maxWidth =
        validationResult.dimensions?.width > resizeSettings.large
          ? resizeSettings.large
          : validationResult.dimensions?.width;
      const maxHeight =
        validationResult.dimensions?.height > resizeSettings.large
          ? resizeSettings.large
          : validationResult.dimensions?.height;

      // Create different sizes with enhanced quality settings
      await sharp(image.buffer)
        .resize(resizeSettings.small, resizeSettings.small, { fit: 'inside', withoutEnlargement: true })
        .webp({ effort: 4, quality: qualitySettings.small })
        .toFile(path.join(dir, `${filenameBase}_s.webp`));

      await sharp(image.buffer)
        .resize(resizeSettings.medium, resizeSettings.medium, { fit: 'inside', withoutEnlargement: true })
        .webp({ effort: 4, quality: qualitySettings.medium })
        .toFile(path.join(dir, `${filenameBase}_m.webp`));

      await sharp(image.buffer)
        .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
        .webp({ effort: 4, quality: qualitySettings.large })
        .toFile(path.join(dir, `${filenameBase}_l.webp`));

      // Original size with maximum quality
      await sharp(image.buffer)
        .webp({ effort: 4, quality: qualitySettings.original })
        .toFile(path.join(dir, `${filenameBase}.webp`));

      return filenameBase;
    }
  }

  return CadrartEnhancedSharpPipe;
}
