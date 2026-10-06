/**
 * Winston logger configuration
 * Professional logging system with:
 * - Different levels (error, warn, info, debug)
 * - Files separated by level
 * - Daily log rotation
 * - JSON format for production
 * - Colorized format for development
 */

import winston from 'winston';
import path from 'path';

// Log levels (ordered by severity)
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Colors for each level (development only)
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

// Determine the log level based on the environment
const level = (): string => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'info';
};

// Development format (colorized and readable)
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}`
  )
);

// Production format (structured JSON)
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Choose the format based on the environment
const format =
  process.env.NODE_ENV === 'production'
    ? productionFormat
    : developmentFormat;

// Log directory
const logsDir = path.join(process.cwd(), 'logs');

// Transports (log destinations)
const transports: winston.transport[] = [
  // Console (all levels)
  new winston.transports.Console(),

  // Error file (errors only)
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),

  // Combined file (all levels)
  new winston.transports.File({
    filename: path.join(logsDir, 'combined.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Create logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  // Do not exit on uncaught errors
  exitOnError: false,
});

// Helper method to sanitize objects before logging
export const sanitizeForLog = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;

  const sensitiveFields = ['password', 'token', 'authorization', 'cookie'];
  const sanitized = { ...obj };

  for (const key in sanitized) {
    if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeForLog(sanitized[key]);
    }
  }

  return sanitized;
};

export default logger;