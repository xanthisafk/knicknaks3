import {
    forwardRef,
    useRef,
    useEffect,
    useCallback,
    useState,
    type InputHTMLAttributes,
} from "react";
import type { LucideIcon } from "lucide-react";
import { cn, debounce } from "@/lib/utils";
import { Label } from "./Label";

// ===== ColorInput =====

interface ColorInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
    label?: string;
    /** Label icon (lucide) */
    labelIcon?: LucideIcon;
    /** Label emoji */
    labelEmoji?: string;
    /** Tooltip shown on the label info icon */
    labelTooltip?: string;

    /** Trailing text (e.g. hex value display) — shown after the input text */
    trailingText?: string;

    error?: string;
    helperText?: string;

    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

    /**
     * Whether to debounce the onChange handler.
     * @default true
     */
    debounce?: boolean;

    /**
     * Debounce delay in milliseconds.
     * @default 150
     */
    debounceMs?: number;
}

const inputBase = [
    "w-full bg-transparent text-(--text-primary) text-sm tabular-nums",
    "placeholder:text-(--text-tertiary)",
    "outline-none focus:outline-none ring-0 focus:ring-0 border-none focus:border-none",
    "py-2",
].join(" ");

const wrapperBase = [
    "flex items-center gap-2",
    "w-full rounded-md",
    "bg-(--surface-elevated)",
    "border border-(--border-default)",
    "hover:border-(--border-hover)",
    "focus-within:border-(--border-focus) focus-within:ring-2 focus-within:ring-(--ring-color)",
    "transition-colors duration-(--duration-fast)",
    "px-3",
].join(" ");

export const ColorInput = forwardRef<HTMLInputElement, ColorInputProps>(
    (
        {
            label,
            labelIcon,
            labelEmoji,
            labelTooltip,
            trailingText,
            error,
            helperText,
            className,
            id,
            value,
            defaultValue,
            onChange,
            debounce: useDebounce = true,
            debounceMs = 150,
            ...props
        },
        forwardedRef
    ) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

        // Internal ref for the hidden <input type="color">
        const colorPickerRef = useRef<HTMLInputElement>(null);

        // Track display value for the hex text input
        const initialValue = (value ?? defaultValue ?? "#000000") as string;
        const [internalValue, setInternalValue] = useState<string>(initialValue);

        // Keep internal value in sync when controlled `value` prop changes
        useEffect(() => {
            if (value !== undefined) {
                setInternalValue(value as string);
            }
        }, [value]);

        // Build the (optionally debounced) onChange handler
        const debouncedOnChange = useCallback(
            useDebounce && onChange
                ? debounce(onChange as (...args: unknown[]) => void, debounceMs)
                : (onChange as (...args: unknown[]) => void) ?? (() => { }),
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [onChange, useDebounce, debounceMs]
        );

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setInternalValue(newValue);
            debouncedOnChange(e);
        };

        // Hex text input: validate & sync back to color picker on blur
        const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value;
            setInternalValue(raw);

            // Only fire onChange if it looks like a valid hex color
            const isValidHex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(raw);
            if (isValidHex) {
                // Synthesize an event-like object targeting the hidden color input
                const syntheticEvent = {
                    ...e,
                    target: { ...e.target, value: raw },
                } as React.ChangeEvent<HTMLInputElement>;
                debouncedOnChange(syntheticEvent);
            }
        };

        const handleTextBlur = () => {
            // Normalise: if the text doesn't start with #, try prepending it
            let normalized = internalValue.trim();
            if (!normalized.startsWith("#")) normalized = `#${normalized}`;
            // If still invalid, fall back to the color picker's current value
            const isValid = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(normalized);
            if (isValid) {
                setInternalValue(normalized);
            } else if (colorPickerRef.current) {
                setInternalValue(colorPickerRef.current.value);
            }
        };

        // The swatch/preview opens the native color picker on click
        const openPicker = () => colorPickerRef.current?.click();

        return (
            <div className={cn("flex flex-col gap-1.5", className)}>
                {label && (
                    <Label
                        htmlFor={inputId}
                        text={label}
                        icon={labelIcon}
                        emoji={labelEmoji}
                        tooltip={labelTooltip}
                    />
                )}

                <div
                    className={cn(
                        wrapperBase,
                        error &&
                        "border-error focus-within:border-error focus-within:ring-error/30"
                    )}
                >
                    {/* ── Color swatch (opens native picker) ── */}
                    <button
                        type="button"
                        aria-label="Open color picker"
                        onClick={openPicker}
                        className={cn(
                            "shrink-0 rounded-sm border border-(--border-default)",
                            "hover:border-(--border-hover) transition-colors duration-(--duration-fast)",
                            "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)",
                            // Match the height of a single-line input (py-2 + text-sm line-height ≈ 34px)
                            // We use h-5 w-5 so it sits centred in the row without stretching it
                            "h-5 w-5"
                        )}
                        style={{ backgroundColor: internalValue }}
                    />

                    {/* Hidden native color picker — triggered by the swatch button */}
                    <input
                        ref={colorPickerRef}
                        type="color"
                        value={
                            // Keep the picker in sync; fall back gracefully for partial hex during text editing
                            /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(internalValue)
                                ? internalValue
                                : "#000000"
                        }
                        onChange={handleChange}
                        aria-hidden="true"
                        tabIndex={-1}
                        className="sr-only"
                        // Forward any extra props (min, max, etc.) to the real input
                        {...props}
                    // ref forwarding goes to the visible text input below, so we use
                    // a separate internal ref here and do NOT spread forwardedRef
                    />

                    {/* Visible hex text input */}
                    <input
                        ref={forwardedRef}
                        id={inputId}
                        type="text"
                        value={internalValue}
                        onChange={handleTextChange}
                        onBlur={handleTextBlur}
                        maxLength={7}
                        spellCheck={false}
                        className={cn(inputBase, "font-mono uppercase")}
                        aria-invalid={!!error}
                        aria-describedby={
                            error
                                ? `${inputId}-error`
                                : helperText
                                    ? `${inputId}-helper`
                                    : undefined
                        }
                    />

                    {trailingText != null && (
                        <span className="text-sm text-(--text-tertiary) whitespace-nowrap select-none">
                            {trailingText}
                        </span>
                    )}
                </div>

                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="text-sm text-error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p
                        id={`${inputId}-helper`}
                        className="text-sm text-(--text-tertiary)"
                    >
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);
ColorInput.displayName = "ColorInput";