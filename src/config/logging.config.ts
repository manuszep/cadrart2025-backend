// Logging configuration for the Cadrart application
// This file provides logging configuration and utilities

export interface ILogConfig {
  level: string;
  enableConsole: boolean;
  enableFile: boolean;
  enableStructured: boolean;
  logDirectory: string;
  maxFileSize: string;
  maxFiles: number;
  enableRequestLogging: boolean;
  enablePerformanceLogging: boolean;
  enableSecurityLogging: boolean;
}

export function getLogConfig(): ILogConfig {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
    enableConsole: true,
    enableFile: isProduction,
    enableStructured: true,
    logDirectory: process.env.LOG_DIRECTORY || '/var/log/cadrart',
    maxFileSize: '10m',
    maxFiles: 5,
    enableRequestLogging: true,
    enablePerformanceLogging: true,
    enableSecurityLogging: true
  };
}
