import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTabsContext } from "./TabContext";

export interface TabProps {
    value: string;
    children: ReactNode;
    disabled?: boolean;
    className?: string;
}

export function Tab({ value, children, disabled, className }: TabProps) {
    const { value: activeValue, onValueChange, baseId, registerTab } = useTabsContext();
    const isActive = activeValue === value;
    const panelId = `${baseId}-panel-${value}`;
    const tabId = `${baseId}-tab-${value}`;

    return (
        <button
            ref={(el) => registerTab(value, el)}
            id={tabId}
            role="tab"
            aria-selected={isActive}
            aria-controls={panelId}
            disabled={disabled}
            onClick={() => !disabled && onValueChange(value)}
            className={cn(
                "relative z-10 flex-1 py-2.5 px-4 rounded-md",
                "text-sm font-medium cursor-pointer",
                "transition-colors duration-0",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1",
                isActive
                    ? "text-(--text-primary)"
                    : "text-(--text-secondary) hover:text-(--text-primary)",
                disabled && "opacity-50 cursor-not-allowed",
                className,
            )}
        >
            {children}
        </button>
    );
}
