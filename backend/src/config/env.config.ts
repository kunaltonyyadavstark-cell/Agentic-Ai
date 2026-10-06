/**
 * Environment Variable Validation
 * 
 * Verify that all required variables exist at startup
 */

import logger from './logger.config';

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CORS_ORIGIN: string;
}

/**
 * Required environment variables.
 */
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'GEMINI_API_KEY',
  ...(process.env.NODE_ENV === 'production' ? ['CORS_ORIGIN'] : [])
] as const;


/**
 * Optional environment variables with default values.
 */
const defaultEnvVars: Partial<EnvConfig> = {
  NODE_ENV: 'development',
  PORT: '5000',
  JWT_EXPIRES_IN: '7d',
  CORS_ORIGIN: 'http://localhost:5173',
};

/**
 * Validate environment variables
 */
export const validateEnv = (): void => {
  logger.info('🔍 Validating environment variables...');

  const missing: string[] = [];

  // Check required variables.
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  // Fail if critical variables are missing
  if (missing.length > 0) {
    logger.error('❌ Required environment variables are missing:', { missing });
    throw new Error(
      `Missing environment variables: ${missing.join(', ')}\n` +
      'Please configure these variables in your .env file'
    );
  }

  // Apply default values to optional variables.
  for (const [key, value] of Object.entries(defaultEnvVars)) {
    if (!process.env[key]) {
      process.env[key] = value;
      logger.info(`ℹ️  Variable ${key} is not defined; using default value: ${value}`);
    }
  }

  logger.info('✅ Environment variables validated successfully');
};

/**
 * Get typed environment configuration
 */
export const getEnvConfig = (): EnvConfig => {
  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || '5000',
    MONGODB_URI: process.env.MONGODB_URI!,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  };
};