import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class CadrartAuthGuard implements CanActivate {
  private readonly logger = new Logger('Security');

  constructor(
    private jwtService: JwtService,
    private config: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get('CADRART_JWT_SECRET')
      });

      request['user'] = payload;
    } catch {
      this.logger.warn('Potential security event detected', {
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        path: request.path,
        method: request.method,
        indicators: {
          AuthRequired: true
        }
      });
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
