/**
 * API Types and Interfaces
 *
 * This file contains all API-related types that should match the backend Laravel API.
 * These types are used for frontend-backend communication and ensure type safety.
 */

// Base Entity - matches Laravel Model structure
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// API Response wrapper - consistent response format from backend
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>; // Laravel validation errors
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  user_type: "student" | "teacher";
  phone?: string;
  country?: string;
  timezone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  token_type: "Bearer";
  expires_in: number;
}

// User Types
export interface User extends BaseEntity {
  name: string;
  email: string;
  email_verified_at?: string;
  user_type: "student" | "teacher" | "admin";
  avatar?: string;
  phone?: string;
  date_of_birth?: string;
  country?: string;
  timezone?: string;
  preferred_language?: string;
  is_active: boolean;
  last_active_at?: string;

  // Relationships
  student_profile?: StudentProfile;
  teacher_profile?: TeacherProfile;
}

// Student Profile
export interface StudentProfile extends BaseEntity {
  user_id: string;
  learning_languages: string[];
  native_language: string;
  language_levels: Record<string, "beginner" | "intermediate" | "advanced">;
  learning_goals?: string[];
  completed_lessons: number;
  total_hours_learned: number;
  trial_lessons_used: number;
  wallet_balance: number;
  subscription_status?: "active" | "inactive" | "cancelled";
  subscription_plan?: string;

  // Computed properties
  next_lesson?: Lesson;
  recent_teachers?: Teacher[];
  learning_streak?: number;
}

// Teacher Profile
export interface TeacherProfile extends BaseEntity {
  user_id: string;
  bio: string;
  languages: string[];
  native_language: string;
  specializations: string[];
  experience_years: number;
  education: string;
  certifications: string[];
  hourly_rate: number;
  currency: string;
  rating: number;
  review_count: number;
  total_lessons: number;
  total_students: number;
  response_time_hours: number;
  is_verified: boolean;
  verification_status: "pending" | "approved" | "rejected";
  status: "active" | "suspended" | "inactive";

  // Platform settings
  meeting_platforms: {
    zoom?: string;
    google_meet?: string;
    skype?: string;
    preferred?: "zoom" | "google_meet" | "skype";
  };

  // Financial
  bank_details?: {
    account_holder: string;
    bank_name: string;
    account_number: string;
    routing_number?: string;
    swift_code?: string;
  };
  paypal_email?: string;

  // Computed properties
  availability_slots?: AvailabilitySlot[];
  next_lessons?: Lesson[];
  pending_earnings?: number;
}

// Availability
export interface AvailabilitySlot extends BaseEntity {
  teacher_id: string;
  day_of_week: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
  timezone: string;
  is_available: boolean;
}

// Lessons
export interface Lesson extends BaseEntity {
  teacher_id: string;
  student_id: string;
  title?: string;
  description?: string;
  language: string;
  level: "beginner" | "intermediate" | "advanced";
  scheduled_at: string;
  duration_minutes: number;
  price: number;
  currency: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "no_show";
  lesson_type: "trial" | "regular" | "package";
  meeting_platform: "zoom" | "google_meet" | "skype";
  meeting_url?: string;
  meeting_id?: string;
  meeting_password?: string;

  // Content
  materials?: string[];
  homework?: string;
  teacher_notes?: string;
  student_notes?: string;
  recording_url?: string;

  // Feedback
  teacher_rating?: number;
  student_rating?: number;
  teacher_feedback?: string;
  student_feedback?: string;

  // Relationships
  teacher?: Teacher;
  student?: Student;
  booking?: Booking;
}

// Bookings
export interface Booking extends BaseEntity {
  teacher_id: string;
  student_id: string;
  language: string;
  scheduled_at: string;
  duration_minutes: number;
  lesson_type: "trial" | "regular" | "package";
  price: number;
  currency: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  payment_status: "pending" | "paid" | "refunded";
  payment_method: "wallet" | "card" | "paypal";
  payment_intent_id?: string;

  // Special requests
  special_requests?: string;
  cancellation_reason?: string;
  cancelled_by?: "student" | "teacher" | "system";
  cancelled_at?: string;

  // Relationships
  teacher?: Teacher;
  student?: Student;
  lesson?: Lesson;
  payment?: Payment;
}

// Reviews
export interface Review extends BaseEntity {
  lesson_id: string;
  teacher_id: string;
  student_id: string;
  rating: number; // 1-5
  comment?: string;
  is_anonymous: boolean;
  is_approved: boolean;

  // Relationships
  lesson?: Lesson;
  teacher?: Teacher;
  student?: Student;
}

