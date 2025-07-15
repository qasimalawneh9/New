/**
 * Application Constants
 *
 * This file contains all constant values used throughout the application.
 * It's organized by category and provides type safety for configuration values.
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Authentication
export const AUTH_CONFIG = {
  TOKEN_KEY: "auth_token",
  REFRESH_TOKEN_KEY: "refresh_token",
  USER_KEY: "user_data",
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
} as const;

// Application Routes
export const ROUTES = {
  // Public routes
  HOME: "/",
  ABOUT: "/about",
  HOW_IT_WORKS: "/how-it-works",
  PRICING: "/pricing",
  TEACHERS: "/teachers",
  LANGUAGES: "/languages",
  CONTACT: "/contact",
  HELP: "/help",

  // Authentication
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",

  // Student routes
  STUDENT_DASHBOARD: "/student",
  STUDENT_LESSONS: "/student/lessons",
  STUDENT_TEACHERS: "/student/teachers",
  STUDENT_MESSAGES: "/student/messages",
  STUDENT_WALLET: "/student/wallet",
  STUDENT_SETTINGS: "/student/settings",

  // Teacher routes
  TEACHER_DASHBOARD: "/teacher",
  TEACHER_LESSONS: "/teacher/lessons",
  TEACHER_STUDENTS: "/teacher/students",
  TEACHER_EARNINGS: "/teacher/earnings",
  TEACHER_AVAILABILITY: "/teacher/availability",
  TEACHER_MESSAGES: "/teacher/messages",
  TEACHER_SETTINGS: "/teacher/settings",
  TEACHER_APPLICATION: "/become-teacher",
  TEACHER_APPLICATION_STATUS: "/teacher-application-status",

  // Admin routes
  ADMIN_DASHBOARD: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_TEACHERS: "/admin/teachers",
  ADMIN_LESSONS: "/admin/lessons",
  ADMIN_APPLICATIONS: "/admin/applications",
  ADMIN_PAYOUTS: "/admin/payouts",
  ADMIN_ANALYTICS: "/admin/analytics",
  ADMIN_SETTINGS: "/admin/settings",

  // Lesson routes
  LESSON_ROOM: "/lesson/:id",
  BOOKING_CONFIRMATION: "/booking/confirmation/:id",

  // Legal
  TERMS: "/terms",
  PRIVACY: "/privacy",
  LEGAL: "/legal",

  // Error pages
  NOT_FOUND: "/404",
  ERROR: "/error",
} as const;

// User Roles and Permissions
export const USER_ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
  ADMIN: "admin",
} as const;

export const PERMISSIONS = {
  // Student permissions
  BOOK_LESSONS: "book_lessons",
  VIEW_TEACHERS: "view_teachers",
  SEND_MESSAGES: "send_messages",
  SUBMIT_REVIEWS: "submit_reviews",
  MANAGE_WALLET: "manage_wallet",

  // Teacher permissions
  MANAGE_AVAILABILITY: "manage_availability",
  CONDUCT_LESSONS: "conduct_lessons",
  VIEW_STUDENTS: "view_students",
  MANAGE_EARNINGS: "manage_earnings",
  REQUEST_PAYOUTS: "request_payouts",

  // Admin permissions
  MANAGE_USERS: "manage_users",
  MANAGE_TEACHERS: "manage_teachers",
  APPROVE_APPLICATIONS: "approve_applications",
  PROCESS_PAYOUTS: "process_payouts",
  VIEW_ANALYTICS: "view_analytics",
  MANAGE_PLATFORM: "manage_platform",
} as const;

// Languages and Learning Levels
export const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese (Mandarin)",
  "Chinese (Cantonese)",
  "Japanese",
  "Korean",
  "Arabic",
  "Russian",
  "Hindi",
  "Dutch",
  "Swedish",
  "Norwegian",
  "Finnish",
  "Polish",
  "Czech",
  "Turkish",
  "Greek",
  "Hebrew",
  "Thai",
  "Vietnamese",
  "Indonesian",
] as const;

export const LANGUAGE_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

// Lesson Configuration
export const LESSON_CONFIG = {
  DURATIONS: [30, 45, 60, 90, 120], // minutes
  TYPES: {
    TRIAL: "trial",
    REGULAR: "regular",
    PACKAGE: "package",
  },
  STATUSES: {
    SCHEDULED: "scheduled",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    NO_SHOW: "no_show",
  },
  PLATFORMS: {
    ZOOM: "zoom",
    GOOGLE_MEET: "google_meet",
    SKYPE: "skype",
  },
  TRIAL_DURATION: 30, // minutes
  MAX_ADVANCE_BOOKING_DAYS: 30,
  MIN_ADVANCE_BOOKING_HOURS: 2,
  CANCELLATION_DEADLINE_HOURS: 24,
} as const;

// Payment Configuration
export const PAYMENT_CONFIG = {
  CURRENCIES: {
    USD: "USD",
    EUR: "EUR",
    GBP: "GBP",
    CAD: "CAD",
    AUD: "AUD",
  },
  METHODS: {
    WALLET: "wallet",
    CARD: "card",
    PAYPAL: "paypal",
  },
  MINIMUM_TOPUP: 10,
  MAXIMUM_TOPUP: 1000,
  PLATFORM_FEE_PERCENTAGE: 15, // 15%
  TAX_RATE: 0, // Will be set based on jurisdiction
  PAYOUT_METHODS: {
    BANK: "bank",
    PAYPAL: "paypal",
  },
  MINIMUM_PAYOUT: {
    BANK: 50,
    PAYPAL: 10,
  },
} as const;

// Time and Date Configuration
export const TIME_CONFIG = {
  TIMEZONES: [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Toronto",
    "America/Vancouver",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Europe/Rome",
    "Europe/Madrid",
    "Europe/Amsterdam",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Asia/Seoul",
    "Asia/Singapore",
    "Asia/Kolkata",
    "Asia/Dubai",
    "Australia/Sydney",
    "Australia/Melbourne",
  ],
  WORKING_HOURS: {
    START: "06:00",
    END: "23:00",
  },
  BOOKING_SLOTS: 30, // minutes
  DATE_FORMAT: "YYYY-MM-DD",
  TIME_FORMAT: "HH:mm",
  DATETIME_FORMAT: "YYYY-MM-DD HH:mm:ss",
} as const;

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/webm", "video/quicktime"],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  AVATAR_MAX_SIZE: 2 * 1024 * 1024, // 2MB
} as const;

// UI Configuration
export const UI_CONFIG = {
  BREAKPOINTS: {
    SM: "640px",
    MD: "768px",
    LG: "1024px",
    XL: "1280px",
    "2XL": "1536px",
  },
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  MODAL_SIZES: {
    SM: "max-w-md",
    MD: "max-w-lg",
    LG: "max-w-2xl",
    XL: "max-w-4xl",
    FULL: "max-w-full",
  },
} as const;

// Validation Rules
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SYMBOLS: false,
  },
  EMAIL: {
    MAX_LENGTH: 255,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  PHONE: {
    PATTERN: /^\+?[\d\s\-\(\)]+$/,
  },
  BIO: {
    MIN_LENGTH: 50,
    MAX_LENGTH: 1000,
  },
  REVIEW: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500,
  },
  MESSAGE: {
    MAX_LENGTH: 1000,
  },
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_TRIAL_LESSONS: true,
  ENABLE_GROUP_LESSONS: false,
  ENABLE_VIDEO_CALLS: true,
  ENABLE_CHAT: true,
  ENABLE_WALLET: true,
  ENABLE_PAYPAL: true,
  ENABLE_BANK_TRANSFERS: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_EMAIL_NOTIFICATIONS: true,
  ENABLE_SMS_NOTIFICATIONS: false,
  ENABLE_LESSON_RECORDINGS: true,
  ENABLE_HOMEWORK: true,
  ENABLE_CERTIFICATES: false,
  ENABLE_REFERRALS: false,
  ENABLE_LOYALTY_PROGRAM: false,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "Access denied.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
  UPLOAD_ERROR: "File upload failed. Please try again.",
  PAYMENT_ERROR: "Payment processing failed. Please try again.",
  BOOKING_ERROR: "Booking failed. Please try again.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Welcome back!",
  LOGOUT_SUCCESS: "You have been logged out successfully.",
  SIGNUP_SUCCESS: "Account created successfully! Please verify your email.",
  PROFILE_UPDATED: "Profile updated successfully.",
  PASSWORD_UPDATED: "Password updated successfully.",
  BOOKING_CREATED: "Lesson booked successfully!",
  BOOKING_CANCELLED: "Booking cancelled successfully.",
  REVIEW_SUBMITTED: "Review submitted successfully.",
  MESSAGE_SENT: "Message sent successfully.",
  PAYMENT_SUCCESS: "Payment processed successfully.",
  UPLOAD_SUCCESS: "File uploaded successfully.",
  APPLICATION_SUBMITTED: "Application submitted successfully.",
} as const;

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: "https://facebook.com/talkcon",
  TWITTER: "https://twitter.com/talkcon",
  INSTAGRAM: "https://instagram.com/talkcon",
  LINKEDIN: "https://linkedin.com/company/talkcon",
  YOUTUBE: "https://youtube.com/talkcon",
} as const;

// Contact Information
export const CONTACT_INFO = {
  EMAIL: "support@talkcon.com",
  PHONE: "+1-800-TALKCON",
  ADDRESS: "123 Language Learning St, Education City, EC 12345",
  BUSINESS_HOURS: "Monday to Friday, 9 AM - 6 PM EST",
} as const;

// SEO Configuration
export const SEO_CONFIG = {
  SITE_NAME: "Talkcon",
  SITE_DESCRIPTION:
    "Learn languages online with native speakers. Connect with qualified teachers for personalized language lessons.",
  SITE_URL: process.env.REACT_APP_SITE_URL || "https://talkcon.com",
  DEFAULT_IMAGE: "/images/og-image.jpg",
  TWITTER_HANDLE: "@talkcon",
} as const;

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  GOOGLE_ANALYTICS_ID: process.env.REACT_APP_GA_ID,
  MIXPANEL_TOKEN: process.env.REACT_APP_MIXPANEL_TOKEN,
  HOTJAR_ID: process.env.REACT_APP_HOTJAR_ID,
  ENABLE_TRACKING: process.env.NODE_ENV === "production",
} as const;

// Third-party Service Configuration
export const THIRD_PARTY_CONFIG = {
  STRIPE_PUBLIC_KEY: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
  PAYPAL_CLIENT_ID: process.env.REACT_APP_PAYPAL_CLIENT_ID,
  ZOOM_API_KEY: process.env.REACT_APP_ZOOM_API_KEY,
  GOOGLE_MEET_API_KEY: process.env.REACT_APP_GOOGLE_MEET_API_KEY,
  PUSHER_APP_KEY: process.env.REACT_APP_PUSHER_APP_KEY,
  PUSHER_CLUSTER: process.env.REACT_APP_PUSHER_CLUSTER || "us2",
} as const;

// Export all constants as a single object for easy importing
export default {
  API_CONFIG,
  AUTH_CONFIG,
  ROUTES,
  USER_ROLES,
  PERMISSIONS,
  LANGUAGES,
  LANGUAGE_LEVELS,
  CEFR_LEVELS,
  LESSON_CONFIG,
  PAYMENT_CONFIG,
  TIME_CONFIG,
  UPLOAD_CONFIG,
  UI_CONFIG,
  VALIDATION,
  FEATURES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  SOCIAL_LINKS,
  CONTACT_INFO,
  SEO_CONFIG,
  ANALYTICS_CONFIG,
  THIRD_PARTY_CONFIG,
} as const;
