import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTabsContext } from "./TabContext";

export interface TabPanelProps {
    value: string;
    children: ReactNode;
    className?: string;
}

export function TabPanel({ value, children, className }: TabPanelProps) {
    const { value: activeValue, baseId } = useTabsContext();
    const panelId = `${baseId}-panel-${value}`;
    const tabId = `${baseId}-tab-${value}`;
    const isActive = activeValue === value;

    if (!isActive) return null;

    return (
        <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            tabIndex={0}
            className={cn("focus-visible:outline-none", className)}
        >
            {children}
        </div>
    );
}