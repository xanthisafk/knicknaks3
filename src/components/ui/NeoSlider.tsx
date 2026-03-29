import {
  forwardRef,
  useCallback,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { Label } from "./Label";

// ===== Types =====

interface NeoSliderProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange" | "value" | "defaultValue"
  > {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  unit?: string;
  trailingContent?: ReactNode;
  error?: string;
  helperText?: string;
}

// ===== Styles =====

const wrapperBase = cn(
  "flex items-center w-full overflow-hidden",
  "rounded-xl",
  "bg-(--surface-elevated)",
  "border border-(--border-default)",
  "hover:border-(--border-hover)",
  "focus-within:border-(--border-focus) focus-within:ring-2 focus-within:ring-(--ring-color)",
);

const sliderInputBase = cn(
  // Layout & cursor
  "w-full appearance-none cursor-pointer bg-transparent outline-none",
  "py-2",

  // ── Track: webkit ──
  "[&::-webkit-slider-runnable-track]:h-1.5",
  "[&::-webkit-slider-runnable-track]:rounded-full",
  // (fill gradient set via inline style)

  // ── Track: Firefox ──
  "[&::-moz-range-track]:h-1.5",
  "[&::-moz-range-track]:rounded-full",
  "[&::-moz-range-track]:bg-(--surface-secondary)",

  // ── Thumb: webkit — pill-shaped, notched ring ──
  "[&::-webkit-slider-thumb]:appearance-none",
  "[&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px]",
  "[&::-webkit-slider-thumb]:rounded-full",
  "[&::-webkit-slider-thumb]:bg-white",
  // ring gives it a "floating" look; border creates the colored halo
  "[&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-primary-500",
  "[&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.18)]",
  "[&::-webkit-slider-thumb]:cursor-grab [&:active::-webkit-slider-thumb]:cursor-grabbing",
  // "[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-(--duration-fast)",
  "[&::-webkit-slider-thumb]:hover:scale-110",
  // vertical centering: track 6px, thumb 18px → offset (18-6)/2 = 6
  "[&::-webkit-slider-thumb]:-mt-[6px]",
  // focus ring on thumb
  "[&:focus-visible::-webkit-slider-thumb]:ring-2 [&:focus-visible::-webkit-slider-thumb]:ring-(--ring-color) [&:focus-visible::-webkit-slider-thumb]:ring-offset-2",

  // ── Thumb: Firefox ──
  "[&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:h-[18px]",
  "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px]",
  "[&::-moz-range-thumb]:border-primary-500 [&::-moz-range-thumb]:bg-white",
  "[&::-moz-range-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.18)]",
  "[&::-moz-range-thumb]:cursor-grab",

  // Firefox filled track
  "[&::-moz-range-progress]:h-1.5 [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-primary-400",

  // ── Disabled ──
  "disabled:cursor-not-allowed disabled:opacity-50",
  "[&:disabled::-webkit-slider-thumb]:cursor-not-allowed [&:disabled::-webkit-slider-thumb]:scale-100",
  "[&:disabled::-moz-range-thumb]:cursor-not-allowed"
);

// ===== Helpers =====

function fillPercent(value: number, min: number, max: number) {
  if (max === min) return 0;
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

function trackBackground(pct: number) {
  return `linear-gradient(to right,
    var(--color-primary-400) 0%,
    var(--color-primary-400) ${pct}%,
    var(--surface-secondary) ${pct}%,
    var(--surface-secondary) 100%)`;
}

// ===== Component =====

export const NeoSlider = forwardRef<HTMLInputElement, NeoSliderProps>(
  (
    {
      label,
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      onValueChange,
      showValue = true,
      formatValue,
      unit,
      trailingContent,
      error,
      helperText,
      className,
      id,
      disabled,
      "aria-label": ariaLabel,
      "aria-valuetext": ariaValueText,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-") ?? generatedId;

    const currentValue = value ?? defaultValue ?? min;
    const pct = fillPercent(currentValue, min, max);

    const displayValue = formatValue
      ? formatValue(currentValue)
      : unit
        ? `${currentValue}${unit}`
        : String(currentValue);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => onValueChange?.(Number(e.target.value)),
      [onValueChange]
    );

    const describedBy = error
      ? `${inputId}-error`
      : helperText
        ? `${inputId}-helper`
        : undefined;

    return (
      <div className={cn("flex flex-col gap-1.5", className)}>

        {/* ── Label row ── */}
        {(label || showValue) && (
          <div className={cn("flex items-center max-h-4", label ? "justify-between" : "justify-end")}>
            {label && <Label htmlFor={inputId}>{label}</Label>}
            {showValue && (
              <span
                className="text-xs font-mono text-(--text-secondary) tabular-nums select-none"
                aria-hidden="true"
              >
                {displayValue}
              </span>
            )}
          </div>
        )}

        {/* ── Slider wrapper ── */}
        <div
          className={cn(
            wrapperBase,
            disabled && "opacity-60 cursor-not-allowed pointer-events-none",
            error && "border-error focus-within:border-error focus-within:ring-error/30"
          )}
        >
          <input
            ref={ref}
            id={inputId}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            defaultValue={value === undefined ? defaultValue : undefined}
            onChange={handleChange}
            disabled={disabled}
            className={sliderInputBase}
            style={{ background: trackBackground(pct) }}
            role="slider"
            aria-label={ariaLabel ?? (label ? undefined : "Slider")}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={currentValue}
            aria-valuetext={ariaValueText ?? displayValue}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            {...props}
          />

          {trailingContent}
        </div>

        {/* ── Feedback text ── */}
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-error" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-sm text-(--text-tertiary)">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

NeoSlider.displayName = "NeoSlider";