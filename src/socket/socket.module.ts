import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { CadrartAuthModule } from '../modules/auth/auth.module';

import { CadrartAppGateway } from './app.gateway';
import { CadrartSocketService } from './socket.service';
import { WsAuthGuard } from './ws-auth.guard';

@Global()
@Module({
  imports: [
    CadrartAuthModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('CADRART_JWT_SECRET'),
        signOptions: { expiresIn: '7d' }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [],
  providers: [CadrartAppGateway, CadrartSocketService, WsAuthGuard],
  exports: [CadrartSocketService]
})
export class CadrartSocketModule {}
