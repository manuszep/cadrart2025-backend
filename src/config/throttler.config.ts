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
    },
    {
      ttl: 86400000, // 24 hours
      limit: 10000 // 10000 requests per day
    }
  ],
  ignoreUserAgents: [
    // Ignore health check user agents
    /health-check/i,
    /kube-probe/i,
    /liveness-probe/i,
    /readiness-probe/i
  ],
  skipIf: (context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    // Skip rate limiting for certain paths
    const skipPaths = ['/api/health', '/api/status', '/api/version'];
    return skipPaths.some((path) => request.url?.startsWith(path));
  }
};

// Specific throttling for sensitive endpoints
export const sensitiveEndpointThrottler = {
  ttl: 300000, // 5 minutes
  limit: 5 // 5 attempts per 5 minutes
};

export const uploadThrottler = {
  ttl: 3600000, // 1 hour
  limit: 10 // 10 uploads per hour
};

export const authThrottler = {
  ttl: 900000, // 15 minutes
  limit: 3 // 3 login attempts per 15 minutes
};
