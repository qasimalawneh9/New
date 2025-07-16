/**
 * Shared code between client and server
 * Types for the language learning platform
 */

export interface DemoResponse {
  message: string;
}

export interface Teacher {
  id: string;
  name: string;
  avatar: string;
  languages: string[];
  nativeLanguage: string;
  rating: number;
  reviewCount: number;
  price: number;
  currency: string;
  availability: string[];
  specialties: string[];
  experience: number;
  description: string;
  video: string;
  isOnline: boolean;
  responseTime: string;
  completedLessons: number;
  badges: string[];
  country: string;
  timezone: string;
  meetingPlatforms?: {
    zoom?: string;
    googleMeet?: string;
    skype?: string;
    voov?: string;
    preferredPlatform?: "zoom" | "googleMeet" | "skype" | "voov";
  };
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  email: string;
  learningLanguages: string[];
  nativeLanguage: string;
  level: Record<string, string>;
  joinedDate: string;
  completedLessons: number;
  hoursLearned: number;
}

export interface Lesson {
  id: string;
  teacherId: string;
  studentId: string;
  language: string;
  date: string;
  duration: number;
  price: number;
  status: "scheduled" | "completed" | "cancelled";
  type: "trial" | "regular" | "package";
  notes?: string;
  rating?: number;
  review?: string;
}

export interface Booking {
  id: string;
  teacherId: string;
  studentId: string;
  date: string;
  time: string;
  duration: number;
  language: string;
  type: "trial" | "regular";
  price: number;
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
}

export interface Review {
  id: string;
  studentId: string;
  teacherId: string;
  rating: number;
  comment: string;
  date: string;
  lessonId: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: "text" | "booking" | "lesson_reminder";
}

export interface SearchFilters {
  language: string;
  priceMin?: number;
  priceMax?: number;
  availability?: string[];
  specialties?: string[];
  rating?: number;
  country?: string;
  isNative?: boolean;
}

export interface TeachersResponse {
  teachers: Teacher[];
  total: number;
  page: number;
  limit: number;
}

export interface DashboardData {
  student: Student;
  upcomingLessons: Lesson[];
  recentLessons: Lesson[];
  progress: {
    totalHours: number;
    lessonsCompleted: number;
    currentStreak: number;
    languageProgress: Record<string, number>;
  };
  messages: Message[];
}
