import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  BookOpen,
  TrendingUp,
  Star,
  MessageCircle,
  Video,
  Award,
  DollarSign,
  Users,
  Settings,
  BarChart3,
  Target,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Wallet,
  CreditCard,
  FileText,
  Bell,
  Globe,
  Activity,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { db } from "@/lib/database";
import { cn } from "@/lib/utils";

interface TeacherDashboardProps {
  className?: string;
}

export function TeacherDashboard({ className }: TeacherDashboardProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        let data = db.getTeacherDashboardData(user.id);

        // If no teacher data found, create mock teacher data for demo
        if (!data) {
          console.log("No teacher data found, creating mock data for demo");
          data = {
            teacher: {
              id: user.id,
              name: user.name || "Demo Teacher",
              email: user.email || "teacher@demo.com",
              profileImage: "/placeholder-teacher.jpg",
              rating: 4.8,
              bio: "Experienced language teacher passionate about helping students achieve their goals.",
              languages: ["English", "Spanish"],
              specializations: ["Business English", "Conversation"],
              hourlyRate: 25,
              country: "United States",
            },
            stats: {
              totalLessons: 45,
              totalHours: 67.5,
              totalEarnings: 1125.0,
              uniqueStudents: 23,
              averageRating: 4.8,
              responseTime: "within 2 hours",
            },
            upcomingLessons: [
              {
                id: "lesson-1",
                studentName: "John Smith",
                subject: "Spanish Conversation",
                startTime: "2:00 PM",
                endTime: "3:00 PM",
                level: "Intermediate",
              },
              {
                id: "lesson-2",
                studentName: "Emma Wilson",
                subject: "Business English",
                startTime: "4:00 PM",
                endTime: "5:00 PM",
                level: "Advanced",
              },
            ],
            earningsData: {
              "2024-01": 850,
              "2024-02": 950,
              "2024-03": 1100,
              "2024-04": 1125,
            },
            recentActivity: [
              {
                description: "Completed lesson with John Smith",
                timestamp: new Date(
                  Date.now() - 2 * 60 * 60 * 1000,
                ).toISOString(),
              },
              {
                description: "Received 5-star review from Emma Wilson",
                timestamp: new Date(
                  Date.now() - 5 * 60 * 60 * 1000,
                ).toISOString(),
              },
              {
                description: "New student booking received",
                timestamp: new Date(
                  Date.now() - 24 * 60 * 60 * 1000,
                ).toISOString(),
              },
            ],
            pendingPayouts: [
              {
                id: "payout-1",
                amount: 245.5,
                currency: "USD",
                period: "2024-01-01 to 2024-01-15",
                status: "pending",
                estimatedPayoutDate: "2024-01-22",
              },
            ],
          };
        }

        setDashboardData(data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        // Create fallback data even on error
        setDashboardData({
          teacher: {
            id: user.id,
            name: user.name || "Demo Teacher",
            email: user.email || "teacher@demo.com",
            rating: 4.8,
          },
          stats: {
            totalLessons: 0,
            totalHours: 0,
            totalEarnings: 0,
            uniqueStudents: 0,
            averageRating: 0,
            responseTime: "within 2 hours",
          },
          upcomingLessons: [],
          earningsData: {},
          recentActivity: [],
          pendingPayouts: [],
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          Unable to load dashboard data. Please try again.
        </p>
      </div>
    );
  }

  const {
    teacher,
    stats = {},
    upcomingLessons = [],
    earningsData = {},
    recentActivity = [],
    pendingPayouts = [],
  } = dashboardData;

  // Ensure stats have safe defaults
  const safeStats = {
    totalEarnings: 0,
    totalLessons: 0,
    uniqueStudents: 0,
    averageRating: 0,
    responseTime: "within 2 hours",
    ...stats,
  };

  // Mock data for charts
  const earningsChartData =
    Object.entries(earningsData || {}).length > 0
      ? Object.entries(earningsData || {}).map(([month, amount]) => ({
          month,
          earnings: amount,
        }))
      : [
          { month: "Jan", earnings: 200 },
          { month: "Feb", earnings: 350 },
          { month: "Mar", earnings: 450 },
          { month: "Apr", earnings: 380 },
          { month: "May", earnings: 520 },
          { month: "Jun", earnings: 600 },
        ];

  const studentProgressData = [
    { week: "Week 1", newStudents: 5, totalStudents: 25 },
    { week: "Week 2", newStudents: 3, totalStudents: 28 },
    { week: "Week 3", newStudents: 7, totalStudents: 35 },
    { week: "Week 4", newStudents: 4, totalStudents: 39 },
  ];

  const lessonTypeData = [
    { name: "Conversational", value: 45, color: "#8B5CF6" },
    { name: "Grammar", value: 25, color: "#06B6D4" },
    { name: "Business", value: 20, color: "#10B981" },
    { name: "Exam Prep", value: 10, color: "#F59E0B" },
  ];

  const weeklySchedule = [
    { day: "Mon", lessons: 6, hours: 6 },
    { day: "Tue", lessons: 4, hours: 4 },
    { day: "Wed", lessons: 5, hours: 5 },
    { day: "Thu", lessons: 7, hours: 7 },
    { day: "Fri", lessons: 3, hours: 3 },
    { day: "Sat", lessons: 2, hours: 2 },
    { day: "Sun", lessons: 1, hours: 1 },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {teacher.name}! 🎓
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your teaching overview for today
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/teacher/profile">
              <Eye className="h-4 w-4 mr-2" />
              View Profile
            </Link>
          </Button>
          <Button asChild>
            <Link to="/teacher/availability">
              <Calendar className="h-4 w-4 mr-2" />
              Manage Schedule
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold">
                  ${safeStats.totalEarnings.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+8% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Lessons Taught
                </p>
                <p className="text-2xl font-bold">{safeStats.totalLessons}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Target className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-blue-600">Goal: 50 this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Students
                </p>
                <p className="text-2xl font-bold">{safeStats.uniqueStudents}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Star className="h-4 w-4 text-yellow-600 mr-1" />
              <span className="text-yellow-600">
                {safeStats.averageRating.toFixed(1)} avg rating
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Response Time
                </p>
                <p className="text-2xl font-bold">{safeStats.responseTime}</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">Excellent</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Schedule
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/teacher/schedule">View Full Schedule</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingLessons.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No lessons scheduled for today
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="/teacher/availability">Update Availability</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingLessons.slice(0, 4).map((lesson: any) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder-student.jpg" />
                          <AvatarFallback>S</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">John Smith</h4>
                          <p className="text-sm text-muted-foreground">
                            Spanish Conversation
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>2:00 PM - 3:00 PM</span>
                            <Badge variant="outline" className="text-xs">
                              Intermediate
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm">
                          <Video className="h-4 w-4 mr-1" />
                          Start Lesson
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analytics Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="earnings" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="earnings">Earnings</TabsTrigger>
                  <TabsTrigger value="students">Students</TabsTrigger>
                  <TabsTrigger value="lessons">Lessons</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>

                <TabsContent value="earnings" className="space-y-4">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={earningsChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`$${value}`, "Earnings"]}
                        />
                        <Area
                          type="monotone"
                          dataKey="earnings"
                          stroke="#10B981"
                          fill="#10B981"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="students" className="space-y-4">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={studentProgressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="newStudents"
                          stroke="#8B5CF6"
                          strokeWidth={2}
                          name="New Students"
                        />
                        <Line
                          type="monotone"
                          dataKey="totalStudents"
                          stroke="#06B6D4"
                          strokeWidth={2}
                          name="Total Students"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="lessons" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={lessonTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}%`}
                            outerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {lessonTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {lessonTypeData.map((type) => (
                        <div key={type.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {type.name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {type.value}%
                            </span>
                          </div>
                          <Progress value={type.value} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklySchedule}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="lessons" fill="#8B5CF6" name="Lessons" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link to="/teacher/profile/edit">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to="/teacher/availability">
                  <Calendar className="h-4 w-4 mr-2" />
                  Set Availability
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to="/teacher/resources">
                  <FileText className="h-4 w-4 mr-2" />
                  Teaching Resources
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to="/messages">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Messages
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Earnings Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Earnings
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/teacher/earnings">
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    This Month
                  </span>
                  <span className="font-medium">
                    ${(safeStats.totalEarnings * 0.3).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Last Month
                  </span>
                  <span className="font-medium">
                    ${(safeStats.totalEarnings * 0.25).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Earned
                  </span>
                  <span className="font-medium">
                    ${safeStats.totalEarnings.toFixed(2)}
                  </span>
                </div>
              </div>

              <Separator />

              {pendingPayouts.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Pending Payouts</h4>
                  {pendingPayouts.map((payout: any) => (
                    <div key={payout.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">${payout.amount}</span>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Expected: {payout.estimatedPayoutDate}
                      </p>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Request Payout
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Student Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5" />
                Recent Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center p-4 bg-accent/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {safeStats.averageRating.toFixed(1)}
                    </div>
                    <div className="flex justify-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-4 w-4",
                            star <= safeStats.averageRating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300",
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on {safeStats.totalLessons} lessons
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      text: "Great teacher! Very patient and helpful.",
                      rating: 5,
                      student: "Maria",
                    },
                    {
                      text: "Excellent lesson structure and materials.",
                      rating: 5,
                      student: "John",
                    },
                    {
                      text: "Made learning fun and engaging.",
                      rating: 4,
                      student: "Anna",
                    },
                  ].map((review, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-primary/20 pl-3"
                    >
                      <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "h-3 w-3",
                              star <= review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300",
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-sm">{review.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        - {review.student}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity
                  .slice(0, 5)
                  .map((activity: any, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
