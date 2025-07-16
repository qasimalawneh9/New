import { BaseApiService } from "../base.service";
import { Message, Conversation, Attachment, User } from "../../types/platform";

export interface SendMessageRequest {
  receiverId: number;
  content: string;
  type?: "text" | "file" | "system";
  attachments?: File[];
}

export interface CreateConversationRequest {
  participantIds: number[];
  title?: string;
  type?: "direct" | "group";
}

export interface ConversationListResponse {
  conversations: Conversation[];
  total: number;
}

export interface MessagesResponse {
  messages: Message[];
  total: number;
  hasMore: boolean;
}

export interface MessageAnalytics {
  totalMessages: number;
  totalConversations: number;
  activeConversations: number;
  unreadCount: number;
  averageResponseTime: string;
  messagesByType: Record<string, number>;
  messagesByDay: Array<{ date: string; count: number }>;
}

export interface OnlineStatus {
  userId: number;
  isOnline: boolean;
  lastSeen: string;
}

class MessagingService {
  // Conversation Management
  async getConversations(
    page = 1,
    limit = 20,
    search?: string,
  ): Promise<ConversationListResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await apiClient.get(`/conversations?${params}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      // Fallback to local data
      return this.getMockConversations();
    }
  }

  async getConversation(conversationId: number): Promise<Conversation> {
    try {
      const response = await apiClient.get(`/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch conversation:", error);
      throw error;
    }
  }

  async createConversation(
    data: CreateConversationRequest,
  ): Promise<Conversation> {
    try {
      const response = await apiClient.post("/conversations", data);
      return response.data;
    } catch (error) {
      console.error("Failed to create conversation:", error);
      throw error;
    }
  }

  async deleteConversation(conversationId: number): Promise<void> {
    try {
      await apiClient.delete(`/conversations/${conversationId}`);
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      throw error;
    }
  }

  // Message Management
  async getMessages(
    conversationId: number,
    page = 1,
    limit = 50,
  ): Promise<MessagesResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await apiClient.get(
        `/conversations/${conversationId}/messages?${params}`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      // Fallback to mock data
      return this.getMockMessages(conversationId);
    }
  }

  async sendMessage(data: SendMessageRequest): Promise<Message> {
    try {
      const formData = new FormData();
      formData.append("receiverId", data.receiverId.toString());
      formData.append("content", data.content);
      formData.append("type", data.type || "text");

      if (data.attachments && data.attachments.length > 0) {
        data.attachments.forEach((file, index) => {
          formData.append(`attachments[${index}]`, file);
        });
      }

      const response = await apiClient.post("/messages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  }

  async editMessage(messageId: number, content: string): Promise<Message> {
    try {
      const response = await apiClient.put(`/messages/${messageId}`, {
        content,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to edit message:", error);
      throw error;
    }
  }

  async deleteMessage(messageId: number): Promise<void> {
    try {
      await apiClient.delete(`/messages/${messageId}`);
    } catch (error) {
      console.error("Failed to delete message:", error);
      throw error;
    }
  }

  async markAsRead(conversationId: number): Promise<void> {
    try {
      await apiClient.post(`/conversations/${conversationId}/read`);
    } catch (error) {
      console.error("Failed to mark conversation as read:", error);
    }
  }

  async searchMessages(
    query: string,
    conversationId?: number,
  ): Promise<Message[]> {
    try {
      const params = new URLSearchParams({
        query,
        ...(conversationId && { conversationId: conversationId.toString() }),
      });

      const response = await apiClient.get(`/messages/search?${params}`);
      return response.data;
    } catch (error) {
      console.error("Failed to search messages:", error);
      return [];
    }
  }

  // File and Attachment Management
  async uploadAttachment(file: File, messageId?: number): Promise<Attachment> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (messageId) {
        formData.append("messageId", messageId.toString());
      }

      const response = await apiClient.post("/attachments", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to upload attachment:", error);
      throw error;
    }
  }

  async getAttachment(attachmentId: number): Promise<Blob> {
    try {
      const response = await apiClient.get(`/attachments/${attachmentId}`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Failed to get attachment:", error);
      throw error;
    }
  }

  async deleteAttachment(attachmentId: number): Promise<void> {
    try {
      await apiClient.delete(`/attachments/${attachmentId}`);
    } catch (error) {
      console.error("Failed to delete attachment:", error);
      throw error;
    }
  }

  // User Status and Presence
  async getOnlineUsers(): Promise<OnlineStatus[]> {
    try {
      const response = await apiClient.get("/users/online");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch online users:", error);
      return [];
    }
  }

  async updateOnlineStatus(isOnline: boolean): Promise<void> {
    try {
      await apiClient.post("/users/status", { isOnline });
    } catch (error) {
      console.error("Failed to update online status:", error);
    }
  }

  async getUserStatus(userId: number): Promise<OnlineStatus> {
    try {
      const response = await apiClient.get(`/users/${userId}/status`);
      return response.data;
    } catch (error) {
      console.error("Failed to get user status:", error);
      throw error;
    }
  }

  // Analytics and Reporting
  async getMessageAnalytics(
    timeframe: "week" | "month" | "year" = "month",
  ): Promise<MessageAnalytics> {
    try {
      const response = await apiClient.get(
        `/messages/analytics?timeframe=${timeframe}`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch message analytics:", error);
      // Return mock analytics
      return this.getMockAnalytics();
    }
  }

  async reportMessage(messageId: number, reason: string): Promise<void> {
    try {
      await apiClient.post(`/messages/${messageId}/report`, { reason });
    } catch (error) {
      console.error("Failed to report message:", error);
      throw error;
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await apiClient.get("/messages/unread-count");
      return response.data.count;
    } catch (error) {
      console.error("Failed to get unread count:", error);
      return 0;
    }
  }

  // Real-time Features
  async startTyping(conversationId: number): Promise<void> {
    try {
      await apiClient.post(`/conversations/${conversationId}/typing/start`);
    } catch (error) {
      console.error("Failed to start typing indicator:", error);
    }
  }

  async stopTyping(conversationId: number): Promise<void> {
    try {
      await apiClient.post(`/conversations/${conversationId}/typing/stop`);
    } catch (error) {
      console.error("Failed to stop typing indicator:", error);
    }
  }

  // Mock Data Methods (fallbacks)
  private getMockConversations(): ConversationListResponse {
    const mockConversations: Conversation[] = [
      {
        id: 1,
        participants: [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            avatar: "/api/placeholder/40/40",
          },
          {
            id: 2,
            name: "Emma Wilson",
            email: "emma@example.com",
            avatar: "/api/placeholder/40/40",
          },
        ],
        lastMessage: {
          id: 1,
          senderId: 2,
          content: "Great lesson today! Looking forward to the next one.",
          timestamp: new Date().toISOString(),
          type: "text",
          isRead: false,
        },
        unreadCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        participants: [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            avatar: "/api/placeholder/40/40",
          },
          {
            id: 3,
            name: "Sarah Chen",
            email: "sarah@example.com",
            avatar: "/api/placeholder/40/40",
          },
        ],
        lastMessage: {
          id: 2,
          senderId: 1,
          content: "Thanks for the lesson materials!",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: "text",
          isRead: true,
        },
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return {
      conversations: mockConversations,
      total: mockConversations.length,
    };
  }

  private getMockMessages(conversationId: number): MessagesResponse {
    const mockMessages: Message[] = [
      {
        id: 1,
        senderId: 2,
        content: "Hello! Ready for today's lesson?",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        type: "text",
        isRead: true,
      },
      {
        id: 2,
        senderId: 1,
        content: "Yes, I'm excited!",
        timestamp: new Date(Date.now() - 7000000).toISOString(),
        type: "text",
        isRead: true,
      },
      {
        id: 3,
        senderId: 2,
        content: "Great lesson today! Looking forward to the next one.",
        timestamp: new Date().toISOString(),
        type: "text",
        isRead: false,
      },
    ];

    return {
      messages: mockMessages,
      total: mockMessages.length,
      hasMore: false,
    };
  }

  private getMockAnalytics(): MessageAnalytics {
    return {
      totalMessages: 1543,
      totalConversations: 87,
      activeConversations: 23,
      unreadCount: 7,
      averageResponseTime: "2h 15m",
      messagesByType: {
        text: 1321,
        file: 198,
        system: 24,
      },
      messagesByDay: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
        count: Math.floor(Math.random() * 50) + 10,
      })),
    };
  }
}

export const messagingService = new MessagingService();
