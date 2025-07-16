// Data Types for Laravel API Integration

// Base Entity
export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

// User Types
export interface User extends BaseEntity {
  name: string;
  email: string;
  email_verified_at: string | null;
  type: "student" | "teacher" | "admin";
  avatar: string | null;
  status: "active" | "suspended";
}

export interface StudentProfile extends BaseEntity {
  user_id: number;
  learning_languages: string[];
  native_language: string;
  levels: Record<string, string> | null;
  completed_lessons: number;
  hours_learned: number;
  wallet_balance: number;
  user?: User; // Relationship
}

export interface TeacherProfile extends BaseEntity {
  user_id: number;
  languages: string[];
  native_language: string;
  rating: number;
  review_count: number;
  price: number;
  currency: string;
  availability: string[] | null;
  specialties: string[] | null;
  experience: number;
  description: string | null;
  video_url: string | null;
  is_online: boolean;
  response_time: string;
  completed_lessons: number;
  badges: string[] | null;
  country: string | null;
  timezone: string;
  status: "pending" | "approved" | "rejected";
  earnings: number;
  user?: User; // Relationship
  meeting_platforms?: TeacherMeetingPlatform; // Relationship
}

export interface TeacherMeetingPlatform extends BaseEntity {
  teacher_id: number;
  zoom_url: string | null;
  google_meet_url: string | null;
  skype_url: string | null;
  voov_url: string | null;
  preferred_platform: "zoom" | "google_meet" | "skype" | "voov" | null;
}

export interface TeacherApplication extends BaseEntity {
  user_id: number;
  application_data: any;
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  processed_by: number | null;
  processed_at: string | null;
  user?: User; // Relationship
  processor?: User; // Relationship
}

// Lesson Types
export interface Lesson extends BaseEntity {
  teacher_id: number;
  student_id: number;
  language: string;
  date: string;
  time: string;
  duration: number; // in minutes
  price: number;
  status: "scheduled" | "completed" | "cancelled";
  type: "trial" | "regular" | "package";
  notes: string | null;
  rating: number | null;
  review: string | null;
  teacher?: TeacherProfile; // Relationship
  student?: StudentProfile; // Relationship
}

export interface Booking extends BaseEntity {
  teacher_id: number;
  student_id: number;
  date: string;
  time: string;
  duration: number;
  language: string;
  type: "trial" | "regular";
  price: number;
  status: "pending" | "confirmed" | "cancelled";
  notes: string | null;
  teacher?: TeacherProfile; // Relationship
  student?: StudentProfile; // Relationship
}

// Payment Types
export interface WalletTransaction extends BaseEntity {
  user_id: number;
  type: "recharge" | "payment" | "refund";
  amount: number;
  method: "paypal" | "mastercard" | "visa" | "bank_transfer" | "wallet";
  status: "pending" | "completed" | "failed";
  description: string;
  lesson_id: number | null;
  teacher_id: number | null;
  payment_details: any | null;
  user?: User; // Relationship
  lesson?: Lesson; // Relationship
  teacher?: TeacherProfile; // Relationship
}

export interface PayoutRequest extends BaseEntity {
  teacher_id: number;
  amount: number;
  method: "paypal" | "bank_transfer";
  status: "pending" | "approved" | "rejected" | "completed";
  payment_details: any;
  notes: string | null;
  admin_notes: string | null;
  processed_by: number | null;
  processed_at: string | null;
  teacher?: TeacherProfile; // Relationship
  processor?: User; // Relationship
}

// Review Types
export interface Review extends BaseEntity {
  student_id: number;
  teacher_id: number;
  lesson_id: number;
  rating: number;
  comment: string | null;
  student?: StudentProfile; // Relationship
  teacher?: TeacherProfile; // Relationship
  lesson?: Lesson; // Relationship
}

// Message Types
export interface Message extends BaseEntity {
  sender_id: number;
  receiver_id: number;
  content: string;
  type: "text" | "booking" | "lesson_reminder";
  read_at: string | null;
  sender?: User; // Relationship
  receiver?: User; // Relationship
}

// Community Types
export interface CommunityPost extends BaseEntity {
  author_id: number;
  title: string;
  content: string;
  language: string;
  category: string;
  tags: string[] | null;
  likes_count: number;
  replies_count: number;
  views_count: number;
  is_moderated: boolean;
  author?: User; // Relationship
}

export interface CommunityEvent extends BaseEntity {
  host_id: number;
  title: string;
  description: string;
  language: string;
  level: string;
  start_time: string;
  duration: number; // in minutes
  max_participants: number;
  participants: string[] | null;
  status: "upcoming" | "live" | "completed" | "cancelled";
  host?: User; // Relationship
}

// Activity Log Types
export interface ActivityLog extends BaseEntity {
  user_id: number;
  type: string;
  description: string;
  metadata: any | null;
  user?: User; // Relationship
}

// System Types
export interface SystemSetting extends BaseEntity {
  key_name: string;
  value: any;
}

// API Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  type: "student" | "teacher";
  // Additional fields based on type
  learning_languages?: string[];
  native_language?: string;
  languages?: string[];
  hourly_rate?: number;
  experience?: number;
  country?: string;
  timezone?: string;
  specialties?: string[];
  description?: string;
}

export interface TeacherApplicationRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  languages: string[];
  native_language: string;
  hourly_rate: number;
  experience: number;
  country: string;
  timezone: string;
  specialties: string[];
  description: string;
  intro_video?: string;
}

export interface BookingRequest {
  teacher_id: number;
  date: string;
  time: string;
  duration: number;
  language: string;
  type: "trial" | "regular";
  notes?: string;
}

export interface WalletRechargeRequest {
  amount: number;
  method: "paypal" | "mastercard" | "visa" | "bank_transfer";
  details: any;
}

export interface PayoutRequestRequest {
  amount: number;
  method: "paypal" | "bank_transfer";
  details: {
    paypal_email?: string;
    bank_account_number?: string;
    bank_routing_number?: string;
    bank_account_holder_name?: string;
    bank_name?: string;
  };
}

// API Response Types
export interface AuthResponse {
  user: User;
  token: string;
  expires_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface DashboardStats {
  total_users: number;
  total_teachers: number;
  total_lessons: number;
  total_revenue: number;
  pending_applications: number;
  active_sessions: number;
  monthly_growth: number;
}

export interface TeacherStats {
  total_earnings: number;
  total_students: number;
  completed_lessons: number;
  this_month_lessons: number;
  rating: number;
  review_count: number;
  upcoming_lessons: number;
}

export interface StudentStats {
  completed_lessons: number;
  hours_learned: number;
  current_streak: number;
  wallet_balance: number;
  upcoming_lessons: number;
  favorite_teachers: number;
}

// Filter Types
export interface UserFilter {
  search?: string;
  type?: "student" | "teacher" | "admin";
  status?: "active" | "suspended";
  created_from?: string;
  created_to?: string;
  page?: number;
  per_page?: number;
}

export interface TeacherFilter {
  search?: string;
  status?: "pending" | "approved" | "rejected";
  language?: string;
  country?: string;
  rating_min?: number;
  price_min?: number;
  price_max?: number;
  page?: number;
  per_page?: number;
}

export interface LessonFilter {
  teacher_id?: number;
  student_id?: number;
  status?: "scheduled" | "completed" | "cancelled";
  language?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}
