import { db } from "./database";

export interface PlatformSettings {
  commissionRate: number;
  taxRate: number;
  minimumPayoutAmount: { paypal: number; bank: number };
  autoCompletionHours: number;
  rescheduleTimeLimit: number;
  teacherSuspensionThreshold: number;
  studentRefundPolicy: {
    teacherAbsence: "full_refund" | "credit" | "reschedule";
    studentAbsence: "no_refund" | "partial_refund" | "credit";
  };
  platformFeatures: {
    twoFactorAuth: boolean;
    contentReporting: boolean;
    videoRecording: boolean;
    aiAssistant: boolean;
    communityFeatures: boolean;
    groupLessons: boolean;
  };
  emailNotifications: {
    lessonReminders: boolean;
    paymentConfirmations: boolean;
    teacherApplications: boolean;
    systemUpdates: boolean;
  };
  supportResponseTimes: {
    booking_issues: number;
    payment_problems: number;
    technical_bugs: number;
    inappropriate_behavior: number;
  };
}

export interface ContentSettings {
  availableLanguages: string[];
  proficiencyLevels: string[];
  lessonCategories: string[];
  maxLessonDuration: number;
  minLessonDuration: number;
  allowedFileTypes: string[];
  maxFileSize: number;
  contentModerationRules: {
    autoModeration: boolean;
    bannedWords: string[];
    requireApproval: boolean;
  };
}

export interface SystemHealth {
  serverStatus: "healthy" | "warning" | "critical";
  databaseStatus: "connected" | "disconnected" | "slow";
  activeUsers: number;
  activeLessons: number;
  systemLoad: number;
  memoryUsage: number;
  diskSpace: number;
  lastBackup: string;
  uptime: string;
}

export class AdminService {
  private static instance: AdminService;

  private platformSettings: PlatformSettings = {
    commissionRate: 0.2,
    taxRate: 0.07,
    minimumPayoutAmount: { paypal: 10, bank: 100 },
    autoCompletionHours: 48,
    rescheduleTimeLimit: 24,
    teacherSuspensionThreshold: 3,
    studentRefundPolicy: {
      teacherAbsence: "full_refund",
      studentAbsence: "no_refund",
    },
    platformFeatures: {
      twoFactorAuth: true,
      contentReporting: true,
      videoRecording: true,
      aiAssistant: false,
      communityFeatures: true,
      groupLessons: false,
    },
    emailNotifications: {
      lessonReminders: true,
      paymentConfirmations: true,
      teacherApplications: true,
      systemUpdates: true,
    },
    supportResponseTimes: {
      booking_issues: 4,
      payment_problems: 2,
      technical_bugs: 6,
      inappropriate_behavior: 1,
    },
  };

  private contentSettings: ContentSettings = {
    availableLanguages: [
      "English",
      "Spanish",
      "French",
      "German",
      "Italian",
      "Portuguese",
      "Chinese",
      "Japanese",
      "Korean",
      "Arabic",
      "Russian",
      "Dutch",
    ],
    proficiencyLevels: [
      "Beginner",
      "Elementary",
      "Intermediate",
      "Upper-Intermediate",
      "Advanced",
      "Proficient",
    ],
    lessonCategories: [
      "Conversation Practice",
      "Grammar Focus",
      "Vocabulary Building",
      "Pronunciation Training",
      "Business Language",
      "Test Preparation",
      "Academic Writing",
      "Cultural Exchange",
      "Literature Discussion",
    ],
    maxLessonDuration: 120,
    minLessonDuration: 30,
    allowedFileTypes: [
      "pdf",
      "doc",
      "docx",
      "ppt",
      "pptx",
      "mp3",
      "mp4",
      "jpg",
      "png",
    ],
    maxFileSize: 50, // MB
    contentModerationRules: {
      autoModeration: true,
      bannedWords: ["spam", "inappropriate", "offensive"],
      requireApproval: false,
    },
  };

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  // Platform Settings Management
  getPlatformSettings(): PlatformSettings {
    const stored = localStorage.getItem("talkcon_platform_settings");
    if (stored) {
      return { ...this.platformSettings, ...JSON.parse(stored) };
    }
    return this.platformSettings;
  }

  updatePlatformSettings(settings: Partial<PlatformSettings>): boolean {
    try {
      const currentSettings = this.getPlatformSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      localStorage.setItem(
        "talkcon_platform_settings",
        JSON.stringify(updatedSettings),
      );
      this.platformSettings = updatedSettings;
      return true;
    } catch (error) {
      console.error("Failed to update platform settings:", error);
      return false;
    }
  }

  // Content Management
  getContentSettings(): ContentSettings {
    const stored = localStorage.getItem("talkcon_content_settings");
    if (stored) {
      return { ...this.contentSettings, ...JSON.parse(stored) };
    }
    return this.contentSettings;
  }

