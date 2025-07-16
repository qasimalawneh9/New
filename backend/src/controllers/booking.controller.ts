import { Request, Response } from "express";

// Mock booking data
const mockBookings = [
  {
    id: 1,
    bookingReference: "BK001",
    studentId: 3,
    teacherId: 2,
    studentName: "Student User",
    teacherName: "Teacher User",
    lessonDate: "2024-02-20T14:00:00Z",
    duration: 60,
    subject: "Spanish Conversation",
    status: "confirmed",
    totalAmount: 25,
    currency: "USD",
    meetingUrl: "https://zoom.us/j/123456789",
    notes: "Focus on past tense conjugations",
    createdAt: "2024-02-15T10:00:00Z",
    cancellationReason: null,
    rescheduleCount: 0,
    lastUpdated: "2024-02-15T10:00:00Z",
  },
];

const bookingPolicies = {
  cancellation: {
    freeWindowHours: 48,
    refundPercentages: {
      moreThan48h: 100,
      between24and48h: 50,
      lessThan24h: 0,
    },
  },
  rescheduling: {
    freeWindowHours: 72,
    maxReschedulesPerBooking: 1,
    fee: 0,
  },
  completion: {
    autoCompleteHours: 48,
    requiresStudentConfirmation: true,
  },
  noShow: {
    teacherAbsenceLimit: 3,
    suspensionPolicy: "automatic",
    refundPolicy: "full",
  },
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, teacherId, studentId } = req.query;

    let filteredBookings = [...mockBookings];

    // Filter by status
    if (status && status !== "all") {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.status === status,
      );
    }

    // Filter by teacher
    if (teacherId) {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.teacherId === parseInt(teacherId as string),
      );
    }

    // Filter by student
    if (studentId) {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.studentId === parseInt(studentId as string),
      );
    }

    // Pagination
    const startIndex =
      (parseInt(page as string) - 1) * parseInt(limit as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

    return res.status(200).json({
      success: true,
      data: paginatedBookings,
      meta: {
        currentPage: parseInt(page as string),
        perPage: parseInt(limit as string),
        total: filteredBookings.length,
        lastPage: Math.ceil(
          filteredBookings.length / parseInt(limit as string),
        ),
      },
    });
  } catch (error) {
    console.error("Get all bookings error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;
    const { status, upcoming = false } = req.query;

    let userBookings = mockBookings.filter((booking) => {
      if (userRole === "student") {
        return booking.studentId === userId;
      } else if (userRole === "teacher") {
        return booking.teacherId === userId;
      }
      return false;
    });

    // Filter by status
    if (status && status !== "all") {
      userBookings = userBookings.filter(
        (booking) => booking.status === status,
      );
    }

    // Filter upcoming bookings
    if (upcoming === "true") {
      const now = new Date();
      userBookings = userBookings.filter(
        (booking) => new Date(booking.lessonDate) > now,
      );
    }

    return res.status(200).json({
      success: true,
      data: userBookings,
    });
  } catch (error) {
    console.error("Get my bookings error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { teacherId, lessonDate, duration, subject, notes } = req.body;
    const studentId = (req as any).user.id;

    if (!teacherId || !lessonDate || !duration) {
      return res
        .status(400)
        .json({
          message: "Teacher ID, lesson date, and duration are required",
        });
    }

    // Calculate total amount (mock teacher hourly rate)
    const hourlyRate = 25; // This would come from teacher profile
    const totalAmount = (duration / 60) * hourlyRate;

    const newBooking = {
      id: mockBookings.length + 1,
      bookingReference: `BK${String(mockBookings.length + 1).padStart(3, "0")}`,
      studentId,
      teacherId,
      studentName: "Student User", // Would be fetched from user profile
      teacherName: "Teacher User", // Would be fetched from teacher profile
      lessonDate,
      duration,
      subject: subject || "Language Lesson",
      status: "pending",
      totalAmount,
      currency: "USD",
      meetingUrl: null,
      notes: notes || "",
      createdAt: new Date().toISOString(),
      cancellationReason: null,
      rescheduleCount: 0,
      lastUpdated: new Date().toISOString(),
    };

    mockBookings.push(newBooking);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: newBooking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const booking = mockBookings.find((b) => b.id === parseInt(id));

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user has access to this booking
    const hasAccess =
      userRole === "admin" ||
      (userRole === "student" && booking.studentId === userId) ||
      (userRole === "teacher" && booking.teacherId === userId);

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const booking = mockBookings.find((b) => b.id === parseInt(id));

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user has permission to update
    const canUpdate =
      userRole === "admin" ||
      (userRole === "teacher" && booking.teacherId === userId);

    if (!canUpdate) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Update booking
    Object.assign(booking, updates, { lastUpdated: new Date().toISOString() });

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Update booking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const booking = mockBookings.find((b) => b.id === parseInt(id));

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user can cancel
    const canCancel =
      userRole === "admin" ||
      booking.studentId === userId ||
      booking.teacherId === userId;

    if (!canCancel) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check cancellation policy
    const lessonDate = new Date(booking.lessonDate);
    const now = new Date();
    const hoursUntilLesson =
      (lessonDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    let refundPercentage = 0;
    if (hoursUntilLesson >= 48) {
      refundPercentage = 100;
    } else if (hoursUntilLesson >= 24) {
      refundPercentage = 50;
    }

    booking.status = "cancelled";
    booking.cancellationReason = reason;
    booking.lastUpdated = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: {
        ...booking,
        refundPercentage,
      },
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const rescheduleBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newDate, reason } = req.body;
    const userId = (req as any).user.id;

    const booking = mockBookings.find((b) => b.id === parseInt(id));

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user can reschedule
    const canReschedule =
      booking.studentId === userId || booking.teacherId === userId;

    if (!canReschedule) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check rescheduling policy
    if (
      booking.rescheduleCount >=
      bookingPolicies.rescheduling.maxReschedulesPerBooking
    ) {
      return res.status(400).json({ message: "Maximum reschedules exceeded" });
    }

    const lessonDate = new Date(booking.lessonDate);
    const now = new Date();
    const hoursUntilLesson =
      (lessonDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilLesson < bookingPolicies.rescheduling.freeWindowHours) {
      return res
        .status(400)
        .json({ message: "Cannot reschedule within 72 hours of lesson" });
    }

    booking.lessonDate = newDate;
    booking.rescheduleCount += 1;
    booking.lastUpdated = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: "Booking rescheduled successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Reschedule booking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const confirmBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const booking = mockBookings.find((b) => b.id === parseInt(id));

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only teachers can confirm bookings
    if (userRole !== "teacher" || booking.teacherId !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    booking.status = "confirmed";
    booking.meetingUrl = "https://zoom.us/j/123456789"; // Generate meeting URL
    booking.lastUpdated = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Confirm booking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const completeBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const booking = mockBookings.find((b) => b.id === parseInt(id));

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Teachers or students can mark as complete
    const canComplete =
      booking.teacherId === userId || booking.studentId === userId;

    if (!canComplete) {
      return res.status(403).json({ message: "Access denied" });
    }

    booking.status = "completed";
    if (notes) booking.notes = notes;
    booking.lastUpdated = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: "Booking marked as completed",
      data: booking,
    });
  } catch (error) {
    console.error("Complete booking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const markAttendance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { studentAttended, teacherAttended, notes } = req.body;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const booking = mockBookings.find((b) => b.id === parseInt(id));

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only teachers or admins can mark attendance
    if (userRole !== "teacher" && userRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Add attendance information to booking
    (booking as any).attendance = {
      studentAttended: studentAttended || false,
      teacherAttended: teacherAttended || true,
      notes: notes || "",
      markedBy: userId,
      markedAt: new Date().toISOString(),
    };

    booking.lastUpdated = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Mark attendance error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getBookingPolicies = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      data: bookingPolicies,
    });
  } catch (error) {
    console.error("Get booking policies error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
