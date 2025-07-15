// Common UI component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Common form props
export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

// Modal props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

// Loading states
export interface LoadingState {
  loading: boolean;
  error?: string;
  success?: boolean;
}

// Common API response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User context type
export interface UserContextType {
  user: any | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: any) => Promise<boolean | string>;
  logout: () => void;
  isLoading: boolean;
}

// Language context type
export interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

// Filter types
export interface FilterState {
  search: string;
  category: string;
  status: string;
  dateRange: { start: Date; end: Date } | null;
}

// Pagination
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

// Table column definition
export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}
