import express from "express";
import {
  getMyWallet,
  getTransactions,
  addFunds,
  withdrawFunds,
  transferFunds,
  getPayoutMethods,
  addPayoutMethod,
  requestPayout,
  getPayoutHistory,
} from "../controllers/wallet.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

// Wallet information
router.get("/me", authenticate, getMyWallet);
router.get("/me/transactions", authenticate, getTransactions);

// Wallet operations
router.post("/me/add-funds", authenticate, addFunds);
router.post("/me/withdraw", authenticate, withdrawFunds);
router.post("/me/transfer", authenticate, transferFunds);

// Payout management
router.get("/me/payout-methods", authenticate, getPayoutMethods);
router.post("/me/payout-methods", authenticate, addPayoutMethod);
router.post("/me/payout", authenticate, requestPayout);
router.get("/me/payouts", authenticate, getPayoutHistory);

export default router;
