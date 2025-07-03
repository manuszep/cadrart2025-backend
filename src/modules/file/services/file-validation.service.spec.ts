import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

import { CadrartFileValidationService } from './file-validation.service';

describe('CadrartFileValidationService', () => {
  let service: CadrartFileValidationService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CadrartFileValidationService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<CadrartFileValidationService>(CadrartFileValidationService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateFile', () => {
    it('should reject empty file', async () => {
      const mockFile = {
        buffer: Buffer.alloc(0),
        size: 0,
        originalname: 'test.jpg'
      } as Express.Multer.File;

      const result = await service.validateFile(mockFile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File is empty');
    });

    it('should reject file without buffer', async () => {
      const mockFile = {
        size: 100,
        originalname: 'test.jpg'
      } as Express.Multer.File;

      const result = await service.validateFile(mockFile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('No file provided or file is empty');
    });

    it('should reject file that is too large', async () => {
      const largeBuffer = Buffer.alloc(11 * 1024 * 1024); // 11MB
      const mockFile = {
        buffer: largeBuffer,
        size: largeBuffer.length,
        originalname: 'large.jpg'
      } as Express.Multer.File;

      const result = await service.validateFile(mockFile);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((error) => error.includes('exceeds maximum allowed size'))).toBe(true);
    });

    it('should reject file with invalid MIME type', async () => {
      const mockFile = {
        buffer: Buffer.from('fake executable content'),
        size: 100,
        originalname: 'test.exe'
      } as Express.Multer.File;

      const result = await service.validateFile(mockFile);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((error) => error.includes('not allowed'))).toBe(true);
    });

    it('should accept valid JPEG file', async () => {
      // Create a minimal valid JPEG buffer
      const jpegBuffer = Buffer.from([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48,
        0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
        0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12, 0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f,
        0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29,
        0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff,
        0xc0, 0x00, 0x11, 0x08, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
        0xff, 0xc4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x08, 0xff, 0xc4, 0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xda, 0x00, 0x0c, 0x03, 0x01, 0x00, 0x02, 0x11, 0x03,
        0x11, 0x00, 0x3f, 0x00, 0x8a, 0x00, 0x07, 0xff, 0xd9
      ]);

      const mockFile = {
        buffer: jpegBuffer,
        size: jpegBuffer.length,
        originalname: 'test.jpg'
      } as Express.Multer.File;

      const result = await service.validateFile(mockFile);
      expect(result.isValid).toBe(true);
      expect(result.fileType).toBe('jpg');
      expect(result.mimeType).toBe('image/jpeg');
    });

    it('should warn about small file size', async () => {
      const smallBuffer = Buffer.alloc(50); // 50 bytes
      const mockFile = {
        buffer: smallBuffer,
        size: smallBuffer.length,
        originalname: 'small.jpg'
      } as Express.Multer.File;

      const result = await service.validateFile(mockFile);
      expect(result.warnings.some((warning) => warning.includes('very small'))).toBe(true);
    });
  });

  describe('throwIfInvalid', () => {
    it('should throw BadRequestException for invalid result', () => {
      const invalidResult = {
        isValid: false,
        errors: ['File is too large'],
        warnings: []
      };

      expect(() => service.throwIfInvalid(invalidResult)).toThrow(BadRequestException);
    });

    it('should not throw for valid result', () => {
      const validResult = {
        isValid: true,
        errors: [],
        warnings: ['Minor warning']
      };

      expect(() => service.throwIfInvalid(validResult)).not.toThrow();
    });
  });

  describe('configuration', () => {
    it('should use custom max file size from config', async () => {
      const customMaxSize = 5 * 1024 * 1024; // 5MB
      jest.spyOn(configService, 'get').mockReturnValue(customMaxSize);

      const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB
      const mockFile = {
        buffer: largeBuffer,
        size: largeBuffer.length,
        originalname: 'large.jpg'
      } as Express.Multer.File;

      const result = await service.validateFile(mockFile);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((error) => error.includes('exceeds maximum allowed size'))).toBe(true);
    });
  });
});
