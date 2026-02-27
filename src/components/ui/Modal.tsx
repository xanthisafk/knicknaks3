import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
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

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className={cn(
        "backdrop:bg-[var(--surface-overlay)] backdrop:backdrop-blur-sm",
        "bg-[var(--surface-elevated)] text-[var(--text-primary)]",
        "rounded-[var(--radius-xl)] shadow-2xl",
        "p-0 m-auto w-full max-w-lg",
        "border border-[var(--border-default)]",
        "animate-in fade-in slide-in-from-bottom-4 duration-[var(--duration-normal)]",
        className
      )}
    >
      <div className="p-6">
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold font-[var(--font-heading)]">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)]",
                "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]",
                "hover:bg-[var(--surface-secondary)]",
                "transition-colors duration-[var(--duration-fast)]"
              )}
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </dialog>
  );
}
