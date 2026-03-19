import type { ReactNode, ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "warning" | "danger" | "ghost";
type ButtonSize = "xs" | "s" | "sm" | "m" | "md" | "l" | "lg" | "xl";
type IconPosition = "left" | "right";

interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  emoji?: string;
  iconPos?: IconPosition;
  url?: string;
  text?: string;
  children?: ReactNode;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md",
  secondary:
    "bg-(--surface-secondary) text-(--text-primary) border border-(--border-default) hover:border-(--border-hover) hover:bg-(--surface-elevated)",
  warning:
    "bg-(--color-warning) text-(--text-primary) hover:opacity-90 active:opacity-80 shadow-sm hover:shadow-md",
  danger:
    "bg-(--color-error) text-white hover:opacity-90 active:opacity-80 shadow-sm hover:shadow-md",
  ghost:
    "text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-secondary)",
};

const sizeStyles: Record<string, string> = {
  xs: "px-2 py-1 text-xs gap-1 rounded-sm",
  s: "px-3 py-1.5 text-sm gap-1.5 rounded-md",
  sm: "px-3 py-1.5 text-sm gap-1.5 rounded-md",
  m: "px-4 py-2 text-sm gap-2 rounded-md",
  md: "px-4 py-2 text-sm gap-2 rounded-md",
  l: "px-6 py-3 text-base gap-2.5 rounded-lg",
  lg: "px-6 py-3 text-base gap-2.5 rounded-lg",
  xl: "px-8 py-4 text-lg gap-3 rounded-lg",
};

const iconSizeMap: Record<string, number> = {
  xs: 12,
  s: 14,
  sm: 14,
  m: 16,
  md: 16,
  l: 18,
  lg: 18,
  xl: 20,
};

function renderVisual(
  icon?: LucideIcon,
  emoji?: string,
  size: ButtonSize = "m"
) {
  const Icon = icon;
  if (Icon) {
    return <Icon size={iconSizeMap[size]} aria-hidden="true" />;
  }
  if (emoji) {
    return (
      <span className="font-emoji leading-none" aria-hidden="true">
        {emoji}
      </span>
    );
  }
  return null;
}

export function Button({
  variant = "primary",
  size = "m",
  icon,
  emoji,
  iconPos = "left",
  url,
  text,
  children,
  className,
  ...props
}: ButtonProps) {
  const visual = renderVisual(icon, emoji, size);
  const content = text ?? children;

  const classes = cn(
    "inline-flex items-center justify-center font-medium",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focus)",
    "disabled:opacity-50 disabled:pointer-events-none",
    "cursor-pointer select-none",
    "transition-all duration-(--duration-fast)",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  const inner = (
    <>
      {iconPos === "left" && visual}
      {content && <span>{content}</span>}
      {iconPos === "right" && visual}
    </>
  );

  if (url) {
    return (
      <a href={url} className={classes} role="button">
        {inner}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {inner}
    </button>
  );
}
