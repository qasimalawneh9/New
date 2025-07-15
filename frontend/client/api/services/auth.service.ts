/**
 * Authentication Service
 *
 * Handles all authentication-related API calls
 * Maps to Laravel AuthController
 */

import { BaseApiService } from "../base.service";
import { AUTH_ENDPOINTS } from "../endpoints";
import { AuthResponse, User } from "../config";

// Request types
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  user_type: "student" | "teacher";
  terms_accepted: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface VerifyEmailData {
  token: string;
}

/**
 * AuthService class
 *
 * Usage Example:
 * ```typescript
 * const authService = new AuthService();
 *
 * // Login
 * const response = await authService.login({
 *   email: 'user@example.com',
 *   password: 'password'
 * });
 *
 * // Register
 * const user = await authService.register({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'password',
 *   password_confirmation: 'password',
 *   user_type: 'student',
 *   terms_accepted: true
 * });
 * ```
 */
export class AuthService extends BaseApiService {
  /**
   * Login user
   * POST /api/auth/login → AuthController@login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>(
      AUTH_ENDPOINTS.LOGIN,
      credentials,
      false, // No auth required for login
    );

    return response.data;
  }

  /**
   * Register new user
   * POST /api/auth/register → AuthController@register
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>(
      AUTH_ENDPOINTS.REGISTER,
      userData,
      false, // No auth required for registration
    );

    return response.data;
  }

  /**
   * Logout user
   * POST /api/auth/logout → AuthController@logout
   */
  async logout(): Promise<void> {
    await this.post(AUTH_ENDPOINTS.LOGOUT);
  }

  /**
   * Get authenticated user profile
   * GET /api/auth/profile → AuthController@profile
   */
  async getProfile(): Promise<User> {
    const response = await this.get<User>(AUTH_ENDPOINTS.PROFILE);
    return response.data;
  }

  /**
   * Refresh authentication token
   * POST /api/auth/refresh → AuthController@refresh
   */
  async refreshToken(): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>(AUTH_ENDPOINTS.REFRESH);
    return response.data;
  }

  /**
   * Send forgot password email
   * POST /api/auth/forgot-password → AuthController@forgotPassword
   */
  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    const response = await this.post<{ message: string }>(
      AUTH_ENDPOINTS.FORGOT_PASSWORD,
      data,
      false,
    );

    return response.data;
  }

  /**
   * Reset password with token
   * POST /api/auth/reset-password → AuthController@resetPassword
   */
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await this.post<{ message: string }>(
      AUTH_ENDPOINTS.RESET_PASSWORD,
      data,
      false,
    );

    return response.data;
  }

  /**
   * Verify email address
   * POST /api/auth/verify-email → AuthController@verifyEmail
   */
  async verifyEmail(data: VerifyEmailData): Promise<{ message: string }> {
    const response = await this.post<{ message: string }>(
      AUTH_ENDPOINTS.VERIFY_EMAIL,
      data,
      false,
    );

    return response.data;
  }
}

// Export singleton instance
export const authService = new AuthService();
