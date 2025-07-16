import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Globe,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { db } from "@/lib/database";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        // Smart redirect based on user type
        const user = JSON.parse(localStorage.getItem("talkcon_user") || "{}");
        let redirectUrl = "/dashboard";

        if (user.type === "teacher") {
          const teacherData = db.getTeacherByEmail(user.email);
          if (teacherData) {
            if (teacherData.status === "approved") {
              redirectUrl = "/teacher-dashboard";
            } else if (teacherData.status === "pending") {
              redirectUrl = "/teacher-application-under-review";
            } else if (teacherData.status === "incomplete") {
              redirectUrl = "/teacher-application";
            } else {
              redirectUrl = "/teacher-application-status";
            }
          } else {
            redirectUrl = "/teacher-application-status";
          }
        } else if (user.type === "admin") {
          redirectUrl = "/admin";
        }

        const returnTo = location.state?.returnTo || redirectUrl;
        navigate(returnTo);
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Mock social login
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Globe className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 shadow-lg transform rotate-3">
                <div className="absolute inset-0.5 rounded-lg bg-gradient-to-br from-red-500/90 to-red-800/90">
                  <div className="absolute top-1 left-1 w-3 h-2.5 bg-white/90 rounded-sm"></div>
                  <div className="absolute top-2.5 right-1 w-2.5 h-2 bg-white/70 rounded-sm"></div>
                  <div className="absolute bottom-1.5 left-1.5 w-2 h-1.5 bg-white/50 rounded-sm"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white font-bold text-sm leading-none">
                      T
                    </div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full shadow-sm"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-800 to-red-900 bg-clip-text text-transparent">
                Talkcon
              </span>
            </div>
          </Link>
        </div>

        <Card className="shadow-xl border-0 bg-background/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {t("auth.login.title")}
            </CardTitle>
            <p className="text-center text-muted-foreground">
              {t("auth.login.subtitle")}
            </p>
          </CardHeader>
          <CardContent>
            {/* Demo Credentials */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Demo Accounts
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong className="text-blue-800 dark:text-blue-200">
                    Student Demo:
                  </strong>
                  <br />
                  <span className="text-blue-700 dark:text-blue-300">
                    demo@student.com / demo123
                  </span>
                </div>
                <div>
                  <strong className="text-blue-800 dark:text-blue-200">
                    Teacher Demo:
                  </strong>
                  <br />
                  <span className="text-blue-700 dark:text-blue-300">
                    demo@teacher.com / demo123
                  </span>
                </div>
                <div>
                  <strong className="text-blue-800 dark:text-blue-200">
                    Admin Demo:
                  </strong>
                  <br />
                  <span className="text-blue-700 dark:text-blue-300">
                    admin@talkcon.com / admin123
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("google")}
                  className="w-full"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("facebook")}
                  className="w-full"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Don't have an account?{" "}
              </span>
              <Link
                to="/signup"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm font-medium">Demo Credentials</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Email: demo@example.com</div>
                <div>Password: password</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>
            By signing in, you agree to our{" "}
            <Link to="/terms" className="hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
