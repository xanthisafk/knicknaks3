import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { TabsContext } from "./TabContext";
import { Label } from "../Label";

export type TabsSize = "sm" | "md" | "lg";

export interface TabsProps {
    value: string;
    onValueChange: (v: string) => void;
    children: ReactNode;
    className?: string;
    /** Optional label rendered above the tab list */
    label?: string;
    /** Label icon (lucide) */
    labelIcon?: LucideIcon;
    /** Label emoji */
    labelEmoji?: string;
    /** Tooltip shown on the label info icon */
    labelTooltip?: string;
    /**
     * Controls the height / text size of the tab list.
     * Matches the effective size of <Input> at each tier:
     *   sm  → compact (same height as a small input)
     *   md  → default (same height as a default input)   ← default
     *   lg  → spacious (same height as a large input)
     */
    size?: TabsSize;
}

export function Tabs({
    value,
    onValueChange,
    children,
    className,
    label,
    labelIcon,
    labelEmoji,
    labelTooltip,
    size = "md",
}: TabsProps) {
    const baseId = useId();
    const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

    function registerTab(tabValue: string, el: HTMLButtonElement | null) {
        if (el) {
            tabRefs.current.set(tabValue, el);
        } else {
            tabRefs.current.delete(tabValue);
        }
    }

    useLayoutEffect(() => {
        const el = tabRefs.current.get(value);
        if (!el) return;
        const parent = el.parentElement;
        if (!parent) return;
        const parentRect = parent.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        setIndicatorStyle({
            left: elRect.left - parentRect.left,
            width: elRect.width,
        });
    }, [value]);

    // Derive a stable label id from the baseId so <TabList> can reference it
    const labelId = label ? `${baseId}-label` : undefined;

    return (
        <TabsContext.Provider
            value={{ value, onValueChange, baseId, registerTab, indicatorStyle, size, labelId }}
        >
            <div className={cn("flex flex-col gap-1.5", className)}>
                {label && (
                    <Label
                        id={labelId}
                        text={label}
                        icon={labelIcon}
                        emoji={labelEmoji}
                        tooltip={labelTooltip}
                    />
                )}
                {children}
            </div>
        </TabsContext.Provider>
    );
}