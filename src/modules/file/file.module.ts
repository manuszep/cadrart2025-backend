import { Module } from '@nestjs/common';

import { MonitoringModule } from '../../services/monitoring.module';

import { CadrartFileController } from './file.controller';
import { CadrartFileValidationService } from './services/file-validation.service';
import { CadrartFileUploadGuard } from './guards/file-upload.guard';

@Module({
  imports: [MonitoringModule],
  controllers: [CadrartFileController],
  providers: [CadrartFileValidationService, CadrartFileUploadGuard],
  exports: [CadrartFileValidationService, CadrartFileUploadGuard]
})
export class CadrartFileModule {}
