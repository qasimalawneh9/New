import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Target,
  Calendar,
  Star,
  TrendingUp,
  Clock,
  Users,
  Award,
  MessageSquare,
  Search,
  Filter,
  Plus,
  Eye,
  EyeOff,
  BarChart3,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { WalletDashboard } from "../payment/WalletDashboard";
import { BookingWizard } from "../booking/BookingWizard";
import { ReviewForm } from "../reviews/ReviewForm";
import { useAuth } from "../../contexts/AuthContext";
import { Booking, Review, Teacher } from "../../types/platform";
import {
  format,
  addDays,
  parseISO,
  differenceInDays,
  startOfWeek,
} from "date-fns";
import { cn } from "../../lib/utils";

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  status: "active" | "completed" | "paused";
  category:
    | "conversation"
    | "grammar"
    | "vocabulary"
    | "pronunciation"
    | "writing";
}

interface StudentStats {
  totalLessons: number;
  completedLessons: number;
  totalHours: number;
  currentStreak: number;
  longestStreak: number;
  averageRating: number;
  totalSpent: number;
  monthlySpent: number;
  favoriteTeachers: number;
  completionRate: number;
  walletBalance: number;
  upcomingLessons: number;
  reviewsGiven: number;
}

interface StudentDashboardProps {
  className?: string;
}

