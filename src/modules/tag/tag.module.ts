import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CadrartTag } from '../../entities/tag.entity';

import { CadrartTagService } from './tag.service';
import { CadrartTagController } from './tag.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CadrartTag])],
  controllers: [CadrartTagController],
  providers: [CadrartTagService]
})
export class CadrartTagModule {}
