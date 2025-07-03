# TLS Configuration Guide

This document describes the TLS (Transport Layer Security) configuration for the Cadrart2025 Backend application.

## Overview

The application uses **TLS termination at the ingress level** with automatic certificate management through cert-manager and Let's Encrypt. The backend application itself runs on HTTP internally, while all external traffic is secured with HTTPS.

## Architecture

```
Internet → Ingress (HTTPS/TLS) → Backend (HTTP) → Database
```

- **Ingress Layer**: Handles TLS termination, SSL redirects, and certificate management
- **Backend Layer**: Runs HTTP internally (no TLS configuration needed)
- **Certificate Management**: Automatic via cert-manager and Let's Encrypt

## Existing Configuration

### ✅ Already Working

1. **Let's Encrypt ClusterIssuer** (`cadrart2025-common/infrastructure/kubernetes/cluster-issuer.yaml`)
   - Production certificates from Let's Encrypt
   - Automatic renewal handled by cert-manager
   - HTTP-01 challenge validation

2. **Ingress TLS Configuration** (`cadrart2025-common/infrastructure/kubernetes/ingress.yaml`)
   - TLS termination at ingress level
   - Automatic SSL redirects
   - WebSocket support
   - Certificate auto-renewal

3. **Security Headers** (via Helmet.js)
   - Content Security Policy
   - XSS Protection
   - Frame denial
   - HSTS (in production)

## Configuration

### Environment Variables

The backend application doesn't need TLS-specific environment variables since TLS is handled at the ingress level.

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3000` | No |
| `CORS_ORIGINS` | Allowed CORS origins | - | Yes |

### Development Mode

In development mode, the application runs on HTTP:

```bash
npm start
```

### Production Mode

In production mode:
1. Backend runs HTTP internally on port 3000
2. Ingress handles HTTPS termination
3. All external traffic is automatically redirected to HTTPS

## Kubernetes Deployment

### Certificate Management

The application uses cert-manager with Let's Encrypt for automatic certificate management:

1. **ClusterIssuer**: `letsencrypt-prod` configured for production certificates
2. **Ingress**: Configured with TLS termination and automatic redirects
3. **Auto-renewal**: cert-manager automatically renews certificates before expiration

### Security Features

- **HSTS**: HTTP Strict Transport Security enabled in production
- **HTTPS Redirect**: Automatic redirect from HTTP to HTTPS at ingress level
- **Secure Headers**: Comprehensive security headers via Helmet.js
- **CSP**: Content Security Policy configured
- **XSS Protection**: Cross-site scripting protection enabled

### Ingress Configuration

The ingress is configured with:
- SSL termination at the ingress level
- Force SSL redirect enabled
- WebSocket support for real-time features
- Automatic certificate renewal via cert-manager

## Security Headers

The application includes the following security headers:

- **Content-Security-Policy**: Restricts resource loading
- **Strict-Transport-Security**: Enforces HTTPS in production
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-XSS-Protection**: Basic XSS protection

## CORS Configuration

CORS is configured to work with both HTTP and HTTPS:

- Origins are configurable via `CORS_ORIGINS` environment variable
- Credentials are supported for authenticated requests
- WebSocket connections are properly configured

## Monitoring

Monitor TLS configuration with:

```bash
# Check certificate status
kubectl get certificates -n cadrart

# Check cert-manager logs
kubectl logs -n cert-manager deployment/cert-manager

# Check ingress status
kubectl describe ingress cadrart-ingress -n cadrart

# Check certificate expiration
kubectl get secret example-tls -n cadrart -o jsonpath='{.data.tls\.crt}' | base64 -d | openssl x509 -noout -enddate
```

## Troubleshooting

### Certificate Issues

1. **Certificate not found**: Ensure cert-manager is installed and ClusterIssuer is configured
2. **Certificate expired**: Check cert-manager logs for renewal issues
3. **Wrong certificate**: Verify the secret name in ingress configuration

### HTTPS Redirect Issues

1. **Redirect loop**: Check if the application is behind a load balancer
2. **Mixed content**: Ensure all resources are served over HTTPS

### Development Issues

1. **TLS in development**: Not needed - use HTTP for local development
2. **Certificate errors**: Not applicable - TLS handled at ingress level

## Best Practices

1. **Always use HTTPS in production** (handled by ingress)
2. **Keep certificates up to date** (automatic via cert-manager)
3. **Monitor certificate expiration** (automatic monitoring)
4. **Use secure cookie settings** (configured in application)
5. **Implement proper error handling** (already in place)
6. **Test TLS configuration in staging environment**

## Related Files

- `src/config/security.config.ts` - Security headers configuration
- `src/middleware/https-redirect.middleware.ts` - HTTPS redirect middleware (for edge cases)
- `infrastructure/kubernetes/deployment.yaml` - Kubernetes deployment
- `cadrart2025-common/infrastructure/kubernetes/ingress.yaml` - Ingress configuration
- `cadrart2025-common/infrastructure/kubernetes/cluster-issuer.yaml` - Let's Encrypt configuration

## Deployment

To deploy with TLS:

```bash
# Apply the ClusterIssuer (if not already applied)
kubectl apply -f cadrart2025-common/infrastructure/kubernetes/cluster-issuer.yaml

# Apply the ingress with your domain
DOMAIN_NAME=yourdomain.com ./cadrart2025-common/infrastructure/kubernetes/apply-ingress.sh

# Deploy the backend
kubectl apply -f infrastructure/kubernetes/deployment.yaml
```

The TLS configuration is **already complete and working** with automatic certificate renewal! 
