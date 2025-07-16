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
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  BookOpen,
  MessageSquare,
  Download,
  Filter,
  Calendar,
  Eye,
  Target,
  Zap,
  Globe,
} from "lucide-react";
import {
  analyticsService,
  PlatformMetrics,
  AnalyticsFilters,
} from "../api/services/analytics.service";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#F97316",
  "#84CC16",
];

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ComponentType<any>;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        {change && (
          <div
            className={`flex items-center mt-2 text-sm ${
              trend === "up"
                ? "text-green-600"
                : trend === "down"
                  ? "text-red-600"
                  : "text-gray-600"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : trend === "down" ? (
              <TrendingDown className="w-4 h-4 mr-1" />
            ) : null}
            <span>{change}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export const AnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [realtimeData, setRealtimeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "week" | "month" | "quarter" | "year"
  >("month");
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "financial" | "content" | "predictive"
  >("overview");

  // Filters
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: {
      start: new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0],
      end: new Date().toISOString().split("T")[0],
    },
    granularity: "day",
    userType: "all",
  });

  useEffect(() => {
    loadAnalytics();
    loadRealtimeData();

    // Setup realtime data refresh
    const interval = setInterval(loadRealtimeData, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [filters]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getPlatformMetrics(filters);
      setMetrics(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRealtimeData = async () => {
    try {
      const data = await analyticsService.getRealtimeMetrics();
      setRealtimeData(data);
    } catch (error) {
      console.error("Failed to load realtime data:", error);
    }
  };

  const handleExport = async () => {
    try {
      const exportOptions = {
        format: "xlsx" as const,
        metrics: ["overview", "users", "financial", "engagement"],
        filters,
        includeCharts: true,
      };
      const result = await analyticsService.exportData(exportOptions);
      window.open(result.downloadUrl, "_blank");
    } catch (error) {
      console.error("Failed to export data:", error);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (isLoading || !metrics) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Realtime Stats */}
      {realtimeData && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Live Platform Status
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {realtimeData.activeUsers}
              </div>
              <div className="text-sm opacity-75">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {realtimeData.ongoingLessons}
              </div>
              <div className="text-sm opacity-75">Live Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {realtimeData.activeConversations}
              </div>
              <div className="text-sm opacity-75">Active Chats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {realtimeData.recentRegistrations}
              </div>
              <div className="text-sm opacity-75">New Signups</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(realtimeData.systemLoad * 100)}%
              </div>
              <div className="text-sm opacity-75">System Load</div>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={metrics.overview.totalUsers}
          change={`+${metrics.overview.userGrowthRate}%`}
          trend="up"
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(metrics.overview.totalRevenue)}
          change="+18.2%"
          trend="up"
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Total Lessons"
          value={metrics.overview.totalLessons}
          change="+12.5%"
          trend="up"
          icon={BookOpen}
          color="bg-purple-500"
        />
        <StatCard
          title="Avg Session Time"
          value={`${metrics.overview.avgSessionTime}m`}
          change="+5.3%"
          trend="up"
          icon={MessageSquare}
          color="bg-orange-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            User Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={metrics.userMetrics.registrationsByPeriod}>
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
                formatter={(value, name) => [
                  value,
                  name === "students" ? "Students" : "Teachers",
                ]}
              />
              <Area
                type="monotone"
                dataKey="students"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="teachers"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={metrics.financialMetrics.revenueByPeriod}>
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
                formatter={(value, name) => [
                  formatCurrency(value as number),
                  name === "gross"
                    ? "Gross Revenue"
                    : name === "net"
                      ? "Net Revenue"
                      : "Fees",
                ]}
              />
              <Bar dataKey="gross" fill="#3B82F6" />
              <Line
                type="monotone"
                dataKey="net"
                stroke="#10B981"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Popular Languages */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Languages
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metrics.lessonMetrics.popularLanguages}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="lessons"
                label={({ language, lessons }) => `${language}: ${lessons}`}
              >
                {metrics.lessonMetrics.popularLanguages.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} lessons`]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Lesson Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Lesson Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={metrics.lessonMetrics.lessonsByPeriod}>
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
                formatter={(value, name) => [
                  value,
                  name === "total"
                    ? "Total"
                    : name === "completed"
                      ? "Completed"
                      : "Cancelled",
                ]}
              />
              <Area
                type="monotone"
                dataKey="total"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="cancelled"
                stackId="1"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Geographic Distribution
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {metrics.userMetrics.geographicDistribution.map(
                (country, index) => (
                  <div
                    key={country.country}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {country.country}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {country.users.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {country.percentage}%
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={metrics.userMetrics.geographicDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="users"
                >
                  {metrics.userMetrics.geographicDistribution.map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ),
                  )}
                </Pie>
                <Tooltip formatter={(value) => [`${value} users`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserAnalytics = () => (
    <div className="space-y-6">
      {/* User Retention */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          User Retention by Cohort
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-4 font-medium text-gray-900">
                  Cohort
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
              {Object.entries(
                metrics.userMetrics.userRetention.reduce(
                  (acc, item) => {
                    if (!acc[item.cohort]) acc[item.cohort] = {};
                    acc[item.cohort][item.period] = item.retention;
                    return acc;
                  },
                  {} as Record<string, Record<number, number>>,
                ),
              ).map(([cohort, periods]) => (
                <tr key={cohort} className="border-b border-gray-100">
                  <td className="py-2 px-4 font-medium text-gray-900">
                    {cohort}
                  </td>
                  <td className="text-center py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        (periods[1] || 0) > 0.8
                          ? "bg-green-100 text-green-800"
                          : (periods[1] || 0) > 0.6
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {formatPercentage(periods[1] || 0)}
                    </span>
                  </td>
                  <td className="text-center py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        (periods[2] || 0) > 0.7
                          ? "bg-green-100 text-green-800"
                          : (periods[2] || 0) > 0.5
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {formatPercentage(periods[2] || 0)}
                    </span>
                  </td>
                  <td className="text-center py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        (periods[3] || 0) > 0.6
                          ? "bg-green-100 text-green-800"
                          : (periods[3] || 0) > 0.4
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {formatPercentage(periods[3] || 0)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Device & Age Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Device Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={metrics.userMetrics.deviceBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label={({ device, percentage }) => `${device}: ${percentage}%`}
              >
                {metrics.userMetrics.deviceBreakdown.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} users`]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Age Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={metrics.userMetrics.ageDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} users`]} />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive platform insights and metrics
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>

          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "overview", name: "Overview", icon: Eye },
            { id: "users", name: "User Analytics", icon: Users },
            { id: "financial", name: "Financial", icon: DollarSign },
            { id: "content", name: "Content", icon: BookOpen },
            { id: "predictive", name: "Predictive", icon: Target },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && renderOverview()}
      {activeTab === "users" && renderUserAnalytics()}
      {activeTab === "financial" && (
        <div className="text-center py-12">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Financial Analytics
          </h3>
          <p className="text-gray-500">
            Advanced financial metrics and forecasting
          </p>
        </div>
      )}
      {activeTab === "content" && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Content Analytics
          </h3>
          <p className="text-gray-500">
            Lesson performance and content insights
          </p>
        </div>
      )}
      {activeTab === "predictive" && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Predictive Analytics
          </h3>
          <p className="text-gray-500">
            AI-powered forecasting and recommendations
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
