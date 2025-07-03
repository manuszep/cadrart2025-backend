# Rate Limiting Implementation

This document describes the rate limiting implementation in the Cadrart backend application.

## Overview

Rate limiting is implemented using the `@nestjs/throttler` package to protect the API from abuse and ensure fair usage of resources.

## Configuration

### Global Configuration

The rate limiting is configured globally in `src/config/throttler.config.ts`:

```typescript
export const throttlerConfig: ThrottlerModuleOptions = {
  throttlers: [
    {
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    },
    {
      ttl: 3600000, // 1 hour
      limit: 1000, // 1000 requests per hour
    },
  ],
  ignoreUserAgents: [
    /health-check/i, // Ignore health check user agents
  ],
  skipIf: (context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    // Skip rate limiting for certain paths
    const skipPaths = ['/api/health', '/api/status'];
    return skipPaths.some((path) => request.url?.startsWith(path));
  },
};
```

### Module Integration

The ThrottlerModule is imported in `src/app.module.ts`:

```typescript
ThrottlerModule.forRoot(throttlerConfig),
```

## Usage

### Global Rate Limiting

All endpoints are protected by default with the global configuration:
- 100 requests per minute
- 1000 requests per hour

### Endpoint-Specific Rate Limiting

You can apply specific rate limits to individual endpoints using the `@Throttle` decorator:

```typescript
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @Post('login')
  async login() {
    // Login logic
  }

  @Throttle({ default: { limit: 10, ttl: 3600000 } }) // 10 requests per hour
  @Post('register')
  async register() {
    // Registration logic
  }
}
```

### Custom Rate Limiting Decorators

Pre-defined decorators are available in `src/decorators/throttle.decorators.ts`:

```typescript
import { ThrottleAuth, ThrottleUpload, ThrottleStrict, ThrottleLoose } from '../decorators/throttle.decorators';

@Controller('api')
export class ApiController {
  @ThrottleAuth() // 5 requests per minute
  @Post('login')
  async login() {
    // Login logic
  }

  @ThrottleUpload() // 10 requests per hour
  @Post('upload')
  async upload() {
    // Upload logic
  }

  @ThrottleStrict() // 1 request per minute
  @Post('sensitive-operation')
  async sensitiveOperation() {
    // Sensitive operation
  }

  @ThrottleLoose() // 1000 requests per hour
  @Get('public-data')
  async getPublicData() {
    // Public data retrieval
  }
}
```

## Rate Limiting Headers

When rate limiting is active, the following headers are added to responses:

- `X-RateLimit-Limit`: The maximum number of requests allowed
- `X-RateLimit-Remaining`: The number of requests remaining
- `X-RateLimit-Reset`: The time when the rate limit resets

## Error Responses

When a rate limit is exceeded, the API returns:

```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests",
  "error": "Too Many Requests"
}
```

## Custom Guard

A custom throttler guard is available in `src/guards/throttler.guard.ts` that uses IP addresses for tracking:

```typescript
import { CustomThrottlerGuard } from '../guards/throttler.guard';

@UseGuards(CustomThrottlerGuard)
@Controller('api')
export class ApiController {
  // Controller methods
}
```

## Best Practices

1. **Authentication Endpoints**: Use strict rate limiting (5 requests per minute)
2. **File Uploads**: Use moderate rate limiting (10 requests per hour)
3. **Public APIs**: Use loose rate limiting (1000 requests per hour)
4. **Sensitive Operations**: Use very strict rate limiting (1 request per minute)

## Monitoring

Rate limiting events are logged by default. Monitor the following:
- 429 responses in your application logs
- Rate limiting headers in API responses
- IP addresses that frequently hit rate limits

## Configuration Options

You can customize the rate limiting behavior by modifying:

1. **Global limits** in `src/config/throttler.config.ts`
2. **Endpoint-specific limits** using decorators
3. **Skip conditions** for health checks and monitoring endpoints
4. **User agent filtering** for specific clients

## Testing

To test rate limiting:

1. Make multiple rapid requests to a rate-limited endpoint
2. Verify that the 429 status code is returned after exceeding the limit
3. Check that rate limiting headers are present in responses
4. Verify that limits reset after the TTL period 
