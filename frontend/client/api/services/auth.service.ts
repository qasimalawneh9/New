/**
 * Authentication Service
 *
 * Handles all authentication-related API calls
 * Maps to Node.js Express AuthController
 */

import { BaseApiService } from "../base.service";
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from "../endpoints";
import { AuthResponse, User } from "../config";

// Request types - matching our backend
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  role?: "student" | "teacher" | "admin";
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
 *   email: 'admin@talkcon.com',
 *   password: '123456'
 * });
 *
 * // Register
 * const user = await authService.register({
 *   email: 'john@example.com',
 *   password: 'password',
 *   role: 'student'
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

    // Our backend returns the response directly, not wrapped in data
    return response.data || response;
  }

  /**
   * Register new user
   * POST /api/auth/register → AuthController@register
   */
  async register(
    userData: RegisterData,
  ): Promise<{ message: string; user: Partial<User> }> {
    const response = await this.post<{ message: string; user: Partial<User> }>(
      AUTH_ENDPOINTS.REGISTER,
      userData,
      false, // No auth required for registration
    );

    return response.data || response;
  }

  /**
   * Logout user
   * POST /api/auth/logout → AuthController@logout
   */
  async logout(): Promise<{ message: string }> {
    const response = await this.post<{ message: string }>(
      AUTH_ENDPOINTS.LOGOUT,
    );
    return response.data || response;
  }

  /**
   * Get authenticated user profile
   * GET /api/users/me → UserController@getCurrentUser
   */
  async getProfile(): Promise<{ user: User }> {
    const response = await this.get<{ user: User }>(USER_ENDPOINTS.PROFILE);
    return response.data || response;
  }
}

// Export singleton instance
export const authService = new AuthService();
