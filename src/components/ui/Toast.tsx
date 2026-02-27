import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// ===== Toast Types =====
type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// ===== Provider =====
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info", duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ===== Individual Toast =====
const typeStyles: Record<ToastType, string> = {
  success: "border-l-[var(--color-success)]",
  error: "border-l-[var(--color-error)]",
  warning: "border-l-[var(--color-warning)]",
  info: "border-l-[var(--color-info)]",
};

const typeIcons: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => onDismiss(toast.id), toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 px-4 py-3 rounded-[var(--radius-lg)]",
        "bg-[var(--surface-elevated)] text-[var(--text-primary)]",
        "border border-[var(--border-default)] border-l-4",
        "shadow-lg",
        "animate-in slide-in-from-right-full duration-[var(--duration-normal)]",
        typeStyles[toast.type]
      )}
    >
      <span className="text-sm mt-0.5">{typeIcons[toast.type]}</span>
      <p className="text-sm flex-1">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] text-sm"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
