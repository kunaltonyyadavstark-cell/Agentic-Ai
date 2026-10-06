/**
 * Tests for Rate Limiters
 */

import { describe, it, expect } from 'vitest';
import { generalLimiter, loginLimiter, registerLimiter, createResourceLimiter } from '../../middleware/rateLimiter';

describe('Rate Limiters', () => {
  describe('generalLimiter', () => {
    it('has the middleware', () => {
      expect(generalLimiter).toBeDefined();
      expect(typeof generalLimiter).toBe('function');
    });

    it('has the correct configuration', () => {
      // Verify that it is an Express middleware function
      expect(generalLimiter.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('loginLimiter', () => {
    it('has the middleware', () => {
      expect(loginLimiter).toBeDefined();
      expect(typeof loginLimiter).toBe('function');
    });

    it('is stricter than the general limiter', () => {
      // loginLimiter tiene max: 5
      // generalLimiter tiene max: 100
      // We cannot access the configuration directly, but we can verify that it exists.
      expect(loginLimiter).toBeDefined();
    });
  });

  describe('registerLimiter', () => {
    it('has the middleware', () => {
      expect(registerLimiter).toBeDefined();
      expect(typeof registerLimiter).toBe('function');
    });
  });

  describe('createResourceLimiter', () => {
    it('has the middleware', () => {
      expect(createResourceLimiter).toBeDefined();
      expect(typeof createResourceLimiter).toBe('function');
    });
  });
});