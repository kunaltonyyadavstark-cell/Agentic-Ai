import api, { ApiResponse, getResponseData } from './api';
import {
  Exercise,
  CreateExerciseData,
  UpdateExerciseData,
  ExerciseFilters,
} from '../types';

/**
 * Exercise Service
 * Handles all requests related to exercises
 */
class ExerciseService {
  /**
   * Get all exercises with optional filters
   */
  async getAll(filters?: ExerciseFilters): Promise<Exercise[]> {
    const params = new URLSearchParams();

    if (filters?.language) params.append('language', filters.language);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get<ApiResponse<Exercise[]>>(
      `/exercises?${params.toString()}`
    );
    return getResponseData(response);
  }

  /**
   * Get exercise by ID
   */
  async getById(id: string): Promise<Exercise> {
    const response = await api.get<ApiResponse<Exercise>>(`/exercises/${id}`);
    return getResponseData(response);
  }

  /**
   * Create new exercise (requires authentication)
   */
  async create(data: CreateExerciseData): Promise<Exercise> {
    const response = await api.post<ApiResponse<Exercise>>('/exercises', data);
    return getResponseData(response);
  }

  /**
   * Update exercise (requires authentication)
   */
  async update(id: string, data: UpdateExerciseData): Promise<Exercise> {
    const response = await api.patch<ApiResponse<Exercise>>(
      `/exercises/${id}`,
      data
    );
    return getResponseData(response);
  }

  /**
   * Delete exercise (requires authentication)
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/exercises/${id}`);
  }

  /**
   * Search exercises by query term
   */
  async search(query: string): Promise<Exercise[]> {
    const response = await api.get<ApiResponse<Exercise[]>>(
      `/exercises?search=${encodeURIComponent(query)}`
    );
    return getResponseData(response);
  }

  /**
   * Get exercises by language
   */
  async getByLanguage(language: string): Promise<Exercise[]> {
    const response = await api.get<ApiResponse<Exercise[]>>(
      `/exercises?language=${language}`
    );
    return getResponseData(response);
  }

  /**
   * Get exercises by difficulty
   */
  async getByDifficulty(difficulty: string): Promise<Exercise[]> {
    const response = await api.get<ApiResponse<Exercise[]>>(
      `/exercises?difficulty=${difficulty}`
    );
    return getResponseData(response);
  }
}

// Export singleton instance
export const exerciseService = new ExerciseService();