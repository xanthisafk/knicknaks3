import { useState, useCallback } from "react";
import type { LucideIcon } from "lucide-react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { copyToClipboard } from "@/lib/utils";

type CopyButtonSize = "xs" | "s" | "sm" | "m" | "md" | "l" | "lg";
type CopyButtonVariant = "primary" | "secondary" | "ghost";

interface CopyButtonProps {
  /** The text to copy to clipboard */
  text: string;
  /** Optional icon override — defaults to Copy / Check */
  icon?: LucideIcon;
  /** Optional emoji — used if no icon is provided */
  emoji?: string;
  /** Button label — defaults to "Copy" */
  label?: string;
  /** Label shown after copying — defaults to "Copied!" */
  copiedLabel?: string;
  /** Duration the "copied" state stays visible (ms) */
  resetMs?: number;
  size?: CopyButtonSize;
  variant?: CopyButtonVariant;
  className?: string;
}

const sizeStyles: Record<string, string> = {
  xs: "px-2 py-1 text-xs gap-1 rounded-sm",
  s: "px-3 py-1.5 text-sm gap-1.5 rounded-md",
  sm: "px-3 py-1.5 text-sm gap-1.5 rounded-md",
  m: "px-4 py-2 text-sm gap-2 rounded-md",
  md: "px-4 py-2 text-sm gap-2 rounded-md",
  l: "px-6 py-3 text-base gap-2.5 rounded-lg",
  lg: "px-6 py-3 text-base gap-2.5 rounded-lg",
};

const variantStyles: Record<CopyButtonVariant, string> = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md",
  secondary:
    "bg-(--surface-secondary) text-(--text-primary) border border-(--border-default) hover:border-(--border-hover) hover:bg-(--surface-elevated)",
  ghost:
    "text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-secondary)",
};

const copiedVariant =
  "bg-(--color-success) text-white hover:bg-(--color-success) shadow-sm";

const iconSizeMap: Record<string, number> = {
  xs: 12,
  s: 14,
  sm: 14,
  m: 16,
  md: 16,
  l: 18,
  lg: 18,
};

function renderVisual(
  copied: boolean,
  icon?: LucideIcon,
  emoji?: string,
  size: string = "m"
) {
  const iconSize = iconSizeMap[size] ?? 16;

  if (copied) {
    return <Check size={iconSize} aria-hidden="true" />;
  }

  const Icon = icon;
  if (Icon) {
    return <Icon size={iconSize} aria-hidden="true" />;
  }
  if (emoji) {
    return (
      <span className="font-emoji leading-none" aria-hidden="true">
        {emoji}
      </span>
    );
  }
  return <Copy size={iconSize} aria-hidden="true" />;
}

export function CopyButton({
  text,
  icon,
  emoji,
  label,
  copiedLabel,
  resetMs = 2000,
  size = "sm",
  variant = "ghost",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), resetMs);
    }
  }, [text, resetMs]);

  const displayLabel = copied
    ? (copiedLabel ?? "")
    : (label ?? undefined);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
      className={cn(
        "inline-flex items-center justify-center font-medium",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focus)",
        "disabled:opacity-50 disabled:pointer-events-none",
        "cursor-pointer select-none",
        "transition-all duration-(--duration-fast)",
        copied ? copiedVariant : variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {renderVisual(copied, icon, emoji, size)}
      {displayLabel && <span>{displayLabel}</span>}
    </button>
  );
}
