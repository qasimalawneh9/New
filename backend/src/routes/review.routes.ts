import express from "express";
import {
  getAllReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  getTeacherReviews,
  getMyReviews,
  replyToReview,
  likeReview,
  reportReview,
  getReviewStats,
} from "../controllers/review.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = express.Router();

// Public endpoints
router.get("/teacher/:teacherId", getTeacherReviews);
router.get("/stats/:teacherId", getReviewStats);

// Authenticated endpoints
router.post("/", authenticate, createReview);
router.get("/me", authenticate, getMyReviews);
router.get("/:id", authenticate, getReview);
router.put("/:id", authenticate, updateReview);
router.delete("/:id", authenticate, deleteReview);

// Review interactions
router.post("/:id/reply", authenticate, replyToReview);
router.post("/:id/like", authenticate, likeReview);
router.post("/:id/report", authenticate, reportReview);

// Admin endpoints
router.get("/", authenticate, requireRole("admin"), getAllReviews);

export default router;
