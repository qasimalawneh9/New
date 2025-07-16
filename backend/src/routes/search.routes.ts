import express from "express";
import {
  searchTeachers,
  searchStudents,
  searchLessons,
  globalSearch,
  getSearchSuggestions,
  getSearchFilters,
} from "../controllers/search.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = express.Router();

// Public search endpoints
router.get("/teachers", searchTeachers);
router.get("/suggestions", getSearchSuggestions);
router.get("/filters", getSearchFilters);

// Authenticated search endpoints
router.get("/lessons", authenticate, searchLessons);
router.get("/", authenticate, globalSearch);

// Admin-only search endpoints
router.get("/students", authenticate, requireRole("admin"), searchStudents);

export default router;
