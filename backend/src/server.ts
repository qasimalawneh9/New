import app from "./app";

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Skip database connection for development
    console.log("⚡ Starting in development mode without database");

    // Start server immediately
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log("📋 Available endpoints:");
      console.log("  - POST /api/auth/login");
      console.log("  - POST /api/auth/register");
      console.log("  - POST /api/auth/logout");
      console.log("  - GET  /api/users/me");
      console.log("  - GET  /api/teachers");
      console.log("  - POST /api/bookings");
      console.log("  - GET  /api/wallets/me");
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("🛑 SIGTERM received, shutting down gracefully...");
      server.close(() => {
        console.log("✅ Process terminated");
      });
    });

    process.on("SIGINT", () => {
      console.log("🛑 SIGINT received, shutting down gracefully...");
      server.close(() => {
        console.log("✅ Process terminated");
      });
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
