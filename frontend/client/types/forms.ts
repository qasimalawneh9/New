/**
 * Form Types and Validation
 *
 * TypeScript interfaces for forms, validation, and form field types.
 * These types provide structure for all form-related functionality.
 */

// Base form field types
export interface BaseFormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  description?: string;
  defaultValue?: any;
}

// Validation rule types
export interface ValidationRule {
  type: "required" | "email" | "min" | "max" | "pattern" | "custom";
  value?: any;
  message: string;
}

export interface FieldValidation {
  rules: ValidationRule[];
  validateOn?: "change" | "blur" | "submit";
}

// Form field configurations
export interface TextFieldConfig extends BaseFormField {
  type: "text" | "email" | "password" | "url" | "tel";
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  autoComplete?: string;
}

export interface NumberFieldConfig extends BaseFormField {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
}

export interface TextareaFieldConfig extends BaseFormField {
  type: "textarea";
  rows?: number;
  minLength?: number;
  maxLength?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

export interface SelectFieldConfig extends BaseFormField {
  type: "select";
  options: SelectOption[];
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
  description?: string;
}

export interface CheckboxFieldConfig extends BaseFormField {
  type: "checkbox";
  options?: CheckboxOption[];
}

export interface CheckboxOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface RadioFieldConfig extends BaseFormField {
  type: "radio";
  options: RadioOption[];
  orientation?: "horizontal" | "vertical";
}

export interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface DateFieldConfig extends BaseFormField {
  type: "date" | "datetime" | "time";
  minDate?: Date;
  maxDate?: Date;
  format?: string;
  showTime?: boolean;
}

export interface FileFieldConfig extends BaseFormField {
  type: "file";
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  preview?: boolean;
}

export interface SwitchFieldConfig extends BaseFormField {
  type: "switch";
  size?: "sm" | "md" | "lg";
}

export interface RatingFieldConfig extends BaseFormField {
  type: "rating";
  max?: number;
  precision?: number;
  allowHalf?: boolean;
}

export interface ColorFieldConfig extends BaseFormField {
  type: "color";
  format?: "hex" | "rgb" | "hsl";
  presets?: string[];
}

export interface RangeFieldConfig extends BaseFormField {
  type: "range";
  min: number;
  max: number;
  step?: number;
  marks?: RangeMark[];
}

export interface RangeMark {
  value: number;
  label?: string;
}

// Union type for all field configurations
export type FormFieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | TextareaFieldConfig
  | SelectFieldConfig
  | CheckboxFieldConfig
  | RadioFieldConfig
  | DateFieldConfig
  | FileFieldConfig
  | SwitchFieldConfig
  | RatingFieldConfig
  | ColorFieldConfig
  | RangeFieldConfig;

// Form schema definition
export interface FormSchema {
  title?: string;
  description?: string;
  fields: FormFieldConfig[];
  validation?: Record<string, FieldValidation>;
  layout?: FormLayout;
  submitButton?: ButtonConfig;
  resetButton?: ButtonConfig;
}

export interface FormLayout {
  type?: "single" | "multi-column" | "steps" | "tabs";
  columns?: number;
  spacing?: "sm" | "md" | "lg";
  sections?: FormSection[];
}

export interface FormSection {
  title?: string;
  description?: string;
  fields: string[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface ButtonConfig {
  text: string;
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
}

// Form state and errors
export interface FormFieldError {
  message: string;
  code?: string;
  field?: string;
}

export interface FormErrors {
  [fieldName: string]: FormFieldError[];
}

export interface FormState {
  values: Record<string, any>;
  errors: FormErrors;
  touched: Record<string, boolean>;
  dirty: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitCount: number;
}

// Form submission types
export interface FormSubmissionData {
  values: Record<string, any>;
  formData?: FormData;
}

export interface FormSubmissionResult {
  success: boolean;
  data?: any;
  errors?: FormErrors;
  message?: string;
}

// Form hook types
export interface UseFormOptions {
  initialValues?: Record<string, any>;
  validationSchema?: any;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnMount?: boolean;
  enableReinitialize?: boolean;
  onSubmit: (
    values: Record<string, any>,
    formData?: FormData,
  ) => Promise<FormSubmissionResult> | FormSubmissionResult;
  onReset?: () => void;
  onChange?: (values: Record<string, any>) => void;
}

export interface UseFormReturn {
  values: Record<string, any>;
  errors: FormErrors;
  touched: Record<string, boolean>;
  dirty: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitCount: number;
  setValue: (field: string, value: any) => void;
  setValues: (values: Record<string, any>) => void;
  setError: (field: string, error: FormFieldError) => void;
  setErrors: (errors: FormErrors) => void;
  setTouched: (field: string, touched?: boolean) => void;
  setFieldTouched: (touched: Record<string, boolean>) => void;
  validateField: (field: string) => Promise<boolean>;
  validateForm: () => Promise<boolean>;
  handleSubmit: (event?: React.FormEvent) => Promise<void>;
  handleReset: () => void;
  reset: (values?: Record<string, any>) => void;
}

// Specific form types for the application

// Authentication forms
export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  user_type: "student" | "teacher";
  terms_accepted: boolean;
  newsletter_subscription?: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

// Profile forms
export interface UserProfileFormData {
  name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  country?: string;
  timezone: string;
  preferred_language: string;
  avatar?: File;
}

export interface StudentProfileFormData extends UserProfileFormData {
  learning_languages: string[];
  native_language: string;
  language_levels: Record<string, string>;
  learning_goals?: string[];
}

export interface TeacherProfileFormData extends UserProfileFormData {
  bio: string;
  languages: string[];
  native_language: string;
  specializations: string[];
  experience_years: number;
  education: string;
  certifications: string[];
  hourly_rate: number;
  currency: string;
  meeting_platforms: {
    zoom?: string;
    google_meet?: string;
    skype?: string;
    preferred?: string;
  };
  bank_details?: {
    account_holder: string;
    bank_name: string;
    account_number: string;
    routing_number?: string;
    swift_code?: string;
  };
  paypal_email?: string;
}

// Teacher application form
export interface TeacherApplicationFormData {
  bio: string;
  languages: string[];
  specializations: string[];
  experience_years: number;
  education: string;
  certifications: string[];
  why_teach: string;
  availability_description: string;
  resume?: File;
  certificate_files: File[];
  id_document?: File;
  introduction_video?: File;
}

// Booking forms
export interface LessonBookingFormData {
  teacher_id: string;
  language: string;
  level: "beginner" | "intermediate" | "advanced";
  scheduled_at: string;
  duration_minutes: number;
  lesson_type: "trial" | "regular" | "package";
  special_requests?: string;
  meeting_platform: "zoom" | "google_meet" | "skype";
}

// Review forms
export interface ReviewFormData {
  lesson_id: string;
  rating: number;
  comment?: string;
  is_anonymous?: boolean;
}

// Message forms
export interface MessageFormData {
  recipient_id: string;
  content: string;
  attachment?: File;
}

// Contact forms
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: "general" | "support" | "billing" | "technical" | "partnership";
}

// Newsletter subscription
export interface NewsletterFormData {
  email: string;
  preferences?: {
    weekly_tips: boolean;
    product_updates: boolean;
    special_offers: boolean;
  };
}

// Search forms
export interface TeacherSearchFormData {
  languages?: string[];
  price_min?: number;
  price_max?: number;
  rating_min?: number;
  availability_day?: string;
  availability_time?: string;
  specializations?: string[];
  is_native?: boolean;
  has_trial?: boolean;
}

// Admin forms
export interface AdminUserFormData {
  name: string;
  email: string;
  user_type: "student" | "teacher" | "admin";
  is_active: boolean;
  password?: string;
}

export interface AdminSettingsFormData {
  platform_name: string;
  platform_description: string;
  commission_rate: number;
  tax_rate: number;
  minimum_payout_amount: {
    bank: number;
    paypal: number;
  };
  features: {
    trial_lessons: boolean;
    group_lessons: boolean;
    lesson_recordings: boolean;
    instant_messaging: boolean;
  };
  email_notifications: {
    welcome_email: boolean;
    lesson_reminders: boolean;
    payment_confirmations: boolean;
    weekly_summaries: boolean;
  };
}

// Validation schemas (Yup-like structure)
export interface ValidationSchema {
  [fieldName: string]: FieldValidator;
}

export interface FieldValidator {
  required?: boolean | string;
  email?: boolean | string;
  min?: [number, string] | number;
  max?: [number, string] | number;
  minLength?: [number, string] | number;
  maxLength?: [number, string] | number;
  pattern?: [RegExp, string] | RegExp;
  oneOf?: [any[], string] | any[];
  when?: [string, any, FieldValidator];
  test?: [string, string, (value: any) => boolean];
}

// Form builder types
export interface FormBuilderConfig {
  allowedFields: FormFieldConfig["type"][];
  defaultValues: Record<string, any>;
  validationRules: ValidationRule[];
  layoutOptions: FormLayout["type"][];
}

export interface FormBuilderState {
  schema: FormSchema;
  preview: boolean;
  activeField?: string;
  draggedField?: FormFieldConfig;
}

// Export all form types
export type {
  BaseFormField,
  ValidationRule,
  FieldValidation,
  FormFieldConfig,
  FormSchema,
  FormLayout,
  FormSection,
  ButtonConfig,
  FormFieldError,
  FormErrors,
  FormState,
  FormSubmissionData,
  FormSubmissionResult,
  UseFormOptions,
  UseFormReturn,
  ValidationSchema,
  FieldValidator,
  FormBuilderConfig,
  FormBuilderState,

  // Specific form data types
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  UserProfileFormData,
  StudentProfileFormData,
  TeacherProfileFormData,
  TeacherApplicationFormData,
  LessonBookingFormData,
  ReviewFormData,
  MessageFormData,
  ContactFormData,
  NewsletterFormData,
  TeacherSearchFormData,
  AdminUserFormData,
  AdminSettingsFormData,
};
