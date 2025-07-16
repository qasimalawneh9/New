import { db } from "./database";

// Common API response pattern
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Wrap database operations with consistent error handling
export const apiWrapper = async <T>(
  operation: () => T | Promise<T>,
): Promise<ApiResponse<T>> => {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
};

// Common database operations
export const api = {
  // User operations
  users: {
    getAll: () => apiWrapper(() => db.getUsers()),
    getById: (id: string) => apiWrapper(() => db.getUserById(id)),
    create: (userData: any) => apiWrapper(() => db.createUser(userData)),
    authenticate: (email: string, password: string) =>
      apiWrapper(() => db.authenticateUser(email, password)),
  },

  // Teacher operations
  teachers: {
    getAll: () => apiWrapper(() => db.getTeachers()),
    getByEmail: (email: string) =>
      apiWrapper(() => db.getTeacherByEmail(email)),
    getApplications: () => apiWrapper(() => db.getTeacherApplications()),
    approve: (id: string) => apiWrapper(() => db.approveTeacher(id)),
    reject: (id: string) => apiWrapper(() => db.rejectTeacher(id)),
  },

  // Lesson operations
  lessons: {
    getAll: () => apiWrapper(() => db.getLessons()),
    create: (lessonData: any) => apiWrapper(() => db.createLesson(lessonData)),
    getMeetingInfo: (id: string) =>
      apiWrapper(() => db.getLessonMeetingInfo(id)),
  },

  // Wallet operations
  wallet: {
    getBalance: (userId: string) =>
      apiWrapper(() => db.getUserWalletBalance(userId)),
    getTransactions: (userId: string) =>
      apiWrapper(() => db.getUserTransactions(userId)),
    recharge: (userId: string, amount: number, method: string, details: any) =>
      apiWrapper(() => db.rechargeWallet(userId, amount, method, details)),
  },

  // System operations
  system: {
    getStats: () => apiWrapper(() => db.getStats()),
    getActivities: (limit?: number) =>
      apiWrapper(() => db.getRecentActivities(limit)),
  },
};
