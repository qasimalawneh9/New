/**
 * API Endpoints for Laravel Backend
 *
 * This file defines all API endpoints that correspond to Laravel routes.
 * Each endpoint maps to a specific Laravel controller action.
 */

// Authentication endpoints → AuthController
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login", // POST → AuthController@login
  LOGOUT: "/auth/logout", // POST → AuthController@logout
  REGISTER: "/auth/register", // POST → AuthController@register
  PROFILE: "/auth/profile", // GET → AuthController@profile
  REFRESH: "/auth/refresh", // POST → AuthController@refresh
  FORGOT_PASSWORD: "/auth/forgot-password", // POST → AuthController@forgotPassword
  RESET_PASSWORD: "/auth/reset-password", // POST → AuthController@resetPassword
  VERIFY_EMAIL: "/auth/verify-email", // POST → AuthController@verifyEmail
} as const;

// User management endpoints → UserController
export const USER_ENDPOINTS = {
  INDEX: "/users", // GET → UserController@index
  SHOW: "/users/:id", // GET → UserController@show
  STORE: "/users", // POST → UserController@store
  UPDATE: "/users/:id", // PUT → UserController@update
  DESTROY: "/users/:id", // DELETE → UserController@destroy
  PROFILE: "/users/profile", // GET → UserController@profile
  UPDATE_PROFILE: "/users/profile", // PUT → UserController@updateProfile
  UPLOAD_AVATAR: "/users/avatar", // POST → UserController@uploadAvatar
} as const;

// Teacher management endpoints → TeacherController
export const TEACHER_ENDPOINTS = {
  INDEX: "/teachers", // GET → TeacherController@index
  SHOW: "/teachers/:id", // GET → TeacherController@show
  STORE: "/teachers", // POST → TeacherController@store
  UPDATE: "/teachers/:id", // PUT → TeacherController@update
  DESTROY: "/teachers/:id", // DELETE → TeacherController@destroy
  APPROVE: "/teachers/:id/approve", // POST → TeacherController@approve
  REJECT: "/teachers/:id/reject", // POST → TeacherController@reject
  SUSPEND: "/teachers/:id/suspend", // POST → TeacherController@suspend
  APPLICATIONS: "/teachers/applications", // GET → TeacherController@applications
  AVAILABILITY: "/teachers/:id/availability", // GET → TeacherController@availability
  UPDATE_AVAILABILITY: "/teachers/:id/availability", // PUT → TeacherController@updateAvailability
  PREFERENCES: "/teachers/:id/preferences", // GET → TeacherController@preferences
  UPDATE_PREFERENCES: "/teachers/:id/preferences", // PUT → TeacherController@updatePreferences
} as const;

// Lesson management endpoints → LessonController
export const LESSON_ENDPOINTS = {
  INDEX: "/lessons", // GET → LessonController@index
  SHOW: "/lessons/:id", // GET → LessonController@show
  STORE: "/lessons", // POST → LessonController@store
  UPDATE: "/lessons/:id", // PUT → LessonController@update
  DESTROY: "/lessons/:id", // DELETE → LessonController@destroy
  CANCEL: "/lessons/:id/cancel", // POST → LessonController@cancel
  RESCHEDULE: "/lessons/:id/reschedule", // POST → LessonController@reschedule
  COMPLETE: "/lessons/:id/complete", // POST → LessonController@complete
  JOIN: "/lessons/:id/join", // GET → LessonController@join
  MATERIALS: "/lessons/:id/materials", // GET → LessonController@materials
  UPLOAD_MATERIALS: "/lessons/:id/materials", // POST → LessonController@uploadMaterials
} as const;

// Booking management endpoints → BookingController
export const BOOKING_ENDPOINTS = {
  INDEX: "/bookings", // GET → BookingController@index
  SHOW: "/bookings/:id", // GET → BookingController@show
  STORE: "/bookings", // POST → BookingController@store
  UPDATE: "/bookings/:id", // PUT → BookingController@update
  DESTROY: "/bookings/:id", // DELETE → BookingController@destroy
  CONFIRM: "/bookings/:id/confirm", // POST → BookingController@confirm
  PAYMENT: "/bookings/:id/payment", // POST → BookingController@payment
  REFUND: "/bookings/:id/refund", // POST → BookingController@refund
} as const;

