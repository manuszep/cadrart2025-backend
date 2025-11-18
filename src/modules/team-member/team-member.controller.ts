import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ICadrartEntityResponse } from '@manuszep/cadrart2025-common';

import { CadrartBaseController } from '../../base/base.controller';
import { CadrartTeamMember } from '../../entities/team-member.entity';

import { CadrartTeamMemberService } from './team-member.service';

@Controller('team-member')
export class CadrartTeamMemberController extends CadrartBaseController<CadrartTeamMember> {
  constructor(private readonly teamMemberService: CadrartTeamMemberService) {
    super(teamMemberService);
  }

  override getLabelForOption(entity: CadrartTeamMember): string {
    return `${entity.firstName} ${entity.lastName}`;
  }

  @Get('image/:mail')
  async findOneByMail(
    @Res() res: Response,
    @Param('mail') mail: string
  ): Promise<Response<ICadrartEntityResponse<{ image: string }>>> {
    const entity = await this.teamMemberService.findOneByEmail(mail);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      entity: { image: entity.image }
    });
  }
}
