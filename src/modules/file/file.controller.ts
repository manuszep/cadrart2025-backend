import * as fs from 'fs';

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
  Body
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ICadrartErrorResponse, ICadrartFileResponse } from '@manuszep/cadrart2025-common';

import { CadrartJwtAuthGuard } from '../auth/jwt-auth.guard';

import { CadrartFileUploadGuard } from './guards/file-upload.guard';
import { CadrartFileValidationService } from './services/file-validation.service';
import { cadrartSharpPipe } from './image.pipe';
import { cadrartEnhancedSharpPipe } from './enhanced-image.pipe';
import { FileUploadDto } from './dto/file-upload.dto';

@Controller('image')
export class CadrartFileController {
  constructor(
    private readonly config: ConfigService,
    private readonly validationService: CadrartFileValidationService
  ) {}

  @UseGuards(CadrartJwtAuthGuard, CadrartFileUploadGuard)
  @Post('job')
  @UseInterceptors(FileInterceptor('file'))
  async uploadJobImage(
    @Res() res: Response,
    @UploadedFile(cadrartEnhancedSharpPipe('job')) file: string,
    @Body() _uploadDto: FileUploadDto
  ): Promise<Response<ICadrartFileResponse>> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      file: file
    });
  }

  @UseGuards(CadrartJwtAuthGuard, CadrartFileUploadGuard)
  @Post('task')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTaskImage(
    @Res() res: Response,
    @UploadedFile(cadrartEnhancedSharpPipe('task')) file: string,
    @Body() _uploadDto: FileUploadDto
  ): Promise<Response<ICadrartFileResponse>> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      file: file
    });
  }

  @UseGuards(CadrartJwtAuthGuard, CadrartFileUploadGuard)
  @Post('team-member')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTeamMemberImage(
    @Res() res: Response,
    @UploadedFile(cadrartEnhancedSharpPipe('team-member')) file: string,
    @Body() _uploadDto: FileUploadDto
  ): Promise<Response<ICadrartFileResponse>> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      file: file
    });
  }

  // Legacy endpoints for backward compatibility
  @UseGuards(CadrartJwtAuthGuard)
  @Post('job/legacy')
  @UseInterceptors(FileInterceptor('file'))
  async uploadJobImageLegacy(
    @Res() res: Response,
    @UploadedFile(cadrartSharpPipe('job')) file: string
  ): Promise<Response<ICadrartFileResponse>> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      file: file
    });
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Post('task/legacy')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTaskImageLegacy(
    @Res() res: Response,
    @UploadedFile(cadrartSharpPipe('task')) file: string
  ): Promise<Response<ICadrartFileResponse>> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      file: file
    });
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Post('team-member/legacy')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTeamMemberImageLegacy(
    @Res() res: Response,
    @UploadedFile(cadrartSharpPipe('team-member')) file: string
  ): Promise<Response<ICadrartFileResponse>> {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      file: file
    });
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Delete(':category/:name')
  async deleteImage(
    @Res() res: Response,
    @Param('category') category: string,
    @Param('name') name: string
  ): Promise<Response<ICadrartErrorResponse<{ file: string }> | ICadrartFileResponse>> {
    const root = this.config.get('STATIC_ROOT');
    const filesList = [
      `${root}/uploads/${category}/${name}_s.webp`,
      `${root}/uploads/${category}/${name}_m.webp`,
      `${root}/uploads/${category}/${name}_l.webp`,
      `${root}/uploads/${category}/${name}.webp`
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
        errors: errors
      });
    }

    return res.status(status).json({
      statusCode: status,
      files: filesList
    });
  }
}
