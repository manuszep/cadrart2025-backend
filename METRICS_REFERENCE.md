TODO:

- Logging will be done on a mongoDb instance
- Logging format will be the one that suits better the API application
- In order to exploit the logs with Prometheus, we'll create a custom exporter (see https://prometheus.io/docs/instrumenting/exporters/ for examples)


# Cadrart Prometheus Metrics Reference

This document provides a comprehensive reference for all Prometheus metrics exposed by the Cadrart backend application. All metrics are prefixed with `cadrart_` for easy identification.

## Quick Start

### Accessing Metrics

```bash
# Set your metrics API key
export METRICS_API_KEY="your-api-key-here"

# Fetch metrics
curl -H "Authorization: Bearer $METRICS_API_KEY" \
     http://localhost:3000/api/metrics/prometheus
```

### Testing Metrics

```bash
# Run the test script
./test-metrics.sh
```

## Application Information

### `cadrart_app_info`
- **Type**: Gauge
- **Description**: Application information and version
- **Labels**: `version`, `name`
- **Example**: `cadrart_app_info{version="1.0.0",name="cadrart-backend"} 1`

## HTTP Request Metrics

### `cadrart_http_requests_total`
- **Type**: Counter
- **Description**: Total number of HTTP requests (excludes technical endpoints like /metrics, /health, /version, /test)
- **Labels**: `status` (success/error), `type` (business)
- **Example**: `cadrart_http_requests_total{status="success",type="business"} 150`

### `cadrart_http_request_rate_requests_per_second`
- **Type**: Gauge
- **Description**: Current HTTP request rate
- **Example**: `cadrart_http_request_rate_requests_per_second 2.5`

### `cadrart_http_request_duration_seconds`
- **Type**: Gauge
- **Description**: HTTP request duration percentiles
- **Labels**: `quantile` (0.5, 0.9, 0.95, 0.99)
- **Example**: `cadrart_http_request_duration_seconds{quantile="0.95"} 0.125`

### `cadrart_http_request_duration_average_seconds`
- **Type**: Gauge
- **Description**: Average HTTP request duration
- **Example**: `cadrart_http_request_duration_average_seconds 0.085`

## Error Metrics

### `cadrart_http_errors_total`
- **Type**: Counter
- **Description**: Total number of HTTP errors
- **Example**: `cadrart_http_errors_total 12`

### `cadrart_http_error_rate_errors_per_second`
- **Type**: Gauge
- **Description**: Current HTTP error rate
- **Example**: `cadrart_http_error_rate_errors_per_second 0.1`

### `cadrart_http_error_trend`
- **Type**: Gauge
- **Description**: Error rate trend (positive = increasing)
- **Example**: `cadrart_http_error_trend 0.05`

## Performance Metrics

### `cadrart_process_memory_usage_bytes`
- **Type**: Gauge
- **Description**: Memory usage in bytes
- **Example**: `cadrart_process_memory_usage_bytes 52428800`

### `cadrart_process_memory_trend`
- **Type**: Gauge
- **Description**: Memory usage trend (positive = increasing)
- **Example**: `cadrart_process_memory_trend 0.02`

### `cadrart_process_cpu_usage_seconds`
- **Type**: Gauge
- **Description**: CPU usage in seconds
- **Example**: `cadrart_process_cpu_usage_seconds 45.2`

### `cadrart_process_cpu_trend`
- **Type**: Gauge
- **Description**: CPU usage trend (positive = increasing)
- **Example**: `cadrart_process_cpu_trend 0.01`

### `cadrart_process_active_connections`
- **Type**: Gauge
- **Description**: Number of active connections
- **Example**: `cadrart_process_active_connections 5`

## Database Metrics

### `cadrart_database_connections_active`
- **Type**: Gauge
- **Description**: Active database connections
- **Example**: `cadrart_database_connections_active 3`

