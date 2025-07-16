/**
 * Support Service
 *
 * Handles all support-related API calls
 * Maps to Node.js Express SupportController
 */

import { BaseApiService } from "../base.service";
import { SUPPORT_ENDPOINTS } from "../endpoints";

// Support types
export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category:
    | "booking_issues"
    | "payment_issues"
    | "technical_issues"
    | "inappropriate_behavior"
    | "general";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  messages: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  content: string;
  isStaff: boolean;
  attachments?: SupportAttachment[];
  createdAt: string;
}

export interface SupportAttachment {
  id: string;
  messageId: string;
  name: string;
  url: string;
  size: number;
  type: string;
  createdAt: string;
}

export interface CreateTicketData {
  title: string;
  description: string;
  category: SupportTicket["category"];
  priority: SupportTicket["priority"];
}

export interface SupportCategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * SupportService class
 *
 * Usage Example:
 * ```typescript
 * const supportService = new SupportService();
 *
 * // Get user tickets
 * const tickets = await supportService.getTickets();
 *
 * // Create new ticket
 * const ticket = await supportService.createTicket({
 *   title: "Payment issue",
 *   description: "Unable to process payment",
 *   category: "payment_issues",
 *   priority: "medium"
 * });
 * ```
 */
export class SupportService extends BaseApiService {
  /**
   * Get user's support tickets
   * GET /api/support/tickets → SupportController@getTickets
   */
  async getTickets(params?: {
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: SupportTicket[]; meta: any }> {
    const response = await this.get<{
      success: boolean;
      data: SupportTicket[];
      meta: any;
    }>(SUPPORT_ENDPOINTS.TICKETS, params);
    return { data: response.data.data, meta: response.data.meta };
  }

  /**
   * Create new support ticket
   * POST /api/support/tickets → SupportController@createTicket
   */
  async createTicket(ticketData: CreateTicketData): Promise<SupportTicket> {
    const response = await this.post<{ success: boolean; data: SupportTicket }>(
      SUPPORT_ENDPOINTS.CREATE_TICKET,
      ticketData,
    );
    return response.data.data;
  }

  /**
   * Get specific ticket details
   * GET /api/support/tickets/:id → SupportController@getTicket
   */
  async getTicket(id: string): Promise<SupportTicket> {
    const response = await this.get<{ success: boolean; data: SupportTicket }>(
      SUPPORT_ENDPOINTS.SHOW_TICKET.replace(":id", id),
    );
    return response.data.data;
  }

  /**
   * Update ticket details
   * PUT /api/support/tickets/:id → SupportController@updateTicket
   */
  async updateTicket(
    id: string,
    updates: Partial<SupportTicket>,
  ): Promise<SupportTicket> {
    const response = await this.put<{ success: boolean; data: SupportTicket }>(
      SUPPORT_ENDPOINTS.UPDATE_TICKET.replace(":id", id),
      updates,
    );
    return response.data.data;
  }

  /**
   * Close support ticket
   * POST /api/support/tickets/:id/close → SupportController@closeTicket
   */
  async closeTicket(id: string, reason?: string): Promise<{ message: string }> {
    const response = await this.post<{ success: boolean; message: string }>(
      SUPPORT_ENDPOINTS.CLOSE_TICKET.replace(":id", id),
      { reason },
    );
    return { message: response.data.message };
  }

  /**
   * Add message to ticket
   * POST /api/support/tickets/:id/messages → SupportController@addMessage
   */
  async addMessage(
    ticketId: string,
    content: string,
    attachments?: File[],
  ): Promise<SupportMessage> {
    const formData = new FormData();
    formData.append("content", content);

    if (attachments && attachments.length > 0) {
      attachments.forEach((file, index) => {
        formData.append(`attachments`, file);
      });
    }

    const response = await this.post<{
      success: boolean;
      data: SupportMessage;
    }>(
      SUPPORT_ENDPOINTS.ADD_MESSAGE.replace(":id", ticketId),
      formData,
      true, // requires auth
      {
        "Content-Type": "multipart/form-data",
      },
    );
    return response.data.data;
  }

  /**
   * Upload attachment to ticket
   * POST /api/support/tickets/:id/attachments → SupportController@uploadAttachment
   */
  async uploadAttachment(
    ticketId: string,
    file: File,
  ): Promise<SupportAttachment> {
    const formData = new FormData();
    formData.append("attachment", file);

    const response = await this.post<{
      success: boolean;
      data: SupportAttachment;
    }>(
      SUPPORT_ENDPOINTS.UPLOAD_ATTACHMENT.replace(":id", ticketId),
      formData,
      true, // requires auth
      {
        "Content-Type": "multipart/form-data",
      },
    );
    return response.data.data;
  }

  /**
   * Get FAQ items
   * GET /api/support/faq → SupportController@getFAQ
   */
  async getFAQ(params?: {
    category?: string;
    search?: string;
  }): Promise<FAQItem[]> {
    const response = await this.get<{ success: boolean; data: FAQItem[] }>(
      SUPPORT_ENDPOINTS.FAQ,
      params,
      false, // no auth required for public FAQ
    );
    return response.data.data;
  }

  /**
   * Get support categories
   * GET /api/support/categories → SupportController@getCategories
   */
  async getCategories(): Promise<SupportCategory[]> {
    const response = await this.get<{
      success: boolean;
      data: SupportCategory[];
    }>(
      SUPPORT_ENDPOINTS.CATEGORIES,
      undefined,
      false, // no auth required for public categories
    );
    return response.data.data;
  }

  /**
   * Search tickets (authenticated users only)
   */
  async searchTickets(
    query: string,
    filters?: {
      status?: string;
      category?: string;
      dateFrom?: string;
      dateTo?: string;
    },
  ): Promise<SupportTicket[]> {
    const params = {
      search: query,
      ...filters,
    };

    const response = await this.get<{
      success: boolean;
      data: SupportTicket[];
    }>(SUPPORT_ENDPOINTS.TICKETS, params);
    return response.data.data;
  }

  /**
   * Get ticket statistics for user
   */
  async getTicketStats(): Promise<{
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
    avgResponseTime: number;
  }> {
    try {
      const tickets = await this.getTickets();
      const ticketData = tickets.data;

      const stats = {
        total: ticketData.length,
        open: ticketData.filter((t) => t.status === "open").length,
        inProgress: ticketData.filter((t) => t.status === "in_progress").length,
        resolved: ticketData.filter((t) => t.status === "resolved").length,
        closed: ticketData.filter((t) => t.status === "closed").length,
        avgResponseTime: 24, // Mock average response time in hours
      };

      return stats;
    } catch (error) {
      // Return default stats if API call fails
      return {
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0,
        avgResponseTime: 0,
      };
    }
  }
}

// Export singleton instance
export const supportService = new SupportService();
