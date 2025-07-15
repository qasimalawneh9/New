/**
 * API Configuration for Node.js/Express Backend Integration
 *
 * This file contains all API configuration and base utilities
 * for communicating with the Node.js/Express backend.
 */

// Environment configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// API Response wrapper - matches our Node.js backend format
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  status?: number;
  success?: boolean;
}

// Authentication response - matches our backend auth controller
export interface AuthResponse {
  token: string;
  user: User;
}

// Base User model - matches our backend user model
export interface User {
  id: string;
  email: string;
  role: "student" | "teacher" | "admin";
  status:
    | "active"
    | "suspended"
    | "banned"
    | "pending_verification"
    | "deleted";
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