export function StudentDashboard({ className }: StudentDashboardProps) {
  const { user } = useAuth();
  const [showBalances, setShowBalances] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [activeTab, setActiveTab] = useState("overview");
  const [showQuickAction, setShowQuickAction] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - in real app this would come from API
  const [stats, setStats] = useState<StudentStats>({
    totalLessons: 127,
    completedLessons: 119,
    totalHours: 89.5,
    currentStreak: 12,
    longestStreak: 28,
    averageRating: 4.7,
    totalSpent: 3420.5,
    monthlySpent: 340.0,
    favoriteTeachers: 3,
    completionRate: 93.7,
    walletBalance: 125.75,
    upcomingLessons: 4,
    reviewsGiven: 89,
  });

  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>([
    {
      id: "1",
      title: "Improve Conversation Fluency",
      description: "Have natural conversations without hesitation",
      targetDate: format(addDays(new Date(), 60), "yyyy-MM-dd"),
      progress: 65,
      status: "active",
      category: "conversation",
    },
    {
      id: "2",
      title: "Master Business Vocabulary",
      description: "Learn 500+ business-related terms and phrases",
      targetDate: format(addDays(new Date(), 90), "yyyy-MM-dd"),
      progress: 45,
      status: "active",
      category: "vocabulary",
    },
    {
      id: "3",
      title: "Perfect Pronunciation",
      description: "Achieve native-like pronunciation in key areas",
      targetDate: format(addDays(new Date(), 120), "yyyy-MM-dd"),
      progress: 30,
      status: "active",
      category: "pronunciation",
    },
  ]);

  const [upcomingBookings] = useState<Booking[]>([
    {
      id: "1",
      studentId: user?.id || "s1",
      teacherId: "t1",
      studentName: user?.name || "Student",
      teacherName: "Elena Rodriguez",
      date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      startTime: "14:00",
      endTime: "15:00",
      duration: 60,
      status: "confirmed",
      totalPrice: 50,
      notes: "Focus on business English",
      rescheduleCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      studentId: user?.id || "s1",
      teacherId: "t2",
      studentName: user?.name || "Student",
      teacherName: "James Wilson",
      date: format(addDays(new Date(), 3), "yyyy-MM-dd"),
      startTime: "16:00",
      endTime: "17:00",
      duration: 60,
      status: "confirmed",
      totalPrice: 45,
      rescheduleCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [favoriteTeachers] = useState<Teacher[]>([
    {
      id: "t1",
      name: "Elena Rodriguez",
      email: "elena@example.com",
      profileImage: "",
      languages: ["Spanish", "English"],
      specializations: ["Business English", "Conversation"],
      hourlyRate: 50,
      rating: 4.9,
      totalLessons: 45,
      totalStudents: 20,
      experience: 5,
      bio: "Experienced business English teacher",
      education: "Master's in Applied Linguistics",
      certifications: ["TEFL", "TESOL"],
      availability: [],
      meetingPlatforms: [],
      isVerified: true,
      status: "approved",
      absenceCount: 0,
    },
  ]);

  const [recentAchievements] = useState([
    {
      id: "1",
      title: "Conversation Champion",
      description: "Completed 10 conversation lessons this month",
      icon: "🗣️",
      earnedAt: new Date().toISOString(),
      category: "milestone",
    },
    {
      id: "2",
      title: "Consistent Learner",
      description: "Maintained a 7-day learning streak",
      icon: "🔥",
      earnedAt: addDays(new Date(), -2).toISOString(),
      category: "streak",
    },
    {
      id: "3",
      title: "Review Master",
      description: "Gave helpful reviews to 5 teachers",
      icon: "⭐",
      earnedAt: addDays(new Date(), -5).toISOString(),
      category: "community",
    },
  ]);

  const getCategoryColor = (category: string) => {
    const colors = {
      conversation: "text-blue-600",
      grammar: "text-green-600",
      vocabulary: "text-purple-600",
      pronunciation: "text-orange-600",
      writing: "text-red-600",
    };
    return colors[category as keyof typeof colors] || "text-gray-600";
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      conversation: MessageSquare,
      grammar: BookOpen,
      vocabulary: Target,
      pronunciation: Users,
      writing: Edit,
    };
    return icons[category as keyof typeof icons] || BookOpen;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 60) return "text-blue-600";
    if (progress >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold">{stats.totalHours}</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>+8.5 this month</span>
                </div>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{stats.currentStreak}</p>
                <p className="text-xs text-muted-foreground">
                  Best: {stats.longestStreak} days
                </p>
              </div>
              <div className="text-2xl">🔥</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{stats.completionRate}%</p>
                <p className="text-xs text-muted-foreground">
                  {stats.completedLessons} of {stats.totalLessons} lessons
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Wallet Balance</p>
                <p className="text-2xl font-bold">
                  {showBalances ? `$${stats.walletBalance.toFixed(2)}` : "••••"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Available for lessons
                </p>
              </div>
              <Wallet className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Goals Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Learning Goals</CardTitle>
            <Button onClick={() => setShowQuickAction("goals")} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {learningGoals.map((goal) => {
              const Icon = getCategoryIcon(goal.category);
              const daysLeft = differenceInDays(
                parseISO(goal.targetDate),
                new Date(),
              );

              return (
                <div key={goal.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg bg-gray-100")}>
                        <Icon
                          className={cn(
                            "w-5 h-5",
                            getCategoryColor(goal.category),
                          )}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {goal.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          goal.status === "active" ? "default" : "secondary"
                        }
                      >
                        {goal.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {daysLeft} days left
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className={getProgressColor(goal.progress)}>
                        {goal.progress}%
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => setShowQuickAction("book")}
              className="h-20 flex flex-col gap-2"
            >
              <Calendar className="w-6 h-6" />
              <span>Book Lesson</span>
            </Button>

            <Button
              onClick={() => setShowQuickAction("teachers")}
              className="h-20 flex flex-col gap-2"
              variant="outline"
            >
              <Search className="w-6 h-6" />
              <span>Find Teachers</span>
            </Button>

            <Button
              onClick={() => setShowQuickAction("wallet")}
              className="h-20 flex flex-col gap-2"
              variant="outline"
            >
              <Plus className="w-6 h-6" />
              <span>Add Funds</span>
            </Button>

            <Button
              onClick={() => setShowQuickAction("review")}
              className="h-20 flex flex-col gap-2"
              variant="outline"
            >
              <Star className="w-6 h-6" />
              <span>Write Review</span>
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
                <Button
                  className="mt-4"
                  onClick={() => setShowQuickAction("book")}
                >
                  Book Your First Lesson
                </Button>
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
                        {booking.teacherName?.charAt(0) || "T"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{booking.teacherName}</p>
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
                    <Button size="sm">Join Lesson</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Favorite Teachers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Favorite Teachers</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {favoriteTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={teacher.profileImage} />
                    <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{teacher.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "w-3 h-3",
                              star <= teacher.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300",
                            )}
                          />
                        ))}
                      </div>
                      <span>{teacher.rating}</span>
                      <span>•</span>
                      <span>${teacher.hourlyRate}/hr</span>
                    </div>
                  </div>
                </div>
                <Button size="sm">Book Lesson</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="p-4 border rounded-lg text-center"
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h3 className="font-semibold mb-1">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {achievement.description}
                </p>
                <Badge variant="outline" className="text-xs">
                  {format(parseISO(achievement.earnedAt), "MMM d")}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProgressTab = () => (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Learning Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl mb-2">🔥</div>
              <p className="text-3xl font-bold">{stats.currentStreak}</p>
              <p className="text-sm text-muted-foreground">days</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">3 of 4 lessons</span>
                <span className="text-sm font-medium">75%</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground">
                1 more lesson to reach your weekly goal!
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.totalHours}h</p>
              <p className="text-sm text-muted-foreground">total study time</p>
              <p className="text-xs text-green-600 mt-1">+8.5h this month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Goals Details */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Goals Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {learningGoals.map((goal) => {
              const Icon = getCategoryIcon(goal.category);
              const daysLeft = differenceInDays(
                parseISO(goal.targetDate),
                new Date(),
              );
              const isOnTrack = goal.progress >= 100 - (daysLeft / 90) * 100;

              return (
                <div key={goal.id} className="p-6 border rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={cn("p-3 rounded-lg bg-gray-100")}>
                        <Icon
                          className={cn(
                            "w-6 h-6",
                            getCategoryColor(goal.category),
                          )}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{goal.title}</h3>
                        <p className="text-muted-foreground">
                          {goal.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span>
                            Target:{" "}
                            {format(parseISO(goal.targetDate), "MMM d, yyyy")}
                          </span>
                          <Badge
                            variant={isOnTrack ? "default" : "destructive"}
                          >
                            {isOnTrack ? "On Track" : "Behind Schedule"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          {goal.status === "active" ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Progress</span>
                      <span
                        className={cn(
                          "text-lg font-bold",
                          getProgressColor(goal.progress),
                        )}
                      >
                        {goal.progress}%
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{daysLeft} days remaining</span>
                      <span>
                        {isOnTrack
                          ? "Ahead of schedule"
                          : `${Math.ceil((100 - goal.progress) / (daysLeft || 1))}% per day needed`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      <div className={cn("space-y-6", className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground">
              Continue your learning journey • {stats.currentStreak} day streak
              🔥
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
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {renderOverviewTab()}
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            {renderProgressTab()}
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Lessons</CardTitle>
                  <Button onClick={() => setShowQuickAction("book")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Book New Lesson
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Lesson history and management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Find Teachers</CardTitle>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search teachers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                    <Button variant="outline">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Teacher search and discovery coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            <WalletDashboard
              walletData={{
                balance: stats.walletBalance,
                currency: "USD",
                totalEarnings: 0,
                totalSpent: stats.totalSpent,
                pendingPayouts: 0,
                monthlySpending: stats.monthlySpent,
                monthlyEarnings: 0,
                transactions: [],
                payouts: [],
              }}
              userRole="student"
              onAddFunds={() => {}}
              onWithdraw={() => {}}
              onRequestPayout={() => {}}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Action Dialogs */}
      <Dialog
        open={!!showQuickAction}
        onOpenChange={() => setShowQuickAction(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {showQuickAction === "book" && "Book a Lesson"}
              {showQuickAction === "teachers" && "Find Teachers"}
              {showQuickAction === "wallet" && "Add Funds"}
              {showQuickAction === "review" && "Write Review"}
              {showQuickAction === "goals" && "Add Learning Goal"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {showQuickAction === "book" && (
              <BookingWizard
                teacherId="t1"
                teacherName="Elena Rodriguez"
                teacherHourlyRate={50}
                teacherRating={4.9}
                availableDurations={[30, 60, 90]}
                onSuccess={() => setShowQuickAction(null)}
                onCancel={() => setShowQuickAction(null)}
              />
            )}
            {showQuickAction !== "book" && (
              <p className="text-muted-foreground">
                This feature is coming soon. You'll be able to{" "}
                {showQuickAction?.replace(/([A-Z])/g, " $1").toLowerCase()}{" "}
                directly from your dashboard.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default StudentDashboard;
