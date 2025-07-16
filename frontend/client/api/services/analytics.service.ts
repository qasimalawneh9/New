import { BaseApiService } from "../base.service";

export interface PlatformMetrics {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalTeachers: number;
    totalLessons: number;
    totalRevenue: number;
    totalConversations: number;
    avgSessionTime: number;
    userGrowthRate: number;
  };
  userMetrics: {
    registrationsByPeriod: Array<{
      date: string;
      students: number;
      teachers: number;
    }>;
    activeUsersByPeriod: Array<{ date: string; count: number }>;
    userRetention: Array<{ cohort: string; period: number; retention: number }>;
    geographicDistribution: Array<{
      country: string;
      users: number;
      percentage: number;
    }>;
    deviceBreakdown: Array<{
      device: string;
      count: number;
      percentage: number;
    }>;
    ageDistribution: Array<{
      range: string;
      count: number;
      percentage: number;
    }>;
  };
  lessonMetrics: {
    lessonsByPeriod: Array<{
      date: string;
      total: number;
      completed: number;
      cancelled: number;
    }>;
    lessonDuration: Array<{ duration: string; count: number }>;
    popularLanguages: Array<{
      language: string;
      lessons: number;
      revenue: number;
    }>;
    teacherPerformance: Array<{
      teacherId: number;
      name: string;
      rating: number;
      lessons: number;
      revenue: number;
    }>;
    lessonCompletionRate: number;
    averageRating: number;
    peakHours: Array<{ hour: number; count: number }>;
  };
  financialMetrics: {
    revenueByPeriod: Array<{
      date: string;
      gross: number;
      net: number;
      fees: number;
    }>;
    payoutsByPeriod: Array<{ date: string; amount: number; count: number }>;
    revenueByLanguage: Array<{
      language: string;
      revenue: number;
      percentage: number;
    }>;
    averageTransactionValue: number;
    monthlyRecurringRevenue: number;
    churnRate: number;
    refundRate: number;
  };
  engagementMetrics: {
    messagesByPeriod: Array<{ date: string; count: number }>;
    sessionsByPeriod: Array<{
      date: string;
      count: number;
      avgDuration: number;
    }>;
    featureUsage: Array<{ feature: string; usage: number; percentage: number }>;
    conversionFunnels: Array<{
      stage: string;
      users: number;
      conversionRate: number;
    }>;
    supportTickets: Array<{
      date: string;
      created: number;
      resolved: number;
      satisfaction: number;
    }>;
  };
}

export interface UserAnalytics {
  userId: number;
  profile: {
    name: string;
    email: string;
    type: "student" | "teacher";
    joinDate: string;
    status: string;
    avatar?: string;
  };
  activity: {
    totalSessions: number;
    avgSessionDuration: number;
    lastActiveDate: string;
    totalLessons: number;
    messagesExchanged: number;
    loginStreak: number;
  };
  engagement: {
    weeklyActivity: Array<{ week: string; sessions: number; duration: number }>;
    featureUsage: Array<{ feature: string; count: number }>;
    satisfactionScore: number;
    supportInteractions: number;
  };
  financial: {
    totalSpent?: number;
    totalEarned?: number;
    avgTransactionValue?: number;
    paymentMethods: Array<{ method: string; usage: number }>;
  };
}

export interface AnalyticsFilters {
  dateRange: {
    start: string;
    end: string;
  };
  granularity: "hour" | "day" | "week" | "month" | "year";
  userType?: "student" | "teacher" | "all";
  language?: string;
  country?: string;
  teacherId?: number;
}

export interface ExportOptions {
  format: "csv" | "xlsx" | "pdf";
  metrics: string[];
  filters: AnalyticsFilters;
  includeCharts: boolean;
}

