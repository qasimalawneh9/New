/**
 * Data Model Type Definitions
 *
 * These TypeScript interfaces match Laravel Eloquent models exactly.
 * They provide type safety and auto-completion for frontend development.
 */

// Base model interface - matches Laravel's base model
export interface BaseModel {
  id: string;
  created_at: string;
  updated_at: string;
}

// User model - matches Laravel User model
export interface User extends BaseModel {
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
  // Computed attributes
  display_name?: string;
  initials?: string;
}

// Student model - extends User with student-specific fields
export interface Student extends User {
  user_type: "student";
  learning_languages: string[];
  language_levels: Record<string, string>; // { "Spanish": "intermediate", ... }
  learning_goals?: string;
  completed_lessons: number;
  total_hours_learned: number;
  trial_lessons_used: number;
  wallet_balance: number;
  subscription_status?: "active" | "inactive" | "cancelled";
  subscription_plan?: string;
  // Relationships
  bookings?: Booking[];
  reviews?: Review[];
  messages?: Message[];
}

// Teacher model - extends User with teacher-specific fields
export interface Teacher extends User {
  user_type: "teacher";
  native_language: string;
  teaching_languages: string[];
  specialties: string[];
  hourly_rate: number;
  group_hourly_rate?: number;
  experience_years: number;
  bio: string;
  introduction_video_url?: string;
  education_background?: string;
  certifications?: string[];
  rating: number;
  total_reviews: number;
  completed_lessons: number;
  total_earnings: number;
  application_status:
    | "pending"
    | "under_review"
    | "approved"
    | "rejected"
    | "suspended";
  approval_date?: string;
  suspension_reason?: string;
  response_time_hours: number;
  is_online: boolean;
  last_seen_at?: string;
  // Lesson preferences
  lesson_preferences: {
    offer_group_lessons: boolean;
    individual_durations: number[];
    group_durations: number[];
    min_advance_booking_hours: number;
    max_advance_booking_days: number;
  };
  // Platform settings
  meeting_platforms: {
    zoom?: string;
    google_meet?: string;
    skype?: string;
    preferred_platform: string;
  };
  // Relationships
  bookings?: Booking[];
  reviews?: Review[];
  availability?: TeacherAvailability[];
  payouts?: Payout[];
}

// Admin model - extends User with admin-specific fields
export interface Admin extends User {
  user_type: "admin";
  role: "super_admin" | "admin" | "moderator";
  permissions: string[];
  last_login_at?: string;
}

// Lesson model - matches Laravel Lesson model
export interface Lesson extends BaseModel {
  teacher_id: string;
  student_id: string;
  booking_id?: string;
  title: string;
  description?: string;
  lesson_type: "individual" | "group" | "trial";
  duration_minutes: number;
  scheduled_at: string;
  started_at?: string;
  ended_at?: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "no_show";
  cancellation_reason?: string;
  meeting_url?: string;
  recording_url?: string;
  notes?: string;
  materials_url?: string[];
  homework_assigned?: string;
  homework_completed?: boolean;
  teacher_feedback?: string;
  student_feedback?: string;
  // Relationships
  teacher?: Teacher;
  student?: Student;
  booking?: Booking;
  review?: Review;
}

// Booking model - matches Laravel Booking model
export interface Booking extends BaseModel {
  teacher_id: string;
  student_id: string;
  lesson_type: "individual" | "group" | "trial";
  duration_minutes: number;
  quantity: number; // for package bookings
  price_per_lesson: number;
  total_price: number;
  tax_amount: number;
  commission_amount: number;
  teacher_earnings: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "refunded";
  payment_status: "pending" | "completed" | "failed" | "refunded";
  payment_method?: string;
  payment_intent_id?: string;
  scheduled_at: string;
  notes?: string;
  cancellation_reason?: string;
  refund_reason?: string;
  refund_amount?: number;
  // Relationships
  teacher?: Teacher;
  student?: Student;
  lessons?: Lesson[];
  payment?: Payment;
}

// Payment model - matches Laravel Payment model
export interface Payment extends BaseModel {
  user_id: string;
  booking_id?: string;
  amount: number;
  currency: string;
  payment_method: "wallet" | "paypal" | "stripe" | "bank_transfer";
  payment_intent_id?: string;
  transaction_id?: string;
  status:
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "refunded"
    | "disputed";
  failure_reason?: string;
  refund_amount?: number;
  refund_reason?: string;
  metadata?: Record<string, any>;
  processed_at?: string;
  // Relationships
  user?: User;
  booking?: Booking;
}

// Review model - matches Laravel Review model
export interface Review extends BaseModel {
  teacher_id: string;
  student_id: string;
  lesson_id?: string;
  rating: number; // 1-5
  title?: string;
  content: string;
  is_anonymous: boolean;
  is_verified: boolean;
  is_featured: boolean;
  helpful_count: number;
  reply_content?: string;
  reply_at?: string;
  // Relationships
  teacher?: Teacher;
  student?: Student;
  lesson?: Lesson;
}

// Message model - matches Laravel Message model
export interface Message extends BaseModel {
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: "text" | "image" | "file" | "system";
  file_url?: string;
  file_name?: string;
  file_size?: number;
  is_read: boolean;
  read_at?: string;
  is_deleted: boolean;
  reply_to_id?: string;
  // Relationships
  sender?: User;
  receiver?: User;
  conversation?: Conversation;
  reply_to?: Message;
}

