import { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/database";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Settings,
  Clock,
  Users,
  Bell,
  Calendar,
  DollarSign,
  Shield,
  MessageCircle,
  Star,
  Info,
  BookOpen,
} from "lucide-react";

export default function TeacherSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // Lesson Preferences
    offerGroupLessons: true,
    individualDurations: [30, 45, 60, 90],
    groupDurations: [60, 90, 120],
    individualPrice: 25,
    groupPrice: 18,

    // Request Management
    responseTime: "3", // hours
    autoAcceptReturning: true,
    autoAcceptVerified: false,
    maxRequestsPerDay: "10",
    requireMessage: true,

    // Availability
    minAdvanceBooking: "2", // hours
    maxAdvanceBooking: "30", // days
    breakBetweenLessons: "15", // minutes
    workingHours: {
      start: "09:00",
      end: "18:00",
    },

    // Pricing
    baseRate: "25",
    trialLessonRate: "15",
    packageDiscount: "10", // percentage
    instantBookingFee: "2", // additional fee

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    requestReminders: true,
    lessonReminders: true,

    // Auto-messages
    welcomeMessage:
      "Welcome! I'm excited to help you learn Spanish. Let me know your goals and we'll create a personalized learning plan.",
    confirmationMessage:
      "Your lesson is confirmed! I'll send you materials 24 hours before our session.",
    reschedulePolicy:
      "You can reschedule lessons up to 4 hours in advance at no charge.",
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Load lesson preferences on component mount
  useEffect(() => {
    if (user?.id) {
      const preferences = db.getTeacherLessonPreferences(user.id);
      setSettings((prev) => ({
        ...prev,
        offerGroupLessons: preferences.offerGroupLessons,
        individualDurations: preferences.individualDurations,
        groupDurations: preferences.groupDurations,
        individualPrice: preferences.individualPrice,
        groupPrice: preferences.groupPrice,
      }));
    }
  }, [user]);

  const handleSave = () => {
    if (!user?.id) return;

    // Save lesson preferences to database
    const success = db.updateTeacherLessonPreferences(user.id, {
      offerGroupLessons: settings.offerGroupLessons,
      individualDurations: settings.individualDurations,
      groupDurations: settings.groupDurations,
      individualPrice: settings.individualPrice,
      groupPrice: settings.groupPrice,
    });

    if (success) {
      toast({
        title: "Settings Saved",
        description: "Your lesson preferences have been updated successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Settings className="w-8 h-8 mr-3 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Teacher Settings</h1>
              <p className="text-muted-foreground">
                Manage your teaching preferences and automation settings
              </p>
            </div>
          </div>

          <Tabs defaultValue="requests" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="lessons" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Lesson Types & Duration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Configure which lesson types and durations you offer to
                      students.
                    </AlertDescription>
                  </Alert>

                  {/* Group Lessons Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="font-medium">Offer Group Lessons</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow students to book group lessons with up to 4
                        participants
                      </p>
                    </div>
                    <Switch
                      checked={settings.offerGroupLessons}
                      onCheckedChange={(checked) =>
                        handleSettingChange("offerGroupLessons", checked)
                      }
                    />
                  </div>

                  {/* Individual Lesson Durations */}
                  <div className="space-y-4">
                    <Label className="font-medium">
                      1-on-1 Lesson Durations
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      {[30, 45, 60, 90].map((duration) => (
                        <div
                          key={duration}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id={`individual-${duration}`}
                            checked={settings.individualDurations.includes(
                              duration,
                            )}
                            onChange={(e) => {
                              const durations = e.target.checked
                                ? [...settings.individualDurations, duration]
                                : settings.individualDurations.filter(
                                    (d) => d !== duration,
                                  );
                              handleSettingChange(
                                "individualDurations",
                                durations,
                              );
                            }}
                            className="rounded border-gray-300"
                          />
                          <Label
                            htmlFor={`individual-${duration}`}
                            className="text-sm"
                          >
                            {duration} minutes - $
                            {Math.round(
                              (settings.individualPrice / 60) * duration,
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="individualPrice">
                        Hourly Rate for 1-on-1 Lessons
                      </Label>
                      <Input
                        id="individualPrice"
                        type="number"
                        min="5"
                        value={settings.individualPrice}
                        onChange={(e) =>
                          handleSettingChange(
                            "individualPrice",
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Group Lesson Durations */}
                  {settings.offerGroupLessons && (
                    <div className="space-y-4">
                      <Label className="font-medium">
                        Group Lesson Durations
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        {[60, 90, 120].map((duration) => (
                          <div
                            key={duration}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={`group-${duration}`}
                              checked={settings.groupDurations.includes(
                                duration,
                              )}
                              onChange={(e) => {
                                const durations = e.target.checked
                                  ? [...settings.groupDurations, duration]
                                  : settings.groupDurations.filter(
                                      (d) => d !== duration,
                                    );
                                handleSettingChange(
                                  "groupDurations",
                                  durations,
                                );
                              }}
                              className="rounded border-gray-300"
                            />
                            <Label
                              htmlFor={`group-${duration}`}
                              className="text-sm"
                            >
                              {duration} minutes - $
                              {Math.round(
                                (settings.groupPrice / 60) * duration,
                              )}{" "}
                              per student
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="groupPrice">
                          Hourly Rate for Group Lessons
                        </Label>
                        <Input
                          id="groupPrice"
                          type="number"
                          min="5"
                          value={settings.groupPrice}
                          onChange={(e) =>
                            handleSettingChange(
                              "groupPrice",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                          Recommended: 30% less than individual lessons
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Button onClick={handleSave} className="w-full">
                      Save Lesson Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Request Response Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Response time affects your teacher rating. Faster
                      responses lead to more bookings.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="responseTime">Maximum Response Time</Label>
                    <Select
                      value={settings.responseTime}
                      onValueChange={(value) =>
                        handleSettingChange("responseTime", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour (Premium)</SelectItem>
                        <SelectItem value="3">3 hours (Recommended)</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="8">8 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      You'll need to respond to lesson requests within this
                      timeframe
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxRequests">
                      Maximum Requests per Day
                    </Label>
                    <Input
                      id="maxRequests"
                      type="number"
                      value={settings.maxRequestsPerDay}
                      onChange={(e) =>
                        handleSettingChange("maxRequestsPerDay", e.target.value)
                      }
                      min="1"
                      max="50"
                    />
                    <p className="text-sm text-muted-foreground">
                      Limit daily requests to manage your workload
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Require Student Message</Label>
                      <p className="text-sm text-muted-foreground">
                        Students must include a message with their request
                      </p>
                    </div>
                    <Switch
                      checked={settings.requireMessage}
                      onCheckedChange={(checked) =>
                        handleSettingChange("requireMessage", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Auto-Accept Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Auto-accept can increase your booking rate but reduces
                      control over your schedule.
                    </AlertDescription>
                  </Alert>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Auto-accept returning students</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically accept requests from students you've
                        taught before
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoAcceptReturning}
                      onCheckedChange={(checked) =>
                        handleSettingChange("autoAcceptReturning", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Auto-accept verified students</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically accept requests from verified students
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoAcceptVerified}
                      onCheckedChange={(checked) =>
                        handleSettingChange("autoAcceptVerified", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="availability" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Booking Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minAdvance">
                        Minimum advance booking (hours)
                      </Label>
                      <Select
                        value={settings.minAdvanceBooking}
                        onValueChange={(value) =>
                          handleSettingChange("minAdvanceBooking", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 hour</SelectItem>
                          <SelectItem value="2">2 hours</SelectItem>
                          <SelectItem value="4">4 hours</SelectItem>
                          <SelectItem value="24">24 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxAdvance">
                        Maximum advance booking (days)
                      </Label>
                      <Select
                        value={settings.maxAdvanceBooking}
                        onValueChange={(value) =>
                          handleSettingChange("maxAdvanceBooking", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">1 week</SelectItem>
                          <SelectItem value="14">2 weeks</SelectItem>
                          <SelectItem value="30">1 month</SelectItem>
                          <SelectItem value="60">2 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="breakTime">
                      Break between lessons (minutes)
                    </Label>
                    <Select
                      value={settings.breakBetweenLessons}
                      onValueChange={(value) =>
                        handleSettingChange("breakBetweenLessons", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No break</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Time buffer between back-to-back lessons
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Pricing Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="baseRate">
                        Regular Lesson Rate ($/hour)
                      </Label>
                      <Input
                        id="baseRate"
                        type="number"
                        value={settings.baseRate}
                        onChange={(e) =>
                          handleSettingChange("baseRate", e.target.value)
                        }
                        min="10"
                        max="200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="trialRate">
                        Trial Lesson Rate ($/hour)
                      </Label>
                      <Input
                        id="trialRate"
                        type="number"
                        value={settings.trialLessonRate}
                        onChange={(e) =>
                          handleSettingChange("trialLessonRate", e.target.value)
                        }
                        min="5"
                        max="100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="packageDiscount">
                        Package Discount (%)
                      </Label>
                      <Input
                        id="packageDiscount"
                        type="number"
                        value={settings.packageDiscount}
                        onChange={(e) =>
                          handleSettingChange("packageDiscount", e.target.value)
                        }
                        min="0"
                        max="50"
                      />
                      <p className="text-sm text-muted-foreground">
                        Discount for lesson packages (5+ lessons)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instantFee">
                        Instant Booking Fee ($)
                      </Label>
                      <Input
                        id="instantFee"
                        type="number"
                        value={settings.instantBookingFee}
                        onChange={(e) =>
                          handleSettingChange(
                            "instantBookingFee",
                            e.target.value,
                          )
                        }
                        min="0"
                        max="20"
                      />
                      <p className="text-sm text-muted-foreground">
                        Additional fee for instant bookings
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive lesson requests and updates via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) =>
                        handleSettingChange("emailNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Browser notifications for urgent updates
                      </p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) =>
                        handleSettingChange("pushNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Text messages for critical updates only
                      </p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) =>
                        handleSettingChange("smsNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Request Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Reminders for pending lesson requests
                      </p>
                    </div>
                    <Switch
                      checked={settings.requestReminders}
                      onCheckedChange={(checked) =>
                        handleSettingChange("requestReminders", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Lesson Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Reminders before upcoming lessons
                      </p>
                    </div>
                    <Switch
                      checked={settings.lessonReminders}
                      onCheckedChange={(checked) =>
                        handleSettingChange("lessonReminders", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Automated Messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="welcomeMessage">Welcome Message</Label>
                    <Textarea
                      id="welcomeMessage"
                      value={settings.welcomeMessage}
                      onChange={(e) =>
                        handleSettingChange("welcomeMessage", e.target.value)
                      }
                      rows={3}
                      placeholder="Message sent to new students..."
                    />
                    <p className="text-sm text-muted-foreground">
                      Sent automatically to first-time students
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmationMessage">
                      Lesson Confirmation Message
                    </Label>
                    <Textarea
                      id="confirmationMessage"
                      value={settings.confirmationMessage}
                      onChange={(e) =>
                        handleSettingChange(
                          "confirmationMessage",
                          e.target.value,
                        )
                      }
                      rows={3}
                      placeholder="Message sent when lesson is confirmed..."
                    />
                    <p className="text-sm text-muted-foreground">
                      Sent when you accept a lesson request
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reschedulePolicy">Reschedule Policy</Label>
                    <Textarea
                      id="reschedulePolicy"
                      value={settings.reschedulePolicy}
                      onChange={(e) =>
                        handleSettingChange("reschedulePolicy", e.target.value)
                      }
                      rows={2}
                      placeholder="Your reschedule and cancellation policy..."
                    />
                    <p className="text-sm text-muted-foreground">
                      Shown to students when booking lessons
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Save Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Make sure to save your changes before leaving this page
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
