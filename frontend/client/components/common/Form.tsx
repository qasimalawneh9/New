import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}

export const FormField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  error,
}: FormFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={label.toLowerCase()}>
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <Input
      id={label.toLowerCase()}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

interface FormProps {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  className?: string;
}

export const Form = ({ onSubmit, children, className = "" }: FormProps) => (
  <form onSubmit={onSubmit} className={`space-y-4 ${className}`}>
    {children}
  </form>
);

interface FormActionsProps {
  onCancel?: () => void;
  onSubmit?: () => void;
  cancelText?: string;
  submitText?: string;
  isLoading?: boolean;
}

export const FormActions = ({
  onCancel,
  onSubmit,
  cancelText = "Cancel",
  submitText = "Submit",
  isLoading = false,
}: FormActionsProps) => (
  <div className="flex justify-end space-x-3 pt-4">
    {onCancel && (
      <Button type="button" variant="outline" onClick={onCancel}>
        {cancelText}
      </Button>
    )}
    <Button type="submit" disabled={isLoading} onClick={onSubmit}>
      {isLoading ? "Loading..." : submitText}
    </Button>
  </div>
);
