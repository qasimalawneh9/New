import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Camera,
  Save,
  Shield,
  Bell,
  Globe,
  CreditCard,
  Clock,
  Phone,
  Mail,
  MapPin,
  Languages,
  Award,
  Book,
  DollarSign,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Alert, AlertDescription } from "../components/ui/alert";
import { ScrollArea } from "../components/ui/scroll-area";
import { AuthForm } from "../components/index";
import {
  User as UserType,
  TeacherProfile,
  PaymentMethod,
  AuthProvider,
} from "../types/platform";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useToast } from "../components/ui/use-toast";
import { cn } from "../lib/utils";

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

const languageOptions = [
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
  "Hindi",
];

const specializationOptions = [
  "Business English",
  "IELTS Preparation",
  "TOEFL Preparation",
  "Conversation",
  "Grammar",
  "Pronunciation",
  "Academic English",
  "Kids English",
  "DELE Preparation",
  "General Spanish",
  "Latin Culture",
];

// Mock data
const mockUser: UserType = {
  id: "user-123",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "teacher",
  profileImage: "",
  phone: "+1 (555) 123-4567",
  timezone: "America/New_York",
  emailVerified: true,
  twoFactorEnabled: false,
  status: "active",
  createdAt: "2023-06-15",
  updatedAt: "2024-01-20",
};

const mockTeacherProfile: TeacherProfile = {
  id: "teacher-123",
  userId: "user-123",
  bio: "Experienced English teacher with 8 years of teaching experience. Specializing in conversational English and business communication.",
  languages: ["English", "Spanish"],
  specializations: ["Business English", "IELTS Preparation", "Conversation"],
  experience: 8,
  education: "BA in English Literature, TEFL Certified",
  certifications: ["TEFL", "IELTS Trainer"],
  hourlyRate: 25,
  rating: 4.8,
  totalLessons: 1250,
  totalStudents: 340,
  availability: [],
  meetingPlatforms: [
    { platform: "zoom", enabled: true, settings: { email: "john@zoom.com" } },
    { platform: "teams", enabled: false, settings: {} },
  ],
  isVerified: true,
  status: "approved",
  absenceCount: 0,
};

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm-1",
    type: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
];

