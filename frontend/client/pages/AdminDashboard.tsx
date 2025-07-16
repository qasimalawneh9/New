import React, { useState, useEffect } from "react";
import {
  adminDashboardService,
  type AdminDashboardStats,
} from "@/api/services/admin-dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  UserCheck,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  UserPlus,
  FileText,
  CreditCard,
  Activity,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadDashboardData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load dashboard stats and recent activity
      const [dashboardStats, activityData] = await Promise.all([
        adminDashboardService.getDashboardStats(),
        adminDashboardService.getRecentActivity(10),
      ]);

      setStats(dashboardStats);
      setRecentActivity(activityData);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error("Failed to load admin dashboard:", err);
      setError(err?.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  if (isLoading && !stats) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <h2 className="text-red-800 font-semibold">
              Error Loading Dashboard
            </h2>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isLoading} variant="outline">
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.newUsersThisMonth || 0} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.approvedTeachers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.pendingTeachers || 0} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalLessons || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.lessonsToday || 0} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.totalRevenue || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              ${stats?.monthlyRevenue || 0} this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Platform Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Platform Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>System Uptime</span>
                  <Badge variant="secondary">
                    {stats?.systemUptime || "99.9%"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Rating</span>
                  <Badge variant="secondary">
                    {stats?.averageRating || 0} ⭐
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Response Time</span>
                  <Badge variant="secondary">
                    {stats?.responseTime || 0}ms
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Users Today</span>
                  <Badge variant="secondary">
                    {stats?.activeUsersToday || 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Support Tickets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Support Tickets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    Open
                  </span>
                  <Badge variant="destructive">
                    {stats?.supportTickets?.open || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                    In Progress
                  </span>
                  <Badge variant="secondary">
                    {stats?.supportTickets?.inProgress || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Resolved
                  </span>
                  <Badge variant="secondary">
                    {stats?.supportTickets?.resolved || 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {stats?.newUsersThisMonth || 0}
                </div>
                <p className="text-sm text-muted-foreground">
                  New users this month
                </p>
                <div className="mt-4">
                  <div className="text-sm">
                    This week: {stats?.newUsersThisWeek || 0}
                  </div>
                  <div className="text-sm">
                    Growth rate: {stats?.userGrowthRate || 0}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {stats?.activeUsersToday || 0}
                </div>
                <p className="text-sm text-muted-foreground">Active today</p>
                <div className="mt-4">
                  <div className="text-sm">
                    Total users: {stats?.totalUsers || 0}
                  </div>
                  <div className="text-sm">
                    Activity rate:{" "}
                    {stats?.totalUsers
                      ? Math.round(
                          (stats.activeUsersToday / stats.totalUsers) * 100,
                        )
                      : 0}
                    %
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Students</span>
                  <span className="font-medium">
                    {(stats?.totalUsers || 0) - (stats?.totalTeachers || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Teachers</span>
                  <span className="font-medium">
                    {stats?.totalTeachers || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teachers">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Teacher Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Approved
                  </span>
                  <Badge variant="secondary">
                    {stats?.approvedTeachers || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                    Pending
                  </span>
                  <Badge variant="secondary">
                    {stats?.pendingTeachers || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    Rejected
                  </span>
                  <Badge variant="secondary">
                    {stats?.rejectedTeachers || 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Teacher Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {stats?.averageRating || 0}
                </div>
                <p className="text-sm text-muted-foreground">Average rating</p>
                <div className="mt-4">
                  <div className="text-sm">
                    Approval rate: {stats?.teacherApprovalRate || 0}%
                  </div>
                  <div className="text-sm">
                    Completed lessons: {stats?.completedLessons || 0}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lesson Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Completed</span>
                  <span className="font-medium">
                    {stats?.completedLessons || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Upcoming</span>
                  <span className="font-medium">
                    {stats?.upcomingLessons || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Average Price</span>
                  <span className="font-medium">
                    ${stats?.averageLessonPrice || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats?.totalRevenue || 0}
                </div>
                <p className="text-sm text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats?.revenueThisMonth || 0}
                </div>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Commission Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats?.commissionEarned || 0}
                </div>
                <p className="text-sm text-muted-foreground">
                  Platform commission (20%)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pending Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.pendingPayouts || 0}
                </div>
                <p className="text-sm text-muted-foreground">
                  Awaiting approval
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.userName} •{" "}
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {activity.type.replace("_", " ")}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent activity to display
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => (window.location.href = "/admin/users")}
            >
              <UserPlus className="h-6 w-6 mb-2" />
              Manage Users
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => (window.location.href = "/admin/teachers")}
            >
              <UserCheck className="h-6 w-6 mb-2" />
              Review Teachers
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => (window.location.href = "/admin/payouts")}
            >
              <CreditCard className="h-6 w-6 mb-2" />
              Process Payouts
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => (window.location.href = "/admin/support")}
            >
              <FileText className="h-6 w-6 mb-2" />
              Support Tickets
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
