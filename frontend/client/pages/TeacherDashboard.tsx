import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
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
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/database";
import { useToast } from "@/components/ui/use-toast";

const menuItems = [
  {
    title: "Overview",
    icon: Home,
    id: "overview",
  },
  {
    title: "Schedule",
    icon: Calendar,
    id: "schedule",
  },
  {
    title: "Students",
    icon: Users,
    id: "students",
  },
  {
    title: "Earnings",
    icon: DollarSign,
    id: "earnings",
  },
  {
    title: "Pricing",
    icon: CreditCard,
    id: "pricing",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    id: "analytics",
  },
  {
    title: "Messages",
    icon: MessageCircle,
    id: "messages",
  },
  {
    title: "Resources",
    icon: FileText,
    id: "resources",
  },
  {
    title: "Settings",
    icon: Settings,
    id: "settings",
  },
];

export default function TeacherDashboard() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [teacherData, setTeacherData] = useState<any>(null);
  const [dashboardStats, setDashboardStats] = useState<any>({});
  const [upcomingLessons, setUpcomingLessons] = useState<any[]>([]);
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState<any>({});
  const [availabilityForm, setAvailabilityForm] = useState<any>({});
  const [pricingData, setPricingData] = useState<any>({
    individualLessons: {
      30: 25,
      60: 45,
      90: 65,
    },
    packageDeals: [
      { lessons: 5, discount: 10, price: 200 },
      { lessons: 10, discount: 15, price: 380 },
      { lessons: 20, discount: 20, price: 720 },
    ],
    groupLessons: [
      { size: 2, pricePerPerson: 35 },
      { size: 3, pricePerPerson: 30 },
      { size: 4, pricePerPerson: 25 },
    ],
    trialLessonsEnabled: true,
    specialOffers: {
      firstLessonDiscount: false,
      referralDiscount: false,
    },
  });

  useEffect(() => {
    const loadTeacherData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // First check if teacher exists in database
        const teachers = db.getTeachers({ status: "approved" });
        let teacherFound = teachers.find(
          (t) => t.id === user.id || t.email === user.email,
        );

        // If no teacher found, create one for demo purposes
        if (!teacherFound) {
          const newTeacher = {
            id: user.id,
            name: user.name || "Demo Teacher",
            email: user.email || "teacher@demo.com",
            avatar: "/placeholder-teacher.jpg",
            languages: ["English", "Spanish"],
            nativeLanguage: "English",
            rating: 4.8,
            reviewCount: 25,
            price: 25,
            currency: "USD",
            availability: ["morning", "afternoon"],
            specialties: ["Business English", "Conversation"],
            experience: 5,
            description:
              "Experienced language teacher passionate about helping students achieve their goals.",
            video: "",
            isOnline: true,
            responseTime: "within 2 hours",
            completedLessons: 45,
            badges: ["Certified", "Top Rated"],
            country: "United States",
            timezone: "America/New_York",
            firstName: (user.name || "Demo").split(" ")[0],
            lastName: (user.name || "Teacher").split(" ")[1] || "Teacher",
            bio: "Experienced language teacher passionate about helping students achieve their goals.",
            hourlyRate: 25,
            status: "approved",
            applicationData: {},
            createdAt: new Date().toISOString(),
            earnings: 1125,
          };

          // Add teacher to database
          db.addTeacher(newTeacher);
          teacherFound = newTeacher;

          // Create some demo students and lessons for this teacher
          const demoStudents = [
            {
              id: "student-demo-1",
              name: "Alice Johnson",
              email: "alice@example.com",
              avatar: "/placeholder-student.jpg",
              learningLanguages: ["Spanish"],
              nativeLanguage: "English",
              level: { Spanish: "Intermediate" },
              joinedDate: "2024-01-15",
              completedLessons: 15,
              walletBalance: 250,
              password: "demo123",
              status: "active",
              createdAt: "2024-01-15",
            },
            {
              id: "student-demo-2",
              name: "Bob Martinez",
              email: "bob@example.com",
              avatar: "/placeholder-student.jpg",
              learningLanguages: ["English"],
              nativeLanguage: "Spanish",
              level: { English: "Advanced" },
              joinedDate: "2024-02-01",
              completedLessons: 22,
              walletBalance: 180,
              password: "demo123",
              status: "active",
              createdAt: "2024-02-01",
            },
          ];

          // Add demo students to database
          demoStudents.forEach((student) => {
            const existingStudent = db
              .getUsers()
              .find((u) => u.id === student.id);
            if (!existingStudent) {
              db.addUser(student);
            }
          });

          // Create demo lessons
          const demoLessons = [
            {
              id: "lesson-demo-1",
              studentId: "student-demo-1",
              teacherId: user.id,
              language: "Spanish",
              level: "Intermediate",
              duration: 60,
              price: 25,
              status: "completed",
              scheduledAt: new Date(
                Date.now() - 7 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              type: "regular",
            },
            {
              id: "lesson-demo-2",
              studentId: "student-demo-2",
              teacherId: user.id,
              language: "English",
              level: "Advanced",
              duration: 60,
              price: 25,
              status: "completed",
              scheduledAt: new Date(
                Date.now() - 3 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              type: "regular",
            },
          ];

          // Add demo lessons
          demoLessons.forEach((lesson) => {
            db.createLesson(lesson);
          });
        }

        // Get comprehensive teacher data
        let data = db.getTeacherDashboardData(teacherFound.id);

        if (!data) {
          // Create comprehensive mock teacher data
          data = {
            teacher: {
              id: user.id,
              name: user.name || "Alex Rodriguez",
              email: user.email || "alex@talkcon.com",
              profileImage: "/placeholder-teacher.jpg",
              rating: 4.8,
              bio: "Experienced Spanish and English teacher with 8+ years of teaching experience. Specializing in business communication and conversation practice.",
              languages: ["Spanish", "English"],
              specializations: ["Business Spanish", "Conversation", "Grammar"],
              hourlyRate: 25,
              country: "Spain",
              status: "approved",
              responseTime: "within 1 hour",
              isOnline: true,
              completedLessons: 245,
              totalHours: 367.5,
              totalEarnings: 6125.0,
              uniqueStudents: 48,
              studentRetentionRate: 87,
            },
            stats: {
              totalLessons: 245,
              totalHours: 367.5,
              totalEarnings: 6125.0,
              uniqueStudents: 48,
              averageRating: 4.8,
              monthlyEarnings: 485.5,
              pendingPayouts: 345.8,
              thisWeekLessons: 12,
              nextWeekBookings: 8,
            },
            upcomingLessons: [
              {
                id: "lesson-1",
                studentName: "John Smith",
                studentAvatar: "/placeholder-student.jpg",
                subject: "Business Spanish",
                date: "Today",
                startTime: "2:00 PM",
                endTime: "3:00 PM",
                duration: 60,
                level: "Intermediate",
                price: 25,
                type: "regular",
              },
              {
                id: "lesson-2",
                studentName: "Emma Wilson",
                studentAvatar: "/placeholder-student.jpg",
                subject: "Spanish Conversation",
                date: "Today",
                startTime: "4:00 PM",
                endTime: "5:00 PM",
                duration: 60,
                level: "Advanced",
                price: 25,
                type: "regular",
              },
              {
                id: "lesson-3",
                studentName: "Michael Chen",
                studentAvatar: "/placeholder-student.jpg",
                subject: "Trial Lesson",
                date: "Tomorrow",
                startTime: "10:00 AM",
                endTime: "10:30 AM",
                duration: 30,
                level: "Beginner",
                price: 5,
                type: "trial",
              },
            ],
            recentStudents: [
              {
                id: "student-1",
                name: "Alice Johnson",
                avatar: "/placeholder-student.jpg",
                language: "Spanish",
                level: "Intermediate",
                lessonsCount: 15,
                lastLesson: "2 days ago",
                progress: 75,
              },
              {
                id: "student-2",
                name: "Bob Martinez",
                avatar: "/placeholder-student.jpg",
                language: "English",
                level: "Advanced",
                lessonsCount: 22,
                lastLesson: "1 week ago",
                progress: 90,
              },
              {
                id: "student-3",
                name: "Carol Li",
                avatar: "/placeholder-student.jpg",
                language: "Spanish",
                level: "Beginner",
                lessonsCount: 8,
                lastLesson: "3 days ago",
                progress: 40,
              },
            ],
            earningsData: [
              { month: "Jan", earnings: 520 },
              { month: "Feb", earnings: 680 },
              { month: "Mar", earnings: 750 },
              { month: "Apr", earnings: 580 },
              { month: "May", earnings: 820 },
              { month: "Jun", earnings: 945 },
            ],
            lessonTypeData: [
              { name: "Regular", value: 78, fill: "#8B5CF6" },
              { name: "Trial", value: 15, fill: "#06B6D4" },
              { name: "Package", value: 7, fill: "#10B981" },
            ],
            weeklySchedule: [
              { day: "Mon", lessons: 6 },
              { day: "Tue", lessons: 4 },
              { day: "Wed", lessons: 8 },
              { day: "Thu", lessons: 5 },
              { day: "Fri", lessons: 7 },
              { day: "Sat", lessons: 3 },
              { day: "Sun", lessons: 2 },
            ],
          };
        }

        setTeacherData(data.teacher);
        setDashboardStats(data.stats);
        setUpcomingLessons(data.upcomingLessons || []);

        // Load real student data from database
        const realStudents = db.getTeacherStudents(teacherFound.id);
        setRecentStudents(
          realStudents.length > 0 ? realStudents : data.recentStudents || [],
        );

        setEarnings(data.earningsData || []);
      } catch (error) {
        console.error("Failed to load teacher data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTeacherData();
  }, [user?.id, toast]);

  // Auto-refresh data every 30 seconds to stay synced with admin dashboard
  useEffect(() => {
    if (!teacherData?.id) return;

    const interval = setInterval(() => {
      refreshDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, [teacherData?.id]);

  // Action handlers for dashboard functionality
  const handleStartLesson = (lessonId: string) => {
    toast({
      title: "Starting Lesson",
      description: "Redirecting to lesson room...",
    });
    navigate(`/lesson/${lessonId}`);
  };

  const handleMessageStudent = (studentId: string, studentName: string) => {
    toast({
      title: "Opening Messages",
      description: `Starting conversation with ${studentName}`,
    });
    navigate(`/messages?user=${studentId}`);
  };

  const handleViewStudentProfile = (studentId: string) => {
    toast({
      title: "Student Profile",
      description: "Opening student profile...",
    });
    navigate(`/student/${studentId}`);
  };

  const handleUpdateAvailability = () => {
    try {
      // For now, create a default availability schedule
      const defaultAvailability = [
        {
          day: "Monday",
          startTime: "09:00",
          endTime: "17:00",
          available: true,
        },
        {
          day: "Tuesday",
          startTime: "09:00",
          endTime: "17:00",
          available: true,
        },
        {
          day: "Wednesday",
          startTime: "09:00",
          endTime: "17:00",
          available: true,
        },
        {
          day: "Thursday",
          startTime: "09:00",
          endTime: "17:00",
          available: true,
        },
        {
          day: "Friday",
          startTime: "09:00",
          endTime: "17:00",
          available: true,
        },
        {
          day: "Saturday",
          startTime: "10:00",
          endTime: "16:00",
          available: false,
        },
        {
          day: "Sunday",
          startTime: "10:00",
          endTime: "16:00",
          available: false,
        },
      ];

      db.setTeacherAvailability(teacherData.id, defaultAvailability);
      toast({
        title: "Availability Updated",
        description: "Your teaching schedule has been updated successfully.",
      });

      refreshDashboardData();
    } catch (error) {
      console.error("Availability update error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update availability.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = () => {
    try {
      // Collect form data from DOM elements
      const form = document.querySelector("#profile-form") as HTMLFormElement;
      if (!form) {
        throw new Error("Profile form not found");
      }

      const formData = new FormData(form);
      const profileData = {
        name: (formData.get("name") as string) || teacherData.name,
        hourlyRate:
          Number(formData.get("hourlyRate")) || teacherData.hourlyRate,
        country: (formData.get("country") as string) || teacherData.country,
        bio: (formData.get("bio") as string) || teacherData.bio,
      };

      db.updateTeacher(teacherData.id, profileData);
      setTeacherData({ ...teacherData, ...profileData });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });

      // Refresh dashboard data
      refreshDashboardData();
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  const refreshDashboardData = () => {
    if (!teacherData?.id) return;

    try {
      const updatedData = db.getTeacherDashboardData(teacherData.id);
      if (updatedData) {
        setDashboardStats(updatedData.stats);
        setUpcomingLessons(updatedData.upcomingLessons || []);

        const realStudents = db.getTeacherStudents(teacherData.id);
        setRecentStudents(
          realStudents.length > 0
            ? realStudents
            : updatedData.recentStudents || [],
        );

        setEarnings(updatedData.earningsData || []);
      }
    } catch (error) {
      console.error("Failed to refresh dashboard data:", error);
    }
  };

  const handleRequestPayout = () => {
    try {
      const payoutRequest = {
        teacherId: teacherData.id,
        amount: dashboardStats.pendingPayouts,
        method: "paypal" as const,
        paymentDetails: {
          paypalEmail: teacherData.email,
        },
        notes: "Payout request from teacher dashboard",
      };
      db.createPayoutRequest(payoutRequest);
      toast({
        title: "Payout Requested",
        description: "Your payout request has been submitted for review.",
      });

      // Refresh dashboard to update pending payouts
      refreshDashboardData();
    } catch (error) {
      console.error("Payout request error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit payout request.",
        variant: "destructive",
      });
    }
  };

  const handleCreateMessage = (studentId: string) => {
    navigate(`/messages?student=${studentId}`);
  };

  const handleSavePricing = () => {
    try {
      // Update teacher pricing in database
      db.updateTeacher(teacherData.id, {
        pricing: pricingData,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: "Pricing Updated",
        description: "Your pricing structure has been saved successfully.",
      });

      refreshDashboardData();
    } catch (error) {
      console.error("Pricing update error:", error);
      toast({
        title: "Error",
        description: "Failed to update pricing. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddPackage = (lessons: number, discount: number) => {
    const basePrice = lessons * pricingData.individualLessons[60]; // Use 60min as base
    const discountedPrice = basePrice * (1 - discount / 100);

    const newPackage = {
      lessons,
      discount,
      price: Math.round(discountedPrice),
    };

    setPricingData((prev) => ({
      ...prev,
      packageDeals: [...prev.packageDeals, newPackage],
    }));
  };

  const handleRemovePackage = (index: number) => {
    setPricingData((prev) => ({
      ...prev,
      packageDeals: prev.packageDeals.filter((_, i) => i !== index),
    }));
  };

  const handleAddGroupRate = (size: string, pricePerPerson: number) => {
    const newGroupRate = { size, pricePerPerson };

    setPricingData((prev) => ({
      ...prev,
      groupLessons: [...prev.groupLessons, newGroupRate],
    }));
  };

  const handleUpdateIndividualPrice = (duration: number, price: number) => {
    setPricingData((prev) => ({
      ...prev,
      individualLessons: {
        ...prev.individualLessons,
        [duration]: price,
      },
    }));
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

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Earnings
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${dashboardStats?.totalEarnings?.toFixed(2) || "0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+12% from last month</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Lessons Taught
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardStats?.totalLessons || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-blue-600">
                      {dashboardStats?.totalHours?.toFixed(1) || 0} total hours
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Students
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardStats?.uniqueStudents || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-purple-600">87% retention rate</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardStats?.averageRating?.toFixed(1) || "0.0"}
                  </div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= (dashboardStats?.averageRating || 0)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingLessons.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No lessons scheduled for today
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingLessons.slice(0, 3).map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={lesson.studentAvatar} />
                            <AvatarFallback>
                              {lesson.studentName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">
                              {lesson.studentName}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {lesson.subject}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>
                                {lesson.startTime} - {lesson.endTime}
                              </span>
                              <Badge
                                variant={
                                  lesson.type === "trial"
                                    ? "secondary"
                                    : "outline"
                                }
                                className="text-xs"
                              >
                                {lesson.type === "trial"
                                  ? "Trial"
                                  : lesson.level}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleMessageStudent(
                                lesson.id,
                                lesson.studentName,
                              )
                            }
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleStartLesson(lesson.id)}
                          >
                            <Video className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={earnings}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`$${value}`, "Earnings"]}
                        />
                        <Area
                          type="monotone"
                          dataKey="earnings"
                          stroke="#8B5CF6"
                          fill="#8B5CF6"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Lesson Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={teacherData?.lessonTypeData || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {(teacherData?.lessonTypeData || []).map(
                            (entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ),
                          )}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Schedule */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Weekly Lesson Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={teacherData?.weeklySchedule || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="lessons" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "students":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  My Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback>
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{student.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {student.learningLanguages?.[0] ||
                              student.language ||
                              "Unknown"}{" "}
                            •{" "}
                            {typeof student.level === "object"
                              ? Object.values(student.level)[0]
                              : student.level || "Beginner"}{" "}
                            • {student.lessonsCount} lessons
                          </p>
                          <div className="mt-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                              <span>Progress</span>
                              <span>{student.progress}%</span>
                            </div>
                            <Progress
                              value={student.progress}
                              className="h-2 w-32"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleMessageStudent(student.id, student.name)
                          }
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewStudentProfile(student.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "schedule":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Availability Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Teaching Days</Label>
                    <div className="grid grid-cols-7 gap-2 mt-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day) => (
                          <Button key={day} variant="outline" size="sm">
                            {day}
                          </Button>
                        ),
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Time</Label>
                      <Select defaultValue="09:00">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="06:00">6:00 AM</SelectItem>
                          <SelectItem value="07:00">7:00 AM</SelectItem>
                          <SelectItem value="08:00">8:00 AM</SelectItem>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <Select defaultValue="17:00">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15:00">3:00 PM</SelectItem>
                          <SelectItem value="16:00">4:00 PM</SelectItem>
                          <SelectItem value="17:00">5:00 PM</SelectItem>
                          <SelectItem value="18:00">6:00 PM</SelectItem>
                          <SelectItem value="19:00">7:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleUpdateAvailability} className="w-full">
                    Update Availability
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={teacherData?.weeklySchedule || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="lessons" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
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
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={lesson.studentAvatar} />
                          <AvatarFallback>
                            {lesson.studentName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{lesson.studentName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {lesson.subject}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {lesson.startTime} - {lesson.endTime}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {lesson.level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleMessageStudent(lesson.id, lesson.studentName)
                          }
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleStartLesson(lesson.id)}
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "earnings":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${dashboardStats?.monthlyEarnings?.toFixed(2) || "0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pending Payout</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${dashboardStats?.pendingPayouts?.toFixed(2) || "0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Available for withdrawal
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Earned</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${dashboardStats?.totalEarnings?.toFixed(2) || "0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All time earnings
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Earnings Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={earnings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [`$${value}`, "Earnings"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="earnings"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payout Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" onClick={handleRequestPayout}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Request Payout
                </Button>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Payment Methods
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "pricing":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Pricing Management</h2>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview Student View
              </Button>
            </div>

            {/* Individual Lesson Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Individual Lesson Pricing</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Set different prices for different lesson durations
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price-30">30 Minutes</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="price-30"
                        type="number"
                        placeholder="25"
                        className="pl-8"
                        defaultValue="25"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price-60">60 Minutes</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="price-60"
                        type="number"
                        placeholder="45"
                        className="pl-8"
                        defaultValue="45"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price-90">90 Minutes</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="price-90"
                        type="number"
                        placeholder="65"
                        className="pl-8"
                        defaultValue="65"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enable-custom-duration"
                    className="rounded"
                  />
                  <Label htmlFor="enable-custom-duration">
                    Allow custom duration requests
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Package Deals */}
            <Card>
              <CardHeader>
                <CardTitle>Package Deals</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Offer discounted rates for lesson packages (5-25 lessons)
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                      <Label>Package Size</Label>
                      <select className="w-full px-3 py-2 border rounded-md">
                        <option value="5">5 lessons</option>
                        <option value="8">8 lessons</option>
                        <option value="10">10 lessons</option>
                        <option value="15">15 lessons</option>
                        <option value="20">20 lessons</option>
                        <option value="25">25 lessons</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Discount %</Label>
                      <Input type="number" placeholder="10" min="5" max="30" />
                    </div>
                    <div className="space-y-2">
                      <Label>Final Price</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          type="number"
                          placeholder="200"
                          className="pl-8"
                          readOnly
                        />
                      </div>
                    </div>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Package
                    </Button>
                  </div>

                  {/* Current Packages */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Current Package Deals</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                        <div className="flex items-center gap-4">
                          <span className="font-medium">5 lessons</span>
                          <Badge variant="secondary">10% off</Badge>
                          <span className="text-green-700 font-semibold">
                            $200
                          </span>
                          <span className="text-sm text-muted-foreground">
                            (was $225)
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                        <div className="flex items-center gap-4">
                          <span className="font-medium">10 lessons</span>
                          <Badge variant="secondary">15% off</Badge>
                          <span className="text-green-700 font-semibold">
                            $380
                          </span>
                          <span className="text-sm text-muted-foreground">
                            (was $450)
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                        <div className="flex items-center gap-4">
                          <span className="font-medium">20 lessons</span>
                          <Badge variant="secondary">20% off</Badge>
                          <span className="text-green-700 font-semibold">
                            $720
                          </span>
                          <span className="text-sm text-muted-foreground">
                            (was $900)
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Group Lesson Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Group Lesson Pricing</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Set per-person rates for group lessons
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="enable-group-lessons"
                    className="rounded"
                    defaultChecked
                  />
                  <Label htmlFor="enable-group-lessons">
                    Offer group lessons
                  </Label>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                      <Label>Group Size</Label>
                      <select className="w-full px-3 py-2 border rounded-md">
                        <option value="2">2 students</option>
                        <option value="3">3 students</option>
                        <option value="4">4 students</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Price per person</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          type="number"
                          placeholder="25"
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Group Rate
                    </Button>
                  </div>

                  {/* Current Group Rates */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Current Group Rates</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                        <div className="flex items-center gap-4">
                          <span className="font-medium">2 students</span>
                          <span className="text-blue-700 font-semibold">
                            $35/person
                          </span>
                          <span className="text-sm text-muted-foreground">
                            per 60min lesson
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                        <div className="flex items-center gap-4">
                          <span className="font-medium">3 students</span>
                          <span className="text-blue-700 font-semibold">
                            $30/person
                          </span>
                          <span className="text-sm text-muted-foreground">
                            per 60min lesson
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                        <div className="flex items-center gap-4">
                          <span className="font-medium">4 students</span>
                          <span className="text-blue-700 font-semibold">
                            $25/person
                          </span>
                          <span className="text-sm text-muted-foreground">
                            per 60min lesson
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Special Offers */}
            <Card>
              <CardHeader>
                <CardTitle>Special Offers & Trial Lessons</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Enable special offers and trial lesson availability
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enable-trial-lessons"
                      className="rounded"
                      defaultChecked
                    />
                    <Label htmlFor="enable-trial-lessons">
                      Accept trial lesson bookings
                    </Label>
                    <span className="text-sm text-muted-foreground ml-2">
                      (Pricing set by admin)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enable-first-lesson-discount"
                      className="rounded"
                    />
                    <Label htmlFor="enable-first-lesson-discount">
                      Offer 20% discount for first lesson
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enable-student-referral"
                      className="rounded"
                    />
                    <Label htmlFor="enable-student-referral">
                      Give 10% discount for student referrals
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Changes */}
            <div className="flex items-center gap-4">
              <Button className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Pricing Changes
              </Button>
              <Button variant="outline">Reset to Default</Button>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form id="profile-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        name="name"
                        id="name"
                        defaultValue={teacherData?.name}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input defaultValue={teacherData?.email} disabled />
                    </div>
                    <div>
                      <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                      <Input
                        name="hourlyRate"
                        id="hourlyRate"
                        type="number"
                        defaultValue={teacherData?.hourlyRate || 25}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <select
                        name="country"
                        id="country"
                        defaultValue={teacherData?.country}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Spain">Spain</option>
                        <option value="France">France</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      name="bio"
                      id="bio"
                      defaultValue={teacherData?.bio}
                      placeholder="Tell students about yourself..."
                      rows={4}
                    />
                  </div>
                </form>
                <div>
                  <Label>Languages I Teach</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(teacherData?.languages || []).map((lang: string) => (
                      <Badge key={lang} variant="secondary">
                        {lang}
                        <button className="ml-1 hover:text-destructive">
                          ×
                        </button>
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Language
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Specializations</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(teacherData?.specializations || []).map(
                      (spec: string) => (
                        <Badge key={spec} variant="outline">
                          {spec}
                          <button className="ml-1 hover:text-destructive">
                            ×
                          </button>
                        </Badge>
                      ),
                    )}
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Specialization
                    </Button>
                  </div>
                </div>
                <Button onClick={handleUpdateProfile} className="w-full">
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Teaching Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Preferred Lesson Duration</Label>
                  <Select defaultValue="60">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Response Time</Label>
                  <Select
                    defaultValue={teacherData?.responseTime || "within 2 hours"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="within 1 hour">
                        Within 1 hour
                      </SelectItem>
                      <SelectItem value="within 2 hours">
                        Within 2 hours
                      </SelectItem>
                      <SelectItem value="within 24 hours">
                        Within 24 hours
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="trial-lessons" defaultChecked />
                  <Label htmlFor="trial-lessons">Accept trial lessons</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="auto-approve" />
                  <Label htmlFor="auto-approve">
                    Auto-approve lesson requests
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Email notifications for new bookings</Label>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>SMS reminders for upcoming lessons</Label>
                  <input type="checkbox" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Weekly earnings summary</Label>
                  <input type="checkbox" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "messages":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentStudents.slice(0, 5).map((student: any) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer"
                      onClick={() => handleCreateMessage(student.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback>
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{student.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Last active: {student.lastLesson}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigate("/messages")}
                >
                  View All Messages
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "resources":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Teaching Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/teacher-resources">
                    <FileText className="h-4 w-4 mr-2" />
                    Lesson Plans & Materials
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/teacher-support">
                    <Bell className="h-4 w-4 mr-2" />
                    Teaching Guidelines
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-2" />
                  Certification Programs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Teacher Community
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">
              Content for {activeTab} coming soon...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SidebarProvider>
        <div className="flex w-full">
          <Sidebar>
            <SidebarHeader className="border-b p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={teacherData?.profileImage} />
                  <AvatarFallback>
                    {teacherData?.name?.charAt(0) || "T"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">
                    {teacherData?.name || "Teacher"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Teacher Dashboard
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <div
                      className={`h-2 w-2 rounded-full ${teacherData?.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                    />
                    <span className="text-xs text-muted-foreground">
                      {teacherData?.isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={activeTab === item.id}
                          onClick={() => setActiveTab(item.id)}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-2 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">This week</span>
                      <span className="font-medium">
                        {dashboardStats?.thisWeekLessons || 0} lessons
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Next week</span>
                      <span className="font-medium">
                        {dashboardStats?.nextWeekBookings || 0} bookings
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rating</span>
                      <span className="font-medium flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        {dashboardStats?.averageRating?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to={`/teachers/${teacherData?.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
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
            <SidebarRail />
          </Sidebar>

          <SidebarInset>
            <main className="flex-1 p-6">
              <div className="flex items-center gap-2 mb-6">
                <SidebarTrigger className="md:hidden" />
                <div>
                  <h1 className="text-2xl font-bold">
                    {menuItems.find((item) => item.id === activeTab)?.title ||
                      "Dashboard"}
                  </h1>
                  <p className="text-muted-foreground">
                    Welcome back, {teacherData?.name}! 👨‍🏫
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
