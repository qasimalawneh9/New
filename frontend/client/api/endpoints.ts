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
  REFRESH_TOKEN: "/auth/refresh", // POST → refreshToken
  FORGOT_PASSWORD: "/auth/forgot-password", // POST → forgotPassword
  RESET_PASSWORD: "/auth/reset-password", // POST → resetPassword
  VERIFY_EMAIL: "/auth/verify-email", // POST → verifyEmail
  RESEND_VERIFICATION: "/auth/resend-verification", // POST → resendVerification
  ENABLE_2FA: "/auth/2fa/enable", // POST → enable2FA
  DISABLE_2FA: "/auth/2fa/disable", // POST → disable2FA
  VERIFY_2FA: "/auth/2fa/verify", // POST → verify2FA
} as const;

// User management endpoints → user.controller.ts
export const USER_ENDPOINTS = {
  PROFILE: "/users/me", // GET → getCurrentUser
  UPDATE_PROFILE: "/users/me", // PUT → updateProfile
  UPLOAD_AVATAR: "/users/me/avatar", // POST → uploadAvatar
  SWITCH_ROLE: "/users/me/switch-role", // POST → switchRole
  DELETE_ACCOUNT: "/users/me", // DELETE → deleteAccount
  CHANGE_PASSWORD: "/users/me/password", // PUT → changePassword
  GET_SETTINGS: "/users/me/settings", // GET → getSettings
  UPDATE_SETTINGS: "/users/me/settings", // PUT → updateSettings
} as const;

// Teacher management endpoints → teacher.controller.ts
export const TEACHER_ENDPOINTS = {
  INDEX: "/teachers", // GET → getAllTeachers
  SHOW: "/teachers/:id", // GET → getTeacher
  SEARCH: "/teachers/search", // GET → searchTeachers
  AVAILABILITY: "/teachers/:id/availability", // GET → getAvailability
  UPDATE_AVAILABILITY: "/teachers/me/availability", // PUT → updateAvailability
  PROFILE: "/teachers/me/profile", // GET → getMyProfile
  UPDATE_PROFILE: "/teachers/me/profile", // PUT → updateProfile
  UPLOAD_VIDEO: "/teachers/me/video", // POST → uploadIntroVideo
  EARNINGS: "/teachers/me/earnings", // GET → getEarnings
  REVIEWS: "/teachers/:id/reviews", // GET → getReviews
  STUDENTS: "/teachers/me/students", // GET → getMyStudents
  CALENDAR: "/teachers/me/calendar", // GET → getCalendar
  STATS: "/teachers/me/stats", // GET → getStats
} as const;

// Student management endpoints → student.controller.ts
export const STUDENT_ENDPOINTS = {
  PROFILE: "/students/me/profile", // GET → getMyProfile
  UPDATE_PROFILE: "/students/me/profile", // PUT → updateProfile
  TEACHERS: "/students/me/teachers", // GET → getMyTeachers
  PROGRESS: "/students/me/progress", // GET → getProgress
  LEARNING_GOALS: "/students/me/goals", // GET → getLearningGoals
  UPDATE_GOALS: "/students/me/goals", // PUT → updateLearningGoals
  COMPLETED_LESSONS: "/students/me/lessons", // GET → getCompletedLessons
} as const;

// Booking management endpoints → booking.controller.ts
export const BOOKING_ENDPOINTS = {
  INDEX: "/bookings", // GET → getAllBookings (admin)
  MY_BOOKINGS: "/bookings/me", // GET → getMyBookings
  CREATE: "/bookings", // POST → createBooking
  SHOW: "/bookings/:id", // GET → getBooking
  UPDATE: "/bookings/:id", // PUT → updateBooking
  CANCEL: "/bookings/:id/cancel", // POST → cancelBooking
  RESCHEDULE: "/bookings/:id/reschedule", // POST → rescheduleBooking
  CONFIRM: "/bookings/:id/confirm", // POST → confirmBooking
  COMPLETE: "/bookings/:id/complete", // POST → completeBooking
  MARK_ATTENDANCE: "/bookings/:id/attendance", // POST → markAttendance
  GET_POLICIES: "/bookings/policies", // GET → getBookingPolicies
} as const;

// Lesson room endpoints → lesson.controller.ts
export const LESSON_ENDPOINTS = {
  JOIN: "/lessons/:id/join", // GET → joinLesson
  START: "/lessons/:id/start", // POST → startLesson
  END: "/lessons/:id/end", // POST → endLesson
  GET_MEETING_INFO: "/lessons/:id/meeting", // GET → getMeetingInfo
  UPDATE_MEETING: "/lessons/:id/meeting", // PUT → updateMeetingInfo
  UPLOAD_MATERIALS: "/lessons/:id/materials", // POST → uploadMaterials
  GET_MATERIALS: "/lessons/:id/materials", // GET → getMaterials
  ADD_NOTES: "/lessons/:id/notes", // POST → addNotes
  GET_RECORDING: "/lessons/:id/recording", // GET → getRecording
} as const;

