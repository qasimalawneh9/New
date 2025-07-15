/**
 * Booking Service
 *
 * Handles all booking-related API calls
 * Maps to Laravel BookingController
 */

import { BaseApiService } from "../base.service";
import { BOOKING_ENDPOINTS } from "../endpoints";
import { PaginatedResponse, replaceUrlParams } from "../endpoints";

// Data models
export interface Booking {
  id: string;
  teacher_id: string;
  student_id: string;
  lesson_type: "individual" | "group";
  duration: number; // in minutes
  price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  scheduled_at: string;
  notes?: string;
  meeting_url?: string;
  created_at: string;
  updated_at: string;
  // Relationships
  teacher?: Teacher;
  student?: Student;
  payment?: Payment;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  hourly_rate: number;
  rating: number;
  languages: string[];
  specialties: string[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Payment {
  id: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  payment_method: string;
}

// Request types
export interface CreateBookingData {
  teacher_id: string;
  lesson_type: "individual" | "group";
  duration: number;
  scheduled_at: string;
  notes?: string;
  package_quantity?: number; // for package bookings
}

export interface UpdateBookingData {
  scheduled_at?: string;
  notes?: string;
  status?: "confirmed" | "cancelled";
}

export interface BookingFilters {
  teacher_id?: string;
  student_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  lesson_type?: string;
  page?: number;
  per_page?: number;
}

export interface PaymentData {
  payment_method: "wallet" | "paypal" | "stripe";
  payment_details?: Record<string, any>;
}

export interface RefundData {
  reason: string;
  amount?: number; // partial refund amount
}

/**
 * BookingService class
 *
 * Usage Example:
 * ```typescript
 * const bookingService = new BookingService();
 *
 * // Create booking
 * const booking = await bookingService.createBooking({
 *   teacher_id: '123',
 *   lesson_type: 'individual',
 *   duration: 60,
 *   scheduled_at: '2025-01-15T10:00:00Z'
 * });
 *
 * // Get user bookings
 * const bookings = await bookingService.getBookings({
 *   status: 'confirmed',
 *   page: 1
 * });
 * ```
 */
export class BookingService extends BaseApiService {
  /**
   * Get bookings with filters
   * GET /api/bookings → BookingController@index
   */
  async getBookings(
    filters?: BookingFilters,
  ): Promise<PaginatedResponse<Booking>> {
    const response = await this.getPaginated<Booking>(
      BOOKING_ENDPOINTS.INDEX,
      filters,
    );

    return response.data;
  }

  /**
   * Get booking by ID
   * GET /api/bookings/:id → BookingController@show
   */
  async getBooking(id: string): Promise<Booking> {
    const url = replaceUrlParams(BOOKING_ENDPOINTS.SHOW, { id });
    const response = await this.get<Booking>(url);

    return response.data;
  }

  /**
   * Create new booking
   * POST /api/bookings → BookingController@store
   */
  async createBooking(data: CreateBookingData): Promise<Booking> {
    const response = await this.post<Booking>(BOOKING_ENDPOINTS.STORE, {
      ...data,
      // Add client-side metadata
      created_from: "web_client",
      browser_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    return response.data;
  }

  /**
   * Update booking
   * PUT /api/bookings/:id → BookingController@update
   */
  async updateBooking(id: string, data: UpdateBookingData): Promise<Booking> {
    const url = replaceUrlParams(BOOKING_ENDPOINTS.UPDATE, { id });
    const response = await this.put<Booking>(url, data);

    return response.data;
  }

  /**
   * Cancel booking
   * DELETE /api/bookings/:id → BookingController@destroy
   */
  async cancelBooking(id: string): Promise<void> {
    const url = replaceUrlParams(BOOKING_ENDPOINTS.DESTROY, { id });
    await this.delete(url);
  }

  /**
   * Confirm booking
   * POST /api/bookings/:id/confirm → BookingController@confirm
   */
  async confirmBooking(id: string): Promise<Booking> {
    const url = replaceUrlParams(BOOKING_ENDPOINTS.CONFIRM, { id });
    const response = await this.post<Booking>(url);

    return response.data;
  }

  /**
   * Process payment for booking
   * POST /api/bookings/:id/payment → BookingController@payment
   */
  async processPayment(id: string, paymentData: PaymentData): Promise<Payment> {
    const url = replaceUrlParams(BOOKING_ENDPOINTS.PAYMENT, { id });
    const response = await this.post<Payment>(url, paymentData);

    return response.data;
  }

  /**
   * Request refund for booking
   * POST /api/bookings/:id/refund → BookingController@refund
   */
  async requestRefund(id: string, refundData: RefundData): Promise<void> {
    const url = replaceUrlParams(BOOKING_ENDPOINTS.REFUND, { id });
    await this.post(url, refundData);
  }

  /**
   * Get booking availability for teacher
   * This method combines multiple API calls for better UX
   */
  async getTeacherAvailability(
    teacherId: string,
    dateRange: { from: string; to: string },
  ): Promise<{
    available_slots: Array<{
      start_time: string;
      end_time: string;
      duration_options: number[];
    }>;
    busy_slots: Array<{
      start_time: string;
      end_time: string;
    }>;
  }> {
    // This would be a custom endpoint in Laravel
    const response = await this.get(`/teachers/${teacherId}/availability`, {
      date_from: dateRange.from,
      date_to: dateRange.to,
    });

    return response.data;
  }

  /**
   * Calculate booking price
   * This method calculates price client-side but should validate with backend
   */
  async calculatePrice(data: {
    teacher_id: string;
    lesson_type: "individual" | "group";
    duration: number;
    package_quantity?: number;
  }): Promise<{
    base_price: number;
    total_price: number;
    tax_amount: number;
    commission_amount: number;
    teacher_earnings: number;
  }> {
    const response = await this.post("/bookings/calculate-price", data);
    return response.data;
  }
}

// Export singleton instance
export const bookingService = new BookingService();
