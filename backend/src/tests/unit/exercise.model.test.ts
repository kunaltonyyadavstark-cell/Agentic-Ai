import { describe, it, expect } from 'vitest';
import { Exercise } from '../../models/Exercise';
import type { CreateExerciseDTO } from '../../types';

describe.skip('Exercise Model', () => {
  describe('Create exercise', () => {
    it('creates a valid exercise', async () => {
      const exerciseData: CreateExerciseDTO = {
        title: 'Sum of two numbers',
        description: 'Write a function that adds two integers and returns the result',
        language: 'python',
        difficulty: 'easy',
        tags: ['math', 'beginner']
      };

      const exercise = await Exercise.create(exerciseData);

      expect(exercise._id).toBeDefined();
      expect(exercise.title).toBe('Sum of two numbers');
      expect(exercise.language).toBe('python');
      expect(exercise.difficulty).toBe('easy');
      expect(exercise.tags).toHaveLength(2);
      expect(exercise.createdAt).toBeInstanceOf(Date);
      expect(exercise.updatedAt).toBeInstanceOf(Date);
    });

    it('creates an exercise with test cases', async () => {
      const exerciseData: CreateExerciseDTO = {
        title: 'Sum of numbers',
        description: 'Function to add two numbers',
        language: 'javascript',
        difficulty: 'easy',
        testCases: [
          {
            input: '2, 3',
            expectedOutput: '5',
            description: 'Sum of 2 and 3'
          }
        ]
      };

      const exercise = await Exercise.create(exerciseData);

      expect(exercise.testCases).toHaveLength(1);
      expect(exercise.testCases[0].input).toBe('2, 3');
      expect(exercise.testCases[0].expectedOutput).toBe('5');
    });
  });

  describe('Validation', () => {
    it('fails if the title is missing', async () => {
      const exerciseData = {
        description: 'Valid description with more than 10 characters',
        language: 'python',
        difficulty: 'easy'
      };

      await expect(Exercise.create(exerciseData)).rejects.toThrow();
    });

    it('fails if the title is too short', async () => {
      const exerciseData = {
        title: 'AB',
        description: 'Valid description with more than 10 characters',
        language: 'python',
        difficulty: 'easy'
      };

      await expect(Exercise.create(exerciseData)).rejects.toThrow();
    });

    it('fails if the description is too short', async () => {
      const exerciseData = {
        title: 'Valid title',
        description: 'Short',
        language: 'python',
        difficulty: 'easy'
      };

      await expect(Exercise.create(exerciseData)).rejects.toThrow();
    });

    it('fails with invalid difficulty', async () => {
      const exerciseData = {
        title: 'Valid title',
        description: 'Valid description with more than 10 characters',
        language: 'python',
        difficulty: 'extreme'
      };

      await expect(Exercise.create(exerciseData)).rejects.toThrow();
    });
  });

  describe('Search and filtering', () => {
    it('finds exercises by difficulty', async () => {
      await Exercise.create({
        title: 'Easy addition',
        description: 'Easy integer addition exercise',
        language: 'python',
        difficulty: 'easy',
        tags: ['math']
      });

      const easyExercises = await Exercise.find({ difficulty: 'easy' });
      expect(easyExercises.length).toBeGreaterThanOrEqual(1);
    });

    it('finds exercises by language', async () => {
      await Exercise.create({
        title: 'Python Algorithm',
        description: 'Python exercise with a sufficiently long description',
        language: 'python',
        difficulty: 'medium',
        tags: ['algorithms']
      });

      const pythonExercises = await Exercise.find({ language: 'python' });
      expect(pythonExercises.length).toBeGreaterThanOrEqual(1);
    });

    it('finds exercises by tags', async () => {
      await Exercise.create({
        title: 'Basic math',
        description: 'Basic math exercise with a complete description',
        language: 'python',
        difficulty: 'easy',
        tags: ['math']
      });

      const mathExercises = await Exercise.find({ tags: 'math' });
      expect(mathExercises.length).toBeGreaterThanOrEqual(1);
    });

    it('sorts by creation date', async () => {
      const exercises = await Exercise.find().sort({ createdAt: -1 });
      expect(exercises).toBeInstanceOf(Array);
    });
  });

  describe('Update', () => {
    it('updates an exercise', async () => {
      const exercise = await Exercise.create({
        title: 'Original title',
        description: 'Original description with enough characters',
        language: 'python',
        difficulty: 'easy'
      });

      exercise.title = 'Updated title';
      await exercise.save();

      const updated = await Exercise.findById(exercise._id);
      expect(updated?.title).toBe('Updated title');
    });
  });

  describe('Deletion', () => {
    it('deletes an exercise', async () => {
      const exercise = await Exercise.create({
        title: 'To delete',
        description: 'This exercise will be deleted from the database',
        language: 'python',
        difficulty: 'easy'
      });

      await Exercise.findByIdAndDelete(exercise._id);

      const deleted = await Exercise.findById(exercise._id);
      expect(deleted).toBeNull();
    });
  });
});