/**
 * Base API Service Class
 *
 * This class provides common functionality for all API services
 * and handles communication with the Laravel backend.
 */

import {
  API_CONFIG,
  ApiResponse,
  PaginatedResponse,
  ValidationErrorResponse,
  RequestConfig,
  buildHeaders,
  buildUrl,
  buildQueryString,
  getAuthToken,
} from "./config";

export class ApiError extends Error {
  public status: number;
  public validationErrors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    validationErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.validationErrors = validationErrors;
  }
}

export abstract class BaseApiService {
  protected baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Make HTTP request to Laravel API
   */
  protected async makeRequest<T = any>(
    config: RequestConfig,
  ): Promise<ApiResponse<T>> {
    const { method, url, data, params, headers, requiresAuth = true } = config;

    // Check authentication if required
    if (requiresAuth && !getAuthToken()) {
      throw new ApiError("Authentication required", 401);
    }

    // Build full URL
    const fullUrl = buildUrl(url) + (params ? buildQueryString(params) : "");

    // Build headers
    const requestHeaders = buildHeaders(headers);

    // Configure request
    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    };

    // Add body for POST/PUT/PATCH requests
    if (data && ["POST", "PUT", "PATCH"].includes(method)) {
      if (data instanceof FormData) {
        // Remove Content-Type for FormData (browser will set it with boundary)
        delete requestHeaders["Content-Type"];
        requestConfig.body = data;
      } else {
        requestConfig.body = JSON.stringify(data);
      }
    }

    try {
      const response = await fetch(fullUrl, requestConfig);
      const responseData = await this.handleResponse<T>(response);

      return responseData;
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }

  /**
   * Handle API response and errors
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("Content-Type");
    const isJsonResponse = contentType?.includes("application/json");

    let data: any = null;

    if (isJsonResponse) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Handle Laravel validation errors
      if (response.status === 422 && data.errors) {
        const validationError = data as ValidationErrorResponse;
        throw new ApiError(
          validationError.message,
          response.status,
          validationError.errors,
        );
      }

      // Handle other errors
      const message = data?.message || `HTTP Error: ${response.status}`;
      throw new ApiError(message, response.status);
    }

    return {
      data: data?.data || data,
      message: data?.message,
      status: response.status,
      success: response.ok,
    };
  }

  /**
   * GET request
   */
  protected async get<T = any>(
    url: string,
    params?: Record<string, any>,
    requiresAuth: boolean = true,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: "GET",
      url,
      params,
      requiresAuth,
    });
  }

  /**
   * POST request
   */
  protected async post<T = any>(
    url: string,
    data?: any,
    requiresAuth: boolean = true,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: "POST",
      url,
      data,
      requiresAuth,
    });
  }

  /**
   * PUT request
   */
  protected async put<T = any>(
    url: string,
    data?: any,
    requiresAuth: boolean = true,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: "PUT",
      url,
      data,
      requiresAuth,
    });
  }

  /**
   * PATCH request
   */
  protected async patch<T = any>(
    url: string,
    data?: any,
    requiresAuth: boolean = true,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: "PATCH",
      url,
      data,
      requiresAuth,
    });
  }

  /**
   * DELETE request
   */
  protected async delete<T = any>(
    url: string,
    requiresAuth: boolean = true,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: "DELETE",
      url,
      requiresAuth,
    });
  }

  /**
   * Handle paginated responses
   */
  protected async getPaginated<T = any>(
    url: string,
    params?: Record<string, any>,
    requiresAuth: boolean = true,
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    return this.get<PaginatedResponse<T>>(url, params, requiresAuth);
  }

  /**
   * Upload file
   */
  protected async uploadFile<T = any>(
    url: string,
    file: File,
    additionalData?: Record<string, any>,
    requiresAuth: boolean = true,
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    return this.makeRequest<T>({
      method: "POST",
      url,
      data: formData,
      requiresAuth,
    });
  }
}
