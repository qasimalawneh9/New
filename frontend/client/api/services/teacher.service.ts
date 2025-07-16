import { apiClient } from "@/services/api";
import { Teacher, TeacherSearchFilters, ApiResponse } from "@/types/api";

export interface AdvancedTeacherSearchFilters extends TeacherSearchFilters {
  search?: string;
  country?: string;
  teaching_experience?: string;
  is_online?: boolean;
  has_video_intro?: boolean;
  certifications?: string[];
  response_time?: string;
  sort_by?: "rating" | "price" | "experience" | "popularity" | "newest";
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface TeacherStats {
  total_teachers: number;
  online_now: number;
  average_rating: number;
  total_lessons: number;
  languages_available: string[];
  countries_available: string[];
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: AdvancedTeacherSearchFilters;
  created_at: string;
  alert_enabled: boolean;
}

export const teacherService = {
  /**
   * Search teachers with advanced filters
   */
  async search(
    filters: AdvancedTeacherSearchFilters,
  ): Promise<ApiResponse<Teacher[]>> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(`${key}[]`, v));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    return apiClient.get<Teacher[]>(`/search/teachers?${queryParams}`);
  },

  /**
   * Get teacher by ID with full profile information
   */
  async getById(id: string): Promise<ApiResponse<Teacher>> {
    return apiClient.get<Teacher>(`/teachers/${id}`);
  },

  /**
   * Get teacher availability for a specific date range
   */
  async getAvailability(
    teacherId: string,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (dateFrom) params.append("date_from", dateFrom);
    if (dateTo) params.append("date_to", dateTo);

    return apiClient.get<any[]>(
      `/teachers/${teacherId}/availability?${params}`,
    );
  },

  /**
   * Get autocomplete suggestions for search
   */
  async getSearchSuggestions(query: string): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>(
      `/search/teachers/suggestions?q=${encodeURIComponent(query)}`,
    );
  },

  /**
   * Get teacher statistics and aggregated data
   */
  async getStats(): Promise<ApiResponse<TeacherStats>> {
    return apiClient.get<TeacherStats>("/teachers/stats");
  },

  /**
   * Get similar teachers based on a teacher ID
   */
  async getSimilar(
    teacherId: string,
    limit = 5,
  ): Promise<ApiResponse<Teacher[]>> {
    return apiClient.get<Teacher[]>(
      `/teachers/${teacherId}/similar?limit=${limit}`,
    );
  },

  /**
   * Get featured/recommended teachers
   */
  async getFeatured(limit = 8): Promise<ApiResponse<Teacher[]>> {
    return apiClient.get<Teacher[]>(`/teachers/featured?limit=${limit}`);
  },

  /**
   * Get trending teachers (most popular recently)
   */
  async getTrending(limit = 6): Promise<ApiResponse<Teacher[]>> {
    return apiClient.get<Teacher[]>(`/teachers/trending?limit=${limit}`);
  },

  /**
   * Save a search for future use
   */
  async saveSearch(
    name: string,
    filters: AdvancedTeacherSearchFilters,
  ): Promise<ApiResponse<SavedSearch>> {
    return apiClient.post<SavedSearch>("/user/saved-searches", {
      name,
      filters,
      type: "teacher",
    });
  },

  /**
   * Get user's saved searches
   */
  async getSavedSearches(): Promise<ApiResponse<SavedSearch[]>> {
    return apiClient.get<SavedSearch[]>("/user/saved-searches?type=teacher");
  },

  /**
   * Delete a saved search
   */
  async deleteSavedSearch(searchId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/user/saved-searches/${searchId}`);
  },

  /**
   * Toggle search alert for new teachers matching criteria
   */
  async toggleSearchAlert(
    searchId: string,
    enabled: boolean,
  ): Promise<ApiResponse<SavedSearch>> {
    return apiClient.patch<SavedSearch>(`/user/saved-searches/${searchId}`, {
      alert_enabled: enabled,
    });
  },

  /**
   * Add teacher to favorites
   */
  async addToFavorites(teacherId: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/user/favorites/teachers/${teacherId}`);
  },

  /**
   * Remove teacher from favorites
   */
  async removeFromFavorites(teacherId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/user/favorites/teachers/${teacherId}`);
  },

  /**
   * Get user's favorite teachers
   */
  async getFavorites(): Promise<ApiResponse<Teacher[]>> {
    return apiClient.get<Teacher[]>("/user/favorites/teachers");
  },

  /**
   * Check if teacher is in favorites
   */
  async isFavorite(
    teacherId: string,
  ): Promise<ApiResponse<{ is_favorite: boolean }>> {
    return apiClient.get<{ is_favorite: boolean }>(
      `/user/favorites/teachers/${teacherId}/check`,
    );
  },

  /**
   * Get recently viewed teachers
   */
  async getRecentlyViewed(limit = 5): Promise<ApiResponse<Teacher[]>> {
    return apiClient.get<Teacher[]>(
      `/user/recently-viewed/teachers?limit=${limit}`,
    );
  },

  /**
   * Track teacher view
   */
  async trackView(teacherId: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/teachers/${teacherId}/view`);
  },

  /**
   * Get teacher reviews with filters
   */
  async getReviews(
    teacherId: string,
    page = 1,
    limit = 10,
    rating?: number,
  ): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (rating) params.append("rating", rating.toString());

    return apiClient.get<any[]>(`/teachers/${teacherId}/reviews?${params}`);
  },

  /**
   * Get teacher's upcoming availability slots
   */
  async getUpcomingSlots(
    teacherId: string,
    days = 7,
    timezone?: string,
  ): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams({
      days: days.toString(),
    });

    if (timezone) params.append("timezone", timezone);

    return apiClient.get<any[]>(
      `/teachers/${teacherId}/upcoming-slots?${params}`,
    );
  },

  /**
   * Check teacher's real-time online status
   */
  async getOnlineStatus(
    teacherId: string,
  ): Promise<ApiResponse<{ is_online: boolean; last_seen?: string }>> {
    return apiClient.get<{ is_online: boolean; last_seen?: string }>(
      `/teachers/${teacherId}/online-status`,
    );
  },

  /**
   * Get bulk online status for multiple teachers
   */
  async getBulkOnlineStatus(
    teacherIds: string[],
  ): Promise<ApiResponse<Record<string, boolean>>> {
    return apiClient.post<Record<string, boolean>>(
      "/teachers/bulk-online-status",
      {
        teacher_ids: teacherIds,
      },
    );
  },

  /**
   * Get teacher's teaching schedule and timezone
   */
  async getSchedule(teacherId: string): Promise<ApiResponse<any>> {
    return apiClient.get<any>(`/teachers/${teacherId}/schedule`);
  },

  /**
   * Get filtering options (dynamic data for filters)
   */
  async getFilterOptions(): Promise<
    ApiResponse<{
      languages: string[];
      countries: string[];
      specializations: string[];
      certifications: string[];
      price_ranges: { min: number; max: number; average: number };
    }>
  > {
    return apiClient.get("/teachers/filter-options");
  },
};
