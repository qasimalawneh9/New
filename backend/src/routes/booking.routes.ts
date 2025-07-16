import express from "express";
import {
  getAllBookings,
  getMyBookings,
  createBooking,
  getBooking,
  updateBooking,
  cancelBooking,
  rescheduleBooking,
  confirmBooking,
  completeBooking,
  markAttendance,
  getBookingPolicies,
} from "../controllers/booking.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = express.Router();

// Public endpoints
router.get("/policies", getBookingPolicies);

// Authenticated endpoints
router.get("/me", authenticate, getMyBookings);
router.post("/", authenticate, createBooking);
router.get("/:id", authenticate, getBooking);
router.put("/:id", authenticate, updateBooking);

// Booking actions
router.post("/:id/cancel", authenticate, cancelBooking);
router.post("/:id/reschedule", authenticate, rescheduleBooking);
router.post("/:id/confirm", authenticate, confirmBooking);
router.post("/:id/complete", authenticate, completeBooking);
router.post("/:id/attendance", authenticate, markAttendance);

// Admin endpoints
router.get("/", authenticate, requireRole("admin"), getAllBookings);

export default router;
