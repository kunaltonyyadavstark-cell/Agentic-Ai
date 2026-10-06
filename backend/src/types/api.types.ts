/**
 * Standard API response
 * All responses follow this format
 */
export interface ApiResponse<T = unknown> {
  /** Indicates whether the operation succeeded */
  success: boolean;
  /** Response data (can be any type) */
  data?: T;
  /** Descriptive message (optional) */
  message?: string;
  /** Error message (only when success = false) */
  error?: string;
}

/**
 * Pagination information
 */
export interface PaginationInfo {
  /** Current page */
  page: number;
  /** Items per page */
  limit: number;
  /** Total number of items */
  total: number;
  /** Total pages */
  totalPages: number;
}

/**
 * Paginated API response
 * For endpoints that return lists.
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  /** Pagination information */
  pagination: PaginationInfo;
}

/**
 * Usage example:
 * 
 * // Simple response
 * const response: ApiResponse<Exercise> = {
 *   success: true,
 *   data: exercise,
 *   message: 'Exercise created successfully'
 * }
 * 
 * // Paginated response
 * const response: PaginatedResponse<Exercise> = {
 *   success: true,
 *   data: exercises,
 *   pagination: {
 *     page: 1,
 *     limit: 10,
 *     total: 50,
 *     totalPages: 5
 *   }
 * }
 * 
 * // Error response
 * const response: ApiResponse = {
 *   success: false,
 *   error: 'Exercise not found'
 * }
 */