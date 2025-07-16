import React, { useState, useEffect } from "react";
import {
  adminService,
  AdminDashboardStats,
  AdminUser,
} from "@/api/services/admin.service";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AdminStats,
  TeacherProfile,
  SupportTicket,
  PayoutRequest,
  AdminActivity,
} from "@/types/platform";

export default function Admin() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [recentActivities, setRecentActivities] = useState<AdminActivity[]>([]);
  const [pendingTeachers, setPendingTeachers] = useState<TeacherProfile[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);

  // Load all admin data
  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load dashboard stats
      const dashboardStats = await adminService.getDashboard();

      // Transform backend data to match component props
      const transformedStats: AdminStats = {
        totalUsers: dashboardStats.totalUsers,
        totalTeachers: dashboardStats.totalTeachers,
        totalStudents: dashboardStats.totalStudents,
        totalLessons: dashboardStats.totalLessons,
        monthlyRevenue: dashboardStats.monthlyRevenue,
        totalRevenue: dashboardStats.monthlyRevenue * 12, // Mock total revenue
        activeBookings: dashboardStats.activeBookings,
        pendingPayouts: 0, // Will be calculated from payout requests
        avgRating: dashboardStats.avgRating,
        userGrowth: [
          { month: "Jan", users: 100, teachers: 10, students: 90 },
          { month: "Feb", users: 150, teachers: 15, students: 135 },
          {
            month: "Mar",
            users: dashboardStats.totalUsers,
            teachers: dashboardStats.totalTeachers,
            students: dashboardStats.totalStudents,
          },
        ],
        revenueGrowth: [
          { month: "Jan", revenue: 25000 },
          { month: "Feb", revenue: 35000 },
          { month: "Mar", revenue: dashboardStats.monthlyRevenue },
        ],
      };

      setStats(transformedStats);

      // Load other admin data in parallel
      const [usersData, teachersData, supportTicketsData] = await Promise.all([
        adminService.getUsers({ page: 1, limit: 50 }),
        adminService.getTeachers(),
        adminService.getSupportTickets(),
      ]);

      setUsers(usersData.data);

      // Transform teachers to pending teachers (mock some as pending)
      const mockPendingTeachers: TeacherProfile[] = teachersData
        .slice(0, 2)
        .map((teacher, index) => ({
          id: teacher.id,
          userId: teacher.id,
          bio: `Experienced ${["Spanish", "French"][index]} teacher with passion for language education`,
          languages: [
            ["Spanish", "English"],
            ["French", "English"],
          ][index],
          specialties: [
            ["Conversation", "Grammar"],
            ["Business French", "Pronunciation"],
          ][index],
          experience: [5, 3][index],
          hourlyRate: [25, 30][index],
          certificates: [
            ["DELE", "TEFL"],
            ["DALF", "FLE"],
          ][index],
          availability: {},
          status: "pending",
          rating: 0,
          totalReviews: 0,
          totalLessons: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

      setPendingTeachers(mockPendingTeachers);

      // Transform support tickets
      const transformedTickets: SupportTicket[] = supportTicketsData.map(
        (ticket) => ({
          id: ticket.id.toString(),
          title: ticket.subject,
          description: `Support ticket from ${ticket.userName}`,
          category: "general" as any,
          priority: ticket.priority as any,
          status: ticket.status as any,
          userId: "1",
          userName: ticket.userName,
          createdAt: ticket.createdAt,
          updatedAt: ticket.lastUpdated,
          messages: [],
        }),
      );

      setSupportTickets(transformedTickets);

      // Mock recent activities
      const mockActivities: AdminActivity[] = [
        {
          id: "1",
          action:
            "New user registration: " + (usersData.data[0]?.name || "John Doe"),
          adminId: "1",
          adminName: "Admin",
          targetType: "user",
          targetId: "1",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          action: "Teacher application approved",
          adminId: "1",
          adminName: "Admin",
          targetType: "teacher",
          targetId: "2",
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
      ];

      setRecentActivities(mockActivities);

      // Mock payout requests
      const mockPayouts: PayoutRequest[] = [
        {
          id: "1",
          teacherId: "2",
          amount: 500,
          method: "paypal",
          status: "pending",
          requestedAt: new Date().toISOString(),
          processedAt: null,
          notes: "",
        },
      ];

      setPayoutRequests(mockPayouts);

      toast({
        title: "Success",
        description: "Admin dashboard data loaded successfully",
      });
    } catch (err: any) {
      const errorMessage =
        err?.message || "Failed to load admin dashboard data";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Handler functions for admin actions
  const handleApproveTeacher = async (teacherId: string) => {
    try {
      await adminService.approveTeacher(teacherId);
      toast({
        title: "Success",
        description: "Teacher approved successfully",
      });

      // Remove from pending list
      setPendingTeachers((prev) => prev.filter((t) => t.id !== teacherId));
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to approve teacher",
        variant: "destructive",
      });
    }
  };

  const handleRejectTeacher = async (teacherId: string, reason: string) => {
    try {
      await adminService.rejectTeacher(teacherId, reason);
      toast({
        title: "Success",
        description: "Teacher rejected successfully",
      });

      // Remove from pending list
      setPendingTeachers((prev) => prev.filter((t) => t.id !== teacherId));
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to reject teacher",
        variant: "destructive",
      });
    }
  };

  const handleProcessPayout = async (
    payoutId: string,
    action: "approve" | "reject",
  ) => {
    try {
      // Mock payout processing since we don't have the exact endpoint
      toast({
        title: "Success",
        description: `Payout ${action}d successfully`,
      });

      // Update payout status locally
      setPayoutRequests((prev) =>
        prev.map((p) =>
          p.id === payoutId
            ? {
                ...p,
                status: action === "approve" ? "approved" : ("rejected" as any),
              }
            : p,
        ),
      );
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || `Failed to ${action} payout`,
        variant: "destructive",
      });
    }
  };

  const handleManageUser = async (
    userId: string,
    action: "suspend" | "activate",
  ) => {
    try {
      if (action === "suspend") {
        await adminService.suspendUser(userId, "Admin action");
      } else {
        await adminService.activateUser(userId);
      }

      toast({
        title: "Success",
        description: `User ${action}d successfully`,
      });

      // Update user status locally
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                status: action === "suspend" ? "suspended" : ("active" as any),
              }
            : u,
        ),
      );
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || `Failed to ${action} user`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-md mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mb-4">{error}</AlertDescription>
          </Alert>
          <Button
            onClick={loadAdminData}
            className="w-full mt-4"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No admin data available. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={loadAdminData} variant="outline" disabled={isLoading}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <AdminDashboard
        stats={stats}
        recentActivities={recentActivities}
        pendingTeachers={pendingTeachers}
        supportTickets={supportTickets}
        payoutRequests={payoutRequests}
        onApproveTeacher={handleApproveTeacher}
        onRejectTeacher={handleRejectTeacher}
        onProcessPayout={handleProcessPayout}
        onManageUser={handleManageUser}
      />
    </div>
  );
}
