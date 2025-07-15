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
  Wallet,
  Plus,
  CreditCard,
  ArrowUpRight,
  DollarSign,
  GraduationCap,
  Search,
  Filter,
  Bell,
  Settings,
  User,
  ChevronRight,
  PlayCircle,
  CheckCircle,
  AlertCircle,
  Heart,
  Target,
  BarChart3,
  Globe,
  Zap,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
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
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { db } from "@/lib/database";
import { cn } from "@/lib/utils";

interface StudentDashboardProps {
  className?: string;
}

export function StudentDashboard({ className }: StudentDashboardProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.id) return;

      try {
        const data = db.getStudentDashboardData(user.id);
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
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
    student,
    stats,
    upcomingLessons,
    languageProgress,
    recentActivity,
    walletBalance,
  } = dashboardData;

  // Mock data for charts
  const progressData = [
    { month: "Jan", hours: 8 },
    { month: "Feb", hours: 12 },
    { month: "Mar", hours: 15 },
    { month: "Apr", hours: 18 },
    { month: "May", hours: 22 },
    { month: "Jun", hours: 25 },
  ];

  const languageDistribution = Object.entries(languageProgress).map(
    ([language, data]: [string, any]) => ({
      name: language,
      value: data.hours,
      lessons: data.lessons,
    }),
  );

  const COLORS = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];

  const learningGoals = [
    {
      goal: "Complete 20 Spanish lessons",
      progress: 75,
      current: 15,
      target: 20,
    },
    {
      goal: "Reach intermediate level",
      progress: 45,
      current: 45,
      target: 100,
    },
    { goal: "Improve pronunciation", progress: 60, current: 6, target: 10 },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {t("dashboard.welcome")}, {student.name}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to continue your language learning journey?
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/teachers">
              <Search className="h-4 w-4 mr-2" />
              Find Teachers
            </Link>
          </Button>
          <Button asChild>
            <Link to="/teachers?trial=true">
              <Zap className="h-4 w-4 mr-2" />
              Book Trial Lesson
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
                  Total Lessons
                </p>
                <p className="text-2xl font-bold">{stats.totalLessons}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+12% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Study Hours
                </p>
                <p className="text-2xl font-bold">
                  {stats.totalHours.toFixed(1)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Target className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-blue-600">Goal: 30h this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Wallet Balance
                </p>
                <p className="text-2xl font-bold">
                  ${walletBalance.toFixed(2)}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4">
              <Button size="sm" variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                Add Funds
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Achievements
                </p>
                <p className="text-2xl font-bold">
                  {stats.achievements.length}
                </p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Star className="h-4 w-4 text-yellow-600 mr-1" />
              <span className="text-yellow-600">Next: 25 lessons</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Lessons */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Lessons
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/lessons">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingLessons.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No upcoming lessons scheduled
                  </p>
                  <Button asChild>
                    <Link to="/teachers">Book Your Next Lesson</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingLessons.slice(0, 3).map((lesson: any) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder-teacher.jpg" />
                          <AvatarFallback>T</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">Spanish Lesson</h4>
                          <p className="text-sm text-muted-foreground">
                            with Maria Rodriguez
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Today, 2:00 PM</span>
                            <Badge variant="outline" className="text-xs">
                              60 min
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
                          Join
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Learning Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="languages">Languages</TabsTrigger>
                  <TabsTrigger value="goals">Goals</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="hours"
                          stroke="#8B5CF6"
                          fill="#8B5CF6"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="languages" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={languageDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}h`}
                            outerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {languageDistribution.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(languageProgress).map(
                        ([language, data]: [string, any]) => (
                          <div key={language} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {language}
                              </span>
                              <Badge variant="outline">{data.level}</Badge>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{data.lessons} lessons</span>
                                <span>{data.hours.toFixed(1)} hours</span>
                              </div>
                              <Progress
                                value={(data.hours / 50) * 100}
                                className="h-2"
                              />
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="goals" className="space-y-4">
                  {learningGoals.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{goal.goal}</span>
                        <span className="text-xs text-muted-foreground">
                          {goal.current}/{goal.target}
                        </span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  ))}
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
                <Link to="/teachers">
                  <Search className="h-4 w-4 mr-2" />
                  Find New Teacher
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to="/lesson-room">
                  <Video className="h-4 w-4 mr-2" />
                  Practice Room
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to="/community">
                  <Users className="h-4 w-4 mr-2" />
                  Join Community
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

          {/* Favorite Teachers */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Favorite Teachers
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/favorites">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-teacher.jpg" />
                      <AvatarFallback>T{i}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        Teacher Name {i}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Spanish • $25/hr
                      </p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
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

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5" />
                Latest Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.achievements
                  .slice(0, 3)
                  .map((achievement: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Award className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{achievement}</p>
                        <p className="text-xs text-muted-foreground">
                          Earned recently
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

export default StudentDashboard;
