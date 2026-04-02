import { cn } from "@/lib";
import type { HTMLAttributes } from "react";

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function Panel({ className, children, ...props }: PanelProps) {
    return (
        <div
            className={cn(
                "bg-(--surface-elevated) rounded-lg",
                "border border-(--border-default)",
                "space-y-3",
                "p-4 md:p-6",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}