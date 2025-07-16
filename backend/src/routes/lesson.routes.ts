import express from "express";
import {
  joinLesson,
  startLesson,
  endLesson,
  getMeetingInfo,
  updateMeetingInfo,
  uploadMaterials,
  getMaterials,
  addNotes,
  getRecording,
} from "../controllers/lesson.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = express.Router();

// Lesson participation
router.get("/:id/join", authenticate, joinLesson);
router.post("/:id/start", authenticate, startLesson);
router.post("/:id/end", authenticate, endLesson);

// Meeting management
router.get("/:id/meeting", authenticate, getMeetingInfo);
router.put("/:id/meeting", authenticate, updateMeetingInfo);

// Materials and content
router.post(
  "/:id/materials",
  authenticate,
  upload.array("materials"),
  uploadMaterials,
);
router.get("/:id/materials", authenticate, getMaterials);
router.post("/:id/notes", authenticate, addNotes);
router.get("/:id/recording", authenticate, getRecording);

export default router;
