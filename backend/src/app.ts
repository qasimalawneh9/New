import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import all route modules
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import teacherRoutes from "./routes/teacher.routes";
import studentRoutes from "./routes/student.routes";
import bookingRoutes from "./routes/booking.routes";
import lessonRoutes from "./routes/lesson.routes";
import reviewRoutes from "./routes/review.routes";
import paymentRoutes from "./routes/payment.routes";
import walletRoutes from "./routes/wallet.routes";
import messageRoutes from "./routes/message.routes";
import notificationRoutes from "./routes/notification.routes";
import supportRoutes from "./routes/support.routes";
import adminRoutes from "./routes/admin.routes";
import calendarRoutes from "./routes/calendar.routes";
import uploadRoutes from "./routes/upload.routes";
import searchRoutes from "./routes/search.routes";
import analyticsRoutes from "./routes/analytics.routes";

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

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/analytics", analyticsRoutes);

// Root endpoint with comprehensive API documentation
app.get("/", (req, res) => {
  res.json({
    message: "TalkCon Language Learning Platform API",
    version: "2.0.0",
    status: "running",
    documentation: "https://api.talkcon.com/docs",
    categories: {
      authentication: [
        "POST /api/auth/login",
        "POST /api/auth/register",
        "POST /api/auth/logout",
        "POST /api/auth/refresh",
        "POST /api/auth/forgot-password",
        "POST /api/auth/reset-password",
      ],
      users: [
        "GET  /api/users/me",
        "PUT  /api/users/me",
        "POST /api/users/me/switch-role",
        "DELETE /api/users/me",
      ],
      teachers: [
        "GET  /api/teachers",
        "GET  /api/teachers/search",
        "GET  /api/teachers/:id",
        "GET  /api/teachers/me/profile",
        "PUT  /api/teachers/me/profile",
      ],
      students: [
        "GET  /api/students/me/profile",
        "GET  /api/students/me/progress",
        "GET  /api/students/me/goals",
        "PUT  /api/students/me/goals",
      ],
      bookings: [
        "GET  /api/bookings/me",
        "POST /api/bookings",
        "PUT  /api/bookings/:id",
        "POST /api/bookings/:id/cancel",
        "POST /api/bookings/:id/reschedule",
      ],
      lessons: [
        "GET  /api/lessons/:id/join",
        "POST /api/lessons/:id/start",
        "POST /api/lessons/:id/end",
        "GET  /api/lessons/:id/materials",
      ],
      reviews: [
        "POST /api/reviews",
        "GET  /api/reviews/teacher/:teacherId",
        "POST /api/reviews/:id/reply",
        "POST /api/reviews/:id/like",
      ],
      payments: [
        "GET  /api/payments/methods",
        "POST /api/payments/methods",
        "POST /api/payments/process",
        "GET  /api/payments/history",
      ],
      wallets: [
        "GET  /api/wallets/me",
        "POST /api/wallets/me/add-funds",
        "POST /api/wallets/me/withdraw",
        "POST /api/wallets/me/payout",
      ],
      messaging: [
        "GET  /api/messages/conversations",
        "POST /api/messages",
        "POST /api/messages/:id/read",
        "POST /api/messages/block",
      ],
      admin: [
        "GET  /api/admin/dashboard",
        "GET  /api/admin/users",
        "GET  /api/admin/analytics",
        "GET  /api/admin/reports",
      ],
    },
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    uptime: process.uptime(),
  });
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
    res.status(500).json({
      message: "Something went wrong!",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  },
);

export default app;
