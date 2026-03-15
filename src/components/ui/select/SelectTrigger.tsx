import type { ReactNode, KeyboardEvent } from "react";
import { useSelect } from "./UseSelect";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectTriggerProps {
    className?: string;
    children?: ReactNode;
}


export function SelectTrigger({ className, children }: SelectTriggerProps) {
    const { open, setOpen, triggerId, listboxId, activeIndex, setActiveIndex, items } = useSelect();

    function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            if (!open) { setOpen(true); return; }
            setActiveIndex(
                e.key === "ArrowDown"
                    ? Math.min(activeIndex + 1, items.length - 1)
                    : Math.max(activeIndex - 1, 0)
            );
        }
        if (e.key === "Escape") setOpen(false);
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(!open);
        }
    }

    return (
        <button
            id={triggerId}
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            onClick={() => setOpen(!open)}
            onKeyDown={handleKeyDown}
            className={cn(
                "group flex items-center justify-between gap-2",
                "w-full px-3 py-2 text-sm",
                "rounded-md border border-(--border-default)",
                "bg-(--surface-elevated) text-(--text-primary)",
                "hover:border-(--border-hover) hover:shadow-(--shadow-sm)",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:border-(--border-focus)",
                open && "border-(--border-focus) ring-2 ring-(--ring-color) shadow-(--shadow-sm)",
                className
            )}
        >
            {children}
            <ChevronDown
                size={14}
                className={cn(
                    "shrink-0 text-(--text-tertiary) transition-transform duration-300",
                    open && "rotate-180"
                )}
            />
        </button>
    );
}