import React, { useState, useEffect } from "react";
import {
  Calendar,
  DollarSign,
  Users,
  Star,
  TrendingUp,
  Clock,
  BookOpen,
  MessageSquare,
  Settings,
  Bell,
  BarChart3,
  Target,
  Award,
  Eye,
  EyeOff,
  Plus,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { WalletDashboard } from "../payment/WalletDashboard";
import { PayoutManagement } from "../payment/PayoutManagement";
import { ReviewAnalytics } from "../reviews/ReviewAnalytics";
import { AttendanceTracker } from "../lesson/AttendanceTracker";
import { BookingManagement } from "../booking/BookingManagement";
import { useAuth } from "../../contexts/AuthContext";
import { PLATFORM_CONFIG } from "../../api/config";
import {
  Booking,
  Review,
  WalletTransaction,
  PayoutRequest,
} from "../../types/platform";
import { format, startOfWeek, endOfWeek, addDays, parseISO } from "date-fns";
import { cn } from "../../lib/utils";

interface TeacherStats {
  totalEarnings: number;
  monthlyEarnings: number;
  totalStudents: number;
  activeStudents: number;
  totalLessons: number;
  completedLessons: number;
  averageRating: number;
  totalReviews: number;
  responseRate: number;
  availableBalance: number;
  pendingPayouts: number;
  upcomingLessons: number;
  missedLessons: number;
  absenceCount: number;
}

interface TeacherDashboardProps {
  className?: string;
}

export function TeacherDashboard({ className }: TeacherDashboardProps) {
  const { user } = useAuth();
  const [showBalances, setShowBalances] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [activeTab, setActiveTab] = useState("overview");
  const [showQuickAction, setShowQuickAction] = useState<string | null>(null);

  // Mock data - in real app this would come from API
  const [stats, setStats] = useState<TeacherStats>({
    totalEarnings: 15420.5,
    monthlyEarnings: 2340.75,
    totalStudents: 84,
    activeStudents: 32,
    totalLessons: 234,
    completedLessons: 228,
    averageRating: 4.8,
    totalReviews: 156,
    responseRate: 94,
    availableBalance: 1245.3,
    pendingPayouts: 340.5,
    upcomingLessons: 8,
    missedLessons: 2,
    absenceCount: 1,
  });

  const [upcomingBookings] = useState<Booking[]>([
    {
      id: "1",
      studentId: "s1",
      teacherId: user?.id || "t1",
      studentName: "Sarah Johnson",
      teacherName: user?.name || "Teacher",
      date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      startTime: "14:00",
      endTime: "15:00",
      duration: 60,
      status: "confirmed",
      totalPrice: 50,
      notes: "Focus on conversation practice",
      rescheduleCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      studentId: "s2",
      teacherId: user?.id || "t1",
      studentName: "Michael Chen",
      teacherName: user?.name || "Teacher",
      date: format(addDays(new Date(), 2), "yyyy-MM-dd"),
      startTime: "16:00",
      endTime: "17:30",
      duration: 90,
      status: "confirmed",
      totalPrice: 75,
      rescheduleCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [recentReviews] = useState<Review[]>([
    {
      id: "1",
      studentId: "s1",
      teacherId: user?.id || "t1",
      rating: 5,
      comment: "Excellent teacher! Very patient and explains concepts clearly.",
      tags: ["Patient", "Clear Explanation", "Engaging"],
      isAnonymous: false,
      isVerified: true,
      isFeatured: false,
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const getPerformanceColor = (value: number, threshold: number = 80) => {
    if (value >= threshold) return "text-green-600";
    if (value >= threshold * 0.7) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceBadge = (value: number, threshold: number = 80) => {
    if (value >= threshold)
      return { label: "Excellent", variant: "default" as const };
    if (value >= threshold * 0.7)
      return { label: "Good", variant: "secondary" as const };
    return { label: "Needs Improvement", variant: "destructive" as const };
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Monthly Earnings
                </p>
                <p className="text-2xl font-bold">
                  {showBalances
                    ? `$${stats.monthlyEarnings.toFixed(2)}`
                    : "••••"}
                </p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12% from last month</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Students</p>
                <p className="text-2xl font-bold">{stats.activeStudents}</p>
                <p className="text-xs text-muted-foreground">
                  of {stats.totalStudents} total
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{stats.averageRating}</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-4 h-4",
                          star <= stats.averageRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300",
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalReviews} reviews
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Completed Lessons
                </p>
                <p className="text-2xl font-bold">{stats.completedLessons}</p>
                <div className="flex items-center gap-1 text-xs">
                  <span
                    className={getPerformanceColor(
                      (stats.completedLessons / stats.totalLessons) * 100,
                    )}
                  >
                    {(
                      (stats.completedLessons / stats.totalLessons) *
                      100
                    ).toFixed(1)}
                    % completion rate
                  </span>
                </div>
              </div>
              <BookOpen className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Alerts */}
      {stats.absenceCount >= 2 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Attendance Warning:</strong> You have {stats.absenceCount}{" "}
            recorded absence(s).
            {PLATFORM_CONFIG.MAX_ABSENCES_BEFORE_SUSPENSION -
              stats.absenceCount}{" "}
            more will result in suspension.
          </AlertDescription>
        </Alert>
      )}

      {stats.responseRate < 80 && (
        <Alert className="border-orange-200 bg-orange-50">
          <MessageSquare className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Response Rate:</strong> Your response rate is{" "}
            {stats.responseRate}%. Consider responding to more student messages
            to improve engagement.
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => setShowQuickAction("availability")}
              className="h-20 flex flex-col gap-2"
              variant="outline"
            >
              <Calendar className="w-6 h-6" />
              <span>Set Availability</span>
            </Button>

            <Button
              onClick={() => setShowQuickAction("payout")}
              className="h-20 flex flex-col gap-2"
              variant="outline"
              disabled={
                stats.availableBalance < PLATFORM_CONFIG.MIN_PAYPAL_WITHDRAWAL
              }
            >
              <DollarSign className="w-6 h-6" />
              <span>Request Payout</span>
            </Button>

            <Button
              onClick={() => setShowQuickAction("profile")}
              className="h-20 flex flex-col gap-2"
              variant="outline"
            >
              <Settings className="w-6 h-6" />
              <span>Edit Profile</span>
            </Button>

            <Button
              onClick={() => setShowQuickAction("students")}
              className="h-20 flex flex-col gap-2"
              variant="outline"
            >
              <Users className="w-6 h-6" />
              <span>My Students</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Lessons */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Upcoming Lessons</CardTitle>
            <Badge variant="outline">{stats.upcomingLessons} scheduled</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming lessons scheduled</p>
              </div>
            ) : (
              upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {booking.studentName?.charAt(0) || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{booking.studentName}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {format(parseISO(booking.date), "MMM d, yyyy")}
                        </span>
                        <Clock className="w-3 h-3" />
                        <span>
                          {booking.startTime} - {booking.endTime}
                        </span>
                        <span>({booking.duration} min)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">${booking.totalPrice}</Badge>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Reviews</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent reviews</p>
              </div>
            ) : (
              recentReviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "w-4 h-4",
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300",
                            )}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{review.rating}/5</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(parseISO(review.createdAt), "MMM d")}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm mb-2">{review.comment}</p>
                  )}
                  {review.tags && review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {review.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPerformanceTab = () => {
    const performanceMetrics = [
      {
        title: "Response Rate",
        value: stats.responseRate,
        target: 90,
        unit: "%",
        description:
          "Percentage of student messages responded to within 24 hours",
        color: "blue",
      },
      {
        title: "Completion Rate",
        value: (stats.completedLessons / stats.totalLessons) * 100,
        target: 95,
        unit: "%",
        description: "Percentage of scheduled lessons completed successfully",
        color: "green",
      },
      {
        title: "Average Rating",
        value: stats.averageRating,
        target: 4.5,
        unit: "/5",
        description: "Average student rating from recent reviews",
        color: "yellow",
      },
      {
        title: "Student Retention",
        value: (stats.activeStudents / stats.totalStudents) * 100,
        target: 70,
        unit: "%",
        description: "Percentage of students who continue taking lessons",
        color: "purple",
      },
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {performanceMetrics.map((metric) => {
            const percentage =
              metric.unit === "%" ? metric.value : (metric.value / 5) * 100;
            const isOnTarget = metric.value >= metric.target;
            const badge = getPerformanceBadge(metric.value, metric.target);

            return (
              <Card key={metric.title}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{metric.title}</CardTitle>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-end gap-2">
                      <span
                        className={cn(
                          "text-3xl font-bold",
                          isOnTarget ? "text-green-600" : "text-orange-600",
                        )}
                      >
                        {metric.value.toFixed(1)}
                      </span>
                      <span className="text-lg text-muted-foreground">
                        {metric.unit}
                      </span>
                      <span className="text-sm text-muted-foreground ml-auto">
                        Target: {metric.target}
                        {metric.unit}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {metric.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h4 className="font-medium text-green-900">Strengths</h4>
                <ul className="text-sm text-green-800 mt-2 space-y-1">
                  <li>• Excellent student ratings (4.8/5)</li>
                  <li>• High lesson completion rate</li>
                  <li>• Strong student engagement</li>
                </ul>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <h4 className="font-medium text-orange-900">
                  Areas for Improvement
                </h4>
                <ul className="text-sm text-orange-800 mt-2 space-y-1">
                  <li>• Response time to student messages</li>
                  <li>• Consistency in lesson preparation</li>
                  <li>• Use of interactive teaching materials</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <>
      <div className={cn("space-y-6", className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground">
              Here's your teaching dashboard for{" "}
              {format(new Date(), "MMMM yyyy")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBalances(!showBalances)}
            >
              {showBalances ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {renderOverviewTab()}
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WalletDashboard
                walletData={{
                  balance: stats.availableBalance,
                  currency: "USD",
                  totalEarnings: stats.totalEarnings,
                  totalSpent: 0,
                  pendingPayouts: stats.pendingPayouts,
                  monthlySpending: 0,
                  monthlyEarnings: stats.monthlyEarnings,
                  transactions: [],
                  payouts: [],
                }}
                userRole="teacher"
                onAddFunds={() => {}}
                onWithdraw={() => {}}
                onRequestPayout={() => {}}
              />
              <PayoutManagement
                availableBalance={stats.availableBalance}
                totalEarnings={stats.totalEarnings}
                pendingPayouts={[]}
                completedPayouts={[]}
                recentTransactions={[]}
                onRequestPayout={() => {}}
                onCancelPayout={() => {}}
              />
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Student management interface coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Lesson management interface coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <ReviewAnalytics
              teacherId={user?.id || ""}
              stats={{
                averageRating: stats.averageRating,
                totalReviews: stats.totalReviews,
                ratingDistribution: { 5: 120, 4: 25, 3: 8, 2: 2, 1: 1 },
                commonTags: [
                  "Patient",
                  "Clear Explanation",
                  "Engaging",
                  "Well Prepared",
                ],
              }}
              userRole="teacher"
              timeRange="month"
              onTimeRangeChange={() => {}}
            />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {renderPerformanceTab()}
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Action Dialogs */}
      <Dialog
        open={!!showQuickAction}
        onOpenChange={() => setShowQuickAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {showQuickAction === "availability" && "Set Availability"}
              {showQuickAction === "payout" && "Request Payout"}
              {showQuickAction === "profile" && "Edit Profile"}
              {showQuickAction === "students" && "My Students"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              This feature is coming soon. You'll be able to{" "}
              {showQuickAction?.replace(/([A-Z])/g, " $1").toLowerCase()}{" "}
              directly from your dashboard.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TeacherDashboard;
