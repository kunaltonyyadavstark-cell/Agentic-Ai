import { describe, it, expect } from 'vitest';
import type { 
  DifficultyLevel, 
  ProgrammingLanguage, 
  CreateExerciseDTO,
  TestCase,
  ApiResponse,
  PaginatedResponse
} from '../../types';

describe('TypeScript Types', () => {
  describe('DifficultyLevel', () => {
    it('accepts valid values', () => {
      const easy: DifficultyLevel = 'easy';
      const medium: DifficultyLevel = 'medium';
      const hard: DifficultyLevel = 'hard';

      expect(easy).toBe('easy');
      expect(medium).toBe('medium');
      expect(hard).toBe('hard');
    });
  });

  describe('ProgrammingLanguage', () => {
    it('accepts valid languages', () => {
      const python: ProgrammingLanguage = 'python';
      const javascript: ProgrammingLanguage = 'javascript';
      const typescript: ProgrammingLanguage = 'typescript';

      expect(python).toBe('python');
      expect(javascript).toBe('javascript');
      expect(typescript).toBe('typescript');
    });
  });

  describe('CreateExerciseDTO', () => {
    it('creates a valid DTO', () => {
      const dto: CreateExerciseDTO = {
        title: 'Sum of numbers',
        description: 'Write a function that adds two numbers',
        language: 'python',
        difficulty: 'easy',
        tags: ['math', 'beginner']
      };

      expect(dto.title).toBe('Sum of numbers');
      expect(dto.language).toBe('python');
      expect(dto.difficulty).toBe('easy');
      expect(dto.tags).toHaveLength(2);
    });

    it('allows optional fields', () => {
      const dto: CreateExerciseDTO = {
        title: 'Test',
        description: 'Test description',
        language: 'javascript',
        difficulty: 'medium'
        // tags y testCases son opcionales
      };

      expect(dto.tags).toBeUndefined();
      expect(dto.testCases).toBeUndefined();
    });
  });

  describe('TestCase', () => {
    it('creates a test case with string values', () => {
      const testCase: TestCase = {
        input: '2, 3',
        expectedOutput: '5',
        description: 'Sum of 2 and 3'
      };

      expect(testCase.input).toBe('2, 3');
      expect(testCase.expectedOutput).toBe('5');
    });

    it('creates a test case with objects', () => {
      const testCase: TestCase = {
        input: { a: 2, b: 3 },
        expectedOutput: { result: 5 }
      };

      expect(testCase.input).toEqual({ a: 2, b: 3 });
      expect(testCase.expectedOutput).toEqual({ result: 5 });
    });
  });

  describe('ApiResponse', () => {
    it('creates a successful response', () => {
      const response: ApiResponse<string> = {
        success: true,
        data: 'Operation succeeded',
        message: 'Todo bien'
      };

      expect(response.success).toBe(true);
      expect(response.data).toBe('Operation succeeded');
      expect(response.error).toBeUndefined();
    });

    it('creates an error response', () => {
      const response: ApiResponse = {
        success: false,
        error: 'Something went wrong'
      };

      expect(response.success).toBe(false);
      expect(response.error).toBe('Something went wrong');
      expect(response.data).toBeUndefined();
    });
  });

  describe('PaginatedResponse', () => {
    it('creates a paginated response', () => {
      const response: PaginatedResponse<string> = {
        success: true,
        data: ['item1', 'item2', 'item3'],
        pagination: {
          page: 1,
          limit: 10,
          total: 50,
          totalPages: 5
        }
      };

      expect(response.data).toHaveLength(3);
      expect(response.pagination.page).toBe(1);
      expect(response.pagination.totalPages).toBe(5);
    });
  });
});