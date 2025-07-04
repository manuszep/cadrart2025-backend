import { Controller, Post, Delete, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ECadrartArticleFamily, ECadrartArticlePriceMethod } from '@manuszep/cadrart2025-common';

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

@Controller('test')
@UseGuards(TestEndpointGuard)
export class TestController {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(CadrartOffer)
    private readonly offerRepository: Repository<CadrartOffer>,
    @InjectRepository(CadrartJob)
    private readonly jobRepository: Repository<CadrartJob>,
    @InjectRepository(CadrartClient)
    private readonly clientRepository: Repository<CadrartClient>,
    @InjectRepository(CadrartArticle)
    private readonly articleRepository: Repository<CadrartArticle>,
    @InjectRepository(CadrartTag)
    private readonly tagRepository: Repository<CadrartTag>,
    @InjectRepository(CadrartTeamMember)
    private readonly teamMemberRepository: Repository<CadrartTeamMember>,
    @InjectRepository(CadrartLocation)
    private readonly locationRepository: Repository<CadrartLocation>,
    @InjectRepository(CadrartProvider)
    private readonly providerRepository: Repository<CadrartProvider>,
    @InjectRepository(CadrartFormula)
    private readonly formulaRepository: Repository<CadrartFormula>
  ) {}

  @Delete('cleanup')
  async cleanupDatabase(@Res() res: Response): Promise<Response<{ message: string }>> {
    try {
      // Use raw SQL to disable foreign key checks temporarily
      await this.offerRepository.query('SET FOREIGN_KEY_CHECKS = 0');

      // Clear all tables
      await this.offerRepository.clear();
      await this.jobRepository.clear();
      await this.clientRepository.clear();
      await this.articleRepository.clear();
      await this.tagRepository.clear();
      await this.locationRepository.clear();
      await this.providerRepository.clear();
      await this.formulaRepository.clear();

      // Re-enable foreign key checks
      await this.offerRepository.query('SET FOREIGN_KEY_CHECKS = 1');

      // Don't clear team members as we need at least one for testing
      // We'll only clear non-test users
      await this.teamMemberRepository
        .createQueryBuilder()
        .delete()
        .where('mail != :testEmail', { testEmail: 'test@test.com' })
        .execute();

      return res.status(HttpStatus.OK).json({
        message: 'Database cleaned successfully'
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to clean database',
        error: error.message
      });
    }
  }

  @Post('setup')
  async setupTestData(@Res() res: Response): Promise<Response<{ message: string; data: Record<string, unknown> }>> {
    try {
      // Create test team member if it doesn't exist
      let testUser = await this.teamMemberRepository.findOne({
        where: { mail: 'test@test.com' }
      });

      if (!testUser) {
        testUser = this.teamMemberRepository.create({
          firstName: 'Test',
          lastName: 'User',
          mail: 'test@test.com',
          password: 'testPassword123!', // Will be hashed by entity hook
          image: 'default'
        });
        await this.teamMemberRepository.save(testUser);
      }

      // Create formulas first (needed for articles)
      const formulas = [
        { name: 'Surcout initial', formula: '0:+15;3:*2' },
        { name: 'Cout initial', formula: '0:+20' },
        { name: 'decoupe verre SP', formula: '0:+12' },
        { name: 'Decoupe PP', formula: '0:+7' },
        { name: 'PP', formula: '0:+0' },
        { name: 'Fond', formula: '0:+3;1:*1.2' }
      ];

      const createdFormulas = [];
      for (const formulaData of formulas) {
        const formula = this.formulaRepository.create(formulaData);
        createdFormulas.push(await this.formulaRepository.save(formula));
      }

      // Create providers
      const providers = [
        {
          name: 'Cami',
          address: 'Edward Vlietinckstraat 8, 8400, Oostende, BEL',
          vat: '',
          iban: 'BE53736036053853',
          mail: 'orders@cami-nv.com'
        },
        {
          name: 'Eurolijsten',
          address: 'Tulpenstraat 13, 9810, Nazareth, Eke, BEL',
          vat: null,
          iban: null,
          mail: 'luk.soetaert@eurolijsten.be'
        },
        {
          name: 'Wybenga',
          address: 'De Vang 3, 8801 RB Franeker, Holland',
          vat: null,
          iban: null,
          mail: 'info@glashandelwybenga.nl'
        },
        {
          name: 'Molgra',
          address: 'Avda. de Cervera, 16  25300 Tàrrega, Leide Espagne',
          vat: '',
          iban: '',
          mail: 'info@molgra.com'
        },
        {
          name: 'Montxo',
          address: 'Ctra. Tuleda - Tarazona, Km 9, 31520 Cascante',
          vat: '',
          iban: '',
          mail: 'ventas@montxooiarbide.com'
        }
      ];

      const createdProviders = [];
      for (const providerData of providers) {
        const provider = this.providerRepository.create(providerData);
        createdProviders.push(await this.providerRepository.save(provider));
      }

      // Create tags
      const tags = [
        { name: 'Gallerie' },
        { name: 'Particulier' },
        { name: 'Société' },
        { name: 'Artiste' },
        { name: 'Ambassade' }
      ];

      const createdTags = [];
      for (const tagData of tags) {
        const tag = this.tagRepository.create(tagData);
        createdTags.push(await this.tagRepository.save(tag));
      }

      // Create locations
      const locations = [
        { name: 'R1' },
        { name: 'R2' },
        { name: 'Rouleau / ici' },
        { name: '68' },
        { name: 'R3' },
        { name: 'R4' },
        { name: 'R5' },
        { name: 'R6' },
        { name: 'R7' },
        { name: 'ici' },
        { name: 'couloir' },
        { name: "sous la table d'Éric" }
      ];

      const createdLocations = [];
      for (const locationData of locations) {
        const location = this.locationRepository.create(locationData);
        createdLocations.push(await this.locationRepository.save(location));
      }

      // Create articles with realistic data from the SQL dump
      const articles = [
        {
          name: '157 - pl 20 x 20 noir',
          place: 'w 4',
          buyPrice: 2.6,
          sellPrice: 48.45,
          maxReduction: 32.0,
          providerRef: 'e-p071-mh',
          maxLength: 300.0,
          maxWidth: null,
          combine: false,
          provider: createdProviders[0], // Cami
          formula: createdFormulas[0], // Surcout initial
          getPriceMethod: ECadrartArticlePriceMethod.BY_LENGTH,
          family: ECadrartArticleFamily.WOOD
        },
        {
          name: '919 - decoupe PP bis',
          place: null,
          buyPrice: 0.0,
          sellPrice: 1.0,
          maxReduction: 100.0,
          providerRef: null,
          maxLength: null,
          maxWidth: null,
          combine: true,
          provider: null,
          formula: createdFormulas[3], // Decoupe PP
          getPriceMethod: ECadrartArticlePriceMethod.BY_FIX_VALUE,
          family: ECadrartArticleFamily.PASS
        },
        {
          name: 'sp70 - verre antireflets / anti UV 70%',
          place: null,
          buyPrice: 35.0,
          sellPrice: 183.0,
          maxReduction: 0.0,
          providerRef: 'ultravue 70',
          maxLength: 172.0,
          maxWidth: 122.0,
          combine: false,
          provider: createdProviders[0], // Cami
          formula: createdFormulas[2], // decoupe verre SP
          getPriceMethod: ECadrartArticlePriceMethod.BY_AREA,
          family: ECadrartArticleFamily.GLASS
        },
        {
          name: '9 - verre 2mm',
          place: null,
          buyPrice: 7.0,
          sellPrice: 40.0,
          maxReduction: 100.0,
          providerRef: null,
          maxLength: null,
          maxWidth: null,
          combine: false,
          provider: createdProviders[2], // Wybenga
          formula: createdFormulas[2], // decoupe verre SP
          getPriceMethod: ECadrartArticlePriceMethod.BY_AREA,
          family: ECadrartArticleFamily.GLASS
        },
        {
          name: '3b - peindre couleur',
          place: null,
          buyPrice: null,
          sellPrice: 110.0,
          maxReduction: 100.0,
          providerRef: null,
          maxLength: null,
          maxWidth: null,
          combine: true,
          provider: null,
          formula: null,
          getPriceMethod: ECadrartArticlePriceMethod.BY_LENGTH,
          family: ECadrartArticleFamily.ASSEMBLY
        },
        {
          name: '31 - biseau couleur',
          place: null,
          buyPrice: null,
          sellPrice: 15.0,
          maxReduction: 100.0,
          providerRef: null,
          maxLength: null,
          maxWidth: null,
          combine: true,
          provider: null,
          formula: null,
          getPriceMethod: ECadrartArticlePriceMethod.BY_LENGTH,
          family: ECadrartArticleFamily.ASSEMBLY
        },
        {
          name: 'carton a biseau',
          place: null,
          buyPrice: null,
          sellPrice: 10.0,
          maxReduction: 100.0,
          providerRef: null,
          maxLength: null,
          maxWidth: null,
          combine: false,
          provider: null,
          formula: null,
          getPriceMethod: ECadrartArticlePriceMethod.BY_LENGTH,
          family: ECadrartArticleFamily.CARDBOARD
        },
        {
          name: '19 - PP coupe droite',
          place: null,
          buyPrice: null,
          sellPrice: 12.0,
          maxReduction: 100.0,
          providerRef: null,
          maxLength: null,
          maxWidth: null,
          combine: true,
          provider: null,
          formula: null,
          getPriceMethod: ECadrartArticlePriceMethod.BY_LENGTH,
          family: ECadrartArticleFamily.ASSEMBLY
        },
        {
          name: 'l blanc',
          place: null,
          buyPrice: null,
          sellPrice: 34.0,
          maxReduction: 100.0,
          providerRef: null,
          maxLength: null,
          maxWidth: null,
          combine: false,
          provider: createdProviders[3], // Molgra
          formula: null,
          getPriceMethod: ECadrartArticlePriceMethod.BY_LENGTH,
          family: ECadrartArticleFamily.ASSEMBLY
        },
        {
          name: 'Chassis mdf 18',
          place: null,
          buyPrice: null,
          sellPrice: 5.0,
          maxReduction: 100.0,
          providerRef: 'A123',
          maxLength: null,
          maxWidth: null,
          combine: false,
          provider: createdProviders[0], // Cami
          formula: createdFormulas[0], // Surcout initial
          getPriceMethod: ECadrartArticlePriceMethod.BY_LENGTH,
          family: ECadrartArticleFamily.ASSEMBLY
        },
        {
          name: 'CA110',
          place: '',
          buyPrice: 12.81,
          sellPrice: 32.03,
          maxReduction: 32.0,
          providerRef: '324 455',
          maxLength: 120.0,
          maxWidth: 80.0,
          combine: false,
          provider: createdProviders[1], // Eurolijsten
          formula: createdFormulas[5], // Fond
          getPriceMethod: ECadrartArticlePriceMethod.BY_AREA,
          family: ECadrartArticleFamily.CARDBOARD
        },
        {
          name: 'ch 10 x 20 chêne',
          place: 'k 7',
          buyPrice: 3.7,
          sellPrice: 0.0,
          maxReduction: 32.0,
          providerRef: '1043/115',
          maxLength: 300.0,
          maxWidth: null,
          combine: false,
          provider: createdProviders[3], // Molgra
          formula: null,
          getPriceMethod: ECadrartArticlePriceMethod.BY_LENGTH,
          family: ECadrartArticleFamily.WOOD
        }
      ];

      const createdArticles = [];
      for (const articleData of articles) {
        const article = this.articleRepository.create(articleData);
        createdArticles.push(await this.articleRepository.save(article));
      }

      // Create clients
      const clients = [
        {
          lastName: 'Drzemala',
          firstName: 'Stanislas',
          company: "Cadr'Art",
          address: 'Avenue de la Chasse 68, 1040, Etterbeek, BEL',
          mail: 'atelier.cadrart@gmail.com',
          phone: '+32 2 732 21 40',
          phone2: null,
          reduction: 10.0,
          tag: createdTags[3], // Artiste
          vat: 21
        },
        {
          lastName: 'marchetti',
          firstName: 'jean',
          company: "Le salon d'art",
          address: 'Avenue Louise 18, 1050, Bruxelles, BEL',
          mail: 'lesalondart@jean.be',
          phone: null,
          phone2: null,
          reduction: 32.0,
          tag: createdTags[0], // Gallerie
          vat: 21
        },
        {
          lastName: 'esteve',
          firstName: 'lionel',
          company: 'dix sprl',
          address: null,
          mail: null,
          phone: null,
          phone2: null,
          reduction: 32.0,
          tag: createdTags[3], // Artiste
          vat: 21
        },
        {
          lastName: 'Almine',
          firstName: 'Rech',
          company: 'Galerie Almine Rech',
          address: null,
          mail: null,
          phone: null,
          phone2: null,
          reduction: 32.0,
          tag: null,
          vat: 21
        },
        {
          lastName: 'Test',
          firstName: 'Client',
          company: 'Test Company',
          address: '123 Test Street, Test City, TC 12345',
          mail: 'test.client@example.com',
          phone: '+1234567890',
          phone2: '',
          reduction: 0.0,
          tag: createdTags[1], // Particulier
          vat: 21
        }
      ];

      const createdClients = [];
      for (const clientData of clients) {
        const client = this.clientRepository.create(clientData);
        createdClients.push(await this.clientRepository.save(client));
      }

      return res.status(HttpStatus.OK).json({
        message: 'Test data setup successfully',
        data: {
          testUser: {
            email: testUser.mail,
            password: 'testPassword123!',
            name: `${testUser.firstName} ${testUser.lastName}`
          },
          testClients: createdClients.map((c) => ({
            id: c.id,
            name: c.company || `${c.firstName} ${c.lastName}`,
            email: c.mail,
            phone: c.phone,
            address: c.address,
            tag: c.tag?.name
          })),
          testArticles: createdArticles.map((a) => ({
            id: a.id,
            name: a.name,
            family: a.family,
            sellPrice: a.sellPrice,
            provider: a.provider?.name
          })),
          testTags: createdTags.map((t) => ({ id: t.id, name: t.name })),
          testLocations: createdLocations.map((l) => ({ id: l.id, name: l.name })),
          testProviders: createdProviders.map((p) => ({
            id: p.id,
            name: p.name,
            mail: p.mail
          })),
          testFormulas: createdFormulas.map((f) => ({
            id: f.id,
            name: f.name,
            formula: f.formula
          }))
        }
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to setup test data',
        error: error.message
      });
    }
  }
}
