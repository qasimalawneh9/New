import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Globe,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  User,
  GraduationCap,
  BookOpen,
  CheckCircle,
  Users,
} from "lucide-react";

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Russian",
  "Dutch",
];

export default function Signup() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<"student" | "teacher" | "">("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    nativeLanguage: "",
    learningLanguages: [] as string[],
    teachingLanguages: [] as string[],
    experience: "",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [progressRestored, setProgressRestored] = useState(false);

  // Progress saving keys
  const SIGNUP_PROGRESS_KEY = "talkcon_signup_progress";

  // Load saved progress on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(SIGNUP_PROGRESS_KEY);
    if (savedProgress) {
      try {
        const {
          step: savedStep,
          userType: savedUserType,
          formData: savedFormData,
          timestamp,
        } = JSON.parse(savedProgress);
        // Only restore if saved within last 24 hours
        const isRecent =
          timestamp && Date.now() - timestamp < 24 * 60 * 60 * 1000;
        if (
          isRecent &&
          (savedStep > 1 ||
            savedUserType ||
            Object.keys(savedFormData || {}).some((key) => savedFormData[key]))
        ) {
          setStep(savedStep || 1);
          setUserType(savedUserType || "");
          setFormData((prev) => ({ ...prev, ...savedFormData }));
          setProgressRestored(true);
        }
      } catch (error) {
        console.error("Failed to load signup progress:", error);
      }
    }
  }, []);

  // Save progress whenever form data, step, or userType changes
  useEffect(() => {
    const progressData = {
      step,
      userType,
      formData,
      timestamp: Date.now(),
    };
    localStorage.setItem(SIGNUP_PROGRESS_KEY, JSON.stringify(progressData));
  }, [step, userType, formData]);

  // Clear progress after successful signup
  const clearProgress = () => {
    localStorage.removeItem(SIGNUP_PROGRESS_KEY);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLanguageToggle = (
    language: string,
    type: "learning" | "teaching",
  ) => {
    const field =
      type === "learning" ? "learningLanguages" : "teachingLanguages";
    const currentLanguages = formData[field];
    const updatedLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter((l) => l !== language)
      : [...currentLanguages, language];

    handleInputChange(field, updatedLanguages);
  };

  const validateStep1 = () => {
    if (!userType) {
      setError("Please select whether you want to learn or teach");
      return false;
    }
    return true;
  };

  const validateStep2 = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("Please fill in all required fields");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Check if email already exists
    if (db.checkEmailExists(formData.email)) {
      setError(
        "An account with this email address already exists. Please use a different email or try logging in.",
      );
      return false;
    }

    if (!formData.password || formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!formData.acceptTerms) {
      setError("Please accept the terms and conditions");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.nativeLanguage) {
      setError("Please select your native language");
      return false;
    }
    if (userType === "student" && formData.learningLanguages.length === 0) {
      setError("Please select at least one language you want to learn");
      return false;
    }
    if (userType === "teacher" && formData.teachingLanguages.length === 0) {
      setError("Please select at least one language you want to teach");
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    setError("");
    let isValid = false;

    switch (step) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = await validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
    }

    if (isValid) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        handleSignup();
      }
    }
  };

  const handleSignup = async () => {
    try {
      // Clear any previous errors
      setError("");

      const userData = { ...formData, userType };
      const result = await signup(userData);

      if (result === true) {
        clearProgress(); // Clear saved progress on successful signup
        // Redirect to appropriate page
        navigate(
          userType === "teacher" ? "/teacher-application" : "/dashboard",
        );
      } else {
        // Show the specific error message from the database
        setError(
          typeof result === "string"
            ? result
            : "Signup failed. Please try again.",
        );
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          {t("auth.signup.userType") || "How do you want to use Talkcon?"}
        </h3>
        <p className="text-muted-foreground text-sm">
          Choose your primary goal to get a personalized experience
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            userType === "student"
              ? "ring-2 ring-primary bg-primary/5"
              : "hover:bg-muted/50"
          }`}
          onClick={() => setUserType("student")}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">I want to learn languages</h4>
                <p className="text-sm text-muted-foreground">
                  Find certified teachers and start learning today
                </p>
              </div>
              {userType === "student" && (
                <CheckCircle className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary">1-on-1 Lessons</Badge>
              <Badge variant="secondary">Flexible Schedule</Badge>
              <Badge variant="secondary">All Levels</Badge>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            userType === "teacher"
              ? "ring-2 ring-primary bg-primary/5"
              : "hover:bg-muted/50"
          }`}
          onClick={() => setUserType("teacher")}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <GraduationCap className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">I want to teach languages</h4>
                <p className="text-sm text-muted-foreground">
                  Share your expertise and earn money teaching online
                </p>
              </div>
              {userType === "teacher" && (
                <CheckCircle className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary">Earn Money</Badge>
              <Badge variant="secondary">Work Remotely</Badge>
              <Badge variant="secondary">Set Your Schedule</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            className="pl-10 pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={formData.acceptTerms}
          onCheckedChange={(checked) =>
            handleInputChange("acceptTerms", !!checked)
          }
        />
        <Label htmlFor="terms" className="text-sm cursor-pointer">
          I agree to the{" "}
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </Label>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Language Preferences</h3>
        <p className="text-muted-foreground text-sm">
          Tell us about your language background and goals
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>What's your native language?</Label>
          <Select
            value={formData.nativeLanguage}
            onValueChange={(value) =>
              handleInputChange("nativeLanguage", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your native language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {userType === "student" && (
          <div className="space-y-3">
            <Label>Which languages do you want to learn?</Label>
            <div className="grid grid-cols-2 gap-2">
              {languages
                .filter((lang) => lang !== formData.nativeLanguage)
                .map((language) => (
                  <Button
                    key={language}
                    type="button"
                    variant={
                      formData.learningLanguages.includes(language)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => handleLanguageToggle(language, "learning")}
                    className="justify-start"
                  >
                    {language}
                  </Button>
                ))}
            </div>
          </div>
        )}

        {userType === "teacher" && (
          <div className="space-y-3">
            <Label>Which languages can you teach?</Label>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((language) => (
                <Button
                  key={language}
                  type="button"
                  variant={
                    formData.teachingLanguages.includes(language)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => handleLanguageToggle(language, "teaching")}
                  className="justify-start"
                >
                  {language}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

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
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">
                {step === 1
                  ? "Get Started"
                  : step === 2
                    ? "Create Account"
                    : "Almost Done!"}
              </CardTitle>
              <div className="text-sm text-muted-foreground">{step}/3</div>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </CardHeader>
          <CardContent>
            {progressRestored && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <div className="flex items-center justify-between">
                    <span>
                      <strong>Welcome back!</strong> We've restored your signup
                      progress from where you left off.
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        clearProgress();
                        setProgressRestored(false);
                        setStep(1);
                        setUserType("");
                        setFormData({
                          firstName: "",
                          lastName: "",
                          email: "",
                          password: "",
                          confirmPassword: "",
                          nativeLanguage: "",
                          learningLanguages: [],
                          teachingLanguages: [],
                          experience: "",
                          acceptTerms: false,
                        });
                      }}
                      className="text-green-700 hover:text-green-900 text-xs"
                    >
                      Start Fresh
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={isLoading}
                >
                  Back
                </Button>
              )}
              <div className="flex-1" />
              <Button
                onClick={handleNext}
                disabled={isLoading}
                className="min-w-[100px]"
              >
                {isLoading
                  ? "Creating..."
                  : step === 3
                    ? "Create Account"
                    : "Next"}
              </Button>
            </div>

            {step === 1 && (
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  Already have an account?{" "}
                </span>
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {step === 1 && (
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>10,000+ Teachers</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-1" />
                <span>150+ Countries</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
