import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.config';


/**
 * Custom application error
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  /**
   * Create an application error
   * 
   * @param message - Error message
   * @param statusCode - HTTP status code
   */
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error-handling middleware
 * 
 * @param err - Caught error
 * @param req - Express request
 * @param res - Express response
 * @param next - NextFunction
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('❌ Caught error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: _req.path,
    method: _req.method,
  });


  // Operational error (controlled).
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.message
    });
    return;
  }

  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      error: 'Invalid ID'
    });
    return;
  }

  // Generic error
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Internal server error'
  });
}

/**
 * Middleware for routes not found
 */
export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
}