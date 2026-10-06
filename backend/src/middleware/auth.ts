import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../services/jwtService';
import { User } from '../models/User';
import { AppError } from './errorHandler';
import type { JWTPayload } from '../types';

// Extender Request de Express for incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * JWT authentication middleware
 * Verify that the user has a valid token
 * 
 * @param req - Request de Express
 * @param res - Response de Express
 * @param next - NextFunction
 * 
 * @throws {AppError} 401 - If there is no token or it is invalid
 * 
 * @example
 * router.get('/protected', authenticate, (req, res) => {
 *   console.log('User ID:', req.user.userId);
 * });
 */
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No authentication token was provided', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    // Verify the token.
    const payload: JWTPayload = JWTService.verifyToken(token);

    // Verify that the user exists
    const user = await User.findById(payload.userId);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    // Add user data to the request
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Invalid or expired token', 401));
    }
  }
}

/**
 * Middleware to verify the administrator role
 * Must be used after the authenticate middleware
 * 
 * @param req - Request de Express
 * @param res - Response de Express
 * @param next - NextFunction
 * 
 * @throws {AppError} 403 - If the user is not an admin
 */
export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  if (req.user.role !== 'admin') {
    throw new AppError('Access denied. Administrator permissions are required.', 403);
  }

  next();
}