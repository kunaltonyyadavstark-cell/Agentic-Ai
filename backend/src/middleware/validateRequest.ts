import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

/**
 * Validate that the request body is not empty
 */
export function validateBody(req: Request, _res: Response, next: NextFunction): void {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new AppError('The request body cannot be empty', 400);
  }
  next();
}

/**
 * Validate that a parameter is a valid MongoDB ID
 * 
 * @param paramName - Name of the parameter to validate (default: 'id')
 */
export function validateMongoId(paramName: string = 'id') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const id = req.params[paramName];
    
    // Regex to validate a MongoDB ObjectId (24 hexadecimal characters)
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError('Invalid ID', 400);
    }
    
    next();
  };
}

export const validateId = validateMongoId();