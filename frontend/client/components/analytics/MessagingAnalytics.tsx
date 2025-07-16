import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  MessageSquare,
  Users,
  Clock,
  TrendingUp,
  Activity,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { messagingService } from "../../api/services/messaging.service";

interface MessagingAnalyticsProps {
  timeframe?: "week" | "month" | "year";
  userId?: number;
}

interface MessageMetrics {
  totalMessages: number;
  totalConversations: number;
  activeConversations: number;
  unreadCount: number;
  averageResponseTime: string;
  messagesByType: Record<string, number>;
  messagesByDay: Array<{ date: string; count: number }>;
  conversationsByDay: Array<{ date: string; count: number }>;
  responseTimesByDay: Array<{ date: string; avgTime: number }>;
  popularHours: Array<{ hour: number; count: number }>;
  userEngagement: Array<{
    userId: number;
    userName: string;
    messageCount: number;
    responseTime: number;
  }>;
  messageTypes: Array<{ type: string; count: number; percentage: number }>;
}

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
];

export const MessagingAnalytics: React.FC<MessagingAnalyticsProps> = ({
  timeframe = "month",
  userId,
}) => {
  const [metrics, setMetrics] = useState<MessageMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);

  useEffect(() => {
    loadAnalytics();
  }, [selectedTimeframe, userId]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const analytics =
        await messagingService.getMessageAnalytics(selectedTimeframe);

      // Enhanced mock data with more comprehensive metrics
      const enhancedMetrics: MessageMetrics = {
        ...analytics,
        conversationsByDay: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
          count: Math.floor(Math.random() * 15) + 2,
        })).reverse(),
        responseTimesByDay: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
          avgTime: Math.floor(Math.random() * 240) + 30, // 30-270 minutes
        })).reverse(),
        popularHours: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          count:
            Math.floor(Math.random() * 100) + (i >= 8 && i <= 22 ? 50 : 10),
        })),
        userEngagement: [
          {
            userId: 1,
            userName: "Emma Wilson",
            messageCount: 456,
            responseTime: 45,
          },
          {
            userId: 2,
            userName: "John Doe",
            messageCount: 398,
            responseTime: 62,
          },
          {
            userId: 3,
            userName: "Sarah Chen",
            messageCount: 344,
            responseTime: 38,
          },
          {
            userId: 4,
            userName: "Mike Johnson",
            messageCount: 312,
            responseTime: 78,
          },
          {
            userId: 5,
            userName: "Lisa Park",
            messageCount: 298,
            responseTime: 52,
          },
        ],
        messageTypes: [
          { type: "Text", count: 1321, percentage: 85.6 },
          { type: "File", count: 198, percentage: 12.8 },
          { type: "System", count: 24, percentage: 1.6 },
        ],
      };

      setMetrics(enhancedMetrics);
    } catch (error) {
      console.error("Failed to load messaging analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatResponseTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getHourLabel = (hour: number): string => {
    return hour === 0
      ? "12 AM"
      : hour === 12
        ? "12 PM"
        : hour > 12
          ? `${hour - 12} PM`
          : `${hour} AM`;
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Data Available
        </h3>
        <p className="text-gray-500">
          Unable to load messaging analytics at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Messaging Analytics
          </h2>
          <p className="text-gray-600">
            Comprehensive insights into messaging activity
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeframe}
            onChange={(e) =>
              setSelectedTimeframe(e.target.value as "week" | "month" | "year")
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Messages
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.totalMessages.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">
              +12.3% from last period
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Conversations
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.activeConversations}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Activity className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-sm text-blue-600">
              {metrics.totalConversations} total
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Avg Response Time
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.averageResponseTime}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">-8.2% improvement</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Unread Messages
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.unreadCount}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <FileText className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">Needs attention</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages Over Time */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Messages Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={metrics.messagesByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value) => [`${value} messages`, "Messages"]}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Message Types Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Message Types
          </h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics.messageTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  label={(entry) => `${entry.type}: ${entry.percentage}%`}
                >
                  {metrics.messageTypes.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} messages`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Response Times Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Response Times Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.responseTimesByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis tickFormatter={(value) => formatResponseTime(value)} />
              <Tooltip
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value) => [
                  formatResponseTime(value as number),
                  "Avg Response Time",
                ]}
              />
              <Line
                type="monotone"
                dataKey="avgTime"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Activity by Hour */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Activity by Hour
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.popularHours}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={getHourLabel} />
              <YAxis />
              <Tooltip
                labelFormatter={(hour) => getHourLabel(hour as number)}
                formatter={(value) => [`${value} messages`, "Messages"]}
              />
              <Bar dataKey="count" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Engagement Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Top Active Users
          </h3>
          <p className="text-gray-600">Users with highest messaging activity</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Messages
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Response Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.userEngagement.map((user, index) => (
                <tr key={user.userId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {user.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {user.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Rank #{index + 1}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.messageCount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">messages sent</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatResponseTime(user.responseTime)}
                    </div>
                    <div
                      className={`text-sm ${user.responseTime < 60 ? "text-green-600" : user.responseTime < 120 ? "text-yellow-600" : "text-red-600"}`}
                    >
                      {user.responseTime < 60
                        ? "Fast"
                        : user.responseTime < 120
                          ? "Average"
                          : "Slow"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MessagingAnalytics;
