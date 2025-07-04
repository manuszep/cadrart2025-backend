import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class TestEndpointGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // Check environment - completely disable in production
    const environment = this.configService.get('NODE_ENV');
    if (environment === 'production') {
      throw new ForbiddenException('Endpoint not found');
    }

    // Check for secret token in headers
    const secretToken = request.headers['x-test-secret'];
    const expectedToken = this.configService.get('TEST_ENDPOINT_SECRET') || 'dev-secret-key';

    if (secretToken !== expectedToken) {
      throw new ForbiddenException('Endpoint not found');
    }

    return true;
  }
}
