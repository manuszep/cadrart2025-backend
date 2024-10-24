import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CadrartClient } from '../../entities/client.entity';

import { CadrartClientService } from './client.service';
import { CadrartClientController } from './client.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CadrartClient])],
  controllers: [CadrartClientController],
  providers: [CadrartClientService]
})
export class CadrartClientModule {}
