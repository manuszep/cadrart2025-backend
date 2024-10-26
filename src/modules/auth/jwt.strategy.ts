import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICadrartTokenPayload } from '@manuszep/cadrart2025-common';
import { Request } from 'express';

import { ICadrartJWTStrategyResponse } from './types';

function cookieExtractor(req: Request): string | null {
  if (req.cookies && req.cookies.accessToken && req.cookies.accessToken.access_token) {
    return req.cookies.accessToken.access_token;
  }

  return null;
}

@Injectable()
export class CadrartJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: config.get('CADRART_JWT_SECRET')
    });
  }

  async validate(payload: ICadrartTokenPayload): Promise<ICadrartJWTStrategyResponse> {
    return { userId: payload.sub, username: payload.username };
  }
}
