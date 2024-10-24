import * as path from 'path';
import * as fs from 'fs';

import { forwardRef, Inject, PipeTransform, Type } from '@nestjs/common';
import sharp from 'sharp';
import { ConfigService } from '@nestjs/config';

export const cadrartSharpPipe: (
  directory: string,
) => Type<PipeTransform<Express.Multer.File, Promise<string>>> =
  createCadrartSharpPipe;

export function createCadrartSharpPipe(
  directory: string,
): Type<PipeTransform<Express.Multer.File, Promise<string>>> {
  class CadrartSharpPipe
    implements PipeTransform<Express.Multer.File, Promise<string>>
  {
    constructor(
      @Inject(forwardRef(() => ConfigService)) private config: ConfigService,
    ) {}

    async transform(image: Express.Multer.File): Promise<string> {
      const dir = `${this.config.get('CADRART_STATIC_ROOT')}/uploads/${directory}`;
      const filenameBase = `${Date.now()}`;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      await sharp(image.buffer)
        .resize(80)
        .webp({ effort: 3 })
        .toFile(path.join(dir, `${filenameBase}_s.webp`));

      await sharp(image.buffer)
        .resize(800)
        .webp({ effort: 3 })
        .toFile(path.join(dir, `${filenameBase}_m.webp`));

      await sharp(image.buffer)
        .resize(1600)
        .webp({ effort: 3 })
        .toFile(path.join(dir, `${filenameBase}_l.webp`));

      await sharp(image.buffer)
        .webp({ effort: 3 })
        .toFile(path.join(dir, `${filenameBase}.webp`));

      return filenameBase;
    }
  }

  return CadrartSharpPipe;
}
