export interface ISecurityConfig {
  enableHsts: boolean;
  enableHttpsRedirect: boolean;
  enableSecureCookies: boolean;
  enableCsp: boolean;
  enableXssProtection: boolean;
  enableFrameDeny: boolean;
  enableContentTypeSniffing: boolean;
}

export function getSecurityConfig(): ISecurityConfig {
  const isProduction = process.env.NODE_ENV === 'production';
  const tlsEnabled = process.env.TLS_ENABLED === 'true' || isProduction;

  return {
    enableHsts: tlsEnabled && isProduction,
    enableHttpsRedirect: tlsEnabled,
    enableSecureCookies: tlsEnabled,
    enableCsp: true,
    enableXssProtection: true,
    enableFrameDeny: true,
    enableContentTypeSniffing: false
  };
}

export function getHelmetConfig(): Record<string, unknown> {
  const securityConfig = getSecurityConfig();

  return {
    contentSecurityPolicy: securityConfig.enableCsp
      ? {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", 'wss:', 'ws:'],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
          }
        }
      : false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: securityConfig.enableHsts
      ? {
          maxAge: 31536000, // 1 year
          includeSubDomains: true,
          preload: true
        }
      : false,
    frameguard: securityConfig.enableFrameDeny ? { action: 'deny' } : false,
    xssFilter: securityConfig.enableXssProtection,
    noSniff: securityConfig.enableContentTypeSniffing
  };
}