// Payment management endpoints → PaymentController
export const PAYMENT_ENDPOINTS = {
  INDEX: "/payments", // GET → PaymentController@index
  SHOW: "/payments/:id", // GET → PaymentController@show
  PROCESS: "/payments/process", // POST → PaymentController@process
  WALLET: "/payments/wallet", // GET → PaymentController@wallet
  RECHARGE: "/payments/wallet/recharge", // POST → PaymentController@recharge
  TRANSACTIONS: "/payments/transactions", // GET → PaymentController@transactions
  REFUND: "/payments/:id/refund", // POST → PaymentController@refund
} as const;

// Message management endpoints → MessageController
export const MESSAGE_ENDPOINTS = {
  INDEX: "/messages", // GET → MessageController@index
  SHOW: "/messages/:id", // GET → MessageController@show
  STORE: "/messages", // POST → MessageController@store
  UPDATE: "/messages/:id", // PUT → MessageController@update
  DESTROY: "/messages/:id", // DELETE → MessageController@destroy
  CONVERSATIONS: "/messages/conversations", // GET → MessageController@conversations
  MARK_READ: "/messages/:id/read", // POST → MessageController@markRead
} as const;

// Review management endpoints → ReviewController
export const REVIEW_ENDPOINTS = {
  INDEX: "/reviews", // GET → ReviewController@index
  SHOW: "/reviews/:id", // GET → ReviewController@show
  STORE: "/reviews", // POST → ReviewController@store
  UPDATE: "/reviews/:id", // PUT → ReviewController@update
  DESTROY: "/reviews/:id", // DELETE → ReviewController@destroy
  TEACHER_REVIEWS: "/teachers/:id/reviews", // GET → ReviewController@teacherReviews
} as const;

// Admin management endpoints → AdminController
export const ADMIN_ENDPOINTS = {
  DASHBOARD: "/admin/dashboard", // GET → AdminController@dashboard
  STATS: "/admin/stats", // GET → AdminController@stats
  USERS: "/admin/users", // GET → AdminController@users
  TEACHERS: "/admin/teachers", // GET → AdminController@teachers
  LESSONS: "/admin/lessons", // GET → AdminController@lessons
  PAYMENTS: "/admin/payments", // GET → AdminController@payments
  REPORTS: "/admin/reports", // GET → AdminController@reports
  SETTINGS: "/admin/settings", // GET → AdminController@settings
  UPDATE_SETTINGS: "/admin/settings", // PUT → AdminController@updateSettings
} as const;

// Notification endpoints → NotificationController
export const NOTIFICATION_ENDPOINTS = {
  INDEX: "/notifications", // GET → NotificationController@index
  SHOW: "/notifications/:id", // GET → NotificationController@show
  MARK_READ: "/notifications/:id/read", // POST → NotificationController@markRead
  MARK_ALL_READ: "/notifications/mark-all-read", // POST → NotificationController@markAllRead
  PREFERENCES: "/notifications/preferences", // GET → NotificationController@preferences
  UPDATE_PREFERENCES: "/notifications/preferences", // PUT → NotificationController@updatePreferences
} as const;

// File upload endpoints → FileController
export const FILE_ENDPOINTS = {
  UPLOAD: "/files/upload", // POST → FileController@upload
  DOWNLOAD: "/files/:id/download", // GET → FileController@download
  DELETE: "/files/:id", // DELETE → FileController@delete
  AVATAR: "/files/avatar", // POST → FileController@uploadAvatar
  LESSON_MATERIALS: "/files/lesson-materials", // POST → FileController@uploadLessonMaterials
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
  LESSON: LESSON_ENDPOINTS,
  BOOKING: BOOKING_ENDPOINTS,
  PAYMENT: PAYMENT_ENDPOINTS,
  MESSAGE: MESSAGE_ENDPOINTS,
  REVIEW: REVIEW_ENDPOINTS,
  ADMIN: ADMIN_ENDPOINTS,
  NOTIFICATION: NOTIFICATION_ENDPOINTS,
  FILE: FILE_ENDPOINTS,
} as const;
