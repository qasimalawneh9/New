import express from "express";
import {
  getTickets,
  createTicket,
  getTicket,
  updateTicket,
  closeTicket,
  addMessage,
  uploadAttachment,
  getFAQ,
  getCategories,
} from "../controllers/support.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = express.Router();

// Public endpoints
router.get("/faq", getFAQ);
router.get("/categories", getCategories);

// Ticket management
router.get("/tickets", authenticate, getTickets);
router.post("/tickets", authenticate, createTicket);
router.get("/tickets/:id", authenticate, getTicket);
router.put("/tickets/:id", authenticate, updateTicket);
router.post("/tickets/:id/close", authenticate, closeTicket);
router.post("/tickets/:id/messages", authenticate, addMessage);
router.post(
  "/tickets/:id/attachments",
  authenticate,
  upload.single("attachment"),
  uploadAttachment,
);

export default router;
