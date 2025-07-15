import express from "express";
import { login, register, logout } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", authenticate, logout);

export default router;
