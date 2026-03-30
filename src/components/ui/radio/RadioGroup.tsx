import { type ReactNode, useId } from "react";
import { cn } from "@/lib/utils";
import { RadioGroupContext } from "./useRadioGroup";
import { Label } from "../Label";

export interface RadioGroupProps {
    value: string;
    onValueChange: (value: string) => void;
    label?: string;
    description?: string;
    error?: string;
    disabled?: boolean;
    orientation?: "vertical" | "horizontal";
    size?: "sm" | "md" | "lg";
    name?: string;
    children: ReactNode;
    className?: string;
    /** Render tabs in a connected pill-strip (joined) vs. separated (default) */
    variant?: "separated" | "joined";
}

export function RadioGroup({
    value,
    onValueChange,
    label,
    description,
    error,
    disabled,
    orientation = "horizontal",
    size = "md",
    name,
    children,
    className,
    variant = "separated",
}: RadioGroupProps) {
    const autoName = useId();

    return (
        <RadioGroupContext.Provider
            value={{ name: name ?? autoName, value, onValueChange, disabled, size, error }}
        >
            <fieldset className={cn("border-none p-0 pb-2 m-0", className)} disabled={disabled}>
                {(label || description) && (
                    <div className="mb-2 flex flex-col gap-0.5">
                        {label && (
                            <Label>
                                {label}
                            </Label>
                        )}
                        {description && (
                            <p className="text-xs text-(--text-tertiary)">{description}</p>
                        )}
                    </div>
                )}

                <div
                    role="radiogroup"
                    className={cn(
                        "flex",
                        orientation === "vertical" ? "flex-col gap-1.5" : "flex-row flex-wrap",
                        // joined variant: merge borders into a single strip
                        variant === "joined" ? `gap-0
                            [&>*:first-child_label]:rounded-r-none
                            [&>*:last-child_label]:rounded-l-none
                            [&>*:not(:first-child):not(:last-child)_label]:rounded-none
                            [&>*:not(:first-child)_label]:-ml-px`
                            : "gap-1.5",
                    )}
                >
                    {children}
                </div>

                {error && (
                    <p className="mt-2 text-xs text-error" role="alert">
                        {error}
                    </p>
                )}
            </fieldset>
        </RadioGroupContext.Provider>
    );
}