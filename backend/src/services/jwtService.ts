import jwt from 'jsonwebtoken';
import type { JWTPayload } from '../types';

/**
 * Service for managing JSON Web Tokens.
 */
export class JWTService {
  private static readonly SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';
  private static readonly EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

  /**
   * Generate a JWT for a user.
   * 
   * @param payload - Data to include in the token
   * @returns A signed JWT
   * 
   * @example
   * const token = JWTService.generateToken({
   *   userId: user._id.toString(),
   *   email: user.email,
   *   role: user.role
   * });
   */
  static generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.SECRET, {
      expiresIn: this.EXPIRES_IN,
      issuer: 'agentlogic-api'
    });
  }

  /**
   * Verify and decode a JWT.
   * 
   * @param token - Token to verify
   * @returns The token payload if valid.
   * @throws Error if the token is invalid or expired.
   * 
   * @example
   * try {
   *   const payload = JWTService.verifyToken(token);
   *   console.log('User ID:', payload.userId);
   * } catch (error) {
   *   console.error('Invalid token');
   * }
   */
  static verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw new Error('Error verifying token');
    }
  }

  /**
   * Decode a token without verifying it (useful for debugging).
   * Do NOT use for authentication.
   * 
   * @param token - Token to decode
   * @returns Token payload without verification
   */
  static decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch {
      return null;
    }
  }
}