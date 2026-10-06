import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { UserValidator } from '../utils/user.validator';
import { JWTService } from '../services/jwtService';
import { AppError } from '../middleware/errorHandler';
import type { RegisterDTO, LoginDTO, AuthResponse } from '../types';

/**
 * Controller for user authentication.
 */
export class AuthController {
  /**
   * Register a new user.
   * 
   * @route POST /api/auth/register
   * @access Public
   * 
   * @param req - Request with body RegisterDTO
   * @param res - Response
   * @param next - NextFunction
   * 
   * @returns JWT and user data
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, email, password, name }: RegisterDTO = req.body;

      // Validate the username.
      const usernameValidation = UserValidator.validateUsername(username);
      if (!usernameValidation.isValid) {
        throw new AppError(usernameValidation.error!, 400);
      }

      // Validate the email.
      const emailValidation = UserValidator.validateEmail(email);
      if (!emailValidation.isValid) {
        throw new AppError(emailValidation.error!, 400);
      }

      // Validate the password.
      const passwordValidation = UserValidator.validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new AppError(passwordValidation.error!, 400);
      }

      // Check that the email is not already registered.
      const existingEmail = await User.findOne({ email: emailValidation.sanitized });
      if (existingEmail) {
        throw new AppError('Email is already registered', 400);
      }

      // Check that the username is not already taken.
      const existingUsername = await User.findOne({ username: usernameValidation.sanitized });
      if (existingUsername) {
        throw new AppError('Username is already taken', 400);
      }

      // Create user
      const user = await User.create({
        username: usernameValidation.sanitized,
        email: emailValidation.sanitized,
        password,
        name, // The password is hashed automatically in the pre-save hook.
      });

      // Generate a token.
      const token = JWTService.generateToken({
        userId: user.id.toString(),
        email: user.email,
        role: user.role
      });

      // Prepare the response (without the password)
      const response: AuthResponse = {
        token,
        user: {
          _id: user.id.toString(),
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role
        }
      };

      res.status(201).json({
        success: true,
        data: response,
        message: 'User registered successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Log a user in.
   * 
   * @route POST /api/auth/login
   * @access Public
   * 
   * @param req - Request with body LoginDTO
   * @param res - Response
   * @param next - NextFunction
   * 
   * @returns JWT and user data
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password }: LoginDTO = req.body;

      // Validate that credentials were provided.
      if (!email || !password) {
        throw new AppError('Email and password are required', 400);
      }

      // Find user by email (including password)
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      // Verify the password.
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
      }

      // Generate a token.
      const token = JWTService.generateToken({
        userId: user.id.toString(),
        email: user.email,
        role: user.role
      });

      // Prepare the response
      const response: AuthResponse = {
        token,
        user: {
          _id: user.id.toString(),
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role
        }
      };

      res.status(200).json({
        success: true,
        data: response,
        message: 'Login successful'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get authenticated user data
   * 
   * @route GET /api/auth/me
   * @access Private
   * 
   * @param req - Request (req.user must be set by the middleware)
   * @param res - Response
   * @param next - NextFunction
   * 
   * @returns User data
   */
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      // Find the updated user
      const user = await User.findById(req.user.userId);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();