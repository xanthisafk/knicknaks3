import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import { Button } from "./Button";

type CopyButtonSize = "xs" | "s" | "s" | "m" | "l" | "lg";
type CopyButtonVariant = "primary" | "secondary" | "ghost";

interface CopyButtonProps {
  /** The text to copy to clipboard */
  text: string;
  /** Button label — defaults to "Copy" */
  label?: string;
  /** Duration the "copied" state stays visible (ms) */
  resetMs?: number;
  size?: CopyButtonSize;
  variant?: CopyButtonVariant;
  className?: string;
}

export function CopyButton({
  text,
  label = "",
  resetMs = 2000,
  size = "xs",
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

  const displayLabel = copied && label
    ? "Copied!"
    : label;

  return (
    <Button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
      className={className}
      variant={variant}
      size={size}
      icon={copied ? Check : Copy}
    >
      <span>{displayLabel}</span>
    </Button>
  );
}
