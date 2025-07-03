import { Body, Controller, Post } from '@nestjs/common';

import { CreateClientDto } from '../src/dto/client.dto';
import { CreateTeamMemberDto } from '../src/dto/team-member.dto';
import { CreateOfferDto } from '../src/dto/offer.dto';
import { CreateArticleDto } from '../src/dto/article.dto';
import { CreateTagDto } from '../src/dto/tag.dto';
import { CreateFormulaDto } from '../src/dto/formula.dto';
import { CreateProviderDto } from '../src/dto/provider.dto';
import { CreateLocationDto } from '../src/dto/location.dto';
import { CreateTaskDto } from '../src/dto/task.dto';
import { CreateStockDto } from '../src/dto/stock.dto';
import { CreateJobDto } from '../src/dto/job.dto';

@Controller('validation-test')
export class ValidationTestController {
  @Post('client')
  createClient(@Body() body: CreateClientDto): { ok: boolean; data: CreateClientDto } {
    return { ok: true, data: body };
  }

  @Post('team-member')
  createTeamMember(@Body() body: CreateTeamMemberDto): { ok: boolean; data: CreateTeamMemberDto } {
    return { ok: true, data: body };
  }

  @Post('offer')
  createOffer(@Body() body: CreateOfferDto): { ok: boolean; data: CreateOfferDto } {
    return { ok: true, data: body };
  }

  @Post('article')
  createArticle(@Body() body: CreateArticleDto): { ok: boolean; data: CreateArticleDto } {
    return { ok: true, data: body };
  }

  @Post('tag')
  createTag(@Body() body: CreateTagDto): { ok: boolean; data: CreateTagDto } {
    return { ok: true, data: body };
  }

  @Post('formula')
  createFormula(@Body() body: CreateFormulaDto): { ok: boolean; data: CreateFormulaDto } {
    return { ok: true, data: body };
  }

  @Post('provider')
  createProvider(@Body() body: CreateProviderDto): { ok: boolean; data: CreateProviderDto } {
    return { ok: true, data: body };
  }

  @Post('location')
  createLocation(@Body() body: CreateLocationDto): { ok: boolean; data: CreateLocationDto } {
    return { ok: true, data: body };
  }

  @Post('task')
  createTask(@Body() body: CreateTaskDto): { ok: boolean; data: CreateTaskDto } {
    return { ok: true, data: body };
  }

  @Post('stock')
  createStock(@Body() body: CreateStockDto): { ok: boolean; data: CreateStockDto } {
    return { ok: true, data: body };
  }

  @Post('job')
  createJob(@Body() body: CreateJobDto): { ok: boolean; data: CreateJobDto } {
    return { ok: true, data: body };
  }
}
