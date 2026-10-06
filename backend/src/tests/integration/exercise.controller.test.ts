// Configure the test environment.
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27018/agentlogic-test';
process.env.JWT_SECRET = 'test-secret-key-12345';

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import { connectDatabase, disconnectDatabase, clearDatabase } from '../../config/database';
import exerciseRoutes from '../../routes/exercises';
import { errorHandler } from '../../middleware/errorHandler';

describe('Exercise Controller (Integration)', () => {

  let app: Express;
  let authToken: string;

  beforeAll(async () => {
    await connectDatabase();


    // Create an Express app for testing.
    app = express();
    app.use(express.json());
    app.use('/api/exercises', exerciseRoutes);
    
    // Mount auth routes for login in tests.
    const authRoutes = (await import('../../routes/auth')).default;
    app.use('/api/auth', authRoutes);
    
    app.use(errorHandler);
  });




  beforeEach(async () => {
    await clearDatabase();

    // Register a user to get a token for each test
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'exercisetester',
        email: 'tester@example.com',
        password: 'Test1234!',
        name: 'Exercise Tester'
      });
    
    authToken = registerResponse.body.data.token;
  });


  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('POST /api/exercises', () => {
    it('creates a valid exercise', async () => {
      const exerciseData = {
        title: 'Sum of numbers',
        description: 'Write a function that adds two integers and returns the result',
        language: 'python',
        difficulty: 'easy',
        category: 'logic-math',
        tags: ['math', 'beginner']
      };


      const response = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send(exerciseData)
        .expect(201);


      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.title).toBe('Sum of numbers');
      expect(response.body.message).toBeDefined();
    });

    it('rejects an exercise without a title', async () => {
      const exerciseData = {
        description: 'Write a function that adds two integers and returns the result',
        language: 'python',
        difficulty: 'easy',
        category: 'logic-math',
        tags: ['math', 'beginner']
      };

      const response = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send(exerciseData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Title');
    });

    it('rejects an exercise without a category', async () => {
      const exerciseData = {
        title: 'Sum of numbers',
        description: 'Write a function that adds two integers and returns the result',
        language: 'python',
        difficulty: 'easy',
        tags: ['math', 'beginner']
      };

      const response = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send(exerciseData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Category');
    });

    it('rejects a title containing malicious HTML', async () => {
      const exerciseData = {
        title: '<script>alert("xss")</script>',
        description: 'Valid description with enough characters',
        language: 'python',
        category: 'logic-math',
        tags: ['test'],
        difficulty: 'easy'
      };

      const response = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send(exerciseData)
        .expect(400);


      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('disallowed characters');
    });
  });

  describe('GET /api/exercises', () => {
    beforeEach(async () => {
      // Create test exercises
      await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Exercise 1',
          description: 'Exercise 1 description',
          language: 'python',
          difficulty: 'easy',
          category: 'logic-math',
          tags: ['test']
        });



      await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Exercise 2',
          description: 'Exercise 2 description',
          language: 'javascript',
          difficulty: 'medium',
          category: 'logic-math',
          tags: ['test']
        });


    });

    it('lists all exercises', async () => {
      const response = await request(app)
        .get('/api/exercises').set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(2);
      expect(response.body.pagination).toBeDefined();
    });

    it('gets the exercise list by text search', async () => {
      const response = await request(app)
        .get('/api/exercises?search=Exercise')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('filters by difficulty', async () => {
      const response = await request(app)
        .get('/api/exercises?difficulty=easy').set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].difficulty).toBe('easy');
    });

    it('paginates results', async () => {
      const response = await request(app)
        .get('/api/exercises?page=1&limit=1').set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(1);
      expect(response.body.pagination.total).toBe(2);
    });
  });

  describe('GET /api/exercises/:id', () => {
    it('gets an exercise by ID', async () => {
      // Create exercise
      const createResponse = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Exercise',
          description: 'Test description for fetching by ID',
          language: 'python',
          difficulty: 'easy',
          category: 'logic-math',
          tags: ['test']
        });



      const id = createResponse.body.data._id;

      // Get the exercise
      const response = await request(app)
        .get(`/api/exercises/${id}`).set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(id);
      expect(response.body.data.title).toBe('Test Exercise');
    });

    it('returns 404 when the exercise does not exist', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .get(`/api/exercises/${fakeId}`).set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });

    it('rejects an invalid ID', async () => {
      const response = await request(app)
        .get('/api/exercises/invalid-id').set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/exercises/:id', () => {
    it('updates an exercise', async () => {
      // Create exercise
      const createResponse = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Original Title',
          description: 'Original description with enough characters',
          language: 'python',
          difficulty: 'easy',
          category: 'logic-math',
          tags: ['test']
        });



      const id = createResponse.body.data._id;

      // Update
      const response = await request(app)
        .patch(`/api/exercises/${id}`).set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Title' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.data.description).toBe('Original description with enough characters');
    });

    it('rejects an update with invalid data', async () => {
      const createResponse = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test',
          description: 'Test description with enough characters',
          language: 'python',
          difficulty: 'easy',
          category: 'logic-math',
          tags: ['test']
        });



      const id = createResponse.body.data._id;

      const response = await request(app)
        .patch(`/api/exercises/${id}`).set('Authorization', `Bearer ${authToken}`)
        .send({ difficulty: 'impossible' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/exercises/:id', () => {
    it('deletes an exercise', async () => {
      // Create exercise
      const createResponse = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'To Delete',
          description: 'This exercise will be deleted in the test',
          language: 'python',
          difficulty: 'easy',
          category: 'logic-math',
          tags: ['test']
        });



      const id = createResponse.body.data._id;

      // Delete
      const response = await request(app)
        .delete(`/api/exercises/${id}`).set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');

      // Verify that it no longer exists.
      await request(app)
        .get(`/api/exercises/${id}`).set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});