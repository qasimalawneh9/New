import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu";
import {
  Search,
  MessageCircle,
  Calendar,
  User,
  Settings,
  LogOut,
  Globe,
  BookOpen,
  Star,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/lib/database";
import { LanguageSwitcher } from "./language-switcher";
import { NotificationSystem } from "@/components/notifications/NotificationSystem";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavbarProps {
  isLoggedIn?: boolean;
  userType?: "student" | "teacher";
}

export function Navbar({ isLoggedIn, userType }: NavbarProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Override props with actual auth state
  const actualIsLoggedIn = isLoggedIn !== undefined ? isLoggedIn : !!user;

  // Smart dashboard routing based on user type and teacher approval status
  const getDashboardUrl = () => {
    if (!user) return "/dashboard";

    if (user.type === "teacher") {
      // Check teacher application status
      const teacherData = db.getTeacherByEmail(user.email);
      if (teacherData) {
        if (teacherData.status === "approved") {
          return "/teacher-dashboard";
        } else if (teacherData.status === "pending") {
          return "/teacher-application-under-review";
        } else if (teacherData.status === "incomplete") {
          return "/teacher-application";
        } else {
          return "/teacher-application-status";
        }
      }
      return "/teacher-application-status";
    }

    if (user.type === "admin") {
      return "/admin";
    }

    return "/dashboard";
  };
  const actualUserType = userType || user?.type || "student";

  const navigation = [
    { name: t("nav.findTeachers"), href: "/teachers", icon: Search },
    { name: "Community", href: "/community", icon: Globe },
    { name: t("nav.howItWorks"), href: "/how-it-works", icon: BookOpen },
    { name: t("nav.becomeTeacher"), href: "/teach", icon: Star },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              {/* Main logo container with layered design */}
              <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 shadow-lg transform rotate-3">
                {/* Inner geometric pattern */}
                <div className="absolute inset-0.5 rounded-lg bg-gradient-to-br from-red-500/90 to-red-800/90">
                  {/* Speech bubble layers */}
                  <div className="absolute top-1 left-1 w-3 h-2.5 bg-white/90 rounded-sm"></div>
                  <div className="absolute top-2.5 right-1 w-2.5 h-2 bg-white/70 rounded-sm"></div>
                  <div className="absolute bottom-1.5 left-1.5 w-2 h-1.5 bg-white/50 rounded-sm"></div>
                  {/* Central "T" shape */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white font-bold text-sm leading-none">
                      T
                    </div>
                  </div>
                </div>
                {/* Floating accent dot */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full shadow-sm animate-pulse"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent tracking-tight">
                Talkcon
              </span>
              <span className="text-xs text-muted-foreground -mt-1 tracking-wider">
                CONNECT
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navigation.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        isActive(item.href) &&
                          "bg-accent text-accent-foreground",
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {actualIsLoggedIn ? (
              <>
                {/* Language Switcher */}
                <LanguageSwitcher variant="minimal" />

                {/* Notifications */}
                <NotificationSystem />

                {/* Calendar */}
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/dashboard/lessons">
                    <Calendar className="h-5 w-5" />
                  </Link>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardUrl()}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <LanguageSwitcher variant="compact" />
                <Button variant="ghost" asChild>
                  <Link to="/login">{t("nav.login")}</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">{t("nav.signup")}</Link>
                </Button>
              </>
            )}

            {/* Test Buttons */}
            <div className="flex gap-2 ml-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin">Admin</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/teacher-dashboard">Teacher</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              ))}

              {!actualIsLoggedIn && (
                <div className="pt-4 space-y-2">
                  <div className="mb-3">
                    <LanguageSelector variant="outline" showText={true} />
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("nav.login")}
                    </Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("nav.signup")}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
