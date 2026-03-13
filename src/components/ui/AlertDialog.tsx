import { useEffect, useRef, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface AlertAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "warning" | "danger" | "ghost";
}

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  titleText: string;
  bodyText: string | ReactNode;
  primaryAction?: AlertAction;
  secondaryAction?: AlertAction;
  icon?: LucideIcon;
  emoji?: string;
  footerText?: string;
  className?: string;
}

function renderVisual(icon?: LucideIcon, emoji?: string) {
  const Icon = icon;
  if (Icon) {
    return (
      <div
        className={cn(
          "flex items-center justify-center",
          "w-10 h-10 rounded-full",
          "bg-primary-100 text-primary-600",
          "shrink-0"
        )}
      >
        <Icon size={20} aria-hidden="true" />
      </div>
    );
  }
  if (emoji) {
    return (
      <div
        className={cn(
          "flex items-center justify-center",
          "w-10 h-10 rounded-full",
          "bg-(--surface-secondary)",
          "shrink-0"
        )}
      >
        <span className="font-emoji text-xl leading-none" aria-hidden="true">
          {emoji}
        </span>
      </div>
    );
  }
  return null;
}

export function AlertDialog({
  isOpen,
  onClose,
  titleText,
  bodyText,
  primaryAction,
  secondaryAction,
  icon,
  emoji,
  footerText,
  className,
}: AlertDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      dialog.showModal();
    } else {
      dialog.close();
      previousFocus.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const visual = renderVisual(icon, emoji);

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className={cn(
        "backdrop:bg-(--surface-overlay) backdrop:backdrop-blur-sm",
        "bg-(--surface-elevated) text-(--text-primary)",
        "rounded-xl shadow-2xl",
        "p-0 m-auto w-full max-w-md",
        "border border-(--border-default)",
        className
      )}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-body"
      role="alertdialog"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          {visual}
          <div className="flex-1 min-w-0">
            <h2
              id="alert-dialog-title"
              className="text-lg font-semibold leading-snug font-heading"
            >
              {titleText}
            </h2>
            <div
              id="alert-dialog-body"
              className="mt-2 text-sm text-(--text-secondary) leading-relaxed"
            >
              {typeof bodyText === "string" ? <p>{bodyText}</p> : bodyText}
            </div>
          </div>
        </div>

        {/* Actions */}
        {(primaryAction || secondaryAction) && (
          <div className="flex items-center justify-end gap-3 mt-6">
            {secondaryAction && (
              <Button
                variant={secondaryAction.variant ?? "ghost"}
                size="s"
                onClick={secondaryAction.onClick}
                text={secondaryAction.label}
              />
            )}
            {primaryAction && (
              <Button
                variant={primaryAction.variant ?? "primary"}
                size="s"
                onClick={primaryAction.onClick}
                text={primaryAction.label}
              />
            )}
          </div>
        )}

        {/* Footer text */}
        {footerText && (
          <p className="mt-4 pt-3 border-t border-(--border-default) text-xs text-(--text-tertiary) text-center">
            {footerText}
          </p>
        )}
      </div>
    </dialog>
  );
}
