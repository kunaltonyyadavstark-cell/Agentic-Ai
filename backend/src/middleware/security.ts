/**
 * Security Middleware
 * 
 * Configure security headers and sanitization
 */

import helmet from 'helmet';
import { Express, Request, Response, NextFunction } from 'express';
import logger from '../config/logger.config';

/**
 * Configure Helmet with security headers
 */
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
});

/**
 * Manual MongoDB sanitization
 * Only the body is sanitized (query and params are handled differently).
 */
export const mongoSanitize = (req: Request, _res: Response, next: NextFunction): void => {
  const sanitizeObject = (obj: any): any => {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        // Remove keys that start with $ or contain .
        if (key.startsWith('$') || key.includes('.')) {
          logger.warn('🚨 NoSQL injection attempt detected', {
            ip: req.ip,
            key,
            path: req.path,
          });
          delete obj[key];
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          obj[key] = sanitizeObject(obj[key]);
        }
      });
    }
    return obj;
  };

  // Only sanitize the body (query and params are read-only).
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  next();
};

/**
 * Apply all security middleware
 */
export const applySecurity = (app: Express): void => {
  // Helmet - Security headers
  app.use(helmetConfig);
  
  // Manual MongoDB sanitization (body only)
  app.use(mongoSanitize);
  
  logger.info('✅ Security middleware applied');
};