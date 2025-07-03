import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface IMetrics {
  requests: {
    total: number;
    successful: number;
    failed: number;
    averageResponseTime: number;
  };
  errors: {
    total: number;
    byType: Record<string, number>;
  };
  performance: {
    memoryUsage: number;
    cpuUsage: number;
    activeConnections: number;
  };
  security: {
    failedLogins: number;
    suspiciousRequests: number;
    blockedRequests: number;
  };
}

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger('Monitoring');
  private metrics: IMetrics = {
    requests: {
      total: 0,
      successful: 0,
      failed: 0,
      averageResponseTime: 0
    },
    errors: {
      total: 0,
      byType: {}
    },
    performance: {
      memoryUsage: 0,
      cpuUsage: 0,
      activeConnections: 0
    },
    security: {
      failedLogins: 0,
      suspiciousRequests: 0,
      blockedRequests: 0
    }
  };

  private responseTimes: number[] = [];

  constructor(private eventEmitter: EventEmitter2) {
    this.startPeriodicMetricsCollection();
  }

  recordRequest(successful: boolean, responseTime: number): void {
    this.metrics.requests.total++;

    if (successful) {
      this.metrics.requests.successful++;
    } else {
      this.metrics.requests.failed++;
    }

    this.responseTimes.push(responseTime);

    // Keep only last 100 response times for average calculation
    if (this.responseTimes.length > 100) {
      this.responseTimes.shift();
    }

    this.metrics.requests.averageResponseTime =
      this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length;

    this.eventEmitter.emit('metrics.updated', this.metrics);
  }

  recordError(errorType: string, error: Error): void {
    this.metrics.errors.total++;
    this.metrics.errors.byType[errorType] = (this.metrics.errors.byType[errorType] || 0) + 1;

    this.logger.error(`Error recorded: ${errorType}`, error.stack, 'Monitoring');
    this.eventEmitter.emit('error.recorded', { type: errorType, error });
  }

  recordSecurityEvent(eventType: 'failedLogin' | 'suspiciousRequest' | 'blockedRequest'): void {
    switch (eventType) {
      case 'failedLogin':
        this.metrics.security.failedLogins++;
        break;
      case 'suspiciousRequest':
        this.metrics.security.suspiciousRequests++;
        break;
      case 'blockedRequest':
        this.metrics.security.blockedRequests++;
        break;
    }

    this.logger.warn(`Security event: ${eventType}`, 'Security');
    this.eventEmitter.emit('security.event', { type: eventType });
  }

  updatePerformanceMetrics(): void {
    const memoryUsage = process.memoryUsage();
    this.metrics.performance.memoryUsage = memoryUsage.heapUsed / memoryUsage.heapTotal;

    // Simple CPU usage approximation
    const startUsage = process.cpuUsage();
    setTimeout(() => {
      const endUsage = process.cpuUsage(startUsage);
      this.metrics.performance.cpuUsage = (endUsage.user + endUsage.system) / 1000000; // Convert to seconds
    }, 100);
  }

  getMetrics(): IMetrics {
    return { ...this.metrics };
  }

  resetMetrics(): void {
    this.metrics = {
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        averageResponseTime: 0
      },
      errors: {
        total: 0,
        byType: {}
      },
      performance: {
        memoryUsage: 0,
        cpuUsage: 0,
        activeConnections: 0
      },
      security: {
        failedLogins: 0,
        suspiciousRequests: 0,
        blockedRequests: 0
      }
    };
    this.responseTimes = [];
  }

  private startPeriodicMetricsCollection(): void {
    setInterval(() => {
      this.updatePerformanceMetrics();
      this.logMetrics();
    }, 60000); // Every minute
  }

  private logMetrics(): void {
    this.logger.log('Application metrics', 'Monitoring', {
      requests: this.metrics.requests,
      errors: this.metrics.errors.total,
      memoryUsage: `${(this.metrics.performance.memoryUsage * 100).toFixed(2)}%`,
      securityEvents: this.metrics.security
    });
  }
}
