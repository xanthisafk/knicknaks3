import React, { useId, useRef } from "react";
import { Input, Label } from "../ui";
import { cn } from "@/lib";

export interface ColorPickerProps {
    /** Current hex color value */
    value: string;
    /** Called when the color changes */
    onChange: (value: string) => void;
    /** Label shown above the text input */
    label?: string;
    /** Placeholder for the hex input */
    placeholder?: string;
    /** Helper text below the input */
    hint?: string;
    /** Size of the color swatch */
    swatchSize?: "sm" | "md" | "lg";
    /** Disable the picker */
    disabled?: boolean;
    /** Additional className on the root element */
    className?: string;
}

const swatchDimensions: Record<NonNullable<ColorPickerProps["swatchSize"]>, string> = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
};

export function ColorPickerSwatch({
    value,
    onChange,
    label = "Color",
    placeholder = "000000",
    hint = "Click the swatch to open the color picker",
    swatchSize = "md",
    disabled = false,
    className = "",
}: ColorPickerProps) {
    const inputId = useId();
    const nativePickerRef = useRef<HTMLInputElement>(null);

    // Strip leading # for display; the value prop is always stored with #
    const displayValue = value.startsWith("#") ? value.slice(1) : value;

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Strip any # the user might type — the leadingText="#" adornment covers it visually
        const raw = e.target.value.replace(/^#+/, "");
        const withHash = "#" + raw;
        onChange(withHash);

        // Sync native picker when value is a valid 6-digit hex
        if (/^#[0-9A-Fa-f]{6}$/.test(withHash) && nativePickerRef.current) {
            nativePickerRef.current.value = withHash;
        }
    };

    const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value); // native color input always gives #rrggbb
    };

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Swatch */}
            <div
                className={cn(
                    swatchDimensions[swatchSize],
                    "rounded-lg border-2 border-(--border-default) shadow-sm shrink-0 relative overflow-hidden transition-opacity",
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                )}
                style={{ backgroundColor: value }}
                title={disabled ? undefined : "Click to open color picker"}
                onClick={() => !disabled && nativePickerRef.current?.click()}
            >
                <input
                    ref={nativePickerRef}
                    type="color"
                    value={/^#[0-9A-Fa-f]{6}$/.test(value) ? value : "#000000"}
                    onChange={handleNativeChange}
                    disabled={disabled}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="absolute inset-0 opacity-0 w-full h-full cursor-inherit"
                />
            </div>

            {/* Text controls */}
            <div className="flex-1 space-y-1.5">
                <Input
                    id={inputId}
                    type="text"
                    label={label}
                    value={displayValue}
                    onChange={handleTextChange}
                    placeholder={placeholder}
                    leadingText="#"
                    disabled={disabled}
                    spellCheck={false}
                    className={cn(
                        "font-mono"
                    )}
                />
                {hint && (
                    <Label size="xs">{hint}</Label>
                )}
            </div>
        </div>
    );
}