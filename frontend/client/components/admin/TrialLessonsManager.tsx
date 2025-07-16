import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  Settings,
  Eye,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react";
import { db } from "@/lib/database";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface TrialSettings {
  duration: number;
  price: number;
  maxTrialsPerStudent: number;
  enabled: boolean;
}

interface TrialAnalytics {
  totalTrialLessons: number;
  uniqueTrialStudents: number;
  conversionRate: number;
  totalRevenue: number;
  trialStudents: Array<{
    id: string;
    name: string;
    email: string;
    joinedAt: string;
    trialLessonsCount: number;
    hasConvertedToRegular: boolean;
    totalRegularLessons: number;
  }>;
  trialsByTeacher: Array<{
    teacherId: string;
    teacherName: string;
    trialCount: number;
    conversionCount: number;
  }>;
  recentTrialLessons: Array<{
    id: string;
    studentName: string;
    teacherName: string;
    date: string;
    duration: number;
    price: number;
    status: string;
  }>;
}

export function TrialLessonsManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<TrialSettings>({
    duration: 30,
    price: 5,
    maxTrialsPerStudent: 3,
    enabled: true,
  });
  const [analytics, setAnalytics] = useState<TrialAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const currentSettings = db.getTrialLessonSettings();
      setSettings(currentSettings);

      const analyticsData = db.getTrialLessonAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error("Error loading trial lesson data:", error);
      toast({
        title: "Error",
        description: "Failed to load trial lesson data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user || user.type !== "admin") {
      toast({
        title: "Access Denied",
        description: "Only administrators can modify trial lesson settings",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      db.updateTrialLessonSettings(settings, user.id);

      toast({
        title: "Settings Updated",
        description: "Trial lesson settings have been successfully updated",
      });

      // Reload analytics to reflect changes
      loadData();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save trial lesson settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatConversionRate = (
    trialCount: number,
    conversionCount: number,
  ) => {
    return trialCount > 0
      ? `${Math.round((conversionCount / trialCount) * 100)}%`
      : "0%";
  };

  if (loading) {
    return <div className="p-6">Loading trial lesson data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Trial Lessons Management</h2>
        <Badge variant={settings.enabled ? "default" : "secondary"}>
          {settings.enabled ? "Enabled" : "Disabled"}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Trial Lessons
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.totalTrialLessons || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Unique Students
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.uniqueTrialStudents || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Conversion Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.conversionRate || 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Students who booked regular lessons
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Trial Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${analytics?.totalRevenue || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Trial Lessons */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Trial Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics?.recentTrialLessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-medium">
                        {lesson.studentName}
                      </TableCell>
                      <TableCell>{lesson.teacherName}</TableCell>
                      <TableCell>{formatDate(lesson.date)}</TableCell>
                      <TableCell>{lesson.duration} min</TableCell>
                      <TableCell>${lesson.price}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            lesson.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {lesson.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trial Students Overview</CardTitle>
              <p className="text-sm text-muted-foreground">
                Students who have taken trial lessons and their conversion
                status
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Trial Lessons</TableHead>
                    <TableHead>Regular Lessons</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics?.trialStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{formatDate(student.joinedAt)}</TableCell>
                      <TableCell>{student.trialLessonsCount}</TableCell>
                      <TableCell>{student.totalRegularLessons}</TableCell>
                      <TableCell>
                        {student.hasConvertedToRegular ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Converted
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="h-3 w-3 mr-1" />
                            Trial Only
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedStudent(student)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Student Details</DialogTitle>
                              <DialogDescription>
                                Detailed information about {student.name}'s
                                trial lesson activity
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">
                                    Name
                                  </Label>
                                  <p className="text-sm">{student.name}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Email
                                  </Label>
                                  <p className="text-sm">{student.email}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Joined Date
                                  </Label>
                                  <p className="text-sm">
                                    {formatDate(student.joinedAt)}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Trial Lessons
                                  </Label>
                                  <p className="text-sm">
                                    {student.trialLessonsCount}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Regular Lessons
                                  </Label>
                                  <p className="text-sm">
                                    {student.totalRegularLessons}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Conversion Status
                                  </Label>
                                  <p className="text-sm">
                                    {student.hasConvertedToRegular
                                      ? "Converted"
                                      : "Trial Only"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trial Lessons by Teacher</CardTitle>
              <p className="text-sm text-muted-foreground">
                Teacher performance with trial lessons and conversion rates
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Trial Lessons</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics?.trialsByTeacher.map((teacher) => (
                    <TableRow key={teacher.teacherId}>
                      <TableCell className="font-medium">
                        {teacher.teacherName}
                      </TableCell>
                      <TableCell>{teacher.trialCount}</TableCell>
                      <TableCell>{teacher.conversionCount}</TableCell>
                      <TableCell>
                        {formatConversionRate(
                          teacher.trialCount,
                          teacher.conversionCount,
                        )}
                      </TableCell>
                      <TableCell>
                        {teacher.conversionCount / teacher.trialCount >= 0.5 ? (
                          <Badge className="bg-green-100 text-green-800">
                            <Star className="h-3 w-3 mr-1" />
                            High
                          </Badge>
                        ) : teacher.conversionCount / teacher.trialCount >=
                          0.25 ? (
                          <Badge variant="secondary">Average</Badge>
                        ) : (
                          <Badge variant="outline">Low</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Trial Lesson Configuration
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure trial lesson settings for the entire platform
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    max="120"
                    value={settings.duration}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        duration: parseInt(e.target.value),
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Fixed duration for all trial lessons
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.price}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        price: parseFloat(e.target.value),
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Fixed price for all trial lessons
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTrials">Max Trials per Student</Label>
                  <Input
                    id="maxTrials"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.maxTrialsPerStudent}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maxTrialsPerStudent: parseInt(e.target.value),
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of trial lessons per student
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enabled">Trial Lessons Enabled</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enabled"
                      checked={settings.enabled}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, enabled: checked })
                      }
                    />
                    <span className="text-sm">
                      {settings.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Toggle trial lessons on/off for the entire platform
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="w-full md:w-auto"
                >
                  {saving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
