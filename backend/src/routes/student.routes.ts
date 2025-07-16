import express from "express";
import {
  getMyProfile,
  updateProfile,
  getMyTeachers,
  getProgress,
  getLearningGoals,
  updateLearningGoals,
  getCompletedLessons,
} from "../controllers/student.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = express.Router();

// Student-only endpoints
router.get("/me/profile", authenticate, requireRole("student"), getMyProfile);
router.put("/me/profile", authenticate, requireRole("student"), updateProfile);
router.get("/me/teachers", authenticate, requireRole("student"), getMyTeachers);
router.get("/me/progress", authenticate, requireRole("student"), getProgress);
router.get("/me/goals", authenticate, requireRole("student"), getLearningGoals);
router.put(
  "/me/goals",
  authenticate,
  requireRole("student"),
  updateLearningGoals,
);
router.get(
  "/me/lessons",
  authenticate,
  requireRole("student"),
  getCompletedLessons,
);

export default router;