### `cadrart_database_query_duration_seconds`
- **Type**: Gauge
- **Description**: Average database query duration
- **Example**: `cadrart_database_query_duration_seconds 0.015`

### `cadrart_database_query_rate_queries_per_second`
- **Type**: Gauge
- **Description**: Database query rate
- **Example**: `cadrart_database_query_rate_queries_per_second 25.5`

## Security Metrics

### `cadrart_security_failed_logins_total`
- **Type**: Counter
- **Description**: Total number of failed login attempts
- **Example**: `cadrart_security_failed_logins_total 8`

### `cadrart_security_failed_login_rate_logins_per_minute`
- **Type**: Gauge
- **Description**: Failed login rate
- **Example**: `cadrart_security_failed_login_rate_logins_per_minute 0.2`

### `cadrart_security_suspicious_requests_total`
- **Type**: Counter
- **Description**: Total number of suspicious requests
- **Example**: `cadrart_security_suspicious_requests_total 3`

### `cadrart_security_blocked_requests_total`
- **Type**: Counter
- **Description**: Total number of blocked requests
- **Example**: `cadrart_security_blocked_requests_total 1`

### `cadrart_security_rate_limit_hits_total`
- **Type**: Counter
- **Description**: Total number of rate limit hits
- **Example**: `cadrart_security_rate_limit_hits_total 5`

### `cadrart_security_event_rate_events_per_minute`
- **Type**: Gauge
- **Description**: Security event rate
- **Example**: `cadrart_security_event_rate_events_per_minute 0.3`

## Business Metrics

### `cadrart_business_active_offers_total`
- **Type**: Gauge
- **Description**: Number of active offers
- **Example**: `cadrart_business_active_offers_total 15`

### `cadrart_business_completed_offers_total`
- **Type**: Gauge
- **Description**: Number of completed offers
- **Example**: `cadrart_business_completed_offers_total 42`

### `cadrart_business_offer_creation_rate_offers_per_hour`
- **Type**: Gauge
- **Description**: Offer creation rate
- **Example**: `cadrart_business_offer_creation_rate_offers_per_hour 2.1`

### `cadrart_business_active_invoices_total`
- **Type**: Gauge
- **Description**: Number of active invoices
- **Example**: `cadrart_business_active_invoices_total 8`

### `cadrart_business_pending_tasks_total`
- **Type**: Gauge
- **Description**: Number of pending tasks
- **Example**: `cadrart_business_pending_tasks_total 25`

### `cadrart_business_completed_tasks_total`
- **Type**: Gauge
- **Description**: Number of completed tasks
- **Example**: `cadrart_business_completed_tasks_total 156`

### `cadrart_business_task_completion_rate_tasks_per_hour`
- **Type**: Gauge
- **Description**: Task completion rate
- **Example**: `cadrart_business_task_completion_rate_tasks_per_hour 5.2`

### `cadrart_business_active_users_total`
- **Type**: Gauge
- **Description**: Number of active users
- **Example**: `cadrart_business_active_users_total 12`

### `cadrart_business_user_activity_rate_users_per_hour`
- **Type**: Gauge
- **Description**: User activity rate
- **Example**: `cadrart_business_user_activity_rate_users_per_hour 1.8`

### `cadrart_business_file_uploads_total`
- **Type**: Gauge
- **Description**: Number of file uploads
- **Example**: `cadrart_business_file_uploads_total 89`

## WebSocket Metrics

### `cadrart_websocket_active_connections_total`
- **Type**: Gauge
- **Description**: Number of active WebSocket connections
- **Example**: `cadrart_websocket_active_connections_total 3`

### `cadrart_websocket_messages_sent_total`
- **Type**: Counter
- **Description**: Number of WebSocket messages sent
- **Example**: `cadrart_websocket_messages_sent_total 1250`

### `cadrart_websocket_messages_received_total`
- **Type**: Counter
- **Description**: Number of WebSocket messages received
- **Example**: `cadrart_websocket_messages_received_total 1180`

