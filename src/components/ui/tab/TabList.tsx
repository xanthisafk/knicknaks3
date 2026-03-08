import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTabsContext } from "./TabContext";

export interface TabListProps {
    children: ReactNode;
    className?: string;
}

export function TabList({ children, className }: TabListProps) {
    const { indicatorStyle } = useTabsContext();

    return (
        <div
            role="tablist"
            className={cn(
                "relative flex p-1 rounded-lg",
                "bg-(--surface-secondary) border border-(--border-default)",
                className,
            )}
        >
            {/* Sliding pill indicator */}
            <span
                aria-hidden
                className={cn(
                    "absolute top-1 bottom-1 rounded-md",
                    "bg-white dark:bg-(--surface-primary)",
                    "border border-(--border-default) shadow-sm",
                    "transition-all duration-200 ease-in-out",
                    // Use will-change so only transform/width animate, not color
                )}
                style={{
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                    // Offset the parent's padding (p-1 = 4px)
                    transform: "translateX(-4px)",
                }}
            />
            {children}
        </div>
    );
}
