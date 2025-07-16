import React, { useState, useEffect, useCallback } from "react";
import {
  notificationService,
  Notification,
  NotificationSettings,
} from "@/api/services/notification.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
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
  MoreVertical,
  Filter,
  RefreshCw,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  MessageSquare,
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
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription } from "../ui/alert";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface NotificationCenterProps {
  className?: string;
}

const notificationIcons = {
  lesson: Calendar,
  message: MessageCircle,
  payment: DollarSign,
  profile: User,
  system: AlertCircle,
  achievement: Award,
  booking: BookOpen,
  review: CheckCircle,
};

const notificationColors = {
  lesson: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
  message: "text-green-600 bg-green-100 dark:bg-green-900/30",
  payment: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
  profile: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
  system: "text-red-600 bg-red-100 dark:bg-red-900/30",
  achievement: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
  booking: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30",
  review: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",
};

export function NotificationCenter({ className }: NotificationCenterProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterRead, setFilterRead] = useState<string>("all");

  // Real-time notification subscription
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  // Load notifications and settings
  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);

      const [notificationsData, settingsData, unreadCountData] =
        await Promise.all([
          notificationService.getNotifications({
            type: filterType !== "all" ? filterType : undefined,
            read: filterRead !== "all" ? filterRead === "read" : undefined,
            limit: 50,
          }),
          notificationService.getSettings(),
          notificationService.getUnreadCount(),
        ]);

      setNotifications(notificationsData.data);
      setSettings(settingsData);
      setUnreadCount(unreadCountData);
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to load notifications";
      setError(errorMessage);
      console.error("Notification load error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, filterType, filterRead]);

  // Setup real-time notifications
  useEffect(() => {
    if (!isAuthenticated) return;

    loadNotifications();

    // Subscribe to real-time notifications
    const source = notificationService.subscribeToRealTimeNotifications(
      (newNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Show browser notification if permission granted
        if (Notification.permission === "granted") {
          new Notification(newNotification.title, {
            body: newNotification.message,
            icon: "/favicon.ico",
            tag: newNotification.id,
          });
        }

        // Show toast notification
        toast({
          title: newNotification.title,
          description: newNotification.message,
          duration: 5000,
        });
      },
    );

    setEventSource(source);

    return () => {
      if (source) {
        source.close();
      }
    };
  }, [isAuthenticated, loadNotifications, toast]);

  // Cleanup event source on unmount
  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true })),
      );
      setUnreadCount(0);
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to mark all as read",
        variant: "destructive",
      });
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId),
      );
      toast({
        title: "Success",
        description: "Notification deleted",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  // Update notification settings
  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    try {
      const updatedSettings =
        await notificationService.updateSettings(newSettings);
      setSettings(updatedSettings);
      toast({
        title: "Success",
        description: "Notification settings updated",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  // Test notifications
  const sendTestNotification = async (
    type: string,
    channel: "email" | "push" | "sms",
  ) => {
    try {
      await notificationService.sendTestNotification(type, channel);
      toast({
        title: "Success",
        description: `Test ${channel} notification sent`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to send test notification",
        variant: "destructive",
      });
    }
  };

  // Subscribe to push notifications
  const subscribeToPush = async () => {
    try {
      await notificationService.subscribeToPushNotifications();
      toast({
        title: "Success",
        description: "Subscribed to push notifications",
      });
      loadNotifications(); // Reload to get updated settings
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.message || "Failed to subscribe to push notifications",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (filterType !== "all" && notification.type !== filterType) return false;
    if (filterRead === "read" && !notification.read) return false;
    if (filterRead === "unread" && notification.read) return false;
    return true;
  });

  return (
    <div className={className}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle>Notifications</SheetTitle>
              <div className="flex items-center gap-2">
                <Dialog open={showSettings} onOpenChange={setShowSettings}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <NotificationSettingsForm
                      settings={settings}
                      onUpdate={updateSettings}
                      onTest={sendTestNotification}
                      onSubscribePush={subscribeToPush}
                    />
                  </DialogContent>
                </Dialog>

                <Button variant="ghost" size="icon" onClick={loadNotifications}>
                  <RefreshCw
                    className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </div>

            <SheetDescription>
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            {/* Filters */}
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="lesson">Lessons</SelectItem>
                  <SelectItem value="message">Messages</SelectItem>
                  <SelectItem value="payment">Payments</SelectItem>
                  <SelectItem value="booking">Bookings</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterRead} onValueChange={setFilterRead}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            {unreadCount > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="flex-1"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
              </div>
            )}

            {/* Notifications List */}
            <ScrollArea className="h-[500px]">
              {error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-start gap-3 p-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredNotifications.length > 0 ? (
                <div className="space-y-2">
                  {filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications found</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Notification Item Component
function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const Icon = notificationIcons[notification.type] || Bell;
  const colorClass =
    notificationColors[notification.type] || notificationColors.system;

  return (
    <Card className={cn("p-3", !notification.read && "bg-muted/50")}>
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-full", colorClass)}>
          <Icon className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm mb-1">{notification.title}</h4>
          <p className="text-sm text-muted-foreground mb-2">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(notification.createdAt), "MMM d, HH:mm")}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!notification.read && (
              <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
                <Check className="h-4 w-4 mr-2" />
                Mark as Read
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onDelete(notification.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}

// Notification Settings Form Component
function NotificationSettingsForm({
  settings,
  onUpdate,
  onTest,
  onSubscribePush,
}: {
  settings: NotificationSettings | null;
  onUpdate: (settings: Partial<NotificationSettings>) => void;
  onTest: (type: string, channel: "email" | "push" | "sms") => void;
  onSubscribePush: () => void;
}) {
  if (!settings) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>Notification Settings</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {/* General Settings */}
        <div className="space-y-3">
          <h3 className="font-medium">General Settings</h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="text-sm">Email Notifications</span>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                onUpdate({ emailNotifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span className="text-sm">Push Notifications</span>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) =>
                onUpdate({ pushNotifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">SMS Notifications</span>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked) =>
                onUpdate({ smsNotifications: checked })
              }
            />
          </div>
        </div>

        <Separator />

        {/* Channel-specific Settings */}
        <div className="space-y-3">
          <h3 className="font-medium">Notification Types</h3>

          {Object.entries(settings.channels).map(([type, channels]) => (
            <div key={type} className="space-y-2">
              <h4 className="text-sm font-medium capitalize">
                {type.replace("_", " ")}
              </h4>
              <div className="pl-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Email</span>
                  <Switch
                    checked={channels.email}
                    onCheckedChange={(checked) =>
                      onUpdate({
                        channels: {
                          ...settings.channels,
                          [type]: { ...channels, email: checked },
                        },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Push</span>
                  <Switch
                    checked={channels.push}
                    onCheckedChange={(checked) =>
                      onUpdate({
                        channels: {
                          ...settings.channels,
                          [type]: { ...channels, push: checked },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Test Notifications */}
        <div className="space-y-3">
          <h3 className="font-medium">Test Notifications</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTest("system", "email")}
            >
              Test Email
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTest("system", "push")}
            >
              Test Push
            </Button>
          </div>
        </div>

        {/* Push Subscription */}
        {Notification.permission !== "granted" && (
          <div className="space-y-3">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Enable browser notifications to receive real-time updates.
              </AlertDescription>
            </Alert>
            <Button onClick={onSubscribePush} className="w-full">
              Enable Push Notifications
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationCenter;
