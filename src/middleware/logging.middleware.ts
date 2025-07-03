import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { MonitoringService } from '../services/monitoring.service';

interface IRequestWithId extends Request {
  requestId?: string;
  startTime?: number;
  userId?: string;
  user?: Record<string, unknown>;
}

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  constructor(private readonly monitoringService: MonitoringService) {}

  use(req: IRequestWithId, res: Response, next: NextFunction): void {
    // Generate unique request ID
    req.requestId = uuidv4();
    req.startTime = Date.now();

    // Extract user ID from JWT if available
    if (req.user) {
      req.userId = (req.user.userId as string) || (req.user.sub as string);
    }

    // Log incoming request
    this.logRequest(req);

    // Capture response data
    const originalSend = res.send;
    const logResponse = this.logResponse.bind(this);
    res.send = function (body: unknown): Response {
      try {
        const responseTime = Date.now() - (req.startTime || 0);

        // Log response
        logResponse(req, res, responseTime);

        return originalSend.call(this, body);
      } catch (error) {
        // If logging fails, still send the response
        console.error('Logging middleware error:', error);
        return originalSend.call(this, body);
      }
    };

    next();
  }

  private logRequest(req: IRequestWithId): void {
    const logData = {
      requestId: req.requestId,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      userId: req.userId,
      headers: this.sanitizeHeaders(req.headers),
      timestamp: new Date().toISOString()
    };

    this.logger.log('Incoming request', 'HTTP', logData);
  }

  private logResponse(req: IRequestWithId, res: Response, responseTime: number): void {
    const logData = {
      requestId: req.requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userId: req.userId,
      contentLength: res.get('content-length'),
      timestamp: new Date().toISOString()
    };

    // Record metrics
    this.monitoringService.recordRequest(res.statusCode < 400, responseTime);

    // Log level based on status code
    if (res.statusCode >= 400) {
      this.logger.warn('Request completed with error', 'HTTP', logData);
    } else {
      this.logger.log('Request completed successfully', 'HTTP', logData);
    }

    // Performance warning for slow requests
    if (responseTime > 1000) {
      this.logger.warn('Slow request detected', 'Performance', {
        ...logData,
        threshold: '1000ms'
      });
    }
  }

  private sanitizeHeaders(headers: Record<string, unknown>): Record<string, string> {
    const sanitized: Record<string, string> = {};
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];

    Object.keys(headers).forEach((key) => {
      if (sensitiveHeaders.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = String(headers[key]);
      }
    });

    return sanitized;
  }
}
