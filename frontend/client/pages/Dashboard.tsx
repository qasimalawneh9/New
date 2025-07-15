import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
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
  Building,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  GraduationCap,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/database";
import { useToast } from "@/components/ui/use-toast";
import { TrialLessonsManager } from "@/components/admin/TrialLessonsManager";
import { DashboardRouter } from "@/components/DashboardRouter";

// Enhanced booking functionality with platform features
interface BookingRequest {
  teacherId: string;
  date: string;
  startTime: string;
  duration: number;
  price: number;
  notes?: string;
}

interface Lesson {
  id: string;
  studentId: string;
  teacherId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
  commission: number; // 20% platform commission
  tax: number; // 7% tax
  totalAmount: number;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  completionStatus: "pending" | "manual" | "auto";
  autoCompleteAt?: string; // 48 hours after lesson end
  reminderSent: boolean;
  rescheduleCount: number;
  createdAt: string;
}

export default function Dashboard() {
  // Use DashboardRouter to automatically redirect based on user type
  return (
    <DashboardRouter>
      <DashboardContent />
    </DashboardRouter>
  );
}

function DashboardContent() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [userLessons, setUserLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [walletStats, setWalletStats] = useState<any>({});
  const [isTeacher, setIsTeacher] = useState(false);
  const [accountMode, setAccountMode] = useState<"teacher" | "student">(
    "student",
  );
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [supportTicketDialogOpen, setSupportTicketDialogOpen] = useState(false);

  // Advanced booking state
  const [bookingStep, setBookingStep] = useState(1);
  const [lessonType, setLessonType] = useState<"single" | "package">("single");
  const [lessonDuration, setLessonDuration] = useState<30 | 60 | 90>(60);
  const [lessonQuantity, setLessonQuantity] = useState(5);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");

  // Trial lesson tracking
  const [trialLessonsUsed, setTrialLessonsUsed] = useState<string[]>([]);
  const [isTrialEligible, setIsTrialEligible] = useState(false);
  const [selectedTeacherData, setSelectedTeacherData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = () => {
    try {
      // Get user details
      const users = db.getUsers();
      const currentUser = users.find((u) => u.id === user?.id);
      setUserData(currentUser);

      // Check if user is also a teacher
      if (user?.email) {
        const teacherAccount = db.getTeacherByEmail(user.email);
        setIsTeacher(!!teacherAccount && teacherAccount.status === "approved");
      }

      // Get user's lessons
      const lessons = db.getLessons({ studentId: user?.id });
      setUserLessons(lessons);

      // Check trial lesson eligibility
      const trialLessons = lessons.filter((lesson) => lesson.price === 5); // $5 trial lessons
      const usedTrialTeachers = trialLessons.map((lesson) => lesson.teacherId);
      setTrialLessonsUsed(usedTrialTeachers);

      // Student can use 3 trial lessons with different teachers
      setIsTrialEligible(usedTrialTeachers.length < 3);

      // Get wallet data
      if (user?.id) {
        const userTransactions = db.getUserTransactions(user.id);
        setTransactions(userTransactions);

        const stats = db.getWalletStats(user.id);
        setWalletStats(stats);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate pricing with 20% commission and 7% tax
  const calculatePricing = (basePrice: number) => {
    const commission = basePrice * 0.2; // 20% platform commission
    const subtotal = basePrice + commission;
    const tax = subtotal * 0.07; // 7% tax on total
    const totalAmount = subtotal + tax;

    return {
      basePrice,
      commission,
      tax,
      totalAmount,
    };
  };

  // Get teacher pricing for different durations
  const getTeacherPricing = (teacherId: string, duration: 30 | 60 | 90) => {
    const teacherPricing: { [key: string]: { [key: number]: number } } = {
      maria: { 30: 18, 60: 25, 90: 35 },
      james: { 30: 22, 60: 30, 90: 42 },
      sophie: { 30: 20, 60: 28, 90: 38 },
      hans: { 30: 19, 60: 26, 90: 36 },
      li: { 30: 21, 60: 29, 90: 40 },
    };
    return teacherPricing[teacherId]?.[duration] || 25;
  };

  // Get package pricing (teachers can offer discounts for packages)
  const getPackagePricing = (
    teacherId: string,
    duration: 30 | 60 | 90,
    quantity: number,
  ) => {
    const singleLessonPrice = getTeacherPricing(teacherId, duration);

    // Package discounts: 5-9 lessons (5%), 10-19 lessons (10%), 20+ lessons (15%)
    let discountRate = 0;
    if (quantity >= 20) discountRate = 0.15;
    else if (quantity >= 10) discountRate = 0.1;
    else if (quantity >= 5) discountRate = 0.05;

    const totalPrice = singleLessonPrice * quantity;
    const discountAmount = totalPrice * discountRate;
    const finalPrice = totalPrice - discountAmount;

    return {
      originalPrice: totalPrice,
      discountAmount,
      finalPrice,
      discountRate,
      pricePerLesson: finalPrice / quantity,
    };
  };

  // Check if student can take trial lesson with selected teacher
  const canTakeTrialWithTeacher = (teacherId: string) => {
    return isTrialEligible && !trialLessonsUsed.includes(teacherId);
  };

  // Calculate real-time booking price with trial lesson logic
  const calculateBookingPrice = () => {
    if (!selectedTeacherData)
      return {
        basePrice: 0,
        commission: 0,
        tax: 0,
        totalAmount: 0,
        teacherEarnings: 0,
        isTrialLesson: false,
        trialRemainingCount: 0,
      };

    // Check if this should be a trial lesson
    const isTrialLesson =
      canTakeTrialWithTeacher(selectedTeacherData.id) &&
      lessonType === "single";
    const trialRemainingCount = 3 - trialLessonsUsed.length;

    let basePrice = 0;

    if (isTrialLesson) {
      // Trial lesson fixed price $5
      basePrice = 5;
    } else if (lessonType === "single") {
      basePrice = getTeacherPricing(selectedTeacherData.id, lessonDuration);
    } else {
      const packageData = getPackagePricing(
        selectedTeacherData.id,
        lessonDuration,
        lessonQuantity,
      );
      basePrice = packageData.finalPrice;
    }

    const commission = basePrice * 0.2; // 20% commission
    const tax = basePrice * 0.1; // 10% tax on base price
    const totalAmount = basePrice + tax; // Student pays base price + tax
    const teacherEarnings = basePrice - commission; // Teacher receives base price minus commission

    return {
      basePrice,
      commission,
      tax,
      totalAmount,
      teacherEarnings,
      isTrialLesson,
      trialRemainingCount,
    };
  };

  // Reset booking dialog state
  const resetBookingDialog = () => {
    setBookingStep(1);
    setLessonType("single");
    setLessonDuration(60);
    setLessonQuantity(5);
    setBookingDate("");
    setBookingTime("");
    setSelectedTeacherData(null);
  };

  // Book lesson with automatic pricing and 48-hour auto-completion
  const bookLesson = async (
    teacherId: string,
    price: number,
    date: string,
    time: string,
  ) => {
    const pricing = calculatePricing(price);

    const newLesson: Lesson = {
      id: `lesson_${Date.now()}`,
      studentId: user?.id || "",
      teacherId: teacherId,
      date: date,
      startTime: time,
      endTime: time, // Would calculate based on duration
      duration: 60, // Default 1 hour
      price: price,
      commission: pricing.commission,
      tax: pricing.tax,
      totalAmount: pricing.totalAmount,
      status: "scheduled",
      completionStatus: "pending",
      autoCompleteAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      reminderSent: false,
      rescheduleCount: 0,
      createdAt: new Date().toISOString(),
    };

    // Schedule 30-minute reminder
    setTimeout(
      () => {
        toast({
          title: "Lesson Reminder ⏰",
          description: `Your lesson starts in 30 minutes!`,
        });
      },
      30 * 60 * 1000,
    ); // 30 minutes

    // Schedule auto-completion after 48 hours
    setTimeout(
      () => {
        toast({
          title: "Lesson Auto-Completed",
          description:
            "Lesson marked as completed automatically after 48 hours.",
        });
      },
      48 * 60 * 60 * 1000,
    ); // 48 hours

    toast({
      title: "Lesson Booked Successfully! 🎉",
      description: `Total: $${pricing.totalAmount.toFixed(2)} (includes 20% commission + 7% tax)`,
    });

    setBookingDialogOpen(false);
  };

  // Manual lesson completion by student
  const completeLesson = (lessonId: string) => {
    toast({
      title: "Lesson Completed! ✅",
      description: "Thank you for confirming lesson completion.",
    });
  };

  // Create support ticket
  const createSupportTicket = (
    category: string,
    title: string,
    description: string,
  ) => {
    const ticket = {
      id: `ticket_${Date.now()}`,
      userId: user?.id || "",
      category: category,
      title: title,
      description: description,
      status: "open",
      createdAt: new Date().toISOString(),
    };

    toast({
      title: "Support Ticket Created",
      description: "We'll respond to your ticket within 24 hours.",
    });

    setSupportTicketDialogOpen(false);
  };

  const handleAccountModeSwitch = (mode: "teacher" | "student") => {
    setAccountMode(mode);
    if (mode === "teacher") {
      toast({
        title: "Switched to Teacher Mode",
        description: "Redirecting to your teacher dashboard...",
      });
      navigate("/teacher-dashboard");
    } else {
      toast({
        title: "Switched to Student Mode",
        description: "You are now in student mode.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (user?.type === "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  Admin Dashboard
                  <Badge variant="destructive" className="text-xs">
                    <Building className="w-3 h-3 mr-1" />
                    Administrator
                  </Badge>
                </h1>
                <p className="text-muted-foreground">
                  Manage trial lessons and platform settings
                </p>
              </div>
            </div>
          </div>

          <TrialLessonsManager />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold">
                  {t("dashboard.welcome")}, {user?.name || "Student"}! 👋
                </h1>
                <Badge variant="secondary" className="text-xs">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Student Mode
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Continue your language learning journey
              </p>
            </div>

            {/* Account Mode Switch - Only show if user is also a teacher */}
            {isTeacher && (
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 px-3 text-xs font-medium"
                  disabled
                >
                  <BookOpen className="w-4 h-4 mr-1.5" />
                  Student
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAccountModeSwitch("teacher")}
                  className="h-8 px-3 text-xs font-medium hover:bg-primary hover:text-white"
                >
                  <GraduationCap className="w-4 h-4 mr-1.5" />
                  Teacher
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold">
                    {Math.round(userData?.hoursLearned || 0)}
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
                  <p className="text-sm text-muted-foreground">Lessons</p>
                  <p className="text-2xl font-bold">
                    {userData?.completedLessons || 0}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Current Streak
                  </p>
                  <p className="text-2xl font-bold">12 days</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">4.8</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setWalletModalOpen(true)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Wallet Balance
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ${(userData?.walletBalance || 0).toFixed(2)}
                  </p>
                </div>
                <Wallet className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Lessons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      teacher: "Maria Rodriguez",
                      language: "Spanish",
                      time: "Today, 3:00 PM",
                      type: "Conversation Practice",
                    },
                    {
                      teacher: "James Wilson",
                      language: "English",
                      time: "Tomorrow, 10:00 AM",
                      type: "Business English",
                    },
                  ].map((lesson, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{lesson.teacher}</p>
                        <p className="text-sm text-muted-foreground">
                          {lesson.language} - {lesson.type}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {lesson.time}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          Join
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Spanish</span>
                      <span className="text-sm text-muted-foreground">
                        Intermediate
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: "75%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">English</span>
                      <span className="text-sm text-muted-foreground">
                        Advanced
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full"
                        style={{ width: "90%" }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  onClick={() => setBookingDialogOpen(true)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book a Lesson
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Teacher
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Study Materials
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setSupportTicketDialogOpen(true)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Support Ticket
                </Button>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      🔥
                    </div>
                    <div>
                      <p className="font-medium text-sm">10-Day Streak</p>
                      <p className="text-xs text-muted-foreground">
                        Keep it up!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      💬
                    </div>
                    <div>
                      <p className="font-medium text-sm">Conversation Master</p>
                      <p className="text-xs text-muted-foreground">
                        50 lessons completed
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Messages
                  <Badge>3</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium text-sm">Maria Rodriguez</p>
                    <p className="text-xs text-muted-foreground">
                      Great job in today's lesson! Here's your homework...
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium text-sm">James Wilson</p>
                    <p className="text-xs text-muted-foreground">
                      Don't forget about tomorrow's business presentation...
                    </p>
                  </div>
                </div>
                <Button variant="ghost" className="w-full mt-3" size="sm">
                  View All Messages
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Teacher Mode Switch - Only show if user is also a teacher */}
      {isTeacher && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => handleAccountModeSwitch("teacher")}
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
            size="lg"
          >
            <GraduationCap className="w-6 h-6" />
          </Button>
          <div className="absolute -top-2 -left-16 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
            Switch to Teacher
          </div>
        </div>
      )}

      {/* Advanced Multi-Step Booking Dialog */}
      <Dialog
        open={bookingDialogOpen}
        onOpenChange={(open) => {
          setBookingDialogOpen(open);
          if (!open) resetBookingDialog();
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book a Lesson</DialogTitle>
            <DialogDescription>
              Complete booking in 5 simple steps with real-time pricing
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Step 1: Choose Lesson Type */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🧭</span>
                <Label className="text-base font-semibold">
                  STEP 1 – Choose a Lesson Type:
                </Label>
              </div>

              {/* Show trial lesson info if eligible */}
              {isTrialEligible && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">🎉</span>
                    <span className="font-medium text-green-800">
                      Trial Lesson Available!
                    </span>
                  </div>
                  <p className="text-sm text-green-700">
                    You have {3 - trialLessonsUsed.length} trial lesson(s)
                    remaining. Trial lessons are $5 and you can try different
                    teachers.
                  </p>
                </div>
              )}

              <RadioGroup
                value={lessonType}
                onValueChange={(value) =>
                  setLessonType(value as "single" | "package")
                }
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single">
                    Single Lesson
                    {selectedTeacherData &&
                      canTakeTrialWithTeacher(selectedTeacherData.id) && (
                        <span className="text-green-600 font-medium">
                          {" "}
                          (Trial Available - $5)
                        </span>
                      )}
                  </Label>
                </div>
                {/* Only show package option if not eligible for trial or already used trial with this teacher */}
                {(!isTrialEligible ||
                  (selectedTeacherData &&
                    !canTakeTrialWithTeacher(selectedTeacherData.id))) && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="package" id="package" />
                    <Label htmlFor="package">
                      Lesson Package (Custom Package)
                    </Label>
                  </div>
                )}
              </RadioGroup>
            </div>

            {/* Step 2: Choose Duration */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🕒</span>
                <Label className="text-base font-semibold">
                  STEP 2 – Choose Lesson Duration:
                </Label>
              </div>
              <RadioGroup
                value={lessonDuration.toString()}
                onValueChange={(value) =>
                  setLessonDuration(parseInt(value) as 30 | 60 | 90)
                }
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30" id="30min" />
                  <Label htmlFor="30min">30 minutes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="60" id="60min" />
                  <Label htmlFor="60min">60 minutes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="90" id="90min" />
                  <Label htmlFor="90min">90 minutes</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Step 3: Package Quantity (if package selected) */}
            {lessonType === "package" && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">📚</span>
                  <Label className="text-base font-semibold">
                    STEP 3 – Select number of lessons:
                  </Label>
                </div>
                <div className="space-y-3">
                  <div className="px-3">
                    <Slider
                      value={[lessonQuantity]}
                      onValueChange={(value) => setLessonQuantity(value[0])}
                      max={25}
                      min={5}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>5 lessons</span>
                    <span className="font-medium">
                      {lessonQuantity} lessons
                    </span>
                    <span>25 lessons</span>
                  </div>
                  <Input
                    type="number"
                    min={5}
                    max={25}
                    value={lessonQuantity}
                    onChange={(e) =>
                      setLessonQuantity(parseInt(e.target.value) || 5)
                    }
                    className="w-20"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Teacher Selection */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">👨‍🏫</span>
                <Label className="text-base font-semibold">
                  STEP 4 – Select Teacher:
                </Label>
              </div>
              <Select
                onValueChange={(teacherId) => {
                  const teachers = {
                    maria: {
                      id: "maria",
                      name: "Maria Rodriguez",
                      language: "Spanish",
                    },
                    james: {
                      id: "james",
                      name: "James Wilson",
                      language: "English",
                    },
                    sophie: {
                      id: "sophie",
                      name: "Sophie Chen",
                      language: "French",
                    },
                    hans: {
                      id: "hans",
                      name: "Hans Mueller",
                      language: "German",
                    },
                    li: { id: "li", name: "Li Wei", language: "Chinese" },
                  };
                  setSelectedTeacherData(
                    teachers[teacherId as keyof typeof teachers],
                  );
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maria">
                    Maria Rodriguez - Spanish ($
                    {getTeacherPricing("maria", lessonDuration)}/
                    {lessonDuration}min)
                  </SelectItem>
                  <SelectItem value="james">
                    James Wilson - English ($
                    {getTeacherPricing("james", lessonDuration)}/
                    {lessonDuration}min)
                  </SelectItem>
                  <SelectItem value="sophie">
                    Sophie Chen - French ($
                    {getTeacherPricing("sophie", lessonDuration)}/
                    {lessonDuration}min)
                  </SelectItem>
                  <SelectItem value="hans">
                    Hans Mueller - German ($
                    {getTeacherPricing("hans", lessonDuration)}/{lessonDuration}
                    min)
                  </SelectItem>
                  <SelectItem value="li">
                    Li Wei - Chinese (${getTeacherPricing("li", lessonDuration)}
                    /{lessonDuration}min)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date and Time Selection */}
            {selectedTeacherData && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Price Summary */}
            {selectedTeacherData && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🧾</span>
                  <Label className="text-base font-semibold">
                    STEP 5 – Price Summary:
                  </Label>
                </div>
                <div
                  className={`p-4 rounded-lg space-y-2 ${
                    calculateBookingPrice().isTrialLesson
                      ? "bg-green-50 border border-green-200"
                      : "bg-muted"
                  }`}
                >
                  {/* Trial lesson indicator */}
                  {calculateBookingPrice().isTrialLesson && (
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-lg">🎉</span>
                      <span className="font-medium text-green-800">
                        Trial Lesson - Fixed Price $5
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Lesson Duration:</span>
                    <span>{lessonDuration} minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Number of Lessons:</span>
                    <span>{lessonType === "single" ? 1 : lessonQuantity}</span>
                  </div>
                  {/* Show regular pricing breakdown for packages (only if not trial) */}
                  {lessonType === "package" &&
                    !calculateBookingPrice().isTrialLesson && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Original Price:</span>
                          <span>
                            $
                            {(
                              getTeacherPricing(
                                selectedTeacherData.id,
                                lessonDuration,
                              ) * lessonQuantity
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Package Discount:</span>
                          <span>
                            -$
                            {getPackagePricing(
                              selectedTeacherData.id,
                              lessonDuration,
                              lessonQuantity,
                            ).discountAmount.toFixed(2)}
                          </span>
                        </div>
                      </>
                    )}

                  {/* Show comparison for trial lessons */}
                  {calculateBookingPrice().isTrialLesson && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Regular Price Would Be:</span>
                      <span>
                        $
                        {getTeacherPricing(
                          selectedTeacherData.id,
                          lessonDuration,
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Price Before Tax:</span>
                    <span>${calculateBookingPrice().basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (10%):</span>
                    <span>${calculateBookingPrice().tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Final Price (Student Pays):</span>
                      <span>
                        ${calculateBookingPrice().totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    <div>
                      • Teacher receives $
                      {calculateBookingPrice().teacherEarnings.toFixed(2)}{" "}
                      (after 20% commission)
                    </div>
                    <div>• Student pays full total including tax</div>
                    {calculateBookingPrice().isTrialLesson && (
                      <div className="text-green-700 font-medium">
                        • This is a trial lesson - you have{" "}
                        {calculateBookingPrice().trialRemainingCount - 1} trials
                        left after this
                      </div>
                    )}
                    <div>
                      • Lesson auto-completes in 48 hours if not manually
                      confirmed
                    </div>
                    <div>• 30-minute reminder before lesson starts</div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setBookingDialogOpen(false);
                  resetBookingDialog();
                }}
              >
                Cancel
              </Button>
              {selectedTeacherData && bookingDate && bookingTime && (
                <Button
                  className="flex-1"
                  onClick={() => {
                    const pricing = calculateBookingPrice();
                    bookLesson(
                      selectedTeacherData.id,
                      pricing.basePrice,
                      bookingDate,
                      bookingTime,
                    );
                    resetBookingDialog();
                  }}
                >
                  🟢 Confirm & Pay
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Support Ticket Dialog */}
      <Dialog
        open={supportTicketDialogOpen}
        onOpenChange={setSupportTicketDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
            <DialogDescription>
              We're here to help! Choose a category for faster assistance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Issue Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="booking_issues">
                    📅 Booking Issues
                  </SelectItem>
                  <SelectItem value="payment_problems">
                    💳 Payment Problems
                  </SelectItem>
                  <SelectItem value="technical_bugs">
                    🔧 Technical Bugs
                  </SelectItem>
                  <SelectItem value="inappropriate_behavior">
                    ⚠️ Inappropriate Behavior
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input placeholder="Brief description of the issue" />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                className="w-full p-3 border rounded-md resize-none"
                rows={4}
                placeholder="Please provide details about your issue..."
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSupportTicketDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() =>
                  createSupportTicket(
                    "booking_issues",
                    "Test Issue",
                    "Test description",
                  )
                }
              >
                Submit Ticket
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Wallet Modal */}
      <WalletModal
        open={walletModalOpen}
        onOpenChange={setWalletModalOpen}
        userData={userData}
        transactions={transactions}
        walletStats={walletStats}
        onRecharge={() => setRechargeModalOpen(true)}
        onRefresh={loadUserData}
      />

      {/* Recharge Modal */}
      <RechargeModal
        open={rechargeModalOpen}
        onOpenChange={setRechargeModalOpen}
        userId={user?.id}
        onSuccess={() => {
          loadUserData();
          setRechargeModalOpen(false);
          toast({
            title: "Wallet Recharged!",
            description: "Your wallet has been successfully recharged.",
          });
        }}
      />
    </div>
  );
}

// Wallet Modal Component
function WalletModal({
  open,
  onOpenChange,
  userData,
  transactions,
  walletStats,
  onRecharge,
  onRefresh,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: any;
  transactions: any[];
  walletStats: any;
  onRecharge: () => void;
  onRefresh: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            My Wallet
          </DialogTitle>
          <DialogDescription>
            Manage your wallet balance and view transaction history
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Wallet Balance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-sm text-gray-600">Current Balance</h3>
                  <p className="text-2xl font-bold text-green-600">
                    ${(userData?.walletBalance || 0).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-sm text-gray-600">Total Recharged</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    ${(walletStats.totalRecharged || 0).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-sm text-gray-600">Total Spent</h3>
                  <p className="text-2xl font-bold text-orange-600">
                    ${(walletStats.totalSpent || 0).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={onRecharge} className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Recharge Wallet
            </Button>
            <Button variant="outline" onClick={onRefresh}>
              Refresh
            </Button>
          </div>

          {/* Transaction History */}
          <div>
            <h3 className="font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === "recharge"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {transaction.type === "recharge" ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString()}{" "}
                          via {transaction.method}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${
                          transaction.type === "recharge"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "recharge" ? "+" : "-"}$
                        {transaction.amount.toFixed(2)}
                      </p>
                      <Badge
                        variant={
                          transaction.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No transactions yet</p>
                  <p className="text-sm text-gray-400">
                    Recharge your wallet to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Recharge Modal Component
function RechargeModal({
  open,
  onOpenChange,
  userId,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<
    "paypal" | "mastercard" | "visa" | "bank_transfer"
  >("paypal");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRecharge = async () => {
    if (!userId || !amount) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const success = db.rechargeWallet(userId, amountNum, method, {
        method,
        amount: amountNum,
        timestamp: new Date().toISOString(),
      });

      if (success) {
        onSuccess();
        setAmount("");
        setMethod("paypal");
      }
    } catch (error) {
      console.error("Recharge failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { value: "paypal", label: "PayPal", icon: "💳" },
    { value: "mastercard", label: "Mastercard", icon: "💳" },
    { value: "visa", label: "Visa", icon: "💳" },
    { value: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Recharge Wallet</DialogTitle>
          <DialogDescription>
            Add funds to your wallet for lesson payments
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              min="5"
              step="5"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div>
            <Label>Payment Method</Label>
            <Select
              value={method}
              onValueChange={(value: any) => setMethod(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((pm) => (
                  <SelectItem key={pm.value} value={pm.value}>
                    <div className="flex items-center gap-2">
                      <span>{pm.icon}</span>
                      {pm.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick amounts */}
          <div>
            <Label>Quick amounts</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[10, 25, 50, 100].map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="text-xs"
                >
                  ${quickAmount}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRecharge}
              disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
            >
              {isProcessing ? "Processing..." : `Recharge $${amount || "0"}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
