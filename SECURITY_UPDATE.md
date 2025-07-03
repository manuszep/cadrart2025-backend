# Security Update: Domain Name Configuration

## Overview
This update removes hardcoded domain names from the source code and moves them to environment variables and Kubernetes secrets for better security and flexibility.

## Changes Made

### 1. CORS Configuration (`src/utils/cors.config.ts`)
- Now uses `CORS_ORIGINS` environment variable
- Falls back to `PRODUCTION_ORIGINS` environment variable for production
- Maintains localhost origins for development

### 2. Kubernetes Deployment (`infrastructure/kubernetes/deployment.yaml`)
- Added `CORS_ORIGINS` environment variable from `cadrart-secret`
- Configuration now pulls domain information from Kubernetes secrets

### 3. Ingress Configuration (`cadrart2025-common/infrastructure/kubernetes/ingress.yaml`)
- Replaced hardcoded domain names with `${DOMAIN_NAME}` template variables
- Created `apply-ingress.sh` script for environment variable substitution
- Added documentation and example configuration files

## Deployment Instructions

### 1. Create Kubernetes Secrets
```bash
kubectl create secret generic cadrart-secret \
  --from-literal=CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com" \
  --from-literal=JWT_SECRET="your-jwt-secret" \
  --from-literal=DATABASE_PASSWORD="your-db-password" \
  --from-literal=DATABASE_USER="your-db-user" \
  -n cadrart
```

### 2. Apply Ingress Configuration
```bash
cd cadrart2025-common/infrastructure/kubernetes
DOMAIN_NAME=yourdomain.com ./apply-ingress.sh
```

### 3. Deploy Backend
```bash
kubectl apply -f cadrart2025-backend/infrastructure/kubernetes/
```

## Security Benefits

1. **No Hardcoded Domains**: Domain names are no longer visible in source code
2. **Environment Flexibility**: Different environments can use different domains
3. **Secret Management**: Sensitive configuration is stored in Kubernetes secrets
4. **Easy Updates**: Domain changes don't require code modifications
5. **Version Control Safety**: No sensitive information in git history

## Files Modified

- `cadrart2025-backend/src/utils/cors.config.ts`
- `cadrart2025-backend/infrastructure/kubernetes/deployment.yaml`
- `cadrart2025-common/infrastructure/kubernetes/ingress.yaml`
- `cadrart2025-common/infrastructure/kubernetes/apply-ingress.sh` (new)
- `cadrart2025-common/infrastructure/kubernetes/README.md` (new)
- `cadrart2025-common/infrastructure/kubernetes/secrets-example.yaml` (new)

## Testing

The application will continue to work with localhost origins in development mode. For production, ensure the `CORS_ORIGINS` secret is properly configured with your domain names. 
