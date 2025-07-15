/**
 * API Configuration for Node.js/Express Backend Integration
 */

// Environment configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3002/api",
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

// Paginated response for list endpoints
export interface PaginatedResponse<T = any> {
  data: T[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    from: number;
    to: number;
  };
}

// Validation error response
export interface ValidationErrorResponse {
  message: string;
  errors: Record<string, string[]>;
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
  name?: string;
  role: "student" | "teacher" | "admin";
  status:
    | "active"
    | "suspended"
    | "banned"
    | "pending_verification"
    | "deleted";
  profileImage?: string;
  phone?: string;
  timezone?: string;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
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

// Platform configuration constants
export const PLATFORM_CONFIG = {
  // Business rules
  COMMISSION_RATE: 0.2, // 20% platform commission
  VAT_RATE: 0.1, // 10% VAT
  RESCHEDULE_WINDOW_HOURS: 72, // 72-hour rescheduling window
  CANCELLATION_WINDOW_HOURS: 48, // 48-hour cancellation policy
  MAX_RESCHEDULES_PER_BOOKING: 1, // Maximum 1 reschedule per booking
  AUTO_COMPLETION_HOURS: 48, // Auto-complete after 48 hours

  // Payment thresholds
  MIN_PAYPAL_WITHDRAWAL: 10, // $10 minimum PayPal withdrawal
  MIN_BANK_WITHDRAWAL: 100, // $100 minimum bank transfer withdrawal

  // Teacher suspension rules
  MAX_ABSENCES_BEFORE_SUSPENSION: 3, // Suspend after 3 absences

  // Meeting platforms
  SUPPORTED_MEETING_PLATFORMS: [
    "zoom",
    "teams",
    "meet",
    "skype",
    "whatsapp",
  ] as const,

  // Payment providers
  SUPPORTED_PAYMENT_PROVIDERS: [
    "paypal",
    "stripe",
    "apple_pay",
    "google_pay",
    "wechat_pay",
  ] as const,

  // Lesson durations (in minutes)
  LESSON_DURATIONS: [15, 30, 45, 60, 90, 120],

  // Review system
  MAX_RATING: 5,
  MIN_RATING: 1,

  // SLA times (in hours)
  SUPPORT_SLA: {
    low: 72,
    medium: 24,
    high: 8,
    urgent: 2,
  },
} as const;

// Type exports for platform config
export type MeetingPlatform =
  (typeof PLATFORM_CONFIG.SUPPORTED_MEETING_PLATFORMS)[number];
export type PaymentProvider =
  (typeof PLATFORM_CONFIG.SUPPORTED_PAYMENT_PROVIDERS)[number];
export type SupportPriority = keyof typeof PLATFORM_CONFIG.SUPPORT_SLA;
