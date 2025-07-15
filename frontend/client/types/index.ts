/**
 * Type Definitions Index
 *
 * This file exports all type definitions for easy importing throughout the application.
 * It serves as a single source of truth for all TypeScript types.
 */

// Re-export all API types
export * from "./api";

// Re-export UI component types
export * from "./ui";

// Re-export form types
export * from "./forms";

// Legacy type exports (for backward compatibility)
// These will be gradually migrated to the new API types
export type { User as LegacyUser } from "./models";
export type { User as LaravelUser } from "./laravel-api";
export type { User as PlatformUser } from "./platform";

// Common utility types
export interface LoadingState {
  loading: boolean;
  error?: string;
  success?: boolean;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev?: string;
  next?: string;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Form field types
export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

// Modal types
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

// Table types
export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: PaginationMeta;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  onFilter?: (filters: Record<string, any>) => void;
  onPageChange?: (page: number) => void;
}

// Chart types
export interface ChartDataPoint {
  name: string;
  value: number;
  label?: string;
  color?: string;
}

export interface ChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  title?: string;
  legend?: boolean;
  colors?: string[];
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  [key: string]: any;
}

// Navigation types
export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
  active?: boolean;
  disabled?: boolean;
  children?: NavigationItem[];
}

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
}

export interface Theme {
  colors: ThemeColors;
  spacing: Record<string, string>;
  typography: Record<string, any>;
  breakpoints: Record<string, string>;
}

// Event types
export interface CustomEvent<T = any> {
  type: string;
  payload: T;
  timestamp: number;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Function types
export type EventHandler<T = any> = (event: T) => void;
export type AsyncEventHandler<T = any> = (event: T) => Promise<void>;
export type ValueChangeHandler<T = any> = (value: T) => void;

// Generic CRUD types
export interface CrudOperations<T, CreateT = Partial<T>, UpdateT = Partial<T>> {
  create: (data: CreateT) => Promise<T>;
  read: (id: string) => Promise<T>;
  update: (id: string, data: UpdateT) => Promise<T>;
  delete: (id: string) => Promise<void>;
  list: (filters?: SearchFilters) => Promise<T[]>;
}

// Error types
export interface ErrorDetails {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// File types
export interface FileUpload {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
  url?: string;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

// Permission types
export type Permission = string;
export type Role = "student" | "teacher" | "admin";

export interface PermissionCheck {
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
}

// Internationalization types
export interface TranslationFunction {
  (key: string, params?: Record<string, any>): string;
}

export interface LocaleConfig {
  code: string;
  name: string;
  direction: "ltr" | "rtl";
  flag?: string;
}

// Analytics types
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

export interface AnalyticsData {
  events: AnalyticsEvent[];
  users: number;
  sessions: number;
  pageViews: number;
  conversionRate: number;
}

// Notification types
export interface NotificationConfig {
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: "primary" | "secondary";
}

// Toast types (extends notification)
export interface ToastConfig extends NotificationConfig {
  id?: string;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

// WebSocket types
export interface WebSocketMessage<T = any> {
  type: string;
  payload: T;
  id?: string;
  timestamp: number;
}

export interface WebSocketConnection {
  connected: boolean;
  reconnecting: boolean;
  send: <T>(message: WebSocketMessage<T>) => void;
  close: () => void;
}

// Storage types
export interface StorageAdapter {
  get: <T>(key: string) => T | null;
  set: <T>(key: string, value: T) => boolean;
  remove: (key: string) => boolean;
  clear: () => boolean;
  has: (key: string) => boolean;
}

// Configuration types
export interface AppConfig {
  apiUrl: string;
  environment: "development" | "staging" | "production";
  features: Record<string, boolean>;
  thirdParty: Record<string, any>;
  limits: Record<string, number>;
}

// Import and re-export commonly used types for convenience
import type {
  User,
  Teacher,
  Student,
  Lesson,
  Booking,
  Review,
  Message,
  ApiResponse,
  PaginatedResponse,
} from "./api";

// Export commonly used types
export type {
  User,
  Teacher,
  Student,
  Lesson,
  Booking,
  Review,
  Message,
  ApiResponse,
  PaginatedResponse,
};
