import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  User,
  Mail,
  Phone,
  Globe,
  Bell,
  Shield,
  CreditCard,
  Eye,
  EyeOff,
  Camera,
  Save,
  Trash2,
  Download,
  Upload,
  Lock,
  Smartphone,
  Monitor,
  Volume2,
  VideoIcon,
  CheckCircle,
  AlertCircle,
  Settings as SettingsIcon,
} from "lucide-react";

export default function Settings() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
    lessonReminders: true,
    paymentUpdates: true,
    systemUpdates: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    showOnlineStatus: true,
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: string, value: any) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your account preferences and settings
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              {/* Profile Photo */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Photo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder.svg" alt={user?.name} />
                      <AvatarFallback className="text-lg">
                        {user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline">
                        <Camera className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Photo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        defaultValue={user?.name?.split(" ")[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        defaultValue={user?.name?.split(" ")[1]}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user?.email} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+1 (555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Eastern Time (ET)</option>
                        <option>Central Time (CT)</option>
                        <option>Mountain Time (MT)</option>
                        <option>Pacific Time (PT)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      className="w-full p-2 border rounded-md"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              {/* Language Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Language Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Interface Language</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Native Language</Label>
                    <Input defaultValue="English" />
                  </div>
                  <div className="space-y-2">
                    <Label>Learning Languages</Label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Spanish</Badge>
                      <Badge variant="secondary">French</Badge>
                      <Badge variant="outline">+ Add Language</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Choose how you want to receive notifications
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Notification Methods */}
                  <div>
                    <h3 className="font-medium mb-4">Notification Methods</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              Email Notifications
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Receive notifications via email
                            </div>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.email}
                          onCheckedChange={(checked) =>
                            handleNotificationChange("email", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Bell className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              Push Notifications
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Browser and mobile app notifications
                            </div>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.push}
                          onCheckedChange={(checked) =>
                            handleNotificationChange("push", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">SMS Notifications</div>
                            <div className="text-sm text-muted-foreground">
                              Text message notifications
                            </div>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.sms}
                          onCheckedChange={(checked) =>
                            handleNotificationChange("sms", checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Notification Types */}
                  <div>
                    <h3 className="font-medium mb-4">
                      What to Notify Me About
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Lesson Reminders</div>
                          <div className="text-sm text-muted-foreground">
                            Upcoming lesson notifications
                          </div>
                        </div>
                        <Switch
                          checked={notifications.lessonReminders}
                          onCheckedChange={(checked) =>
                            handleNotificationChange("lessonReminders", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Payment Updates</div>
                          <div className="text-sm text-muted-foreground">
                            Payment confirmations and receipts
                          </div>
                        </div>
                        <Switch
                          checked={notifications.paymentUpdates}
                          onCheckedChange={(checked) =>
                            handleNotificationChange("paymentUpdates", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">System Updates</div>
                          <div className="text-sm text-muted-foreground">
                            Platform updates and maintenance notices
                          </div>
                        </div>
                        <Switch
                          checked={notifications.systemUpdates}
                          onCheckedChange={(checked) =>
                            handleNotificationChange("systemUpdates", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            Marketing Communications
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Special offers and platform news
                          </div>
                        </div>
                        <Switch
                          checked={notifications.marketing}
                          onCheckedChange={(checked) =>
                            handleNotificationChange("marketing", checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Save Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Control who can see your information and contact you
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Profile Visibility</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Profile Visibility</div>
                          <div className="text-sm text-muted-foreground">
                            Who can see your profile
                          </div>
                        </div>
                        <select
                          className="p-2 border rounded-md"
                          value={privacy.profileVisibility}
                          onChange={(e) =>
                            handlePrivacyChange(
                              "profileVisibility",
                              e.target.value,
                            )
                          }
                        >
                          <option value="public">Public</option>
                          <option value="students">Students Only</option>
                          <option value="private">Private</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Show Email Address</div>
                          <div className="text-sm text-muted-foreground">
                            Display email on public profile
                          </div>
                        </div>
                        <Switch
                          checked={privacy.showEmail}
                          onCheckedChange={(checked) =>
                            handlePrivacyChange("showEmail", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Show Phone Number</div>
                          <div className="text-sm text-muted-foreground">
                            Display phone number on profile
                          </div>
                        </div>
                        <Switch
                          checked={privacy.showPhone}
                          onCheckedChange={(checked) =>
                            handlePrivacyChange("showPhone", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Show Online Status</div>
                          <div className="text-sm text-muted-foreground">
                            Let others see when you're online
                          </div>
                        </div>
                        <Switch
                          checked={privacy.showOnlineStatus}
                          onCheckedChange={(checked) =>
                            handlePrivacyChange("showOnlineStatus", checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-4">Communication</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            Allow Direct Messages
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Students can send you messages
                          </div>
                        </div>
                        <Switch
                          checked={privacy.allowMessages}
                          onCheckedChange={(checked) =>
                            handlePrivacyChange("allowMessages", checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Save Privacy Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              {/* Password */}
              <Card>
                <CardHeader>
                  <CardTitle>Password & Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
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
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button>
                    <Lock className="w-4 h-4 mr-2" />
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              {/* Two-Factor Authentication */}
              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Two-factor authentication is currently disabled. Enable it
                      to secure your account.
                    </AlertDescription>
                  </Alert>
                  <Button>
                    <Shield className="w-4 h-4 mr-2" />
                    Enable Two-Factor Authentication
                  </Button>
                </CardContent>
              </Card>

              {/* Active Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Manage your active sessions across devices
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      device: "Chrome on Windows",
                      location: "New York, US",
                      lastActive: "Active now",
                      current: true,
                    },
                    {
                      device: "Safari on iPhone",
                      location: "New York, US",
                      lastActive: "2 hours ago",
                      current: false,
                    },
                  ].map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Monitor className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium flex items-center">
                            {session.device}
                            {session.current && (
                              <Badge variant="default" className="ml-2">
                                Current
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {session.location} • {session.lastActive}
                          </div>
                        </div>
                      </div>
                      {!session.current && (
                        <Button variant="outline" size="sm">
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Data Download */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Export</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Download a copy of your data
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">
                    You can request a download of your account data, including
                    profile information, lesson history, and messages.
                  </p>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Request Data Export
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Manage your payment methods for lessons
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5" />
                        <div>
                          <div className="font-medium">•••• •••• •••• 4242</div>
                          <div className="text-sm text-muted-foreground">
                            Expires 12/27
                          </div>
                        </div>
                        <Badge variant="default">Default</Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    View your payment history and receipts
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      date: "Jan 20, 2024",
                      description: "Spanish Lesson with Maria",
                      amount: "$25.00",
                      status: "Paid",
                    },
                    {
                      date: "Jan 18, 2024",
                      description: "French Lesson with Pierre",
                      amount: "$30.00",
                      status: "Paid",
                    },
                    {
                      date: "Jan 15, 2024",
                      description: "Spanish Lesson with Maria",
                      amount: "$25.00",
                      status: "Paid",
                    },
                  ].map((payment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{payment.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {payment.date}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{payment.amount}</div>
                        <Badge variant="secondary">{payment.status}</Badge>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Transactions
                  </Button>
                </CardContent>
              </Card>

              {/* Account Deletion */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Irreversible actions that affect your account
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </AlertDescription>
                  </Alert>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
