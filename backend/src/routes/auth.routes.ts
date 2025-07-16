import express from "express";
import {
  login,
  register,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  enable2FA,
  disable2FA,
  verify2FA,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

// Basic authentication
router.post("/login", login);
router.post("/register", register);
router.post("/logout", authenticate, logout);
router.post("/refresh", refreshToken);

// Password reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Email verification
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", authenticate, resendVerification);

// Two-factor authentication
router.post("/2fa/enable", authenticate, enable2FA);
router.post("/2fa/disable", authenticate, disable2FA);
router.post("/2fa/verify", verify2FA);

export default router;
