import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import teacherRoutes from "./routes/teacher.routes";
import bookingRoutes from "./routes/booking.routes";
import walletRoutes from "./routes/wallet.routes";

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:3000",
      "http://localhost:8001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/wallets", walletRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "TalkCon Backend API",
    version: "1.0.0",
    status: "running",
    endpoints: [
      "POST /api/auth/login",
      "POST /api/auth/register",
      "POST /api/auth/logout",
      "GET  /api/users/me",
      "GET  /api/teachers",
      "POST /api/bookings",
      "GET  /api/wallets/me",
    ],
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  },
);

export default app;
