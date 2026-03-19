import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type BadgeVariant = "primary" | "secondary" | "success" | "warning" | "danger" | "ghost";
type IconPosition = "left" | "right";

interface BadgeProps extends React.ComponentProps<"span"> {
  variant?: BadgeVariant;
  icon?: LucideIcon;
  emoji?: string;
  text: string;
  iconPos?: IconPosition;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary:
    "bg-primary-100 text-primary-700 border-primary-200",
  secondary:
    "bg-(--surface-secondary) text-(--text-secondary) border-(--border-default)",
  success: "bg-green-500/10 text-green-600 border-green-500/20",
  warning:
    "bg-[oklch(0.92_0.08_75)] text-[oklch(0.45_0.14_75)] border-[oklch(0.82_0.12_75)]",
  danger:
    "bg-[oklch(0.92_0.06_25)] text-[oklch(0.48_0.18_25)] border-[oklch(0.82_0.1_25)]",
  ghost:
    "bg-transparent text-(--text-tertiary) border-transparent",
};

function renderVisual(icon?: LucideIcon, emoji?: string) {
  const Icon = icon;
  if (Icon) {
    return <Icon size={12} aria-hidden="true" />;
  }
  if (emoji) {
    return (
      <span className="font-emoji text-[0.75em] leading-none" aria-hidden="true">
        {emoji}
      </span>
    );
  }
  return null;
}

export function Badge({
  variant = "primary",
  icon,
  emoji,
  text,
  iconPos = "left",
  className,
  ...props
}: BadgeProps) {
  const visual = renderVisual(icon, emoji);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5",
        "text-xs font-medium leading-none whitespace-nowrap",
        "border rounded-full",
        "transition-colors duration-(--duration-fast)",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {iconPos === "left" && visual}
      <span>{text}</span>
      {iconPos === "right" && visual}
    </span>
  );
}
