import { cn } from "@/lib/utils";

type ProgressVariant = "primary" | "success" | "warning" | "danger" | "info";
type ProgressSize = "xs" | "s" | "m" | "l";

interface ProgressBarProps {
  /** Current value (0–100) */
  value: number;
  /** Maximum value (default 100) */
  max?: number;
  /** Visual variant */
  variant?: ProgressVariant;
  /** Height size */
  size?: ProgressSize;
  /** Show percentage label */
  showLabel?: boolean;
  /** Indeterminate / loading state */
  indeterminate?: boolean;
  /** Accessible label */
  label?: string;
  className?: string;
}

const variantColors: Record<ProgressVariant, string> = {
  primary: "bg-primary-500",
  success: "bg-(--color-success)",
  warning: "bg-(--color-warning)",
  danger: "bg-(--color-error)",
  info: "bg-(--color-info)",
};

const sizeStyles: Record<ProgressSize, string> = {
  xs: "h-1",
  s: "h-1.5",
  m: "h-2.5",
  l: "h-4",
};

export function ProgressBar({
  value,
  max = 100,
  variant = "primary",
  size = "m",
  showLabel = false,
  indeterminate = false,
  label,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* Label row */}
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-xs text-(--text-secondary)">
          {label && <span className="font-medium">{label}</span>}
          {showLabel && (
            <span className="tabular-nums ml-auto">
              {indeterminate ? "…" : `${Math.round(pct)}%`}
            </span>
          )}
        </div>
      )}

      {/* Track */}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
        className={cn(
          "w-full overflow-hidden rounded-full",
          "bg-(--surface-secondary)",
          sizeStyles[size]
        )}
      >
        {/* Fill */}
        <div
          className={cn(
            "h-full rounded-full",
            "transition-[width] duration-(--duration-normal) ease-out",
            variantColors[variant],
            indeterminate && "kk-progress-indeterminate"
          )}
          style={indeterminate ? undefined : { width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
