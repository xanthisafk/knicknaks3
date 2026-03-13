import type { LabelHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "./Tooltip";

type LabelSize = "xs" | "s" | "m" | "l" | "xl";
type LabelFont = "body" | "heading" | "mono" | "brand";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Label text — or pass children instead */
  text?: string;
  children?: ReactNode;
  size?: LabelSize;
  font?: LabelFont;
  icon?: LucideIcon;
  emoji?: string;
  /** When provided, renders an ℹ info icon with a hover tooltip */
  tooltip?: string;
  className?: string;
}

const sizeStyles: Record<LabelSize, string> = {
  xs: "text-[10px] gap-1",
  s: "text-xs gap-1",
  m: "text-sm gap-1.5",
  l: "text-base gap-2",
  xl: "text-lg gap-2",
};

const fontStyles: Record<LabelFont, string> = {
  body: "font-body",
  heading: "font-heading",
  mono: "font-mono",
  brand: "font-brand",
};

const iconSizeMap: Record<LabelSize, number> = {
  xs: 10,
  s: 12,
  m: 14,
  l: 16,
  xl: 18,
};

function renderVisual(
  icon?: LucideIcon,
  emoji?: string,
  size: LabelSize = "m"
) {
  const Icon = icon;
  if (Icon) {
    return (
      <Icon
        size={iconSizeMap[size]}
        aria-hidden="true"
        className="shrink-0 text-(--text-tertiary)"
      />
    );
  }
  if (emoji) {
    return (
      <span className="font-emoji leading-none shrink-0" aria-hidden="true">
        {emoji}
      </span>
    );
  }
  return null;
}

export function Label({
  text,
  children,
  size = "s",
  font = "body",
  icon,
  emoji,
  tooltip,
  className,
  ...props
}: LabelProps) {
  const visual = renderVisual(icon, emoji, size);
  const content = text ?? children;

  return (
    <label
      className={cn(
        "inline-flex items-center",
        "font-medium uppercase tracking-wide",
        "text-(--text-tertiary)",
        "select-none",
        sizeStyles[size],
        fontStyles[font],
        className
      )}
      {...props}
    >
      {visual}
      {content && <span>{content}</span>}
      {tooltip && (
        <Tooltip content={tooltip} position="top">
          <Info
            size={iconSizeMap[size]}
            aria-label="More info"
            className="shrink-0 text-(--text-tertiary) hover:text-(--text-secondary) transition-colors duration-(--duration-fast) cursor-help"
          />
        </Tooltip>
      )}
    </label>
  );
}
