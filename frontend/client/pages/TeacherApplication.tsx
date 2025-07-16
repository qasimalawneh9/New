import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import {
  Upload,
  Video,
  Award,
  BookOpen,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Users,
} from "lucide-react";
import { db } from "../lib/database";

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
  "Hindi",
  "Urdu",
  "Turkish",
  "Greek",
  "Hebrew",
  "Thai",
  "Vietnamese",
];

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Spain",
  "France",
  "Germany",
  "Italy",
  "China",
  "Japan",
  "South Korea",
  "Brazil",
  "Mexico",
  "Argentina",
  "Russia",
  "Netherlands",
  "Sweden",
];

const certifications = [
  "TEFL",
  "TESOL",
  "CELTA",
  "DELE",
  "DALF",
  "JLPT",
  "HSK",
  "IELTS Examiner",
  "Cambridge Certified",
  "Native Speaker",
  "University Degree",
  "Teaching License",
];

const teachingExperienceLevels = [
  "No formal experience",
  "Less than 1 year",
  "1-2 years",
  "3-5 years",
  "6-10 years",
  "10+ years",
];

export default function TeacherApplication() {
  const navigate = useNavigate();
  const { signup, user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information - Pre-filled from user account
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    timezone: "",
    dateOfBirth: "",

    // Languages & Teaching
    nativeLanguage: "",
    teachingLanguages: [] as string[],
    otherLanguages: [] as string[],

    // Education & Qualifications
    education: "",
    university: "",
    degree: "",
    graduationYear: "",
    certifications: [] as string[],
    teachingExperience: "",

    // Teaching Preferences
    hourlyRate: "",
    specialties: [] as string[],
    availability: [] as string[],
    lessonTypes: [] as string[],
    ageGroups: [] as string[],

    // Professional Profile
    headline: "",
    description: "",
    teachingMethod: "",
    whyTeach: "",

    // Media & Documents
    profilePhoto: null as File | null,
    introVideo: null as File | null,
    introVideoUrl: "",
    resume: null as File | null,
    certificates: [] as File[],

    // Verification
    governmentId: null as File | null,
    proofOfAddress: null as File | null,

    // Terms
    agreeToTerms: false,
    agreeToBackground: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [progressRestored, setProgressRestored] = useState(false);

  // Progress saving key
  const APPLICATION_PROGRESS_KEY = `talkcon_teacher_application_${user?.id || "temp"}`;

  // Load saved progress on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(APPLICATION_PROGRESS_KEY);
    if (savedProgress) {
      try {
        const {
          step: savedStep,
          formData: savedFormData,
          timestamp,
        } = JSON.parse(savedProgress);
        // Only restore if saved within last 7 days and there's meaningful progress
        const isRecent =
          timestamp && Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000;
        const hasProgress =
          savedStep > 1 ||
          Object.keys(savedFormData || {}).some(
            (key) =>
              key !== "firstName" &&
              key !== "lastName" &&
              key !== "email" &&
              savedFormData[key],
          );

        if (isRecent && hasProgress) {
          setStep(savedStep || 1);
          setFormData((prev) => ({ ...prev, ...savedFormData }));
          setProgressRestored(true);
        }
      } catch (error) {
        console.error("Failed to load application progress:", error);
      }
    }
  }, [APPLICATION_PROGRESS_KEY]);

  // Pre-fill form data from logged-in user (only for basic fields)
  useEffect(() => {
    if (user) {
      const [firstName, ...lastNameParts] = user.name.split(" ");
      const lastName = lastNameParts.join(" ");

      setFormData((prev) => ({
        ...prev,
        firstName: firstName || "",
        lastName: lastName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  // Save progress whenever form data or step changes
  useEffect(() => {
    if (user) {
      const progressData = {
        step,
        formData,
        timestamp: Date.now(),
      };
      localStorage.setItem(
        APPLICATION_PROGRESS_KEY,
        JSON.stringify(progressData),
      );
    }
  }, [step, formData, APPLICATION_PROGRESS_KEY, user]);

  // Clear progress after successful submission
  const clearProgress = () => {
    localStorage.removeItem(APPLICATION_PROGRESS_KEY);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (stepNumber) {
      case 1:
        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.nativeLanguage)
          newErrors.nativeLanguage = "Native language is required";
        break;
      case 2:
        if (formData.teachingLanguages.length === 0) {
          newErrors.teachingLanguages = "Select at least one teaching language";
        }
        if (!formData.education)
          newErrors.education = "Education level is required";
        if (!formData.teachingExperience)
          newErrors.teachingExperience = "Teaching experience is required";
        break;
      case 3:
        if (!formData.hourlyRate)
          newErrors.hourlyRate = "Hourly rate is required";
        if (formData.specialties.length === 0) {
          newErrors.specialties = "Select at least one specialty";
        }
        break;
      case 4:
        if (!formData.headline)
          newErrors.headline = "Professional headline is required";
        if (!formData.description)
          newErrors.description = "Description is required";
        if (formData.description.length < 150) {
          newErrors.description = "Description must be at least 150 characters";
        }
        break;
      case 5:
        if (!formData.profilePhoto)
          newErrors.profilePhoto = "Profile photo is required";
        if (!formData.introVideo && !formData.introVideoUrl)
          newErrors.introVideo = "Introduction video file or URL is required";
        break;
      case 6:
        if (!formData.agreeToTerms)
          newErrors.agreeToTerms = "You must agree to terms";
        if (!formData.agreeToBackground)
          newErrors.agreeToBackground = "Background check consent required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 6) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error("User not logged in");
      }

      // Update existing teacher with application data
      const success = db.updateTeacherApplication(user.id, formData);

      if (success) {
        clearProgress(); // Clear saved progress on successful submission
        toast({
          title: "Application Submitted Successfully!",
          description:
            "Your teacher application has been submitted for review. You'll receive an email once it's approved.",
        });
        navigate("/teacher-application-under-review");
      } else {
        toast({
          title: "Application Failed",
          description:
            "There was an error submitting your application. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Application submission failed:", error);
      toast({
        title: "Application Failed",
        description:
          "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
        <p className="text-muted-foreground">Tell us about yourself</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            readOnly
            className="bg-muted/50"
            placeholder="From your account"
          />
          <p className="text-xs text-muted-foreground">
            From your account registration
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            readOnly
            className="bg-muted/50"
            placeholder="From your account"
          />
          <p className="text-xs text-muted-foreground">
            From your account registration
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          readOnly
          className="bg-muted/50"
          placeholder="From your account"
        />
        <p className="text-xs text-muted-foreground">
          From your account registration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Select
            value={formData.country}
            onValueChange={(value) => handleInputChange("country", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-sm text-red-500">{errors.country}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            placeholder="New York"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nativeLanguage">Native Language *</Label>
        <Select
          value={formData.nativeLanguage}
          onValueChange={(value) => handleInputChange("nativeLanguage", value)}
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
        {errors.nativeLanguage && (
          <p className="text-sm text-red-500">{errors.nativeLanguage}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Languages & Qualifications</h2>
        <p className="text-muted-foreground">What languages do you teach?</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">
            Languages you can teach *
          </Label>
          <p className="text-sm text-muted-foreground mb-3">
            Select all languages you are qualified to teach
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
                onClick={() => handleArrayToggle("teachingLanguages", language)}
                className="justify-start"
              >
                {language}
              </Button>
            ))}
          </div>
          {errors.teachingLanguages && (
            <p className="text-sm text-red-500">{errors.teachingLanguages}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="education">Education Level *</Label>
          <Select
            value={formData.education}
            onValueChange={(value) => handleInputChange("education", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high-school">High School</SelectItem>
              <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
              <SelectItem value="masters">Master's Degree</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.education && (
            <p className="text-sm text-red-500">{errors.education}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="university">University/Institution</Label>
            <Input
              id="university"
              value={formData.university}
              onChange={(e) => handleInputChange("university", e.target.value)}
              placeholder="Harvard University"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="degree">Degree/Field of Study</Label>
            <Input
              id="degree"
              value={formData.degree}
              onChange={(e) => handleInputChange("degree", e.target.value)}
              placeholder="English Literature"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="teachingExperience">Teaching Experience *</Label>
          <Select
            value={formData.teachingExperience}
            onValueChange={(value) =>
              handleInputChange("teachingExperience", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your teaching experience" />
            </SelectTrigger>
            <SelectContent>
              {teachingExperienceLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.teachingExperience && (
            <p className="text-sm text-red-500">{errors.teachingExperience}</p>
          )}
        </div>

        <div>
          <Label className="text-base font-medium">Certifications</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Select all relevant teaching certifications you have
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {certifications.map((cert) => (
              <Button
                key={cert}
                type="button"
                variant={
                  formData.certifications.includes(cert) ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleArrayToggle("certifications", cert)}
                className="justify-start"
              >
                {cert}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Teaching Preferences</h2>
        <p className="text-muted-foreground">Set your rates and specialties</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Hourly Rate (USD) *</Label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-muted-foreground">
              $
            </span>
            <Input
              id="hourlyRate"
              type="number"
              value={formData.hourlyRate}
              onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
              placeholder="25"
              className="pl-7"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Average rate for new teachers: $15-25/hour
          </p>
          {errors.hourlyRate && (
            <p className="text-sm text-red-500">{errors.hourlyRate}</p>
          )}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Teaching Specialties *</Label>
        <p className="text-sm text-muted-foreground mb-3">
          What do you specialize in teaching?
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            "Conversation",
            "Grammar",
            "Business",
            "Academic",
            "Test Prep",
            "Kids & Teens",
            "Pronunciation",
            "Writing",
            "Literature",
            "Culture",
          ].map((specialty) => (
            <Button
              key={specialty}
              type="button"
              variant={
                formData.specialties.includes(specialty) ? "default" : "outline"
              }
              size="sm"
              onClick={() => handleArrayToggle("specialties", specialty)}
              className="justify-start"
            >
              {specialty}
            </Button>
          ))}
        </div>
        {errors.specialties && (
          <p className="text-sm text-red-500">{errors.specialties}</p>
        )}
      </div>

      <div>
        <Label className="text-base font-medium">
          Preferred Student Age Groups
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
          {[
            "Kids (5-12)",
            "Teens (13-17)",
            "Adults (18-50)",
            "Seniors (50+)",
          ].map((age) => (
            <Button
              key={age}
              type="button"
              variant={formData.ageGroups.includes(age) ? "default" : "outline"}
              size="sm"
              onClick={() => handleArrayToggle("ageGroups", age)}
              className="justify-start"
            >
              {age}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Lesson Types</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
          {[
            "Individual",
            "Group (2-3)",
            "Group (4+)",
            "Intensive",
            "Trial",
          ].map((type) => (
            <Button
              key={type}
              type="button"
              variant={
                formData.lessonTypes.includes(type) ? "default" : "outline"
              }
              size="sm"
              onClick={() => handleArrayToggle("lessonTypes", type)}
              className="justify-start"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Professional Profile</h2>
        <p className="text-muted-foreground">Create your teaching profile</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="headline">Professional Headline *</Label>
        <Input
          id="headline"
          value={formData.headline}
          onChange={(e) => handleInputChange("headline", e.target.value)}
          placeholder="e.g., Certified English Teacher with 5 years experience"
          maxLength={100}
        />
        <p className="text-xs text-muted-foreground">
          {formData.headline.length}/100 characters
        </p>
        {errors.headline && (
          <p className="text-sm text-red-500">{errors.headline}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">About You & Your Teaching *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Tell students about your teaching experience, methodology, and what makes you unique..."
          rows={6}
          maxLength={1500}
        />
        <p className="text-xs text-muted-foreground">
          {formData.description.length}/1500 characters (minimum 150)
        </p>
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="teachingMethod">Teaching Methodology</Label>
        <Textarea
          id="teachingMethod"
          value={formData.teachingMethod}
          onChange={(e) => handleInputChange("teachingMethod", e.target.value)}
          placeholder="Describe your teaching approach and methods..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="whyTeach">Why do you love teaching?</Label>
        <Textarea
          id="whyTeach"
          value={formData.whyTeach}
          onChange={(e) => handleInputChange("whyTeach", e.target.value)}
          placeholder="Share your passion for teaching and helping students learn..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Media & Documents</h2>
        <p className="text-muted-foreground">
          Upload your photos, video, and certificates
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          High-quality photos and videos significantly improve your approval
          chances and student bookings.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Profile Photo *
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
              <input
                type="file"
                id="profilePhoto"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleFileUpload("profilePhoto", file);
                }}
              />
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                {formData.profilePhoto
                  ? `Selected: ${formData.profilePhoto.name}`
                  : "Upload a professional headshot"}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("profilePhoto")?.click()}
              >
                {formData.profilePhoto ? "Change Photo" : "Choose File"}
              </Button>
            </div>
            {errors.profilePhoto && (
              <p className="text-sm text-red-500 mt-2">{errors.profilePhoto}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Video className="w-5 h-5 mr-2" />
              Introduction Video *
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
              <input
                type="file"
                id="introVideo"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file && file.size > 100 * 1024 * 1024) {
                    alert("Video file size must be less than 100MB");
                    return;
                  }
                  handleFileUpload("introVideo", file);
                }}
              />
              <Video className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                {formData.introVideo
                  ? `Selected: ${formData.introVideo.name}`
                  : "2-3 minute introduction (max 100MB)"}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("introVideo")?.click()}
              >
                {formData.introVideo ? "Change Video" : "Choose File"}
              </Button>
            </div>
            {errors.introVideo && (
              <p className="text-sm text-red-500 mt-2">{errors.introVideo}</p>
            )}

            <div className="mt-4">
              <Label htmlFor="introVideoUrl">Or provide video URL</Label>
              <Input
                id="introVideoUrl"
                value={formData.introVideoUrl}
                onChange={(e) =>
                  handleInputChange("introVideoUrl", e.target.value)
                }
                placeholder="https://youtube.com/embed/your-video-id"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                YouTube, Vimeo, or other embeddable video URL
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Certificates & Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
            <input
              type="file"
              id="certificates"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setFormData((prev) => ({ ...prev, certificates: files }));
              }}
            />
            <Award className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              {formData.certificates.length > 0
                ? `${formData.certificates.length} file(s) selected`
                : "Upload teaching certificates, diplomas, etc."}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("certificates")?.click()}
            >
              {formData.certificates.length > 0
                ? "Change Files"
                : "Upload Certificates"}
            </Button>
          </div>
          {formData.certificates.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Selected files:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {formData.certificates.map((file, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newFiles = formData.certificates.filter(
                          (_, i) => i !== index,
                        );
                        setFormData((prev) => ({
                          ...prev,
                          certificates: newFiles,
                        }));
                      }}
                    >
                      ×
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Review & Submit</h2>
        <p className="text-muted-foreground">
          Final review of your application
        </p>
      </div>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Your application will be reviewed within 24-48 hours. We'll send you
          an email with the decision.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Application Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Name:</span> {formData.firstName}{" "}
              {formData.lastName}
            </div>
            <div>
              <span className="font-medium">Country:</span> {formData.country}
            </div>
            <div>
              <span className="font-medium">Native Language:</span>{" "}
              {formData.nativeLanguage}
            </div>
            <div>
              <span className="font-medium">Teaching Languages:</span>{" "}
              {formData.teachingLanguages.join(", ")}
            </div>
            <div>
              <span className="font-medium">Experience:</span>{" "}
              {formData.teachingExperience}
            </div>
            <div>
              <span className="font-medium">Rate:</span> ${formData.hourlyRate}
              /hour
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) =>
              handleInputChange("agreeToTerms", !!checked)
            }
          />
          <Label htmlFor="terms" className="text-sm">
            I agree to the Terms of Service and Teacher Agreement
          </Label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="background"
            checked={formData.agreeToBackground}
            onCheckedChange={(checked) =>
              handleInputChange("agreeToBackground", !!checked)
            }
          />
          <Label htmlFor="background" className="text-sm">
            I consent to background verification and identity checks
          </Label>
        </div>
        {errors.agreeToBackground && (
          <p className="text-sm text-red-500">{errors.agreeToBackground}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Teacher Application</h1>
                <span className="text-sm text-muted-foreground">
                  Step {step} of 6
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(step / 6) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Personal</span>
                <span>Languages</span>
                <span>Teaching</span>
                <span>Profile</span>
                <span>Media</span>
                <span>Review</span>
              </div>
            </CardContent>
          </Card>

          {/* Progress Restoration Notification */}
          {progressRestored && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <div className="flex items-center justify-between">
                  <span>
                    <strong>Progress restored!</strong> We've saved your
                    application progress. You can continue from Step {step}.
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      clearProgress();
                      setProgressRestored(false);
                      setStep(1);
                      // Reset form but keep user info
                      const [firstName, ...lastNameParts] =
                        user?.name.split(" ") || [];
                      const lastName = lastNameParts.join(" ");
                      setFormData({
                        firstName: firstName || "",
                        lastName: lastName || "",
                        email: user?.email || "",
                        phone: "",
                        country: "",
                        city: "",
                        timezone: "",
                        dateOfBirth: "",
                        nativeLanguage: "",
                        teachingLanguages: [],
                        otherLanguages: [],
                        education: "",
                        university: "",
                        degree: "",
                        graduationYear: "",
                        certifications: [],
                        teachingExperience: "",
                        hourlyRate: "",
                        specialties: [],
                        availability: [],
                        lessonTypes: [],
                        ageGroups: [],
                        headline: "",
                        description: "",
                        teachingMethod: "",
                        whyTeach: "",
                        profilePhoto: null,
                        introVideo: null,
                        introVideoUrl: "",
                        resume: null,
                        certificates: [],
                        governmentId: null,
                        proofOfAddress: null,
                        agreeToTerms: false,
                        agreeToBackground: false,
                      });
                    }}
                    className="text-blue-700 hover:text-blue-900 text-xs"
                  >
                    Start Fresh
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Form Content */}
          <Card>
            <CardContent className="p-8">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
              {step === 5 && renderStep5()}
              {step === 6 && renderStep6()}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <Button variant="outline" onClick={() => setStep(step - 1)}>
                    Previous
                  </Button>
                )}
                <div className="flex-1" />
                <Button onClick={handleNext} disabled={loading}>
                  {loading
                    ? "Submitting..."
                    : step === 6
                      ? "Submit Application"
                      : "Next"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
