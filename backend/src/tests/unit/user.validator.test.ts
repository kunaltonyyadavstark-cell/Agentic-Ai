import { describe, it, expect } from 'vitest';
import { UserValidator } from '../../utils/user.validator';

describe('UserValidator', () => {
  describe('validateUsername', () => {
    it('accepts a valid username', () => {
      const result = UserValidator.validateUsername('john_doe123');
      expect(result.isValid).toBe(true);
    });

    it('rejects a username that is too short', () => {
      const result = UserValidator.validateUsername('ab');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least 3 characters');
    });

    it('rejects a username that is too long', () => {
      const result = UserValidator.validateUsername('a'.repeat(31));
      expect(result.isValid).toBe(false);
    });

    it('rejects dangerous special characters', () => {
      const result = UserValidator.validateUsername('user<script>');
      expect(result.isValid).toBe(false);
    });

    it('allows underscores and numbers', () => {
      const result = UserValidator.validateUsername('user_123');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateEmail', () => {
    it('accepts a valid email', () => {
      const result = UserValidator.validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
    });

    it('rejects an email without @', () => {
      const result = UserValidator.validateEmail('testexample.com');
      expect(result.isValid).toBe(false);
    });

    it('rejects an email without a domain', () => {
      const result = UserValidator.validateEmail('test@');
      expect(result.isValid).toBe(false);
    });

    it('normalizes the email to lowercase', () => {
      const result = UserValidator.validateEmail('TEST@EXAMPLE.COM');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('test@example.com');
    });
  });

  describe('validatePassword', () => {
    it('accepts a strong password', () => {
      const result = UserValidator.validatePassword('Test1234!');
      expect(result.isValid).toBe(true);
    });

    it('rejects a short password', () => {
      const result = UserValidator.validatePassword('Test1!');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('8 characters');
    });

    it('rejects a password without an uppercase letter', () => {
      const result = UserValidator.validatePassword('test1234!');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('uppercase');
    });

    it('rejects a password without a lowercase letter', () => {
      const result = UserValidator.validatePassword('TEST1234!');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('lowercase');
    });

    it('rejects a password without a number', () => {
      const result = UserValidator.validatePassword('Testtest!');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('number');
    });

    it('rejects a password without a special character', () => {
      const result = UserValidator.validatePassword('Test1234');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('special');
    });
  });
});