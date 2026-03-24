import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { $toasts, removeToast, type Toast, type ToastType } from "@/stores/toastStore";

// ===== Per-type config using theme tokens =====
const typeConfig: Record<
    ToastType,
    { icon: typeof CheckCircle2; borderColor: string; iconColor: string }
> = {
    success: {
        icon: CheckCircle2,
        borderColor: "border-l-[var(--color-success-500)]",
        iconColor: "text-[var(--color-success-500)]",
    },
    error: {
        icon: XCircle,
        borderColor: "border-l-[var(--color-danger-500)]",
        iconColor: "text-[var(--color-danger-500)]",
    },
    warning: {
        icon: AlertTriangle,
        borderColor: "border-l-[var(--color-warning-500)]",
        iconColor: "text-[var(--color-warning-500)]",
    },
    info: {
        icon: Info,
        borderColor: "border-l-[var(--color-info-500)]",
        iconColor: "text-[var(--color-info-500)]",
    },
};

// ===== Toaster — drop this once anywhere in your layout =====
export function Toaster() {
    const toasts = useStore($toasts);

    return (
        <div
            className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
            role="region"
            aria-label="Notifications"
        >
            {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} />
            ))}
        </div>
    );
}

// ===== Individual Toast =====
function ToastItem({ toast }: { toast: Toast }) {
    const duration = toast.duration * 1000;
    useEffect(() => {
        if (!toast.duration) return;
        const timer = setTimeout(() => removeToast(toast.id), duration);
        return () => clearTimeout(timer);
    }, [toast.id, toast.duration]);

    const config = typeConfig[toast.type];
    const Icon = config.icon;

    return (
        <div
            role="alert"
            className={cn(
                "pointer-events-auto",
                "flex items-start gap-3 px-4 py-3 rounded-lg",
                "bg-(--surface-elevated) text-(--text-primary)",
                "border border-(--border-default) border-l-4",
                config.borderColor,
                "shadow-lg",
                "animate-in slide-in-from-right-full duration-(--duration-normal)"
            )}
        >
            <Icon size={16} className={cn("mt-0.5 shrink-0", config.iconColor)} aria-hidden />
            <p className="text-sm flex-1 text-(--text-primary)">{toast.message}</p>
            <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-(--text-tertiary) hover:text-(--text-primary) transition-colors shrink-0"
                aria-label="Dismiss notification"
            >
                <X size={14} />
            </button>
        </div>
    );
}