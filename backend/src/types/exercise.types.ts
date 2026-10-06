import { ObjectId } from 'mongodb';

/**
 * Exercise difficulty level.
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/**
 * Supported programming languages
 */
export type ProgrammingLanguage =
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'java'
  | 'cpp'
  | 'c'
  | 'csharp'
  | 'go'
  | 'rust'
  | 'php'
  | 'ruby';

export type ExerciseCategory =
  | 'arrays'
  | 'strings'
  | 'loops'
  | 'data-structures'
  | 'algorithms'
  | 'logic-math';

/**
 * Test case for validating solutions.
 */
export interface TestCase {
  /** Test case input */
  input: string | Record<string, unknown>;
  /** Expected output */
  expectedOutput: string | Record<string, unknown>;
  /** Optional test case description */
  description?: string;
}

/**
 * Exercise document in MongoDB.
 * This interface represents how the data is stored in the database
 */
export interface IExercise {
  /** Unique exercise ID (MongoDB) */
  _id: ObjectId;
  /** Exercise title */
  title: string;
  /** Detailed problem description */
  description: string;
  /** Target programming language */
  language: ProgrammingLanguage;
  /** Difficulty level */
  difficulty: DifficultyLevel;
  /** Categorization tags (e.g., arrays, algorithms) */
  tags: string[];
  category: ExerciseCategory;
  /** Keywords for advanced search */
  keywords: string[];
  /** Test cases for validating solutions */
  testCases: TestCase[];
  /** Reference solution (optional) */
  solution?: string;
  /** Creation date */
  createdAt: Date;
  /** Last updated date */
  updatedAt: Date;
  /** ID of the user who created the exercise (optional, for future use) */
  userId?: ObjectId;
}

/**
 * DTO (Data Transfer Object) for creating an exercise.
 * Fields sent by the user when creating an exercise
 */
export interface CreateExerciseDTO {
  /** Exercise title (3-200 characters) */
  title: string;
  /** Problem description (10-5000 characters) */
  description: string;
  /** Programming language */
  language: ProgrammingLanguage;
  /** Difficulty level */
  difficulty: DifficultyLevel;
  /** Optional tags */
  tags?: string[];
  category: ExerciseCategory;
  /** Optional keywords */
  keywords?: string[];
  /** Optional test cases */
  testCases?: TestCase[];
  /** Optional reference solution */
  solution?: string;
}

/**
 * DTO for updating an exercise.
 * All fields are optional; update only the fields you need.
 */
export interface UpdateExerciseDTO {
  title?: string;
  description?: string;
  language?: ProgrammingLanguage;
  difficulty?: DifficultyLevel;
  tags?: string[];
  category?: ExerciseCategory;
  keywords?: string[];
  testCases?: TestCase[];
  solution?: string;
}

/**
 * API response for an exercise.
 * The data returned to the frontend (without internal fields).
 */
export interface ExerciseResponse {
  _id: string;
  title: string;
  description: string;
  language: ProgrammingLanguage;
  difficulty: DifficultyLevel;
  tags: string[];
  category: ExerciseCategory;
  keywords: string[];
  testCases: TestCase[];
  solution?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Filters for searching exercises
 */
export interface ExerciseFilters {
  /** Search by title/description text */
  search?: string;
  /** Filter by difficulty */
  difficulty?: DifficultyLevel;
  /** Filter by language */
  language?: ProgrammingLanguage;
  /** Filter by category */
  category?: ExerciseCategory;
  /** Filter by tags */
  tags?: string[];
  /** Page number (for pagination) */
  page?: number;
  /** Number of results per page */
  limit?: number;
}