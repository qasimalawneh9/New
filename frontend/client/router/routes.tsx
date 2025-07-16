// Import critical pages directly (no lazy loading)
import Index from "../pages/Index";
import LoginFixed from "../pages/LoginFixed";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import TeachersAdvanced from "../pages/TeachersAdvanced";
import TeacherProfile from "../pages/TeacherProfile";
import Messages from "../pages/Messages";
import MessagingSystem from "../pages/MessagingSystem";
import LessonRoom from "../pages/LessonRoom";
import BookingConfirmation from "../pages/BookingConfirmation";
import HowItWorks from "../pages/HowItWorks";
import BecomeTeacher from "../pages/BecomeTeacher";
import Pricing from "../pages/Pricing";
import Languages from "../pages/Languages";
import Help from "../pages/Help";
import Contact from "../pages/Contact";
import Privacy from "../pages/Privacy";
import Terms from "../pages/Terms";
import TeacherApplication from "../pages/TeacherApplication";
import TeacherApplicationSubmitted from "../pages/TeacherApplicationSubmitted";
import TeacherDashboard from "../pages/TeacherDashboard";
import StudentDashboard from "../pages/StudentDashboard";
import TeacherSettings from "../pages/TeacherSettings";
import TeacherResources from "../pages/TeacherResources";
import TeacherSupport from "../pages/TeacherSupport";
import Settings from "../pages/Settings";
import AdminDashboard from "../pages/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminTeachers from "../pages/admin/AdminTeachers";
import AdminPayouts from "../pages/admin/AdminPayouts";
import AdminSupport from "../pages/admin/AdminSupport";
import Support from "../pages/Support";
import ForgotPassword from "../pages/ForgotPassword";
import DashboardLessons from "../pages/DashboardLessons";
import TeacherApplicationStatus from "../pages/TeacherApplicationStatus";
import TeacherApplicationUnderReview from "../pages/TeacherApplicationUnderReview";
import Community from "../pages/Community";
import NotFound from "../pages/NotFound";
import Legal from "../pages/Legal";

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
}

export const routes: RouteConfig[] = [
  { path: "/", component: Index },
  { path: "/teachers", component: TeachersAdvanced },
  { path: "/teachers/:id", component: TeacherProfile },
  { path: "/dashboard", component: Dashboard },
  { path: "/login", component: LoginFixed },
  { path: "/signup", component: Signup },
  { path: "/messages", component: Messages },
  { path: "/lesson/:id", component: LessonRoom },
  { path: "/booking/:id", component: BookingConfirmation },
  { path: "/how-it-works", component: HowItWorks },
  { path: "/teach", component: BecomeTeacher },
  { path: "/pricing", component: Pricing },
  { path: "/languages", component: Languages },
  { path: "/help", component: Help },
  { path: "/contact", component: Contact },
  { path: "/privacy", component: Privacy },
  { path: "/terms", component: Terms },
  { path: "/teacher-application", component: TeacherApplication },
  {
    path: "/teacher-application-submitted",
    component: TeacherApplicationSubmitted,
  },
  { path: "/teacher-dashboard", component: TeacherDashboard },
  { path: "/student-dashboard", component: StudentDashboard },
  { path: "/teacher-settings", component: TeacherSettings },
  { path: "/teacher-resources", component: TeacherResources },
  { path: "/teacher-support", component: TeacherSupport },
  { path: "/settings", component: Settings },
  { path: "/admin", component: AdminDashboard },
  { path: "/admin/users", component: AdminUsers },
  { path: "/admin/teachers", component: AdminTeachers },
  { path: "/admin/payouts", component: AdminPayouts },
  { path: "/admin/support", component: AdminSupport },
  { path: "/support", component: Support },
  { path: "/forgot-password", component: ForgotPassword },
  { path: "/dashboard/lessons", component: DashboardLessons },
  { path: "/teacher-application-status", component: TeacherApplicationStatus },
  {
    path: "/teacher-application-under-review",
    component: TeacherApplicationUnderReview,
  },
  { path: "/community", component: Community },
  { path: "/legal", component: Legal },
  { path: "*", component: NotFound },
];
