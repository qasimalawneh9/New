import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
  Users,
  User,
  Settings,
  Edit,
  Eye,
  BarChart3,
  Target,
  Activity,
  FileText,
  CheckCircle,
  AlertCircle,
  Bell,
  Home,
  ChevronRight,
  LogOut,
  Search,
  Globe,
  Zap,
  PlayCircle,
  Heart,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/database";
import { useToast } from "@/components/ui/use-toast";

const menuItems = [
  { title: "Overview", icon: Home, id: "overview" },
  { title: "My Lessons", icon: BookOpen, id: "lessons" },
  { title: "Progress", icon: TrendingUp, id: "progress" },
  { title: "Teachers", icon: Users, id: "teachers" },
  { title: "Wallet", icon: Wallet, id: "wallet" },
  { title: "Messages", icon: MessageCircle, id: "messages" },
  { title: "Goals", icon: Target, id: "goals" },
  { title: "Resources", icon: FileText, id: "resources" },
  { title: "Settings", icon: Settings, id: "settings" },
];

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [studentData, setStudentData] = useState<any>(null);
  const [dashboardStats, setDashboardStats] = useState<any>({});
  const [upcomingLessons, setUpcomingLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.id) {
        const demoData = createDemoStudentData();
        setStudentData(demoData.student);
        setDashboardStats(demoData.stats);
        setUpcomingLessons(demoData.upcomingLessons);
        setLoading(false);
        return;
      }

      try {
        const data = db.getStudentDashboardData(user.id);
        if (data) {
          setStudentData(data.student);
          setDashboardStats(data.stats);
          setUpcomingLessons(data.upcomingLessons || []);
        } else {
          const demoData = createDemoStudentData();
          setStudentData(demoData.student);
          setDashboardStats(demoData.stats);
          setUpcomingLessons(demoData.upcomingLessons);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        const demoData = createDemoStudentData();
        setStudentData(demoData.student);
        setDashboardStats(demoData.stats);
        setUpcomingLessons(demoData.upcomingLessons);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]);

  const createDemoStudentData = () => {
    return {
      student: {
        id: user?.id || "demo_student",
        name: user?.name || "Demo Student",
        email: user?.email || "student@demo.com",
        avatar: "",
        level: "Intermediate",
        primaryLanguage: "Spanish",
        nativeLanguage: "English",
      },
      stats: {
        totalLessons: 47,
        totalHours: 78.5,
        currentStreak: 12,
        completedGoals: 5,
        averageRating: 4.8,
        walletBalance: 245.5,
      },
      upcomingLessons: [
        {
          id: "lesson_1",
          teacherName: "Maria Rodriguez",
          subject: "Spanish Conversation",
          date: "2024-01-20",
          time: "15:00",
          duration: 60,
          type: "video_call",
          status: "confirmed",
        },
      ],
    };
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {studentData?.name}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Ready to continue your language learning journey?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Lessons
                      </p>
                      <p className="text-2xl font-bold">
                        {dashboardStats?.totalLessons || 0}
                      </p>
                    </div>
                    <BookOpen className="h-8 w-8 text-primary" />
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
                        {dashboardStats?.totalHours || 0}h
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Current Streak
                      </p>
                      <p className="text-2xl font-bold">
                        {dashboardStats?.currentStreak || 0} days
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-primary" />
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
                        ${dashboardStats?.walletBalance?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                    <Wallet className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingLessons.length > 0 ? (
                    upcomingLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {lesson.teacherName
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{lesson.subject}</h4>
                            <p className="text-sm text-muted-foreground">
                              with {lesson.teacherName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {lesson.date} at {lesson.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button size="sm">
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Join
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        No upcoming lessons
                      </p>
                      <Button
                        className="mt-4"
                        onClick={() => navigate("/teachers")}
                      >
                        Book Your First Lesson
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "lessons":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Lessons</h2>
              <Button onClick={() => navigate("/teachers")}>
                <Plus className="h-4 w-4 mr-2" />
                Book New Lesson
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Upcoming</p>
                      <p className="text-2xl font-bold">
                        {upcomingLessons.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold">
                        {dashboardStats?.totalLessons || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Cancelled</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {lesson.teacherName
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{lesson.subject}</h4>
                          <p className="text-sm text-muted-foreground">
                            with {lesson.teacherName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {lesson.date} at {lesson.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Reschedule
                        </Button>
                        <Button size="sm">Join Lesson</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "progress":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Learning Progress</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Language Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Spanish</span>
                        <Badge variant="secondary">Intermediate</Badge>
                      </div>
                      <Progress value={65} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-1">
                        45 hours • 28 lessons
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">French</span>
                        <Badge variant="secondary">Beginner</Badge>
                      </div>
                      <Progress value={30} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-1">
                        23 hours • 15 lessons
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">German</span>
                        <Badge variant="secondary">Beginner</Badge>
                      </div>
                      <Progress value={15} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-1">
                        10 hours • 4 lessons
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">
                          Complete 50 Spanish lessons
                        </span>
                        <span className="text-sm text-muted-foreground">
                          28/50
                        </span>
                      </div>
                      <Progress value={56} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">
                          Reach B2 level in Spanish
                        </span>
                        <span className="text-sm text-muted-foreground">
                          65%
                        </span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Learn 500 new words</span>
                        <span className="text-sm text-muted-foreground">
                          312/500
                        </span>
                      </div>
                      <Progress value={62} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "teachers":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Teachers</h2>
              <Button onClick={() => navigate("/teachers")}>
                <Search className="h-4 w-4 mr-2" />
                Find New Teachers
              </Button>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback>MR</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">
                            Maria Rodriguez
                          </h4>
                          <p className="text-muted-foreground">
                            Spanish Teacher
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">4.9</span>
                            <span className="text-sm text-muted-foreground">
                              (127 reviews)
                            </span>
                          </div>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary">Conversation</Badge>
                            <Badge variant="secondary">Grammar</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Pricing Options */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h5 className="font-medium mb-3">
                          Lesson Options & Pricing
                        </h5>

                        {/* Individual Lessons */}
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Individual Lessons
                          </p>
                          <div className="flex gap-3 flex-wrap">
                            <div className="bg-white rounded p-2 border text-center min-w-[80px]">
                              <p className="text-xs text-muted-foreground">
                                30 min
                              </p>
                              <p className="font-semibold">$20</p>
                            </div>
                            <div className="bg-white rounded p-2 border text-center min-w-[80px]">
                              <p className="text-xs text-muted-foreground">
                                60 min
                              </p>
                              <p className="font-semibold">$35</p>
                            </div>
                            <div className="bg-white rounded p-2 border text-center min-w-[80px]">
                              <p className="text-xs text-muted-foreground">
                                90 min
                              </p>
                              <p className="font-semibold">$50</p>
                            </div>
                          </div>
                        </div>

                        {/* Package Lessons */}
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Package Deals
                          </p>
                          <div className="flex gap-3 flex-wrap">
                            <div className="bg-green-50 rounded p-2 border border-green-200 text-center min-w-[100px]">
                              <p className="text-xs text-green-700">
                                5 lessons
                              </p>
                              <p className="font-semibold text-green-800">
                                $160
                              </p>
                              <p className="text-xs text-green-600">8% off</p>
                            </div>
                            <div className="bg-green-50 rounded p-2 border border-green-200 text-center min-w-[100px]">
                              <p className="text-xs text-green-700">
                                10 lessons
                              </p>
                              <p className="font-semibold text-green-800">
                                $300
                              </p>
                              <p className="text-xs text-green-600">14% off</p>
                            </div>
                            <div className="bg-green-50 rounded p-2 border border-green-200 text-center min-w-[100px]">
                              <p className="text-xs text-green-700">
                                20 lessons
                              </p>
                              <p className="font-semibold text-green-800">
                                $560
                              </p>
                              <p className="text-xs text-green-600">20% off</p>
                            </div>
                          </div>
                        </div>

                        {/* Group Lessons */}
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Group Lessons
                          </p>
                          <div className="flex gap-3 flex-wrap">
                            <div className="bg-blue-50 rounded p-2 border border-blue-200 text-center min-w-[100px]">
                              <p className="text-xs text-blue-700">
                                2-3 students
                              </p>
                              <p className="font-semibold text-blue-800">
                                $22/person
                              </p>
                            </div>
                            <div className="bg-blue-50 rounded p-2 border border-blue-200 text-center min-w-[100px]">
                              <p className="text-xs text-blue-700">
                                4-6 students
                              </p>
                              <p className="font-semibold text-blue-800">
                                $18/person
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button className="flex-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Lesson
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">Jean Dubois</h4>
                          <p className="text-muted-foreground">
                            French Teacher
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">4.8</span>
                            <span className="text-sm text-muted-foreground">
                              (89 reviews)
                            </span>
                          </div>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary">Pronunciation</Badge>
                            <Badge variant="secondary">Literature</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Pricing Options */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h5 className="font-medium mb-3">
                          Lesson Options & Pricing
                        </h5>

                        {/* Individual Lessons */}
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Individual Lessons
                          </p>
                          <div className="flex gap-3 flex-wrap">
                            <div className="bg-white rounded p-2 border text-center min-w-[80px]">
                              <p className="text-xs text-muted-foreground">
                                30 min
                              </p>
                              <p className="font-semibold">$25</p>
                            </div>
                            <div className="bg-white rounded p-2 border text-center min-w-[80px]">
                              <p className="text-xs text-muted-foreground">
                                60 min
                              </p>
                              <p className="font-semibold">$45</p>
                            </div>
                            <div className="bg-white rounded p-2 border text-center min-w-[80px]">
                              <p className="text-xs text-muted-foreground">
                                90 min
                              </p>
                              <p className="font-semibold">$65</p>
                            </div>
                          </div>
                        </div>

                        {/* Package Lessons */}
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Package Deals
                          </p>
                          <div className="flex gap-3 flex-wrap">
                            <div className="bg-green-50 rounded p-2 border border-green-200 text-center min-w-[100px]">
                              <p className="text-xs text-green-700">
                                5 lessons
                              </p>
                              <p className="font-semibold text-green-800">
                                $200
                              </p>
                              <p className="text-xs text-green-600">11% off</p>
                            </div>
                            <div className="bg-green-50 rounded p-2 border border-green-200 text-center min-w-[100px]">
                              <p className="text-xs text-green-700">
                                15 lessons
                              </p>
                              <p className="font-semibold text-green-800">
                                $580
                              </p>
                              <p className="text-xs text-green-600">14% off</p>
                            </div>
                            <div className="bg-green-50 rounded p-2 border border-green-200 text-center min-w-[100px]">
                              <p className="text-xs text-green-700">
                                25 lessons
                              </p>
                              <p className="font-semibold text-green-800">
                                $900
                              </p>
                              <p className="text-xs text-green-600">20% off</p>
                            </div>
                          </div>
                        </div>

                        {/* Group Lessons */}
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Group Lessons
                          </p>
                          <div className="flex gap-3 flex-wrap">
                            <div className="bg-blue-50 rounded p-2 border border-blue-200 text-center min-w-[100px]">
                              <p className="text-xs text-blue-700">
                                2-4 students
                              </p>
                              <p className="font-semibold text-blue-800">
                                $28/person
                              </p>
                            </div>
                            <div className="bg-blue-50 rounded p-2 border border-blue-200 text-center min-w-[100px]">
                              <p className="text-xs text-blue-700">
                                5-8 students
                              </p>
                              <p className="font-semibold text-blue-800">
                                $22/person
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button className="flex-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Lesson
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">
                            Anna Mueller
                          </h4>
                          <p className="text-muted-foreground">
                            German Teacher
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">4.7</span>
                            <span className="text-sm text-muted-foreground">
                              (64 reviews)
                            </span>
                          </div>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary">Business German</Badge>
                            <Badge variant="secondary">Grammar</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Pricing Options */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h5 className="font-medium mb-3">
                          Lesson Options & Pricing
                        </h5>

                        {/* Individual Lessons */}
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Individual Lessons
                          </p>
                          <div className="flex gap-3 flex-wrap">
                            <div className="bg-white rounded p-2 border text-center min-w-[80px]">
                              <p className="text-xs text-muted-foreground">
                                45 min
                              </p>
                              <p className="font-semibold">$32</p>
                            </div>
                            <div className="bg-white rounded p-2 border text-center min-w-[80px]">
                              <p className="text-xs text-muted-foreground">
                                60 min
                              </p>
                              <p className="font-semibold">$40</p>
                            </div>
                            <div className="bg-white rounded p-2 border text-center min-w-[80px]">
                              <p className="text-xs text-muted-foreground">
                                90 min
                              </p>
                              <p className="font-semibold">$58</p>
                            </div>
                          </div>
                        </div>

                        {/* Package Lessons */}
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Package Deals
                          </p>
                          <div className="flex gap-3 flex-wrap">
                            <div className="bg-green-50 rounded p-2 border border-green-200 text-center min-w-[100px]">
                              <p className="text-xs text-green-700">
                                8 lessons
                              </p>
                              <p className="font-semibold text-green-800">
                                $288
                              </p>
                              <p className="text-xs text-green-600">10% off</p>
                            </div>
                            <div className="bg-green-50 rounded p-2 border border-green-200 text-center min-w-[100px]">
                              <p className="text-xs text-green-700">
                                12 lessons
                              </p>
                              <p className="font-semibold text-green-800">
                                $408
                              </p>
                              <p className="text-xs text-green-600">15% off</p>
                            </div>
                            <div className="bg-green-50 rounded p-2 border border-green-200 text-center min-w-[100px]">
                              <p className="text-xs text-green-700">
                                20 lessons
                              </p>
                              <p className="font-semibold text-green-800">
                                $640
                              </p>
                              <p className="text-xs text-green-600">20% off</p>
                            </div>
                          </div>
                        </div>

                        {/* Group Lessons */}
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Group Lessons
                          </p>
                          <div className="flex gap-3 flex-wrap">
                            <div className="bg-blue-50 rounded p-2 border border-blue-200 text-center min-w-[100px]">
                              <p className="text-xs text-blue-700">
                                2-3 students
                              </p>
                              <p className="font-semibold text-blue-800">
                                $25/person
                              </p>
                            </div>
                            <div className="bg-blue-50 rounded p-2 border border-blue-200 text-center min-w-[100px]">
                              <p className="text-xs text-blue-700">
                                4-6 students
                              </p>
                              <p className="font-semibold text-blue-800">
                                $20/person
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button className="flex-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Lesson
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "wallet":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Wallet & Payments</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    ${dashboardStats?.walletBalance?.toFixed(2) || "0.00"}
                  </div>
                  <Button className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Funds
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$125.00</div>
                  <p className="text-sm text-muted-foreground">
                    Spent on lessons
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Next Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$35.00</div>
                  <p className="text-sm text-muted-foreground">Due tomorrow</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Spanish lesson with Maria</p>
                        <p className="text-sm text-muted-foreground">
                          Jan 18, 2024
                        </p>
                      </div>
                    </div>
                    <span className="text-red-600">-$25.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Wallet top-up</p>
                        <p className="text-sm text-muted-foreground">
                          Jan 15, 2024
                        </p>
                      </div>
                    </div>
                    <span className="text-green-600">+$100.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "messages":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Messages</h2>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No messages yet</p>
                  <Button
                    className="mt-4"
                    onClick={() => navigate("/messages")}
                  >
                    Open Messages
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "goals":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Learning Goals</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Set New Goal
              </Button>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">
                      Complete 20 Spanish lessons
                    </h4>
                    <span className="text-sm text-muted-foreground">15/20</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    75% complete
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Reach intermediate level</h4>
                    <span className="text-sm text-muted-foreground">
                      45/100
                    </span>
                  </div>
                  <Progress value={45} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    45% complete
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Improve pronunciation</h4>
                    <span className="text-sm text-muted-foreground">6/10</span>
                  </div>
                  <Progress value={60} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    60% complete
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "resources":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Learning Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Study Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Access your downloaded materials and resources.
                  </p>
                  <Button className="w-full mt-4">Browse Materials</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Practice Exercises</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Practice with interactive exercises and quizzes.
                  </p>
                  <Button className="w-full mt-4">Start Practice</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Language Exchange</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Connect with native speakers for language exchange.
                  </p>
                  <Button className="w-full mt-4">Find Partners</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Study Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Join or create study groups with other learners.
                  </p>
                  <Button className="w-full mt-4">Browse Groups</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Account Settings</h2>

            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <input
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      defaultValue={studentData?.name}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <input
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      defaultValue={studentData?.email}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Native Language
                    </label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-md">
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Timezone</label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-md">
                      <option value="UTC-5">UTC-5 (Eastern)</option>
                      <option value="UTC-6">UTC-6 (Central)</option>
                      <option value="UTC-7">UTC-7 (Mountain)</option>
                      <option value="UTC-8">UTC-8 (Pacific)</option>
                    </select>
                  </div>
                </div>
                <Button className="w-full">Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Lesson reminders
                  </label>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Weekly progress summary
                  </label>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Teacher updates</label>
                  <input type="checkbox" />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              {menuItems.find((item) => item.id === activeTab)?.title}
            </h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  {menuItems.find((item) => item.id === activeTab)?.title}{" "}
                  content coming soon...
                </p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SidebarProvider>
        <div className="flex w-full">
          <Sidebar>
            <SidebarHeader className="border-b p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={studentData?.avatar} />
                  <AvatarFallback>
                    {studentData?.name?.charAt(0) || "S"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">
                    {studentData?.name || "Student"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {studentData?.primaryLanguage || "Language Learner"} •
                    Online
                  </p>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent className="p-4">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.title}
                  </Button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-medium mb-3">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Lessons</span>
                    <span className="font-medium">
                      {dashboardStats?.totalLessons || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Hours</span>
                    <span className="font-medium">
                      {dashboardStats?.totalHours || 0}h
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Streak</span>
                    <span className="font-medium">
                      {dashboardStats?.currentStreak || 0} days
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Balance</span>
                    <span className="font-medium">
                      ${dashboardStats?.walletBalance?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-2" />
                    View Public Profile
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset>
            <main className="flex-1 p-6">
              <div className="flex items-center gap-2 mb-6">
                <div>
                  <h1 className="text-2xl font-bold">
                    {menuItems.find((item) => item.id === activeTab)?.title ||
                      "Dashboard"}
                  </h1>
                  <p className="text-muted-foreground">
                    Welcome back, {studentData?.name}! 🎓
                  </p>
                </div>
              </div>
              {renderContent()}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
