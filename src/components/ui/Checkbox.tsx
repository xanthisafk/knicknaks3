import { forwardRef, type InputHTMLAttributes, useId } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
    label?: string;
    description?: string;
    error?: string;
    indeterminate?: boolean;
    size?: "sm" | "md" | "lg";
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, description, error, indeterminate, size = "md", className, id, disabled, checked, ...props }, ref) => {
        const autoId = useId();
        const inputId = id ?? autoId;

        const sizes = {
            sm: { box: "size-3.5", icon: 10, label: "text-xs", desc: "text-xs" },
            md: { box: "size-4", icon: 11, label: "text-sm", desc: "text-xs" },
            lg: { box: "size-5", icon: 13, label: "text-sm", desc: "text-sm" },
        }[size];

        return (
            <div className={cn("flex items-start gap-2.5", disabled && "opacity-50 cursor-not-allowed", className)}>
                {/* Hidden native input */}
                <div className="relative shrink-0 mt-px">
                    <input
                        ref={ref}
                        id={inputId}
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        aria-invalid={!!error}
                        aria-describedby={
                            error ? `${inputId}-error` : description ? `${inputId}-desc` : undefined
                        }
                        className="peer sr-only"
                        {...props}
                    />
                    {/* Visual box */}
                    <label
                        htmlFor={inputId}
                        className={cn(
                            sizes.box,
                            "flex items-center justify-center",
                            "rounded-sm border-2 border-(--border-default)",
                            "bg-(--surface-elevated)",
                            "cursor-pointer transition-all duration-300",
                            // hover
                            "hover:border-(--border-hover)",
                            // checked state
                            "peer-checked:bg-primary-500 peer-checked:border-primary-500",
                            // indeterminate
                            indeterminate && "bg-primary-500 border-primary-500",
                            // focus
                            "peer-focus-visible:ring-2 peer-focus-visible:ring-(--ring-color) peer-focus-visible:ring-offset-1",
                            // error
                            error && "border-error peer-checked:bg-error peer-checked:border-error",
                            disabled && "cursor-not-allowed",
                        )}
                    >
                        {indeterminate ? (
                            <Minus size={sizes.icon} className="text-white stroke-3" />
                        ) : (
                            <Check
                                size={sizes.icon}
                                className={cn(
                                    "text-white stroke-3 transition-all duration-300",
                                    "scale-0 opacity-0",
                                    "peer-checked:scale-100 peer-checked:opacity-100",
                                    // We can't use peer-checked here directly on the icon wrapper,
                                    // so we use a workaround via the label's sibling approach
                                )}
                            />
                        )}
                    </label>
                    {/* Separate overlay for the check icon that responds to peer-checked */}
                    <label
                        htmlFor={inputId}
                        aria-hidden="true"
                        className={cn(
                            "pointer-events-none absolute inset-0 flex items-center justify-center",
                            sizes.box,
                        )}
                    >
                        {indeterminate ? (
                            <Minus size={sizes.icon} className="text-white stroke-3" />
                        ) : (
                            <Check
                                size={sizes.icon}
                                className={cn(
                                    "text-white stroke-3",
                                    "transition-transform duration-300",
                                    checked ? "scale-100 opacity-100" : "scale-0 opacity-0",
                                )}
                            />
                        )}
                    </label>
                </div>

                {/* Label + description */}
                {(label || description || error) && (
                    <div className="flex flex-col gap-0.5">
                        {label && (
                            <label
                                htmlFor={inputId}
                                className={cn(
                                    sizes.label,
                                    "font-medium text-(--text-primary) leading-tight cursor-pointer",
                                    disabled && "cursor-not-allowed",
                                )}
                            >
                                {label}
                            </label>
                        )}
                        {description && !error && (
                            <p id={`${inputId}-desc`} className={cn(sizes.desc, "text-(--text-tertiary) leading-snug")}>
                                {description}
                            </p>
                        )}
                        {error && (
                            <p id={`${inputId}-error`} className={cn(sizes.desc, "text-error")} role="alert">
                                {error}
                            </p>
                        )}
                    </div>
                )}
            </div>
        );
    }
);
Checkbox.displayName = "Checkbox";