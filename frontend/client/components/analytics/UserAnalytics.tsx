import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  Users,
  TrendingUp,
  Clock,
  Star,
  MessageSquare,
  BookOpen,
  Filter,
  Download,
  Eye,
  Calendar,
  Target,
} from "lucide-react";
import {
  analyticsService,
  UserAnalytics as UserAnalyticsType,
} from "../../api/services/analytics.service";

interface UserAnalyticsProps {
  userId?: number;
  timeframe?: "week" | "month" | "quarter" | "year";
}

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
];

export const UserAnalytics: React.FC<UserAnalyticsProps> = ({
  userId,
  timeframe = "month",
}) => {
  const [userData, setUserData] = useState<UserAnalyticsType | null>(null);
  const [cohortData, setCohortData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<
    "activity" | "engagement" | "retention" | "behavior"
  >("activity");

  // Mock user segmentation data
  const [segmentData] = useState([
    {
      segment: "High Engagement",
      users: 2847,
      retention: 0.89,
      avgLTV: 324.5,
      color: "#10B981",
    },
    {
      segment: "Medium Engagement",
      users: 6234,
      retention: 0.72,
      avgLTV: 187.25,
      color: "#3B82F6",
    },
    {
      segment: "Low Engagement",
      users: 4532,
      retention: 0.45,
      avgLTV: 89.1,
      color: "#F59E0B",
    },
    {
      segment: "At Risk",
      users: 1847,
      retention: 0.23,
      avgLTV: 45.3,
      color: "#EF4444",
    },
    {
      segment: "Churned",
      users: 2340,
      retention: 0.0,
      avgLTV: 0.0,
      color: "#6B7280",
    },
  ]);

  const [behaviorData] = useState([
    { behavior: "Daily Login", users: 5847, percentage: 36.9 },
    { behavior: "Weekly Lessons", users: 8234, percentage: 52.0 },
    { behavior: "Message Usage", users: 7623, percentage: 48.1 },
    { behavior: "Profile Updates", users: 3456, percentage: 21.8 },
    { behavior: "Referrals Made", users: 1892, percentage: 11.9 },
  ]);

  useEffect(() => {
    loadUserAnalytics();
    loadCohortAnalysis();
  }, [userId, timeframe]);

  const loadUserAnalytics = async () => {
    if (!userId) {
      // Load aggregate user analytics
      setUserData({
        userId: 0,
        profile: {
          name: "Platform Average",
          email: "",
          type: "student",
          joinDate: new Date().toISOString(),
          status: "active",
        },
        activity: {
          totalSessions: 127,
          avgSessionDuration: 42.5,
          lastActiveDate: new Date().toISOString(),
          totalLessons: 23,
          messagesExchanged: 456,
          loginStreak: 7,
        },
        engagement: {
          weeklyActivity: Array.from({ length: 12 }, (_, i) => ({
            week: `Week ${i + 1}`,
            sessions: Math.floor(Math.random() * 20) + 5,
            duration: Math.floor(Math.random() * 60) + 20,
          })),
          featureUsage: [
            { feature: "Video Lessons", count: 89 },
            { feature: "Messaging", count: 67 },
            { feature: "Scheduling", count: 45 },
            { feature: "File Sharing", count: 23 },
            { feature: "Group Lessons", count: 12 },
          ],
          satisfactionScore: 4.6,
          supportInteractions: 3,
        },
        financial: {
          totalSpent: 387.5,
          avgTransactionValue: 45.6,
          paymentMethods: [
            { method: "Credit Card", usage: 78 },
            { method: "PayPal", usage: 22 },
          ],
        },
      });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await analyticsService.getUserAnalytics(userId);
      setUserData(data);
    } catch (error) {
      console.error("Failed to load user analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCohortAnalysis = async () => {
    try {
      const filters = {
        dateRange: {
          start: new Date(Date.now() - 365 * 86400000)
            .toISOString()
            .split("T")[0],
          end: new Date().toISOString().split("T")[0],
        },
        granularity: "month" as const,
      };

      const data = await analyticsService.getUserCohortAnalysis(filters);
      setCohortData(data);
    } catch (error) {
      console.error("Failed to load cohort analysis:", error);
      // Mock cohort data
      setCohortData([
        {
          cohort: "2024-01",
          size: 1247,
          retention: [
            { period: 1, users: 1059, rate: 0.85 },
            { period: 2, users: 898, rate: 0.72 },
            { period: 3, users: 848, rate: 0.68 },
          ],
        },
        {
          cohort: "2024-02",
          size: 1456,
          retention: [
            { period: 1, users: 1282, rate: 0.88 },
            { period: 2, users: 1092, rate: 0.75 },
            { period: 3, users: 1020, rate: 0.7 },
          ],
        },
      ]);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (isLoading || !userData) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  const renderActivityMetrics = () => (
    <div className="space-y-6">
      {/* Activity Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sessions</p>
              <p className="text-2xl font-bold text-gray-900">
                {userData.activity.totalSessions}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatDuration(userData.activity.avgSessionDuration)}
              </p>
            </div>
            <Clock className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lessons</p>
              <p className="text-2xl font-bold text-gray-900">
                {userData.activity.totalLessons}
              </p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Messages</p>
              <p className="text-2xl font-bold text-gray-900">
                {userData.activity.messagesExchanged}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Login Streak</p>
              <p className="text-2xl font-bold text-gray-900">
                {userData.activity.loginStreak}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">
                {userData.engagement.satisfactionScore}
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Weekly Activity Trend */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Weekly Activity Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userData.engagement.weeklyActivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis yAxisId="sessions" />
            <YAxis yAxisId="duration" orientation="right" />
            <Tooltip
              formatter={(value, name) => [
                name === "sessions"
                  ? `${value} sessions`
                  : formatDuration(value as number),
                name === "sessions" ? "Sessions" : "Avg Duration",
              ]}
            />
            <Bar yAxisId="sessions" dataKey="sessions" fill="#3B82F6" />
            <Line
              yAxisId="duration"
              type="monotone"
              dataKey="duration"
              stroke="#10B981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderEngagementMetrics = () => (
    <div className="space-y-6">
      {/* Feature Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Feature Usage
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={userData.engagement.featureUsage}
              layout="horizontal"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="feature" type="category" width={100} />
              <Tooltip formatter={(value) => [`${value} times`]} />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Methods
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={userData.financial.paymentMethods}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="usage"
                label={({ method, usage }) => `${method}: ${usage}%`}
              >
                {userData.financial.paymentMethods.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderRetentionAnalysis = () => (
    <div className="space-y-6">
      {/* User Segments */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          User Segments
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {segmentData.map((segment) => (
            <div
              key={segment.segment}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <h4 className="font-medium text-gray-900">{segment.segment}</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Users:</span>
                  <span className="font-medium">
                    {segment.users.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Retention:</span>
                  <span className="font-medium">
                    {(segment.retention * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg LTV:</span>
                  <span className="font-medium">
                    {formatCurrency(segment.avgLTV)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cohort Retention */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cohort Retention Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-4 font-medium text-gray-900">
                  Cohort
                </th>
                <th className="text-center py-2 px-4 font-medium text-gray-900">
                  Size
                </th>
                <th className="text-center py-2 px-4 font-medium text-gray-900">
                  Month 1
                </th>
                <th className="text-center py-2 px-4 font-medium text-gray-900">
                  Month 2
                </th>
                <th className="text-center py-2 px-4 font-medium text-gray-900">
                  Month 3
                </th>
              </tr>
            </thead>
            <tbody>
              {cohortData.map((cohort) => (
                <tr key={cohort.cohort} className="border-b border-gray-100">
                  <td className="py-2 px-4 font-medium text-gray-900">
                    {cohort.cohort}
                  </td>
                  <td className="text-center py-2 px-4">
                    {cohort.size.toLocaleString()}
                  </td>
                  {cohort.retention.map((period: any, index: number) => (
                    <td key={index} className="text-center py-2 px-4">
                      <div className="flex flex-col">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            period.rate > 0.8
                              ? "bg-green-100 text-green-800"
                              : period.rate > 0.6
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {(period.rate * 100).toFixed(1)}%
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {period.users}
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBehaviorAnalysis = () => (
    <div className="space-y-6">
      {/* Behavior Patterns */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          User Behavior Patterns
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={behaviorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="behavior"
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                name === "users" ? `${value} users` : `${value}%`,
                name === "users" ? "Users" : "Percentage",
              ]}
            />
            <Bar dataKey="users" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Engagement Radar */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Engagement Profile
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={userData.engagement.featureUsage}>
            <PolarGrid />
            <PolarAngleAxis dataKey="feature" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Usage"
              dataKey="count"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {userId
              ? `User Analytics - ${userData.profile.name}`
              : "User Analytics Overview"}
          </h2>
          <p className="text-gray-600">
            Detailed user behavior and engagement insights
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="activity">Activity Metrics</option>
            <option value="engagement">Engagement Analysis</option>
            <option value="retention">Retention Analysis</option>
            <option value="behavior">Behavior Patterns</option>
          </select>

          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* User Profile Summary */}
      {userId && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <h3 className="font-medium opacity-75">User Type</h3>
              <p className="text-xl font-bold capitalize">
                {userData.profile.type}
              </p>
            </div>
            <div>
              <h3 className="font-medium opacity-75">Member Since</h3>
              <p className="text-xl font-bold">
                {new Date(userData.profile.joinDate).toLocaleDateString([], {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <h3 className="font-medium opacity-75">Status</h3>
              <p className="text-xl font-bold capitalize">
                {userData.profile.status}
              </p>
            </div>
            <div>
              <h3 className="font-medium opacity-75">Total Value</h3>
              <p className="text-xl font-bold">
                {userData.financial.totalSpent
                  ? formatCurrency(userData.financial.totalSpent)
                  : userData.financial.totalEarned
                    ? formatCurrency(userData.financial.totalEarned)
                    : "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Metric Content */}
      {selectedMetric === "activity" && renderActivityMetrics()}
      {selectedMetric === "engagement" && renderEngagementMetrics()}
      {selectedMetric === "retention" && renderRetentionAnalysis()}
      {selectedMetric === "behavior" && renderBehaviorAnalysis()}
    </div>
  );
};

export default UserAnalytics;
