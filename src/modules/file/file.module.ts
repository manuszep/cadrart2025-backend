import { Module } from '@nestjs/common';

import { CadrartFileController } from './file.controller';

@Module({
  controllers: [CadrartFileController]
})
export class CadrartFileModule {}
