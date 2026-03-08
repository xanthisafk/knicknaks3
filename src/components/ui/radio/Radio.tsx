import { useId, type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useRadioGroup } from "./useRadioGroup";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "name" | "checked" | "onChange"> {
    value: string;
    label?: string;
    description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
    ({ value, label, description, disabled: itemDisabled, id, className, ...props }, ref) => {
        const { name, value: groupValue, onValueChange, disabled: groupDisabled, size, error } = useRadioGroup();
        const autoId = useId();
        const inputId = id ?? autoId;
        const checked = groupValue === value;
        const disabled = itemDisabled || groupDisabled;

        const sizes = {
            sm: { tab: "px-3 py-1.5", label: "text-xs", desc: "text-xs" },
            md: { tab: "px-4 py-2", label: "text-sm", desc: "text-xs" },
            lg: { tab: "px-5 py-2.5", label: "text-sm", desc: "text-sm" },
        }[size];

        return (
            <div className={cn("relative", disabled && "opacity-50 cursor-not-allowed", className)}>
                {/* Hidden native input for a11y + keyboard nav */}
                <input
                    ref={ref}
                    id={inputId}
                    type="radio"
                    name={name}
                    value={value}
                    checked={checked}
                    disabled={disabled}
                    onChange={() => onValueChange(value)}
                    className="peer sr-only"
                    {...props}
                />

                <label
                    htmlFor={inputId}
                    className={cn(
                        sizes.tab,
                        "inline-flex flex-col items-center justify-center gap-0.5",
                        "rounded-md border cursor-pointer select-none",
                        // default (unchecked)
                        "border-(--border-default) bg-(--surface-elevated) text-(--text-secondary)",
                        // hover
                        "hover:border-primary-400 hover:text-(--text-primary)",
                        // checked
                        checked && "border-primary-500 bg-primary-500/10 text-primary-600 font-medium shadow-sm",
                        // error
                        error && "border-error",
                        error && checked && "bg-error/10 text-error",
                        // focus (keyboard)
                        "peer-focus-visible:ring-2 peer-focus-visible:ring-[--ring-color] peer-focus-visible:ring-offset-1",
                        disabled && "cursor-not-allowed",
                    )}
                >
                    {label && (
                        <span className={cn(sizes.label, "leading-tight whitespace-nowrap")}>
                            {label}
                        </span>
                    )}
                    {description && (
                        <span className={cn(sizes.desc, "text-(--text-tertiary) leading-snug font-normal")}>
                            {description}
                        </span>
                    )}
                </label>
            </div>
        );
    }
);
Radio.displayName = "Radio";