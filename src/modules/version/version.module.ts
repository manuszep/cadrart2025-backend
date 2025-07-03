import { Module } from '@nestjs/common';

import { CadrartVersionController } from './version.controller';

@Module({
  controllers: [CadrartVersionController],
})
export class CadrartVersionModule {}
