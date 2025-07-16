/**
 * API Service Layer
 *
 * This file contains all API calls to the backend Laravel API.
 * Each service corresponds to a controller in the backend.
 *
 * Usage:
 * import { authService, userService, lessonService } from '@/services/api';
 *
 * const users = await userService.getAll();
 * const loginResult = await authService.login(email, password);
 */

import {
  ApiResponse,
  PaginatedResponse,
  User,
  Teacher,
  Student,
  Lesson,
  Booking,
  Review,
  Message,
  Conversation,
  Payment,
  WalletTransaction,
  TeacherApplication,
  Notification,
  PayoutRequest,
  AdminStats,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  CreateLessonRequest,
  UpdateAvailabilityRequest,
  SendMessageRequest,
  SubmitReviewRequest,
  TeacherSearchFilters,
  LessonFilters,
} from "@/types/api";

// Base API configuration
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem("auth_token");
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}`,
          errors: data.errors,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
        meta: data.meta,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const headers: HeadersInit = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}`,
          errors: data.errors,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  }
}

// Initialize API client
const apiClient = new ApiClient(API_BASE_URL);

// Authentication Service
export const authService = {
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const result = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials,
    );
    if (result.success && result.data?.token) {
      apiClient.setToken(result.data.token);
    }
    return result;
  },

  async register(
    userData: RegisterRequest,
  ): Promise<ApiResponse<AuthResponse>> {
    const result = await apiClient.post<AuthResponse>(
      "/auth/register",
      userData,
    );
    if (result.success && result.data?.token) {
      apiClient.setToken(result.data.token);
    }
    return result;
  },

  async logout(): Promise<ApiResponse<any>> {
    const result = await apiClient.post("/auth/logout");
    apiClient.setToken(null);
    return result;
  },

  async me(): Promise<ApiResponse<User>> {
    return apiClient.get<User>("/auth/me");
  },

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    const result = await apiClient.post<AuthResponse>("/auth/refresh");
    if (result.success && result.data?.token) {
      apiClient.setToken(result.data.token);
    }
    return result;
  },

  async forgotPassword(email: string): Promise<ApiResponse<any>> {
    return apiClient.post("/auth/forgot-password", { email });
  },

  async resetPassword(
    token: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<ApiResponse<any>> {
    return apiClient.post("/auth/reset-password", {
      token,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
  },

  async verifyEmail(id: string, hash: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/auth/verify-email/${id}/${hash}`);
  },

  async resendVerification(): Promise<ApiResponse<any>> {
    return apiClient.post("/auth/email/verification-notification");
  },
};

// User Service
export const userService = {
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<User>("/user/profile");
  },

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<User>("/user/profile", data);
  },

  async uploadAvatar(file: File): Promise<ApiResponse<{ avatar_url: string }>> {
    return apiClient.uploadFile<{ avatar_url: string }>("/user/avatar", file);
  },

  async deleteAccount(): Promise<ApiResponse<any>> {
    return apiClient.delete("/user/account");
  },

  async updatePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<ApiResponse<any>> {
    return apiClient.put("/user/password", {
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: confirmPassword,
    });
  },
};

// Teacher Service
export const teacherService = {
  async getAll(
    filters?: TeacherSearchFilters,
  ): Promise<ApiResponse<Teacher[]>> {
    const queryParams = filters
      ? `?${new URLSearchParams(filters as any)}`
      : "";
    return apiClient.get<Teacher[]>(`/teachers${queryParams}`);
  },

  async getById(id: string): Promise<ApiResponse<Teacher>> {
    return apiClient.get<Teacher>(`/teachers/${id}`);
  },

  async getAvailability(
    id: string,
    date?: string,
  ): Promise<ApiResponse<any[]>> {
    const queryParams = date ? `?date=${date}` : "";
    return apiClient.get<any[]>(`/teachers/${id}/availability${queryParams}`);
  },

  async updateAvailability(
    data: UpdateAvailabilityRequest,
  ): Promise<ApiResponse<any>> {
    return apiClient.put("/teacher/availability", data);
  },

  async updateProfile(data: Partial<any>): Promise<ApiResponse<Teacher>> {
    return apiClient.put<Teacher>("/teacher/profile", data);
  },

  async getStudents(): Promise<ApiResponse<Student[]>> {
    return apiClient.get<Student[]>("/teacher/students");
  },

  async getEarnings(period?: string): Promise<ApiResponse<any>> {
    const queryParams = period ? `?period=${period}` : "";
    return apiClient.get<any>(`/teacher/earnings${queryParams}`);
  },

  async requestPayout(
    amount: number,
    method: "bank" | "paypal",
  ): Promise<ApiResponse<PayoutRequest>> {
    return apiClient.post<PayoutRequest>("/teacher/payout-request", {
      amount,
      payout_method: method,
    });
  },
};

// Student Service
export const studentService = {
  async updateProfile(data: Partial<any>): Promise<ApiResponse<Student>> {
    return apiClient.put<Student>("/student/profile", data);
  },

  async getTeachers(): Promise<ApiResponse<Teacher[]>> {
    return apiClient.get<Teacher[]>("/student/teachers");
  },

  async addToFavorites(teacherId: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/student/favorites/${teacherId}`);
  },

  async removeFromFavorites(teacherId: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/student/favorites/${teacherId}`);
  },

  async getWalletBalance(): Promise<ApiResponse<{ balance: number }>> {
    return apiClient.get<{ balance: number }>("/student/wallet/balance");
  },

  async topUpWallet(amount: number): Promise<ApiResponse<Payment>> {
    return apiClient.post<Payment>("/student/wallet/topup", { amount });
  },

  async getWalletTransactions(): Promise<ApiResponse<WalletTransaction[]>> {
    return apiClient.get<WalletTransaction[]>("/student/wallet/transactions");
  },
};

// Lesson Service
export const lessonService = {
  async getAll(filters?: LessonFilters): Promise<ApiResponse<Lesson[]>> {
    const queryParams = filters
      ? `?${new URLSearchParams(filters as any)}`
      : "";
    return apiClient.get<Lesson[]>(`/lessons${queryParams}`);
  },

  async getById(id: string): Promise<ApiResponse<Lesson>> {
    return apiClient.get<Lesson>(`/lessons/${id}`);
  },

  async create(data: CreateLessonRequest): Promise<ApiResponse<Lesson>> {
    return apiClient.post<Lesson>("/lessons", data);
  },

  async update(
    id: string,
    data: Partial<Lesson>,
  ): Promise<ApiResponse<Lesson>> {
    return apiClient.put<Lesson>(`/lessons/${id}`, data);
  },

  async cancel(id: string, reason: string): Promise<ApiResponse<Lesson>> {
    return apiClient.post<Lesson>(`/lessons/${id}/cancel`, { reason });
  },

  async reschedule(id: string, newDate: string): Promise<ApiResponse<Lesson>> {
    return apiClient.post<Lesson>(`/lessons/${id}/reschedule`, {
      scheduled_at: newDate,
    });
  },

  async markComplete(id: string): Promise<ApiResponse<Lesson>> {
    return apiClient.post<Lesson>(`/lessons/${id}/complete`);
  },

  async getMeetingInfo(id: string): Promise<ApiResponse<any>> {
    return apiClient.get<any>(`/lessons/${id}/meeting`);
  },

  async uploadRecording(
    id: string,
    file: File,
  ): Promise<ApiResponse<{ recording_url: string }>> {
    return apiClient.uploadFile<{ recording_url: string }>(
      `/lessons/${id}/recording`,
      file,
    );
  },
};

// Booking Service
export const bookingService = {
  async create(data: any): Promise<ApiResponse<Booking>> {
    return apiClient.post<Booking>("/bookings", data);
  },

  async getById(id: string): Promise<ApiResponse<Booking>> {
    return apiClient.get<Booking>(`/bookings/${id}`);
  },

  async confirm(id: string): Promise<ApiResponse<Booking>> {
    return apiClient.post<Booking>(`/bookings/${id}/confirm`);
  },

  async cancel(id: string, reason: string): Promise<ApiResponse<Booking>> {
    return apiClient.post<Booking>(`/bookings/${id}/cancel`, { reason });
  },

  async getMyBookings(): Promise<ApiResponse<Booking[]>> {
    return apiClient.get<Booking[]>("/bookings/my");
  },
};

// Review Service
export const reviewService = {
  async getForTeacher(teacherId: string): Promise<ApiResponse<Review[]>> {
    return apiClient.get<Review[]>(`/teachers/${teacherId}/reviews`);
  },

  async submit(data: SubmitReviewRequest): Promise<ApiResponse<Review>> {
    return apiClient.post<Review>("/reviews", data);
  },

  async update(
    id: string,
    data: Partial<Review>,
  ): Promise<ApiResponse<Review>> {
    return apiClient.put<Review>(`/reviews/${id}`, data);
  },

  async delete(id: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/reviews/${id}`);
  },
};

