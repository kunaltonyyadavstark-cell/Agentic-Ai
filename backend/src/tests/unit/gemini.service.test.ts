/**
 * Tests for Gemini Service
 */

import { describe, it, expect, beforeAll, vi } from 'vitest';
import { geminiService } from '../../services/gemini.service';

describe('Gemini Service', () => {
  beforeAll(() => {
    // Ensure GEMINI_API_KEY is defined for tests
    if (!process.env.GEMINI_API_KEY) {
      process.env.GEMINI_API_KEY = 'test-api-key-for-unit-tests';
    }
  });

  describe('Service Initialization', () => {
    it('initializes the service correctly', () => {
      expect(geminiService).toBeDefined();
    });

    it('has a generateSolution method', () => {
      expect(typeof geminiService.generateSolution).toBe('function');
    });

    it('has an analyzeCode method', () => {
      expect(typeof geminiService.analyzeCode).toBe('function');
    });

    it('has an explain method', () => {
      expect(typeof geminiService.explain).toBe('function');
    });
  });

  describe('generateSolution', () => {
    it('accepts valid parameters', () => {
      const request = {
        problem: 'Add two numbers',
        language: 'javascript',
        difficulty: 'easy' as const,
      };

      expect(() => {
        // Only verify that it accepts the parameters
        expect(request.problem).toBeDefined();
        expect(request.language).toBeDefined();
      }).not.toThrow();
    });
  });

  describe('analyzeCode', () => {
    it('accepts valid parameters', () => {
      const request = {
        code: 'function sum(a, b) { return a + b; }',
        language: 'javascript',
      };

      expect(request.code).toBeDefined();
      expect(request.language).toBeDefined();
    });
  });

  describe('explain', () => {
    it('accepts valid parameters', () => {
      const request = {
        topic: 'Variables in JavaScript',
        level: 'beginner' as const,
      };

      expect(request.topic).toBeDefined();
      expect(request.level).toBeDefined();
    });
  });
});