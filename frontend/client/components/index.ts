// Layout components
export { PageLayout, DashboardLayout } from "./layout/PageLayout";

// Common components
export { Form, FormField, FormActions } from "./common/Form";
export { Modal } from "./common/Modal";
export { Loading, LoadingButton } from "./common/Loading";
export { DashboardTemplate, StatCard } from "./common/DashboardTemplate";

// Hooks
export { useCommon, useLoading, useModal } from "../hooks/useCommon";

// Utils
export {
  cn,
  formatCurrency,
  formatDate,
  formatTimeAgo,
  generateId,
  isValidEmail,
  capitalize,
  truncate,
  debounce,
  safeJsonParse,
  getInitials,
  chunk,
  sleep,
} from "../lib/utils";

// API
export { api, apiWrapper } from "../lib/api";

// Constants
export * from "../lib/constants";

// Types
export * from "../types/common";

// Configurations
export * from "../config/components";
