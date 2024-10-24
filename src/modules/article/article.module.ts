import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CadrartArticle } from '../../entities/article.entity';

import { CadrartArticleService } from './article.service';
import { CadrartArticleController } from './article.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CadrartArticle])],
  controllers: [CadrartArticleController],
  providers: [CadrartArticleService]
})
export class CadrartArticleModule {}
