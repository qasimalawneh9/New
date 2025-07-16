import express from "express";
import {
  getCurrentUser,
  updateProfile,
  uploadAvatar,
  switchRole,
  deleteAccount,
  changePassword,
  getSettings,
  updateSettings,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = express.Router();

// Profile management
router.get("/me", authenticate, getCurrentUser);
router.put("/me", authenticate, updateProfile);
router.post("/me/avatar", authenticate, upload.single("avatar"), uploadAvatar);
router.delete("/me", authenticate, deleteAccount);

// Role switching
router.post("/me/switch-role", authenticate, switchRole);

// Password and security
router.put("/me/password", authenticate, changePassword);

// User settings
router.get("/me/settings", authenticate, getSettings);
router.put("/me/settings", authenticate, updateSettings);

export default router;