// Conversation model - matches Laravel Conversation model
export interface Conversation extends BaseModel {
  participant_1_id: string;
  participant_2_id: string;
  last_message_id?: string;
  last_message_at?: string;
  is_archived: boolean;
  // Relationships
  participant_1?: User;
  participant_2?: User;
  last_message?: Message;
  messages?: Message[];
}

// Notification model - matches Laravel Notification model
export interface Notification extends BaseModel {
  user_id: string;
  type: string;
  title: string;
  content: string;
  data?: Record<string, any>;
  read_at?: string;
  action_url?: string;
  action_text?: string;
  priority: "low" | "normal" | "high" | "urgent";
  // Relationships
  user?: User;
}

// Teacher Availability model - matches Laravel TeacherAvailability model
export interface TeacherAvailability extends BaseModel {
  teacher_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  is_available: boolean;
  timezone: string;
  // Relationships
  teacher?: Teacher;
}

// Payout model - matches Laravel Payout model
export interface Payout extends BaseModel {
  teacher_id: string;
  amount: number;
  currency: string;
  payout_method: "paypal" | "bank_transfer";
  payout_details: Record<string, any>;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  requested_at: string;
  processed_at?: string;
  failure_reason?: string;
  transaction_id?: string;
  // Relationships
  teacher?: Teacher;
}

// File Upload model - matches Laravel FileUpload model
export interface FileUpload extends BaseModel {
  user_id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  file_type: "avatar" | "lesson_material" | "certificate" | "document";
  is_public: boolean;
  download_count: number;
  // Relationships
  user?: User;
}

// System Settings model - matches Laravel SystemSettings model
export interface SystemSettings extends BaseModel {
  key: string;
  value: string;
  type: "string" | "number" | "boolean" | "json";
  category: string;
  description?: string;
  is_public: boolean;
}

// Analytics model - for dashboard analytics
export interface Analytics {
  users: {
    total: number;
    new_this_month: number;
    active_users: number;
    retention_rate: number;
  };
  teachers: {
    total: number;
    approved: number;
    pending: number;
    active_this_month: number;
  };
  lessons: {
    total: number;
    this_month: number;
    completed: number;
    average_rating: number;
  };
  revenue: {
    total: number;
    this_month: number;
    last_month: number;
    growth_rate: number;
  };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    completion_rate: number;
  };
}

// Form data interfaces for API requests
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  user_type: "student" | "teacher";
  terms_accepted: boolean;
  marketing_consent?: boolean;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  date_of_birth?: string;
  country?: string;
  timezone?: string;
  preferred_language?: string;
}

export interface TeacherApplicationData {
  native_language: string;
  teaching_languages: string[];
  specialties: string[];
  hourly_rate: number;
  experience_years: number;
  bio: string;
  education_background?: string;
  certifications?: string[];
  introduction_video_url?: string;
  availability: {
    day_of_week: number;
    start_time: string;
    end_time: string;
    timezone: string;
  }[];
}

export interface CreateBookingData {
  teacher_id: string;
  lesson_type: "individual" | "group" | "trial";
  duration_minutes: number;
  quantity?: number;
  scheduled_at: string;
  notes?: string;
}

export interface CreateReviewData {
  teacher_id: string;
  lesson_id?: string;
  rating: number;
  title?: string;
  content: string;
  is_anonymous?: boolean;
}

export interface SendMessageData {
  receiver_id: string;
  content: string;
  message_type?: "text" | "image" | "file";
  file?: File;
  reply_to_id?: string;
}

// API Response interfaces
export interface PaginatedResponse<T> {
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

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

export interface ValidationErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}

// Filter interfaces for API queries
export interface UserFilters {
  search?: string;
  user_type?: string;
  country?: string;
  is_active?: boolean;
  created_from?: string;
  created_to?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface TeacherFilters extends UserFilters {
  languages?: string[];
  specialties?: string[];
  rating_min?: number;
  price_min?: number;
  price_max?: number;
  experience_min?: number;
  application_status?: string;
  is_online?: boolean;
}

export interface LessonFilters {
  teacher_id?: string;
  student_id?: string;
  lesson_type?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}

export interface BookingFilters {
  teacher_id?: string;
  student_id?: string;
  status?: string;
  payment_status?: string;
  date_from?: string;
  date_to?: string;
  lesson_type?: string;
  page?: number;
  per_page?: number;
}

// Component prop interfaces
export interface ComponentBaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface FormComponentProps extends ComponentBaseProps {
  onSubmit?: (data: any) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: any;
  validationErrors?: Record<string, string[]>;
}

export interface ModalComponentProps extends ComponentBaseProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export interface TableComponentProps<T> extends ComponentBaseProps {
  data: T[];
  columns: Array<{
    key: keyof T;
    title: string;
    render?: (value: any, record: T) => React.ReactNode;
    sortable?: boolean;
  }>;
  loading?: boolean;
  pagination?: {
    current_page: number;
    total: number;
    per_page: number;
    onPageChange: (page: number) => void;
  };
  onRowClick?: (record: T) => void;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

// Export all types as a namespace for easy importing
export * as Models from "./models";
