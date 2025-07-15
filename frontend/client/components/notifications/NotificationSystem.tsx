import React, { useState, useEffect } from "react";
import {
  Bell,
  Check,
  X,
  Calendar,
  MessageCircle,
  DollarSign,
  User,
  BookOpen,
  Award,
  AlertCircle,
  Info,
  CheckCircle,
  Settings,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { db } from "@/lib/database";

interface Notification {
  id: string;
  userId: string;
  type: "lesson" | "message" | "payment" | "profile" | "system" | "achievement";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: {
    actionUrl?: string;
    teacherId?: string;
    studentId?: string;
    lessonId?: string;
    amount?: number;
  };
}

interface NotificationSystemProps {
  className?: string;
}

const notificationIcons = {
  lesson: Calendar,
  message: MessageCircle,
  payment: DollarSign,
  profile: User,
  system: AlertCircle,
  achievement: Award,
};

const notificationColors = {
  lesson: "text-blue-600 bg-blue-100",
  message: "text-green-600 bg-green-100",
  payment: "text-purple-600 bg-purple-100",
  profile: "text-orange-600 bg-orange-100",
  system: "text-red-600 bg-red-100",
  achievement: "text-yellow-600 bg-yellow-100",
};

export function NotificationSystem({ className }: NotificationSystemProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    lessonReminders: true,
    messageNotifications: true,
    paymentUpdates: true,
    achievementNotifications: true,
  });

  useEffect(() => {
    if (!user?.id) return;

    // Load notifications
    const loadNotifications = () => {
      const userNotifications = db.getUserNotifications(user.id);
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter((n) => !n.read).length);
    };

    loadNotifications();

    // Simulate real-time updates
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.id]);

  // Generate sample notifications for demo
  useEffect(() => {
    if (!user?.id || notifications.length > 0) return;

    const sampleNotifications = [
      {
        type: "lesson",
        title: "Upcoming Lesson Reminder",
        message: "Your Spanish lesson with Maria starts in 30 minutes",
        metadata: { teacherId: "teacher-1", lessonId: "lesson-1" },
      },
      {
        type: "message",
        title: "New Message",
        message: "John sent you a message about tomorrow's lesson",
        metadata: { studentId: "student-1" },
      },
      {
        type: "payment",
        title: "Payment Successful",
        message: "Your lesson payment of $25.00 was processed",
        metadata: { amount: 25 },
      },
      {
        type: "achievement",
        title: "New Achievement Unlocked!",
        message: "Congratulations! You've completed 10 lessons",
      },
      {
        type: "system",
        title: "Profile Update Required",
        message: "Please update your profile information",
      },
    ].map((notif, index) => ({
      id: `demo-${index}`,
      userId: user.id,
      ...notif,
      read: index > 2,
      createdAt: new Date(Date.now() - index * 3600000).toISOString(),
    }));

    sampleNotifications.forEach((notif) => {
      db.createNotification(
        notif.userId,
        notif.type,
        notif.title,
        notif.message,
        notif.metadata,
      );
    });
  }, [user?.id, notifications.length]);

  const markAsRead = (notificationId: string) => {
    db.markNotificationAsRead(notificationId);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    notifications
      .filter((n) => !n.read)
      .forEach((n) => {
        db.markNotificationAsRead(n.id);
      });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (notificationId: string) => {
    // In real app, this would delete from database
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return time.toLocaleDateString();
  };

  const NotificationItem = ({
    notification,
  }: {
    notification: Notification;
  }) => {
    const IconComponent = notificationIcons[notification.type] || Info;
    const colorClass =
      notificationColors[notification.type] || "text-gray-600 bg-gray-100";

    return (
      <div
        className={cn(
          "flex items-start gap-3 p-4 border-b hover:bg-accent/50 transition-colors",
          !notification.read && "bg-blue-50/50 border-l-4 border-l-blue-500",
        )}
      >
        <div className={cn("p-2 rounded-full flex-shrink-0", colorClass)}>
          <IconComponent className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4
                className={cn(
                  "text-sm font-medium",
                  !notification.read && "font-semibold",
                )}
              >
                {notification.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {notification.message}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {getRelativeTime(notification.createdAt)}
              </p>
            </div>
            <div className="flex gap-1">
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => markAsRead(notification.id)}
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Settings className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!notification.read && (
                    <DropdownMenuItem
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Mark as read
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => deleteNotification(notification.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative", className)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </SheetTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all as read
                </Button>
              )}
            </div>
            <SheetDescription>
              {notifications.length === 0
                ? "No notifications yet"
                : `${unreadCount} unread of ${notifications.length} total`}
            </SheetDescription>
          </SheetHeader>

          {/* Notification List */}
          <div className="flex-1 overflow-hidden">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Bell className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-muted-foreground text-sm">
                  You're all caught up! New notifications will appear here.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Settings Footer */}
          <div className="border-t p-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Notification Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Notifications</span>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        emailNotifications: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Push Notifications</span>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        pushNotifications: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lesson Reminders</span>
                  <Switch
                    checked={settings.lessonReminders}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        lessonReminders: checked,
                      }))
                    }
                  />
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                More Settings
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Utility function to create notifications
export const createNotification = (
  userId: string,
  type: Notification["type"],
  title: string,
  message: string,
  metadata?: Notification["metadata"],
) => {
  db.createNotification(userId, type, title, message, metadata);
};

// Hook for notification management
export const useNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const loadNotifications = () => {
      const userNotifications = db.getUserNotifications(userId);
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter((n) => !n.read).length);
    };

    loadNotifications();

    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const markAsRead = (notificationId: string) => {
    db.markNotificationAsRead(notificationId);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const createNotification = (
    type: Notification["type"],
    title: string,
    message: string,
    metadata?: Notification["metadata"],
  ) => {
    if (!userId) return;
    db.createNotification(userId, type, title, message, metadata);
    // Refresh notifications
    const userNotifications = db.getUserNotifications(userId);
    setNotifications(userNotifications);
    setUnreadCount(userNotifications.filter((n) => !n.read).length);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    createNotification,
  };
};

export default NotificationSystem;
