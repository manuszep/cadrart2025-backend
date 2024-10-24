import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Controller('version')
export class CadrartVersionController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  async getVersion(@Res() res: Response): Promise<Response<string>> {
    return res
      .status(HttpStatus.OK)
      .send(this.configService.get('CADRART_BUILD_VERSION'));
  }
}
