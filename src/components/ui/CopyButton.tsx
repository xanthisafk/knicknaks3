import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import { Button, type IconPosition } from "./Button";

type CopyButtonSize = "xs" | "s" | "s" | "m" | "l" | "lg";
type CopyButtonVariant = "primary" | "secondary" | "ghost";

interface CopyButtonProps {
  text: string;
  label?: string;
  resetMs?: number;
  size?: CopyButtonSize;
  iconPos?: IconPosition;
  confirmCopy?: boolean;
  variant?: CopyButtonVariant;
  className?: string;
}

export function CopyButton({
  text,
  label = "",
  resetMs = 2000,
  size = "xs",
  variant = "ghost",
  iconPos = "left",
  confirmCopy = true,
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

  const displayLabel = (copied && confirmCopy) && label
    ? "Copied!"
    : label;

  return (
    <Button
      type="button"
      onClick={(e) => { e.stopPropagation(); handleCopy() }}
      aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
      className={className}
      variant={variant}
      size={size}
      icon={copied ? Check : Copy}
      iconPos={iconPos}
    >
      <span>{displayLabel}</span>
    </Button>
  );
}
