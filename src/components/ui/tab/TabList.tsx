import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTabsContext } from "./TabContext";

export interface TabListProps {
    children: ReactNode;
    className?: string;
}

/**
 * Vertical padding per size tier — chosen so the combined pill height
 * matches the Input component's rendered height at the same tier:
 *
 *   sm  → h-8  (32px)   p-0.5 = 2px top+bottom, pill = 28px  ← Input sm
 *   md  → h-10 (40px)   p-1   = 4px top+bottom, pill = 32px  ← Input md (default)
 *   lg  → h-12 (48px)   p-1.5 = 6px top+bottom, pill = 36px  ← Input lg
 *
 * Tab text size also scales with the size tier.
 */
const listPadding = {
    sm: "p-0.5",
    md: "p-1",
    lg: "p-1.5",
} as const;

const indicatorOffset = {
    sm: "-2px",   // translateX offset matches p-0.5 = 2px
    md: "-4px",   // translateX offset matches p-1   = 4px
    lg: "-6px",   // translateX offset matches p-1.5 = 6px
} as const;

export function TabList({ children, className }: TabListProps) {
    const { indicatorStyle, size, labelId } = useTabsContext();

    return (
        <div
            role="tablist"
            aria-labelledby={labelId}
            className={cn(
                "relative flex rounded-lg",
                "bg-(--surface-secondary) border border-(--border-default)",
                listPadding[size],
                className,
            )}
        >
            {/* Sliding pill indicator */}
            <span
                aria-hidden
                className={cn(
                    "absolute top-(--pad) bottom-(--pad) rounded-md",
                    "bg-white dark:bg-(--surface-primary)",
                    "border border-(--border-default) shadow-sm",
                    "transition-[left,width] duration-200 ease-in-out",
                )}
                style={{
                    "--pad": size === "sm" ? "2px" : size === "lg" ? "6px" : "4px",
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                    transform: `translateX(${indicatorOffset[size]})`,
                } as React.CSSProperties}
            />
            {children}
        </div>
    );
}