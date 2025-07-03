import * as path from 'path';
import * as fs from 'fs';

import { forwardRef, Inject, PipeTransform, Type } from '@nestjs/common';
import sharp from 'sharp';
import { ConfigService } from '@nestjs/config';

import { getQualitySettings, getResizeSettings } from './config/file-upload.config';

export const cadrartSharpPipe: (directory: string) => Type<PipeTransform<Express.Multer.File, Promise<string>>> =
  createCadrartSharpPipe;

export function createCadrartSharpPipe(directory: string): Type<PipeTransform<Express.Multer.File, Promise<string>>> {
  class CadrartSharpPipe implements PipeTransform<Express.Multer.File, Promise<string>> {
    constructor(@Inject(forwardRef(() => ConfigService)) private config: ConfigService) {}

    async transform(image: Express.Multer.File): Promise<string> {
      const dir = `${this.config.get('STATIC_ROOT')}/uploads/${directory}`;
      const filenameBase = `${Date.now()}`;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const qualitySettings = getQualitySettings();
      const resizeSettings = getResizeSettings();

      await sharp(image.buffer)
        .resize(resizeSettings.small)
        .webp({ effort: 3, quality: qualitySettings.small })
        .toFile(path.join(dir, `${filenameBase}_s.webp`));

      await sharp(image.buffer)
        .resize(resizeSettings.medium)
        .webp({ effort: 3, quality: qualitySettings.medium })
        .toFile(path.join(dir, `${filenameBase}_m.webp`));

      await sharp(image.buffer)
        .resize(resizeSettings.large)
        .webp({ effort: 3, quality: qualitySettings.large })
        .toFile(path.join(dir, `${filenameBase}_l.webp`));

      await sharp(image.buffer)
        .webp({ effort: 3, quality: qualitySettings.original })
        .toFile(path.join(dir, `${filenameBase}.webp`));

      return filenameBase;
    }
  }

  return CadrartSharpPipe;
}
