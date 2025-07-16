import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationSettings,
  updateNotificationSettings,
  sendTestNotification,
} from "../controllers/notification.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

// Notification management
router.get("/", authenticate, getNotifications);
router.post("/:id/read", authenticate, markAsRead);
router.post("/read-all", authenticate, markAllAsRead);
router.delete("/:id", authenticate, deleteNotification);

// Notification settings
router.get("/settings", authenticate, getNotificationSettings);
router.put("/settings", authenticate, updateNotificationSettings);
router.post("/test", authenticate, sendTestNotification);

export default router;
