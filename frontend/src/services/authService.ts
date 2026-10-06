import api, { ApiResponse, getResponseData } from './api';
import { 
  User, 
  LoginData, 
  RegisterData, 
  AuthResponse 
} from '../types';

/**
 * Authentication Service
 * Handles all requests related to auth
 */
class AuthService {
  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return getResponseData(response);
  }

  /**
   * Log in user
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return getResponseData(response);
  }

  /**
   * Get current user (requires token)
   */
  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return getResponseData(response);
  }

  /**
   * Log out (clear client-side token)
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Verify if token is valid
   */
  async verifyToken(): Promise<boolean> {
    try {
      await this.getMe();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if token is stored
   */
  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}

// Export singleton instance
export const authService = new AuthService();