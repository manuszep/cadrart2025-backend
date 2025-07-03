import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';

export const throttlerConfig: ThrottlerModuleOptions = {
  throttlers: [
    {
      ttl: 60000, // 1 minute
      limit: 100 // 100 requests per minute
    },
    {
      ttl: 3600000, // 1 hour
      limit: 1000 // 1000 requests per hour
    }
  ],
  ignoreUserAgents: [
    // Ignore health check user agents
    /health-check/i
  ],
  skipIf: (context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    // Skip rate limiting for certain paths
    const skipPaths = ['/api/health', '/api/status'];
    return skipPaths.some((path) => request.url?.startsWith(path));
  }
};
