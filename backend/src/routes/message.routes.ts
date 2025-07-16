import express from "express";
import {
  getConversations,
  getConversation,
  sendMessage,
  markAsRead,
  deleteMessage,
  searchMessages,
  blockUser,
  unblockUser,
  reportMessage,
} from "../controllers/message.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

// Conversation management
router.get("/conversations", authenticate, getConversations);
router.get("/conversations/:id", authenticate, getConversation);

// Message operations
router.post("/", authenticate, sendMessage);
router.post("/:id/read", authenticate, markAsRead);
router.delete("/:id", authenticate, deleteMessage);
router.get("/search", authenticate, searchMessages);

// User management
router.post("/block", authenticate, blockUser);
router.post("/unblock", authenticate, unblockUser);
router.post("/:id/report", authenticate, reportMessage);

export default router;
