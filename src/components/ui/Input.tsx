import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text(--text-primary)"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-3 py-2 rounded-[var(--radius-md)]",
            "bg-[var(--surface-elevated)] text(--text-primary)",
            "border border-[var(--border-default)]",
            "placeholder:text-[var(--text-tertiary)]",
            "transition-colors duration-[var(--duration-fast)]",
            "hover:border-[var(--border-hover)]",
            "focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--ring-color)]",
            error && "border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/30",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-[var(--color-error)]" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-sm text-[var(--text-tertiary)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

// ===== Textarea =====
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text(--text-primary)"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-3 py-2 rounded-[var(--radius-md)] min-h-[100px] resize-y",
            "bg-[var(--surface-elevated)] text(--text-primary)",
            "border border-[var(--border-default)]",
            "placeholder:text-[var(--text-tertiary)]",
            "transition-colors duration-[var(--duration-fast)]",
            "hover:border-[var(--border-hover)]",
            "focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--ring-color)]",
            error && "border-[var(--color-error)]",
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        {error && (
          <p className="text-sm text-[var(--color-error)]" role="alert">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-[var(--text-tertiary)]">{helperText}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
