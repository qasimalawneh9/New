// Frontend API Service Layer for Laravel Backend Integration

const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:8000/api/v1";

// HTTP Client Configuration
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
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

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Request failed");
      }

      return await response.json();
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: any;
}

// Authentication API
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<ApiResponse>("/auth/login", { email, password }),

  register: (userData: any) =>
    apiClient.post<ApiResponse>("/auth/register", userData),

  logout: () => apiClient.post<ApiResponse>("/auth/logout", {}),

  refreshToken: () => apiClient.post<ApiResponse>("/auth/refresh", {}),

  forgotPassword: (email: string) =>
    apiClient.post<ApiResponse>("/auth/forgot-password", { email }),

  resetPassword: (
    token: string,
    password: string,
    passwordConfirmation: string,
  ) =>
    apiClient.post<ApiResponse>("/auth/reset-password", {
      token,
      password,
      password_confirmation: passwordConfirmation,
    }),
};

// Users API
export const usersApi = {
  getAll: (params?: any) =>
    apiClient.get<ApiResponse>(
      `/users${params ? "?" + new URLSearchParams(params) : ""}`,
    ),

  getById: (id: string) => apiClient.get<ApiResponse>(`/users/${id}`),

  update: (id: string, userData: any) =>
    apiClient.put<ApiResponse>(`/users/${id}`, userData),

  delete: (id: string) => apiClient.delete<ApiResponse>(`/users/${id}`),

  getTransactions: (id: string) =>
    apiClient.get<ApiResponse>(`/users/${id}/transactions`),
};

// Teachers API
export const teachersApi = {
  getAll: (params?: any) =>
    apiClient.get<ApiResponse>(
      `/teachers${params ? "?" + new URLSearchParams(params) : ""}`,
    ),

  getById: (id: string) => apiClient.get<ApiResponse>(`/teachers/${id}`),

  apply: (applicationData: any) =>
    apiClient.post<ApiResponse>("/teachers/apply", applicationData),

  getApplications: (params?: any) =>
    apiClient.get<ApiResponse>(
      `/teachers/applications${params ? "?" + new URLSearchParams(params) : ""}`,
    ),

  approve: (id: string) =>
    apiClient.put<ApiResponse>(`/teachers/${id}/approve`, {}),

  reject: (id: string, reason?: string) =>
    apiClient.put<ApiResponse>(`/teachers/${id}/reject`, { reason }),

  updateMeetingPlatforms: (id: string, platforms: any) =>
    apiClient.put<ApiResponse>(`/teachers/${id}/meeting-platforms`, platforms),
};

// Lessons API
export const lessonsApi = {
  getAll: (params?: any) =>
    apiClient.get<ApiResponse>(
      `/lessons${params ? "?" + new URLSearchParams(params) : ""}`,
    ),

  create: (lessonData: any) =>
    apiClient.post<ApiResponse>("/lessons", lessonData),

  getById: (id: string) => apiClient.get<ApiResponse>(`/lessons/${id}`),

  update: (id: string, lessonData: any) =>
    apiClient.put<ApiResponse>(`/lessons/${id}`, lessonData),

  cancel: (id: string) => apiClient.delete<ApiResponse>(`/lessons/${id}`),

  getMeetingInfo: (id: string) =>
    apiClient.get<ApiResponse>(`/lessons/${id}/meeting-info`),
};

// Bookings API
export const bookingsApi = {
  create: (bookingData: any) =>
    apiClient.post<ApiResponse>("/bookings", bookingData),

  getAll: (params?: any) =>
    apiClient.get<ApiResponse>(
      `/bookings${params ? "?" + new URLSearchParams(params) : ""}`,
    ),

  confirm: (id: string) =>
    apiClient.put<ApiResponse>(`/bookings/${id}/confirm`, {}),

  cancel: (id: string) =>
    apiClient.put<ApiResponse>(`/bookings/${id}/cancel`, {}),
};

// Wallet & Payments API
export const walletApi = {
  getBalance: () => apiClient.get<ApiResponse>("/wallet/balance"),

  recharge: (amount: number, method: string, details: any) =>
    apiClient.post<ApiResponse>("/wallet/recharge", {
      amount,
      method,
      details,
    }),

  getTransactions: (params?: any) =>
    apiClient.get<ApiResponse>(
      `/wallet/transactions${params ? "?" + new URLSearchParams(params) : ""}`,
    ),
};

export const paymentsApi = {
  processLessonPayment: (
    lessonId: string,
    paymentMethod: string,
    details: any,
  ) =>
    apiClient.post<ApiResponse>("/payments/lesson", {
      lessonId,
      paymentMethod,
      details,
    }),
};

// Payouts API
export const payoutsApi = {
  request: (amount: number, method: string, details: any) =>
    apiClient.post<ApiResponse>("/payouts/request", {
      amount,
      method,
      details,
    }),

  getAll: (params?: any) =>
    apiClient.get<ApiResponse>(
      `/payouts${params ? "?" + new URLSearchParams(params) : ""}`,
    ),

  approve: (id: string, notes?: string) =>
    apiClient.put<ApiResponse>(`/payouts/${id}/approve`, { notes }),

  reject: (id: string, reason?: string) =>
    apiClient.put<ApiResponse>(`/payouts/${id}/reject`, { reason }),
};

// Community API
export const communityApi = {
  getPosts: (params?: any) =>
    apiClient.get<ApiResponse>(
      `/community/posts${params ? "?" + new URLSearchParams(params) : ""}`,
    ),

  createPost: (postData: any) =>
    apiClient.post<ApiResponse>("/community/posts", postData),

  getEvents: (params?: any) =>
    apiClient.get<ApiResponse>(
      `/community/events${params ? "?" + new URLSearchParams(params) : ""}`,
    ),

  createEvent: (eventData: any) =>
    apiClient.post<ApiResponse>("/community/events", eventData),
};

// Admin API
export const adminApi = {
  getStats: () => apiClient.get<ApiResponse>("/admin/stats"),

  getActivities: (params?: any) =>
    apiClient.get<ApiResponse>(
      `/admin/activities${params ? "?" + new URLSearchParams(params) : ""}`,
    ),

  getUsers: (params?: any) =>
    apiClient.get<ApiResponse>(
      `/admin/users${params ? "?" + new URLSearchParams(params) : ""}`,
    ),

  getTeachers: (params?: any) =>
    apiClient.get<ApiResponse>(
      `/admin/teachers${params ? "?" + new URLSearchParams(params) : ""}`,
    ),
};

// Export API client for direct access if needed
export { apiClient };

// Helper function to handle API responses
export const handleApiResponse = async <T>(
  apiCall: Promise<ApiResponse<T>>,
): Promise<{ data: T | null; error: string | null }> => {
  try {
    const response = await apiCall;
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
