import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  DollarSign,
  RotateCcw,
  XCircle,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Video,
  FileText,
  Star,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { Separator } from "../ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { PLATFORM_CONFIG } from "../../api/config";
import { Booking, BookingStatus } from "../../types/platform";
import {
  format,
  parseISO,
  differenceInHours,
  isPast,
  addHours,
} from "date-fns";
import { cn } from "../../lib/utils";

interface BookingManagementProps {
  booking: Booking;
  userRole: "student" | "teacher" | "admin";
  onStatusChange?: (bookingId: string, newStatus: BookingStatus) => void;
  onReschedule?: (bookingId: string, newDateTime: string) => void;
  onCancel?: (bookingId: string, reason: string) => void;
  className?: string;
}

interface RescheduleData {
  newDate?: Date;
  newTimeSlot?: string;
  reason: string;
}

interface CancelData {
  reason: string;
  refundExpected: number;
}

export function BookingManagement({
  booking,
  userRole,
  onStatusChange,
  onReschedule,
  onCancel,
  className,
}: BookingManagementProps) {
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [rescheduleData, setRescheduleData] = useState<RescheduleData>({
    reason: "",
  });
  const [cancelData, setCancelData] = useState<CancelData>({
    reason: "",
    refundExpected: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Calculate time differences and policy compliance
  const bookingDateTime = parseISO(`${booking.date}T${booking.startTime}`);
  const hoursUntilLesson = differenceInHours(bookingDateTime, new Date());
  const canReschedule =
    hoursUntilLesson >= PLATFORM_CONFIG.RESCHEDULE_WINDOW_HOURS &&
    booking.rescheduleCount < PLATFORM_CONFIG.MAX_RESCHEDULES_PER_BOOKING;
  const canCancel = hoursUntilLesson >= 0; // Can always cancel, but refund varies
  const isLessonStarted = isPast(bookingDateTime);
  const isLessonCompleted = booking.status === "completed";

  // Calculate refund amount based on cancellation timing
  useEffect(() => {
    if (hoursUntilLesson >= PLATFORM_CONFIG.CANCELLATION_WINDOW_HOURS) {
      setCancelData((prev) => ({
        ...prev,
        refundExpected: booking.totalPrice,
      }));
    } else if (hoursUntilLesson >= 24) {
      setCancelData((prev) => ({
        ...prev,
        refundExpected: booking.totalPrice * 0.5,
      }));
    } else {
      setCancelData((prev) => ({ ...prev, refundExpected: 0 }));
    }
  }, [hoursUntilLesson, booking.totalPrice]);

  const getStatusBadge = (status: BookingStatus) => {
    const variants = {
      pending: {
        variant: "secondary" as const,
        icon: Clock,
        color: "text-yellow-600",
      },
      confirmed: {
        variant: "default" as const,
        icon: CheckCircle,
        color: "text-blue-600",
      },
      completed: {
        variant: "secondary" as const,
        icon: CheckCircle,
        color: "text-green-600",
      },
      cancelled: {
        variant: "destructive" as const,
        icon: XCircle,
        color: "text-red-600",
      },
      rescheduled: {
        variant: "outline" as const,
        icon: RotateCcw,
        color: "text-orange-600",
      },
    };

    const config = variants[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getUrgencyAlert = () => {
    if (hoursUntilLesson <= 2 && hoursUntilLesson > 0) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Lesson starting soon!</strong> Your lesson starts in{" "}
            {hoursUntilLesson} hour(s). Join the lesson room 5 minutes early.
          </AlertDescription>
        </Alert>
      );
    }

    if (
      hoursUntilLesson < PLATFORM_CONFIG.CANCELLATION_WINDOW_HOURS &&
      hoursUntilLesson > 0
    ) {
      return (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Limited cancellation options:</strong> Cancelling now will
            result in a partial refund only.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  const handleReschedule = async () => {
    if (
      !rescheduleData.newDate ||
      !rescheduleData.newTimeSlot ||
      !rescheduleData.reason
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const newDateTime = format(
        addHours(
          rescheduleData.newDate,
          parseInt(rescheduleData.newTimeSlot.split(":")[0]),
        ),
        "yyyy-MM-dd'T'HH:mm:ss",
      );

      await onReschedule?.(booking.id, newDateTime);
      setShowRescheduleDialog(false);
      setRescheduleData({ reason: "" });
    } catch (error) {
      console.error("Reschedule failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelData.reason) return;

    setIsLoading(true);
    try {
      await onCancel?.(booking.id, cancelData.reason);
      setShowCancelDialog(false);
    } catch (error) {
      console.error("Cancellation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: BookingStatus) => {
    setIsLoading(true);
    try {
      await onStatusChange?.(booking.id, newStatus);
    } catch (error) {
      console.error("Status change failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Lesson Booking
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Booking ID: {booking.id}
            </p>
          </div>
          {getStatusBadge(booking.status)}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Urgency Alert */}
        {getUrgencyAlert()}

        {/* Booking Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {userRole === "student" ? "Teacher" : "Student"}:{" "}
                <strong>
                  {userRole === "student"
                    ? booking.teacherName
                    : booking.studentName}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>
                  {format(parseISO(booking.date), "EEEE, MMMM d, yyyy")}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>
                  {booking.startTime} - {booking.endTime}
                </strong>{" "}
                ({booking.duration} min)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>${booking.totalPrice}</strong>
                {booking.commission && (
                  <span className="text-muted-foreground">
                    {" "}
                    (Teacher: $
                    {(booking.totalPrice - booking.commission).toFixed(2)})
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {booking.rescheduleCount > 0 && (
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-orange-600" />
                <span className="text-sm">
                  Rescheduled {booking.rescheduleCount} time(s)
                </span>
              </div>
            )}

            {booking.notes && (
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Notes:</Label>
                <p className="text-sm bg-muted p-2 rounded">{booking.notes}</p>
              </div>
            )}

            {booking.meetingInfo && (
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  Platform: <strong>{booking.meetingInfo.platform}</strong>
                </span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* Join Lesson (if lesson is starting soon or in progress) */}
          {booking.status === "confirmed" &&
            hoursUntilLesson <= 1 &&
            hoursUntilLesson >= -2 && (
              <Button className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Join Lesson
              </Button>
            )}

          {/* Mark Complete (for teachers, after lesson time) */}
          {userRole === "teacher" &&
            booking.status === "confirmed" &&
            isLessonStarted && (
              <Button
                onClick={() => handleStatusChange("completed")}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Mark Complete
              </Button>
            )}

          {/* Reschedule Button */}
          {canReschedule &&
            booking.status !== "cancelled" &&
            booking.status !== "completed" && (
              <Dialog
                open={showRescheduleDialog}
                onOpenChange={setShowRescheduleDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reschedule
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Reschedule Lesson</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        You can reschedule up to{" "}
                        {PLATFORM_CONFIG.RESCHEDULE_WINDOW_HOURS} hours before
                        the lesson. This is reschedule #
                        {booking.rescheduleCount + 1} of{" "}
                        {PLATFORM_CONFIG.MAX_RESCHEDULES_PER_BOOKING} allowed.
                      </AlertDescription>
                    </Alert>

                    <div>
                      <Label>New Date</Label>
                      <CalendarComponent
                        mode="single"
                        selected={rescheduleData.newDate}
                        onSelect={(date) =>
                          setRescheduleData((prev) => ({
                            ...prev,
                            newDate: date,
                          }))
                        }
                        disabled={(date) =>
                          date < new Date() ||
                          date <
                            addHours(
                              new Date(),
                              PLATFORM_CONFIG.RESCHEDULE_WINDOW_HOURS,
                            )
                        }
                        className="border rounded-md"
                      />
                    </div>

                    <div>
                      <Label>New Time</Label>
                      <Select
                        value={rescheduleData.newTimeSlot}
                        onValueChange={(value) =>
                          setRescheduleData((prev) => ({
                            ...prev,
                            newTimeSlot: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "09:00",
                            "10:00",
                            "11:00",
                            "14:00",
                            "15:00",
                            "16:00",
                            "17:00",
                            "18:00",
                          ].map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Reason for Rescheduling *</Label>
                      <Textarea
                        placeholder="Please explain why you need to reschedule..."
                        value={rescheduleData.reason}
                        onChange={(e) =>
                          setRescheduleData((prev) => ({
                            ...prev,
                            reason: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowRescheduleDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleReschedule}
                        disabled={
                          isLoading ||
                          !rescheduleData.newDate ||
                          !rescheduleData.newTimeSlot ||
                          !rescheduleData.reason
                        }
                      >
                        {isLoading ? "Processing..." : "Reschedule"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

          {/* Cancel Button */}
          {canCancel &&
            booking.status !== "cancelled" &&
            booking.status !== "completed" && (
              <Dialog
                open={showCancelDialog}
                onOpenChange={setShowCancelDialog}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Cancel Lesson</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Alert
                      variant={
                        cancelData.refundExpected === booking.totalPrice
                          ? "default"
                          : "destructive"
                      }
                    >
                      <DollarSign className="h-4 w-4" />
                      <AlertDescription>
                        <strong>
                          Refund Amount: ${cancelData.refundExpected.toFixed(2)}
                        </strong>
                        <br />
                        {hoursUntilLesson >=
                        PLATFORM_CONFIG.CANCELLATION_WINDOW_HOURS
                          ? "Full refund (cancelled 48+ hours in advance)"
                          : hoursUntilLesson >= 24
                            ? "50% refund (cancelled 24-48 hours in advance)"
                            : "No refund (cancelled less than 24 hours in advance)"}
                      </AlertDescription>
                    </Alert>

                    <div>
                      <Label>Cancellation Reason *</Label>
                      <Select
                        value={cancelData.reason}
                        onValueChange={(value) =>
                          setCancelData((prev) => ({ ...prev, reason: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="schedule_conflict">
                            Schedule Conflict
                          </SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="illness">Illness</SelectItem>
                          <SelectItem value="technical_issues">
                            Technical Issues
                          </SelectItem>
                          <SelectItem value="teacher_unavailable">
                            Teacher Unavailable
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowCancelDialog(false)}
                      >
                        Keep Booking
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleCancel}
                        disabled={isLoading || !cancelData.reason}
                      >
                        {isLoading ? "Processing..." : "Cancel Lesson"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

          {/* Message Button */}
          <Button variant="outline" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Message
          </Button>

          {/* Review Button (for completed lessons) */}
          {booking.status === "completed" && userRole === "student" && (
            <Button variant="outline" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Write Review
            </Button>
          )}
        </div>

        {/* Policy Reminder */}
        {booking.status === "confirmed" && hoursUntilLesson > 0 && (
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Reminder:</strong> You can reschedule up to 72 hours
              before (
              {PLATFORM_CONFIG.MAX_RESCHEDULES_PER_BOOKING -
                booking.rescheduleCount}{" "}
              reschedule(s) remaining) or cancel for{" "}
              {hoursUntilLesson >= PLATFORM_CONFIG.CANCELLATION_WINDOW_HOURS
                ? "full"
                : "partial"}{" "}
              refund.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

export default BookingManagement;
