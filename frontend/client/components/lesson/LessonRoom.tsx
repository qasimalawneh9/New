import React, { useState, useEffect, useRef } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Users,
  MessageSquare,
  Share2,
  FileText,
  Clock,
  Settings,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Camera,
  Monitor,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useAuth } from "../../contexts/AuthContext";
import { PLATFORM_CONFIG, MeetingPlatform } from "../../api/config";
import { Booking, MeetingInfo } from "../../types/platform";
import { format, parseISO, differenceInSeconds } from "date-fns";
import { cn } from "../../lib/utils";

interface LessonRoomProps {
  booking: Booking;
  meetingInfo: MeetingInfo;
  onLessonStart?: () => void;
  onLessonEnd?: () => void;
  onAttendanceMarked?: (present: boolean) => void;
  className?: string;
}

interface LessonNotes {
  teacherNotes: string;
  studentNotes: string;
  homework: string;
  materials: File[];
}

interface TechnicalCheck {
  camera: boolean;
  microphone: boolean;
  internet: boolean;
  platform: boolean;
}

export function LessonRoom({
  booking,
  meetingInfo,
  onLessonStart,
  onLessonEnd,
  onAttendanceMarked,
  className,
}: LessonRoomProps) {
  const { user } = useAuth();
  const [lessonStatus, setLessonStatus] = useState<
    "waiting" | "active" | "ended"
  >("waiting");
  const [isTeacherPresent, setIsTeacherPresent] = useState(false);
  const [isStudentPresent, setIsStudentPresent] = useState(false);
  const [lessonDuration, setLessonDuration] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [showTechCheck, setShowTechCheck] = useState(false);
  const [notes, setNotes] = useState<LessonNotes>({
    teacherNotes: "",
    studentNotes: "",
    homework: "",
    materials: [],
  });
  const [techCheck, setTechCheck] = useState<TechnicalCheck>({
    camera: false,
    microphone: false,
    internet: false,
    platform: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const durationInterval = useRef<NodeJS.Timeout>();

  const lessonStartTime = parseISO(`${booking.date}T${booking.startTime}`);
  const lessonEndTime = parseISO(`${booking.date}T${booking.endTime}`);
  const canJoin =
    new Date() >= new Date(lessonStartTime.getTime() - 10 * 60 * 1000); // 10 min early
  const isLessonTime =
    new Date() >= lessonStartTime && new Date() <= lessonEndTime;

  // Duration tracking
  useEffect(() => {
    if (lessonStatus === "active") {
      durationInterval.current = setInterval(() => {
        setLessonDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    }

    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    };
  }, [lessonStatus]);

  // Auto-mark attendance when lesson is active
  useEffect(() => {
    if (lessonStatus === "active" && user) {
      if (user.role === "teacher") {
        setIsTeacherPresent(true);
      } else {
        setIsStudentPresent(true);
      }
      onAttendanceMarked?.(true);
    }
  }, [lessonStatus, user, onAttendanceMarked]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const getPlatformInfo = (platform: MeetingPlatform) => {
    const platformData = {
      zoom: {
        name: "Zoom",
        color: "bg-blue-500",
        icon: Video,
        joinText: "Join Zoom Meeting",
        instructions:
          "Click the button below to join via Zoom. You may need to download the Zoom app.",
      },
      teams: {
        name: "Microsoft Teams",
        color: "bg-purple-500",
        icon: Users,
        joinText: "Join Teams Meeting",
        instructions:
          "Click to join via Microsoft Teams. You can join from browser or Teams app.",
      },
      meet: {
        name: "Google Meet",
        color: "bg-green-500",
        icon: Video,
        joinText: "Join Google Meet",
        instructions:
          "Click to join via Google Meet. Works best in Chrome browser.",
      },
      skype: {
        name: "Skype",
        color: "bg-blue-400",
        icon: MessageSquare,
        joinText: "Join Skype Call",
        instructions:
          "Click to join via Skype. You may need the Skype app installed.",
      },
      whatsapp: {
        name: "WhatsApp",
        color: "bg-green-600",
        icon: MessageSquare,
        joinText: "Join WhatsApp Call",
        instructions:
          "Click to start WhatsApp video call. Requires WhatsApp on your device.",
      },
    };

    return platformData[platform] || platformData.zoom;
  };

  const performTechCheck = async () => {
    setIsLoading(true);

    // Simulate technical checks
    const checks = ["camera", "microphone", "internet", "platform"] as const;

    for (const check of checks) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTechCheck((prev) => ({ ...prev, [check]: true }));
    }

    setIsLoading(false);
  };

  const handleJoinLesson = () => {
    if (meetingInfo.joinUrl) {
      window.open(meetingInfo.joinUrl, "_blank");
    }
    setLessonStatus("active");
    onLessonStart?.();
  };

  const handleEndLesson = () => {
    setLessonStatus("ended");
    onLessonEnd?.();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setNotes((prev) => ({
      ...prev,
      materials: [...prev.materials, ...files],
    }));
  };

  const platformInfo = getPlatformInfo(meetingInfo.platform as MeetingPlatform);
  const Icon = platformInfo.icon;

  const renderPreLessonView = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div
          className={`w-16 h-16 ${platformInfo.color} rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Ready to Join?</h3>
        <p className="text-muted-foreground">
          Your lesson with{" "}
          {user?.role === "student" ? booking.teacherName : booking.studentName}
          {canJoin ? " is ready to start" : " will start soon"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Lesson Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{format(lessonStartTime, "EEEE, MMMM d, yyyy")}</span>
          </div>
          <div className="flex justify-between">
            <span>Time:</span>
            <span>
              {format(lessonStartTime, "h:mm a")} -{" "}
              {format(lessonEndTime, "h:mm a")}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span>{booking.duration} minutes</span>
          </div>
          <div className="flex justify-between">
            <span>Platform:</span>
            <Badge className={platformInfo.color}>{platformInfo.name}</Badge>
          </div>
        </CardContent>
      </Card>

      {!canJoin && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            You can join the lesson room 10 minutes before the scheduled start
            time. Time remaining:{" "}
            {Math.max(
              0,
              Math.ceil(
                differenceInSeconds(
                  new Date(lessonStartTime.getTime() - 10 * 60 * 1000),
                  new Date(),
                ) / 60,
              ),
            )}{" "}
            minutes
          </AlertDescription>
        </Alert>
      )}

      {canJoin && (
        <div className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{platformInfo.instructions}</AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button
              onClick={handleJoinLesson}
              className="flex-1 flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              {platformInfo.joinText}
            </Button>

            <Button variant="outline" onClick={() => setShowTechCheck(true)}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderActiveLessonView = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Video className="w-8 h-8 text-white animate-pulse" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Lesson in Progress</h3>
        <p className="text-muted-foreground">
          Duration: {formatDuration(lessonDuration)}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Participants
            </span>
            <Badge variant="outline" className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${isTeacherPresent ? "bg-green-500" : "bg-gray-300"}`}
                />
                Teacher: {booking.teacherName}
              </span>
              {isTeacherPresent && <Badge variant="secondary">Present</Badge>}
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${isStudentPresent ? "bg-green-500" : "bg-gray-300"}`}
                />
                Student: {booking.studentName}
              </span>
              {isStudentPresent && <Badge variant="secondary">Present</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => window.open(meetingInfo.joinUrl, "_blank")}
          className="flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Rejoin {platformInfo.name}
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowNotes(true)}
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Lesson Notes
        </Button>
      </div>

      {user?.role === "teacher" && (
        <Button
          onClick={handleEndLesson}
          variant="destructive"
          className="w-full flex items-center gap-2"
        >
          <PhoneOff className="w-4 h-4" />
          End Lesson
        </Button>
      )}
    </div>
  );

  const renderPostLessonView = () => (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Lesson Completed</h3>
      <p className="text-muted-foreground">
        Total duration: {formatDuration(lessonDuration)}
      </p>

      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {user?.role === "student" && (
            <Button className="w-full flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Leave a Review
            </Button>
          )}

          <Button variant="outline" className="w-full flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Message {user?.role === "student" ? "Teacher" : "Student"}
          </Button>

          <Button variant="outline" className="w-full flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Book Another Lesson
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      <Card className={cn("max-w-2xl mx-auto", className)}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Lesson Room
            </span>
            <Badge
              variant={lessonStatus === "active" ? "default" : "secondary"}
            >
              {lessonStatus.charAt(0).toUpperCase() + lessonStatus.slice(1)}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {lessonStatus === "waiting" && renderPreLessonView()}
          {lessonStatus === "active" && renderActiveLessonView()}
          {lessonStatus === "ended" && renderPostLessonView()}
        </CardContent>
      </Card>

      {/* Technical Check Dialog */}
      <Dialog open={showTechCheck} onOpenChange={setShowTechCheck}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Technical Check</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Let's check your setup to ensure the best lesson experience.
            </p>

            <div className="space-y-3">
              {Object.entries(techCheck).map(([key, status]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {key === "camera" && <Camera className="w-4 h-4" />}
                    {key === "microphone" && <Mic className="w-4 h-4" />}
                    {key === "internet" && <Monitor className="w-4 h-4" />}
                    {key === "platform" && <Video className="w-4 h-4" />}
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  {status ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full animate-pulse" />
                  )}
                </div>
              ))}
            </div>

            {!Object.values(techCheck).every(Boolean) && (
              <Button
                onClick={performTechCheck}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Checking..." : "Run Technical Check"}
              </Button>
            )}

            {Object.values(techCheck).every(Boolean) && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  All checks passed! You're ready for your lesson.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Lesson Notes Dialog */}
      <Dialog open={showNotes} onOpenChange={setShowNotes}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Lesson Notes & Materials</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="homework">Homework</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="space-y-4">
              <div>
                <Label>Teacher Notes</Label>
                <Textarea
                  placeholder="Teacher notes about the lesson..."
                  value={notes.teacherNotes}
                  onChange={(e) =>
                    setNotes((prev) => ({
                      ...prev,
                      teacherNotes: e.target.value,
                    }))
                  }
                  disabled={user?.role !== "teacher"}
                />
              </div>
              <div>
                <Label>Student Notes</Label>
                <Textarea
                  placeholder="Your notes from the lesson..."
                  value={notes.studentNotes}
                  onChange={(e) =>
                    setNotes((prev) => ({
                      ...prev,
                      studentNotes: e.target.value,
                    }))
                  }
                  disabled={user?.role !== "student"}
                />
              </div>
            </TabsContent>

            <TabsContent value="homework" className="space-y-4">
              <div>
                <Label>Homework Assignment</Label>
                <Textarea
                  placeholder="Homework assigned by the teacher..."
                  value={notes.homework}
                  onChange={(e) =>
                    setNotes((prev) => ({ ...prev, homework: e.target.value }))
                  }
                  disabled={user?.role !== "teacher"}
                />
              </div>
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              <div>
                <Label>Upload Materials</Label>
                <Input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png,.mp3,.mp4"
                />
              </div>
              {notes.materials.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Files:</Label>
                  {notes.materials.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span className="text-sm">{file.name}</span>
                      <Button variant="ghost" size="sm">
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default LessonRoom;
