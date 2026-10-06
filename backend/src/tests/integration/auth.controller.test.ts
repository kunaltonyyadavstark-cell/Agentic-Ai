// Configure the test environment.
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27018/agentlogic-test';
process.env.JWT_SECRET = 'test-secret-key-12345';

import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import authRoutes from '../../routes/auth';
import { errorHandler } from '../../middleware/errorHandler';
import { User } from '../../models/User';


describe('Auth Controller (Integration)', () => {
  let app: Express;

  beforeAll(async () => {
    // Conectar a MongoDB usando la config centralizada
    await (await import('../../config/database')).connectDatabase();


    // Create an Express app.
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    app.use(errorHandler);
  });

  beforeEach(async () => {
    // Clear the user collection before each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('registers a valid user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test1234!',
        name: 'Test User'
      };


      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.user.username).toBe('testuser');
      expect(response.body.data.user.password).toBeUndefined(); // Password should not be returned
    });

    it('rejects registration with a duplicate email', async () => {
      const userData = {
        username: 'user1',
        email: 'duplicate@example.com',
        password: 'Test1234!',
        name: 'User One'
      };


      // Create the first user
      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Attempt to create a second user with the same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'user2',
          email: 'duplicate@example.com',
          password: 'Test1234!',
          name: 'User Two'
        })

        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('email');
    });

    it('rejects a weak password', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'weak',
        name: 'Weak Password User'
      };


      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('rejects an invalid email', async () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'Test1234!',
        name: 'Invalid Email User'
      };


      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.toLowerCase()).toContain('email');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'loginuser',
          email: 'login@example.com',
          password: 'Test1234!',
          name: 'Login User'
        });

    });

    it('logs in with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'Test1234!'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe('login@example.com');
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('rejects an incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'WrongPassword123!'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('rejects an unregistered email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'notfound@example.com',
          password: 'Test1234!'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('rejects login without an email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'Test1234!'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken: string;



    it('gets the authenticated user data', async () => {
      // Register and get a token
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'meuser',
          email: 'me@example.com',
          password: 'Test1234!',
          name: 'Me User'
        });

      const token = registerResponse.body.data.token;

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('me@example.com');
      expect(response.body.data.username).toBe('meuser');
    });


    it('rejects a request without a token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('token');
    });

    it('rejects an invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer token-invalido')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

  });
});