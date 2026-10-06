/**
 * Tests for environment validation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getEnvConfig } from '../../config/env.config';

describe('Environment Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset the environment for each test.
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getEnvConfig', () => {
    it('returns configuration with values', () => {
      const config = getEnvConfig();
      
      expect(config).toBeDefined();
      expect(config.NODE_ENV).toBeDefined();
      expect(config.PORT).toBeDefined();
    });

    it('uses default values when none are set', () => {
      delete process.env.NODE_ENV;
      delete process.env.PORT;
      
      const config = getEnvConfig();
      
      expect(config.NODE_ENV).toBe('development');
      expect(config.PORT).toBe('5000');
    });
  });
});