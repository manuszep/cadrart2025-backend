import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { CanActivate, ExecutionContext } from '@nestjs/common';

import { CadrartClientService } from '../src/modules/client/client.service';
import { CadrartTeamMemberService } from '../src/modules/team-member/team-member.service';
import { CadrartOfferService } from '../src/modules/offer/offer.service';
import { CadrartSocketService } from '../src/socket/socket.service';
import { CadrartJwtAuthGuard } from '../src/modules/auth/jwt-auth.guard';

import { ValidationTestController } from './validation-test.controller';

describe('Input Validation (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    class MockAuthGuard implements CanActivate {
      canActivate(_context: ExecutionContext): boolean {
        return true;
      }
    }
    const moduleBuilder = Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      controllers: [ValidationTestController],
      providers: [
        {
          provide: CadrartClientService,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: 1, lastName: 'Doe', firstName: 'John' }),
            findAll: jest.fn().mockResolvedValue({ entities: [] }),
            findOne: jest.fn().mockResolvedValue({ id: 1, lastName: 'Doe', firstName: 'John' }),
            update: jest.fn().mockResolvedValue({ id: 1, lastName: 'Doe', firstName: 'John' }),
            remove: jest.fn().mockResolvedValue({ affected: 1 })
          }
        },
        {
          provide: CadrartTeamMemberService,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: 1, lastName: 'Smith', firstName: 'Jane' }),
            findAll: jest.fn().mockResolvedValue({ entities: [] }),
            findOne: jest.fn().mockResolvedValue({ id: 1, lastName: 'Smith', firstName: 'Jane' }),
            update: jest.fn().mockResolvedValue({ id: 1, lastName: 'Smith', firstName: 'Jane' }),
            remove: jest.fn().mockResolvedValue({ affected: 1 })
          }
        },
        {
          provide: CadrartOfferService,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: 1, clientId: 1, status: 'draft' }),
            findAll: jest.fn().mockResolvedValue({ entities: [] }),
            findOne: jest.fn().mockResolvedValue({ id: 1, clientId: 1, status: 'draft' }),
            update: jest.fn().mockResolvedValue({ id: 1, clientId: 1, status: 'draft' }),
            remove: jest.fn().mockResolvedValue({ affected: 1 })
          }
        },
        {
          provide: CadrartSocketService,
          useValue: {
            emitToAll: jest.fn(),
            emitToRoom: jest.fn()
          }
        }
      ]
    });
    moduleBuilder.overrideGuard(CadrartJwtAuthGuard).useValue(new MockAuthGuard());
    const moduleFixture: TestingModule = await moduleBuilder.compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true
        }
      })
    );
    app.use(
      helmet({
        frameguard: { action: 'deny' },
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", 'wss:', 'ws:'],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
          }
        },
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' }
      })
    );
    app.enableCors({
      origin: ['http://localhost:4200'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    });
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('Client Validation', () => {
    it('should reject invalid client data', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/client')
        .send({
          // Missing required fields
          company: 'Test Company'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('lastName must be a string');
          expect(res.body.message).toContain('firstName must be a string');
        });
    });

    it('should reject invalid email format', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/client')
        .send({
          lastName: 'Doe',
          firstName: 'John',
          mail: 'invalid-email'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('mail must be an email');
        });
    });

    it('should reject invalid VAT percentage', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/client')
        .send({
          lastName: 'Doe',
          firstName: 'John',
          vat: 150 // Should be between 0-100
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('vat must not be greater than 100');
        });
    });

    it('should reject non-whitelisted properties', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/client')
        .send({
          lastName: 'Doe',
          firstName: 'John',
          invalidProperty: 'should be rejected'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('property invalidProperty should not exist');
        });
    });

    it('should accept valid client data', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/client')
        .send({
          lastName: 'Doe',
          firstName: 'John',
          mail: 'john.doe@example.com',
          vat: 21
        })
        .expect(201); // Should be created successfully
    });

    it('should reject negative VAT percentage', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/client')
        .send({
          lastName: 'Doe',
          firstName: 'John',
          vat: -5
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('vat must not be less than 0');
        });
    });
  });

  describe('Team Member Validation', () => {
    it('should reject invalid team member data', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/team-member')
        .send({
          // Missing required fields - only role provided
          role: 'admin'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('lastName must be a string');
          expect(res.body.message).toContain('firstName must be a string');
          expect(res.body.message).toContain('mail must be an email');
          expect(res.body.message).toContain('password must be a string');
        });
    });

    it('should reject invalid team member email', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/team-member')
        .send({
          lastName: 'Smith',
          firstName: 'Jane',
          mail: 'invalid-email-format',
          password: 'password123'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('mail must be an email');
        });
    });

    it('should reject short password', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/team-member')
        .send({
          lastName: 'Smith',
          firstName: 'Jane',
          mail: 'jane.smith@example.com',
          password: '123' // Too short
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('password must be longer than or equal to 8 characters');
        });
    });

    it('should accept valid team member data', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/team-member')
        .send({
          lastName: 'Smith',
          firstName: 'Jane',
          mail: 'jane.smith@example.com',
          password: 'password123'
        })
        .expect(201);
    });
  });

  describe('Offer Validation', () => {
    it('should reject invalid offer data', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/offer')
        .send({
          // Missing required fields - only status provided
          status: 'draft'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('number must be a string');
        });
    });

    it('should reject invalid offer status', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/offer')
        .send({
          number: 'OFFER-001',
          status: 'invalid-status'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('status must be one of the following values: 0, 1, 2');
        });
    });

    it('should reject negative adjusted reduction', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/offer')
        .send({
          number: 'OFFER-001',
          adjustedReduction: -10
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('adjustedReduction must not be less than 0');
        });
    });

    it('should accept valid offer data', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/offer')
        .send({
          number: 'OFFER-001',
          clientId: 1,
          status: '0' // ECadrartOfferStatus.STATUS_CREATED
        })
        .expect(201);
    });
  });

  describe('Article Validation', () => {
    it('should reject invalid article data - missing required fields', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/article')
        .send({
          place: 'Test Place'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('name must be a string');
        });
    });

    it('should reject invalid article data - name too long', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/article')
        .send({
          name: 'a'.repeat(101), // 101 characters, max is 100
          place: 'Test Place'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('name must be shorter than or equal to 100 characters');
        });
    });

    it('should reject invalid article data - negative prices', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/article')
        .send({
          name: 'Test Article',
          buyPrice: -10,
          sellPrice: -5
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('buyPrice must not be less than 0');
          expect(res.body.message).toContain('sellPrice must not be less than 0');
        });
    });

    it('should reject invalid article data - prices too high', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/article')
        .send({
          name: 'Test Article',
          buyPrice: 100000, // Max is 99999.99
          sellPrice: 100000
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('buyPrice must not be greater than 99999.99');
          expect(res.body.message).toContain('sellPrice must not be greater than 99999.99');
        });
    });

    it('should reject invalid article data - maxReduction too high', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/article')
        .send({
          name: 'Test Article',
          maxReduction: 1000 // Max is 999.99
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('maxReduction must not be greater than 999.99');
        });
    });

    it('should reject non-whitelisted properties', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/article')
        .send({
          name: 'Test Article',
          invalidProperty: 'should be rejected'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('property invalidProperty should not exist');
        });
    });

    it('should accept valid article data', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/article')
        .send({
          name: 'Test Article',
          place: 'Test Place',
          buyPrice: 10.5,
          sellPrice: 25.0,
          maxReduction: 15.5
        })
        .expect(201);
    });
  });

  describe('Tag Validation', () => {
    it('should reject invalid tag data - missing required fields', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/tag')
        .send({})
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('name must be a string');
        });
    });

    it('should reject invalid tag data - name too long', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/tag')
        .send({
          name: 'a'.repeat(51) // 51 characters, max is 50
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('name must be shorter than or equal to 50 characters');
        });
    });

    it('should reject non-whitelisted properties', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/tag')
        .send({
          name: 'Test Tag',
          invalidProperty: 'should be rejected'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('property invalidProperty should not exist');
        });
    });

    it('should accept valid tag data', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/tag')
        .send({
          name: 'Test Tag'
        })
        .expect(201);
    });
  });

  describe('Formula Validation', () => {
    it('should reject invalid formula data - missing required fields', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/formula')
        .send({
          name: 'Test Formula'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('formula must be a string');
        });
    });

    it('should reject invalid formula data - name too long', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/formula')
        .send({
          name: 'a'.repeat(51), // 51 characters, max is 50
          formula: 'test formula'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('name must be shorter than or equal to 50 characters');
        });
    });

    it('should reject invalid formula data - formula too long', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/formula')
        .send({
          name: 'Test Formula',
          formula: 'a'.repeat(256) // 256 characters, max is 255
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('formula must be shorter than or equal to 255 characters');
        });
    });

    it('should reject non-whitelisted properties', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/formula')
        .send({
          name: 'Test Formula',
          formula: 'test formula',
          invalidProperty: 'should be rejected'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('property invalidProperty should not exist');
        });
    });

    it('should accept valid formula data', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/formula')
        .send({
          name: 'Test Formula',
          formula: 'price * 1.21'
        })
        .expect(201);
    });
  });

  describe('Provider Validation', () => {
    it('should reject invalid provider data - missing required fields', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/provider')
        .send({
          address: 'Test Address'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('name must be a string');
        });
    });

    it('should reject invalid provider data - name too long', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/provider')
        .send({
          name: 'a'.repeat(101), // 101 characters, max is 100
          address: 'Test Address'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('name must be shorter than or equal to 100 characters');
        });
    });

    it('should reject invalid provider data - invalid email', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/provider')
        .send({
          name: 'Test Provider',
          mail: 'invalid-email'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('mail must be an email');
        });
    });

    it('should reject invalid provider data - VAT too long', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/provider')
        .send({
          name: 'Test Provider',
          vat: 'a'.repeat(26) // 26 characters, max is 25
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('vat must be shorter than or equal to 25 characters');
        });
    });

    it('should reject invalid provider data - IBAN too long', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/provider')
        .send({
          name: 'Test Provider',
          iban: 'a'.repeat(35) // 35 characters, max is 34
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('iban must be shorter than or equal to 34 characters');
        });
    });

    it('should reject non-whitelisted properties', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/provider')
        .send({
          name: 'Test Provider',
          invalidProperty: 'should be rejected'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('property invalidProperty should not exist');
        });
    });

    it('should accept valid provider data', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/provider')
        .send({
          name: 'Test Provider',
          address: 'Test Address',
          vat: 'BE0123456789',
          iban: 'BE123456789012345678',
          mail: 'test@provider.com'
        })
        .expect(201);
    });
  });

  describe('Location Validation', () => {
    it('should reject invalid location data - missing required fields', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/location')
        .send({})
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('name must be a string');
        });
    });

    it('should reject invalid location data - name too long', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/location')
        .send({
          name: 'a'.repeat(51) // 51 characters, max is 50
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('name must be shorter than or equal to 50 characters');
        });
    });

    it('should reject non-whitelisted properties', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/location')
        .send({
          name: 'Test Location',
          invalidProperty: 'should be rejected'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('property invalidProperty should not exist');
        });
    });

    it('should accept valid location data', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/location')
        .send({
          name: 'Test Location'
        })
        .expect(201);
    });
  });

  describe('Task Validation', () => {
    it('should reject invalid task data - missing required fields', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/task')
        .send({
          comment: 'Test comment'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('job must be a number conforming to the specified constraints');
          expect(res.body.message).toContain('article must be a string');
          expect(res.body.message).toContain('total must be a number conforming to the specified constraints');
          expect(res.body.message).toContain(
            'totalBeforeReduction must be a number conforming to the specified constraints'
          );
          expect(res.body.message).toContain('totalWithVat must be a number conforming to the specified constraints');
        });
    });

    it('should reject invalid task data - comment too long', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/task')
        .send({
          job: 1,
          article: 'test article',
          total: 100,
          totalBeforeReduction: 100,
          totalWithVat: 121,
          comment: 'a'.repeat(256) // 256 characters, max is 255
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('comment must be shorter than or equal to 255 characters');
        });
    });

    it('should reject invalid task data - image too long', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/task')
        .send({
          job: 1,
          article: 'test article',
          total: 100,
          totalBeforeReduction: 100,
          totalWithVat: 121,
          image: 'a'.repeat(101) // 101 characters, max is 100
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('image must be shorter than or equal to 100 characters');
        });
    });

    it('should reject non-whitelisted properties', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/task')
        .send({
          job: 1,
          article: 'test article',
          total: 100,
          totalBeforeReduction: 100,
          totalWithVat: 121,
          invalidProperty: 'should be rejected'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('property invalidProperty should not exist');
        });
    });

    it('should accept valid task data', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/task')
        .send({
          job: 1,
          article: 'test article',
          total: 100,
          totalBeforeReduction: 100,
          totalWithVat: 121,
          comment: 'Test comment',
          image: 'test.jpg'
        })
        .expect(201);
    });
  });

  describe('Stock Validation', () => {
    it('should reject invalid stock data - articleName too long', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/stock')
        .send({
          articleName: 'a'.repeat(101) // 101 characters, max is 100
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('articleName must be shorter than or equal to 100 characters');
        });
    });

    it('should reject invalid stock data - invalid date format', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/stock')
        .send({
          orderDate: 'invalid-date',
          deliveryDate: 'invalid-date'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('orderDate must be a valid ISO 8601 date string');
          expect(res.body.message).toContain('deliveryDate must be a valid ISO 8601 date string');
        });
    });

    it('should reject non-whitelisted properties', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/stock')
        .send({
          articleName: 'Test Article',
          invalidProperty: 'should be rejected'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('property invalidProperty should not exist');
        });
    });

    it('should accept valid stock data', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/stock')
        .send({
          articleName: 'Test Article',
          orderDate: '2024-01-01',
          deliveryDate: '2024-01-15'
        })
        .expect(201);
    });
  });

  describe('Job Validation', () => {
    it('should reject invalid job data - missing required fields', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/job')
        .send({
          description: 'Test description'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('offer must be a number conforming to the specified constraints');
        });
    });

    it('should reject invalid job data - description too long', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/job')
        .send({
          offer: 1,
          description: 'a'.repeat(256) // 256 characters, max is 255
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('description must be shorter than or equal to 255 characters');
        });
    });

    it('should reject invalid job data - image too long', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/job')
        .send({
          offer: 1,
          image: 'a'.repeat(101) // 101 characters, max is 100
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('image must be shorter than or equal to 100 characters');
        });
    });

    it('should reject invalid job data - invalid date format', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/job')
        .send({
          offer: 1,
          dueDate: 'invalid-date',
          startDate: 'invalid-date'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('dueDate must be a valid ISO 8601 date string');
          expect(res.body.message).toContain('startDate must be a valid ISO 8601 date string');
        });
    });

    it('should reject non-whitelisted properties', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/job')
        .send({
          offer: 1,
          invalidProperty: 'should be rejected'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('property invalidProperty should not exist');
        });
    });

    it('should accept valid job data', () => {
      return request(app.getHttpServer())
        .post('/api/validation-test/job')
        .send({
          offer: 1,
          count: 2,
          description: 'Test job description',
          image: 'test.jpg',
          dueDate: '2024-01-15',
          startDate: '2024-01-01',
          openingWidth: 100,
          openingHeight: 150,
          marginWidth: 10,
          marginHeight: 10,
          glassWidth: 90,
          glassHeight: 140,
          total: 500,
          totalBeforeReduction: 500,
          totalWithVat: 605
        })
        .expect(201);
    });
  });
});
