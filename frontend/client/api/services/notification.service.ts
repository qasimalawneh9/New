/**
 * Notification Service
 *
 * Handles all notification-related API calls
 * Maps to Node.js Express NotificationController
 */

import { BaseApiService } from "../base.service";
import { NOTIFICATION_ENDPOINTS } from "../endpoints";

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type:
    | "lesson"
    | "message"
    | "payment"
    | "profile"
    | "system"
    | "achievement"
    | "booking"
    | "review";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    actionUrl?: string;
    teacherId?: string;
    studentId?: string;
    lessonId?: string;
    bookingId?: string;
    reviewId?: string;
    amount?: number;
    priority?: "low" | "medium" | "high" | "urgent";
  };
}

export interface NotificationSettings {
  id?: string;
  userId?: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  channels: {
    lesson: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    message: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    payment: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    booking: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    system: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    achievement: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  schedule: {
    lessonReminders: boolean;
    lessonReminderTime: number; // hours before lesson
    dailyDigest: boolean;
    dailyDigestTime: string; // HH:MM format
    weeklyDigest: boolean;
    weeklyDigestDay: number; // 0-6 (Sunday-Saturday)
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
  recent: number; // last 24 hours
}

/**
 * NotificationService class
 *
 * Usage Example:
 * ```typescript
 * const notificationService = new NotificationService();
 *
 * // Get user notifications
 * const notifications = await notificationService.getNotifications();
 *
 * // Mark notification as read
 * await notificationService.markAsRead('notification-id');
 *
 * // Update notification settings
 * await notificationService.updateSettings({
 *   emailNotifications: true,
 *   pushNotifications: false
 * });
 * ```
 */
export class NotificationService extends BaseApiService {
  /**
   * Get user notifications with optional filters
   * GET /api/notifications → NotificationController@getNotifications
   */
  async getNotifications(params?: {
    type?: string;
    read?: boolean;
    page?: number;
    limit?: number;
    since?: string;
  }): Promise<{ data: Notification[]; meta: any }> {
    const response = await this.get<{
      success: boolean;
      data: Notification[];
      meta: any;
    }>(NOTIFICATION_ENDPOINTS.INDEX, params);
    return { data: response.data.data, meta: response.data.meta };
  }

  /**
   * Mark notification as read
   * POST /api/notifications/:id/read → NotificationController@markAsRead
   */
  async markAsRead(notificationId: string): Promise<{ message: string }> {
    const response = await this.post<{ success: boolean; message: string }>(
      NOTIFICATION_ENDPOINTS.MARK_READ.replace(":id", notificationId),
    );
    return { message: response.data.message };
  }

  /**
   * Mark all notifications as read
   * POST /api/notifications/read-all → NotificationController@markAllAsRead
   */
  async markAllAsRead(): Promise<{ message: string }> {
    const response = await this.post<{ success: boolean; message: string }>(
      NOTIFICATION_ENDPOINTS.MARK_ALL_READ,
    );
    return { message: response.data.message };
  }

  /**
   * Delete notification
   * DELETE /api/notifications/:id → NotificationController@deleteNotification
   */
  async deleteNotification(
    notificationId: string,
  ): Promise<{ message: string }> {
    const response = await this.delete<{ success: boolean; message: string }>(
      NOTIFICATION_ENDPOINTS.DELETE.replace(":id", notificationId),
    );
    return { message: response.data.message };
  }

  /**
   * Get notification settings
   * GET /api/notifications/settings → NotificationController@getNotificationSettings
   */
  async getSettings(): Promise<NotificationSettings> {
    const response = await this.get<{
      success: boolean;
      data: NotificationSettings;
    }>(NOTIFICATION_ENDPOINTS.SETTINGS);
    return response.data.data;
  }

  /**
   * Update notification settings
   * PUT /api/notifications/settings → NotificationController@updateNotificationSettings
   */
  async updateSettings(
    settings: Partial<NotificationSettings>,
  ): Promise<NotificationSettings> {
    const response = await this.put<{
      success: boolean;
      data: NotificationSettings;
    }>(NOTIFICATION_ENDPOINTS.UPDATE_SETTINGS, settings);
    return response.data.data;
  }

  /**
   * Send test notification
   * POST /api/notifications/test → NotificationController@sendTestNotification
   */
  async sendTestNotification(
    type: string,
    channel: "email" | "push" | "sms",
  ): Promise<{ message: string }> {
    const response = await this.post<{ success: boolean; message: string }>(
      NOTIFICATION_ENDPOINTS.TEST,
      { type, channel },
    );
    return { message: response.data.message };
  }

  /**
   * Get notification statistics
   */
  async getStats(): Promise<NotificationStats> {
    try {
      const notifications = await this.getNotifications({ limit: 1000 });
      const allNotifications = notifications.data;

      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const stats: NotificationStats = {
        total: allNotifications.length,
        unread: allNotifications.filter((n) => !n.read).length,
        recent: allNotifications.filter(
          (n) => new Date(n.createdAt) > yesterday,
        ).length,
        byType: {},
      };

      // Calculate counts by type
      allNotifications.forEach((notification) => {
        stats.byType[notification.type] =
          (stats.byType[notification.type] || 0) + 1;
      });

      return stats;
    } catch (error) {
      // Return default stats if API call fails
      return {
        total: 0,
        unread: 0,
        recent: 0,
        byType: {},
      };
    }
  }

  /**
   * Get unread notification count (for badges)
   */
  async getUnreadCount(): Promise<number> {
    try {
      const notifications = await this.getNotifications({
        read: false,
        limit: 100,
      });
      return notifications.data.length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Subscribe to browser push notifications
   */
  async subscribeToPushNotifications(): Promise<{
    message: string;
    subscription?: any;
  }> {
    try {
      // Check if browser supports push notifications
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        throw new Error("Push notifications are not supported in this browser");
      }

      // Request permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Push notification permission denied");
      }

      // Register service worker (if not already registered)
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.VITE_VAPID_PUBLIC_KEY || "your-vapid-public-key",
        ),
      });

      // Send subscription to backend
      const response = await this.post<{ success: boolean; message: string }>(
        "/notifications/subscribe-push",
        { subscription },
      );

      return {
        message: response.data.message,
        subscription,
      };
    } catch (error: any) {
      throw new Error(
        error.message || "Failed to subscribe to push notifications",
      );
    }
  }

  /**
   * Unsubscribe from browser push notifications
   */
  async unsubscribeFromPushNotifications(): Promise<{ message: string }> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        // Notify backend
        const response = await this.post<{ success: boolean; message: string }>(
          "/notifications/unsubscribe-push",
          { endpoint: subscription.endpoint },
        );

        return { message: response.data.message };
      }

      return { message: "No active subscription found" };
    } catch (error: any) {
      throw new Error(
        error.message || "Failed to unsubscribe from push notifications",
      );
    }
  }

  /**
   * Get real-time notifications using Server-Sent Events (SSE)
   */
  subscribeToRealTimeNotifications(
    onNotification: (notification: Notification) => void,
  ): EventSource | null {
    try {
      const eventSource = new EventSource(
        `${this.baseUrl}/notifications/stream`,
        {
          withCredentials: true,
        },
      );

      eventSource.onmessage = (event) => {
        try {
          const notification: Notification = JSON.parse(event.data);
          onNotification(notification);
        } catch (error) {
          console.error("Failed to parse notification:", error);
        }
      };

      eventSource.onerror = (error) => {
        console.error("Notification stream error:", error);
      };

      return eventSource;
    } catch (error) {
      console.error("Failed to subscribe to real-time notifications:", error);
      return null;
    }
  }

  /**
   * Helper method to convert VAPID public key
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Get default notification settings
   */
  getDefaultSettings(): NotificationSettings {
    return {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      channels: {
        lesson: { email: true, push: true, sms: false },
        message: { email: true, push: true, sms: false },
        payment: { email: true, push: true, sms: false },
        booking: { email: true, push: true, sms: false },
        system: { email: true, push: false, sms: false },
        achievement: { email: false, push: true, sms: false },
      },
      schedule: {
        lessonReminders: true,
        lessonReminderTime: 1, // 1 hour before
        dailyDigest: false,
        dailyDigestTime: "18:00",
        weeklyDigest: true,
        weeklyDigestDay: 0, // Sunday
      },
    };
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
