export interface IFileUploadConfig {
  maxFileSize: number;
  allowedMimeTypes: string[];
  allowedExtensions: string[];
  maxDimensions: {
    width: number;
    height: number;
  };
  minDimensions: {
    width: number;
    height: number;
  };

  qualitySettings: {
    small: number;
    medium: number;
    large: number;
    original: number;
  };
  resizeSettings: {
    small: number;
    medium: number;
    large: number;
  };
}

export const fileUploadConfig: IFileUploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'],
  allowedExtensions: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff'],
  maxDimensions: {
    width: 8000,
    height: 8000
  },
  minDimensions: {
    width: 10,
    height: 10
  },
  qualitySettings: {
    small: 85,
    medium: 90,
    large: 95,
    original: 100
  },
  resizeSettings: {
    small: 80,
    medium: 800,
    large: 1600
  }
};

// Helper functions to access config values
export const getMaxFileSize = (): number => fileUploadConfig.maxFileSize;
export const getAllowedMimeTypes = (): string[] => fileUploadConfig.allowedMimeTypes;
export const getAllowedExtensions = (): string[] => fileUploadConfig.allowedExtensions;
export const getMaxDimensions = (): { width: number; height: number } => fileUploadConfig.maxDimensions;
export const getMinDimensions = (): { width: number; height: number } => fileUploadConfig.minDimensions;
export const getQualitySettings = (): { small: number; medium: number; large: number; original: number } =>
  fileUploadConfig.qualitySettings;
export const getResizeSettings = (): { small: number; medium: number; large: number } =>
  fileUploadConfig.resizeSettings;
