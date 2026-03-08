import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SelectLabelProps {
    children: ReactNode;
    className?: string;
}

export function SelectLabel({ children, className }: SelectLabelProps) {
    return (
        <div
            className={cn(
                "px-2.5 py-1.5 text-xs font-semibold uppercase tracking-widest",
                "text-(--text-tertiary) select-none",
                className
            )}
        >
            {children}
        </div>
    );
}