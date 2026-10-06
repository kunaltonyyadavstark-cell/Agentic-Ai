import { describe, it, expect } from 'vitest';
import { User } from '../../models/User';

describe.skip('User Model', () => {
  describe('Create user', () => {
    it('creates a valid user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test1234!'
      };

      const user = await User.create(userData);

      expect(user._id).toBeDefined();
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      expect(user.role).toBe('user');
      expect(user.password).not.toBe('Test1234!');
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('automatically hashes the password', async () => {
      const userData = {
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'Test1234!'
      };

      const user = await User.create(userData);

      const userWithPassword = await User.findById(user._id).select('+password');
      expect(userWithPassword?.password).toMatch(/^\$2[ab]\$/);
      expect(userWithPassword?.password).not.toBe('Test1234!');
    });
  });

  describe('Validation', () => {
    it('fails when the username is missing', async () => {
      const userData = {
        email: 'test3@example.com',
        password: 'Test1234!'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('fails when the email is missing', async () => {
      const userData = {
        username: 'testuser3',
        password: 'Test1234!'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('fails when the password is missing', async () => {
      const userData = {
        username: 'testuser4',
        email: 'test4@example.com'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('fails with a duplicate email', async () => {
      const userData = {
        username: 'user5',
        email: 'duplicate@example.com',
        password: 'Test1234!'
      };

      await User.create(userData);

      const duplicateUser = {
        username: 'user6',
        email: 'duplicate@example.com',
        password: 'Test1234!'
      };

      await expect(User.create(duplicateUser)).rejects.toThrow();
    });

    it('fails with a duplicate username', async () => {
      const userData = {
        username: 'duplicateuser',
        email: 'test7@example.com',
        password: 'Test1234!'
      };

      await User.create(userData);

      const duplicateUser = {
        username: 'duplicateuser',
        email: 'test8@example.com',
        password: 'Test1234!'
      };

      await expect(User.create(duplicateUser)).rejects.toThrow();
    });
  });

  describe('comparePassword', () => {
    it('returns true with the correct password', async () => {
      const userData = {
        username: 'testuser9',
        email: 'test9@example.com',
        password: 'Test1234!'
      };

      const user = await User.create(userData);
      const userWithPassword = await User.findById(user._id).select('+password');

      const isMatch = await userWithPassword?.comparePassword('Test1234!');
      expect(isMatch).toBe(true);
    });

    it('returns false with an incorrect password', async () => {
      const userData = {
        username: 'testuser10',
        email: 'test10@example.com',
        password: 'Test1234!'
      };

      const user = await User.create(userData);
      const userWithPassword = await User.findById(user._id).select('+password');

      const isMatch = await userWithPassword?.comparePassword('WrongPassword!');
      expect(isMatch).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('does not include the password in JSON', async () => {
      const userData = {
        username: 'testuser11',
        email: 'test11@example.com',
        password: 'Test1234!'
      };

      const user = await User.create(userData);
      const json = user.toJSON();

      expect(json.password).toBeUndefined();
      expect(json.username).toBe('testuser11');
      expect(json.email).toBe('test11@example.com');
    });
  });
});