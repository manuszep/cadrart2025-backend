import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { MonitoringService } from '../../services/monitoring.service';

import { CadrartAuthService } from './auth.service';
import { ICadrartTeamMemberWithoutPassword } from './types';

@Injectable()
export class CadrartLocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: CadrartAuthService,
    private monitoringService: MonitoringService
  ) {
    super({ usernameField: 'mail', passwordField: 'password' });
  }

  async validate(mail: string, pass: string): Promise<ICadrartTeamMemberWithoutPassword> {
    const user = await this.authService.validateUser(mail, pass);

    if (!user) {
      // Record failed login attempt
      this.monitoringService.recordSecurityEvent('failedLogin');
      throw new UnauthorizedException();
    }

    return user;
  }
}