// Review system endpoints → review.controller.ts
export const REVIEW_ENDPOINTS = {
  INDEX: "/reviews", // GET → getAllReviews (admin)
  CREATE: "/reviews", // POST → createReview
  SHOW: "/reviews/:id", // GET → getReview
  UPDATE: "/reviews/:id", // PUT → updateReview
  DELETE: "/reviews/:id", // DELETE → deleteReview
  TEACHER_REVIEWS: "/reviews/teacher/:teacherId", // GET → getTeacherReviews
  MY_REVIEWS: "/reviews/me", // GET → getMyReviews
  REPLY: "/reviews/:id/reply", // POST → replyToReview
  LIKE: "/reviews/:id/like", // POST → likeReview
  REPORT: "/reviews/:id/report", // POST → reportReview
  STATS: "/reviews/stats/:teacherId", // GET → getReviewStats
} as const;

// Payment and wallet endpoints → payment.controller.ts
export const PAYMENT_ENDPOINTS = {
  METHODS: "/payments/methods", // GET → getPaymentMethods
  ADD_METHOD: "/payments/methods", // POST → addPaymentMethod
  UPDATE_METHOD: "/payments/methods/:id", // PUT → updatePaymentMethod
  DELETE_METHOD: "/payments/methods/:id", // DELETE → deletePaymentMethod
  SET_DEFAULT: "/payments/methods/:id/default", // POST → setDefaultMethod
  PROCESS: "/payments/process", // POST → processPayment
  HISTORY: "/payments/history", // GET → getPaymentHistory
  REFUND: "/payments/:id/refund", // POST → refundPayment
} as const;

// Wallet management endpoints → wallet.controller.ts
export const WALLET_ENDPOINTS = {
  MY_WALLET: "/wallets/me", // GET → getMyWallet
  TRANSACTIONS: "/wallets/me/transactions", // GET → getTransactions
  ADD_FUNDS: "/wallets/me/add-funds", // POST → addFunds
  WITHDRAW: "/wallets/me/withdraw", // POST → withdrawFunds
  TRANSFER: "/wallets/me/transfer", // POST → transferFunds
  PAYOUT_METHODS: "/wallets/me/payout-methods", // GET → getPayoutMethods
  ADD_PAYOUT_METHOD: "/wallets/me/payout-methods", // POST → addPayoutMethod
  REQUEST_PAYOUT: "/wallets/me/payout", // POST → requestPayout
  PAYOUT_HISTORY: "/wallets/me/payouts", // GET → getPayoutHistory
} as const;

// Messaging endpoints → message.controller.ts
export const MESSAGE_ENDPOINTS = {
  CONVERSATIONS: "/messages/conversations", // GET → getConversations
  CONVERSATION: "/messages/conversations/:id", // GET → getConversation
  SEND: "/messages", // POST → sendMessage
  MARK_READ: "/messages/:id/read", // POST → markAsRead
  DELETE: "/messages/:id", // DELETE → deleteMessage
  SEARCH: "/messages/search", // GET → searchMessages
  BLOCK_USER: "/messages/block", // POST → blockUser
  UNBLOCK_USER: "/messages/unblock", // POST → unblockUser
  REPORT: "/messages/:id/report", // POST → reportMessage
} as const;

// Notification endpoints → notification.controller.ts
export const NOTIFICATION_ENDPOINTS = {
  INDEX: "/notifications", // GET → getNotifications
  MARK_READ: "/notifications/:id/read", // POST → markAsRead
  MARK_ALL_READ: "/notifications/read-all", // POST → markAllAsRead
  DELETE: "/notifications/:id", // DELETE → deleteNotification
  SETTINGS: "/notifications/settings", // GET → getNotificationSettings
  UPDATE_SETTINGS: "/notifications/settings", // PUT → updateNotificationSettings
  TEST: "/notifications/test", // POST → sendTestNotification
} as const;

// Support system endpoints → support.controller.ts
export const SUPPORT_ENDPOINTS = {
  TICKETS: "/support/tickets", // GET → getTickets
  CREATE_TICKET: "/support/tickets", // POST → createTicket
  SHOW_TICKET: "/support/tickets/:id", // GET → getTicket
  UPDATE_TICKET: "/support/tickets/:id", // PUT → updateTicket
  CLOSE_TICKET: "/support/tickets/:id/close", // POST → closeTicket
  ADD_MESSAGE: "/support/tickets/:id/messages", // POST → addMessage
  UPLOAD_ATTACHMENT: "/support/tickets/:id/attachments", // POST → uploadAttachment
  FAQ: "/support/faq", // GET → getFAQ
  CATEGORIES: "/support/categories", // GET → getCategories
} as const;

