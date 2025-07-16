import express from "express";
import {
  getTeacherAnalytics,
  getStudentAnalytics,
  getPlatformAnalytics,
  getRevenueAnalytics,
  getUserGrowthAnalytics,
  getLessonAnalytics,
  getEngagementAnalytics,
} from "../controllers/analytics.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = express.Router();

// All analytics require authentication
router.use(authenticate);

// Personal analytics (accessible by the user themselves)
router.get("/teacher/:id", getTeacherAnalytics);
router.get("/student/:id", getStudentAnalytics);

// Platform-wide analytics (admin only)
router.get("/platform", requireRole("admin"), getPlatformAnalytics);
router.get("/revenue", requireRole("admin"), getRevenueAnalytics);
router.get("/users", requireRole("admin"), getUserGrowthAnalytics);
router.get("/lessons", requireRole("admin"), getLessonAnalytics);
router.get("/engagement", requireRole("admin"), getEngagementAnalytics);

export default router;
