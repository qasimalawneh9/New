import express from "express";
import {
  getAllTeachers,
  getTeacher,
  searchTeachers,
  getAvailability,
  updateAvailability,
  getMyProfile,
  updateProfile,
  uploadIntroVideo,
  getEarnings,
  getReviews,
  getMyStudents,
  getCalendar,
  getStats,
} from "../controllers/teacher.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = express.Router();

// Public teacher endpoints
router.get("/", getAllTeachers);
router.get("/search", searchTeachers);
router.get("/:id", getTeacher);
router.get("/:id/availability", getAvailability);
router.get("/:id/reviews", getReviews);

// Teacher-only endpoints
router.get("/me/profile", authenticate, requireRole("teacher"), getMyProfile);
router.put("/me/profile", authenticate, requireRole("teacher"), updateProfile);
router.put(
  "/me/availability",
  authenticate,
  requireRole("teacher"),
  updateAvailability,
);
router.post(
  "/me/video",
  authenticate,
  requireRole("teacher"),
  upload.single("video"),
  uploadIntroVideo,
);
router.get("/me/earnings", authenticate, requireRole("teacher"), getEarnings);
router.get("/me/students", authenticate, requireRole("teacher"), getMyStudents);
router.get("/me/calendar", authenticate, requireRole("teacher"), getCalendar);
router.get("/me/stats", authenticate, requireRole("teacher"), getStats);

export default router;
