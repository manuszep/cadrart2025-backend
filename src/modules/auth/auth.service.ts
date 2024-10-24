import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  ICadrartTeamMember,
  ICadrartTokenPayload,
} from '@manuszep/cadrart2025-common';

import { CadrartTeamMemberService } from '../team-member/team-member.service';

@Injectable()
export class CadrartAuthService {
  constructor(
    private jwtService: JwtService,
    private teamMemberService: CadrartTeamMemberService,
  ) {}

  async validateUser(
    mail: string,
    pass: string,
  ): Promise<Omit<ICadrartTeamMember, 'password'> | null> {
    const teamMember = await this.teamMemberService.findOneByEmail(mail);

    if (!teamMember || !teamMember.password) {
      return null;
    }

    const validPass = await bcrypt.compare(pass, teamMember.password);

    if (validPass) {
      const { password, ...result } = teamMember;

      return result;
    }

    return null;
  }

  async login(
    user: Omit<ICadrartTeamMember, 'password'>,
  ): Promise<{ access_token: string }> {
    const payload: ICadrartTokenPayload = { sub: user.id, username: user.mail };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }
}