class AnalyticsService extends BaseApiService {
  // Platform Overview Analytics
  async getPlatformMetrics(
    filters?: AnalyticsFilters,
  ): Promise<PlatformMetrics> {
    try {
      const params = filters ? new URLSearchParams(filters as any) : "";
      const response = await this.get(`/analytics/platform?${params}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch platform metrics:", error);
      return this.getMockPlatformMetrics();
    }
  }

  async getRealtimeMetrics(): Promise<{
    activeUsers: number;
    ongoingLessons: number;
    activeConversations: number;
    recentRegistrations: number;
    systemLoad: number;
  }> {
    try {
      const response = await this.get("/analytics/realtime");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch realtime metrics:", error);
      return {
        activeUsers: 127,
        ongoingLessons: 23,
        activeConversations: 45,
        recentRegistrations: 8,
        systemLoad: 0.67,
      };
    }
  }

  // User Analytics
  async getUserAnalytics(userId: number): Promise<UserAnalytics> {
    try {
      const response = await this.get(`/analytics/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user analytics:", error);
      throw error;
    }
  }

  async getUserCohortAnalysis(filters: AnalyticsFilters): Promise<
    Array<{
      cohort: string;
      size: number;
      retention: Array<{ period: number; users: number; rate: number }>;
    }>
  > {
    try {
      const params = new URLSearchParams(filters as any);
      const response = await this.get(`/analytics/cohorts?${params}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch cohort analysis:", error);
      return [];
    }
  }

  // Teacher Analytics
  async getTeacherAnalytics(filters?: AnalyticsFilters): Promise<{
    topPerformers: Array<{
      id: number;
      name: string;
      rating: number;
      revenue: number;
      lessons: number;
    }>;
    languageDistribution: Array<{
      language: string;
      teachers: number;
      avgRating: number;
    }>;
    availabilityTrends: Array<{
      date: string;
      avgHours: number;
      utilization: number;
    }>;
    earnings: Array<{
      date: string;
      totalEarnings: number;
      avgPerLesson: number;
    }>;
  }> {
    try {
      const params = filters ? new URLSearchParams(filters as any) : "";
      const response = await this.get(`/analytics/teachers?${params}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch teacher analytics:", error);
      return this.getMockTeacherAnalytics();
    }
  }

  // Financial Analytics
  async getFinancialAnalytics(filters?: AnalyticsFilters): Promise<{
    revenue: Array<{ date: string; amount: number; transactions: number }>;
    payouts: Array<{ date: string; amount: number; count: number }>;
    fees: Array<{
      date: string;
      platform: number;
      payment: number;
      total: number;
    }>;
    forecasting: Array<{ date: string; predicted: number; confidence: number }>;
    kpis: {
      mrr: number;
      arpu: number;
      ltv: number;
      churnRate: number;
      cac: number;
    };
  }> {
    try {
      const params = filters ? new URLSearchParams(filters as any) : "";
      const response = await this.get(`/analytics/financial?${params}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch financial analytics:", error);
      return this.getMockFinancialAnalytics();
    }
  }

  // Content & Lesson Analytics
  async getContentAnalytics(filters?: AnalyticsFilters): Promise<{
    lessonMetrics: Array<{
      date: string;
      scheduled: number;
      completed: number;
      cancelled: number;
    }>;
    languagePopularity: Array<{
      language: string;
      lessons: number;
      growth: number;
    }>;
    lessonDurations: Array<{
      duration: string;
      count: number;
      satisfaction: number;
    }>;
    seasonalTrends: Array<{
      month: string;
      demand: number;
      priceIndex: number;
    }>;
    contentCategories: Array<{
      category: string;
      popularity: number;
      effectiveness: number;
    }>;
  }> {
    try {
      const params = filters ? new URLSearchParams(filters as any) : "";
      const response = await this.get(`/analytics/content?${params}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch content analytics:", error);
      return this.getMockContentAnalytics();
    }
  }

  // Marketing & Acquisition Analytics
  async getMarketingAnalytics(filters?: AnalyticsFilters): Promise<{
    acquisitionChannels: Array<{
      channel: string;
      users: number;
      cost: number;
      ltv: number;
    }>;
    campaignPerformance: Array<{
      campaign: string;
      impressions: number;
      clicks: number;
      conversions: number;
      roi: number;
    }>;
    conversionFunnels: Array<{ stage: string; users: number; rate: number }>;
    referralMetrics: {
      totalReferrals: number;
      conversionRate: number;
      topReferrers: Array<{ user: string; referrals: number }>;
    };
  }> {
    try {
      const params = filters ? new URLSearchParams(filters as any) : "";
      const response = await this.get(`/analytics/marketing?${params}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch marketing analytics:", error);
      return this.getMockMarketingAnalytics();
    }
  }

  // Predictive Analytics
  async getPredictiveAnalytics(
    type: "revenue" | "users" | "churn" | "demand",
    period: "week" | "month" | "quarter",
  ): Promise<{
    predictions: Array<{ date: string; value: number; confidence: number }>;
    factors: Array<{
      factor: string;
      impact: number;
      trend: "up" | "down" | "stable";
    }>;
    recommendations: Array<{
      action: string;
      impact: string;
      priority: "high" | "medium" | "low";
    }>;
  }> {
    try {
      const response = await this.get(
        `/analytics/predictive?type=${type}&period=${period}`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch predictive analytics:", error);
      return this.getMockPredictiveAnalytics();
    }
  }

  // Custom Reports
  async createCustomReport(config: {
    name: string;
    metrics: string[];
    filters: AnalyticsFilters;
    visualization: "table" | "chart" | "dashboard";
    schedule?: "daily" | "weekly" | "monthly";
  }): Promise<{ reportId: string; url: string }> {
    try {
      const response = await this.post("/analytics/reports", config);
      return response.data;
    } catch (error) {
      console.error("Failed to create custom report:", error);
      throw error;
    }
  }

  async getCustomReports(): Promise<
    Array<{
      id: string;
      name: string;
      createdAt: string;
      lastRun: string;
      schedule: string;
      status: "active" | "paused" | "error";
    }>
  > {
    try {
      const response = await this.get("/analytics/reports");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch custom reports:", error);
      return [];
    }
  }

  // Data Export
  async exportData(
    options: ExportOptions,
  ): Promise<{ downloadUrl: string; expiresAt: string }> {
    try {
      const response = await this.post("/analytics/export", options);
      return response.data;
    } catch (error) {
      console.error("Failed to export data:", error);
      throw error;
    }
  }

  // A/B Testing Analytics
  async getABTestResults(testId?: string): Promise<
    Array<{
      id: string;
      name: string;
      status: "running" | "completed" | "paused";
      startDate: string;
      endDate?: string;
      participants: number;
      variants: Array<{
        name: string;
        participants: number;
        conversionRate: number;
        significance: number;
      }>;
      winner?: string;
    }>
  > {
    try {
      const endpoint = testId
        ? `/analytics/ab-tests/${testId}`
        : "/analytics/ab-tests";
      const response = await this.get(endpoint);
      return testId ? [response.data] : response.data;
    } catch (error) {
      console.error("Failed to fetch A/B test results:", error);
      return [];
    }
  }

  // Mock Data Methods (fallbacks)
  private getMockPlatformMetrics(): PlatformMetrics {
    return {
      overview: {
        totalUsers: 15847,
        activeUsers: 8932,
        totalTeachers: 1247,
        totalLessons: 45612,
        totalRevenue: 892340,
        totalConversations: 23847,
        avgSessionTime: 42.5,
        userGrowthRate: 12.8,
      },
      userMetrics: {
        registrationsByPeriod: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
          students: Math.floor(Math.random() * 50) + 10,
          teachers: Math.floor(Math.random() * 10) + 1,
        })).reverse(),
        activeUsersByPeriod: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
          count: Math.floor(Math.random() * 200) + 100,
        })).reverse(),
        userRetention: [
          { cohort: "2024-01", period: 1, retention: 0.85 },
          { cohort: "2024-01", period: 2, retention: 0.72 },
          { cohort: "2024-01", period: 3, retention: 0.68 },
          { cohort: "2024-02", period: 1, retention: 0.88 },
          { cohort: "2024-02", period: 2, retention: 0.75 },
        ],
        geographicDistribution: [
          { country: "United States", users: 4236, percentage: 26.7 },
          { country: "United Kingdom", users: 2847, percentage: 18.0 },
          { country: "Canada", users: 1923, percentage: 12.1 },
          { country: "Australia", users: 1456, percentage: 9.2 },
          { country: "Germany", users: 1284, percentage: 8.1 },
        ],
        deviceBreakdown: [
          { device: "Desktop", count: 9238, percentage: 58.3 },
          { device: "Mobile", count: 5429, percentage: 34.2 },
          { device: "Tablet", count: 1180, percentage: 7.4 },
        ],
        ageDistribution: [
          { range: "18-24", count: 3169, percentage: 20.0 },
          { range: "25-34", count: 4754, percentage: 30.0 },
          { range: "35-44", count: 3954, percentage: 24.9 },
          { range: "45-54", count: 2378, percentage: 15.0 },
          { range: "55+", count: 1592, percentage: 10.0 },
        ],
      },
      lessonMetrics: {
        lessonsByPeriod: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
          total: Math.floor(Math.random() * 100) + 50,
          completed: Math.floor(Math.random() * 80) + 40,
          cancelled: Math.floor(Math.random() * 10) + 2,
        })).reverse(),
        lessonDuration: [
          { duration: "30 min", count: 18472 },
          { duration: "60 min", count: 23847 },
          { duration: "90 min", count: 3293 },
        ],
        popularLanguages: [
          { language: "English", lessons: 15678, revenue: 234567 },
          { language: "Spanish", lessons: 12843, revenue: 192645 },
          { language: "French", lessons: 9234, revenue: 138510 },
          { language: "German", lessons: 7623, revenue: 114345 },
          { language: "Italian", lessons: 5432, revenue: 81480 },
        ],
        teacherPerformance: [
          {
            teacherId: 1,
            name: "Emma Wilson",
            rating: 4.9,
            lessons: 324,
            revenue: 9720,
          },
          {
            teacherId: 2,
            name: "Carlos Rodriguez",
            rating: 4.8,
            lessons: 298,
            revenue: 8940,
          },
          {
            teacherId: 3,
            name: "Sophie Dubois",
            rating: 4.7,
            lessons: 276,
            revenue: 8280,
          },
          {
            teacherId: 4,
            name: "Marco Rossi",
            rating: 4.8,
            lessons: 265,
            revenue: 7950,
          },
          {
            teacherId: 5,
            name: "Hans Mueller",
            rating: 4.6,
            lessons: 243,
            revenue: 7290,
          },
        ],
        lessonCompletionRate: 0.847,
        averageRating: 4.7,
        peakHours: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          count:
            Math.floor(Math.random() * 100) + (i >= 8 && i <= 22 ? 50 : 10),
        })),
      },
      financialMetrics: {
        revenueByPeriod: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
          gross: Math.floor(Math.random() * 5000) + 2000,
          net: Math.floor(Math.random() * 4000) + 1600,
          fees: Math.floor(Math.random() * 500) + 200,
        })).reverse(),
        payoutsByPeriod: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
          amount: Math.floor(Math.random() * 3000) + 1000,
          count: Math.floor(Math.random() * 50) + 20,
        })).reverse(),
        revenueByLanguage: [
          { language: "English", revenue: 234567, percentage: 26.3 },
          { language: "Spanish", revenue: 192645, percentage: 21.6 },
          { language: "French", revenue: 138510, percentage: 15.5 },
          { language: "German", revenue: 114345, percentage: 12.8 },
          { language: "Italian", revenue: 81480, percentage: 9.1 },
        ],
        averageTransactionValue: 67.5,
        monthlyRecurringRevenue: 45780,
        churnRate: 0.078,
        refundRate: 0.023,
      },
      engagementMetrics: {
        messagesByPeriod: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
          count: Math.floor(Math.random() * 300) + 100,
        })).reverse(),
        sessionsByPeriod: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
          count: Math.floor(Math.random() * 150) + 75,
          avgDuration: Math.floor(Math.random() * 30) + 20,
        })).reverse(),
        featureUsage: [
          { feature: "Video Lessons", usage: 12847, percentage: 81.2 },
          { feature: "Messaging", usage: 9234, percentage: 58.3 },
          { feature: "Scheduling", usage: 7623, percentage: 48.1 },
          { feature: "File Sharing", usage: 5432, percentage: 34.3 },
          { feature: "Group Lessons", usage: 3456, percentage: 21.8 },
        ],
        conversionFunnels: [
          { stage: "Visitor", users: 25847, conversionRate: 1.0 },
          { stage: "Sign Up", users: 15847, conversionRate: 0.613 },
          { stage: "Profile Complete", users: 12678, conversionRate: 0.8 },
          { stage: "First Lesson Booked", users: 8932, conversionRate: 0.704 },
          { stage: "Lesson Completed", users: 7568, conversionRate: 0.847 },
        ],
        supportTickets: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
          created: Math.floor(Math.random() * 20) + 5,
          resolved: Math.floor(Math.random() * 18) + 4,
          satisfaction: Math.random() * 2 + 3,
        })).reverse(),
      },
    };
  }

  private getMockTeacherAnalytics() {
    return {
      topPerformers: [
        {
          id: 1,
          name: "Emma Wilson",
          rating: 4.9,
          revenue: 9720,
          lessons: 324,
        },
        {
          id: 2,
          name: "Carlos Rodriguez",
          rating: 4.8,
          revenue: 8940,
          lessons: 298,
        },
        {
          id: 3,
          name: "Sophie Dubois",
          rating: 4.7,
          revenue: 8280,
          lessons: 276,
        },
      ],
      languageDistribution: [
        { language: "English", teachers: 324, avgRating: 4.7 },
        { language: "Spanish", teachers: 298, avgRating: 4.6 },
        { language: "French", teachers: 276, avgRating: 4.8 },
      ],
      availabilityTrends: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
        avgHours: Math.random() * 4 + 4,
        utilization: Math.random() * 0.3 + 0.6,
      })).reverse(),
      earnings: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
        totalEarnings: Math.floor(Math.random() * 2000) + 1000,
        avgPerLesson: Math.floor(Math.random() * 20) + 25,
      })).reverse(),
    };
  }

  private getMockFinancialAnalytics() {
    return {
      revenue: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
        amount: Math.floor(Math.random() * 5000) + 2000,
        transactions: Math.floor(Math.random() * 100) + 50,
      })).reverse(),
      payouts: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
        amount: Math.floor(Math.random() * 3000) + 1000,
        count: Math.floor(Math.random() * 50) + 20,
      })).reverse(),
      fees: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
        platform: Math.floor(Math.random() * 200) + 100,
        payment: Math.floor(Math.random() * 100) + 50,
        total: Math.floor(Math.random() * 300) + 150,
      })).reverse(),
      forecasting: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() + i * 86400000).toISOString().split("T")[0],
        predicted: Math.floor(Math.random() * 5000) + 2500,
        confidence: Math.random() * 0.3 + 0.7,
      })),
      kpis: {
        mrr: 45780,
        arpu: 67.5,
        ltv: 892.4,
        churnRate: 0.078,
        cac: 23.45,
      },
    };
  }

  private getMockContentAnalytics() {
    return {
      lessonMetrics: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
        scheduled: Math.floor(Math.random() * 100) + 50,
        completed: Math.floor(Math.random() * 80) + 40,
        cancelled: Math.floor(Math.random() * 10) + 2,
      })).reverse(),
      languagePopularity: [
        { language: "English", lessons: 15678, growth: 12.3 },
        { language: "Spanish", lessons: 12843, growth: 8.7 },
        { language: "French", lessons: 9234, growth: 15.2 },
      ],
      lessonDurations: [
        { duration: "30 min", count: 18472, satisfaction: 4.6 },
        { duration: "60 min", count: 23847, satisfaction: 4.8 },
        { duration: "90 min", count: 3293, satisfaction: 4.7 },
      ],
      seasonalTrends: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toLocaleDateString("en-US", {
          month: "short",
        }),
        demand: Math.floor(Math.random() * 50) + 75,
        priceIndex: Math.random() * 20 + 90,
      })),
      contentCategories: [
        { category: "Conversation", popularity: 85, effectiveness: 4.7 },
        { category: "Grammar", popularity: 72, effectiveness: 4.5 },
        { category: "Business", popularity: 68, effectiveness: 4.8 },
        { category: "Exam Prep", popularity: 56, effectiveness: 4.6 },
      ],
    };
  }

  private getMockMarketingAnalytics() {
    return {
      acquisitionChannels: [
        { channel: "Organic Search", users: 6847, cost: 0, ltv: 245.6 },
        { channel: "Social Media", users: 4523, cost: 12350, ltv: 198.4 },
        { channel: "Referral", users: 2847, cost: 0, ltv: 312.8 },
        { channel: "Paid Search", users: 1630, cost: 8920, ltv: 187.2 },
      ],
      campaignPerformance: [
        {
          campaign: "Spring Language Learning",
          impressions: 125000,
          clicks: 3250,
          conversions: 289,
          roi: 2.3,
        },
        {
          campaign: "Professional Development",
          impressions: 89000,
          clicks: 2180,
          conversions: 156,
          roi: 1.8,
        },
        {
          campaign: "Student Discount",
          impressions: 67000,
          clicks: 1890,
          conversions: 234,
          roi: 3.1,
        },
      ],
      conversionFunnels: [
        { stage: "Awareness", users: 25847, rate: 1.0 },
        { stage: "Interest", users: 15847, rate: 0.613 },
        { stage: "Consideration", users: 12678, rate: 0.8 },
        { stage: "Purchase", users: 8932, rate: 0.704 },
      ],
      referralMetrics: {
        totalReferrals: 2847,
        conversionRate: 0.68,
        topReferrers: [
          { user: "Emma Wilson", referrals: 23 },
          { user: "John Smith", referrals: 18 },
          { user: "Sarah Chen", referrals: 15 },
        ],
      },
    };
  }

  private getMockPredictiveAnalytics() {
    return {
      predictions: Array.from({ length: 12 }, (_, i) => ({
        date: new Date(Date.now() + i * 7 * 86400000)
          .toISOString()
          .split("T")[0],
        value: Math.floor(Math.random() * 1000) + 500,
        confidence: Math.random() * 0.3 + 0.7,
      })),
      factors: [
        { factor: "Seasonal Demand", impact: 0.25, trend: "up" as const },
        { factor: "Marketing Spend", impact: 0.18, trend: "stable" as const },
        {
          factor: "Teacher Availability",
          impact: 0.15,
          trend: "down" as const,
        },
        {
          factor: "Economic Conditions",
          impact: 0.12,
          trend: "stable" as const,
        },
      ],
      recommendations: [
        {
          action: "Increase marketing spend for Q2",
          impact: "Potential 15% revenue increase",
          priority: "high" as const,
        },
        {
          action: "Recruit more teachers for popular languages",
          impact: "Reduce wait times by 20%",
          priority: "high" as const,
        },
        {
          action: "Launch retention campaign",
          impact: "Reduce churn by 8%",
          priority: "medium" as const,
        },
      ],
    };
  }
}

export const analyticsService = new AnalyticsService();
