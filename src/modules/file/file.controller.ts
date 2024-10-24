import fs = require('fs');

import {
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CadrartJwtAuthGuard } from '../auth/jwt-auth.guard';

import { cadrartSharpPipe } from './image.pipe';
import { ConfigService } from '@nestjs/config';

@Controller('image')
export class CadrartFileController {
  constructor(private readonly config: ConfigService) {}

  @UseGuards(CadrartJwtAuthGuard)
  @Post('job')
  @UseInterceptors(FileInterceptor('file'))
  async uploadJobImage(
    @Res() res,
    @UploadedFile(cadrartSharpPipe('job')) file: string,
  ) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      file: file,
    });
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Post('task')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTaskImage(
    @Res() res,
    @UploadedFile(cadrartSharpPipe('task')) file: string,
  ) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      file: file,
    });
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Post('team-member')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTeamMemberImage(
    @Res() res,
    @UploadedFile(cadrartSharpPipe('team-member')) file: string,
  ) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      file: file,
    });
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Delete(':category/:name')
  async deleteImage(
    @Res() res,
    @Param('category') category: string,
    @Param('name') name: string,
  ) {
    const root = this.config.get('CADRART_STATIC_ROOT');
    const filesList = [
      `${root}/uploads/${category}/${name}_s.webp`,
      `${root}/uploads/${category}/${name}_m.webp`,
      `${root}/uploads/${category}/${name}_l.webp`,
      `${root}/uploads/${category}/${name}.webp`,
    ];

    const errors: Array<{ message: string; file: string }> = [];

    filesList.forEach((file) => {
      fs.unlink(file, (err) => {
        if (err) {
          errors.push({ message: err.message, file: file });
        }
      });
    });

    const status =
      errors.length === filesList.length
        ? HttpStatus.NOT_MODIFIED
        : errors.length > 0
          ? HttpStatus.PARTIAL_CONTENT
          : HttpStatus.OK;

    if (status !== HttpStatus.OK) {
      return res.status(status).json({
        statusCode: status,
        errors: errors,
      });
    }

    return res.status(status).json({
      statusCode: status,
      files: filesList,
    });
  }
}
