import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private readonly logger = new Logger('Security');

  use(req: Request, res: Response, next: NextFunction): void {
    // Add additional security headers (some may be duplicated by Helmet.js)
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

    // Log security-relevant requests
    this.logSecurityEvent(req);

    next();
  }

  private logSecurityEvent(req: Request): void {
    const securityIndicators = {
      suspiciousUserAgent: this.isSuspiciousUserAgent(req.headers['user-agent']),
      suspiciousPath: this.isSuspiciousPath(req.path),
      suspiciousMethod: this.isSuspiciousMethod(req.method),
      missingAuth: this.isAuthRequired(req.path) && !req.headers.authorization
    };

    if (Object.values(securityIndicators).some(Boolean)) {
      this.logger.warn('Potential security event detected', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path,
        method: req.method,
        indicators: securityIndicators
      });
    }
  }

  private isSuspiciousUserAgent(userAgent?: string): boolean {
    if (!userAgent) return true;

    const suspiciousPatterns = [/bot/i, /crawler/i, /scanner/i, /sqlmap/i, /nikto/i, /nmap/i, /curl/i, /wget/i];

    return suspiciousPatterns.some((pattern) => pattern.test(userAgent));
  }

  private isSuspiciousPath(path: string): boolean {
    const suspiciousPaths = [
      '/admin',
      '/wp-admin',
      '/phpmyadmin',
      '/.env',
      '/config',
      '/.git',
      '/api/v1/admin',
      '/debug',
      '/test'
    ];

    return suspiciousPaths.some((suspiciousPath) => path.includes(suspiciousPath));
  }

  private isSuspiciousMethod(method: string): boolean {
    return ['PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase());
  }

  private isAuthRequired(path: string): boolean {
    const publicPaths = ['/api/login', '/api/health', '/api/status', '/api/version', '/static'];

    return !publicPaths.some((publicPath) => path.startsWith(publicPath));
  }
}
