import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MessageSquare,
  Users,
  AlertTriangle,
  CheckCircle,
  Eye,
  Trash2,
  Ban,
  Download,
  MoreVertical,
} from "lucide-react";
import { messagingService } from "../../api/services/messaging.service";
import { adminDashboardService } from "../../api/services/admin-dashboard.service";
import MessagingAnalytics from "../../components/analytics/MessagingAnalytics";

interface MessageReport {
  id: number;
  messageId: number;
  reporterId: number;
  reporterName: string;
  reason: string;
  content: string;
  timestamp: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  conversationId: number;
  senderId: number;
  senderName: string;
}

interface ConversationStats {
  id: number;
  participantNames: string[];
  messageCount: number;
  lastActivity: string;
  status: "active" | "archived" | "flagged";
  reportCount: number;
}

export const AdminMessaging: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "reports" | "conversations" | "analytics"
  >("overview");
  const [reports, setReports] = useState<MessageReport[]>([]);
  const [conversations, setConversations] = useState<ConversationStats[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  // Overview stats
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalConversations: 0,
    activeConversations: 0,
    reportedMessages: 0,
    pendingReports: 0,
    averageResponseTime: "0m",
    dailyActiveUsers: 0,
    messageGrowth: "+0%",
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);

    try {
      // Load messaging analytics
      const analytics = await messagingService.getMessageAnalytics();
      setStats({
        totalMessages: analytics.totalMessages,
        totalConversations: analytics.totalConversations,
        activeConversations: analytics.activeConversations,
        reportedMessages: 24,
        pendingReports: 7,
        averageResponseTime: analytics.averageResponseTime,
        dailyActiveUsers: 156,
        messageGrowth: "+12.3%",
      });

      // Load mock reports
      setReports([
        {
          id: 1,
          messageId: 1234,
          reporterId: 5,
          reporterName: "Emma Wilson",
          reason: "Inappropriate content",
          content:
            "This message contains inappropriate language and harassment.",
          timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
          status: "pending",
          conversationId: 12,
          senderId: 8,
          senderName: "John Smith",
        },
        {
          id: 2,
          messageId: 1235,
          reporterId: 3,
          reporterName: "Sarah Chen",
          reason: "Spam",
          content: "User is sending promotional content repeatedly.",
          timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
          status: "pending",
          conversationId: 15,
          senderId: 9,
          senderName: "Mike Johnson",
        },
        {
          id: 3,
          messageId: 1236,
          reporterId: 7,
          reporterName: "Lisa Park",
          reason: "Harassment",
          content: "Threatening messages and personal attacks.",
          timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
          status: "reviewed",
          conversationId: 18,
          senderId: 11,
          senderName: "Alex Brown",
        },
      ]);

      // Load mock conversations
      setConversations([
        {
          id: 1,
          participantNames: ["Emma Wilson", "John Doe"],
          messageCount: 45,
          lastActivity: new Date(Date.now() - 3600000).toISOString(),
          status: "active",
          reportCount: 0,
        },
        {
          id: 2,
          participantNames: ["Sarah Chen", "Mike Johnson"],
          messageCount: 23,
          lastActivity: new Date(Date.now() - 7200000).toISOString(),
          status: "flagged",
          reportCount: 2,
        },
        {
          id: 3,
          participantNames: ["Lisa Park", "Alex Brown"],
          messageCount: 78,
          lastActivity: new Date(Date.now() - 86400000).toISOString(),
          status: "archived",
          reportCount: 1,
        },
      ]);
    } catch (error) {
      console.error("Failed to load messaging data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportAction = async (
    reportId: number,
    action: "approve" | "dismiss",
  ) => {
    try {
      // Mock API call
      console.log(`${action} report ${reportId}`);

      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId
            ? {
                ...report,
                status: action === "approve" ? "resolved" : "dismissed",
              }
            : report,
        ),
      );
    } catch (error) {
      console.error(`Failed to ${action} report:`, error);
    }
  };

  const handleConversationAction = async (
    conversationId: number,
    action: "archive" | "flag" | "restore",
  ) => {
    try {
      // Mock API call
      console.log(`${action} conversation ${conversationId}`);

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                status:
                  action === "archive"
                    ? "archived"
                    : action === "flag"
                      ? "flagged"
                      : "active",
              }
            : conv,
        ),
      );
    } catch (error) {
      console.error(`Failed to ${action} conversation:`, error);
    }
  };

  const exportData = () => {
    // Mock export functionality
    console.log("Exporting messaging data...");
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.senderName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.participantNames.some((name) =>
      name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    const matchesStatus =
      statusFilter === "all" || conv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Messages
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalMessages.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-green-600">
              {stats.messageGrowth}
            </span>
            <span className="text-sm text-gray-500 ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Conversations
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.activeConversations}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">
              {stats.totalConversations} total conversations
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Reports
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pendingReports}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">
              {stats.reportedMessages} total reports
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Daily Active Users
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.dailyActiveUsers}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">
              Avg response: {stats.averageResponseTime}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              New message report from Emma Wilson
            </span>
            <span className="text-xs text-gray-400">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              Conversation between Sarah and Mike resolved
            </span>
            <span className="text-xs text-gray-400">4 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              High volume of messages detected
            </span>
            <span className="text-xs text-gray-400">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reports..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>

        <button
          onClick={exportData}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">#{report.id}</div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {report.content}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {report.reporterName}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {report.reporterId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {report.senderName}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {report.senderId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{report.reason}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : report.status === "reviewed"
                            ? "bg-blue-100 text-blue-800"
                            : report.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {report.status.charAt(0).toUpperCase() +
                        report.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {report.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleReportAction(report.id, "approve")
                          }
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleReportAction(report.id, "dismiss")
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderConversations = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="flagged">Flagged</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Conversations Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Messages
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reports
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredConversations.map((conversation) => (
                <tr key={conversation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {conversation.participantNames.join(" & ")}
                    </div>
                    <div className="text-sm text-gray-500">
                      Conversation #{conversation.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {conversation.messageCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(conversation.lastActivity).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        conversation.reportCount > 0
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {conversation.reportCount} report
                      {conversation.reportCount !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        conversation.status === "active"
                          ? "bg-green-100 text-green-800"
                          : conversation.status === "flagged"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {conversation.status.charAt(0).toUpperCase() +
                        conversation.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                    {conversation.status === "active" && (
                      <>
                        <button
                          onClick={() =>
                            handleConversationAction(conversation.id, "flag")
                          }
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleConversationAction(conversation.id, "archive")
                          }
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            Messaging Management
          </h1>
          <p className="text-gray-600">
            Monitor and manage platform messaging activity
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "overview", name: "Overview", icon: MessageSquare },
            { id: "reports", name: "Reports", icon: AlertTriangle },
            { id: "conversations", name: "Conversations", icon: Users },
            { id: "analytics", name: "Analytics", icon: Eye },
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
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading messaging data...</p>
        </div>
      ) : (
        <>
          {activeTab === "overview" && renderOverview()}
          {activeTab === "reports" && renderReports()}
          {activeTab === "conversations" && renderConversations()}
          {activeTab === "analytics" && <MessagingAnalytics />}
        </>
      )}
    </div>
  );
};

export default AdminMessaging;
