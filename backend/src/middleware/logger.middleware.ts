/**
 * Express logging middleware.
 */

import { Request, Response, NextFunction } from 'express';
import logger, { sanitizeForLog } from '../config/logger.config';

/**
 * Middleware that logs all HTTP requests.
 */
export const httpLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Capture the original res.json method to log after the response
  const originalJson = res.json.bind(res);
  
  res.json = function (body: any) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Determine the log level based on the status code
    let logLevel: 'info' | 'warn' | 'error' = 'info';
    if (statusCode >= 500) {
      logLevel = 'error';
    } else if (statusCode >= 400) {
      logLevel = 'warn';
    }

    // Request information (sanitized)
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      status: statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent') || 'unknown',
    };

    // Log message.
    const message = `${req.method} ${req.originalUrl || req.url} ${statusCode} - ${duration}ms`;

    // Log according to level
    logger[logLevel](message, sanitizeForLog(logData));

    // Call the original method
    return originalJson(body);
  };

  next();
};

/**
 * Middleware that logs uncaught errors.
 */
export const errorLogger = (
  err: Error,
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // Log the error with context.
  logger.error('Uncaught error:', {
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name,
    },
    request: {
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip || req.socket.remoteAddress,
      headers: sanitizeForLog(req.headers),
    },
  });

  next(err);
};

/**
 * Log server startup.
 */
export const logServerStart = (port: number | string): void => {
  logger.info(`🚀 Server started on port ${port}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🗄️  MongoDB: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`);
};

/**
 * Log database connection
 */
export const logDatabaseConnection = (success: boolean, error?: Error): void => {
  if (success) {
    logger.info('✅ Connected to MongoDB successfully');
  } else {
    logger.error('❌ Error connecting to MongoDB:', {
      error: error?.message,
      stack: error?.stack,
    });
  }
};

/**
 * Log application shutdown
 */
export const logAppShutdown = (reason: string): void => {
  logger.warn(`⚠️  Shutting down application: ${reason}`);
};