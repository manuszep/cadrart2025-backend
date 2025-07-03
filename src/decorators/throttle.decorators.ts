import { SetMetadata } from '@nestjs/common';

export const THROTTLE_LIMIT_KEY = 'throttle:limit';
export const THROTTLE_TTL_KEY = 'throttle:ttl';

export const Throttle = (limit: number, ttl: number): ReturnType<typeof SetMetadata> =>
  SetMetadata(THROTTLE_LIMIT_KEY, { limit, ttl });

// Specific rate limiting decorators for different use cases
export const ThrottleAuth = (): ReturnType<typeof SetMetadata> => Throttle(5, 60000); // 5 requests per minute
export const ThrottleUpload = (): ReturnType<typeof SetMetadata> => Throttle(10, 3600000); // 10 requests per hour
export const ThrottleStrict = (): ReturnType<typeof SetMetadata> => Throttle(1, 60000); // 1 request per minute
export const ThrottleLoose = (): ReturnType<typeof SetMetadata> => Throttle(1000, 3600000); // 1000 requests per hour
