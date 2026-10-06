import { describe, it, expect } from 'vitest';
import { ExerciseValidator } from '../../utils/exercise.validator';

describe('ExerciseValidator', () => {
  describe('validateTitle', () => {
    it('accepts a valid title', () => {
      const result = ExerciseValidator.validateTitle('Sum of two numbers');
      
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('Sum of two numbers');
    });

    it('rejects an empty title', () => {
      const result = ExerciseValidator.validateTitle('');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('empty');
    });

    it('rejects a title that is too short', () => {
      const result = ExerciseValidator.validateTitle('AB');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least 3 characters');
    });

    it('trims whitespace', () => {
      const result = ExerciseValidator.validateTitle('  Hello World  ');
      
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('Hello World');
    });

    it('rejects malicious HTML', () => {
      const result = ExerciseValidator.validateTitle('<script>alert("xss")</script>');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('disallowed characters');
    });
  });

  describe('validateDifficulty', () => {
    it('accepts easy, medium, and hard', () => {
      expect(ExerciseValidator.validateDifficulty('easy').isValid).toBe(true);
      expect(ExerciseValidator.validateDifficulty('medium').isValid).toBe(true);
      expect(ExerciseValidator.validateDifficulty('hard').isValid).toBe(true);
    });

    it('rejects invalid values', () => {
      const result = ExerciseValidator.validateDifficulty('extreme');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('is case-insensitive', () => {
      expect(ExerciseValidator.validateDifficulty('EASY').isValid).toBe(true);
      expect(ExerciseValidator.validateDifficulty('Medium').isValid).toBe(true);
    });
  });
});