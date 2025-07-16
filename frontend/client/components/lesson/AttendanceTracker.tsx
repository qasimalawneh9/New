import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  Timer,
  Ban,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";
import { useAuth } from "../../contexts/AuthContext";
import { PLATFORM_CONFIG } from "../../api/config";
import { Booking } from "../../types/platform";
import { format, parseISO, differenceInSeconds, addHours } from "date-fns";
import { cn } from "../../lib/utils";

interface AttendanceRecord {
  id: string;
  bookingId: string;
  participantId: string;
  participantName: string;
  role: "teacher" | "student";
  status: "present" | "absent" | "late" | "early_leave";
  joinTime?: Date;
  leaveTime?: Date;
  lateMinutes?: number;
  reportedAbsence?: boolean;
  absenceReason?: string;
  autoCompleted?: boolean;
}

interface AttendanceTrackerProps {
  booking: Booking;
  onAttendanceUpdate?: (attendance: AttendanceRecord[]) => void;
  onLessonComplete?: (autoCompleted?: boolean) => void;
  className?: string;
}

interface AbsenceReport {
  reason: string;
  category: "technical" | "emergency" | "illness" | "other";
  description: string;
  requestReschedule: boolean;
}

export function AttendanceTracker({
  booking,
  onAttendanceUpdate,
  onLessonComplete,
  className,
}: AttendanceTrackerProps) {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [lessonStatus, setLessonStatus] = useState<
    "waiting" | "active" | "completed" | "auto-completed"
  >("waiting");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showAbsenceReport, setShowAbsenceReport] = useState(false);
  const [absenceReport, setAbsenceReport] = useState<AbsenceReport>({
    reason: "",
    category: "technical",
    description: "",
    requestReschedule: false,
  });
  const [teacherAbsenceCount, setTeacherAbsenceCount] = useState(0);

  const lessonStartTime = parseISO(`${booking.date}T${booking.startTime}`);
  const lessonEndTime = parseISO(`${booking.date}T${booking.endTime}`);
  const autoCompleteTime = addHours(
    lessonEndTime,
    PLATFORM_CONFIG.AUTO_COMPLETION_HOURS,
  );

  const isLessonTime =
    new Date() >= lessonStartTime && new Date() <= lessonEndTime;
  const isAfterLesson = new Date() > lessonEndTime;
  const shouldAutoComplete =
    new Date() >= autoCompleteTime && lessonStatus !== "completed";

  // Initialize attendance records
  useEffect(() => {
    const initialAttendance: AttendanceRecord[] = [
      {
        id: `teacher_${booking.id}`,
        bookingId: booking.id,
        participantId: booking.teacherId,
        participantName: booking.teacherName || "Teacher",
        role: "teacher",
        status: "absent",
      },
      {
        id: `student_${booking.id}`,
        bookingId: booking.id,
        participantId: booking.studentId,
        participantName: booking.studentName || "Student",
        role: "student",
        status: "absent",
      },
    ];
    setAttendance(initialAttendance);
  }, [booking]);

  // Auto-complete lesson after 48 hours
  useEffect(() => {
    if (shouldAutoComplete && lessonStatus !== "auto-completed") {
      setLessonStatus("auto-completed");
      onLessonComplete?.(true);
    }
  }, [shouldAutoComplete, lessonStatus, onLessonComplete]);

  // Timer for lesson duration
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (lessonStatus === "active") {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = differenceInSeconds(now, lessonStartTime);
        setTimeElapsed(Math.max(0, elapsed));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [lessonStatus, lessonStartTime]);

  const markAttendance = (
    participantId: string,
    status: AttendanceRecord["status"],
  ) => {
    const now = new Date();

    setAttendance((prev) =>
      prev.map((record) => {
        if (record.participantId === participantId) {
          const updated = { ...record, status };

          if (status === "present" && !record.joinTime) {
            updated.joinTime = now;

            // Check if late (more than 15 minutes after start)
            const minutesLate = differenceInSeconds(now, lessonStartTime) / 60;
            if (minutesLate > 15) {
              updated.status = "late";
              updated.lateMinutes = Math.round(minutesLate);
            }
          }

          if (status === "absent" && record.joinTime) {
            updated.leaveTime = now;
            updated.status = "early_leave";
          }

          return updated;
        }
        return record;
      }),
    );
  };

  const handleJoinLesson = () => {
    if (user) {
      markAttendance(user.id, "present");

      // Start lesson if both participants are present
      const allPresent = attendance.every(
        (record) =>
          record.participantId === user.id || record.status === "present",
      );

      if (allPresent && lessonStatus === "waiting") {
        setLessonStatus("active");
      }
    }
  };

  const handleLeaveLesson = () => {
    if (user) {
      markAttendance(user.id, "absent");
    }
  };

  const handleReportAbsence = async () => {
    if (!user) return;

    const participantRecord = attendance.find(
      (record) => record.participantId === user.id,
    );
    if (participantRecord) {
      setAttendance((prev) =>
        prev.map((record) => {
          if (record.participantId === user.id) {
            return {
              ...record,
              status: "absent",
              reportedAbsence: true,
              absenceReason: absenceReport.reason,
            };
          }
          return record;
        }),
      );
    }

    // Increment teacher absence count if teacher reports absence
    if (user.role === "teacher") {
      const newCount = teacherAbsenceCount + 1;
      setTeacherAbsenceCount(newCount);

      // Check for suspension
      if (newCount >= PLATFORM_CONFIG.MAX_ABSENCES_BEFORE_SUSPENSION) {
        // Handle teacher suspension logic
        console.warn("Teacher suspension triggered");
      }
    }

    setShowAbsenceReport(false);
    setAbsenceReport({
      reason: "",
      category: "technical",
      description: "",
      requestReschedule: false,
    });
  };

  const getAttendanceStats = () => {
    const teacherRecord = attendance.find((r) => r.role === "teacher");
    const studentRecord = attendance.find((r) => r.role === "student");

    return {
      teacherStatus: teacherRecord?.status || "absent",
      studentStatus: studentRecord?.status || "absent",
      bothPresent:
        teacherRecord?.status === "present" &&
        studentRecord?.status === "present",
      anyAbsent: attendance.some((r) => r.status === "absent"),
    };
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusIcon = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "absent":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "late":
        return <Clock className="w-4 h-4 text-orange-600" />;
      case "early_leave":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: AttendanceRecord["status"]) => {
    const variants = {
      present: "default",
      absent: "destructive",
      late: "secondary",
      early_leave: "outline",
    } as const;

    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const stats = getAttendanceStats();

  return (
    <>
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Attendance Tracking
            </span>
            <Badge
              variant={lessonStatus === "active" ? "default" : "secondary"}
            >
              {lessonStatus.replace("_", " ").toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Lesson Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{format(lessonStartTime, "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>
                {format(lessonStartTime, "h:mm a")} -{" "}
                {format(lessonEndTime, "h:mm a")}
              </span>
            </div>
          </div>

          {/* Duration Timer */}
          {lessonStatus === "active" && (
            <div className="text-center">
              <div className="text-2xl font-mono font-bold">
                {formatDuration(timeElapsed)}
              </div>
              <p className="text-sm text-muted-foreground">Lesson Duration</p>
              <Progress
                value={(timeElapsed / (booking.duration * 60)) * 100}
                className="mt-2"
              />
            </div>
          )}

          {/* Attendance Status */}
          <div className="space-y-3">
            <h4 className="font-semibold">Attendance Status</h4>
            {attendance.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(record.status)}
                  <div>
                    <p className="font-medium">{record.participantName}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {record.role}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(record.status)}
                  {record.joinTime && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Joined: {format(record.joinTime, "h:mm a")}
                    </p>
                  )}
                  {record.lateMinutes && (
                    <p className="text-xs text-orange-600">
                      {record.lateMinutes} min late
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Warnings and Alerts */}
          {stats.anyAbsent && isLessonTime && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {stats.teacherStatus === "absent" &&
                stats.studentStatus === "absent"
                  ? "Both participants are absent. Please join the lesson or report absence."
                  : stats.teacherStatus === "absent"
                    ? "Teacher is absent. Student will receive automatic compensation."
                    : "Student is absent. Teacher may mark lesson as completed."}
              </AlertDescription>
            </Alert>
          )}

          {teacherAbsenceCount >= 2 && (
            <Alert className="border-orange-200 bg-orange-50">
              <Ban className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Warning:</strong> Teacher has {teacherAbsenceCount}{" "}
                recorded absence(s).
                {PLATFORM_CONFIG.MAX_ABSENCES_BEFORE_SUSPENSION -
                  teacherAbsenceCount}{" "}
                more will result in suspension.
              </AlertDescription>
            </Alert>
          )}

          {isAfterLesson &&
            lessonStatus !== "completed" &&
            lessonStatus !== "auto-completed" && (
              <Alert>
                <Timer className="h-4 w-4" />
                <AlertDescription>
                  Lesson time has ended. This lesson will automatically complete
                  in{" "}
                  {Math.max(
                    0,
                    Math.ceil(
                      differenceInSeconds(autoCompleteTime, new Date()) / 3600,
                    ),
                  )}{" "}
                  hours if no action is taken.
                </AlertDescription>
              </Alert>
            )}

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-2">
            {isLessonTime && user && (
              <>
                {attendance.find((r) => r.participantId === user.id)?.status ===
                "absent" ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleJoinLesson}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Join Lesson
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAbsenceReport(true)}
                      className="flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Report Absence
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleLeaveLesson}
                    className="w-full flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Leave Lesson
                  </Button>
                )}
              </>
            )}

            {user?.role === "teacher" &&
              isAfterLesson &&
              lessonStatus === "waiting" && (
                <Button
                  onClick={() => setLessonStatus("completed")}
                  className="w-full flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Lesson Complete
                </Button>
              )}
          </div>

          {/* Auto-completion Notice */}
          {lessonStatus === "auto-completed" && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                This lesson has been automatically completed after{" "}
                {PLATFORM_CONFIG.AUTO_COMPLETION_HOURS} hours as per platform
                policy.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Absence Report Dialog */}
      <Dialog open={showAbsenceReport} onOpenChange={setShowAbsenceReport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Absence</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please report your absence to help us improve the platform and
                handle this situation appropriately.
              </AlertDescription>
            </Alert>

            <div>
              <Label>Absence Category *</Label>
              <Select
                value={absenceReport.category}
                onValueChange={(value: AbsenceReport["category"]) =>
                  setAbsenceReport((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Issues</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="illness">Illness</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Brief Reason *</Label>
              <Select
                value={absenceReport.reason}
                onValueChange={(value) =>
                  setAbsenceReport((prev) => ({ ...prev, reason: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internet_issues">
                    Internet Connection Problems
                  </SelectItem>
                  <SelectItem value="device_problems">
                    Device/Technical Issues
                  </SelectItem>
                  <SelectItem value="family_emergency">
                    Family Emergency
                  </SelectItem>
                  <SelectItem value="medical_emergency">
                    Medical Emergency
                  </SelectItem>
                  <SelectItem value="illness">
                    Illness/Not Feeling Well
                  </SelectItem>
                  <SelectItem value="unexpected_commitment">
                    Unexpected Commitment
                  </SelectItem>
                  <SelectItem value="forgot">Forgot About Lesson</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Additional Details</Label>
              <Textarea
                placeholder="Please provide more details about your absence..."
                value={absenceReport.description}
                onChange={(e) =>
                  setAbsenceReport((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAbsenceReport(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReportAbsence}
                disabled={!absenceReport.reason}
              >
                Submit Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AttendanceTracker;
