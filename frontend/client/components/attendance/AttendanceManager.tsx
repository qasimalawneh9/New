import React, { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  DollarSign,
  MessageSquare,
  User,
  Timer,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Booking, User as UserType } from "../../types/platform";
import { cn } from "../../lib/utils";
import {
  format,
  addDays,
  isBefore,
  isAfter,
  differenceInHours,
} from "date-fns";

interface AttendanceManagerProps {
  bookings: Booking[];
  currentUser: UserType;
  onMarkAttendance: (
    bookingId: string,
    status: "attended" | "absent",
    notes?: string,
  ) => Promise<void>;
  onRequestReschedule: (
    bookingId: string,
    newDate: string,
    newTime: string,
    reason: string,
  ) => Promise<void>;
  onConfirmCompletion: (bookingId: string) => Promise<void>;
  onRequestRefund: (bookingId: string, reason: string) => Promise<void>;
  className?: string;
}

interface AttendanceAction {
  type: "mark_attended" | "mark_absent" | "reschedule" | "complete" | "refund";
  bookingId: string;
  data?: any;
}

export function AttendanceManager({
  bookings,
  currentUser,
  onMarkAttendance,
  onRequestReschedule,
  onConfirmCompletion,
  onRequestRefund,
  className,
}: AttendanceManagerProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<AttendanceAction | null>(
    null,
  );
  const [actionData, setActionData] = useState<any>({});

  const isTeacher = currentUser.role === "teacher";
  const isStudent = currentUser.role === "student";

  // Filter bookings based on user role
  const userBookings = bookings.filter((booking) =>
    isTeacher
      ? booking.teacherId === currentUser.id
      : booking.studentId === currentUser.id,
  );

  // Categorize bookings
  const upcomingBookings = userBookings.filter(
    (booking) =>
      booking.status === "confirmed" &&
      isAfter(new Date(booking.date + " " + booking.startTime), new Date()),
  );

  const pendingBookings = userBookings.filter(
    (booking) =>
      booking.status === "confirmed" &&
      isBefore(new Date(booking.date + " " + booking.endTime), new Date()) &&
      !booking.completedAt,
  );

  const completedBookings = userBookings.filter(
    (booking) => booking.status === "completed",
  );

  const rescheduledBookings = userBookings.filter(
    (booking) => booking.status === "rescheduled",
  );

  const handleAction = (action: AttendanceAction) => {
    setPendingAction(action);
    setSelectedBooking(
      userBookings.find((b) => b.id === action.bookingId) || null,
    );
    setActionData({});
    setShowActionDialog(true);
  };

  const executeAction = async () => {
    if (!pendingAction || !selectedBooking) return;

    try {
      switch (pendingAction.type) {
        case "mark_attended":
          await onMarkAttendance(
            pendingAction.bookingId,
            "attended",
            actionData.notes,
          );
          break;
        case "mark_absent":
          await onMarkAttendance(
            pendingAction.bookingId,
            "absent",
            actionData.notes,
          );
          break;
        case "reschedule":
          await onRequestReschedule(
            pendingAction.bookingId,
            actionData.newDate,
            actionData.newTime,
            actionData.reason,
          );
          break;
        case "complete":
          await onConfirmCompletion(pendingAction.bookingId);
          break;
        case "refund":
          await onRequestRefund(pendingAction.bookingId, actionData.reason);
          break;
      }
      setShowActionDialog(false);
      setPendingAction(null);
      setSelectedBooking(null);
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const getBookingStatus = (booking: Booking) => {
    const now = new Date();
    const lessonStart = new Date(booking.date + " " + booking.startTime);
    const lessonEnd = new Date(booking.date + " " + booking.endTime);
    const hoursUntilLesson = differenceInHours(lessonStart, now);

    if (booking.status === "completed") return "completed";
    if (booking.status === "cancelled") return "cancelled";
    if (booking.status === "rescheduled") return "rescheduled";

    if (isBefore(now, lessonStart)) {
      if (hoursUntilLesson <= 24) return "upcoming_soon";
      return "upcoming";
    }

    if (isBefore(now, lessonEnd)) return "in_progress";

    if (!booking.completedAt) return "pending_completion";

    return "unknown";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "rescheduled":
        return "bg-yellow-100 text-yellow-800";
      case "upcoming_soon":
        return "bg-orange-100 text-orange-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-purple-100 text-purple-800";
      case "pending_completion":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canMarkAttendance = (booking: Booking) => {
    if (!isTeacher) return false;
    const lessonEnd = new Date(booking.date + " " + booking.endTime);
    return isBefore(lessonEnd, new Date()) && !booking.completedAt;
  };

  const canRequestReschedule = (booking: Booking) => {
    const lessonStart = new Date(booking.date + " " + booking.startTime);
    const hoursUntilLesson = differenceInHours(lessonStart, new Date());
    return hoursUntilLesson > 24 && booking.rescheduleCount < 2;
  };

  const canConfirmCompletion = (booking: Booking) => {
    if (!isStudent) return false;
    const lessonEnd = new Date(booking.date + " " + booking.endTime);
    return isBefore(lessonEnd, new Date()) && !booking.completedAt;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Attendance Rules Alert */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Attendance Rules:</strong>
          {isTeacher ? (
            <>
              {" "}
              Mark attendance within 48 hours after the lesson. Students absent
              3+ times may face account restrictions.
            </>
          ) : (
            <>
              {" "}
              Confirm lesson completion manually or it will auto-confirm after
              48 hours. Reschedule requests must be made 24+ hours in advance.
            </>
          )}
        </AlertDescription>
      </Alert>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{upcomingBookings.length}</div>
            <div className="text-sm text-muted-foreground">Upcoming</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-amber-500" />
            <div className="text-2xl font-bold">{pendingBookings.length}</div>
            <div className="text-sm text-muted-foreground">
              Pending Completion
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{completedBookings.length}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <RotateCcw className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">
              {rescheduledBookings.length}
            </div>
            <div className="text-sm text-muted-foreground">Rescheduled</div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Lessons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Lessons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    status={getBookingStatus(booking)}
                    statusColor={getStatusColor(getBookingStatus(booking))}
                    currentUser={currentUser}
                    actions={[
                      ...(canRequestReschedule(booking)
                        ? [
                            {
                              label: "Reschedule",
                              icon: RotateCcw,
                              variant: "outline" as const,
                              onClick: () =>
                                handleAction({
                                  type: "reschedule",
                                  bookingId: booking.id,
                                }),
                            },
                          ]
                        : []),
                    ]}
                  />
                ))}
                {upcomingBookings.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No upcoming lessons
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Pending Completion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {pendingBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    status={getBookingStatus(booking)}
                    statusColor={getStatusColor(getBookingStatus(booking))}
                    currentUser={currentUser}
                    actions={[
                      ...(canMarkAttendance(booking)
                        ? [
                            {
                              label: "Mark Attended",
                              icon: CheckCircle,
                              variant: "default" as const,
                              onClick: () =>
                                handleAction({
                                  type: "mark_attended",
                                  bookingId: booking.id,
                                }),
                            },
                            {
                              label: "Mark Absent",
                              icon: XCircle,
                              variant: "destructive" as const,
                              onClick: () =>
                                handleAction({
                                  type: "mark_absent",
                                  bookingId: booking.id,
                                }),
                            },
                          ]
                        : []),
                      ...(canConfirmCompletion(booking)
                        ? [
                            {
                              label: "Confirm Completion",
                              icon: CheckCircle,
                              variant: "default" as const,
                              onClick: () =>
                                handleAction({
                                  type: "complete",
                                  bookingId: booking.id,
                                }),
                            },
                          ]
                        : []),
                    ]}
                  />
                ))}
                {pendingBookings.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No lessons pending completion
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Recent Completed Lessons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Recent Completed Lessons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedBookings.slice(0, 6).map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                status="completed"
                statusColor={getStatusColor("completed")}
                currentUser={currentUser}
                compact
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingAction?.type === "mark_attended" && "Mark Attendance"}
              {pendingAction?.type === "mark_absent" && "Mark Absent"}
              {pendingAction?.type === "reschedule" && "Reschedule Lesson"}
              {pendingAction?.type === "complete" && "Confirm Completion"}
              {pendingAction?.type === "refund" && "Request Refund"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selectedBooking && (
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium">
                  Lesson with{" "}
                  {isTeacher
                    ? selectedBooking.studentId
                    : selectedBooking.teacherId}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedBooking.date), "EEEE, MMMM d, yyyy")}{" "}
                  at {selectedBooking.startTime}
                </p>
              </div>
            )}

            {/* Action-specific forms */}
            {(pendingAction?.type === "mark_attended" ||
              pendingAction?.type === "mark_absent") && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Notes (optional)
                </label>
                <Textarea
                  value={actionData.notes || ""}
                  onChange={(e) =>
                    setActionData({ ...actionData, notes: e.target.value })
                  }
                  placeholder="Add any notes about the attendance..."
                  rows={3}
                />
              </div>
            )}

            {pendingAction?.type === "reschedule" && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    New Date *
                  </label>
                  <input
                    type="date"
                    value={actionData.newDate || ""}
                    onChange={(e) =>
                      setActionData({ ...actionData, newDate: e.target.value })
                    }
                    min={format(addDays(new Date(), 1), "yyyy-MM-dd")}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    New Time *
                  </label>
                  <input
                    type="time"
                    value={actionData.newTime || ""}
                    onChange={(e) =>
                      setActionData({ ...actionData, newTime: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Reason *
                  </label>
                  <Textarea
                    value={actionData.reason || ""}
                    onChange={(e) =>
                      setActionData({ ...actionData, reason: e.target.value })
                    }
                    placeholder="Please explain why you need to reschedule..."
                    rows={3}
                    required
                  />
                </div>
              </div>
            )}

            {pendingAction?.type === "refund" && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Reason for Refund *
                </label>
                <Textarea
                  value={actionData.reason || ""}
                  onChange={(e) =>
                    setActionData({ ...actionData, reason: e.target.value })
                  }
                  placeholder="Please explain why you are requesting a refund..."
                  rows={3}
                  required
                />
              </div>
            )}

            {pendingAction?.type === "complete" && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  By confirming completion, you acknowledge that the lesson was
                  delivered as scheduled. This action cannot be undone.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowActionDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={executeAction} className="flex-1">
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sub-component
function BookingCard({
  booking,
  status,
  statusColor,
  currentUser,
  actions = [],
  compact = false,
}: {
  booking: Booking;
  status: string;
  statusColor: string;
  currentUser: UserType;
  actions?: Array<{
    label: string;
    icon: any;
    variant: "default" | "outline" | "destructive";
    onClick: () => void;
  }>;
  compact?: boolean;
}) {
  const isTeacher = currentUser.role === "teacher";
  const otherUserId = isTeacher ? booking.studentId : booking.teacherId;

  return (
    <Card className={cn("relative", compact && "h-auto")}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback>{isTeacher ? "S" : "T"}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-sm">
                {isTeacher ? "Student" : "Teacher"}: {otherUserId}
              </h4>
              <p className="text-xs text-muted-foreground">
                {format(new Date(booking.date), "MMM d, yyyy")} at{" "}
                {booking.startTime}
              </p>
            </div>
          </div>
          <Badge className={cn("text-xs", statusColor)}>
            {status.replace("_", " ")}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Timer className="h-3 w-3" />
            <span>{booking.duration} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-3 w-3" />
            <span>${booking.totalPrice.toFixed(2)}</span>
          </div>
          {booking.notes && (
            <div className="flex items-start gap-2">
              <MessageSquare className="h-3 w-3 mt-0.5" />
              <span className="text-xs">{booking.notes}</span>
            </div>
          )}
        </div>

        {actions.length > 0 && !compact && (
          <>
            <Separator className="my-3" />
            <div className="flex gap-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant}
                  onClick={action.onClick}
                  className="flex-1"
                >
                  <action.icon className="h-3 w-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default AttendanceManager;
