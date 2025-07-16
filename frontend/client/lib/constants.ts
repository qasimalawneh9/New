// Common languages supported by the platform
export const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Russian",
  "Dutch",
] as const;

// User roles
export const USER_ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
  ADMIN: "admin",
} as const;

// Meeting platforms
export const MEETING_PLATFORMS = {
  ZOOM: "zoom",
  GOOGLE_MEET: "googleMeet",
  SKYPE: "skype",
  VOOV: "voov",
} as const;

// Status types
export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

// Payment methods
export const PAYMENT_METHODS = [
  { value: "paypal", label: "PayPal", icon: "💳" },
  { value: "mastercard", label: "Mastercard", icon: "💳" },
  { value: "visa", label: "Visa", icon: "💳" },
  { value: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
] as const;

// Payout minimums
export const PAYOUT_MINIMUMS = {
  PAYPAL: 25,
  BANK_TRANSFER: 100,
} as const;

// Common time zones
export const TIMEZONES = [
  "UTC",
  "America/New_York",
  "Europe/London",
  "Asia/Tokyo",
  "Australia/Sydney",
] as const;

// Platform settings
export const PLATFORM = {
  NAME: "Talkcon",
  TAGLINE: "Language Learning Platform",
  FEE: 0.2, // 20% platform fee
  CURRENCY: "USD",
} as const;

// Routes for navigation
export const ROUTES = {
  HOME: "/",
  TEACHERS: "/teachers",
  DASHBOARD: "/dashboard",
  LOGIN: "/login",
  SIGNUP: "/signup",
  TEACHER_DASHBOARD: "/teacher-dashboard",
  ADMIN: "/admin",
} as const;
