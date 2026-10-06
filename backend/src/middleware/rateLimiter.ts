/**
 * Rate Limiting Middleware
 * 
 * Protects against brute-force attacks and spam.
 */

import rateLimit from 'express-rate-limit';
import logger from '../config/logger.config';

// ✅ ADD: Disable rate limiting in tests
const isTestEnvironment = process.env.NODE_ENV === 'test';

/**
 * General rate limiter for the entire API
 * 100 requests per IP every 15 minutes.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  validate: {trustProxy: false},
  skip: () => isTestEnvironment, // ✅ Skip in tests.
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('⚠️ Rate limit reached - General', {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });

    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP. Please try again later.',
    });
  },
});

/**
 * Strict rate limiter for login.
 * 5 attempts per IP every 15 minutes.
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  skip: () => isTestEnvironment, // ✅ Skip in tests.
  skipSuccessfulRequests: true,
  message: {
    success: false,
    error: 'Too many login attempts. Please try again in 15 minutes.',
  },
  handler: (req, res) => {
    logger.error('🚨 ALERT: Rate limit reached - Login', {
      ip: req.ip,
      email: req.body?.email,
      attempts: 5,
    });

    res.status(429).json({
      success: false,
      error: 'Too many login attempts. Please try again in 15 minutes.',
    });
  },
});

/**
 * Rate limiter for user registration.
 * 3 registrations per IP per hour.
 */
export const testExecutionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute.
  max: 20,
  skip: () => isTestEnvironment,
  message: {
    success: false,
    error: 'Too many test runs. Please try again later.',
  },
  handler: (req, res) => {
    logger.warn('⚠️ Rate limit reached - Test Execution', {
      ip: req.ip,
      path: req.path,
    });

    res.status(429).json({
      success: false,
      error: 'Too many test runs. Please try again later.',
    });
  },
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  skip: () => isTestEnvironment, // ✅ Skip in tests.
  message: {
    success: false,
    error: 'Too many registrations from this IP. Please try again later.',
  },
  handler: (req, res) => {
    logger.error('🚨 ALERT: Rate limit reached - Registration', {
      ip: req.ip,
      email: req.body?.email,
    });

    res.status(429).json({
      success: false,
      error: 'Too many registrations from this IP. Please try again later.',
    });
  },
});

/**
 * Moderate rate limiter for resource creation
 * 20 requests every 15 minutes.
 */
export const createResourceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skip: () => isTestEnvironment, // ✅ Skip in tests.
  message: {
    success: false,
    error: 'Too many creations. Please try again later.',
  },
  handler: (req, res) => {
    logger.warn('⚠️ Rate limit reached - Resource creation', {
      ip: req.ip,
      path: req.path,
    });

    res.status(429).json({
      success: false,
      error: 'Too many creations. Please try again later.',
    });
  },
});