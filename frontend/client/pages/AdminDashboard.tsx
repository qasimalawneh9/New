import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { TrialLessonsManager } from "@/components/admin/TrialLessonsManager";
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
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  Users,
  GraduationCap,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  MoreHorizontal,
  Settings,
  Shield,
  Bell,
  BookOpen,
  MessageCircle,
  BarChart3,
  Activity,
  UserCheck,
  UserX,
  Mail,
  Eye,
  Edit,
  Download,
  CreditCard,
  FileText,
  Home,
  Globe,
  Video,
  Award,
  Wallet,
  Info,
  User,
  Upload,
  Database,
  Star,
  Plus,
  Clock,
  Trash2,
  Filter,
  RefreshCw,
  Save,
  Lock,
  Unlock,
  Ban,
  CheckSquare,
  AlertCircle,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  BarChart2,
  Target,
  Zap,
  Heart,
  ThumbsUp,
  Share2,
  Monitor,
  Server,
  HardDrive,
  Cpu,
  Wifi,
  ShieldCheck,
  FileCheck,
  Languages,
  Flag,
  MapPin,
  Phone,
  Calendar as CalendarIcon,
  Image,
  Film,
  FileSpreadsheet,
  Send,
  MessageSquare,
  UserPlus,
  Coins,
  CreditCard as CreditCardIcon,
  Receipt,
  TrendingDown,
  Package,
  Briefcase,
  School,
  Building,
  MapIcon,
  PhoneCall,
  Mail as MailIcon,
  ExternalLink,
  Copy,
  Archive,
  Folder,
  FolderOpen,
} from "lucide-react";
import { db } from "../lib/database";
import { populateDemoData, resetDemoData } from "../lib/demo-data";
import { useLanguage } from "@/contexts/LanguageContext";
import { Student, Teacher, Lesson } from "../../shared/api";
import {
  adminService,
  PlatformSettings,
  ContentSettings,
} from "../lib/adminServices";
import { ROUTES, USER_ROLES, FEATURES } from "@/config/constants";

