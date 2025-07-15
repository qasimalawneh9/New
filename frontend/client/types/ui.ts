/**
 * UI Component Types
 *
 * TypeScript interfaces for UI components and their props.
 * These types ensure consistency across all UI components.
 */

import { ReactNode } from "react";

// Base component props
export interface BaseProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  "data-testid"?: string;
}

// Size variants
export type Size = "xs" | "sm" | "md" | "lg" | "xl";

// Color variants
export type ColorVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "default";

// Button types
export interface ButtonProps extends BaseProps {
  variant?: "solid" | "outline" | "ghost" | "link";
  size?: Size;
  color?: ColorVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
}

// Input types
export interface InputProps extends BaseProps {
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  name?: string;
  size?: Size;
  error?: boolean;
  helperText?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

// Select types
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps extends BaseProps {
  options: SelectOption[];
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  size?: Size;
  error?: boolean;
  helperText?: string;
  onChange?: (value: string | number | (string | number)[]) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

// Textarea types
export interface TextareaProps extends BaseProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  rows?: number;
  cols?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";
  autoFocus?: boolean;
  name?: string;
  error?: boolean;
  helperText?: string;
  maxLength?: number;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
}

// Checkbox types
export interface CheckboxProps extends BaseProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  indeterminate?: boolean;
  size?: Size;
  color?: ColorVariant;
  label?: string;
  description?: string;
  name?: string;
  value?: string;
  onChange?: (
    checked: boolean,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

// Radio types
export interface RadioProps extends BaseProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  size?: Size;
  color?: ColorVariant;
  label?: string;
  description?: string;
  name?: string;
  value: string;
  onChange?: (
    value: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

export interface RadioGroupProps extends BaseProps {
  value?: string;
  defaultValue?: string;
  name: string;
  disabled?: boolean;
  required?: boolean;
  orientation?: "horizontal" | "vertical";
  onChange?: (value: string) => void;
}

// Switch types
export interface SwitchProps extends BaseProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  size?: Size;
  color?: ColorVariant;
  label?: string;
  description?: string;
  name?: string;
  onChange?: (
    checked: boolean,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

// Modal types
export interface ModalProps extends BaseProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: Size;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  footer?: ReactNode;
}

// Dialog types
export interface DialogProps extends ModalProps {
  type?: "info" | "warning" | "error" | "success" | "confirm";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

// Alert types
export interface AlertProps extends BaseProps {
  variant?: ColorVariant;
  severity?: "info" | "warning" | "error" | "success";
  title?: string;
  dismissible?: boolean;
  icon?: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
}

// Badge types
export interface BadgeProps extends BaseProps {
  variant?: "solid" | "outline" | "subtle";
  size?: Size;
  color?: ColorVariant;
  rounded?: boolean;
  dot?: boolean;
  content?: string | number;
  max?: number;
  showZero?: boolean;
}

// Avatar types
export interface AvatarProps extends BaseProps {
  src?: string;
  alt?: string;
  size?: Size;
  name?: string;
  fallback?: string;
  shape?: "circle" | "square";
  bordered?: boolean;
  online?: boolean;
  color?: ColorVariant;
}

// Card types
export interface CardProps extends BaseProps {
  variant?: "elevated" | "outlined" | "filled";
  padding?: Size;
  hover?: boolean;
  clickable?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  media?: ReactNode;
  onClick?: () => void;
}

// Tabs types
export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  badge?: string | number;
}

export interface TabsProps extends BaseProps {
  tabs: TabItem[];
  activeTab?: string;
  defaultTab?: string;
  variant?: "line" | "enclosed" | "soft-rounded" | "solid-rounded";
  size?: Size;
  orientation?: "horizontal" | "vertical";
  fitted?: boolean;
  onChange?: (tabId: string) => void;
}

// Dropdown types
export interface DropdownItem {
  id: string;
  label: string;
  value?: any;
  disabled?: boolean;
  divider?: boolean;
  icon?: ReactNode;
  shortcut?: string;
  onClick?: () => void;
}

export interface DropdownProps extends BaseProps {
  trigger: ReactNode;
  items: DropdownItem[];
  placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
  offset?: number;
  disabled?: boolean;
  closeOnSelect?: boolean;
  onSelect?: (item: DropdownItem) => void;
}

// Tooltip types
export interface TooltipProps extends BaseProps {
  content: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  delay?: number;
  disabled?: boolean;
  arrow?: boolean;
}

// Spinner/Loading types
export interface SpinnerProps extends BaseProps {
  size?: Size;
  color?: ColorVariant;
  thickness?: string;
  speed?: string;
  label?: string;
}

// Progress types
export interface ProgressProps extends BaseProps {
  value: number;
  max?: number;
  size?: Size;
  color?: ColorVariant;
  variant?: "determinate" | "indeterminate";
  label?: string;
  showValue?: boolean;
  striped?: boolean;
  animated?: boolean;
}

// Skeleton types
export interface SkeletonProps extends BaseProps {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | false;
}

// Breadcrumb types
export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
  icon?: ReactNode;
}

export interface BreadcrumbProps extends BaseProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  maxItems?: number;
}

// Pagination types
export interface PaginationProps extends BaseProps {
  currentPage: number;
  totalPages: number;
  pageSize?: number;
  totalItems?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showPageSize?: boolean;
  pageSizeOptions?: number[];
  disabled?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

// Table types
export interface TableColumn<T = any> {
  key: keyof T | string;
  header: string;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  sticky?: boolean;
  align?: "left" | "center" | "right";
  render?: (value: any, row: T, index: number) => ReactNode;
}

export interface TableProps<T = any> extends BaseProps {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  empty?: ReactNode;
  rowKey?: keyof T | ((row: T) => string);
  selectable?: boolean;
  selectedRows?: string[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  striped?: boolean;
  bordered?: boolean;
  hover?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  onRowSelect?: (selectedRows: string[]) => void;
  onRowClick?: (row: T, index: number) => void;
  onSort?: (column: string, order: "asc" | "desc") => void;
}

// Form types
export interface FormFieldError {
  message: string;
  code?: string;
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, FormFieldError>;
  touched: Record<string, boolean>;
  dirty: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
}

export interface FormProps extends BaseProps {
  initialValues?: Record<string, any>;
  validationSchema?: any;
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  onReset?: () => void;
  onChange?: (values: Record<string, any>) => void;
}

// Navigation types
export interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  badge?: string | number;
  active?: boolean;
  disabled?: boolean;
  children?: NavItem[];
  onClick?: () => void;
}

export interface NavigationProps extends BaseProps {
  items: NavItem[];
  variant?: "sidebar" | "topbar" | "tabs" | "breadcrumb";
  orientation?: "horizontal" | "vertical";
  collapsed?: boolean;
  onItemClick?: (item: NavItem) => void;
}

// Layout types
export interface LayoutProps extends BaseProps {
  header?: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  fullHeight?: boolean;
}

// Grid types
export interface GridProps extends BaseProps {
  columns?: number | Record<string, number>;
  gap?: string | number;
  alignItems?: "start" | "center" | "end" | "stretch";
  justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
}

// Stack types
export interface StackProps extends BaseProps {
  direction?: "row" | "column";
  spacing?: string | number;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
  divider?: ReactNode;
}

// Image types
export interface ImageProps extends BaseProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  loading?: "lazy" | "eager";
  fallback?: ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

// Video types
export interface VideoProps extends BaseProps {
  src: string;
  poster?: string;
  width?: string | number;
  height?: string | number;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  preload?: "none" | "metadata" | "auto";
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

// Date picker types
export interface DatePickerProps extends BaseProps {
  value?: Date;
  defaultValue?: Date;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  format?: string;
  size?: Size;
  error?: boolean;
  helperText?: string;
  showTime?: boolean;
  onChange?: (date: Date | null) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

// File upload types
export interface FileUploadProps extends BaseProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  preview?: boolean;
  dragAndDrop?: boolean;
  error?: boolean;
  helperText?: string;
  onFileSelect?: (files: File[]) => void;
  onFileRemove?: (file: File) => void;
  onError?: (error: string) => void;
}

// Search types
export interface SearchProps extends BaseProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  clearable?: boolean;
  suggestions?: string[];
  size?: Size;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  onSuggestionSelect?: (suggestion: string) => void;
}

// Rating types
export interface RatingProps extends BaseProps {
  value?: number;
  max?: number;
  precision?: number;
  size?: Size;
  color?: ColorVariant;
  readonly?: boolean;
  disabled?: boolean;
  showValue?: boolean;
  icon?: ReactNode;
  emptyIcon?: ReactNode;
  onChange?: (value: number) => void;
}

// Color picker types
export interface ColorPickerProps extends BaseProps {
  value?: string;
  defaultValue?: string;
  format?: "hex" | "rgb" | "hsl";
  disabled?: boolean;
  size?: Size;
  presets?: string[];
  onChange?: (color: string) => void;
}

// Code editor types
export interface CodeEditorProps extends BaseProps {
  value?: string;
  defaultValue?: string;
  language?: string;
  theme?: "light" | "dark";
  readonly?: boolean;
  disabled?: boolean;
  lineNumbers?: boolean;
  wordWrap?: boolean;
  tabSize?: number;
  minimap?: boolean;
  height?: string | number;
  onChange?: (value: string) => void;
}

// Export all types
export type {
  // Base
  BaseProps,
  Size,
  ColorVariant,

  // Form controls
  ButtonProps,
  InputProps,
  SelectProps,
  SelectOption,
  TextareaProps,
  CheckboxProps,
  RadioProps,
  RadioGroupProps,
  SwitchProps,

  // Feedback
  AlertProps,
  ModalProps,
  DialogProps,
  TooltipProps,

  // Display
  BadgeProps,
  AvatarProps,
  CardProps,
  ImageProps,
  VideoProps,

  // Navigation
  TabsProps,
  TabItem,
  DropdownProps,
  DropdownItem,
  BreadcrumbProps,
  BreadcrumbItem,
  NavigationProps,
  NavItem,

  // Data display
  TableProps,
  TableColumn,
  PaginationProps,

  // Layout
  LayoutProps,
  GridProps,
  StackProps,

  // Progress
  SpinnerProps,
  ProgressProps,
  SkeletonProps,

  // Form
  FormProps,
  FormState,
  FormFieldError,

  // Specialized
  DatePickerProps,
  FileUploadProps,
  SearchProps,
  RatingProps,
  ColorPickerProps,
  CodeEditorProps,
};
