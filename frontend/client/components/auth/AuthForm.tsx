import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Shield,
  Chrome,
  Facebook,
  Apple,
  Clock,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { LoginForm, RegisterForm, AuthProvider } from "../../types/platform";
import { cn } from "../../lib/utils";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (data: LoginForm | RegisterForm) => Promise<void>;
  onModeChange: (mode: "login" | "register") => void;
  onSocialAuth: (provider: string) => Promise<void>;
  onForgotPassword: (email: string) => Promise<void>;
  loading?: boolean;
  error?: string;
  enabledProviders?: AuthProvider[];
  className?: string;
}

const timezones = [
  { value: "UTC", label: "(UTC) Coordinated Universal Time" },
  { value: "America/New_York", label: "(EST) Eastern Time" },
  { value: "America/Chicago", label: "(CST) Central Time" },
  { value: "America/Denver", label: "(MST) Mountain Time" },
  { value: "America/Los_Angeles", label: "(PST) Pacific Time" },
  { value: "Europe/London", label: "(GMT) London" },
  { value: "Europe/Paris", label: "(CET) Central European Time" },
  { value: "Asia/Tokyo", label: "(JST) Japan Standard Time" },
  { value: "Asia/Shanghai", label: "(CST) China Standard Time" },
  { value: "Australia/Sydney", label: "(AEST) Australian Eastern Time" },
];

export function AuthForm({
  mode,
  onSubmit,
  onModeChange,
  onSocialAuth,
  onForgotPassword,
  loading = false,
  error,
  enabledProviders = [],
  className,
}: AuthFormProps) {
  const [formData, setFormData] = useState<LoginForm | RegisterForm>(
    mode === "login"
      ? {
          email: "",
          password: "",
          rememberMe: false,
          twoFactorCode: "",
        }
      : {
          name: "",
          email: "",
          password: "",
          passwordConfirmation: "",
          role: "student" as const,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          termsAccepted: false,
        },
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const isLogin = mode === "login";
  const loginData = formData as LoginForm;
  const registerData = formData as RegisterForm;

  const updateFormData = (updates: Partial<LoginForm | RegisterForm>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const validateForm = (): string | null => {
    if (!formData.email || !formData.password) {
      return "Email and password are required";
    }

    if (!isLogin) {
      const regData = formData as RegisterForm;
      if (!regData.name) return "Name is required";
      if (regData.password !== regData.passwordConfirmation) {
        return "Passwords do not match";
      }
      if (regData.password.length < 8) {
        return "Password must be at least 8 characters";
      }
      if (!regData.termsAccepted) {
        return "You must accept the terms and conditions";
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      // Error handling is done in parent component
    }
  };

  const handleSocialAuth = async (provider: string) => {
    try {
      await onSocialAuth(provider);
    } catch (err) {
      // Error handling is done in parent component
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) return;

    try {
      await onForgotPassword(forgotPasswordEmail);
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    } catch (err) {
      // Error handling is done in parent component
    }
  };

  const socialProviders = [
    {
      id: "google",
      name: "Google",
      icon: Chrome,
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: "apple",
      name: "Apple",
      icon: Apple,
      color: "bg-black hover:bg-gray-800",
    },
  ];

  return (
    <div className={cn("max-w-md mx-auto", className)}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isLogin ? "Welcome Back" : "Join Talkcon"}
          </CardTitle>
          <p className="text-muted-foreground">
            {isLogin
              ? "Sign in to your account to continue"
              : "Create your account to start learning"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Social Authentication */}
          {enabledProviders.length > 0 && (
            <div className="space-y-3">
              {socialProviders
                .filter((provider) =>
                  enabledProviders.some((ep) => ep.name === provider.id),
                )
                .map((provider) => {
                  const Icon = provider.icon;
                  return (
                    <Button
                      key={provider.id}
                      variant="outline"
                      className="w-full"
                      onClick={() => handleSocialAuth(provider.id)}
                      disabled={loading}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      Continue with {provider.name}
                    </Button>
                  );
                })}
              <div className="relative">
                <Separator />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-muted-foreground">
                  or
                </span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={registerData.name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => updateFormData({ password: e.target.value })}
                  className="pl-9 pr-9"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Confirm Password (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={registerData.passwordConfirmation}
                    onChange={(e) =>
                      updateFormData({ passwordConfirmation: e.target.value })
                    }
                    className="pl-9 pr-9"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Role Selection (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium">I want to *</label>
                <Select
                  value={registerData.role}
                  onValueChange={(value: "student" | "teacher") =>
                    updateFormData({ role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">
                      Learn with teachers (Student)
                    </SelectItem>
                    <SelectItem value="teacher">
                      Teach students (Teacher)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Timezone (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Timezone *</label>
                <Select
                  value={registerData.timezone}
                  onValueChange={(value) => updateFormData({ timezone: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* 2FA Code (Login only, when needed) */}
            {isLogin && show2FA && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Two-Factor Authentication Code
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={loginData.twoFactorCode}
                    onChange={(e) =>
                      updateFormData({ twoFactorCode: e.target.value })
                    }
                    className="pl-9"
                    maxLength={6}
                  />
                </div>
              </div>
            )}

            {/* Remember Me (Login only) */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={loginData.rememberMe}
                    onCheckedChange={(checked) =>
                      updateFormData({ rememberMe: !!checked })
                    }
                  />
                  <label htmlFor="remember" className="text-sm">
                    Remember me
                  </label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => setShowForgotPassword(true)}
                  className="p-0 h-auto"
                >
                  Forgot password?
                </Button>
              </div>
            )}

            {/* Terms Acceptance (Register only) */}
            {!isLogin && (
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={registerData.termsAccepted}
                  onCheckedChange={(checked) =>
                    updateFormData({ termsAccepted: !!checked })
                  }
                />
                <label htmlFor="terms" className="text-sm leading-tight">
                  I agree to the{" "}
                  <Button variant="link" className="p-0 h-auto underline">
                    Terms of Service
                  </Button>{" "}
                  and{" "}
                  <Button variant="link" className="p-0 h-auto underline">
                    Privacy Policy
                  </Button>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </div>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Mode Switch */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <Button
                variant="link"
                onClick={() => onModeChange(isLogin ? "register" : "login")}
                className="p-0 h-auto font-medium"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </Button>
            </p>
          </div>

          {/* 2FA Toggle (for demo purposes) */}
          {isLogin && (
            <div className="text-center">
              <Button
                variant="link"
                size="sm"
                onClick={() => setShow2FA(!show2FA)}
                className="text-xs"
              >
                {show2FA ? "Hide" : "Show"} 2FA field
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
            <Input
              type="email"
              placeholder="Enter your email"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowForgotPassword(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleForgotPassword}
                disabled={!forgotPasswordEmail}
                className="flex-1"
              >
                Send Reset Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AuthForm;
