# Monitoring and Logging System

This document describes the comprehensive monitoring and logging system implemented in the Cadrart backend application.

## Overview

The monitoring system provides:
- Structured logging with different levels
- Request/response logging with performance metrics
- Error tracking and categorization
- Health checks for application status
- Metrics collection for monitoring systems
- Security event tracking

## Components

### 1. Logging Configuration (`src/config/logging.config.ts`)

**Features:**
- Configurable log levels (debug, info, warn, error, verbose)
- Environment-based configuration
- Logging utilities and interfaces

**Configuration:**
```typescript
interface ILogConfig {
  level: string;                    // Log level (debug, info, warn, error, verbose)
  enableConsole: boolean;           // Enable console logging
  enableFile: boolean;              // Enable file logging (production)
  enableStructured: boolean;        // Use JSON format
  logDirectory: string;             // Log file directory
  maxFileSize: string;              // Max log file size (e.g., '10m')
  maxFiles: number;                 // Number of log files to keep
  enableRequestLogging: boolean;    // Log HTTP requests
  enablePerformanceLogging: boolean; // Log performance metrics
  enableSecurityLogging: boolean;   // Log security events
}
```

**Environment Variables:**
- `LOG_LEVEL`: Set log level (default: 'info' in production, 'debug' in development)
- `LOG_DIRECTORY`: Log file directory (default: '/var/log/cadrart')
- `NODE_ENV`: Environment (affects logging behavior)

### 2. Request Logging Middleware (`src/middleware/logging.middleware.ts`)

**Features:**
- Unique request ID generation
- Request/response timing
- User identification from JWT
- Header sanitization (removes sensitive data)
- Performance warnings for slow requests (>1000ms)
- Integration with monitoring service

**Logged Data:**
- Request ID, method, URL, IP, user agent
- User ID (if authenticated)
- Response status code and timing
- Sanitized headers (sensitive data redacted)

### 3. Health Checks (`src/controllers/health.controller.ts`)

**Endpoints:**
- `GET /health`: Comprehensive health status
- `GET /health/ready`: Readiness probe
- `GET /health/live`: Liveness probe

**Health Status Response:**
```json
{
  "status": "healthy|unhealthy|degraded",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "production",
  "system": {
    "memory": {
      "total": 8589934592,
      "used": 4294967296,
      "free": 4294967296,
      "percentage": 50.0
    },
    "cpu": {
      "loadAverage": [1.5, 1.2, 1.0],
      "cores": 8
    },
    "platform": "linux",
    "nodeVersion": "v18.17.0"
  },
  "services": {
    "database": "healthy"
  }
}
```

### 4. Monitoring Service (`src/services/monitoring.service.ts`)

**Features:**
- Request metrics (total, successful, failed, average response time)
- Error tracking by type
- Performance metrics (memory, CPU usage)
- Security event tracking
- Event emission for external monitoring

**Metrics Collected:**
- HTTP request statistics
- Error counts by type
- Memory and CPU usage
- Security events (failed logins, suspicious requests, blocked requests)

### 5. Metrics Endpoints (`src/controllers/metrics.controller.ts`)

**Endpoints:**
- `GET /metrics`: JSON format metrics
- `GET /metrics/prometheus`: Prometheus-compatible metrics

**Prometheus Metrics:**
```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{status="success"} 1500
http_requests_total{status="error"} 25

# HELP http_request_duration_seconds Average HTTP request duration
# TYPE http_request_duration_seconds gauge
http_request_duration_seconds 0.125

# HELP http_errors_total Total number of HTTP errors
# TYPE http_errors_total counter
http_errors_total 25

# HELP process_memory_usage_bytes Memory usage in bytes
# TYPE process_memory_usage_bytes gauge
process_memory_usage_bytes 75.5

# HELP security_failed_logins_total Total number of failed login attempts
# TYPE security_failed_logins_total counter
security_failed_logins_total 5
```