// Teacher Application Details Component
function TeacherApplicationDetails({ application }: { application: any }) {
  if (!application) return null;

  const applicationData = application.applicationData || {};

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
          <TabsTrigger value="teaching">Teaching Details</TabsTrigger>
          <TabsTrigger value="media">Media & Files</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Full Name
                  </label>
                  <div className="text-sm font-semibold">
                    {application.name || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email Address
                  </label>
                  <div className="text-sm font-semibold">
                    {application.email || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Phone Number
                  </label>
                  <div className="text-sm font-semibold">
                    {applicationData.phone || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Country
                  </label>
                  <div className="text-sm font-semibold">
                    {applicationData.country || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Date of Birth
                  </label>
                  <div className="text-sm font-semibold">
                    {applicationData.dateOfBirth || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Gender
                  </label>
                  <div className="text-sm font-semibold">
                    {applicationData.gender || "N/A"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teaching Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Native Languages
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {application.nativeLanguages?.map((lang: string) => (
                      <Badge key={lang} variant="default">
                        {lang}
                      </Badge>
                    )) || <span className="text-gray-400">None specified</span>}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Teaching Languages
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {application.teachingLanguages?.map((lang: string) => (
                      <Badge key={lang} variant="secondary">
                        {lang}
                      </Badge>
                    )) || <span className="text-gray-400">None specified</span>}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Experience Level
                  </label>
                  <div className="text-sm font-semibold">
                    {applicationData.experienceLevel || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Hourly Rate
                  </label>
                  <div className="text-sm font-semibold">
                    ${applicationData.hourlyRate || "N/A"}/hour
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qualifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Education & Qualifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Education Level
                </label>
                <div className="text-sm font-semibold">
                  {applicationData.education || "N/A"}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Teaching Certifications
                </label>
                <div className="text-sm">
                  {applicationData.certifications || "None specified"}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Teaching Experience
                </label>
                <div className="text-sm">
                  {applicationData.experience || "N/A"}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teaching" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teaching Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Teaching Style
                </label>
                <div className="text-sm">
                  {applicationData.teachingStyle || "N/A"}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Specializations
                </label>
                <div className="text-sm">
                  {applicationData.specializations || "N/A"}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Availability
                </label>
                <div className="text-sm">
                  {applicationData.availability || "N/A"}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Introduction Video</h4>
            {application.video ? (
              <div className="aspect-video rounded-lg overflow-hidden bg-black/5 border">
                <iframe
                  src={application.video}
                  title={`${application.name} - Introduction Video`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">No introduction video provided</p>
              </div>
            )}
          </div>
          <div>
            <h4 className="font-semibold mb-2">Documents & Files</h4>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Profile Photo:</strong>{" "}
                {applicationData.profilePhoto ? "Provided" : "Not provided"}
              </div>
              <div>
                <strong>Resume:</strong>{" "}
                {applicationData.resume ? "Provided" : "Not provided"}
              </div>
              <div>
                <strong>Certificates:</strong>{" "}
                {applicationData.certificates?.length || 0} files
              </div>
              <div>
                <strong>Government ID:</strong>{" "}
                {applicationData.governmentId ? "Provided" : "Not provided"}
              </div>
              <div>
                <strong>Proof of Address:</strong>{" "}
                {applicationData.proofOfAddress ? "Provided" : "Not provided"}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSidebarItem, setSelectedSidebarItem] = useState("overview");
  const [roleFilter, setRoleFilter] = useState("all");
  const [teacherFilter, setTeacherFilter] = useState("all");
  const [lessonFilter, setLessonFilter] = useState("all");

  // Real data from database
  const [stats, setStats] = useState<any>({});
  const [users, setUsers] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherApplications, setTeacherApplications] = useState<any[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userDetailsModal, setUserDetailsModal] = useState(false);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);
  const [userActivities, setUserActivities] = useState<any[]>([]);

  // Platform settings
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    commissionRate: 0.15,
    taxRate: 0.08,
    minimumPayoutAmount: { paypal: 10, bank: 50 },
    autoCompletionHours: 2,
    teacherSuspensionThreshold: 3,
    supportResponseTimes: { priority: 2, normal: 24, low: 72 },
    maintenanceMode: false,
    registrationEnabled: true,
  });

  const [contentSettings, setContentSettings] = useState<ContentSettings>({
    contentModerationRules: {
      autoModeration: true,
      requireApproval: false,
      bannedWords: [],
    },
    maxFileSize: 50,
    allowedFileTypes: [".jpg", ".png", ".pdf", ".mp4"],
    communityGuidelines: "",
  });

  // System monitoring
  const [systemHealth, setSystemHealth] = useState<any>({});
  const [dataIntegrity, setDataIntegrity] = useState<any>({});
  const [analyticsDateRange, setAnalyticsDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Enhanced analytics state
  const [detailedAnalytics, setDetailedAnalytics] = useState<any>({});
  const [reportContentModal, setReportContentModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const loadData = () => {
    try {
      const platformStats = db.getPlatformStats();
      setStats(platformStats);

      const allUsers = db.getUsers();
      setUsers(allUsers);

      const allTeachers = db.getTeachers();
      setTeachers(allTeachers);

      const applications = db.getTeacherApplications() || [];
      setTeacherApplications(applications);

      const allLessons = db.getLessons() || [];
      setLessons(allLessons);

      // Get community posts by creating a temporary method
      const posts = (() => {
        try {
          return (
            JSON.parse(localStorage.getItem("linguaconnect_db") || "{}")
              ?.community?.posts || []
          );
        } catch {
          return [];
        }
      })();
      setCommunityPosts(posts);

      // Get recent activities by creating a temporary method
      const activities = (() => {
        try {
          return (
            JSON.parse(
              localStorage.getItem("linguaconnect_db") || "{}",
            )?.recentActivity?.slice(0, 50) || []
          );
        } catch {
          return [];
        }
      })();
      setRecentActivities(activities);

      // Get payout requests
      const payouts = (() => {
        try {
          return (
            JSON.parse(localStorage.getItem("linguaconnect_db") || "{}")
              ?.payoutRequests || []
          );
        } catch {
          return [];
        }
      })();
      setPayoutRequests(payouts);

      const settings = db.getPlatformSettings();
      setPlatformSettings(settings);

      const health = db.getSystemHealth();
      setSystemHealth(health);

      const integrity = db.validateDataIntegrity();
      setDataIntegrity(integrity);

      const analytics = db.getDetailedAnalytics();
      setDetailedAnalytics(analytics);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadData();

    // Set up real-time data sync
    const unsubscribe = db.onDataChange(() => {
      loadData();
    });

    return unsubscribe;
  }, []);

  // Handler functions
  const handleUserAction = (action: string, userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (action === "View Details" && user) {
      setSelectedUser(user);
      // Get user transactions
      const transactions = (() => {
        try {
          const data = JSON.parse(
            localStorage.getItem("linguaconnect_db") || "{}",
          );
          return (
            data?.transactions?.filter((t: any) => t.userId === userId) || []
          );
        } catch {
          return [];
        }
      })();
      setUserTransactions(transactions);

      // Get user activities
      const activities = (() => {
        try {
          const data = JSON.parse(
            localStorage.getItem("linguaconnect_db") || "{}",
          );
          return (
            data?.recentActivity?.filter((a: any) => a.userId === userId) || []
          );
        } catch {
          return [];
        }
      })();
      setUserActivities(activities);
      setUserDetailsModal(true);
    } else {
      toast({
        title: `${action} User`,
        description: `${action} action for user ${userId}`,
      });
    }
  };

  const handleApproveTeacher = (applicationId: string) => {
    try {
      db.approveTeacher(applicationId);
      loadData();
      toast({
        title: "Teacher Approved",
        description: "The teacher application has been approved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve teacher application.",
        variant: "destructive",
      });
    }
  };

  const handleRejectTeacher = (applicationId: string) => {
    try {
      db.rejectTeacher(applicationId);
      loadData();
      toast({
        title: "Teacher Rejected",
        description: "The teacher application has been rejected.",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject teacher application.",
        variant: "destructive",
      });
    }
  };

  const handleSuspendTeacher = (teacherId: string) => {
    try {
      db.suspendTeacher(teacherId);
      loadData();
      toast({
        title: "Teacher Suspended",
        description: "The teacher has been suspended successfully.",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to suspend teacher.",
        variant: "destructive",
      });
    }
  };

  const handleReactivateTeacher = (teacherId: string) => {
    try {
      db.reactivateTeacher(teacherId);
      loadData();
      toast({
        title: "Teacher Reactivated",
        description: "The teacher has been reactivated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reactivate teacher.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTeacher = (teacherId: string) => {
    try {
      db.deleteTeacher(teacherId);
      loadData();
      toast({
        title: "Teacher Deleted",
        description: "The teacher has been permanently deleted.",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete teacher.",
        variant: "destructive",
      });
    }
  };

  const handleEditTeacherPricing = (teacherId: string) => {
    toast({
      title: "Edit Pricing",
      description: `Opening pricing editor for teacher ${teacherId}`,
    });
  };

  const handleApprovePayoutRequest = (requestId: string) => {
    try {
      db.approvePayoutRequest(requestId);
      loadData();
      toast({
        title: "Payout Approved",
        description: "The payout request has been approved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve payout request.",
        variant: "destructive",
      });
    }
  };

  const handleRejectPayoutRequest = (requestId: string) => {
    try {
      db.rejectPayoutRequest(requestId, "Rejected by admin");
      loadData();
      toast({
        title: "Payout Rejected",
        description: "The payout request has been rejected.",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject payout request.",
        variant: "destructive",
      });
    }
  };

  const handleExportData = () => {
    try {
      const data = db.exportData();
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `talkcon-data-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      toast({
        title: "Data Exported",
        description: "Platform data has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export platform data.",
        variant: "destructive",
      });
    }
  };

  const updatePlatformSettings = (newSettings: Partial<PlatformSettings>) => {
    try {
      const updated = { ...platformSettings, ...newSettings };
      db.updatePlatformSettings(updated);
      setPlatformSettings(updated);
      toast({
        title: "Settings Updated",
        description: "Platform settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update platform settings.",
        variant: "destructive",
      });
    }
  };

  const updateContentSettings = (newSettings: Partial<ContentSettings>) => {
    try {
      const updated = { ...contentSettings, ...newSettings };
      setContentSettings(updated);
      toast({
        title: "Content Settings Updated",
        description: "Content moderation settings have been updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update content settings.",
        variant: "destructive",
      });
    }
  };

  const moderateContent = (reportId: string, action: "approve" | "remove") => {
    toast({
      title: `Content ${action === "approve" ? "Approved" : "Removed"}`,
      description: `The reported content has been ${action === "approve" ? "approved" : "removed"}.`,
      variant: action === "remove" ? "destructive" : "default",
    });
  };

  // Sample chart data
  const chartData = [
    { name: "Jan", students: 400, lessons: 240, revenue: 2400 },
    { name: "Feb", students: 300, lessons: 380, revenue: 2210 },
    { name: "Mar", students: 500, lessons: 520, revenue: 2290 },
    { name: "Apr", students: 280, lessons: 390, revenue: 2000 },
    { name: "May", students: 590, lessons: 480, revenue: 2181 },
    { name: "Jun", students: 320, lessons: 380, revenue: 2500 },
  ];

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const matchesSearch =
        teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        teacherFilter === "all" || teacher.status === teacherFilter;
      return matchesSearch && matchesFilter;
    });
  }, [teachers, searchTerm, teacherFilter]);

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesSearch =
        lesson.teacherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.studentName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        lessonFilter === "all" || lesson.status === lessonFilter;
      return matchesSearch && matchesFilter;
    });
  }, [lessons, searchTerm, lessonFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Talkcon Admin</h1>
            <p className="text-gray-600">Platform Management Dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Back to Homepage
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const result = populateDemoData();
                loadData();
                toast({
                  title: "Demo Data Created",
                  description: `Created ${result.studentsCreated} students, ${result.teacherApplicationsCreated} teachers, and ${result.lessonsCreated} lessons`,
                });
              }}
            >
              Add Demo Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const count = db.createDemoApprovedTeachers();
                loadData();
                toast({
                  title: "Demo Teachers Added",
                  description: `Created ${count} approved teachers for homepage testing`,
                });
              }}
            >
              Add Demo Teachers
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const result = db.createDemoCommunityData();
                loadData();
                toast({
                  title: "Demo Community Data Added",
                  description: `Created ${result.postsCreated} posts, ${result.eventsCreated} events, and ${result.challengesCreated} challenges`,
                });
              }}
            >
              Add Community Data
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (
                  window.confirm(
                    "⚠️ WARNING: This will permanently delete ALL users, teachers, applications, and lessons. This action cannot be undone.\\n\\nAre you absolutely sure?",
                  )
                ) {
                  db.clearAllData();
                  loadData();
                  toast({
                    title: "All Data Deleted",
                    description:
                      "All fake users, teachers, students, and lessons have been permanently removed.",
                    variant: "destructive",
                  });
                }
              }}
            >
              🗑️ Delete All Fake Users
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Navigation
              </h3>
            </div>
            <nav className="space-y-1">
              {[
                {
                  id: "overview",
                  label: "Overview",
                  icon: BarChart3,
                  tab: "overview",
                },
                {
                  id: "users",
                  label: "User Management",
                  icon: Users,
                  tab: "users",
                },
                {
                  id: "teachers",
                  label: "Teacher Management",
                  icon: GraduationCap,
                  tab: "teachers",
                },
                {
                  id: "lessons",
                  label: "Lesson Management",
                  icon: BookOpen,
                  tab: "lessons",
                },
                {
                  id: "community",
                  label: "Community",
                  icon: MessageCircle,
                  tab: "community",
                },
                {
                  id: "content",
                  label: "Content Management",
                  icon: FileText,
                  tab: "content",
                },
                {
                  id: "finance",
                  label: "Finance & Payouts",
                  icon: DollarSign,
                  tab: "finance",
                },
                {
                  id: "analytics",
                  label: "Analytics",
                  icon: TrendingUp,
                  tab: "analytics",
                },
                {
                  id: "system",
                  label: "System Management",
                  icon: Settings,
                  tab: "system",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedSidebarItem === item.id
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => {
                    setSelectedSidebarItem(item.id);
                    setActiveTab(item.tab);
                    toast({
                      title: `Switched to ${item.label}`,
                      description: "Loading data...",
                    });
                  }}
                >
                  <item.icon
                    className={`w-4 h-4 mr-3 ${
                      selectedSidebarItem === item.id
                        ? "text-blue-700"
                        : "text-gray-400"
                    }`}
                  />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              const tabToSidebarMapping: { [key: string]: string } = {
                overview: "overview",
                users: "users",
                teachers: "teachers",
                lessons: "lessons",
                community: "community",
                content: "content",
                finance: "finance",
                analytics: "analytics",
                system: "system",
              };
              setSelectedSidebarItem(tabToSidebarMapping[value] || "overview");
            }}
            className="space-y-4"
          >
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Total Users
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.totalUsers || 0}
                        </p>
                        <p className="text-xs text-green-600">
                          +{stats.userGrowthRate || 0}% from last month
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <GraduationCap className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Active Teachers
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.totalTeachers || 0}
                        </p>
                        <p className="text-xs text-green-600">
                          +{stats.teacherGrowthRate || 0}% from last month
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <BookOpen className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Total Lessons
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.totalLessons || 0}
                        </p>
                        <p className="text-xs text-green-600">
                          +{stats.lessonGrowthRate || 0}% from last month
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <DollarSign className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Total Revenue
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${stats.totalRevenue?.toFixed(2) || "0.00"}
                        </p>
                        <p className="text-xs text-green-600">
                          +{stats.revenueGrowthRate || 0}% from last month
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="students"
                          stroke="#3B82F6"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="lessons"
                          stroke="#10B981"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#F59E0B"
                          fill="#FEF3C7"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Platform Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity) => {
                        const timeAgo = new Date(activity.timestamp);
                        const now = new Date();
                        const diffMs = now.getTime() - timeAgo.getTime();
                        const diffMins = Math.floor(diffMs / (1000 * 60));
                        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                        const diffDays = Math.floor(
                          diffMs / (1000 * 60 * 60 * 24),
                        );

                        let timeString = "";
                        if (diffDays > 0) {
                          timeString = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
                        } else if (diffHours > 0) {
                          timeString = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
                        } else if (diffMins > 0) {
                          timeString = `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
                        } else {
                          timeString = "Just now";
                        }

                        const getActivityColor = (type: string) => {
                          switch (type) {
                            case "user_signup":
                              return "bg-green-500";
                            case "teacher_application":
                              return "bg-blue-500";
                            case "lesson_booked":
                              return "bg-purple-500";
                            case "payment_completed":
                              return "bg-yellow-500";
                            case "lesson_completed":
                              return "bg-emerald-500";
                            default:
                              return "bg-gray-500";
                          }
                        };

                        return (
                          <div
                            key={activity.id}
                            className="flex items-start space-x-3"
                          >
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.type)}`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {activity.description}
                              </p>
                              <p className="text-xs text-gray-500">
                                {timeString}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="font-semibold mb-2">
                          No Recent Activity
                        </h3>
                        <p className="text-gray-500">
                          Platform activity will appear here.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Management Tab */}
            <TabsContent value="users" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">User Management</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="student">Students</SelectItem>
                      <SelectItem value="teacher">Teachers</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={loadData}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Lessons</TableHead>
                        <TableHead>Wallet</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>
                                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {user.name || "Unknown"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {user.role || "student"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.status === "active"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {user.status || "active"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(
                              user.createdAt || user.joinedDate || Date.now(),
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{user.completedLessons || 0}</TableCell>
                          <TableCell>
                            ${user.walletBalance?.toFixed(2) || "0.00"}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUserAction("View Details", user.id)
                                  }
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUserAction("Edit User", user.id)
                                  }
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUserAction("Send Message", user.id)
                                  }
                                >
                                  <Mail className="w-4 h-4 mr-2" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUserAction("Suspend", user.id)
                                  }
                                >
                                  <UserX className="w-4 h-4 mr-2" />
                                  Suspend User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="font-semibold mb-2">No Users Found</h3>
                      <p className="text-gray-500">
                        No users match your current filters.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Teachers Management Tab */}
            <TabsContent value="teachers" className="space-y-4">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All Teachers</TabsTrigger>
                  <TabsTrigger value="applications">
                    Applications (
                    {
                      teacherApplications.filter(
                        (app) => app.status === "pending",
                      ).length
                    }
                    )
                  </TabsTrigger>
                  <TabsTrigger value="pricing">Pricing Control</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">All Teachers</h3>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search teachers..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Select
                        value={teacherFilter}
                        onValueChange={setTeacherFilter}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Teacher</TableHead>
                            <TableHead>Languages</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Students</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Earnings</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTeachers.map((teacher) => (
                            <TableRow key={teacher.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={teacher.avatar} />
                                    <AvatarFallback>
                                      {teacher.name?.charAt(0)?.toUpperCase() ||
                                        "T"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">
                                      {teacher.name || "Unknown"}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {teacher.email}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {teacher.nativeLanguages
                                    ?.slice(0, 2)
                                    .map((lang) => (
                                      <Badge
                                        key={lang}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {lang}
                                      </Badge>
                                    ))}
                                  {teacher.nativeLanguages?.length > 2 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{teacher.nativeLanguages.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    teacher.status === "approved"
                                      ? "default"
                                      : teacher.status === "suspended"
                                        ? "destructive"
                                        : "outline"
                                  }
                                >
                                  {teacher.status || "pending"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {teacher.totalStudents || 0}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                  {teacher.rating?.toFixed(1) || "N/A"}
                                </div>
                              </TableCell>
                              <TableCell>
                                ${teacher.totalEarnings?.toFixed(2) || "0.00"}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  {teacher.status === "approved" && (
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() =>
                                        handleSuspendTeacher(teacher.id)
                                      }
                                    >
                                      <UserX className="w-4 h-4 mr-1" />
                                      Suspend
                                    </Button>
                                  )}
                                  {teacher.status === "suspended" && (
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={() =>
                                        handleReactivateTeacher(teacher.id)
                                      }
                                    >
                                      <UserCheck className="w-4 h-4 mr-1" />
                                      Reactivate
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      handleDeleteTeacher(teacher.id)
                                    }
                                  >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="applications" className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Teacher Applications
                  </h3>

                  <div className="grid gap-4">
                    {teacherApplications
                      .filter((app) => app.status === "pending")
                      .map((application) => (
                        <Card key={application.id}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <Avatar className="w-12 h-12">
                                  <AvatarImage src={application.avatar} />
                                  <AvatarFallback>
                                    {application.name
                                      ?.charAt(0)
                                      ?.toUpperCase() || "T"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-semibold">
                                    {application.name}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {application.email}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Badge variant="outline">
                                      {application.nativeLanguages?.join(
                                        ", ",
                                      ) || "Not specified"}
                                    </Badge>
                                    <Badge variant="secondary">
                                      ${application.hourlyRate || "N/A"}/hour
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    setSelectedApplication(application)
                                  }
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Details
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleApproveTeacher(application.id)
                                  }
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    handleRejectTeacher(application.id)
                                  }
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    {teacherApplications.filter(
                      (app) => app.status === "pending",
                    ).length === 0 && (
                      <div className="text-center py-8">
                        <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="font-semibold mb-2">
                          No Pending Applications
                        </h3>
                        <p className="text-gray-500">
                          All teacher applications have been processed.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Teacher Pricing Control
                  </h3>
                  <TrialLessonsManager />
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Lessons Management Tab */}
            <TabsContent value="lessons" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Lesson Management</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search lessons..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={lessonFilter} onValueChange={setLessonFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Lessons</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lesson Details</TableHead>
                        <TableHead>Teacher</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLessons.map((lesson) => (
                        <TableRow key={lesson.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {lesson.subject || "Language Lesson"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {lesson.language || "General"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback>
                                  {lesson.teacherName
                                    ?.charAt(0)
                                    ?.toUpperCase() || "T"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">
                                {lesson.teacherName || "Unknown"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback>
                                  {lesson.studentName
                                    ?.charAt(0)
                                    ?.toUpperCase() || "S"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">
                                {lesson.studentName || "Unknown"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm font-medium">
                                {new Date(
                                  lesson.date || Date.now(),
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {lesson.time || "Time not set"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{lesson.duration || "60"} min</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                lesson.status === "completed"
                                  ? "default"
                                  : lesson.status === "cancelled"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {lesson.status || "scheduled"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            ${lesson.amount?.toFixed(2) || "0.00"}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Lesson
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Cancel Lesson
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredLessons.length === 0 && (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="font-semibold mb-2">No Lessons Found</h3>
                      <p className="text-gray-500">
                        No lessons match your current filters.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Community Tab */}
            <TabsContent value="community" className="space-y-4">
              <h2 className="text-xl font-semibold">Community Management</h2>

              <Tabs defaultValue="posts" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="posts">Posts</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="moderation">Moderation</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Community Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {communityPosts.map((post) => (
                          <div key={post.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback>
                                    {post.authorName
                                      ?.charAt(0)
                                      ?.toUpperCase() || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">
                                      {post.authorName}
                                    </span>
                                    <Badge
                                      variant={
                                        post.authorType === "teacher"
                                          ? "default"
                                          : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {post.authorType}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {post.content}
                                  </p>
                                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                    <span>
                                      {new Date(
                                        post.createdAt,
                                      ).toLocaleString()}
                                    </span>
                                    <span>{post.likes || 0} likes</span>
                                    <span>
                                      {post.comments?.length || 0} comments
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant={
                                    post.isModerated ? "default" : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {post.isModerated
                                    ? "Moderated"
                                    : "Unmoderated"}
                                </Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem>
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit Post
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete Post
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        ))}
                        {communityPosts.length === 0 && (
                          <div className="text-center py-8">
                            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <h3 className="font-semibold mb-2">No Posts Yet</h3>
                            <p className="text-gray-500">
                              Community posts will appear here.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reports" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500">
                        Content reports and moderation queue will be displayed
                        here.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="moderation" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Auto-Moderation Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-moderation">
                          Enable Auto-Moderation
                        </Label>
                        <Switch
                          id="auto-moderation"
                          checked={
                            contentSettings.contentModerationRules
                              ?.autoModeration || true
                          }
                          onCheckedChange={(checked) =>
                            updateContentSettings({
                              contentModerationRules: {
                                ...(contentSettings.contentModerationRules ||
                                  {}),
                                autoModeration: checked,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="require-approval">
                          Require Manual Approval
                        </Label>
                        <Switch
                          id="require-approval"
                          checked={
                            contentSettings.contentModerationRules
                              ?.requireApproval || false
                          }
                          onCheckedChange={(checked) =>
                            updateContentSettings({
                              contentModerationRules: {
                                ...(contentSettings.contentModerationRules ||
                                  {}),
                                requireApproval: checked,
                              },
                            })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Community Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Enter community guidelines..."
                        value={contentSettings.communityGuidelines || ""}
                        onChange={(e) =>
                          updateContentSettings({
                            communityGuidelines: e.target.value,
                          })
                        }
                        rows={10}
                      />
                      <Button className="mt-4">
                        <Save className="w-4 h-4 mr-2" />
                        Save Guidelines
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Content Management Tab */}
            <TabsContent value="content" className="space-y-4">
              <h2 className="text-xl font-semibold">Content Management</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Website Pages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          name: "Homepage",
                          path: "/",
                          status: "Live",
                          lastModified: "2024-01-15",
                        },
                        {
                          name: "Find Teachers",
                          path: "/find-teachers",
                          status: "Live",
                          lastModified: "2024-01-14",
                        },
                        {
                          name: "How it Works",
                          path: "/how-it-works",
                          status: "Live",
                          lastModified: "2024-01-13",
                        },
                        {
                          name: "Pricing",
                          path: "/pricing",
                          status: "Draft",
                          lastModified: "2024-01-12",
                        },
                      ].map((page) => (
                        <div
                          key={page.name}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{page.name}</div>
                            <div className="text-sm text-gray-500">
                              {page.path}
                            </div>
                            <div className="text-xs text-gray-400">
                              Last modified: {page.lastModified}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                page.status === "Live" ? "default" : "secondary"
                              }
                              className="ml-2"
                            >
                              {page.status}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                window.open(page.path, "_blank");
                                toast({
                                  title: `Viewing ${page.name}`,
                                  description: `Opened ${page.name} in a new tab`,
                                });
                              }}
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                toast({
                                  title: `Editing ${page.name}`,
                                  description: "Content editor will open here",
                                });
                              }}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Media Library</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                          Manage uploaded files and media assets
                        </p>
                        <Button size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Files
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <div className="text-sm font-medium">Images</div>
                          <div className="text-xs text-gray-500">
                            1,234 files
                          </div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <Film className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <div className="text-sm font-medium">Videos</div>
                          <div className="text-xs text-gray-500">56 files</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <div className="text-sm font-medium">Documents</div>
                          <div className="text-xs text-gray-500">89 files</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <Archive className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <div className="text-sm font-medium">Other</div>
                          <div className="text-xs text-gray-500">23 files</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Finance Tab */}
            <TabsContent value="finance" className="space-y-4">
              <h2 className="text-xl font-semibold">Finance & Payouts</h2>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="payouts">
                    Payout Requests (
                    {
                      payoutRequests.filter((req) => req.status === "pending")
                        .length
                    }
                    )
                  </TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                              Total Revenue
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                              ${stats.totalRevenue?.toFixed(2) || "0.00"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                              Commission Earned
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                              $
                              {(
                                (stats.totalRevenue || 0) *
                                (platformSettings.commissionRate || 0.15)
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Wallet className="w-6 h-6 text-orange-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                              Pending Payouts
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                              $
                              {payoutRequests
                                .filter((req) => req.status === "pending")
                                .reduce(
                                  (sum, req) => sum + (req.amount || 0),
                                  0,
                                )
                                .toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                              Monthly Growth
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                              +{stats.revenueGrowthRate || 0}%
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="payouts" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payout Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Teacher</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Requested</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {payoutRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback>
                                      {request.teacherName
                                        ?.charAt(0)
                                        ?.toUpperCase() || "T"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>
                                    {request.teacherName || "Unknown"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                ${request.amount?.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                {request.method || "PayPal"}
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  request.requestedAt || Date.now(),
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    request.status === "approved" ||
                                    request.status === "completed"
                                      ? "default"
                                      : request.status === "pending"
                                        ? "secondary"
                                        : "destructive"
                                  }
                                >
                                  {request.status || "pending"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {request.status === "pending" && (
                                  <div className="flex space-x-1">
                                    <Button
                                      size="sm"
                                      className="text-xs h-7 px-2"
                                      onClick={() =>
                                        handleApprovePayoutRequest(request.id)
                                      }
                                    >
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="text-xs h-7 px-2"
                                      onClick={() =>
                                        handleRejectPayoutRequest(request.id)
                                      }
                                    >
                                      <XCircle className="w-3 h-3 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                )}
                                {request.status === "approved" && (
                                  <Button
                                    size="sm"
                                    className="text-xs h-7 px-2"
                                    onClick={() => {
                                      db.markPayoutCompleted(request.id);
                                      loadData();
                                      toast({
                                        title: "Payout Completed",
                                        description:
                                          "Payout has been marked as completed.",
                                      });
                                    }}
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Mark Complete
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {payoutRequests.length === 0 && (
                        <div className="text-center py-8">
                          <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <h3 className="font-semibold mb-2">
                            No Payout Requests
                          </h3>
                          <p className="text-gray-500">
                            Payout requests will appear here.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="transactions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentActivities.map((activity) => {
                            const getActivityIcon = (type: string) => {
                              switch (type) {
                                case "user_signup":
                                  return (
                                    <UserPlus className="w-4 h-4 text-green-500" />
                                  );
                                case "teacher_application":
                                  return (
                                    <GraduationCap className="w-4 h-4 text-blue-500" />
                                  );
                                case "lesson_booked":
                                  return (
                                    <Calendar className="w-4 h-4 text-purple-500" />
                                  );
                                case "payment_completed":
                                  return (
                                    <DollarSign className="w-4 h-4 text-green-500" />
                                  );
                                case "lesson_completed":
                                  return (
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                  );
                                case "payout_requested":
                                  return (
                                    <Wallet className="w-4 h-4 text-orange-500" />
                                  );
                                case "community_post":
                                  return (
                                    <MessageCircle className="w-4 h-4 text-blue-500" />
                                  );
                                case "user_suspended":
                                  return (
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                  );
                                default:
                                  return (
                                    <Activity className="w-4 h-4 text-gray-500" />
                                  );
                              }
                            };

                            const getActivityBadge = (type: string) => {
                              switch (type) {
                                case "user_signup":
                                  return (
                                    <Badge variant="outline">New User</Badge>
                                  );
                                case "teacher_application":
                                  return (
                                    <Badge variant="outline">Application</Badge>
                                  );
                                case "lesson_booked":
                                  return (
                                    <Badge variant="outline">Booking</Badge>
                                  );
                                case "payment_completed":
                                  return (
                                    <Badge variant="default">Payment</Badge>
                                  );
                                case "lesson_completed":
                                  return (
                                    <Badge variant="default">Completed</Badge>
                                  );
                                case "payout_requested":
                                  return (
                                    <Badge variant="secondary">Payout</Badge>
                                  );
                                case "community_post":
                                  return (
                                    <Badge variant="outline">Community</Badge>
                                  );
                                case "user_suspended":
                                  return (
                                    <Badge variant="destructive">
                                      Suspended
                                    </Badge>
                                  );
                                default:
                                  return (
                                    <Badge variant="outline">Activity</Badge>
                                  );
                              }
                            };

                            return (
                              <TableRow key={activity.id}>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    {getActivityIcon(activity.type)}
                                    {getActivityBadge(activity.type)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {activity.userName || "System"}
                                </TableCell>
                                <TableCell>
                                  {activity.amount
                                    ? `$${activity.amount.toFixed(2)}`
                                    : "-"}
                                </TableCell>
                                <TableCell>
                                  {new Date(
                                    activity.timestamp,
                                  ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="default">Completed</Badge>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Commission & Tax Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="commission-rate">
                            Commission Rate (%)
                          </Label>
                          <Input
                            id="commission-rate"
                            type="number"
                            value={
                              (platformSettings.commissionRate || 0.15) * 100
                            }
                            onChange={(e) =>
                              updatePlatformSettings({
                                commissionRate:
                                  parseFloat(e.target.value) / 100,
                              })
                            }
                            min="0"
                            max="100"
                            step="0.1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                          <Input
                            id="tax-rate"
                            type="number"
                            value={(platformSettings.taxRate || 0.08) * 100}
                            onChange={(e) =>
                              updatePlatformSettings({
                                taxRate: parseFloat(e.target.value) / 100,
                              })
                            }
                            min="0"
                            max="100"
                            step="0.1"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Minimum Payout Amounts</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="paypal-min">PayPal Minimum ($)</Label>
                          <Input
                            id="paypal-min"
                            type="number"
                            value={
                              platformSettings.minimumPayoutAmount?.paypal || 10
                            }
                            onChange={(e) =>
                              updatePlatformSettings({
                                minimumPayoutAmount: {
                                  ...(platformSettings.minimumPayoutAmount ||
                                    {}),
                                  paypal: parseFloat(e.target.value),
                                },
                              })
                            }
                            min="1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bank-min">
                            Bank Transfer Minimum ($)
                          </Label>
                          <Input
                            id="bank-min"
                            type="number"
                            value={
                              platformSettings.minimumPayoutAmount?.bank || 50
                            }
                            onChange={(e) =>
                              updatePlatformSettings({
                                minimumPayoutAmount: {
                                  ...(platformSettings.minimumPayoutAmount ||
                                    {}),
                                  bank: parseFloat(e.target.value),
                                },
                              })
                            }
                            min="1"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <h2 className="text-xl font-semibold">Analytics Dashboard</h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Platform Growth Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="students"
                          stackId="1"
                          stroke="#3B82F6"
                          fill="#EBF8FF"
                        />
                        <Area
                          type="monotone"
                          dataKey="lessons"
                          stackId="1"
                          stroke="#10B981"
                          fill="#F0FDF4"
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stackId="2"
                          stroke="#F59E0B"
                          fill="#FFFBEB"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {(
                          (stats.totalLessons || 0) / (stats.totalUsers || 1) ||
                          0
                        ).toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Lessons per User
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {(stats.averageRating || 0).toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Average Rating
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {(
                          ((stats.completedLessons || 0) /
                            (stats.totalLessons || 1)) *
                            100 || 0
                        ).toFixed(0)}
                        %
                      </div>
                      <div className="text-sm text-gray-500">
                        Completion Rate
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        ${(stats.averageLessonPrice || 0).toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Avg Lesson Price
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Language Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={detailedAnalytics.languageDistribution || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {(detailedAnalytics.languageDistribution || []).map(
                            (entry: any, index: number) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={`hsl(${index * 45}, 70%, 60%)`}
                              />
                            ),
                          )}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Teacher Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(detailedAnalytics.topTeachers || []).map(
                        (teacher: any, index: number) => (
                          <div
                            key={teacher.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  #{index + 1}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">
                                  {teacher.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {teacher.totalLessons} lessons
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                ${(teacher.totalEarnings || 0).toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                ⭐ {(teacher.rating || 0).toFixed(1)}
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* System Management Tab */}
            <TabsContent value="system" className="space-y-4">
              <h2 className="text-xl font-semibold">System Management</h2>

              <Tabs defaultValue="health" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="health">System Health</TabsTrigger>
                  <TabsTrigger value="settings">Platform Settings</TabsTrigger>
                  <TabsTrigger value="backup">Data Management</TabsTrigger>
                  <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                  <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                </TabsList>

                <TabsContent value="health" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>System Status</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Server Status</span>
                          <Badge
                            variant={
                              systemHealth.serverStatus === "healthy"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {systemHealth.serverStatus || "Unknown"}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Database Status</span>
                          <Badge
                            variant={
                              systemHealth.databaseStatus === "connected"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {systemHealth.databaseStatus || "Unknown"}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>API Status</span>
                          <Badge variant="default">Operational</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Storage Status</span>
                          <Badge variant="default">Healthy</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>CPU Usage</span>
                            <span>{systemHealth.cpuUsage || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${systemHealth.cpuUsage || 0}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Memory Usage</span>
                            <span>{systemHealth.memoryUsage || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{
                                width: `${systemHealth.memoryUsage || 0}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Storage Usage</span>
                            <span>{systemHealth.storageUsage || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-600 h-2 rounded-full"
                              style={{
                                width: `${systemHealth.storageUsage || 0}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Data Integrity Check</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            const health = db.getSystemHealth();
                            const integrity = db.validateDataIntegrity();
                            toast({
                              title: "System Check Complete",
                              description: `Found ${integrity.orphanedRecords || 0} orphaned records, ${integrity.missingReferences || 0} missing references`,
                            });
                          }}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Run System Check
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const result = db.performMaintenance();
                            toast({
                              title: "Maintenance Complete",
                              description: `Cleaned ${result.recordsCleaned || 0} records, freed ${result.spaceSaved || 0}MB`,
                            });
                          }}
                        >
                          <Database className="w-4 h-4 mr-2" />
                          Run Maintenance
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Platform Features</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="maintenance-mode">
                            Maintenance Mode
                          </Label>
                          <Switch
                            id="maintenance-mode"
                            checked={platformSettings.maintenanceMode || false}
                            onCheckedChange={(checked) => {
                              updatePlatformSettings({
                                maintenanceMode: checked,
                              });
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="registration-enabled">
                            User Registration
                          </Label>
                          <Switch
                            id="registration-enabled"
                            checked={
                              platformSettings.registrationEnabled || true
                            }
                            onCheckedChange={(checked) => {
                              updatePlatformSettings({
                                registrationEnabled: checked,
                              });
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>System Configuration</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="auto-completion">
                            Auto-completion Hours
                          </Label>
                          <Input
                            id="auto-completion"
                            type="number"
                            value={platformSettings.autoCompletionHours || 2}
                            onChange={(e) =>
                              updatePlatformSettings({
                                autoCompletionHours: parseInt(e.target.value),
                              })
                            }
                            min="1"
                            max="48"
                          />
                        </div>
                        <div>
                          <Label htmlFor="suspension-threshold">
                            Teacher Suspension Threshold
                          </Label>
                          <Input
                            id="suspension-threshold"
                            type="number"
                            value={
                              platformSettings.teacherSuspensionThreshold || 3
                            }
                            onChange={(e) =>
                              updatePlatformSettings({
                                teacherSuspensionThreshold: parseInt(
                                  e.target.value,
                                ),
                              })
                            }
                            min="1"
                            max="10"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="backup" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Data Export & Import</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            const data = db.exportData();
                            const blob = new Blob([data], {
                              type: "application/json",
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `talkcon-backup-${new Date().toISOString().split("T")[0]}.json`;
                            a.click();
                            toast({
                              title: "Data Exported",
                              description:
                                "Complete platform data has been exported.",
                            });
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export All Data
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = ".json";
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement)
                                .files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  const data = e.target?.result as string;
                                  const success = db.importData(data);
                                  toast({
                                    title: success
                                      ? "Data Imported"
                                      : "Import Failed",
                                    description: success
                                      ? "Platform data has been successfully imported."
                                      : "Failed to import data. Please check the file format.",
                                    variant: success
                                      ? "default"
                                      : "destructive",
                                  });
                                  if (success) {
                                    loadData();
                                  }
                                };
                                reader.readAsText(file);
                              }
                            };
                            input.click();
                          }}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Import Data
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to clear all platform data? This action cannot be undone.",
                              )
                            ) {
                              const success = db.clearAllData();
                              toast({
                                title: success
                                  ? "Data Cleared"
                                  : "Clear Failed",
                                description: success
                                  ? "All platform data has been cleared."
                                  : "Failed to clear platform data.",
                                variant: success
                                  ? "destructive"
                                  : "destructive",
                              });
                              if (success) {
                                loadData();
                              }
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear All Data
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Database Statistics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span>Total Users:</span>
                          <span className="font-medium">
                            {stats.totalUsers || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Teachers:</span>
                          <span className="font-medium">
                            {stats.totalTeachers || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Lessons:</span>
                          <span className="font-medium">
                            {stats.totalLessons || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Community Posts:</span>
                          <span className="font-medium">
                            {communityPosts.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Database Size:</span>
                          <span className="font-medium">
                            {dataIntegrity.databaseSize || "N/A"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="maintenance" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Maintenance Tasks</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-start"
                        >
                          <div className="flex items-center mb-2">
                            <Database className="w-5 h-5 mr-2 text-blue-600" />
                            <span className="font-medium">
                              Optimize Database
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            Clean up unused records and optimize performance
                          </span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-start"
                        >
                          <div className="flex items-center mb-2">
                            <HardDrive className="w-5 h-5 mr-2 text-green-600" />
                            <span className="font-medium">Clear Cache</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            Clear application cache and temporary files
                          </span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-start"
                        >
                          <div className="flex items-center mb-2">
                            <Activity className="w-5 h-5 mr-2 text-purple-600" />
                            <span className="font-medium">
                              Generate Reports
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            Create system health and usage reports
                          </span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-start"
                        >
                          <div className="flex items-center mb-2">
                            <RefreshCw className="w-5 h-5 mr-2 text-orange-600" />
                            <span className="font-medium">
                              Restart Services
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            Restart application services safely
                          </span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="monitoring" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Active Users</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">
                            {stats.activeUsers || 0}
                          </div>
                          <div className="text-sm text-gray-500">
                            Currently Online
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Active Lessons</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">
                            {stats.activeLessons || 0}
                          </div>
                          <div className="text-sm text-gray-500">
                            In Progress
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>System Load</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-600">
                            {systemHealth.systemLoad || 0}%
                          </div>
                          <div className="text-sm text-gray-500">
                            Current Load
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* User Details Modal */}
      <Dialog open={userDetailsModal} onOpenChange={setUserDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* User Overview */}
              <div className="flex items-start space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="text-lg">
                    {selectedUser.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {selectedUser.name || "Unknown User"}
                  </h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge
                      variant={
                        selectedUser.status === "active"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {selectedUser.status || "active"}
                    </Badge>
                    <Badge variant="secondary">
                      {selectedUser.role || "student"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="text-sm text-gray-500">
                          Lessons Completed
                        </div>
                        <div className="font-semibold text-lg">
                          {selectedUser.completedLessons || 0}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="text-sm text-gray-500">
                          Hours Learned
                        </div>
                        <div className="font-semibold text-lg">
                          {selectedUser.hoursLearned || 0}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-5 h-5 text-orange-500" />
                      <div>
                        <div className="text-sm text-gray-500">
                          Wallet Balance
                        </div>
                        <div className="font-semibold text-lg">
                          ${selectedUser.walletBalance?.toFixed(2) || "0.00"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="text-sm text-gray-500">
                          Member Since
                        </div>
                        <div className="font-semibold">
                          {new Date(
                            selectedUser.createdAt ||
                              selectedUser.joinedDate ||
                              Date.now(),
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* User Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info className="w-5 h-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Full Name
                      </label>
                      <div className="text-sm font-semibold">
                        {selectedUser.name || "N/A"}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Email Address
                      </label>
                      <div className="text-sm font-semibold">
                        {selectedUser.email || "N/A"}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        User ID
                      </label>
                      <div className="text-sm font-mono">
                        {selectedUser.id || "N/A"}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Account Type
                      </label>
                      <Badge variant="secondary">Student</Badge>
                    </div>
                    {selectedUser.level &&
                      Object.keys(selectedUser.level).length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Language Levels
                          </label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(selectedUser.level).map(
                              ([lang, level]) => (
                                <Badge
                                  key={lang}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {lang}: {level}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    {selectedUser.learningLanguages &&
                      selectedUser.learningLanguages.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Learning Languages
                          </label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedUser.learningLanguages.map(
                              (lang: string) => (
                                <Badge
                                  key={lang}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {lang}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>

              {/* Learning Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Learning Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedUser.completedLessons || 0}
                      </div>
                      <div className="text-sm text-gray-500">
                        Lessons Completed
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedUser.hoursLearned || 0}
                      </div>
                      <div className="text-sm text-gray-500">Hours Learned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedUser.streak || 0}
                      </div>
                      <div className="text-sm text-gray-500">Day Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Wallet Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Recent Transactions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userTransactions.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {userTransactions.slice(0, 10).map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            {transaction.type === "recharge" ? (
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <Wallet className="w-4 h-4 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-blue-600" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-sm">
                                {transaction.description}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(
                                  transaction.createdAt,
                                ).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`font-semibold ${
                                transaction.type === "recharge"
                                  ? "text-green-600"
                                  : "text-blue-600"
                              }`}
                            >
                              {transaction.type === "recharge" ? "+" : "-"}$
                              {(transaction.amount || 0).toFixed(2)}
                            </div>
                            <Badge
                              variant={
                                transaction.status === "completed"
                                  ? "default"
                                  : transaction.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className="text-xs"
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="font-semibold mb-2">No Transactions</h3>
                      <p className="text-gray-500">
                        This user hasn't made any wallet transactions yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Activity History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Activity History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userActivities.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {userActivities.slice(0, 10).map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center space-x-3 p-3 border rounded-lg"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Activity className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {activity.description}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(activity.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {activity.type.replace("_", " ")}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="font-semibold mb-2">No Activity</h3>
                      <p className="text-gray-500">
                        This user's activity history will appear here.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Admin Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Admin Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Message Sent",
                          description:
                            "Your message has been sent to the user.",
                        });
                      }}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "User Updated",
                          description: "User profile has been updated.",
                        });
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "User Suspended",
                          description: "The user account has been suspended.",
                          variant: "destructive",
                        });
                      }}
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Suspend User
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Teacher Application Details Modal */}
      <Dialog
        open={!!selectedApplication}
        onOpenChange={() => setSelectedApplication(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Teacher Application Details</DialogTitle>
            <DialogDescription>
              Review the complete teacher application before making a decision
            </DialogDescription>
          </DialogHeader>
          <TeacherApplicationDetails application={selectedApplication} />
          {selectedApplication && (
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setSelectedApplication(null)}
              >
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleRejectTeacher(selectedApplication.id);
                  setSelectedApplication(null);
                }}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject Application
              </Button>
              <Button
                onClick={() => {
                  handleApproveTeacher(selectedApplication.id);
                  setSelectedApplication(null);
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Teacher
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
