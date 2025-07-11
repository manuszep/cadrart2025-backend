import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

interface IVersionInfo {
  version: string;
  color: string;
  environment: string;
  timestamp: string;
}

@Controller('version')
export class CadrartVersionController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  async getVersion(@Res() res: Response): Promise<Response<string>> {
    return res.status(HttpStatus.OK).send(this.configService.get('CADRART_BUILD_VERSION'));
  }

  @Get('info')
  async getVersionInfo(@Res() res: Response): Promise<Response<IVersionInfo>> {
    const versionInfo: IVersionInfo = {
      version: this.configService.get('CADRART_BUILD_VERSION') || 'unknown',
      color: this.configService.get('DEPLOYMENT_COLOR') || 'unknown',
      environment: this.configService.get('ENVIRONMENT') || 'unknown',
      timestamp: new Date().toISOString()
    };

    return res.json(versionInfo);
  }
}
