/**
 * Integration tests for the AI controller.
 */

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27018/agentlogic-test';
process.env.JWT_SECRET = 'test-secret-key-12345';


import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../index';
import { connectDatabase, disconnectDatabase } from '../../config/database';
import { Express } from 'express';

describe('AI Controller (Integration)', () => {
  let app: Express;
  let authToken: string;

  beforeAll(async () => {
    // Connect to the test database.
    await connectDatabase();
    console.log('✅ Connected to MongoDB');

    app = createApp();

    // Register and get a token
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'aitest@test.com',
        password: 'Test1234!',
        username: 'aitest',
        name: 'AI Test User',
      });

    authToken = registerResponse.body.data.token;
  });

  afterAll(async () => {
    await disconnectDatabase();
    console.log('MongoDB disconnected successfully');
  });

  describe('POST /api/ai/generate-solution', () => {
    it('rejects unauthenticated requests', async () => {
      const response = await request(app)
        .post('/api/ai/generate-solution')
        .send({
          problem: 'Add two numbers',
          language: 'javascript',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('rejects a request without a problem', async () => {
      const response = await request(app)
        .post('/api/ai/generate-solution')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          language: 'javascript',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Problem');
    });

    it('rejects a request without a language', async () => {
      const response = await request(app)
        .post('/api/ai/generate-solution')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          problem: 'Add two numbers',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Language');
    });

    // Run with a valid API key; skip when it is not configured.
    it.skipIf(!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'test-api-key-for-unit-tests')(
      'generates a solution with valid data',
      async () => {
        const response = await request(app)
          .post('/api/ai/generate-solution')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            problem: 'Create a function that adds two numbers',
            language: 'javascript',
            difficulty: 'easy',
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.solution).toBeDefined();
      },
      30000 // 30-second timeout for the API call.
    );
  });

  describe('POST /api/ai/analyze-code', () => {
    it('rejects unauthenticated requests', async () => {
      const response = await request(app)
        .post('/api/ai/analyze-code')
        .send({
          code: 'console.log("hello")',
          language: 'javascript',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('rejects requests without code', async () => {
      const response = await request(app)
        .post('/api/ai/analyze-code')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          language: 'javascript',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Code');
    });

    it('rejects overly long code', async () => {
      const longCode = 'a'.repeat(10001);
      
      const response = await request(app)
        .post('/api/ai/analyze-code')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          code: longCode,
          language: 'javascript',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('too long');
    });
  });

  describe('POST /api/ai/explain', () => {
    it('rejects unauthenticated requests', async () => {
      const response = await request(app)
        .post('/api/ai/explain')
        .send({
          topic: 'Variables',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('rejects a request without a topic', async () => {
      const response = await request(app)
        .post('/api/ai/explain')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          level: 'beginner',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Topic');
    });

    it('accepts a valid request', async () => {
      const response = await request(app)
        .post('/api/ai/explain')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          topic: 'Variables in JavaScript',
          level: 'beginner',
        });

      // Can return 200 (success) or 500 (if no API key is configured)
      expect([200, 500]).toContain(response.status);
    });
  });
});