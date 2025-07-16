/**
 * Authentication Hook
 *
 * Custom hook for handling authentication state and operations.
 * Integrates with Laravel backend authentication system.
 */

import { useState, useEffect, useCallback } from "react";
import { authService } from "@/api/services/auth.service";
import {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  User,
} from "@/api/config";
import type {
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
} from "@/api/services/auth.service";

// Authentication state interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Hook return type
interface UseAuthReturn extends AuthState {
  // Authentication actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;

  // Profile actions
  refreshProfile: () => Promise<void>;
  refreshToken: () => Promise<void>;

  // Utility functions
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
}

/**
 * useAuth Hook
 *
 * Usage Example:
 * ```typescript
 * const {
 *   user,
 *   isAuthenticated,
 *   isLoading,
 *   login,
 *   logout,
 *   error
 * } = useAuth();
 *
 * const handleLogin = async () => {
 *   try {
 *     await login({ email: 'user@example.com', password: 'password' });
 *     // User is now authenticated
 *   } catch (error) {
 *     // Handle login error
 *   }
 * };
 * ```
 */
export const useAuth = (): UseAuthReturn => {
  // Authentication state
  const [state, setState] = useState<AuthState>({
    user: null,
    token: getAuthToken(),
    isAuthenticated: false,
    isLoading: true, // Start with loading true to check existing auth
    error: null,
  });

  // Update authentication state
  const updateAuthState = useCallback((updates: Partial<AuthState>) => {
    setState((prevState) => ({
      ...prevState,
      ...updates,
      isAuthenticated: !!(updates.user || prevState.user),
    }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    updateAuthState({ error: null });
  }, [updateAuthState]);

  // Check authentication status on hook initialization
  const checkAuthStatus = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      updateAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    try {
      updateAuthState({ isLoading: true, error: null });

      // Verify token and get user profile
      const user = await authService.getProfile();

      updateAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      // Token is invalid, clear auth state
      removeAuthToken();
      updateAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.status === 401 ? null : error.message, // Don't show error for expired tokens
      });
    }
  }, [updateAuthState]);

  // Login function
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      try {
        updateAuthState({ isLoading: true, error: null });

        const authResponse = await authService.login(credentials);

        // Store token
        setAuthToken(authResponse.access_token, credentials.remember || false);

        // Update state
        updateAuthState({
          user: authResponse.user,
          token: authResponse.access_token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // Track login event for analytics
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "login", {
            method: "email",
            user_type: authResponse.user.user_type,
          });
        }
      } catch (error: any) {
        updateAuthState({
          isLoading: false,
          error: error.message || "Login failed",
        });
        throw error; // Re-throw for component error handling
      }
    },
    [updateAuthState],
  );

  // Register function
  const register = useCallback(
    async (userData: RegisterData): Promise<void> => {
      try {
        updateAuthState({ isLoading: true, error: null });

        const authResponse = await authService.register(userData);

        // Store token
        setAuthToken(authResponse.access_token, false); // Don't remember for new registrations

        // Update state
        updateAuthState({
          user: authResponse.user,
          token: authResponse.access_token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // Track registration event for analytics
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "sign_up", {
            method: "email",
            user_type: authResponse.user.user_type,
          });
        }
      } catch (error: any) {
        updateAuthState({
          isLoading: false,
          error: error.message || "Registration failed",
        });
        throw error; // Re-throw for component error handling
      }
    },
    [updateAuthState],
  );

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      updateAuthState({ isLoading: true, error: null });

      // Call backend logout endpoint
      await authService.logout();
    } catch (error) {
      // Even if backend logout fails, clear local state
      console.error("Logout error:", error);
    } finally {
      // Clear local authentication state
      removeAuthToken();
      updateAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      // Track logout event for analytics
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "logout");
      }
    }
  }, [updateAuthState]);

  // Forgot password function
  const forgotPassword = useCallback(
    async (data: ForgotPasswordData): Promise<void> => {
      try {
        updateAuthState({ isLoading: true, error: null });

        await authService.forgotPassword(data);

        updateAuthState({
          isLoading: false,
          error: null,
        });
      } catch (error: any) {
        updateAuthState({
          isLoading: false,
          error: error.message || "Failed to send reset email",
        });
        throw error;
      }
    },
    [updateAuthState],
  );

  // Reset password function
  const resetPassword = useCallback(
    async (data: ResetPasswordData): Promise<void> => {
      try {
        updateAuthState({ isLoading: true, error: null });

        await authService.resetPassword(data);

        updateAuthState({
          isLoading: false,
          error: null,
        });
      } catch (error: any) {
        updateAuthState({
          isLoading: false,
          error: error.message || "Failed to reset password",
        });
        throw error;
      }
    },
    [updateAuthState],
  );

  // Refresh user profile
  const refreshProfile = useCallback(async (): Promise<void> => {
    if (!state.isAuthenticated) return;

    try {
      const user = await authService.getProfile();
      updateAuthState({ user });
    } catch (error: any) {
      // If profile refresh fails, user might be logged out
      if (error.status === 401) {
        await logout();
      }
    }
  }, [state.isAuthenticated, updateAuthState, logout]);

  // Refresh authentication token
  const refreshToken = useCallback(async (): Promise<void> => {
    if (!state.token) return;

    try {
      const authResponse = await authService.refreshToken();

      // Update token
      setAuthToken(authResponse.access_token, true);

      updateAuthState({
        token: authResponse.access_token,
        user: authResponse.user,
      });
    } catch (error: any) {
      // If token refresh fails, logout user
      await logout();
    }
  }, [state.token, updateAuthState, logout]);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!state.isAuthenticated || !state.token) return;

    // Set up token refresh interval (refresh every 50 minutes for 60-minute tokens)
    const refreshInterval = setInterval(
      () => {
        refreshToken();
      },
      50 * 60 * 1000,
    ); // 50 minutes

    return () => clearInterval(refreshInterval);
  }, [state.isAuthenticated, state.token, refreshToken]);

  return {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    refreshProfile,
    refreshToken,
    clearError,
    checkAuthStatus,
  };
};

export default useAuth;
