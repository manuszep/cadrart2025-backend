import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

import { MonitoringService, IMetrics } from '../services/monitoring.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get()
  async getMetrics(@Res() res: Response): Promise<Response<unknown>> {
    const metrics = this.monitoringService.getMetrics();

    return res.json({
      timestamp: new Date().toISOString(),
      metrics
    });
  }

  @Get('prometheus')
  async getPrometheusMetrics(@Res() res: Response): Promise<Response<string>> {
    const metrics = this.monitoringService.getMetrics();

    // Format metrics in Prometheus format
    const prometheusMetrics = this.formatPrometheusMetrics(metrics);

    res.setHeader('Content-Type', 'text/plain');
    return res.send(prometheusMetrics);
  }

  private formatPrometheusMetrics(metrics: IMetrics): string {
    const lines: string[] = [];

    // Request metrics
    lines.push(`# HELP http_requests_total Total number of HTTP requests`);
    lines.push(`# TYPE http_requests_total counter`);
    lines.push(`http_requests_total{status="success"} ${metrics.requests.successful}`);
    lines.push(`http_requests_total{status="error"} ${metrics.requests.failed}`);

    // Response time metrics
    lines.push(`# HELP http_request_duration_seconds Average HTTP request duration`);
    lines.push(`# TYPE http_request_duration_seconds gauge`);
    lines.push(`http_request_duration_seconds ${metrics.requests.averageResponseTime / 1000}`);

    // Error metrics
    lines.push(`# HELP http_errors_total Total number of HTTP errors`);
    lines.push(`# TYPE http_errors_total counter`);
    lines.push(`http_errors_total ${metrics.errors.total}`);

    // Memory metrics
    lines.push(`# HELP process_memory_usage_bytes Memory usage in bytes`);
    lines.push(`# TYPE process_memory_usage_bytes gauge`);
    lines.push(`process_memory_usage_bytes ${metrics.performance.memoryUsage * 100}`);

    // Security metrics
    lines.push(`# HELP security_failed_logins_total Total number of failed login attempts`);
    lines.push(`# TYPE security_failed_logins_total counter`);
    lines.push(`security_failed_logins_total ${metrics.security.failedLogins}`);

    lines.push(`# HELP security_suspicious_requests_total Total number of suspicious requests`);
    lines.push(`# TYPE security_suspicious_requests_total counter`);
    lines.push(`security_suspicious_requests_total ${metrics.security.suspiciousRequests}`);

    return lines.join('\n');
  }
}
