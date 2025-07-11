import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CadrartTeamMemberModule } from '../team-member/team-member.module';
import { MonitoringModule } from '../../services/monitoring.module';

import { CadrartAuthService } from './auth.service';
import { CadrartLoginController } from './login.controller';
import { CadrartLocalStrategy } from './local.strategy';
import { CadrartJwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        global: true,
        secret: config.get('CADRART_JWT_SECRET'),
        signOptions: { expiresIn: '7d' }
      }),
      inject: [ConfigService]
    }),
    CadrartTeamMemberModule,
    MonitoringModule
  ],
  controllers: [CadrartLoginController],
  providers: [CadrartAuthService, CadrartLocalStrategy, CadrartJwtStrategy],
  exports: [CadrartAuthService, JwtModule]
})
export class CadrartAuthModule {}
