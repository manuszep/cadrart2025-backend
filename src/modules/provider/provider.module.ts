import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CadrartProvider } from '../../entities/provider.entity';

import { CadrartProviderService } from './provider.service';
import { CadrartProviderController } from './provider.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CadrartProvider])],
  controllers: [CadrartProviderController],
  providers: [CadrartProviderService]
})
export class CadrartProviderModule {}
