import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Request } from 'express';

import { getMaxFileSize } from '../config/file-upload.config';

@Injectable()
export class CadrartFileUploadGuard implements CanActivate {
  private readonly maxFiles = 1;
  private readonly allowedCategories = ['job', 'task', 'team-member'];

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // Check if this is a file upload request
    if (!request.files && !request.file) {
      throw new BadRequestException('No file provided');
    }

    // Check file count
    const fileCount = request.files ? (Array.isArray(request.files) ? request.files.length : 1) : 1;
    if (fileCount > this.maxFiles) {
      throw new BadRequestException(`Maximum ${this.maxFiles} file(s) allowed per request`);
    }

    // Check upload category from URL
    const url = request.url;
    const category = this.extractCategoryFromUrl(url);

    if (!category || !this.allowedCategories.includes(category)) {
      throw new BadRequestException(
        `Invalid upload category. Allowed categories: ${this.allowedCategories.join(', ')}`
      );
    }

    // Check content type
    const contentType = request.headers['content-type'];
    if (!contentType || !contentType.includes('multipart/form-data')) {
      throw new BadRequestException('Invalid content type. Expected multipart/form-data');
    }

    // Check file size from headers (basic check)
    const contentLength = parseInt(request.headers['content-length'] || '0');
    const maxSize = getMaxFileSize();
    if (contentLength > maxSize) {
      throw new BadRequestException(`File size exceeds maximum allowed size of ${this.formatBytes(maxSize)}`);
    }

    return true;
  }

  private extractCategoryFromUrl(url: string): string | null {
    // Extract category from URL patterns like /api/image/job, /api/image/task, etc.
    const match = url.match(/\/api\/image\/([^/]+)/);
    return match ? match[1] : null;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
