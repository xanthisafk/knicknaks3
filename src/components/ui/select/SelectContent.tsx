import { type ReactNode, useState } from "react";
import { LabelRegistryContext } from "./LabelContext";
import { useSelect } from "./UseSelect";
import { cn } from "@/lib/utils";

export interface SelectContentProps {
    className?: string;
    children: ReactNode;
    align?: "start" | "end" | "center";
}

export function SelectContent({ className, children, align = "start" }: SelectContentProps) {
    const { open, listboxId } = useSelect();
    const [labelMap] = useState(() => new Map<string, string>());

    if (!open) return (
        <LabelRegistryContext.Provider value={labelMap}>
            <div style={{ display: "none" }}>{children}</div>
        </LabelRegistryContext.Provider>
    );

    return (
        <LabelRegistryContext.Provider value={labelMap}>
            <div
                id={listboxId}
                role="listbox"
                className={cn(
                    "absolute z-50 mt-1.5 min-w-full w-max max-w-xs",
                    "rounded-lg border border-(--border-default)",
                    "bg-(--surface-elevated) shadow-(--shadow-lg)",
                    "overflow-hidden",
                    "animate-in fade-in-0 zoom-in-95 slide-in-from-top-1",
                    align === "end" && "right-0",
                    align === "center" && "left-1/2 -translate-x-1/2",
                    className
                )}
                style={{
                    animationDuration: "150ms",
                }}
            >
                <div className="p-1 max-h-64 overflow-y-auto overscroll-contain">
                    {children}
                </div>
            </div>
        </LabelRegistryContext.Provider>
    );
}