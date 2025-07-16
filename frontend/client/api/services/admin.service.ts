/**
 * Admin Service
 *
 * Handles all admin-related API calls
 * Maps to Node.js Express AdminController
 */

import { BaseApiService } from "../base.service";
import { ADMIN_ENDPOINTS } from "../endpoints";

// Admin types
export interface AdminDashboardStats {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  activeBookings: number;
  monthlyRevenue: number;
  totalLessons: number;
  avgRating: number;
  supportTickets: {
    open: number;
    inProgress: number;
    resolved: number;
  };
  userGrowth: {
    thisMonth: number;
    lastMonth: number;
    percentChange: number;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "student" | "teacher" | "admin";
  status:
    | "active"
    | "suspended"
    | "banned"
    | "pending_verification"
    | "deleted";
  joinDate: string;
  lastLogin: string;
  totalLessons: number;
}

export interface AdminAnalytics {
  revenueChart: Array<{ month: string; revenue: number; lessons: number }>;
  userDistribution: { students: number; teachers: number };
  topLanguages: Array<{
    language: string;
    students: number;
    percentage: number;
  }>;
  lessonCompletionRate: number;
}

export interface AdminBooking {
  id: number;
  bookingReference: string;
  studentName: string;
  teacherName: string;
  lessonDate: string;
  duration: number;
  status: string;
  amount: number;
}

export interface AdminPayment {
  id: number;
  amount: number;
  currency: string;
  status: string;
  studentName: string;
  teacherName: string;
  createdAt: string;
  method: string;
}

export interface AdminReview {
  id: number;
  rating: number;
  comment: string;
  studentName: string;
  teacherName: string;
  createdAt: string;
  status: string;
}

export interface AdminSupportTicket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  userName: string;
  createdAt: string;
  lastUpdated: string;
}

export interface AdminSystemSettings {
  platform: {
    name: string;
    version: string;
    maintenanceMode: boolean;
  };
  business: {
    commissionRate: number;
    vatRate: number;
    minPayoutAmount: number;
  };
  features: {
    twoFactorAuth: boolean;
    emailVerification: boolean;
    smsNotifications: boolean;
  };
}

/**
 * AdminService class
 *
 * Usage Example:
 * ```typescript
 * const adminService = new AdminService();
 *
 * // Get dashboard stats
 * const stats = await adminService.getDashboard();
 *
 * // Get all users
 * const users = await adminService.getUsers({
 *   page: 1,
 *   limit: 10,
 *   role: 'all',
 *   status: 'all'
 * });
 * ```
 */
export class AdminService extends BaseApiService {
  /**
   * Get admin dashboard data
   * GET /api/admin/dashboard → AdminController@getDashboard
   */
  async getDashboard(): Promise<AdminDashboardStats> {
    const response = await this.get<{
      success: boolean;
      data: AdminDashboardStats;
    }>(ADMIN_ENDPOINTS.DASHBOARD);
    return response.data.data;
  }

  /**
   * Get platform statistics
   * GET /api/admin/stats → AdminController@getStats
   */
  async getStats(): Promise<AdminDashboardStats> {
    const response = await this.get<{
      success: boolean;
      data: AdminDashboardStats;
    }>(ADMIN_ENDPOINTS.STATS);
    return response.data.data;
  }

