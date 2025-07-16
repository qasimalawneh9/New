/**
 * Login Form Component
 *
 * This component handles user authentication and maps to Laravel AuthController.
 * Features semantic IDs and classes for easy backend integration.
 */

import React, { useState, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";

// Form data interface - matches Laravel validation rules
interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

// Component props
interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
  className?: string;
}

/**
 * LoginForm Component
 *
 * Backend Integration Notes:
 * - Form ID: 'auth-login-form' → Laravel Route: POST /api/auth/login
 * - Submit Handler: handleSubmit() → AuthController@login
 * - Validation: Uses Laravel validation rules
 * - Response Format: { user: {}, token: string, expires_in: number }
 *
 * Required Laravel Setup:
 * 1. Route::post('/auth/login', [AuthController::class, 'login'])
 * 2. Return user data with JWT token
 * 3. Handle validation errors in format: { errors: { field: [messages] } }
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  redirectTo,
  className = "",
}) => {
  // Hooks
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});

  // Handle form input changes
  const handleInputChange = (field: keyof LoginFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Clear previous errors
      setValidationErrors({});

      // Submit to Laravel backend
      await login(formData);

      // Handle success
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect to intended page or dashboard
        const returnTo =
          redirectTo || (location.state as any)?.returnTo || "/dashboard";
        navigate(returnTo, { replace: true });
      }
    } catch (error: any) {
      // Handle Laravel validation errors
      if (error.validationErrors) {
        setValidationErrors(error.validationErrors);
      }
    }
  };

  // Get field error message
  const getFieldError = (field: string): string | undefined => {
    return validationErrors[field]?.[0];
  };

  return (
    <Card
      id="login-form-container"
      className={`auth-form-container w-full max-w-md mx-auto ${className}`}
      data-component="login-form"
      data-laravel-controller="AuthController"
      data-laravel-action="login"
    >
      <CardHeader className="auth-form__header text-center">
        <CardTitle
          id="login-form-title"
          className="auth-form__title text-2xl font-bold"
        >
          Sign In to Talkcon
        </CardTitle>
        <p className="auth-form__subtitle text-muted-foreground">
          Welcome back! Please sign in to your account.
        </p>
      </CardHeader>

      <CardContent className="auth-form__content">
        {/* Global error alert */}
        {error && (
          <Alert
            id="login-error-alert"
            className="auth-form__error mb-4"
            variant="destructive"
            data-error-type="authentication"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form
          id="login-form"
          className="auth-form space-y-4"
          onSubmit={handleSubmit}
          data-form-type="authentication"
          data-form-action="login"
          noValidate
        >
          {/* Email Field */}
          <div
            className="auth-form__field"
            data-field="email"
            data-laravel-validation="required|email"
          >
            <Label
              htmlFor="email-input"
              className="auth-form__label"
              data-field-label="email"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="email-input"
                name="email"
                type="email"
                autoComplete="email"
                className={`auth-form__input pl-10 ${
                  getFieldError("email") ? "border-destructive" : ""
                }`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                data-field="email"
                data-validation="email"
                required
                aria-describedby={
                  getFieldError("email") ? "email-error" : undefined
                }
                aria-invalid={!!getFieldError("email")}
              />
            </div>
            {getFieldError("email") && (
              <p
                id="email-error"
                className="auth-form__error-message text-sm text-destructive mt-1"
                role="alert"
                data-field-error="email"
              >
                {getFieldError("email")}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div
            className="auth-form__field"
            data-field="password"
            data-laravel-validation="required|min:8"
          >
            <Label
              htmlFor="password-input"
              className="auth-form__label"
              data-field-label="password"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="password-input"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className={`auth-form__input pl-10 pr-10 ${
                  getFieldError("password") ? "border-destructive" : ""
                }`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                data-field="password"
                data-validation="password"
                required
                aria-describedby={
                  getFieldError("password") ? "password-error" : undefined
                }
                aria-invalid={!!getFieldError("password")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                data-action="toggle-password-visibility"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {getFieldError("password") && (
              <p
                id="password-error"
                className="auth-form__error-message text-sm text-destructive mt-1"
                role="alert"
                data-field-error="password"
              >
                {getFieldError("password")}
              </p>
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div
            className="auth-form__field flex items-center space-x-2"
            data-field="remember"
          >
            <input
              id="remember-input"
              name="remember"
              type="checkbox"
              className="auth-form__checkbox"
              checked={formData.remember}
              onChange={(e) => handleInputChange("remember", e.target.checked)}
              data-field="remember"
            />
            <Label
              htmlFor="remember-input"
              className="auth-form__label text-sm cursor-pointer"
              data-field-label="remember"
            >
              Remember me for 30 days
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            id="login-submit-button"
            type="submit"
            className="auth-form__submit w-full"
            disabled={isLoading}
            data-action="submit-login"
            data-loading={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Forgot Password Link */}
          <div className="auth-form__links text-center space-y-2">
            <Link
              to="/forgot-password"
              className="auth-form__link text-sm text-primary hover:underline"
              data-navigation="forgot-password"
              data-laravel-route="password.request"
            >
              Forgot your password?
            </Link>

            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="auth-form__link text-primary hover:underline font-medium"
                data-navigation="register"
                data-laravel-route="register"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
