import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

export function Slider({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  showValue = true,
  formatValue = (v) => v.toString(),
  className,
  id,
  ...props
}: SliderProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={inputId} className="text-sm font-medium text(--text-primary)">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-mono text(--text-secondary) tabular-nums">
              {formatValue(value)}
            </span>
          )}
        </div>
      )}
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "w-full h-2 rounded-full appearance-none cursor-pointer",
          "bg-[var(--surface-secondary)]",
          "[&::-webkit-slider-thumb]:appearance-none",
          "[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5",
          "[&::-webkit-slider-thumb]:rounded-full",
          "[&::-webkit-slider-thumb]:bg-[var(--color-primary-500)]",
          "[&::-webkit-slider-thumb]:shadow-md",
          "[&::-webkit-slider-thumb]:cursor-pointer",
          "[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-[var(--duration-fast)]",
          "[&::-webkit-slider-thumb]:hover:scale-110",
          "[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5",
          "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0",
          "[&::-moz-range-thumb]:bg-[var(--color-primary-500)]",
          "[&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer",
        )}
        style={{
          background: `linear-gradient(to right, var(--color-primary-400) 0%, var(--color-primary-400) ${percent}%, var(--surface-secondary) ${percent}%, var(--surface-secondary) 100%)`,
        }}
        {...props}
      />
    </div>
  );
}
