import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Request,
  Response,
  Get,
} from '@nestjs/common';
import { ICadrartIsLoggedInResponse } from '@manuszep/cadrart2025-common';

import { CadrartTeamMemberService } from '../team-member/team-member.service';

import { CadrartAuthService } from './auth.service';
import { CadrartLocalAuthGuard } from './local-auth.guard';
import { CadrartJwtAuthGuard } from './jwt-auth.guard';

@Controller()
export class CadrartLoginController {
  constructor(
    private authService: CadrartAuthService,
    private teamMemberService: CadrartTeamMemberService,
  ) {}

  @UseGuards(CadrartLocalAuthGuard)
  @Post('login')
  async login(
    @Request() req,
    @Body() credentials: { mail: string; password: string },
    @Response() res,
  ) {
    const token = await this.authService.login(req.user);

    res.cookie('accessToken', token, {
      expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
      sameSite: 'strict',
      httpOnly: true,
    });

    return res.send({
      statusCode: HttpStatus.OK,
      user: req.user,
    });
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Get('isLoggedIn')
  async isLoggedIn(
    @Request() req,
    @Res() res,
  ): Promise<ICadrartIsLoggedInResponse> {
    const user = await this.teamMemberService.findOne(req.user.id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      user: user,
    });
  }
}
