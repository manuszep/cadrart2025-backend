import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { getSecurityConfig } from '../config/security.config';

@Injectable()
export class HttpsRedirectMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const securityConfig = getSecurityConfig();

    if (securityConfig.enableHttpsRedirect && !req.secure) {
      const httpsUrl = `https://${req.get('host')}${req.url}`;
      res.redirect(301, httpsUrl);
      return;
    }

    next();
  }
}
