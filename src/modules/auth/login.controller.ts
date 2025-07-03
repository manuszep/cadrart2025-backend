import { Controller, HttpStatus, Post, Res, UseGuards, Get, Param, Request, Body } from '@nestjs/common';
import { ICadrartIsLoggedInResponse } from '@manuszep/cadrart2025-common';
import { Response } from 'express';

import { CadrartTeamMemberService } from '../team-member/team-member.service';
import { LoginDto } from '../../dto/team-member.dto';

import { CadrartAuthService } from './auth.service';
import { CadrartLocalAuthGuard } from './local-auth.guard';
import { CadrartJwtAuthGuard } from './jwt-auth.guard';
import { ICadrartTeamMemberWithoutPassword } from './types';

@Controller()
export class CadrartLoginController {
  constructor(
    private authService: CadrartAuthService,
    private teamMemberService: CadrartTeamMemberService
  ) {}

  @UseGuards(CadrartLocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Request() req: { user: ICadrartTeamMemberWithoutPassword },
    @Res() res: Response
  ): Promise<Response<ICadrartIsLoggedInResponse>> {
    const token = await this.authService.login(req.user);

    res.cookie('accessToken', token, {
      expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
      sameSite: 'strict',
      httpOnly: true
    });

    return res.send({
      statusCode: HttpStatus.OK,
      user: req.user
    });
  }

  @UseGuards(CadrartJwtAuthGuard)
  @Get('isLoggedIn/:id')
  async isLoggedIn(@Param('id') id: string, @Res() res: Response): Promise<ICadrartIsLoggedInResponse> {
    const user = await this.teamMemberService.findOne(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      user: user
    });
  }
}
