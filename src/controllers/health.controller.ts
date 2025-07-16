import * as os from 'os';

import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

import { MetricsAuthGuard } from '../guards/metrics-auth.guard';

type IHealthStatusBinaryBalue = 'healthy' | 'unhealthy';
type IHealthStatusValue = IHealthStatusBinaryBalue | 'degraded';

interface IHealthStatus {
  status: IHealthStatusValue;
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  system: {
    memory: {
      percentage: number;
    };
    cpu: {
      cores: number;
    };
    platform: string;
    nodeVersion: string;
  };
  services: {
    database: IHealthStatusBinaryBalue;
    redis?: IHealthStatusBinaryBalue;
  };
}

interface IPublicHealthStatus {
  status: IHealthStatusValue;
  timestamp: string;
  version: string;
}

@Controller('health')
export class HealthController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  async getHealth(@Res() res: Response): Promise<Response<IPublicHealthStatus>> {
    const healthStatus = await this.getHealthStatus();

    const statusCode =
      healthStatus.status === 'healthy'
        ? HttpStatus.OK
        : healthStatus.status === 'degraded'
          ? HttpStatus.OK
          : HttpStatus.SERVICE_UNAVAILABLE;

    // Only return public health information
    const publicHealth: IPublicHealthStatus = {
      status: healthStatus.status,
      timestamp: healthStatus.timestamp,
      version: healthStatus.version
    };

    return res.status(statusCode).json(publicHealth);
  }

  @Get('detailed')
  @UseGuards(MetricsAuthGuard)
  async getDetailedHealth(@Res() res: Response): Promise<Response<IHealthStatus>> {
    const healthStatus = await this.getHealthStatus();

    const statusCode =
      healthStatus.status === 'healthy'
        ? HttpStatus.OK
        : healthStatus.status === 'degraded'
          ? HttpStatus.OK
          : HttpStatus.SERVICE_UNAVAILABLE;

    return res.status(statusCode).json(healthStatus);
  }

  @Get('ready')
  async getReadiness(@Res() res: Response): Promise<Response<{ status: string }>> {
    // Check if application is ready to receive traffic
    const isReady = await this.checkReadiness();

    return res
      .status(isReady ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE)
      .json({ status: isReady ? 'ready' : 'not ready' });
  }

  @Get('live')
  async getLiveness(@Res() res: Response): Promise<Response<{ status: string }>> {
    // Check if application is alive
    const isAlive = await this.checkLiveness();

    return res
      .status(isAlive ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE)
      .json({ status: isAlive ? 'alive' : 'dead' });
  }

  private async getHealthStatus(): Promise<IHealthStatus> {
    const totalMemory = os.totalmem() / 1024;
    const freeMemory = os.freemem() / 1024;
    const usedMemory = totalMemory - freeMemory;
    const memoryPercentage = (usedMemory / totalMemory) * 100;

    const healthStatus: IHealthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: this.configService.get('CADRART_BUILD_VERSION') || 'unknown',
      environment: this.configService.get('NODE_ENV') || 'development',
      system: {
        memory: {
          percentage: Math.round(memoryPercentage * 100) / 100
        },
        cpu: {
          cores: os.cpus().length
        },
        platform: os.platform(),
        nodeVersion: process.version
      },
      services: {
        database: 'healthy' // This should be checked against actual DB connection
      }
    };

    // Determine overall status
    if (memoryPercentage > 90) {
      healthStatus.status = 'degraded';
    }

    if (memoryPercentage > 95) {
      healthStatus.status = 'unhealthy';
    }

    return healthStatus;
  }

  private async checkReadiness(): Promise<boolean> {
    try {
      // Check database connection
      // Check if all required services are available
      // Check if application has finished startup
      return true;
    } catch {
      return false;
    }
  }

  private async checkLiveness(): Promise<boolean> {
    try {
      // Basic liveness check - just ensure process is running
      return process.pid > 0;
    } catch {
      return false;
    }
  }
}
