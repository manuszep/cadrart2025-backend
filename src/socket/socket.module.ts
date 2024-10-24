import { Module, Global } from '@nestjs/common';

import { CadrartAppGateway } from './app.gateway';
import { CadrartSocketService } from './socket.service';

@Global()
@Module({
  controllers: [],
  providers: [CadrartAppGateway, CadrartSocketService],
  exports: [CadrartSocketService]
})
export class CadrartSocketModule {}