// Message Service
export const messageService = {
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    return apiClient.get<Conversation[]>("/conversations");
  },

  async getConversation(id: string): Promise<ApiResponse<Conversation>> {
    return apiClient.get<Conversation>(`/conversations/${id}`);
  },

  async sendMessage(data: SendMessageRequest): Promise<ApiResponse<Message>> {
    return apiClient.post<Message>("/messages", data);
  },

  async markAsRead(messageId: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/messages/${messageId}/read`);
  },

  async uploadAttachment(
    conversationId: string,
    file: File,
  ): Promise<ApiResponse<Message>> {
    return apiClient.uploadFile<Message>(
      `/conversations/${conversationId}/attachment`,
      file,
    );
  },
};

// Notification Service
export const notificationService = {
  async getAll(): Promise<ApiResponse<Notification[]>> {
    return apiClient.get<Notification[]>("/notifications");
  },

  async markAsRead(id: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<ApiResponse<any>> {
    return apiClient.post("/notifications/read-all");
  },

  async delete(id: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/notifications/${id}`);
  },

  async updateSettings(settings: any): Promise<ApiResponse<any>> {
    return apiClient.put("/notifications/settings", settings);
  },
};

// Teacher Application Service
export const teacherApplicationService = {
  async submit(data: any): Promise<ApiResponse<TeacherApplication>> {
    return apiClient.post<TeacherApplication>("/teacher-applications", data);
  },

  async getStatus(): Promise<ApiResponse<TeacherApplication>> {
    return apiClient.get<TeacherApplication>("/teacher-applications/status");
  },

  async uploadDocument(
    type: string,
    file: File,
  ): Promise<ApiResponse<{ document_url: string }>> {
    return apiClient.uploadFile<{ document_url: string }>(
      `/teacher-applications/documents/${type}`,
      file,
    );
  },

  async uploadVideo(file: File): Promise<ApiResponse<{ video_url: string }>> {
    return apiClient.uploadFile<{ video_url: string }>(
      "/teacher-applications/video",
      file,
    );
  },
};

