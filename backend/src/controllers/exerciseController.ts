import { Request, Response, NextFunction } from 'express';
import { Exercise } from '../models/Exercise';
import { ExerciseValidator } from '../utils/exercise.validator';
import { AppError } from '../middleware/errorHandler';
import type { CreateExerciseDTO, ProgrammingLanguage, UpdateExerciseDTO } from '../types';

/**
 * Controller for managing programming exercises.
 * Implements full CRUD with validation and security
 */
export class ExerciseController {
  /**
   * Get all exercises with pagination and filters.
   * 
   * @route GET /api/exercises
   * @access Public
   * 
   * @param req - Request with query parameters (page, limit, difficulty, language, search)
   * @param res - Response
   * @param next - NextFunction for error handling
   * 
   * @example
   * GET /api/exercises?page=1&limit=10&difficulty=easy&language=python
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Build filters.
      const filters: Record<string, unknown> = {};

      if (req.query.difficulty) {
        filters.difficulty = req.query.difficulty;
      }

      if (req.query.language) {
        filters.language = req.query.language;
      }

      if (req.query.category) {
        filters.category = req.query.category;
      }

      if (req.query.search) {
        filters.$text = { $search: req.query.search as string };
      }

      // Run the paginated query.
      const [exercises, total] = await Promise.all([
        Exercise.find(filters)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        Exercise.countDocuments(filters)
      ]);

      res.status(200).json({
        success: true,
        data: exercises,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a specific exercise by its ID.
   * 
   * @route GET /api/exercises/:id
   * @access Public
   * 
   * @param req - Request with params.id
   * @param res - Response
   * @param next - NextFunction
   * 
   * @throws {AppError} 404 - If the exercise does not exist
   * 
   * @example
   * GET /api/exercises/507f1f77bcf86cd799439011
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const exercise = await Exercise.findById(id).lean();

      if (!exercise) {
        throw new AppError('Exercise not found', 404);
      }

      res.status(200).json({
        success: true,
        data: exercise
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new exercise
   * 
   * @route POST /api/exercises
   * @access Public (TODO: change to private with authentication)
   * 
   * @param req - Request with body CreateExerciseDTO
   * @param res - Response
   * @param next - NextFunction
   * 
   * @throws {AppError} 400 - If the data is invalid
   * 
   * @example
   * POST /api/exercises
   * {
   *   "title": "Sum of numbers",
   *   "description": "Write a function that adds two numbers",
   *   "language": "python",
   *   "difficulty": "easy",
   *   "tags": ["math"]
   * }
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const exerciseData: CreateExerciseDTO = req.body;

      // Validate the title.
      const titleValidation = ExerciseValidator.validateTitle(exerciseData.title);
      if (!titleValidation.isValid) {
        throw new AppError(titleValidation.error!, 400);
      }

      // Validate the description.
      const descValidation = ExerciseValidator.validateDescription(exerciseData.description);
      if (!descValidation.isValid) {
        throw new AppError(descValidation.error!, 400);
      }

      // Validate the difficulty.
      const difficultyValidation = ExerciseValidator.validateDifficulty(exerciseData.difficulty);
      if (!difficultyValidation.isValid) {
        throw new AppError(difficultyValidation.error!, 400);
      }

      // Validate the language.
      const languageValidation = ExerciseValidator.validateLanguage(exerciseData.language);
      if (!languageValidation.isValid) {
        throw new AppError(languageValidation.error!, 400);
      }

      // Use sanitized values.
      const sanitizedData: CreateExerciseDTO = {
        title: titleValidation.sanitized!,
        description: descValidation.sanitized!,
        language: languageValidation.sanitized! as ProgrammingLanguage,
        difficulty: difficultyValidation.sanitized! as any,
        tags: exerciseData.tags,
        category: exerciseData.category,
        keywords: exerciseData.keywords,
        testCases: exerciseData.testCases,
        solution: exerciseData.solution,
        starterCode: exerciseData.starterCode,
        hints: exerciseData.hints
      };

      // Create exercise
      const exercise = await Exercise.create({
        ...sanitizedData,
        userId: req.user?.userId
      });

      res.status(201).json({
        success: true,
        data: exercise,
        message: 'Exercise created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an existing exercise
   * 
   * @route PATCH /api/exercises/:id
   * @access Public (TODO: make private and validate ownership)
   * 
   * @param req - Request with params.id y body UpdateExerciseDTO
   * @param res - Response
   * @param next - NextFunction
   * 
   * @throws {AppError} 404 - If the exercise does not exist
   * @throws {AppError} 400 - If the data is invalid
   * 
   * @example
   * PATCH /api/exercises/507f1f77bcf86cd799439011
   * {
   *   "title": "New title"
   * }
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updates: UpdateExerciseDTO = req.body;

      // Validate fields if present.
      if (updates.title) {
        const validation = ExerciseValidator.validateTitle(updates.title);
        if (!validation.isValid) {
          throw new AppError(validation.error!, 400);
        }
        updates.title = validation.sanitized!;
      }

      if (updates.description) {
        const validation = ExerciseValidator.validateDescription(updates.description);
        if (!validation.isValid) {
          throw new AppError(validation.error!, 400);
        }
        updates.description = validation.sanitized!;
      }

      if (updates.difficulty) {
        const validation = ExerciseValidator.validateDifficulty(updates.difficulty);
        if (!validation.isValid) {
          throw new AppError(validation.error!, 400);
        }
        updates.difficulty = validation.sanitized! as any;
      }

      if (updates.language) {
        const validation = ExerciseValidator.validateLanguage(updates.language);
        if (!validation.isValid) {
          throw new AppError(validation.error!, 400);
        }
        updates.language = validation.sanitized! as ProgrammingLanguage;
      }

      // Update exercise
      const exercise = await Exercise.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!exercise) {
        throw new AppError('Exercise not found', 404);
      }

      res.status(200).json({
        success: true,
        data: exercise,
        message: 'Exercise updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete an exercise
   * 
   * @route DELETE /api/exercises/:id
   * @access Public (TODO: make private and validate ownership)
   * 
   * @param req - Request with params.id
   * @param res - Response
   * @param next - NextFunction
   * 
   * @throws {AppError} 404 - If the exercise does not exist
   * 
   * @example
   * DELETE /api/exercises/507f1f77bcf86cd799439011
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const exercise = await Exercise.findByIdAndDelete(id);

      if (!exercise) {
        throw new AppError('Exercise not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Exercise deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export the controller singleton.
export const exerciseController = new ExerciseController();