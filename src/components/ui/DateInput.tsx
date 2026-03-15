import {
    forwardRef,
    useId,
    useRef,
    type InputHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";
import { Label } from "./Label";

export interface DateInputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
    label?: string;
    description?: string;
    error?: string;
    size?: "sm" | "md" | "lg";
    inputType?: "date" | "datetime-local" | "month" | "week" | "time";
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
    (
        {
            label,
            description,
            error,
            size = "md",
            inputType = "date",
            disabled,
            id,
            className,
            ...props
        },
        ref,
    ) => {
        const autoId = useId();
        const inputId = id ?? autoId;
        const descId = `${inputId}-desc`;
        const errorId = `${inputId}-error`;

        // Click the calendar icon to open the native picker
        const inputRef = useRef<HTMLInputElement | null>(null);

        const sizes = {
            sm: { input: "h-8 px-2.5 text-xs", icon: "size-3.5 mr-2" },
            md: { input: "h-9 px-3 text-sm", icon: "size-4 mr-2.5" },
            lg: { input: "h-11 px-4 text-sm", icon: "size-4 mr-3" },
        }[size];

        return (
            <div className={cn("flex flex-col gap-1.5", className)}>
                {label && (
                    <Label
                        htmlFor={inputId}
                    >
                        {label}
                    </Label>
                )}

                {description && (
                    <p id={descId} className="text-xs text-(--text-tertiary) leading-snug">
                        {description}
                    </p>
                )}

                {/* Input wrapper */}
                <div
                    className={cn(
                        "relative flex items-center w-full",
                        "rounded-md border bg-(--surface-elevated)",
                        "transition-shadow duration-150",
                        // default border
                        "border-(--border-default)",
                        // focus-within ring
                        "focus-within:ring-2 focus-within:ring-orange-500/40 focus-within:border-orange-500",
                        // error
                        error && "border-error focus-within:ring-error/30 focus-within:border-error",
                        // disabled
                        disabled && "opacity-50 cursor-not-allowed",
                    )}
                >
                    {/* Calendar icon — clicking opens the picker */}
                    <button
                        type="button"
                        tabIndex={-1}
                        disabled={disabled}
                        aria-hidden
                        onClick={() => {
                            const el = (ref as React.RefObject<HTMLInputElement>)?.current ?? inputRef.current;
                            el?.showPicker?.();
                        }}
                        className={cn(
                            "flex items-center pl-3 shrink-0",
                            "text-(--text-tertiary) hover:text-orange-500 transition-colors duration-150",
                            disabled && "pointer-events-none",
                        )}
                    >
                        <CalendarIcon
                            className={cn(sizes.icon, "shrink-0")}
                            inputType={inputType}
                        />
                    </button>

                    <input
                        ref={(el) => {
                            inputRef.current = el;
                            if (typeof ref === "function") ref(el);
                            else if (ref) (ref as React.RefObject<HTMLInputElement | null>).current = el;
                        }}
                        id={inputId}
                        type={inputType}
                        disabled={disabled}
                        aria-describedby={
                            [description && descId, error && errorId].filter(Boolean).join(" ") || undefined
                        }
                        aria-invalid={!!error}
                        className={cn(
                            sizes.input,
                            "flex-1 min-w-0 bg-transparent outline-none",
                            "text-(--text-primary) placeholder:text-(--text-tertiary)",
                            // Style the native date picker parts to match theme
                            // Tailwind Forms resets most of the ugliness; we fine-tune below
                            "scheme-light dark:scheme-dark",
                            // Hide the native calendar icon (we use our own)
                            "[&::-webkit-calendar-picker-indicator]:opacity-0",
                            "[&::-webkit-calendar-picker-indicator]:absolute",
                            "[&::-webkit-calendar-picker-indicator]:inset-0",
                            "[&::-webkit-calendar-picker-indicator]:w-full",
                            "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
                            disabled && "cursor-not-allowed",
                        )}
                        {...props}
                    />
                </div>

                {error && (
                    <p id={errorId} role="alert" className="text-xs text-error leading-snug">
                        {error}
                    </p>
                )}
            </div>
        );
    },
);

DateInput.displayName = "DateInput";

function CalendarIcon({
    className,
    inputType,
}: {
    className?: string;
    inputType: DateInputProps["inputType"];
}) {
    if (inputType === "time") {
        return <Clock className={className} />;
    }

    return <Calendar className={className} />;
}