import express from "express";
import {
  getPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  setDefaultMethod,
  processPayment,
  getPaymentHistory,
  refundPayment,
} from "../controllers/payment.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

// Payment methods management
router.get("/methods", authenticate, getPaymentMethods);
router.post("/methods", authenticate, addPaymentMethod);
router.put("/methods/:id", authenticate, updatePaymentMethod);
router.delete("/methods/:id", authenticate, deletePaymentMethod);
router.post("/methods/:id/default", authenticate, setDefaultMethod);

// Payment processing
router.post("/process", authenticate, processPayment);
router.get("/history", authenticate, getPaymentHistory);
router.post("/:id/refund", authenticate, refundPayment);

export default router;
