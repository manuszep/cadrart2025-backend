import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CadrartOffer } from '../entities/offer.entity';
import { CadrartJob } from '../entities/job.entity';
import { CadrartClient } from '../entities/client.entity';
import { CadrartArticle } from '../entities/article.entity';
import { CadrartTag } from '../entities/tag.entity';
import { CadrartTeamMember } from '../entities/team-member.entity';
import { CadrartLocation } from '../entities/location.entity';
import { CadrartProvider } from '../entities/provider.entity';
import { CadrartFormula } from '../entities/formula.entity';
import { TestEndpointGuard } from '../guards/test-endpoint.guard';

import { TestController } from './test.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CadrartOffer,
      CadrartJob,
      CadrartClient,
      CadrartArticle,
      CadrartTag,
      CadrartTeamMember,
      CadrartLocation,
      CadrartProvider,
      CadrartFormula
    ])
  ],
  controllers: [TestController],
  providers: [TestEndpointGuard],
  exports: [TypeOrmModule]
})
export class TestModule {}
