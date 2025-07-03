import { Module } from '@nestjs/common';

import { CadrartFileController } from './file.controller';
import { CadrartFileValidationService } from './services/file-validation.service';
import { CadrartFileUploadGuard } from './guards/file-upload.guard';

@Module({
  controllers: [CadrartFileController],
  providers: [CadrartFileValidationService, CadrartFileUploadGuard],
  exports: [CadrartFileValidationService, CadrartFileUploadGuard]
})
export class CadrartFileModule {}