### `cadrart_websocket_message_rate_messages_per_second`
- **Type**: Gauge
- **Description**: WebSocket message rate
- **Example**: `cadrart_websocket_message_rate_messages_per_second 2.1`

### `cadrart_websocket_connection_errors_total`
- **Type**: Counter
- **Description**: Number of WebSocket connection errors
- **Example**: `cadrart_websocket_connection_errors_total 2`

### `cadrart_websocket_connection_rate_connections_per_minute`
- **Type**: Gauge
- **Description**: WebSocket connection rate
- **Example**: `cadrart_websocket_connection_rate_connections_per_minute 0.5`

## Prometheus Queries Examples

### Basic Health Check
```promql
# Check if the application is up
up{job="cadrart-backend-blue"} or up{job="cadrart-backend-green"}
```

### Request Rate Monitoring
```promql
# Request rate over 5 minutes
rate(cadrart_http_requests_total[5m])

# Error rate over 5 minutes
rate(cadrart_http_errors_total[5m])

# Error percentage
rate(cadrart_http_errors_total[5m]) / rate(cadrart_http_requests_total[5m]) * 100
```

### Performance Monitoring
```promql
# Memory usage percentage
cadrart_process_memory_usage_bytes / 1024 / 1024

# CPU usage trend
cadrart_process_cpu_trend

# Database connection pool usage
cadrart_database_connections_active
```

### Business Metrics
```promql
# Active offers trend
cadrart_business_active_offers_total

# Task completion rate
cadrart_business_task_completion_rate_tasks_per_hour

# User activity
cadrart_business_active_users_total
```

### Security Monitoring
```promql
# Failed login attempts
rate(cadrart_security_failed_logins_total[5m])

# Security events
rate(cadrart_security_event_rate_events_per_minute[5m])
```

## Alerting Rules

### High Error Rate
```yaml
- alert: HighErrorRate
  expr: rate(cadrart_http_errors_total[5m]) / rate(cadrart_http_requests_total[5m]) > 0.05
  for: 2m
  labels:
    severity: warning
  annotations:
    summary: "High error rate detected"
    description: "Error rate is {{ $value | humanizePercentage }}"
```

### High Memory Usage
```yaml
- alert: HighMemoryUsage
  expr: cadrart_process_memory_usage_bytes / 1024 / 1024 / 1024 > 1
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "High memory usage"
    description: "Memory usage is {{ $value }}GB"
```

### Failed Login Attempts
```yaml
- alert: FailedLoginAttempts
  expr: rate(cadrart_security_failed_logins_total[5m]) > 0.1
  for: 1m
  labels:
    severity: warning
  annotations:
    summary: "High number of failed login attempts"
    description: "{{ $value }} failed logins per second"
```

## Grafana Dashboard

Create a Grafana dashboard with the following panels:

1. **Application Overview**
   - Request rate
   - Error rate
   - Response time percentiles
   - Active connections

2. **Performance**
   - Memory usage
   - CPU usage
   - Database connections
   - Query performance

3. **Business Metrics**
   - Active offers
   - Pending tasks
   - User activity
   - File uploads

4. **Security**
   - Failed logins
   - Security events
   - Rate limit hits

5. **WebSocket**
   - Active connections
   - Message rates
   - Connection errors

## Troubleshooting

### Metrics Not Appearing
1. Check if the backend is running
2. Verify the METRICS_API_KEY is set correctly
3. Test the endpoint manually: `curl -H "Authorization: Bearer $METRICS_API_KEY" http://localhost:3000/api/metrics/prometheus`
4. Check Prometheus logs for scraping errors

### Authentication Issues
1. Ensure the API key is correctly configured in Prometheus
2. Verify the metrics endpoint requires authentication
3. Check the MetricsAuthGuard configuration

### Missing Metrics
1. Verify the monitoring service is properly integrated
2. Check if business events are being recorded
3. Ensure the backend has received some traffic to generate metrics 
