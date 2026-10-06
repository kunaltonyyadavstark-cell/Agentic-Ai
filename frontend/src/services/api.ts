import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

/**
 * Axios base configuration
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Configured Axios instance
 */
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor: Automatically attaches JWT token
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor: Global error handling
 */
api.interceptors.response.use(
  (response) => {
    // Successful response, return data directly
    return response;
  },
  (error: AxiosError<{ error?: string; message?: string }>) => {
    // Error handling
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          toast.error(data.error || 'Invalid request');
          break;
        case 401:
          toast.error('Session expired. Please log in again');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Redirect to login if not already there
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          toast.error('You do not have permission to perform this action');
          break;
        case 404:
          toast.error(data.error || 'Resource not found');
          break;
        case 429:
          toast.error(data.error || 'Too many requests. Please try again later');
          break;
        case 500:
          toast.error('Server error. Please try again later');
          break;
        default:
          toast.error(data.error || 'An unexpected error occurred');
      }
    } else if (error.request) {
      // Network error or server unavailable
      toast.error('Could not connect to the server. Please check your connection');
    } else {
      toast.error('Error processing request');
    }

    return Promise.reject(error);
  }
);

/**
 * API response types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Helper to extract data from response
 */
export const getResponseData = <T>(response: { data: ApiResponse<T> }): T => {
  return response.data.data as T;
};

export default api;