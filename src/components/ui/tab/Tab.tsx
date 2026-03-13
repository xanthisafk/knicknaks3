import { type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTabsContext } from "./TabContext";

export type IconPosition = "start" | "end";

export interface TabProps {
    value: string;
    children: ReactNode;
    disabled?: boolean;
    className?: string;
    /** Leading / trailing icon (lucide) */
    icon?: LucideIcon;
    /** Leading / trailing emoji */
    emoji?: string;
    /** Whether the icon/emoji appears before or after the label. Default: "start" */
    iconPosition?: IconPosition;
}

/** Padding + text size per size tier */
const tabSizing = {
    sm: "py-1 px-3 text-xs",
    md: "py-2 px-4 text-sm",
    lg: "py-2.5 px-5 text-sm",
} as const;

function Visual({
    icon: Icon,
    emoji,
    className,
}: {
    icon?: LucideIcon;
    emoji?: string;
    className?: string;
}) {
    if (Icon) {
        return (
            <Icon
                size={14}
                aria-hidden="true"
                className={cn("shrink-0", className)}
            />
        );
    }
    if (emoji) {
        return (
            <span
                className={cn("font-emoji text-sm leading-none shrink-0", className)}
                aria-hidden="true"
            >
                {emoji}
            </span>
        );
    }
    return null;
}

export function Tab({
    value,
    children,
    disabled,
    className,
    icon,
    emoji,
    iconPosition = "start",
}: TabProps) {
    const { value: activeValue, onValueChange, baseId, registerTab, size } = useTabsContext();
    const isActive = activeValue === value;
    const panelId = `${baseId}-panel-${value}`;
    const tabId = `${baseId}-tab-${value}`;

    const visual = (
        <Visual
            icon={icon}
            emoji={emoji}
            className={isActive ? "text-(--text-primary)" : "text-(--text-tertiary)"}
        />
    );

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
                "relative z-10 flex-1 flex items-center justify-center gap-1.5",
                "font-medium cursor-pointer rounded-md",
                "transition-colors duration-0",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1",
                isActive
                    ? "text-(--text-primary)"
                    : "text-(--text-secondary) hover:text-(--text-primary)",
                disabled && "opacity-50 cursor-not-allowed",
                tabSizing[size],
                className,
            )}
        >
            {iconPosition === "start" && visual}
            {children}
            {iconPosition === "end" && visual}
        </button>
    );
}