  /**
   * Get all users with pagination and filters
   * GET /api/admin/users → AdminController@getUsers
   */
  async getUsers(params: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }): Promise<{ data: AdminUser[]; meta: any }> {
    const response = await this.get<{
      success: boolean;
      data: AdminUser[];
      meta: any;
    }>(ADMIN_ENDPOINTS.USERS, params);
    return { data: response.data.data, meta: response.data.meta };
  }

  /**
   * Get user details
   * GET /api/admin/users/:id → AdminController@getUserDetails
   */
  async getUserDetails(id: string): Promise<AdminUser> {
    const response = await this.get<{ success: boolean; data: AdminUser }>(
      ADMIN_ENDPOINTS.USER_DETAILS.replace(":id", id),
    );
    return response.data.data;
  }

  /**
   * Suspend user
   * POST /api/admin/users/:id/suspend → AdminController@suspendUser
   */
  async suspendUser(id: string, reason: string): Promise<{ message: string }> {
    const response = await this.post<{ success: boolean; message: string }>(
      ADMIN_ENDPOINTS.SUSPEND_USER.replace(":id", id),
      { reason },
    );
    return { message: response.data.message };
  }

  /**
   * Activate user
   * POST /api/admin/users/:id/activate → AdminController@activateUser
   */
  async activateUser(id: string): Promise<{ message: string }> {
    const response = await this.post<{ success: boolean; message: string }>(
      ADMIN_ENDPOINTS.ACTIVATE_USER.replace(":id", id),
    );
    return { message: response.data.message };
  }

  /**
   * Delete user
   * DELETE /api/admin/users/:id → AdminController@deleteUser
   */
  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await this.delete<{ success: boolean; message: string }>(
      ADMIN_ENDPOINTS.DELETE_USER.replace(":id", id),
    );
    return { message: response.data.message };
  }

  /**
   * Get all teachers
   * GET /api/admin/teachers → AdminController@getTeachers
   */
  async getTeachers(): Promise<AdminUser[]> {
    const response = await this.get<{ success: boolean; data: AdminUser[] }>(
      ADMIN_ENDPOINTS.TEACHERS,
    );
    return response.data.data;
  }

  /**
   * Approve teacher
   * POST /api/admin/teachers/:id/approve → AdminController@approveTeacher
   */
  async approveTeacher(id: string): Promise<{ message: string }> {
    const response = await this.post<{ success: boolean; message: string }>(
      ADMIN_ENDPOINTS.APPROVE_TEACHER.replace(":id", id),
    );
    return { message: response.data.message };
  }

  /**
   * Reject teacher
   * POST /api/admin/teachers/:id/reject → AdminController@rejectTeacher
   */
  async rejectTeacher(
    id: string,
    reason: string,
  ): Promise<{ message: string }> {
    const response = await this.post<{ success: boolean; message: string }>(
      ADMIN_ENDPOINTS.REJECT_TEACHER.replace(":id", id),
      { reason },
    );
    return { message: response.data.message };
  }

  /**
   * Get all bookings
   * GET /api/admin/bookings → AdminController@getBookings
   */
  async getBookings(): Promise<AdminBooking[]> {
    const response = await this.get<{ success: boolean; data: AdminBooking[] }>(
      ADMIN_ENDPOINTS.BOOKINGS,
    );
    return response.data.data;
  }

  /**
   * Get all payments
   * GET /api/admin/payments → AdminController@getPayments
   */
  async getPayments(): Promise<AdminPayment[]> {
    const response = await this.get<{ success: boolean; data: AdminPayment[] }>(
      ADMIN_ENDPOINTS.PAYMENTS,
    );
    return response.data.data;
  }

  /**
   * Get all reviews
   * GET /api/admin/reviews → AdminController@getReviews
   */
  async getReviews(): Promise<AdminReview[]> {
    const response = await this.get<{ success: boolean; data: AdminReview[] }>(
      ADMIN_ENDPOINTS.REVIEWS,
    );
    return response.data.data;
  }

  /**
   * Moderate review
   * POST /api/admin/reviews/:id/moderate → AdminController@moderateReview
   */
  async moderateReview(
    id: string,
    action: string,
    reason?: string,
  ): Promise<{ message: string }> {
    const response = await this.post<{ success: boolean; message: string }>(
      ADMIN_ENDPOINTS.MODERATE_REVIEW.replace(":id", id),
      { action, reason },
    );
    return { message: response.data.message };
  }

  /**
   * Get support tickets
   * GET /api/admin/support → AdminController@getSupportTickets
   */
  async getSupportTickets(): Promise<AdminSupportTicket[]> {
    const response = await this.get<{
      success: boolean;
      data: AdminSupportTicket[];
    }>(ADMIN_ENDPOINTS.SUPPORT_TICKETS);
    return response.data.data;
  }

  /**
   * Assign ticket
   * POST /api/admin/support/:id/assign → AdminController@assignTicket
   */
  async assignTicket(
    id: string,
    assignedTo: string,
  ): Promise<{ message: string }> {
    const response = await this.post<{ success: boolean; message: string }>(
      ADMIN_ENDPOINTS.ASSIGN_TICKET.replace(":id", id),
      { assignedTo },
    );
    return { message: response.data.message };
  }

  /**
   * Get system settings
   * GET /api/admin/settings → AdminController@getSystemSettings
   */
  async getSystemSettings(): Promise<AdminSystemSettings> {
    const response = await this.get<{
      success: boolean;
      data: AdminSystemSettings;
    }>(ADMIN_ENDPOINTS.SYSTEM_SETTINGS);
    return response.data.data;
  }

  /**
   * Update system settings
   * PUT /api/admin/settings → AdminController@updateSystemSettings
   */
  async updateSystemSettings(
    settings: Partial<AdminSystemSettings>,
  ): Promise<{ message: string }> {
    const response = await this.put<{ success: boolean; message: string }>(
      ADMIN_ENDPOINTS.UPDATE_SETTINGS,
      settings,
    );
    return { message: response.data.message };
  }

  /**
   * Get system logs
   * GET /api/admin/logs → AdminController@getSystemLogs
   */
  async getSystemLogs(): Promise<any[]> {
    const response = await this.get<{ success: boolean; data: any[] }>(
      ADMIN_ENDPOINTS.LOGS,
    );
    return response.data.data;
  }

  /**
   * Get analytics data
   * GET /api/admin/analytics → AdminController@getAnalytics
   */
  async getAnalytics(): Promise<AdminAnalytics> {
    const response = await this.get<{ success: boolean; data: AdminAnalytics }>(
      ADMIN_ENDPOINTS.ANALYTICS,
    );
    return response.data.data;
  }

  /**
   * Get reports
   * GET /api/admin/reports → AdminController@getReports
   */
  async getReports(params: {
    type?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<any> {
    const response = await this.get<{ success: boolean; data: any }>(
      ADMIN_ENDPOINTS.REPORTS,
      params,
    );
    return response.data.data;
  }

  /**
   * Export data
   * POST /api/admin/export → AdminController@exportData
   */
  async exportData(
    type: string,
    format: string,
  ): Promise<{ message: string; exportId: string }> {
    const response = await this.post<{ success: boolean; data: any }>(
      ADMIN_ENDPOINTS.EXPORT_DATA,
      { type, format },
    );
    return response.data.data;
  }
}

// Export singleton instance
export const adminService = new AdminService();
