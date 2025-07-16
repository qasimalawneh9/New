import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getTeachers,
  getTeacherById,
  getFeaturedTeachers,
} from "./routes/teachers";
import {
  createBooking,
  getBookings,
  updateBookingStatus,
  getLessons,
  createLesson,
  updateLesson,
} from "./routes/bookings";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Teachers API
  app.get("/api/teachers", getTeachers);
  app.get("/api/teachers/featured", getFeaturedTeachers);
  app.get("/api/teachers/:id", getTeacherById);

  // Bookings API
  app.post("/api/bookings", createBooking);
  app.get("/api/bookings", getBookings);
  app.patch("/api/bookings/:id", updateBookingStatus);

  // Lessons API
  app.get("/api/lessons", getLessons);
  app.post("/api/lessons", createLesson);
  app.patch("/api/lessons/:id", updateLesson);

  return app;
}
