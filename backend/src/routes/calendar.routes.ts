import express from "express";
import {
  getMyCalendar,
  getTeacherAvailability,
  getAvailableSlots,
  updateAvailability,
  blockTimeSlot,
  unblockTimeSlot,
  syncExternalCalendar,
  getCalendarEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/calendar.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

// Personal calendar
router.get("/me", authenticate, getMyCalendar);
router.put("/me/availability", authenticate, updateAvailability);
router.post("/me/block", authenticate, blockTimeSlot);
router.delete("/me/unblock/:slotId", authenticate, unblockTimeSlot);

// Public availability queries
router.get("/availability/:teacherId", getTeacherAvailability);
router.get("/slots/:teacherId", getAvailableSlots);

// External calendar integration
router.post("/sync", authenticate, syncExternalCalendar);

// Calendar events
router.get("/events", authenticate, getCalendarEvents);
router.post("/events", authenticate, createEvent);
router.put("/events/:id", authenticate, updateEvent);
router.delete("/events/:id", authenticate, deleteEvent);

export default router;
