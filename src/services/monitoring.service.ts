import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { DatabaseMetricsService } from './database-metrics.service';
import { BusinessMetricsService } from './business-metrics.service';

export interface IMetrics {
  requests: {
    total: number;
    successful: number;
    failed: number;
    averageResponseTime: number;
    byEndpoint: Record<string, number>;
    byMethod: Record<string, number>;
    // New time-series metrics
    responseTimeHistogram: {
      p50: number;
      p90: number;
      p95: number;
      p99: number;
    };
    requestRate: number; // requests per second
    errorRate: number; // errors per second
  };
  errors: {
    total: number;
    byType: Record<string, number>;
    byEndpoint: Record<string, number>;
    // New time-series metrics
    errorRate: number; // errors per second
    errorTrend: number; // change in error rate over time
  };
  performance: {
    memoryUsage: number;
    cpuUsage: number;
    activeConnections: number;
    databaseConnections: number;
    databaseQueryTime: number;
    // New time-series metrics
    memoryTrend: number; // change in memory usage over time
    cpuTrend: number; // change in CPU usage over time
    databaseQueryRate: number; // queries per second
  };
  security: {
    failedLogins: number;
    suspiciousRequests: number;
    blockedRequests: number;
    rateLimitHits: number;
    // New time-series metrics
    failedLoginRate: number; // failed logins per minute
    securityEventRate: number; // security events per minute
  };
  business: {
    activeOffers: number;
    completedOffers: number;
    activeInvoices: number;
    pendingTasks: number;
    completedTasks: number;
    activeUsers: number;
    fileUploads: number;
    // New time-series metrics
    offerCreationRate: number; // offers created per hour
    taskCompletionRate: number; // tasks completed per hour
    userActivityRate: number; // active users per hour
  };
  websocket: {
    activeConnections: number;
    messagesSent: number;
    messagesReceived: number;
    connectionErrors: number;
    // New time-series metrics
    messageRate: number; // messages per second
    connectionRate: number; // connections per minute
  };
  // New time-series data
  timeSeries: {
    timestamps: string[];
    requestRates: number[];
    responseTimes: number[];
    errorRates: number[];
    memoryUsage: number[];
    cpuUsage: number[];
  };
}

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger('Monitoring');
  private _metrics: IMetrics = {
    requests: {
      total: 0,
      successful: 0,
      failed: 0,
      averageResponseTime: 0,
      byEndpoint: {},
      byMethod: {},
      responseTimeHistogram: { p50: 0, p90: 0, p95: 0, p99: 0 },
      requestRate: 0,
      errorRate: 0
    },
    errors: {
      total: 0,
      byType: {},
      byEndpoint: {},
      errorRate: 0,
      errorTrend: 0
    },
    performance: {
      memoryUsage: 0,
      cpuUsage: 0,
      activeConnections: 0,
      databaseConnections: 0,
      databaseQueryTime: 0,
      memoryTrend: 0,
      cpuTrend: 0,
      databaseQueryRate: 0
    },
    security: {
      failedLogins: 0,
      suspiciousRequests: 0,
      blockedRequests: 0,
      rateLimitHits: 0,
      failedLoginRate: 0,
      securityEventRate: 0
    },
    business: {
      activeOffers: 0,
      completedOffers: 0,
      activeInvoices: 0,
      pendingTasks: 0,
      completedTasks: 0,
      activeUsers: 0,
      fileUploads: 0,
      offerCreationRate: 0,
      taskCompletionRate: 0,
      userActivityRate: 0
    },
    websocket: {
      activeConnections: 0,
      messagesSent: 0,
      messagesReceived: 0,
      connectionErrors: 0,
      messageRate: 0,
      connectionRate: 0
    },
    timeSeries: {
      timestamps: [],
      requestRates: [],
      responseTimes: [],
      errorRates: [],
      memoryUsage: [],
      cpuUsage: []
    }
  };

  // Time-series data storage
  private _timeSeriesData: {
    timestamps: Date[];
    requestRates: number[];
    responseTimes: number[];
    errorRates: number[];
    memoryUsage: number[];
    cpuUsage: number[];
  } = {
    timestamps: [],
    requestRates: [],
    responseTimes: [],
    errorRates: [],
    memoryUsage: [],
    cpuUsage: []
  };

  // Rate calculation windows
  private _requestWindow: { timestamp: Date; count: number }[] = [];
  private _errorWindow: { timestamp: Date; count: number }[] = [];
  private _lastUpdate = Date.now();

  constructor(
    private eventEmitter: EventEmitter2,
    private databaseMetricsService: DatabaseMetricsService,
    private businessMetricsService: BusinessMetricsService
  ) {
    this.resetMetrics();
    this.startPeriodicMetricsCollection();

    // Update metrics every 30 seconds
    setInterval(async () => await this.updateMetrics(), 30000);

    // Clean up old time-series data (keep last 24 hours)
    setInterval(() => this.cleanupTimeSeriesData(), 60000);
  }

  recordRequest(successful: boolean, responseTime: number, endpoint?: string, method?: string): void {
    // Skip recording for technical endpoints
    if (endpoint && this.isTechnicalEndpoint(endpoint)) {
      return;
    }

    this._metrics.requests.total++;

    if (successful) {
      this._metrics.requests.successful++;
    } else {
      this._metrics.requests.failed++;
    }

    // Track by endpoint
    if (endpoint) {
      this._metrics.requests.byEndpoint[endpoint] = (this._metrics.requests.byEndpoint[endpoint] || 0) + 1;
    }

    // Track by method
    if (method) {
      this._metrics.requests.byMethod[method] = (this._metrics.requests.byMethod[method] || 0) + 1;
    }

    // Update average response time
    const totalRequests = this._metrics.requests.total;
    const currentTotal = this._metrics.requests.averageResponseTime * (totalRequests - 1);
    this._metrics.requests.averageResponseTime = (currentTotal + responseTime) / totalRequests;

    // Update time-series data
    this.updateTimeSeriesData(responseTime, successful);

    // Update rate calculations
    this.updateRateCalculations();
  }

  private isTechnicalEndpoint(endpoint: string): boolean {
    const technicalEndpoints = [
      '/metrics',
      '/metrics/prometheus',
      '/health',
      '/version',
      '/version/info',
      '/test',
      '/test/setup',
      '/test/cleanup',
      '/validation-test'
    ];

    return technicalEndpoints.some(
      (techEndpoint) => endpoint.startsWith(techEndpoint) || endpoint.includes(techEndpoint)
    );
  }

  recordError(errorType: string, error: Error, endpoint?: string): void {
    // Skip recording for technical endpoints
    if (endpoint && this.isTechnicalEndpoint(endpoint)) {
      return;
    }

    this._metrics.errors.total++;
    this._metrics.errors.byType[errorType] = (this._metrics.errors.byType[errorType] || 0) + 1;

    if (endpoint) {
      this._metrics.errors.byEndpoint[endpoint] = (this._metrics.errors.byEndpoint[endpoint] || 0) + 1;
    }

    // Update error rate
    this.updateErrorRate();

    this.logger.error(`Error recorded: ${errorType}`, error.stack, 'Monitoring');
    this.eventEmitter.emit('error.recorded', { type: errorType, error });
  }

  recordSecurityEvent(eventType: 'failedLogin' | 'suspiciousRequest' | 'blockedRequest' | 'rateLimitHit'): void {
    switch (eventType) {
      case 'failedLogin':
        this._metrics.security.failedLogins++;
        break;
      case 'suspiciousRequest':
        this._metrics.security.suspiciousRequests++;
        break;
      case 'blockedRequest':
        this._metrics.security.blockedRequests++;
        break;
      case 'rateLimitHit':
        this._metrics.security.rateLimitHits++;
        break;
    }

    // Update security event rate
    this.updateSecurityEventRate();

    this.logger.warn(`Security event: ${eventType}`, 'Security');
    this.eventEmitter.emit('security.event', { type: eventType });
  }

  recordWebSocketEvent(eventType: 'connection' | 'disconnection' | 'messageSent' | 'messageReceived' | 'error'): void {
    switch (eventType) {
      case 'connection':
        this._metrics.websocket.activeConnections++;
        break;
      case 'disconnection':
        this._metrics.websocket.activeConnections = Math.max(0, this._metrics.websocket.activeConnections - 1);
        break;
      case 'messageSent':
        this._metrics.websocket.messagesSent++;
        break;
      case 'messageReceived':
        this._metrics.websocket.messagesReceived++;
        break;
      case 'error':
        this._metrics.websocket.connectionErrors++;
        break;
    }

    // Update WebSocket rates
    this.updateWebSocketRates();

    this.eventEmitter.emit('websocket.event', { type: eventType });
  }

  recordBusinessEvent(
    eventType: 'offerCreated' | 'offerCompleted' | 'taskCreated' | 'taskCompleted' | 'fileUploaded'
  ): void {
    switch (eventType) {
      case 'offerCreated':
        this._metrics.business.activeOffers++;
        break;
      case 'offerCompleted':
        this._metrics.business.activeOffers = Math.max(0, this._metrics.business.activeOffers - 1);
        this._metrics.business.completedOffers++;
        break;
      case 'taskCreated':
        this._metrics.business.pendingTasks++;
        break;
      case 'taskCompleted':
        this._metrics.business.pendingTasks = Math.max(0, this._metrics.business.pendingTasks - 1);
        this._metrics.business.completedTasks++;
        break;
      case 'fileUploaded':
        this._metrics.business.fileUploads++;
        break;
    }

    // Update business rates
    this.updateBusinessRates();

    this.eventEmitter.emit('business.event', { type: eventType });
  }

  updatePerformanceMetrics(): void {
    const memoryUsage = process.memoryUsage();
    this._metrics.performance.memoryUsage = memoryUsage.heapUsed; // Use actual bytes

    // Simple CPU usage approximation
    const startUsage = process.cpuUsage();
    setTimeout(() => {
      const endUsage = process.cpuUsage(startUsage);
      this._metrics.performance.cpuUsage = (endUsage.user + endUsage.system) / 1000000; // Convert to seconds
    }, 100);
  }

  async updateDatabaseMetrics(): Promise<void> {
    try {
      const connectionMetrics = await this.databaseMetricsService.getConnectionMetrics();
      this._metrics.performance.databaseConnections = connectionMetrics.activeConnections;
    } catch (error) {
      this.logger.error('Failed to update database metrics', error);
    }
  }

  async updateBusinessMetrics(): Promise<void> {
    try {
      const businessMetrics = await this.businessMetricsService.getBusinessMetrics();
      this._metrics.business = {
        ...this._metrics.business,
        activeOffers: businessMetrics.activeOffers,
        completedOffers: businessMetrics.completedOffers,
        activeInvoices: businessMetrics.activeInvoices,
        pendingTasks: businessMetrics.pendingTasks,
        completedTasks: businessMetrics.completedTasks,
        activeUsers: businessMetrics.activeUsers,
        fileUploads: businessMetrics.fileUploads
      };
    } catch (error) {
      this.logger.error('Failed to update business metrics', error);
    }
  }

  getMetrics(): IMetrics {
    return { ...this._metrics };
  }

  resetMetrics(): void {
    this._metrics = {
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        averageResponseTime: 0,
        byEndpoint: {},
        byMethod: {},
        responseTimeHistogram: { p50: 0, p90: 0, p95: 0, p99: 0 },
        requestRate: 0,
        errorRate: 0
      },
      errors: {
        total: 0,
        byType: {},
        byEndpoint: {},
        errorRate: 0,
        errorTrend: 0
      },
      performance: {
        memoryUsage: 0,
        cpuUsage: 0,
        activeConnections: 0,
        databaseConnections: 0,
        databaseQueryTime: 0,
        memoryTrend: 0,
        cpuTrend: 0,
        databaseQueryRate: 0
      },
      security: {
        failedLogins: 0,
        suspiciousRequests: 0,
        blockedRequests: 0,
        rateLimitHits: 0,
        failedLoginRate: 0,
        securityEventRate: 0
      },
      business: {
        activeOffers: 0,
        completedOffers: 0,
        activeInvoices: 0,
        pendingTasks: 0,
        completedTasks: 0,
        activeUsers: 0,
        fileUploads: 0,
        offerCreationRate: 0,
        taskCompletionRate: 0,
        userActivityRate: 0
      },
      websocket: {
        activeConnections: 0,
        messagesSent: 0,
        messagesReceived: 0,
        connectionErrors: 0,
        messageRate: 0,
        connectionRate: 0
      },
      timeSeries: {
        timestamps: [],
        requestRates: [],
        responseTimes: [],
        errorRates: [],
        memoryUsage: [],
        cpuUsage: []
      }
    };
    this._timeSeriesData = {
      timestamps: [],
      requestRates: [],
      responseTimes: [],
      errorRates: [],
      memoryUsage: [],
      cpuUsage: []
    };
    this._requestWindow = [];
    this._errorWindow = [];
    this._lastUpdate = Date.now();
  }

  private startPeriodicMetricsCollection(): void {
    setInterval(async () => {
      this.updatePerformanceMetrics();
      await this.updateDatabaseMetrics();
      await this.updateBusinessMetrics();
      this.logMetrics();
    }, 3600000); // Every 1 hour
  }

  private logMetrics(): void {
    const logData = {
      timestamp: new Date().toISOString(),
      metrics: this._metrics,
      performance: {
        memoryUsage: `${(this._metrics.performance.memoryUsage * 100).toFixed(2)}%`,
        cpuUsage: `${this._metrics.performance.cpuUsage.toFixed(2)}s`,
        responseTime: `${this._metrics.requests.averageResponseTime.toFixed(2)}ms`,
        databaseConnections: this._metrics.performance.databaseConnections
      },
      business: {
        activeOffers: this._metrics.business.activeOffers,
        pendingTasks: this._metrics.business.pendingTasks,
        activeUsers: this._metrics.business.activeUsers
      },
      websocket: {
        activeConnections: this._metrics.websocket.activeConnections,
        messagesSent: this._metrics.websocket.messagesSent,
        messagesReceived: this._metrics.websocket.messagesReceived
      }
    };

    this.logger.log('Application metrics snapshot', 'Monitoring', logData);
    this.eventEmitter.emit('metrics.snapshot', logData);
  }

  private updateTimeSeriesData(responseTime: number, _success: boolean): void {
    const now = new Date();

    // Add to time-series data
    this._timeSeriesData.timestamps.push(now);
    this._timeSeriesData.responseTimes.push(responseTime);
    this._timeSeriesData.memoryUsage.push(this._metrics.performance.memoryUsage);
    this._timeSeriesData.cpuUsage.push(this._metrics.performance.cpuUsage);

    // Keep only last 24 hours of data (2880 points at 30-second intervals)
    if (this._timeSeriesData.timestamps.length > 2880) {
      this._timeSeriesData.timestamps.shift();
      this._timeSeriesData.responseTimes.shift();
      this._timeSeriesData.memoryUsage.shift();
      this._timeSeriesData.cpuUsage.shift();
    }

    // Update metrics with time-series data
    this._metrics.timeSeries.timestamps = this._timeSeriesData.timestamps.map((d) => d.toISOString());
    this._metrics.timeSeries.responseTimes = this._timeSeriesData.responseTimes;
    this._metrics.timeSeries.memoryUsage = this._timeSeriesData.memoryUsage;
    this._metrics.timeSeries.cpuUsage = this._timeSeriesData.cpuUsage;

    // Update request rates in time series (calculate from request window)
    const recentRequestRate =
      this._requestWindow.length > 0 ? this._requestWindow.reduce((sum, entry) => sum + entry.count, 0) / 60 : 0;
    this._metrics.timeSeries.requestRates.push(recentRequestRate);

    // Keep requestRates array in sync with other time series data
    if (this._metrics.timeSeries.requestRates.length > this._timeSeriesData.timestamps.length) {
      this._metrics.timeSeries.requestRates = this._metrics.timeSeries.requestRates.slice(
        -this._timeSeriesData.timestamps.length
      );
    }
  }

  private updateRateCalculations(): void {
    const now = Date.now();
    const windowSize = 60000; // 1 minute window

    // Add current request to window
    this._requestWindow.push({ timestamp: new Date(now), count: 1 });

    // Remove old entries from window
    this._requestWindow = this._requestWindow.filter((entry) => now - entry.timestamp.getTime() < windowSize);

    // Calculate request rate (requests per second)
    const totalRequests = this._requestWindow.reduce((sum, entry) => sum + entry.count, 0);
    this._metrics.requests.requestRate = totalRequests / 60; // per second

    // Calculate response time percentiles
    const recentResponseTimes = this._timeSeriesData.responseTimes.slice(-100); // last 100 requests
    if (recentResponseTimes.length > 0) {
      const sorted = [...recentResponseTimes].sort((a, b) => a - b);
      this._metrics.requests.responseTimeHistogram = {
        p50: sorted[Math.floor(sorted.length * 0.5)],
        p90: sorted[Math.floor(sorted.length * 0.9)],
        p95: sorted[Math.floor(sorted.length * 0.95)],
        p99: sorted[Math.floor(sorted.length * 0.99)]
      };
    }
  }

  private updateErrorRate(): void {
    const now = Date.now();
    const windowSize = 60000; // 1 minute window

    // Add current error to window
    this._errorWindow.push({ timestamp: new Date(now), count: 1 });

    // Remove old entries from window
    this._errorWindow = this._errorWindow.filter((entry) => now - entry.timestamp.getTime() < windowSize);

    // Calculate error rate (errors per second)
    const totalErrors = this._errorWindow.reduce((sum, entry) => sum + entry.count, 0);
    this._metrics.errors.errorRate = totalErrors / 60; // per second
    this._metrics.requests.errorRate = totalErrors / 60; // per second
  }

  private updateSecurityEventRate(): void {
    // Calculate security event rate (events per minute)
    const totalSecurityEvents =
      this._metrics.security.failedLogins +
      this._metrics.security.suspiciousRequests +
      this._metrics.security.blockedRequests +
      this._metrics.security.rateLimitHits;

    this._metrics.security.securityEventRate = totalSecurityEvents / 60; // per minute
  }

  private updateWebSocketRates(): void {
    // Calculate WebSocket message rate (messages per second)
    this._metrics.websocket.messageRate =
      (this._metrics.websocket.messagesSent + this._metrics.websocket.messagesReceived) / 60; // per second

    // Calculate connection rate (connections per minute)
    this._metrics.websocket.connectionRate = this._metrics.websocket.activeConnections; // per minute (current count)
  }

  private updateBusinessRates(): void {
    // Calculate business rates
    this._metrics.business.offerCreationRate = this._metrics.business.activeOffers / 3600; // per hour
    this._metrics.business.taskCompletionRate = this._metrics.business.completedTasks / 3600; // per hour
    this._metrics.business.userActivityRate = this._metrics.business.activeUsers / 3600; // per hour
  }

  private async updateMetrics(): Promise<void> {
    // Update performance metrics
    this._metrics.performance.memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    this._metrics.performance.cpuUsage = process.cpuUsage().user / 1000000;

    // Update database metrics
    const connectionMetrics = await this.databaseMetricsService.getConnectionMetrics();
    const queryMetrics = await this.databaseMetricsService.getQueryMetrics();
    this._metrics.performance.databaseConnections = connectionMetrics.activeConnections;
    this._metrics.performance.databaseQueryTime = 0; // Will be calculated from query metrics
    this._metrics.performance.databaseQueryRate = queryMetrics.activeQueries;

    // Update business metrics (preserve rate calculations)
    const businessMetrics = await this.businessMetricsService.getBusinessMetrics();
    const currentRates = {
      offerCreationRate: this._metrics.business.offerCreationRate,
      taskCompletionRate: this._metrics.business.taskCompletionRate,
      userActivityRate: this._metrics.business.userActivityRate
    };

    this._metrics.business = {
      ...this._metrics.business,
      ...businessMetrics,
      ...currentRates // Preserve calculated rates
    };

    // Update active connections (approximation based on request activity)
    this._metrics.performance.activeConnections = this._requestWindow.length;

    // Calculate trends (simple linear regression over last 10 points)
    this.calculateTrends();
  }

  private calculateTrends(): void {
    // Calculate memory trend
    if (this._timeSeriesData.memoryUsage.length >= 10) {
      const recentMemory = this._timeSeriesData.memoryUsage.slice(-10);
      this._metrics.performance.memoryTrend = this.calculateLinearTrend(recentMemory);
    }

    // Calculate CPU trend
    if (this._timeSeriesData.cpuUsage.length >= 10) {
      const recentCpu = this._timeSeriesData.cpuUsage.slice(-10);
      this._metrics.performance.cpuTrend = this.calculateLinearTrend(recentCpu);
    }

    // Calculate error trend
    if (this._errorWindow.length >= 10) {
      const recentErrors = this._errorWindow.slice(-10).map((entry) => entry.count);
      this._metrics.errors.errorTrend = this.calculateLinearTrend(recentErrors);
    }
  }

  private calculateLinearTrend(values: number[]): number {
    if (values.length < 2) return 0;

    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  private cleanupTimeSeriesData(): void {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago

    this._timeSeriesData.timestamps = this._timeSeriesData.timestamps.filter(
      (timestamp) => timestamp.getTime() > cutoff
    );
    this._timeSeriesData.responseTimes = this._timeSeriesData.responseTimes.slice(
      -this._timeSeriesData.timestamps.length
    );
    this._timeSeriesData.memoryUsage = this._timeSeriesData.memoryUsage.slice(-this._timeSeriesData.timestamps.length);
    this._timeSeriesData.cpuUsage = this._timeSeriesData.cpuUsage.slice(-this._timeSeriesData.timestamps.length);

    // Clean up requestRates array to match other time series data
    this._metrics.timeSeries.requestRates = this._metrics.timeSeries.requestRates.slice(
      -this._timeSeriesData.timestamps.length
    );
  }
}
