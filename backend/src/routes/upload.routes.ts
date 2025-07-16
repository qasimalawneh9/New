import express from "express";
import {
  uploadAvatar,
  uploadDocuments,
  uploadMaterials,
  uploadIntroVideo,
  uploadCertificates,
  uploadAttachments,
} from "../controllers/upload.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = express.Router();

// All upload endpoints require authentication
router.use(authenticate);

// File uploads
router.post("/avatar", upload.single("avatar"), uploadAvatar);
router.post("/documents", upload.array("documents"), uploadDocuments);
router.post("/materials", upload.array("materials"), uploadMaterials);
router.post("/video", upload.single("video"), uploadIntroVideo);
router.post("/certificates", upload.array("certificates"), uploadCertificates);
router.post("/attachments", upload.array("attachments"), uploadAttachments);

export default router;
