/**
 * Shared CORS configuration utility
 * Centralizes CORS origin configuration for both HTTP and WebSocket endpoints
 */

export function getCorsOrigins(): string[] {
  // If CORS_ORIGINS environment variable is set, use it
  if (process.env.CORS_ORIGINS) {
    return process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim());
  }

  // Fallback to environment-based defaults
  return process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_ORIGINS?.split(',').map((origin) => origin.trim()) || []
    : ['http://localhost:4200', 'http://localhost:3000'];
}

export const corsConfig = {
  origin: getCorsOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Total-Count'],
  maxAge: 86400 // 24 hours
};

export const wsCorsConfig = {
  origin: getCorsOrigins(),
  credentials: true,
  methods: ['GET', 'POST']
};
