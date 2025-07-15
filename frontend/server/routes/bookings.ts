import { RequestHandler } from "express";
import { Booking, Lesson } from "@shared/api";

// Mock database
const mockBookings: Booking[] = [];
const mockLessons: Lesson[] = [
  {
    id: "1",
    teacherId: "1",
    studentId: "student1",
    language: "Spanish",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    duration: 60,
    price: 25,
    status: "scheduled",
    type: "regular",
    notes: "Focus on conversation and pronunciation",
  },
  {
    id: "2",
    teacherId: "2",
    studentId: "student1",
    language: "English",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
    duration: 60,
    price: 30,
    status: "scheduled",
    type: "regular",
    notes: "IELTS speaking practice",
  },
];

export const createBooking: RequestHandler = (req, res) => {
  try {
    const { teacherId, date, time, duration, language, type, notes } = req.body;

    // Validate required fields
    if (!teacherId || !date || !time || !duration || !language) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking: Booking = {
      id: `booking_${Date.now()}`,
      teacherId,
      studentId: "student1", // In real app, get from auth
      date,
      time,
      duration,
      language,
      type: type || "regular",
      price: 25, // In real app, get from teacher data
      status: "pending",
      notes,
    };

    mockBookings.push(booking);

    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBookings: RequestHandler = (req, res) => {
  try {
    const { studentId = "student1" } = req.query;

    const userBookings = mockBookings.filter(
      (booking) => booking.studentId === studentId,
    );

    res.json(userBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBookingStatus: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const bookingIndex = mockBookings.findIndex((booking) => booking.id === id);

    if (bookingIndex === -1) {
      return res.status(404).json({ error: "Booking not found" });
    }

    mockBookings[bookingIndex].status = status;

    res.json(mockBookings[bookingIndex]);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLessons: RequestHandler = (req, res) => {
  try {
    const { studentId = "student1", status } = req.query;

    let userLessons = mockLessons.filter(
      (lesson) => lesson.studentId === studentId,
    );

    if (status) {
      userLessons = userLessons.filter((lesson) => lesson.status === status);
    }

    // Sort by date
    userLessons.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    res.json(userLessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createLesson: RequestHandler = (req, res) => {
  try {
    const { teacherId, language, date, duration, price, type, notes } =
      req.body;

    const lesson: Lesson = {
      id: `lesson_${Date.now()}`,
      teacherId,
      studentId: "student1", // In real app, get from auth
      language,
      date,
      duration,
      price,
      status: "scheduled",
      type: type || "regular",
      notes,
    };

    mockLessons.push(lesson);

    res.status(201).json(lesson);
  } catch (error) {
    console.error("Error creating lesson:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateLesson: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const lessonIndex = mockLessons.findIndex((lesson) => lesson.id === id);

    if (lessonIndex === -1) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    mockLessons[lessonIndex] = {
      ...mockLessons[lessonIndex],
      ...updates,
    };

    res.json(mockLessons[lessonIndex]);
  } catch (error) {
    console.error("Error updating lesson:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
