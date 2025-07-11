import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { MonitoringService, IMetrics } from '../services/monitoring.service';
import { MetricsAuthGuard } from '../guards/metrics-auth.guard';

interface ISanitizedMetrics {
  requests: {
    total: number;
    successful: number;
    failed: number;
    averageResponseTime: number;
  };
  errors: {
    total: number;
  };
  performance: {
    memoryUsage: number;
  };
  security: {
    failedLogins: number;
    suspiciousRequests: number;
    blockedRequests: number;
    rateLimitHits: number;
  };
  business: {
    activeOffers: number;
    completedOffers: number;
    pendingTasks: number;
    completedTasks: number;
    activeUsers: number;
  };
  websocket: {
    activeConnections: number;
    messagesSent: number;
    messagesReceived: number;
    connectionErrors: number;
  };
}

@Controller('metrics')
@UseGuards(MetricsAuthGuard)
export class MetricsController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get()
  async getMetrics(@Res() res: Response): Promise<Response<unknown>> {
    const metrics = this.monitoringService.getMetrics();

    // Sanitize metrics for public access
    const sanitizedMetrics = this.sanitizeMetrics(metrics);

    return res.json({
      timestamp: new Date().toISOString(),
      metrics: sanitizedMetrics
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

  private sanitizeMetrics(metrics: IMetrics): ISanitizedMetrics {
    // Only expose safe metrics for general access
    return {
      requests: {
        total: metrics.requests.total,
        successful: metrics.requests.successful,
        failed: metrics.requests.failed,
        averageResponseTime: metrics.requests.averageResponseTime
        // Don't expose byEndpoint and byMethod to prevent information disclosure
      },
      errors: {
        total: metrics.errors.total
        // Don't expose byType and byEndpoint details
      },
      performance: {
        memoryUsage: metrics.performance.memoryUsage
        // Don't expose CPU usage, database connections, or query times
      },
      security: {
        failedLogins: metrics.security.failedLogins,
        suspiciousRequests: metrics.security.suspiciousRequests,
        blockedRequests: metrics.security.blockedRequests,
        rateLimitHits: metrics.security.rateLimitHits
      },
      business: {
        activeOffers: metrics.business.activeOffers,
        completedOffers: metrics.business.completedOffers,
        pendingTasks: metrics.business.pendingTasks,
        completedTasks: metrics.business.completedTasks,
        activeUsers: metrics.business.activeUsers
        // Don't expose file uploads or invoice details
      },
      websocket: {
        activeConnections: metrics.websocket.activeConnections,
        messagesSent: metrics.websocket.messagesSent,
        messagesReceived: metrics.websocket.messagesReceived,
        connectionErrors: metrics.websocket.connectionErrors
      }
    };
  }

  private formatPrometheusMetrics(metrics: IMetrics): string {
    const lines: string[] = [];

    // Add application info metric
    lines.push(`# HELP cadrart_app_info Application information`);
    lines.push(`# TYPE cadrart_app_info gauge`);
    lines.push(`cadrart_app_info{version="1.0.0",name="cadrart-backend"} 1`);

    // Request metrics - Counters for time-series data
    lines.push(`# HELP cadrart_http_requests_total Total number of HTTP requests`);
    lines.push(`# TYPE cadrart_http_requests_total counter`);
    lines.push(`cadrart_http_requests_total{status="success"} ${metrics.requests.successful}`);
    lines.push(`cadrart_http_requests_total{status="error"} ${metrics.requests.failed}`);

    // Request rate - Gauge for current rate
    lines.push(`# HELP cadrart_http_request_rate_requests_per_second Current HTTP request rate`);
    lines.push(`# TYPE cadrart_http_request_rate_requests_per_second gauge`);
    lines.push(`cadrart_http_request_rate_requests_per_second ${metrics.requests.requestRate}`);

    // Response time metrics - Histogram percentiles
    lines.push(`# HELP cadrart_http_request_duration_seconds HTTP request duration percentiles`);
    lines.push(`# TYPE cadrart_http_request_duration_seconds gauge`);
    lines.push(
      `cadrart_http_request_duration_seconds{quantile="0.5"} ${metrics.requests.responseTimeHistogram.p50 / 1000}`
    );
    lines.push(
      `cadrart_http_request_duration_seconds{quantile="0.9"} ${metrics.requests.responseTimeHistogram.p90 / 1000}`
    );
    lines.push(
      `cadrart_http_request_duration_seconds{quantile="0.95"} ${metrics.requests.responseTimeHistogram.p95 / 1000}`
    );
    lines.push(
      `cadrart_http_request_duration_seconds{quantile="0.99"} ${metrics.requests.responseTimeHistogram.p99 / 1000}`
    );

    // Average response time
    lines.push(`# HELP cadrart_http_request_duration_average_seconds Average HTTP request duration`);
    lines.push(`# TYPE cadrart_http_request_duration_average_seconds gauge`);
    lines.push(`cadrart_http_request_duration_average_seconds ${metrics.requests.averageResponseTime / 1000}`);

    // Error metrics - Counters and rates
    lines.push(`# HELP cadrart_http_errors_total Total number of HTTP errors`);
    lines.push(`# TYPE cadrart_http_errors_total counter`);
    lines.push(`cadrart_http_errors_total ${metrics.errors.total}`);

    lines.push(`# HELP cadrart_http_error_rate_errors_per_second Current HTTP error rate`);
    lines.push(`# TYPE cadrart_http_error_rate_errors_per_second gauge`);
    lines.push(`cadrart_http_error_rate_errors_per_second ${metrics.errors.errorRate}`);

    lines.push(`# HELP cadrart_http_error_trend Error rate trend (positive = increasing)`);
    lines.push(`# TYPE cadrart_http_error_trend gauge`);
    lines.push(`cadrart_http_error_trend ${metrics.errors.errorTrend}`);

    // Performance metrics - Memory and CPU
    lines.push(`# HELP cadrart_process_memory_usage_bytes Memory usage in bytes`);
    lines.push(`# TYPE cadrart_process_memory_usage_bytes gauge`);
    lines.push(`cadrart_process_memory_usage_bytes ${metrics.performance.memoryUsage * 1024 * 1024}`);

    lines.push(`# HELP cadrart_process_memory_trend Memory usage trend (positive = increasing)`);
    lines.push(`# TYPE cadrart_process_memory_trend gauge`);
    lines.push(`cadrart_process_memory_trend ${metrics.performance.memoryTrend}`);

    lines.push(`# HELP cadrart_process_cpu_usage_seconds CPU usage in seconds`);
    lines.push(`# TYPE cadrart_process_cpu_usage_seconds gauge`);
    lines.push(`cadrart_process_cpu_usage_seconds ${metrics.performance.cpuUsage}`);

    lines.push(`# HELP cadrart_process_cpu_trend CPU usage trend (positive = increasing)`);
    lines.push(`# TYPE cadrart_process_cpu_trend gauge`);
    lines.push(`cadrart_process_cpu_trend ${metrics.performance.cpuTrend}`);

    lines.push(`# HELP cadrart_process_active_connections Number of active connections`);
    lines.push(`# TYPE cadrart_process_active_connections gauge`);
    lines.push(`cadrart_process_active_connections ${metrics.performance.activeConnections}`);

    // Database metrics
    lines.push(`# HELP cadrart_database_connections_active Active database connections`);
    lines.push(`# TYPE cadrart_database_connections_active gauge`);
    lines.push(`cadrart_database_connections_active ${metrics.performance.databaseConnections}`);

    lines.push(`# HELP cadrart_database_query_duration_seconds Average database query duration`);
    lines.push(`# TYPE cadrart_database_query_duration_seconds gauge`);
    lines.push(`cadrart_database_query_duration_seconds ${metrics.performance.databaseQueryTime / 1000}`);

    lines.push(`# HELP cadrart_database_query_rate_queries_per_second Database query rate`);
    lines.push(`# TYPE cadrart_database_query_rate_queries_per_second gauge`);
    lines.push(`cadrart_database_query_rate_queries_per_second ${metrics.performance.databaseQueryRate}`);

    // Security metrics - Counters and rates
    lines.push(`# HELP cadrart_security_failed_logins_total Total number of failed login attempts`);
    lines.push(`# TYPE cadrart_security_failed_logins_total counter`);
    lines.push(`cadrart_security_failed_logins_total ${metrics.security.failedLogins}`);

    lines.push(`# HELP cadrart_security_failed_login_rate_logins_per_minute Failed login rate`);
    lines.push(`# TYPE cadrart_security_failed_login_rate_logins_per_minute gauge`);
    lines.push(`cadrart_security_failed_login_rate_logins_per_minute ${metrics.security.failedLoginRate}`);

    lines.push(`# HELP cadrart_security_suspicious_requests_total Total number of suspicious requests`);
    lines.push(`# TYPE cadrart_security_suspicious_requests_total counter`);
    lines.push(`cadrart_security_suspicious_requests_total ${metrics.security.suspiciousRequests}`);

    lines.push(`# HELP cadrart_security_blocked_requests_total Total number of blocked requests`);
    lines.push(`# TYPE cadrart_security_blocked_requests_total counter`);
    lines.push(`cadrart_security_blocked_requests_total ${metrics.security.blockedRequests}`);

    lines.push(`# HELP cadrart_security_rate_limit_hits_total Total number of rate limit hits`);
    lines.push(`# TYPE cadrart_security_rate_limit_hits_total counter`);
    lines.push(`cadrart_security_rate_limit_hits_total ${metrics.security.rateLimitHits}`);

    lines.push(`# HELP cadrart_security_event_rate_events_per_minute Security event rate`);
    lines.push(`# TYPE cadrart_security_event_rate_events_per_minute gauge`);
    lines.push(`cadrart_security_event_rate_events_per_minute ${metrics.security.securityEventRate}`);

    // Business metrics - Counters and rates
    lines.push(`# HELP cadrart_business_active_offers_total Number of active offers`);
    lines.push(`# TYPE cadrart_business_active_offers_total gauge`);
    lines.push(`cadrart_business_active_offers_total ${metrics.business.activeOffers}`);

    lines.push(`# HELP cadrart_business_completed_offers_total Number of completed offers`);
    lines.push(`# TYPE cadrart_business_completed_offers_total gauge`);
    lines.push(`cadrart_business_completed_offers_total ${metrics.business.completedOffers}`);

    lines.push(`# HELP cadrart_business_offer_creation_rate_offers_per_hour Offer creation rate`);
    lines.push(`# TYPE cadrart_business_offer_creation_rate_offers_per_hour gauge`);
    lines.push(`cadrart_business_offer_creation_rate_offers_per_hour ${metrics.business.offerCreationRate}`);

    lines.push(`# HELP cadrart_business_active_invoices_total Number of active invoices`);
    lines.push(`# TYPE cadrart_business_active_invoices_total gauge`);
    lines.push(`cadrart_business_active_invoices_total ${metrics.business.activeInvoices}`);

    lines.push(`# HELP cadrart_business_pending_tasks_total Number of pending tasks`);
    lines.push(`# TYPE cadrart_business_pending_tasks_total gauge`);
    lines.push(`cadrart_business_pending_tasks_total ${metrics.business.pendingTasks}`);

    lines.push(`# HELP cadrart_business_completed_tasks_total Number of completed tasks`);
    lines.push(`# TYPE cadrart_business_completed_tasks_total gauge`);
    lines.push(`cadrart_business_completed_tasks_total ${metrics.business.completedTasks}`);

    lines.push(`# HELP cadrart_business_task_completion_rate_tasks_per_hour Task completion rate`);
    lines.push(`# TYPE cadrart_business_task_completion_rate_tasks_per_hour gauge`);
    lines.push(`cadrart_business_task_completion_rate_tasks_per_hour ${metrics.business.taskCompletionRate}`);

    lines.push(`# HELP cadrart_business_active_users_total Number of active users`);
    lines.push(`# TYPE cadrart_business_active_users_total gauge`);
    lines.push(`cadrart_business_active_users_total ${metrics.business.activeUsers}`);

    lines.push(`# HELP cadrart_business_user_activity_rate_users_per_hour User activity rate`);
    lines.push(`# TYPE cadrart_business_user_activity_rate_users_per_hour gauge`);
    lines.push(`cadrart_business_user_activity_rate_users_per_hour ${metrics.business.userActivityRate}`);

    lines.push(`# HELP cadrart_business_file_uploads_total Number of file uploads`);
    lines.push(`# TYPE cadrart_business_file_uploads_total gauge`);
    lines.push(`cadrart_business_file_uploads_total ${metrics.business.fileUploads}`);

    // WebSocket metrics - Counters and rates
    lines.push(`# HELP cadrart_websocket_active_connections_total Number of active WebSocket connections`);
    lines.push(`# TYPE cadrart_websocket_active_connections_total gauge`);
    lines.push(`cadrart_websocket_active_connections_total ${metrics.websocket.activeConnections}`);

    lines.push(`# HELP cadrart_websocket_messages_sent_total Number of WebSocket messages sent`);
    lines.push(`# TYPE cadrart_websocket_messages_sent_total counter`);
    lines.push(`cadrart_websocket_messages_sent_total ${metrics.websocket.messagesSent}`);

    lines.push(`# HELP cadrart_websocket_messages_received_total Number of WebSocket messages received`);
    lines.push(`# TYPE cadrart_websocket_messages_received_total counter`);
    lines.push(`cadrart_websocket_messages_received_total ${metrics.websocket.messagesReceived}`);

    lines.push(`# HELP cadrart_websocket_message_rate_messages_per_second WebSocket message rate`);
    lines.push(`# TYPE cadrart_websocket_message_rate_messages_per_second gauge`);
    lines.push(`cadrart_websocket_message_rate_messages_per_second ${metrics.websocket.messageRate}`);

    lines.push(`# HELP cadrart_websocket_connection_errors_total Number of WebSocket connection errors`);
    lines.push(`# TYPE cadrart_websocket_connection_errors_total counter`);
    lines.push(`cadrart_websocket_connection_errors_total ${metrics.websocket.connectionErrors}`);

    lines.push(`# HELP cadrart_websocket_connection_rate_connections_per_minute WebSocket connection rate`);
    lines.push(`# TYPE cadrart_websocket_connection_rate_connections_per_minute gauge`);
    lines.push(`cadrart_websocket_connection_rate_connections_per_minute ${metrics.websocket.connectionRate}`);

    return lines.join('\n');
  }
}
