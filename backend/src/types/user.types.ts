import { ObjectId } from 'mongodb';

/**
 * User role in the system.
 */
export type UserRole = 'user' | 'admin';

/**
 * MongoDB user document with instance methods
 */
export interface IUser {
  _id: ObjectId;
  /** Unique username */
  username: string;
  name: string;
  /** Unique email */
  email: string;
  /** Hashed password (never returned to the client) */
  password: string;
  /** User role */
  role: UserRole;
  /** Creation date */
  createdAt: Date;
  /** Last updated date */
  updatedAt: Date;
  
  /**
   * Instance method: Compare the password with the stored hash
   * @param candidatePassword - Password to compare
   * @returns true if they match, false otherwise
   */
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * DTO for user registration.
 */
export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  name: string
}

/**
 * DTO for login
 */
export interface LoginDTO {
  email: string;
  password: string;
}

/**
 * Authentication response with token
 */
export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    username: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

/**
 * JWT token payload.
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}