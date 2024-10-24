import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ICadrartTeamMember } from '@manuszep/cadrart2025-common';

import { CadrartAuthService } from './auth.service';

@Injectable()
export class CadrartLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: CadrartAuthService) {
    super({ usernameField: 'mail', passwordField: 'password' });
  }

  async validate(
    mail: string,
    pass: string,
  ): Promise<Omit<ICadrartTeamMember, 'password'>> {
    const user = await this.authService.validateUser(mail, pass);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
