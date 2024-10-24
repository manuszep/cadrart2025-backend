import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CadrartTeamMember } from '../../entities/team-member.entity';

import { CadrartTeamMemberController } from './team-member.controller';
import { CadrartTeamMemberService } from './team-member.service';

@Module({
  imports: [TypeOrmModule.forFeature([CadrartTeamMember])],
  controllers: [CadrartTeamMemberController],
  providers: [CadrartTeamMemberService],
  exports: [TypeOrmModule, CadrartTeamMemberService]
})
export class CadrartTeamMemberModule {}