export default function UserProfileSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [currentUser, setCurrentUser] = useState<UserType>(mockUser);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(
    currentUser.role === "teacher" ? mockTeacherProfile : null,
  );
  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethod[]>(mockPaymentMethods);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone || "",
    timezone: currentUser.timezone,
    bio: teacherProfile?.bio || "",
    languages: teacherProfile?.languages || [],
    specializations: teacherProfile?.specializations || [],
    experience: teacherProfile?.experience || 0,
    education: teacherProfile?.education || "",
    certifications: teacherProfile?.certifications || [],
    hourlyRate: teacherProfile?.hourlyRate || 0,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    lessonReminders: true,
    paymentNotifications: true,
    messageNotifications: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowDirectMessages: true,
    showOnlineStatus: true,
  });

  useEffect(() => {
    const hasChanges =
      JSON.stringify(profileForm) !==
      JSON.stringify({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || "",
        timezone: currentUser.timezone,
        bio: teacherProfile?.bio || "",
        languages: teacherProfile?.languages || [],
        specializations: teacherProfile?.specializations || [],
        experience: teacherProfile?.experience || 0,
        education: teacherProfile?.education || "",
        certifications: teacherProfile?.certifications || [],
        hourlyRate: teacherProfile?.hourlyRate || 0,
      });

    setUnsavedChanges(hasChanges);
  }, [profileForm, currentUser, teacherProfile]);

  const handleSaveProfile = async () => {
    try {
      console.log("Saving profile:", profileForm);

      // Update user
      const updatedUser = {
        ...currentUser,
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        timezone: profileForm.timezone,
      };
      setCurrentUser(updatedUser);

      // Update teacher profile if applicable
      if (teacherProfile) {
        const updatedTeacher = {
          ...teacherProfile,
          bio: profileForm.bio,
          languages: profileForm.languages,
          specializations: profileForm.specializations,
          experience: profileForm.experience,
          education: profileForm.education,
          certifications: profileForm.certifications,
          hourlyRate: profileForm.hourlyRate,
        };
        setTeacherProfile(updatedTeacher);
      }

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      setIsEditing(false);
      setUnsavedChanges(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEditing = () => {
    setProfileForm({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone || "",
      timezone: currentUser.timezone,
      bio: teacherProfile?.bio || "",
      languages: teacherProfile?.languages || [],
      specializations: teacherProfile?.specializations || [],
      experience: teacherProfile?.experience || 0,
      education: teacherProfile?.education || "",
      certifications: teacherProfile?.certifications || [],
      hourlyRate: teacherProfile?.hourlyRate || 0,
    });
    setIsEditing(false);
    setUnsavedChanges(false);
  };

  const handleEnable2FA = async () => {
    try {
      // In real app, this would generate QR code and setup 2FA
      console.log("Enabling 2FA");
      setCurrentUser({ ...currentUser, twoFactorEnabled: true });
      toast({
        title: "Success",
        description: "Two-factor authentication enabled!",
      });
      setShow2FADialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enable 2FA. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddLanguage = (language: string) => {
    if (!profileForm.languages.includes(language)) {
      setProfileForm({
        ...profileForm,
        languages: [...profileForm.languages, language],
      });
    }
  };

  const handleRemoveLanguage = (language: string) => {
    setProfileForm({
      ...profileForm,
      languages: profileForm.languages.filter((l) => l !== language),
    });
  };

  const handleAddSpecialization = (specialization: string) => {
    if (!profileForm.specializations.includes(specialization)) {
      setProfileForm({
        ...profileForm,
        specializations: [...profileForm.specializations, specialization],
      });
    }
  };

  const handleRemoveSpecialization = (specialization: string) => {
    setProfileForm({
      ...profileForm,
      specializations: profileForm.specializations.filter(
        (s) => s !== specialization,
      ),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Profile Settings</h1>
              <p className="text-muted-foreground">
                Manage your account and preferences
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isEditing && (
                <>
                  <Button variant="outline" onClick={handleCancelEditing}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={!unsavedChanges}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              )}
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={currentUser.profileImage} />
                      <AvatarFallback className="text-2xl">
                        {currentUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                    <p className="text-muted-foreground">{currentUser.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={
                          currentUser.role === "teacher"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {currentUser.role}
                      </Badge>
                      {currentUser.emailVerified && (
                        <Badge variant="outline">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {teacherProfile?.isVerified && (
                        <Badge variant="default">
                          <Award className="h-3 w-3 mr-1" />
                          Certified Teacher
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          email: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          phone: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={profileForm.timezone}
                      onValueChange={(value) =>
                        setProfileForm({ ...profileForm, timezone: value })
                      }
                      disabled={!isEditing}
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
                </div>
              </CardContent>
            </Card>

            {/* Teacher-specific Profile */}
            {currentUser.role === "teacher" && teacherProfile && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Teaching Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileForm.bio}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            bio: e.target.value,
                          })
                        }
                        placeholder="Tell students about your teaching experience..."
                        disabled={!isEditing}
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input
                          id="experience"
                          type="number"
                          value={profileForm.experience}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              experience: Number(e.target.value),
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                        <Input
                          id="hourlyRate"
                          type="number"
                          value={profileForm.hourlyRate}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              hourlyRate: Number(e.target.value),
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="education">Education</Label>
                      <Input
                        id="education"
                        value={profileForm.education}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            education: e.target.value,
                          })
                        }
                        placeholder="Your educational background..."
                        disabled={!isEditing}
                      />
                    </div>

                    {/* Languages */}
                    <div>
                      <Label>Languages I Teach</Label>
                      <div className="flex flex-wrap gap-2 mt-2 mb-2">
                        {profileForm.languages.map((language) => (
                          <Badge
                            key={language}
                            variant="secondary"
                            className="gap-1"
                          >
                            {language}
                            {isEditing && (
                              <button
                                onClick={() => handleRemoveLanguage(language)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                      {isEditing && (
                        <Select onValueChange={handleAddLanguage}>
                          <SelectTrigger>
                            <SelectValue placeholder="Add a language" />
                          </SelectTrigger>
                          <SelectContent>
                            {languageOptions
                              .filter((l) => !profileForm.languages.includes(l))
                              .map((language) => (
                                <SelectItem key={language} value={language}>
                                  {language}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {/* Specializations */}
                    <div>
                      <Label>Specializations</Label>
                      <div className="flex flex-wrap gap-2 mt-2 mb-2">
                        {profileForm.specializations.map((spec) => (
                          <Badge key={spec} variant="outline" className="gap-1">
                            {spec}
                            {isEditing && (
                              <button
                                onClick={() => handleRemoveSpecialization(spec)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                      {isEditing && (
                        <Select onValueChange={handleAddSpecialization}>
                          <SelectTrigger>
                            <SelectValue placeholder="Add a specialization" />
                          </SelectTrigger>
                          <SelectContent>
                            {specializationOptions
                              .filter(
                                (s) => !profileForm.specializations.includes(s),
                              )
                              .map((spec) => (
                                <SelectItem key={spec} value={spec}>
                                  {spec}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {/* Teaching Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {teacherProfile.rating}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Average Rating
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {teacherProfile.totalLessons}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Lessons
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {teacherProfile.totalStudents}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Students
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-muted-foreground">
                        Last updated 3 months ago
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowPasswordDialog(true)}
                  >
                    Change Password
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        {currentUser.twoFactorEnabled
                          ? "Enabled - Extra security for your account"
                          : "Recommended - Add an extra layer of security"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={
                      currentUser.twoFactorEnabled ? "outline" : "default"
                    }
                    onClick={() => setShow2FADialog(true)}
                  >
                    {currentUser.twoFactorEnabled ? "Manage" : "Enable"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Email Verification</h4>
                      <p className="text-sm text-muted-foreground">
                        {currentUser.emailVerified
                          ? "Your email is verified"
                          : "Please verify your email address"}
                      </p>
                    </div>
                  </div>
                  {currentUser.emailVerified ? (
                    <Badge variant="default">
                      <Check className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Button variant="outline">Send Verification</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(notificationSettings).map(
                  ([key, value], index) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-medium">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {getNotificationDescription(key)}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            [key]: checked,
                          })
                        }
                      />
                    </div>
                  ),
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Profile Visibility</Label>
                  <Select
                    value={privacySettings.profileVisibility}
                    onValueChange={(value) =>
                      setPrivacySettings({
                        ...privacySettings,
                        profileVisibility: value,
                      })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="registered">
                        Registered Users Only
                      </SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {Object.entries(privacySettings)
                  .filter(([key]) => key !== "profileVisibility")
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-medium">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </h4>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) =>
                          setPrivacySettings({
                            ...privacySettings,
                            [key]: checked,
                          })
                        }
                      />
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <h4 className="font-medium">
                          {method.type === "paypal"
                            ? "PayPal"
                            : `•••• ${method.last4}`}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {method.type === "paypal"
                            ? method.email
                            : `${method.type.toUpperCase()} • ${method.expiryMonth}/${method.expiryYear}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.isDefault && (
                        <Badge variant="outline">Default</Badge>
                      )}
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <PasswordChangeForm
            onSuccess={() => setShowPasswordDialog(false)}
            onCancel={() => setShowPasswordDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* 2FA Setup Dialog */}
      <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Two-Factor Authentication</DialogTitle>
          </DialogHeader>
          <TwoFactorSetup
            enabled={currentUser.twoFactorEnabled}
            onEnable={handleEnable2FA}
            onDisable={() => {
              setCurrentUser({ ...currentUser, twoFactorEnabled: false });
              setShow2FADialog(false);
            }}
            onCancel={() => setShow2FADialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper functions and sub-components
function getNotificationDescription(key: string): string {
  const descriptions: Record<string, string> = {
    emailNotifications: "Receive important updates via email",
    smsNotifications: "Get SMS alerts for urgent matters",
    pushNotifications: "Browser and mobile app notifications",
    marketingEmails: "Promotional content and feature updates",
    lessonReminders: "Reminders about upcoming lessons",
    paymentNotifications: "Payment confirmations and billing updates",
    messageNotifications: "New message alerts",
  };
  return descriptions[key] || "";
}

function PasswordChangeForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSubmit = async () => {
    if (form.newPassword !== form.confirmPassword) {
      return;
    }
    // Implement password change logic
    console.log("Changing password");
    onSuccess();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Current Password</Label>
        <div className="relative">
          <Input
            type={showPasswords.current ? "text" : "password"}
            value={form.currentPassword}
            onChange={(e) =>
              setForm({ ...form, currentPassword: e.target.value })
            }
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() =>
              setShowPasswords({
                ...showPasswords,
                current: !showPasswords.current,
              })
            }
          >
            {showPasswords.current ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div>
        <Label>New Password</Label>
        <div className="relative">
          <Input
            type={showPasswords.new ? "text" : "password"}
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() =>
              setShowPasswords({
                ...showPasswords,
                new: !showPasswords.new,
              })
            }
          >
            {showPasswords.new ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div>
        <Label>Confirm New Password</Label>
        <div className="relative">
          <Input
            type={showPasswords.confirm ? "text" : "password"}
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() =>
              setShowPasswords({
                ...showPasswords,
                confirm: !showPasswords.confirm,
              })
            }
          >
            {showPasswords.confirm ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            !form.currentPassword ||
            !form.newPassword ||
            form.newPassword !== form.confirmPassword
          }
          className="flex-1"
        >
          Change Password
        </Button>
      </div>
    </div>
  );
}

function TwoFactorSetup({
  enabled,
  onEnable,
  onDisable,
  onCancel,
}: {
  enabled: boolean;
  onEnable: () => void;
  onDisable: () => void;
  onCancel: () => void;
}) {
  if (enabled) {
    return (
      <div className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Two-factor authentication is currently enabled for your account.
          </AlertDescription>
        </Alert>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Close
          </Button>
          <Button variant="destructive" onClick={onDisable} className="flex-1">
            Disable 2FA
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Two-factor authentication adds an extra layer of security to your
          account. You'll need an authenticator app to set this up.
        </AlertDescription>
      </Alert>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button onClick={onEnable} className="flex-1">
          Setup 2FA
        </Button>
      </div>
    </div>
  );
}
