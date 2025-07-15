/**
 * API Configuration for Laravel Backend Integration
 *
 * This file contains all API configuration and base utilities
 * for communicating with the Laravel backend.
 */

// Environment configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
};

// API Response wrapper - matches Laravel API Resource format
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

// Laravel pagination response
export interface PaginatedResponse<T = any> {
  data: T[];
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Laravel validation error response
export interface ValidationErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}

// Authentication response
export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

// Base User model (matches Laravel User model)
export interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at?: string;
  user_type: "student" | "teacher" | "admin";
  avatar?: string;
  created_at: string;
  updated_at: string;
}

// HTTP methods
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// Request configuration
export interface RequestConfig {
  method: HttpMethod;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

/**
 * Get authentication token from storage
 */
export const getAuthToken = (): string | null => {
  return (
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
  );
};

/**
 * Set authentication token in storage
 */
export const setAuthToken = (
  token: string,
  remember: boolean = false,
): void => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("auth_token", token);
};

/**
 * Remove authentication token from storage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem("auth_token");
  sessionStorage.removeItem("auth_token");
};

/**
 * Build request headers with authentication
 */
export const buildHeaders = (
  customHeaders?: Record<string, string>,
): Record<string, string> => {
  const headers = { ...API_CONFIG.HEADERS };

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Add CSRF token if available (for Laravel CSRF protection)
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");
  if (csrfToken) {
    headers["X-CSRF-TOKEN"] = csrfToken;
  }

  return { ...headers, ...customHeaders };
};

/**
 * Build full URL with base URL
 */
export const buildUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

/**
 * Build query string from parameters
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};
