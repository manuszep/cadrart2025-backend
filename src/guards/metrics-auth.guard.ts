import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class MetricsAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Check for API key first (for Prometheus scraping)
    const apiKey = this.extractApiKey(request);
    if (apiKey && this.validateApiKey(apiKey)) {
      return true;
    }

    // Check for JWT token (for authenticated users)
    const token = this.extractTokenFromHeader(request);
    if (token && (await this.validateJwtToken(token))) {
      return true;
    }

    // Check for internal network access (for Kubernetes health checks)
    if (this.isInternalRequest(request)) {
      return true;
    }

    throw new UnauthorizedException('Access denied to metrics endpoint');
  }

  private extractApiKey(request: Request): string | undefined {
    // Check Authorization header for API key
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      // If it's not a JWT (doesn't contain dots), treat as API key
      if (!token.includes('.')) {
        return token;
      }
    }

    // Check X-API-Key header
    return request.headers['x-api-key'] as string;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private validateApiKey(apiKey: string): boolean {
    const expectedApiKey = this.configService.get('METRICS_API_KEY');
    return apiKey === expectedApiKey;
  }

  private async validateJwtToken(token: string): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('CADRART_JWT_SECRET')
      });

      // Check if user has admin role or specific permissions
      // For now, we'll allow any authenticated user
      return !!payload;
    } catch {
      return false;
    }
  }

  private isInternalRequest(request: Request): boolean {
    const clientIp = request.ip;
    const internalNetworks = ['127.0.0.1', '::1', '10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'];

    // Check if IP is in internal networks
    return internalNetworks.some((network) => {
      if (network.includes('/')) {
        // CIDR notation - simplified check
        return clientIp.startsWith(network.split('/')[0].substring(0, network.split('/')[0].lastIndexOf('.')));
      }
      return clientIp === network;
    });
  }
}
