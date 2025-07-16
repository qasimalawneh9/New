import { Request, Response } from "express";

export const getTeacherAnalytics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    // Only allow teachers to see their own analytics or admins to see any
    if (id !== userId.toString() && (req as any).user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const analytics = {
      earnings: {
        thisMonth: 1250,
        lastMonth: 980,
        total: 15600,
        growth: 27.6,
      },
      lessons: {
        completed: 45,
        scheduled: 12,
        cancelled: 3,
        completionRate: 93.8,
      },
      students: {
        active: 18,
        new: 4,
        retention: 85.2,
      },
      rating: {
        average: 4.8,
        totalReviews: 67,
        distribution: {
          5: 45,
          4: 18,
          3: 3,
          2: 1,
          1: 0,
        },
      },
      performance: {
        responseRate: 95,
        onTimeRate: 98,
        noShowRate: 2,
      },
    };

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getStudentAnalytics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    // Only allow students to see their own analytics or admins to see any
    if (id !== userId.toString() && (req as any).user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const analytics = {
      progress: {
        totalHours: 45,
        thisMonth: 12,
        streak: 7,
        longestStreak: 15,
      },
      lessons: {
        completed: 23,
        upcoming: 3,
        cancelled: 1,
        completionRate: 95.8,
      },
      spending: {
        thisMonth: 200,
        total: 1150,
        avgPerLesson: 25,
      },
      goals: {
        completed: 3,
        inProgress: 2,
        upcoming: 1,
      },
      performance: {
        attendanceRate: 97,
        homeworkCompletion: 89,
        avgRatingGiven: 4.9,
      },
    };

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPlatformAnalytics = async (req: Request, res: Response) => {
  try {
    const analytics = {
      users: {
        total: 1247,
        teachers: 89,
        students: 1158,
        growth: {
          weekly: 23,
          monthly: 67,
        },
      },
      revenue: {
        total: 45600,
        thisMonth: 8900,
        lastMonth: 7200,
        growth: 23.6,
        breakdown: {
          lessons: 38000,
          subscriptions: 5600,
          commissions: 2000,
        },
      },
      lessons: {
        total: 3456,
        thisMonth: 567,
        avgDuration: 52,
        completionRate: 94.2,
      },
      engagement: {
        dailyActiveUsers: 234,
        weeklyActiveUsers: 567,
        monthlyActiveUsers: 890,
        avgSessionDuration: 45,
      },
      geography: {
        topCountries: [
          { country: "USA", users: 456, percentage: 36.6 },
          { country: "UK", users: 234, percentage: 18.8 },
          { country: "Canada", users: 156, percentage: 12.5 },
          { country: "Australia", users: 123, percentage: 9.9 },
        ],
      },
    };

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRevenueAnalytics = async (req: Request, res: Response) => {
  try {
    const { timeframe = "month" } = req.query;

    const revenueData = {
      month: {
        total: 8900,
        breakdown: [
          { date: "2024-02-01", amount: 1200 },
          { date: "2024-02-02", amount: 890 },
          { date: "2024-02-03", amount: 1450 },
          { date: "2024-02-04", amount: 980 },
          { date: "2024-02-05", amount: 1100 },
        ],
        commission: 1780,
        taxes: 890,
      },
      year: {
        total: 45600,
        breakdown: [
          { month: "Jan", amount: 7200 },
          { month: "Feb", amount: 8900 },
        ],
        commission: 9120,
        taxes: 4560,
      },
    };

    return res.status(200).json({
      success: true,
      data: revenueData[timeframe as string] || revenueData.month,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserGrowthAnalytics = async (req: Request, res: Response) => {
  try {
    const userGrowth = {
      total: 1247,
      growth: [
        { period: "Week 1", students: 52, teachers: 3 },
        { period: "Week 2", students: 48, teachers: 2 },
        { period: "Week 3", students: 67, teachers: 4 },
        { period: "Week 4", students: 55, teachers: 2 },
      ],
      retention: {
        weekly: 85.2,
        monthly: 73.8,
        quarterly: 65.4,
      },
      churn: {
        weekly: 2.1,
        monthly: 5.8,
        quarterly: 12.3,
      },
    };

    return res.status(200).json({
      success: true,
      data: userGrowth,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getLessonAnalytics = async (req: Request, res: Response) => {
  try {
    const lessonAnalytics = {
      total: 3456,
      thisMonth: 567,
      completionRate: 94.2,
      avgDuration: 52,
      avgRating: 4.7,
      byLanguage: [
        { language: "Spanish", lessons: 145, avgRating: 4.8 },
        { language: "French", lessons: 123, avgRating: 4.6 },
        { language: "German", lessons: 98, avgRating: 4.7 },
        { language: "Italian", lessons: 67, avgRating: 4.9 },
      ],
      timeDistribution: {
        morning: 25.6,
        afternoon: 45.8,
        evening: 28.6,
      },
      cancellationReasons: [
        { reason: "Student conflict", count: 12, percentage: 45.2 },
        { reason: "Teacher unavailable", count: 8, percentage: 30.1 },
        { reason: "Technical issues", count: 4, percentage: 15.1 },
        { reason: "Other", count: 3, percentage: 9.6 },
      ],
    };

    return res.status(200).json({
      success: true,
      data: lessonAnalytics,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getEngagementAnalytics = async (req: Request, res: Response) => {
  try {
    const engagementData = {
      dailyActiveUsers: 234,
      weeklyActiveUsers: 567,
      monthlyActiveUsers: 890,
      avgSessionDuration: 45,
      pageViews: {
        total: 12456,
        unique: 8790,
        bounceRate: 23.4,
      },
      features: {
        mostUsed: [
          { feature: "Lesson Booking", usage: 95.6 },
          { feature: "Messaging", usage: 78.3 },
          { feature: "Review System", usage: 67.8 },
          { feature: "Calendar", usage: 56.7 },
        ],
      },
      userJourney: {
        registration: 100,
        profileComplete: 78.5,
        firstLesson: 65.2,
        secondLesson: 54.8,
        subscription: 23.4,
      },
    };

    return res.status(200).json({
      success: true,
      data: engagementData,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