### 6. Error Logging Interceptor (`src/interceptors/error-logging.interceptor.ts`)

**Features:**
- **Global automatic error capture** and logging
- Error categorization (HTTP exceptions, custom errors)
- Integration with monitoring service
- Detailed error context (request ID, user ID, request details)
- Different log levels for client vs server errors
- Applied globally using `APP_INTERCEPTOR` token

## Usage

### Basic Logging

```typescript
import { Logger } from '@nestjs/common';

export class MyService {
  private readonly logger = new Logger('MyService');

  doSomething() {
    this.logger.log('Operation started', 'MyService');
    // ... operation
    this.logger.log('Operation completed', 'MyService');
  }
}
```

### Error Handling

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { MonitoringService } from '../services/monitoring.service';

@Injectable()
export class MyService {
  constructor(private readonly monitoringService: MonitoringService) {}

  async riskyOperation() {
    try {
      // ... operation
    } catch (error) {
      this.monitoringService.recordError('DatabaseError', error);
      throw error;
    }
  }
}
```

### Security Event Tracking

```typescript
// In auth service
this.monitoringService.recordSecurityEvent('failedLogin');

// In security middleware
this.monitoringService.recordSecurityEvent('suspiciousRequest');
```

## Monitoring Integration

### Prometheus

The application exposes Prometheus-compatible metrics at `/metrics/prometheus` that can be scraped by Prometheus:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'cadrart-backend'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics/prometheus'
    scrape_interval: 15s
```

### Grafana Dashboards

Create dashboards using the following metrics:
- `http_requests_total`: Request rate and error rate
- `http_request_duration_seconds`: Response time percentiles
- `process_memory_usage_bytes`: Memory usage trends
- `security_failed_logins_total`: Security event monitoring

### Kubernetes Health Checks

Configure Kubernetes probes using the health endpoints:

```yaml
# deployment.yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

## Best Practices

### 1. Log Levels
- **DEBUG**: Detailed information for debugging
- **INFO**: General application flow
- **WARN**: Potentially harmful situations
- **ERROR**: Error events that might still allow the application to continue
- **VERBOSE**: More detailed information than debug

### 2. Sensitive Data
- Never log passwords, tokens, or API keys
- Use the sanitization functions provided
- Be careful with user input in logs

### 3. Performance
- Use structured logging for better parsing
- Avoid logging in hot paths
- Use appropriate log levels

### 4. Monitoring
- Set up alerts for error rates > 5%
- Monitor response time percentiles
- Track security events
- Set up dashboards for key metrics

## Troubleshooting

### Common Issues

1. **High Memory Usage**
   - Check `/health` endpoint for memory percentage
   - Review recent deployments
   - Check for memory leaks in application code

2. **High Error Rate**
   - Check `/metrics` for error breakdown
   - Review application logs
   - Check external service dependencies

3. **Slow Response Times**
   - Monitor `/metrics` for average response time
   - Check database performance
   - Review recent code changes

### Log Analysis

Use structured logging to analyze logs:

```bash
# Find all errors
grep '"level":"error"' /var/log/cadrart/app.log

# Find slow requests
grep '"responseTime":"[0-9]\{4,\}ms"' /var/log/cadrart/app.log

# Find requests by user
grep '"userId":"123"' /var/log/cadrart/app.log
```

## Configuration

### Environment Variables

```bash
# Logging
LOG_LEVEL=info
LOG_DIRECTORY=/var/log/cadrart
NODE_ENV=production

# Monitoring
ENABLE_METRICS=true
ENABLE_HEALTH_CHECKS=true
```

### Docker Configuration

```dockerfile
# Create log directory
RUN mkdir -p /var/log/cadrart && \
    chown node:node /var/log/cadrart

# Set log directory volume
VOLUME /var/log/cadrart
```

This monitoring system provides comprehensive visibility into application health, performance, and security, enabling proactive maintenance and quick issue resolution. 