// Admin Service
export const adminService = {
  async getStats(): Promise<ApiResponse<AdminStats>> {
    return apiClient.get<AdminStats>("/admin/stats");
  },

  async getUsers(page?: number): Promise<PaginatedResponse<User>> {
    const queryParams = page ? `?page=${page}` : "";
    return apiClient.get<User[]>(`/admin/users${queryParams}`);
  },

  async getTeachers(page?: number): Promise<PaginatedResponse<Teacher>> {
    const queryParams = page ? `?page=${page}` : "";
    return apiClient.get<Teacher[]>(`/admin/teachers${queryParams}`);
  },

  async getTeacherApplications(
    status?: string,
  ): Promise<ApiResponse<TeacherApplication[]>> {
    const queryParams = status ? `?status=${status}` : "";
    return apiClient.get<TeacherApplication[]>(
      `/admin/teacher-applications${queryParams}`,
    );
  },

  async approveTeacher(id: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/admin/teacher-applications/${id}/approve`);
  },

  async rejectTeacher(id: string, reason: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/admin/teacher-applications/${id}/reject`, {
      reason,
    });
  },

  async suspendUser(id: string, reason: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/admin/users/${id}/suspend`, { reason });
  },

  async reactivateUser(id: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/admin/users/${id}/reactivate`);
  },

  async getPayoutRequests(): Promise<ApiResponse<PayoutRequest[]>> {
    return apiClient.get<PayoutRequest[]>("/admin/payout-requests");
  },

  async processPayoutRequest(
    id: string,
    action: "approve" | "reject",
    notes?: string,
  ): Promise<ApiResponse<PayoutRequest>> {
    return apiClient.post(`/admin/payout-requests/${id}/${action}`, { notes });
  },
};

// Export API client for direct use if needed
export { apiClient };

// Export default object with all services
export default {
  auth: authService,
  user: userService,
  teacher: teacherService,
  student: studentService,
  lesson: lessonService,
  booking: bookingService,
  review: reviewService,
  message: messageService,
  notification: notificationService,
  teacherApplication: teacherApplicationService,
  admin: adminService,
};