  updateContentSettings(settings: Partial<ContentSettings>): boolean {
    try {
      const currentSettings = this.getContentSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      localStorage.setItem(
        "talkcon_content_settings",
        JSON.stringify(updatedSettings),
      );
      this.contentSettings = updatedSettings;
      return true;
    } catch (error) {
      console.error("Failed to update content settings:", error);
      return false;
    }
  }

  // System Health Monitoring
  getSystemHealth(): SystemHealth {
    return {
      serverStatus: "healthy",
      databaseStatus: "connected",
      activeUsers: Math.floor(Math.random() * 500) + 100,
      activeLessons: Math.floor(Math.random() * 50) + 10,
      systemLoad: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      diskSpace: 75 + Math.random() * 20,
      lastBackup: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      uptime: `${Math.floor(Math.random() * 30) + 1} days`,
    };
  }

  // Analytics and Reporting
  generateAnalyticsReport(startDate: string, endDate: string) {
    const lessons = db.getLessons({});
    const users = db.getUsers({});
    const teachers = db.getTeachers({});

    const filteredLessons = lessons.filter((lesson) => {
      const lessonDate = new Date(lesson.createdAt);
      return (
        lessonDate >= new Date(startDate) && lessonDate <= new Date(endDate)
      );
    });

    return {
      period: { startDate, endDate },
      totalRevenue:
        filteredLessons.length * 50 * this.platformSettings.commissionRate,
      totalLessons: filteredLessons.length,
      newUsers: users.filter((user) => {
        const userDate = new Date(user.createdAt);
        return userDate >= new Date(startDate) && userDate <= new Date(endDate);
      }).length,
      newTeachers: teachers.filter((teacher) => {
        const teacherDate = new Date(teacher.createdAt);
        return (
          teacherDate >= new Date(startDate) && teacherDate <= new Date(endDate)
        );
      }).length,
      popularLanguages: this.getPopularLanguages(filteredLessons),
      peakHours: this.getPeakHours(filteredLessons),
      conversionRate: Math.random() * 10 + 5,
      retentionRate: Math.random() * 20 + 70,
    };
  }

  private getPopularLanguages(lessons: any[]) {
    const languageCounts: { [key: string]: number } = {};
    lessons.forEach((lesson) => {
      const lang = lesson.language || "English";
      languageCounts[lang] = (languageCounts[lang] || 0) + 1;
    });
    return Object.entries(languageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([language, count]) => ({ language, count }));
  }

  private getPeakHours(lessons: any[]) {
    const hourCounts: { [key: number]: number } = {};
    lessons.forEach((lesson) => {
      const hour = new Date(lesson.startTime || Date.now()).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    return Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }));
  }

  // Content Moderation
  getReportedContent() {
    return [
      {
        id: "1",
        type: "lesson_content",
        reportedBy: "student123",
        targetUser: "teacher456",
        reason: "inappropriate_content",
        description: "Used inappropriate language during lesson",
        timestamp: new Date().toISOString(),
        status: "pending",
        severity: "medium",
      },
      {
        id: "2",
        type: "community_post",
        reportedBy: "user789",
        targetUser: "poster012",
        reason: "spam",
        description: "Posted promotional content repeatedly",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: "under_review",
        severity: "low",
      },
    ];
  }

  moderateContent(
    contentId: string,
    action: "approve" | "remove" | "warn",
  ): boolean {
    // Implementation would handle content moderation
    console.log(`Content ${contentId} ${action}d`);
    return true;
  }

  // Database Management
  performDatabaseBackup(): boolean {
    try {
      const data = {
        users: db.getUsers({}),
        teachers: db.getTeachers({}),
        lessons: db.getLessons({}),
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(
        `talkcon_backup_${Date.now()}`,
        JSON.stringify(data),
      );
      return true;
    } catch (error) {
      console.error("Backup failed:", error);
      return false;
    }
  }

  getBackupHistory() {
    const backups = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("talkcon_backup_")) {
        const timestamp = key.replace("talkcon_backup_", "");
        backups.push({
          id: key,
          timestamp: new Date(parseInt(timestamp)).toISOString(),
          size: new Blob([localStorage.getItem(key) || ""]).size,
        });
      }
    }
    return backups.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }

  // Feature Toggles
  toggleFeature(feature: keyof PlatformSettings["platformFeatures"]): boolean {
    const settings = this.getPlatformSettings();
    settings.platformFeatures[feature] = !settings.platformFeatures[feature];
    return this.updatePlatformSettings(settings);
  }

  // Audit Logs
  getAuditLogs() {
    return [
      {
        id: "1",
        timestamp: new Date().toISOString(),
        adminUser: "admin@talkcon.com",
        action: "user_suspended",
        target: "user123",
        details: "Suspended for policy violation",
        ipAddress: "192.168.1.1",
      },
      {
        id: "2",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        adminUser: "admin@talkcon.com",
        action: "settings_updated",
        target: "commission_rate",
        details: "Changed from 15% to 20%",
        ipAddress: "192.168.1.1",
      },
    ];
  }
}

export const adminService = AdminService.getInstance();
