// src/lib/validations/exerciseValidation.ts

import { z } from 'zod';

// Test Case schema
export const testCaseSchema = z.object({
  input: z.array(z.any()).min(1, 'Must have at least one input'),
  expectedOutput: z.any(),
  description: z.string().optional(),
});

// Exercise schema
export const createExerciseSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  
  difficulty: z
    .string()
    .min(1, 'You must select a difficulty')
    .refine((val) => ['easy', 'medium', 'hard'].includes(val), {
      message: 'Difficulty must be easy, medium, or hard',
    }),
  
  category: z
    .string()
    .min(1, 'You must select a category')
    .refine((val) => ['arrays', 'strings', 'loops', 'data-structures', 'algorithms', 'logic-math'].includes(val), {
      message: 'Invalid category',
    }),

  
  language: z
    .string()
    .min(2, 'You must select a language'),
  
  tags: z
    .array(z.string())
    .min(1, 'You must add at least one tag')
    .max(10, 'You cannot add more than 10 tags'),
  
  testCases: z
    .array(testCaseSchema)
    .min(1, 'You must add at least one test case')
    .max(20, 'You cannot add more than 20 test cases'),
  
  solution: z
    .string()
    .min(1, 'Solution is required')
    .max(10000, 'Solution cannot exceed 10000 characters'),
  
  starterCode: z
    .string()
    .max(10000, 'Starter code cannot exceed 10000 characters')
    .optional()
    .or(z.literal('')),
  
  hints: z
    .array(z.string().min(1))
    .max(10, 'You cannot add more than 10 hints')
    .optional(),
});

export type CreateExerciseFormData = z.infer<typeof createExerciseSchema>;