import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

/**
 * Authentication state
 */
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Authentication actions
 */
interface AuthActions {
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: Partial<User>) => void;
}

/**
 * Authentication store with Zustand
 * Automatically persists to localStorage
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      /**
       * Set user and token (after login/register)
       */
      setAuth: (user: User, token: string) => {
        // Save token to localStorage for axios interceptor
        localStorage.setItem('token', token);
        
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      /**
       * Log out
       */
      logout: () => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      /**
       * Change loading state
       */
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      /**
       * Update user data (without changing token)
       */
      updateUser: (updatedData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : null,
        }));
      },
    }),
    {
      name: 'auth-storage', // Key name in localStorage
      // Only persist user, token, and isAuthenticated (not isLoading)
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * Selector hooks for better performance
 */
export const useUser = () => useAuthStore((state) => state.user);
export const useToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);