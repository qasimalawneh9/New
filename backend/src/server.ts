import app from "./app";
import { testConnection } from "./config/database";

const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    // Try to test database connection, but don't fail if it's not available
    const dbConnected = await testConnection();

    if (dbConnected) {
      console.log("✅ Database connected successfully");
    } else {
      console.log(
        "⚠️  Database not available - running in development mode without database",
      );
    }

    // Start server regardless of database connection
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
