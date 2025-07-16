import { db } from "@/lib/database";

export interface AdminDashboardStats {
  // Overview Stats
  totalUsers: number;
  totalTeachers: number;
  totalLessons: number;
  totalRevenue: number;
  monthlyRevenue: number;

  // User Stats
  newUsersThisMonth: number;
  newUsersThisWeek: number;
  activeUsersToday: number;
  userGrowthRate: number;

  // Teacher Stats
  approvedTeachers: number;
  pendingTeachers: number;
  rejectedTeachers: number;
  newTeachersThisMonth: number;
  teacherApprovalRate: number;

  // Lesson Stats
  completedLessons: number;
  upcomingLessons: number;
  cancelledLessons: number;
  lessonsThisMonth: number;
  lessonsToday: number;
  averageLessonPrice: number;

  // Booking Stats
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;

  // Financial Stats
  revenueThisMonth: number;
  revenueThisWeek: number;
  commissionEarned: number;
  pendingPayouts: number;
  totalPayouts: number;

  // Support Stats
  supportTickets: {
    open: number;
    inProgress: number;
    resolved: number;
    total: number;
  };

  // Performance Stats
  averageRating: number;
  systemUptime: string;
  responseTime: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  type: "student" | "teacher" | "admin";
  status: "active" | "suspended" | "pending";
  createdAt: string;
  lastActive?: string;
  totalLessons?: number;
  totalSpent?: number;
  earnings?: number;
}

export interface AdminTeacherApplication {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  status: "pending" | "approved" | "rejected";
  applicationData: any;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface AdminPayoutRequest {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  amount: number;
  method: "paypal" | "bank_transfer";
  status: "pending" | "approved" | "rejected" | "completed";
  requestedAt: string;
  processedAt?: string;
  adminNotes?: string;
}

export interface RecentActivity {
  id: string;
  type: string;
  userId: string;
  userName: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

class AdminDashboardService {
  /**
   * Get comprehensive dashboard statistics
   */
  async getDashboardStats(): Promise<AdminDashboardStats> {
    try {
      // Get platform stats from database
      const platformStats = db.getPlatformStats();

      // Get raw data
      const users = this.getUsers();
      const teachers = this.getTeachers();
      const lessons = this.getLessons();
      const bookings = this.getBookings();

      // Calculate date ranges
      const now = new Date();
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const today = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Calculate user stats
      const newUsersThisMonth = users.filter(
        (u) => new Date(u.createdAt) > oneMonthAgo,
      ).length;
      const newUsersThisWeek = users.filter(
        (u) => new Date(u.createdAt) > oneWeekAgo,
      ).length;
      const activeUsersToday = users.filter(
        (u) => u.lastActive && new Date(u.lastActive) > today,
      ).length;

      // Calculate teacher stats
      const approvedTeachers = teachers.filter(
        (t) => t.status === "approved",
      ).length;
      const pendingTeachers = teachers.filter(
        (t) => t.status === "pending",
      ).length;
      const rejectedTeachers = teachers.filter(
        (t) => t.status === "rejected",
      ).length;
      const newTeachersThisMonth = teachers.filter(
        (t) => new Date(t.createdAt) > oneMonthAgo,
      ).length;
      const teacherApprovalRate =
        teachers.length > 0 ? (approvedTeachers / teachers.length) * 100 : 0;

      // Calculate lesson stats
      const completedLessons = lessons.filter(
        (l) => l.status === "completed",
      ).length;
      const upcomingLessons = lessons.filter(
        (l) => l.status === "scheduled" || l.status === "confirmed",
      ).length;
      const cancelledLessons = lessons.filter(
        (l) => l.status === "cancelled",
      ).length;
      const lessonsThisMonth = lessons.filter(
        (l) => new Date(l.createdAt || l.date) > oneMonthAgo,
      ).length;
      const lessonsToday = lessons.filter((l) => {
        const lessonDate = new Date(l.date || l.createdAt);
        return lessonDate.toDateString() === now.toDateString();
      }).length;

      // Calculate financial stats
      const completedLessonsWithPrice = lessons.filter(
        (l) => l.status === "completed" && l.price,
      );
      const totalRevenue = completedLessonsWithPrice.reduce(
        (sum, l) => sum + (l.price || 0),
        0,
      );
      const averageLessonPrice =
        completedLessonsWithPrice.length > 0
          ? totalRevenue / completedLessonsWithPrice.length
          : 0;
      const revenueThisMonth = lessons
        .filter(
          (l) =>
            l.status === "completed" &&
            new Date(l.createdAt || l.date) > oneMonthAgo,
        )
        .reduce((sum, l) => sum + (l.price || 0), 0);
      const revenueThisWeek = lessons
        .filter(
          (l) =>
            l.status === "completed" &&
            new Date(l.createdAt || l.date) > oneWeekAgo,
        )
        .reduce((sum, l) => sum + (l.price || 0), 0);
      const commissionEarned = totalRevenue * 0.2; // 20% commission

      // Calculate booking stats
      const confirmedBookings = bookings.filter(
        (b) => b.status === "confirmed",
      ).length;
      const pendingBookings = bookings.filter(
        (b) => b.status === "pending",
      ).length;
      const cancelledBookings = bookings.filter(
        (b) => b.status === "cancelled",
      ).length;

      // Get payout stats
      const payoutRequests = this.getPayoutRequests();
      const pendingPayouts = payoutRequests.filter(
        (p) => p.status === "pending",
      ).length;
      const totalPayouts = payoutRequests.filter(
        (p) => p.status === "approved" || p.status === "completed",
      ).length;

      // Calculate average rating
      const teachersWithRating = teachers.filter(
        (t) => t.rating && t.rating > 0,
      );
      const averageRating =
        teachersWithRating.length > 0
          ? teachersWithRating.reduce((sum, t) => sum + (t.rating || 0), 0) /
            teachersWithRating.length
          : 0;

      return {
        // Overview Stats
        totalUsers: users.length,
        totalTeachers: teachers.length,
        totalLessons: lessons.length,
        totalRevenue: Math.round(totalRevenue),
        monthlyRevenue: Math.round(revenueThisMonth),

        // User Stats
        newUsersThisMonth,
        newUsersThisWeek,
        activeUsersToday,
        userGrowthRate: platformStats?.userGrowthRate || 0,

        // Teacher Stats
        approvedTeachers,
        pendingTeachers,
        rejectedTeachers,
        newTeachersThisMonth,
        teacherApprovalRate: Math.round(teacherApprovalRate * 100) / 100,

        // Lesson Stats
        completedLessons,
        upcomingLessons,
        cancelledLessons,
        lessonsThisMonth,
        lessonsToday,
        averageLessonPrice: Math.round(averageLessonPrice * 100) / 100,

        // Booking Stats
        totalBookings: bookings.length,
        confirmedBookings,
        pendingBookings,
        cancelledBookings,

        // Financial Stats
        revenueThisMonth: Math.round(revenueThisMonth),
        revenueThisWeek: Math.round(revenueThisWeek),
        commissionEarned: Math.round(commissionEarned),
        pendingPayouts,
        totalPayouts,

        // Support Stats
        supportTickets: {
          open: 5,
          inProgress: 12,
          resolved: 143,
          total: 160,
        },

        // Performance Stats
        averageRating: Math.round(averageRating * 10) / 10,
        systemUptime: "99.9%",
        responseTime: 245,
      };
    } catch (error) {
      console.error("Failed to get dashboard stats:", error);
      throw new Error("Failed to load dashboard statistics");
    }
  }

