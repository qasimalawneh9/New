import { Request, Response } from "express";

// Mock admin data
const dashboardStats = {
  totalUsers: 1247,
  totalTeachers: 89,
  totalStudents: 1158,
  activeBookings: 234,
  monthlyRevenue: 45600,
  totalLessons: 3456,
  avgRating: 4.7,
  supportTickets: {
    open: 12,
    inProgress: 8,
    resolved: 156,
  },
  userGrowth: {
    thisMonth: 67,
    lastMonth: 52,
    percentChange: 28.8,
  },
};

const platformAnalytics = {
  revenueChart: [
    { month: "Jan", revenue: 38000, lessons: 280 },
    { month: "Feb", revenue: 42000, lessons: 320 },
    { month: "Mar", revenue: 45600, lessons: 345 },
  ],
  userDistribution: {
    students: 92.9,
    teachers: 7.1,
  },
  topLanguages: [
    { language: "Spanish", students: 45, percentage: 38.8 },
    { language: "French", students: 32, percentage: 27.6 },
    { language: "German", students: 28, percentage: 24.1 },
    { language: "Italian", students: 11, percentage: 9.5 },
  ],
  lessonCompletionRate: 94.2,
};

const mockUsers = [
  {
    id: 1,
    email: "admin@talkcon.com",
    name: "Admin User",
    role: "admin",
    status: "active",
    joinDate: "2024-01-01",
    lastLogin: "2024-02-15T10:30:00Z",
    totalLessons: 0,
  },
  {
    id: 2,
    email: "teacher@talkcon.com",
    name: "Teacher User",
    role: "teacher",
    status: "active",
    joinDate: "2024-01-05",
    lastLogin: "2024-02-15T14:20:00Z",
    totalLessons: 156,
  },
  {
    id: 3,
    email: "student@talkcon.com",
    name: "Student User",
    role: "student",
    status: "active",
    joinDate: "2024-01-10",
    lastLogin: "2024-02-15T16:45:00Z",
    totalLessons: 23,
  },
];

