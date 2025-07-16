export interface ISecurityConfig {
  enableHsts: boolean;
  enableHttpsRedirect: boolean;
  enableSecureCookies: boolean;
  enableCsp: boolean;
  enableXssProtection: boolean;
  enableFrameDeny: boolean;
  enableContentTypeSniffing: boolean;
  enableReferrerPolicy: boolean;
  enablePermissionsPolicy: boolean;
}

export function getSecurityConfig(): ISecurityConfig {
  const isProduction = process.env.NODE_ENV === 'production';
  const tlsEnabled = process.env.TLS_ENABLED === 'true' || (isProduction && process.env.TLS_ENABLED !== 'false');

  return {
    enableHsts: tlsEnabled && isProduction,
    enableHttpsRedirect: tlsEnabled,
    enableSecureCookies: tlsEnabled,
    enableCsp: true,
    enableXssProtection: true,
    enableFrameDeny: true,
    enableContentTypeSniffing: false,
    enableReferrerPolicy: true,
    enablePermissionsPolicy: true
  };
}

export function getHelmetConfig(): Record<string, unknown> {
  const securityConfig = getSecurityConfig();

  const cspConfig: Record<string, unknown> = {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'wss:', 'ws:'],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  };

  if (securityConfig.enableHttpsRedirect) {
    cspConfig.upgradeInsecureRequests = true;
  }

  return {
    contentSecurityPolicy: securityConfig.enableCsp ? cspConfig : false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    hsts: securityConfig.enableHsts
      ? {
          maxAge: 31536000, // 1 year
          includeSubDomains: true,
          preload: true
        }
      : false,
    frameguard: securityConfig.enableFrameDeny ? { action: 'deny' } : false,
    xssFilter: securityConfig.enableXssProtection,
    noSniff: securityConfig.enableContentTypeSniffing,
    referrerPolicy: securityConfig.enableReferrerPolicy ? { policy: 'strict-origin-when-cross-origin' } : false,
    permissionsPolicy: securityConfig.enablePermissionsPolicy
      ? {
          features: {
            camera: ["'none'"],
            microphone: ["'none'"],
            geolocation: ["'none'"],
            payment: ["'none'"]
          }
        }
      : false
  };
}