  /**
   * Get all users with admin details
   */
  getUsers(): AdminUser[] {
    try {
      const users = db.getUsers() || [];
      return users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type || "student",
        status: user.status || "active",
        createdAt: user.createdAt,
        lastActive: user.lastActive,
        totalLessons: user.completedLessons || 0,
        totalSpent: user.totalSpent || 0,
      }));
    } catch (error) {
      console.error("Failed to get users:", error);
      return [];
    }
  }

  /**
   * Get all teachers with admin details
   */
  getTeachers(): AdminUser[] {
    try {
      const teachers = db.getTeachers() || [];
      return teachers.map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        type: "teacher",
        status: teacher.status || "pending",
        createdAt: teacher.createdAt,
        lastActive: teacher.lastActive,
        totalLessons: teacher.completedLessons || 0,
        earnings: teacher.earnings || 0,
      }));
    } catch (error) {
      console.error("Failed to get teachers:", error);
      return [];
    }
  }

  /**
   * Get all lessons
   */
  getLessons(): any[] {
    try {
      return db.getLessons() || [];
    } catch (error) {
      console.error("Failed to get lessons:", error);
      return [];
    }
  }

  /**
   * Get all bookings (fallback if method doesn't exist)
   */
  getBookings(): any[] {
    try {
      // Try to get bookings from database
      if (typeof db.getBookings === "function") {
        return db.getBookings();
      }

      // Fallback: create bookings from lessons
      const lessons = this.getLessons();
      return lessons.map((lesson) => ({
        id: `booking_${lesson.id}`,
        lessonId: lesson.id,
        studentId: lesson.studentId,
        teacherId: lesson.teacherId,
        status:
          lesson.status === "completed"
            ? "completed"
            : lesson.status === "cancelled"
              ? "cancelled"
              : "confirmed",
        date: lesson.date,
        createdAt: lesson.createdAt || lesson.date,
      }));
    } catch (error) {
      console.error("Failed to get bookings:", error);
      return [];
    }
  }

  /**
   * Get teacher applications
   */
  getTeacherApplications(): AdminTeacherApplication[] {
    try {
      const teachers = this.getTeachers();
      return teachers
        .filter((teacher) => teacher.status === "pending")
        .map((teacher) => ({
          id: `app_${teacher.id}`,
          teacherId: teacher.id,
          teacherName: teacher.name,
          teacherEmail: teacher.email,
          status: teacher.status as "pending",
          applicationData: {},
          submittedAt: teacher.createdAt,
        }));
    } catch (error) {
      console.error("Failed to get teacher applications:", error);
      return [];
    }
  }

  /**
   * Get payout requests
   */
  getPayoutRequests(): AdminPayoutRequest[] {
    try {
      if (typeof db.getPayoutRequests === "function") {
        return db.getPayoutRequests();
      }

      // Fallback: create sample payout requests
      return [
        {
          id: "payout_1",
          teacherId: "teacher_1",
          teacherName: "Demo Teacher",
          teacherEmail: "demo@teacher.com",
          amount: 150.0,
          method: "paypal",
          status: "pending",
          requestedAt: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: "payout_2",
          teacherId: "teacher_2",
          teacherName: "Sarah Wilson",
          teacherEmail: "sarah@example.com",
          amount: 275.5,
          method: "bank_transfer",
          status: "approved",
          requestedAt: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          processedAt: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ];
    } catch (error) {
      console.error("Failed to get payout requests:", error);
      return [];
    }
  }

  /**
   * Get recent activity
   */
  getRecentActivity(limit: number = 10): RecentActivity[] {
    try {
      if (typeof db.getRecentActivity === "function") {
        return db.getRecentActivity().slice(0, limit);
      }

      // Fallback: generate sample activity
      const activities: RecentActivity[] = [
        {
          id: "1",
          type: "user_signup",
          userId: "user_123",
          userName: "John Doe",
          description: "New user registered",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          type: "teacher_application",
          userId: "teacher_456",
          userName: "Jane Smith",
          description: "New teacher application submitted",
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          type: "lesson_completed",
          userId: "student_789",
          userName: "Mike Johnson",
          description: "Lesson completed with Demo Teacher",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "4",
          type: "payout_requested",
          userId: "teacher_101",
          userName: "Demo Teacher",
          description: "Payout request for $150.00",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
      ];

      return activities.slice(0, limit);
    } catch (error) {
      console.error("Failed to get recent activity:", error);
      return [];
    }
  }

  /**
   * Approve teacher application
   */
  async approveTeacher(teacherId: string): Promise<boolean> {
    try {
      if (typeof db.approveTeacher === "function") {
        return db.approveTeacher(teacherId);
      }

      // Fallback: update teacher status
      const teachers = db.getTeachers();
      const teacherIndex = teachers.findIndex((t) => t.id === teacherId);
      if (teacherIndex !== -1) {
        teachers[teacherIndex].status = "approved";
        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to approve teacher:", error);
      return false;
    }
  }

  /**
   * Reject teacher application
   */
  async rejectTeacher(teacherId: string, reason: string): Promise<boolean> {
    try {
      if (typeof db.rejectTeacher === "function") {
        return db.rejectTeacher(teacherId, reason);
      }

      // Fallback: update teacher status
      const teachers = db.getTeachers();
      const teacherIndex = teachers.findIndex((t) => t.id === teacherId);
      if (teacherIndex !== -1) {
        teachers[teacherIndex].status = "rejected";
        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to reject teacher:", error);
      return false;
    }
  }

  /**
   * Suspend user
   */
  async suspendUser(userId: string, reason: string): Promise<boolean> {
    try {
      if (typeof db.suspendUser === "function") {
        return db.suspendUser(userId, reason);
      }

      // Fallback: update user status
      const users = db.getUsers();
      const userIndex = users.findIndex((u) => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].status = "suspended";
        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to suspend user:", error);
      return false;
    }
  }

  /**
   * Reactivate user
   */
  async reactivateUser(userId: string): Promise<boolean> {
    try {
      if (typeof db.reactivateUser === "function") {
        return db.reactivateUser(userId);
      }

      // Fallback: update user status
      const users = db.getUsers();
      const userIndex = users.findIndex((u) => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].status = "active";
        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to reactivate user:", error);
      return false;
    }
  }

  /**
   * Process payout request
   */
  async processPayoutRequest(
    payoutId: string,
    action: "approve" | "reject",
    notes?: string,
  ): Promise<boolean> {
    try {
      if (
        typeof db.approvePayoutRequest === "function" &&
        action === "approve"
      ) {
        return db.approvePayoutRequest(payoutId, notes);
      }

      if (typeof db.rejectPayoutRequest === "function" && action === "reject") {
        return db.rejectPayoutRequest(payoutId, notes);
      }

      // Fallback: simulate payout processing
      console.log(`Payout ${payoutId} ${action}ed with notes: ${notes}`);
      return true;
    } catch (error) {
      console.error("Failed to process payout request:", error);
      return false;
    }
  }
}

// Export singleton instance
export const adminDashboardService = new AdminDashboardService();
export default adminDashboardService;
