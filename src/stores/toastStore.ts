import { atom } from "nanostores";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration: number;
}

export const $toasts = atom<Toast[]>([]);

export function addToast(
    message: string,
    type: ToastType = "info",
    duration = 5
) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    $toasts.set([...$toasts.get(), { id, message, type, duration }]);
}

export function removeToast(id: string) {
    $toasts.set($toasts.get().filter((t) => t.id !== id));
}