// Messages
export interface Message extends BaseEntity {
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: "text" | "image" | "file" | "lesson_request" | "system";
  is_read: boolean;
  read_at?: string;

  // File attachments
  attachment_url?: string;
  attachment_type?: string;
  attachment_size?: number;

  // Relationships
  sender?: User;
  recipient?: User;
  conversation?: Conversation;
}

// Conversations
export interface Conversation extends BaseEntity {
  teacher_id: string;
  student_id: string;
  last_message_at?: string;
  is_archived: boolean;

  // Relationships
  teacher?: Teacher;
  student?: Student;
  messages?: Message[];
  last_message?: Message;
}

// Payments
export interface Payment extends BaseEntity {
  user_id: string;
  booking_id?: string;
  amount: number;
  currency: string;
  payment_method: "wallet" | "card" | "paypal";
  payment_status: "pending" | "completed" | "failed" | "refunded";
  payment_intent_id?: string;
  stripe_charge_id?: string;
  paypal_transaction_id?: string;
  description: string;

  // Refund information
  refund_amount?: number;
  refund_reason?: string;
  refunded_at?: string;

  // Relationships
  user?: User;
  booking?: Booking;
}

// Wallet Transactions
export interface WalletTransaction extends BaseEntity {
  user_id: string;
  transaction_type: "credit" | "debit";
  amount: number;
  currency: string;
  balance_after: number;
  description: string;
  reference_type?: "booking" | "refund" | "payout" | "topup";
  reference_id?: string;

  // Relationships
  user?: User;
}

// Teacher Applications
export interface TeacherApplication extends BaseEntity {
  user_id: string;
  application_status: "pending" | "under_review" | "approved" | "rejected";
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;

  // Application data
  bio: string;
  languages: string[];
  specializations: string[];
  experience_years: number;
  education: string;
  certifications: string[];
  why_teach: string;
  availability_description: string;

  // Documents
  resume_url?: string;
  certificate_urls: string[];
  id_document_url?: string;

  // Video introduction
  introduction_video_url?: string;

  // Relationships
  user?: User;
}

// Notifications
export interface Notification extends BaseEntity {
  user_id: string;
  title: string;
  message: string;
  notification_type:
    | "lesson_reminder"
    | "booking_confirmed"
    | "payment_received"
    | "message_received"
    | "review_received"
    | "system";
  is_read: boolean;
  read_at?: string;
  action_url?: string;

  // Additional data
  metadata?: Record<string, any>;

  // Relationships
  user?: User;
}

// Admin Types
export interface AdminStats {
  total_users: number;
  total_teachers: number;
  total_students: number;
  total_lessons: number;
  completed_lessons: number;
  total_revenue: number;
  platform_commission: number;
  active_users_today: number;
  pending_teacher_applications: number;
  pending_payouts: number;
}

export interface PayoutRequest extends BaseEntity {
  teacher_id: string;
  amount: number;
  currency: string;
  payout_method: "bank" | "paypal";
  status: "pending" | "processing" | "completed" | "failed";
  processed_at?: string;
  processed_by?: string;
  transaction_id?: string;
  notes?: string;

  // Relationships
  teacher?: Teacher;
}

// Request/Response Types for specific API endpoints
export interface CreateLessonRequest {
  teacher_id: string;
  student_id: string;
  scheduled_at: string;
  duration_minutes: number;
  language: string;
  level: "beginner" | "intermediate" | "advanced";
  lesson_type: "trial" | "regular" | "package";
  special_requests?: string;
}

export interface UpdateAvailabilityRequest {
  availability_slots: Omit<AvailabilitySlot, keyof BaseEntity | "teacher_id">[];
}

export interface SendMessageRequest {
  recipient_id: string;
  content: string;
  message_type?: "text" | "image" | "file";
}

export interface SubmitReviewRequest {
  lesson_id: string;
  rating: number;
  comment?: string;
  is_anonymous?: boolean;
}

// Filter and Search Types
export interface TeacherSearchFilters {
  languages?: string[];
  price_min?: number;
  price_max?: number;
  rating_min?: number;
  availability_day?: string;
  availability_time?: string;
  specializations?: string[];
  is_native?: boolean;
  has_trial?: boolean;
}

export interface LessonFilters {
  status?: string[];
  date_from?: string;
  date_to?: string;
  teacher_id?: string;
  student_id?: string;
  language?: string;
}

// Utility Types
export type Teacher = User & { teacher_profile: TeacherProfile };
export type Student = User & { student_profile: StudentProfile };

// For pagination
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev?: string;
    next?: string;
  };
}
