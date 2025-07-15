/**
 * API Endpoints for Node.js/Express Backend
 *
 * This file defines all API endpoints that correspond to our Node.js backend routes.
 * Each endpoint maps to a specific Express controller action.
 */

// Authentication endpoints → auth.controller.ts
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login", // POST → login
  LOGOUT: "/auth/logout", // POST → logout
  REGISTER: "/auth/register", // POST → register
} as const;

// User management endpoints → user.controller.ts
export const USER_ENDPOINTS = {
  PROFILE: "/users/me", // GET → getCurrentUser
} as const;

// Teacher management endpoints → teacher.controller.ts
export const TEACHER_ENDPOINTS = {
  INDEX: "/teachers", // GET → getAllTeachers
} as const;

// Booking management endpoints → booking.controller.ts
export const BOOKING_ENDPOINTS = {
  STORE: "/bookings", // POST → createBooking
} as const;

// Wallet management endpoints → wallet.controller.ts
export const WALLET_ENDPOINTS = {
  MY_WALLET: "/wallets/me", // GET → getMyWallet
} as const;

/**
 * Utility function to replace URL parameters
 * Example: replaceUrlParams('/users/:id', { id: '123' }) → '/users/123'
 */
export const replaceUrlParams = (
  url: string,
  params: Record<string, string | number>,
): string => {
  let replacedUrl = url;

  Object.entries(params).forEach(([key, value]) => {
    replacedUrl = replacedUrl.replace(`:${key}`, String(value));
  });

  return replacedUrl;
};

/**
 * Get all endpoints grouped by resource
 */
export const ALL_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  TEACHER: TEACHER_ENDPOINTS,
  BOOKING: BOOKING_ENDPOINTS,
  WALLET: WALLET_ENDPOINTS,
} as const;