export const getDashboard = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      data: dashboardStats,
    });
  } catch (error) {
    console.error("Get admin dashboard error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        ...dashboardStats,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query;

    let filteredUsers = [...mockUsers];

    // Filter by role
    if (role && role !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.role === role);
    }

    // Filter by status
    if (status && status !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.status === status);
    }

    // Search filter
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm),
      );
    }

    // Pagination
    const startIndex =
      (parseInt(page as string) - 1) * parseInt(limit as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return res.status(200).json({
      success: true,
      data: paginatedUsers,
      meta: {
        currentPage: parseInt(page as string),
        perPage: parseInt(limit as string),
        total: filteredUsers.length,
        lastPage: Math.ceil(filteredUsers.length / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = mockUsers.find((u) => u.id === parseInt(id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add additional details for admin view
    const userDetails = {
      ...user,
      additionalInfo: {
        registrationIP: "192.168.1.100",
        emailVerified: true,
        phoneVerified: false,
        twoFactorEnabled: false,
        loginHistory: [
          {
            date: "2024-02-15T16:45:00Z",
            ip: "192.168.1.100",
            device: "Chrome/Windows",
          },
          {
            date: "2024-02-14T10:30:00Z",
            ip: "192.168.1.101",
            device: "Safari/macOS",
          },
        ],
      },
    };

    return res.status(200).json({
      success: true,
      data: userDetails,
    });
  } catch (error) {
    console.error("Get user details error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const suspendUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const user = mockUsers.find((u) => u.id === parseInt(id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = "suspended";

    return res.status(200).json({
      success: true,
      message: `User ${user.name} has been suspended`,
      data: { id: user.id, status: user.status, reason },
    });
  } catch (error) {
    console.error("Suspend user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const activateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = mockUsers.find((u) => u.id === parseInt(id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = "active";

    return res.status(200).json({
      success: true,
      message: `User ${user.name} has been activated`,
      data: { id: user.id, status: user.status },
    });
  } catch (error) {
    console.error("Activate user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userIndex = mockUsers.findIndex((u) => u.id === parseInt(id));

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedUser = mockUsers[userIndex];
    mockUsers.splice(userIndex, 1);

    return res.status(200).json({
      success: true,
      message: `User ${deletedUser.name} has been deleted`,
      data: { id: deletedUser.id },
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = mockUsers.filter((user) => user.role === "teacher");

    return res.status(200).json({
      success: true,
      data: teachers,
    });
  } catch (error) {
    console.error("Get teachers error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const approveTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const teacher = mockUsers.find(
      (u) => u.id === parseInt(id) && u.role === "teacher",
    );

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.status = "active";

    return res.status(200).json({
      success: true,
      message: `Teacher ${teacher.name} has been approved`,
      data: teacher,
    });
  } catch (error) {
    console.error("Approve teacher error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const teacher = mockUsers.find(
      (u) => u.id === parseInt(id) && u.role === "teacher",
    );

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.status = "banned";

    return res.status(200).json({
      success: true,
      message: `Teacher ${teacher.name} has been rejected`,
      data: { id: teacher.id, status: teacher.status, reason },
    });
  } catch (error) {
    console.error("Reject teacher error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    // Mock booking data for admin view
    const bookings = [
      {
        id: 1,
        bookingReference: "BK001",
        studentName: "Student User",
        teacherName: "Teacher User",
        lessonDate: "2024-02-20T14:00:00Z",
        duration: 60,
        status: "confirmed",
        amount: 25,
      },
    ];

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPayments = async (req: Request, res: Response) => {
  try {
    // Mock payment data for admin view
    const payments = [
      {
        id: 1,
        amount: 25,
        currency: "USD",
        status: "completed",
        studentName: "Student User",
        teacherName: "Teacher User",
        createdAt: "2024-02-15T14:00:00Z",
        method: "paypal",
      },
    ];

    return res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error("Get payments error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getReviews = async (req: Request, res: Response) => {
  try {
    // Mock review data for admin view
    const reviews = [
      {
        id: 1,
        rating: 5,
        comment: "Excellent teacher!",
        studentName: "Student User",
        teacherName: "Teacher User",
        createdAt: "2024-02-15T14:00:00Z",
        status: "approved",
      },
    ];

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const moderateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body;

    return res.status(200).json({
      success: true,
      message: `Review ${id} has been ${action}`,
      data: { id, action, reason },
    });
  } catch (error) {
    console.error("Moderate review error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSupportTickets = async (req: Request, res: Response) => {
  try {
    // Mock support ticket data
    const tickets = [
      {
        id: 1,
        subject: "Login issues",
        status: "open",
        priority: "medium",
        userName: "Student User",
        createdAt: "2024-02-15T10:00:00Z",
        lastUpdated: "2024-02-15T14:00:00Z",
      },
    ];

    return res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    console.error("Get support tickets error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const assignTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    return res.status(200).json({
      success: true,
      message: `Ticket ${id} has been assigned to ${assignedTo}`,
      data: { id, assignedTo },
    });
  } catch (error) {
    console.error("Assign ticket error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSystemSettings = async (req: Request, res: Response) => {
  try {
    const settings = {
      platform: {
        name: "TalkCon",
        version: "2.0.0",
        maintenanceMode: false,
      },
      business: {
        commissionRate: 20,
        vatRate: 10,
        minPayoutAmount: 50,
      },
      features: {
        twoFactorAuth: true,
        emailVerification: true,
        smsNotifications: false,
      },
    };

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Get system settings error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSystemSettings = async (req: Request, res: Response) => {
  try {
    const updates = req.body;

    return res.status(200).json({
      success: true,
      message: "System settings updated successfully",
      data: updates,
    });
  } catch (error) {
    console.error("Update system settings error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSystemLogs = async (req: Request, res: Response) => {
  try {
    const logs = [
      {
        id: 1,
        level: "info",
        message: "User login successful",
        timestamp: "2024-02-15T14:30:00Z",
        userId: 3,
      },
      {
        id: 2,
        level: "warning",
        message: "Failed login attempt",
        timestamp: "2024-02-15T14:25:00Z",
        ip: "192.168.1.100",
      },
    ];

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error("Get system logs error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      data: platformAnalytics,
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getReports = async (req: Request, res: Response) => {
  try {
    const { type, dateFrom, dateTo } = req.query;

    const reports = {
      revenue: {
        total: 45600,
        breakdown: { lessons: 40000, commissions: 5600 },
      },
      users: {
        new: 67,
        active: 234,
        churn: 12,
      },
      lessons: {
        completed: 345,
        cancelled: 23,
        noShows: 12,
      },
    };

    return res.status(200).json({
      success: true,
      data: reports,
      filters: { type, dateFrom, dateTo },
    });
  } catch (error) {
    console.error("Get reports error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const exportData = async (req: Request, res: Response) => {
  try {
    const { type, format } = req.body;

    // Mock export functionality
    const exportId = `export_${Date.now()}`;

    return res.status(200).json({
      success: true,
      message: "Export started successfully",
      data: {
        exportId,
        type,
        format,
        status: "processing",
        estimatedTime: "2-3 minutes",
      },
    });
  } catch (error) {
    console.error("Export data error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