// Admin panel endpoints → admin.controller.ts
export const ADMIN_ENDPOINTS = {
  DASHBOARD: "/admin/dashboard", // GET → getDashboard
  STATS: "/admin/stats", // GET → getStats
  USERS: "/admin/users", // GET → getUsers
  USER_DETAILS: "/admin/users/:id", // GET → getUserDetails
  SUSPEND_USER: "/admin/users/:id/suspend", // POST → suspendUser
  ACTIVATE_USER: "/admin/users/:id/activate", // POST → activateUser
  DELETE_USER: "/admin/users/:id", // DELETE → deleteUser
  TEACHERS: "/admin/teachers", // GET → getTeachers
  APPROVE_TEACHER: "/admin/teachers/:id/approve", // POST → approveTeacher
  REJECT_TEACHER: "/admin/teachers/:id/reject", // POST → rejectTeacher
  BOOKINGS: "/admin/bookings", // GET → getBookings
  PAYMENTS: "/admin/payments", // GET → getPayments
  REVIEWS: "/admin/reviews", // GET → getReviews
  MODERATE_REVIEW: "/admin/reviews/:id/moderate", // POST → moderateReview
  SUPPORT_TICKETS: "/admin/support", // GET → getSupportTickets
  ASSIGN_TICKET: "/admin/support/:id/assign", // POST → assignTicket
  SYSTEM_SETTINGS: "/admin/settings", // GET → getSystemSettings
  UPDATE_SETTINGS: "/admin/settings", // PUT → updateSystemSettings
  LOGS: "/admin/logs", // GET → getSystemLogs
  ANALYTICS: "/admin/analytics", // GET → getAnalytics
  REPORTS: "/admin/reports", // GET → getReports
  EXPORT_DATA: "/admin/export", // POST → exportData
} as const;

// Calendar and scheduling endpoints → calendar.controller.ts
export const CALENDAR_ENDPOINTS = {
  MY_CALENDAR: "/calendar/me", // GET → getMyCalendar
  AVAILABILITY: "/calendar/availability/:teacherId", // GET → getTeacherAvailability
  TIME_SLOTS: "/calendar/slots/:teacherId", // GET → getAvailableSlots
  UPDATE_AVAILABILITY: "/calendar/me/availability", // PUT → updateAvailability
  BLOCK_TIME: "/calendar/me/block", // POST → blockTimeSlot
  UNBLOCK_TIME: "/calendar/me/unblock/:slotId", // DELETE → unblockTimeSlot
  SYNC_EXTERNAL: "/calendar/sync", // POST → syncExternalCalendar
  EVENTS: "/calendar/events", // GET → getCalendarEvents
  CREATE_EVENT: "/calendar/events", // POST → createEvent
  UPDATE_EVENT: "/calendar/events/:id", // PUT → updateEvent
  DELETE_EVENT: "/calendar/events/:id", // DELETE → deleteEvent
} as const;

// File upload endpoints → upload.controller.ts
export const UPLOAD_ENDPOINTS = {
  AVATAR: "/uploads/avatar", // POST → uploadAvatar
  DOCUMENTS: "/uploads/documents", // POST → uploadDocuments
  LESSON_MATERIALS: "/uploads/materials", // POST → uploadMaterials
  INTRO_VIDEO: "/uploads/video", // POST → uploadIntroVideo
  CERTIFICATES: "/uploads/certificates", // POST → uploadCertificates
  ATTACHMENTS: "/uploads/attachments", // POST → uploadAttachments
} as const;

// Search endpoints → search.controller.ts
export const SEARCH_ENDPOINTS = {
  TEACHERS: "/search/teachers", // GET → searchTeachers
  STUDENTS: "/search/students", // GET → searchStudents (admin)
  LESSONS: "/search/lessons", // GET → searchLessons
  GLOBAL: "/search", // GET → globalSearch
  SUGGESTIONS: "/search/suggestions", // GET → getSearchSuggestions
  FILTERS: "/search/filters", // GET → getSearchFilters
} as const;

// Analytics endpoints → analytics.controller.ts
export const ANALYTICS_ENDPOINTS = {
  TEACHER_STATS: "/analytics/teacher/:id", // GET → getTeacherAnalytics
  STUDENT_STATS: "/analytics/student/:id", // GET → getStudentAnalytics
  PLATFORM_STATS: "/analytics/platform", // GET → getPlatformAnalytics
  REVENUE: "/analytics/revenue", // GET → getRevenueAnalytics
  USER_GROWTH: "/analytics/users", // GET → getUserGrowthAnalytics
  LESSON_STATS: "/analytics/lessons", // GET → getLessonAnalytics
  ENGAGEMENT: "/analytics/engagement", // GET → getEngagementAnalytics
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
  STUDENT: STUDENT_ENDPOINTS,
  BOOKING: BOOKING_ENDPOINTS,
  LESSON: LESSON_ENDPOINTS,
  REVIEW: REVIEW_ENDPOINTS,
  PAYMENT: PAYMENT_ENDPOINTS,
  WALLET: WALLET_ENDPOINTS,
  MESSAGE: MESSAGE_ENDPOINTS,
  NOTIFICATION: NOTIFICATION_ENDPOINTS,
  SUPPORT: SUPPORT_ENDPOINTS,
  ADMIN: ADMIN_ENDPOINTS,
  CALENDAR: CALENDAR_ENDPOINTS,
  UPLOAD: UPLOAD_ENDPOINTS,
  SEARCH: SEARCH_ENDPOINTS,
  ANALYTICS: ANALYTICS_ENDPOINTS,
} as const;
