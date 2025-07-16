import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  HardDrive,
  Upload,
  Download,
  Trash2,
  Folder,
  TrendingUp,
  Users,
  Clock,
  FileText,
} from "lucide-react";
import {
  fileUploadService,
  FileCategory,
} from "../../api/services/file-upload.service";

interface StorageAnalyticsProps {
  timeframe?: "week" | "month" | "quarter" | "year";
  userId?: number;
}

interface StorageData {
  totalFiles: number;
  totalSize: number;
  sizeByCategory: Record<FileCategory, number>;
  sizeByType: Record<string, number>;
  uploadTrends: Array<{ date: string; uploads: number; size: number }>;
  popularFormats: Array<{ format: string; count: number; size: number }>;
}

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

const CATEGORY_LABELS: Record<FileCategory, string> = {
  avatar: "Avatars",
  document: "Documents",
  video: "Videos",
  audio: "Audio",
  image: "Images",
  lesson_material: "Lesson Materials",
  assignment: "Assignments",
  certificate: "Certificates",
  profile_document: "Profile Documents",
};

export const StorageAnalytics: React.FC<StorageAnalyticsProps> = ({
  timeframe = "month",
  userId,
}) => {
  const [data, setData] = useState<StorageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<
    "overview" | "trends" | "usage"
  >("overview");

  useEffect(() => {
    loadStorageAnalytics();
  }, [timeframe, userId]);

  const loadStorageAnalytics = async () => {
    try {
      setIsLoading(true);
      const analytics = await fileUploadService.getStorageAnalytics();
      setData(analytics);
    } catch (error) {
      console.error("Failed to load storage analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    return fileUploadService.formatFileSize(bytes);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const getCategoryData = () => {
    if (!data) return [];

    return Object.entries(data.sizeByCategory).map(([category, size]) => ({
      category: CATEGORY_LABELS[category as FileCategory] || category,
      size,
      sizeFormatted: formatFileSize(size),
      percentage: ((size / data.totalSize) * 100).toFixed(1),
    }));
  };

  const getTypeData = () => {
    if (!data) return [];

    return Object.entries(data.sizeByType).map(([type, size]) => ({
      type: type.split("/")[1]?.toUpperCase() || type,
      size,
      sizeFormatted: formatFileSize(size),
      percentage: ((size / data.totalSize) * 100).toFixed(1),
    }));
  };

  if (isLoading || !data) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Files</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(data.totalFiles)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+12.3% this month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Storage</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatFileSize(data.totalSize)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <HardDrive className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+8.7% this month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg File Size</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatFileSize(Math.round(data.totalSize / data.totalFiles))}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Folder className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>Stable</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">847</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+5.2% this month</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage by Category */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Storage by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getCategoryData()}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="size"
                label={({ category, percentage }) =>
                  `${category}: ${percentage}%`
                }
              >
                {getCategoryData().map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatFileSize(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* File Types */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular File Types
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.popularFormats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="format" />
              <YAxis tickFormatter={formatFileSize} />
              <Tooltip
                formatter={(value, name) => [
                  name === "count"
                    ? `${value} files`
                    : formatFileSize(value as number),
                  name === "count" ? "Files" : "Size",
                ]}
              />
              <Bar dataKey="size" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Category Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Category Breakdown
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {getCategoryData().map((category, index) => (
              <div
                key={category.category}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {category.category}
                  </span>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="text-sm text-gray-500">
                    {category.percentage}%
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {category.sizeFormatted}
                  </span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${category.percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      {/* Upload Trends */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Upload Trends
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data.uploadTrends}>
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
                name === "uploads"
                  ? `${value} uploads`
                  : formatFileSize(value as number),
                name === "uploads" ? "File Uploads" : "Data Uploaded",
              ]}
            />
            <Area
              type="monotone"
              dataKey="uploads"
              stackId="1"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="size"
              stackId="2"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Upload Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upload Volume by Day
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.uploadTrends.slice(-7)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString([], { weekday: "short" })
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value) => [`${value} uploads`, "Uploads"]}
              />
              <Line
                type="monotone"
                dataKey="uploads"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Storage Growth
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.uploadTrends.slice(-7)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString([], { weekday: "short" })
                }
              />
              <YAxis tickFormatter={formatFileSize} />
              <Tooltip
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value) => [
                  formatFileSize(value as number),
                  "Data Added",
                ]}
              />
              <Line
                type="monotone"
                dataKey="size"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderUsage = () => (
    <div className="space-y-6">
      {/* Storage Quota */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Storage Usage
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Used Storage
            </span>
            <span className="text-sm text-gray-500">
              {formatFileSize(data.totalSize)} / 10 GB
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full"
              style={{
                width: `${Math.min((data.totalSize / (10 * 1024 * 1024 * 1024)) * 100, 100)}%`,
              }}
            />
          </div>
          <div className="text-xs text-gray-500">
            {((data.totalSize / (10 * 1024 * 1024 * 1024)) * 100).toFixed(1)}%
            of quota used
          </div>
        </div>
      </div>

      {/* Top File Types by Size */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top File Types by Size
        </h3>
        <div className="space-y-3">
          {getTypeData()
            .slice(0, 5)
            .map((type, index) => (
              <div
                key={type.type}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {type.type}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {type.sizeFormatted}
                  </div>
                  <div className="text-xs text-gray-500">
                    {type.percentage}%
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {[
            {
              action: "Uploaded",
              file: "lesson-plan.pdf",
              size: "2.4 MB",
              time: "2 hours ago",
            },
            {
              action: "Deleted",
              file: "old-video.mp4",
              size: "125 MB",
              time: "5 hours ago",
            },
            {
              action: "Uploaded",
              file: "profile-photo.jpg",
              size: "856 KB",
              time: "1 day ago",
            },
            {
              action: "Shared",
              file: "assignment.docx",
              size: "1.2 MB",
              time: "2 days ago",
            },
            {
              action: "Uploaded",
              file: "audio-lesson.mp3",
              size: "8.7 MB",
              time: "3 days ago",
            },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.action === "Uploaded"
                      ? "bg-green-500"
                      : activity.action === "Deleted"
                        ? "bg-red-500"
                        : "bg-blue-500"
                  }`}
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    {activity.file}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-900">{activity.size}</div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Storage Analytics
          </h2>
          <p className="text-gray-600">File storage usage and trends</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "overview", name: "Overview", icon: HardDrive },
            { id: "trends", name: "Trends", icon: TrendingUp },
            { id: "usage", name: "Usage Details", icon: Folder },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedView(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedView === tab.id
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
      {selectedView === "overview" && renderOverview()}
      {selectedView === "trends" && renderTrends()}
      {selectedView === "usage" && renderUsage()}
    </div>
  );
};

export default StorageAnalytics;
