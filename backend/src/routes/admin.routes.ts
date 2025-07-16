import express from "express";
import {
  getDashboard,
  getStats,
  getUsers,
  getUserDetails,
  suspendUser,
  activateUser,
  deleteUser,
  getTeachers,
  approveTeacher,
  rejectTeacher,
  getBookings,
  getPayments,
  getReviews,
  moderateReview,
  getSupportTickets,
  assignTicket,
  getSystemSettings,
  updateSystemSettings,
  getSystemLogs,
  getAnalytics,
  getReports,
  exportData,
} from "../controllers/admin.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = express.Router();

// All admin endpoints require authentication and admin role
router.use(authenticate);
router.use(requireRole("admin"));

// Dashboard and stats
router.get("/dashboard", getDashboard);
router.get("/stats", getStats);
router.get("/analytics", getAnalytics);
router.get("/reports", getReports);
router.post("/export", exportData);

// User management
router.get("/users", getUsers);
router.get("/users/:id", getUserDetails);
router.post("/users/:id/suspend", suspendUser);
router.post("/users/:id/activate", activateUser);
router.delete("/users/:id", deleteUser);

// Teacher management
router.get("/teachers", getTeachers);
router.post("/teachers/:id/approve", approveTeacher);
router.post("/teachers/:id/reject", rejectTeacher);

// Content moderation
router.get("/bookings", getBookings);
router.get("/payments", getPayments);
router.get("/reviews", getReviews);
router.post("/reviews/:id/moderate", moderateReview);

// Support management
router.get("/support", getSupportTickets);
router.post("/support/:id/assign", assignTicket);

// System management
router.get("/settings", getSystemSettings);
router.put("/settings", updateSystemSettings);
router.get("/logs", getSystemLogs);

export default router;
