import React, { useState, useEffect } from "react";
import { adminService } from "@/api/services/admin.service";

export default function AdminSimple() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const dashboardStats = await adminService.getDashboard();
        setStats(dashboardStats);
      } catch (err: any) {
        setError(err?.message || "Failed to load admin data");
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Simple Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6 border">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border">
          <h3 className="text-sm font-medium text-gray-500">Total Teachers</h3>
          <p className="text-2xl font-bold">{stats?.totalTeachers || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border">
          <h3 className="text-sm font-medium text-gray-500">Total Lessons</h3>
          <p className="text-2xl font-bold">{stats?.totalLessons || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border">
          <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
          <p className="text-2xl font-bold">${stats?.monthlyRevenue || 0}</p>
        </div>
      </div>

      {/* Simple Info */}
      <div className="bg-white rounded-lg shadow p-6 border">
        <h2 className="text-lg font-semibold mb-4">Platform Status</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Active Bookings:</span>{" "}
            {stats?.activeBookings || 0}
          </p>
          <p>
            <span className="font-medium">Average Rating:</span>{" "}
            {stats?.avgRating || 0}
          </p>
          <p>
            <span className="font-medium">Support Tickets:</span> Open:{" "}
            {stats?.supportTickets?.open || 0}, In Progress:{" "}
            {stats?.supportTickets?.inProgress || 0}
          </p>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-blue-800 font-semibold mb-2">Admin Dashboard</h3>
        <p className="text-blue-600 text-sm">
          Admin dashboard is working and connected to the backend! The full
          dashboard with charts and advanced features will load once the React
          context issues are resolved.
        </p>
      </div>
    </div>
  );
}
