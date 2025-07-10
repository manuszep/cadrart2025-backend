import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MonitoringService } from '../services/monitoring.service';

@Injectable()
export class ErrorLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('ErrorLogging');

  constructor(private readonly monitoringService: MonitoringService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        const request = context.switchToHttp().getRequest();

        // Determine error type
        let errorType = 'UnknownError';
        if (error instanceof HttpException) {
          errorType = `HttpException_${error.getStatus()}`;
        } else if (error.name) {
          errorType = error.name;
        }

        // Record error in monitoring service with endpoint information
        this.monitoringService.recordError(errorType, error, request.url);

        // Log detailed error information
        const errorLog = {
          timestamp: new Date().toISOString(),
          requestId: request.requestId,
          userId: request.userId,
          method: request.method,
          url: request.url,
          ip: request.ip,
          userAgent: request.headers['user-agent'],
          errorType,
          errorMessage: error.message,
          errorStack: error.stack,
          statusCode: error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
        };

        // Log based on error severity
        if (error instanceof HttpException && error.getStatus() < 500) {
          this.logger.warn('Client error occurred', 'ErrorLogging', errorLog);
        } else {
          this.logger.error('Server error occurred', error.stack, 'ErrorLogging', errorLog);
        }

        return throwError(() => error);
      })
    );
  }
}
