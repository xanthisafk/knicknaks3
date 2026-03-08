import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TabsContext } from "./TabContext";

export interface TabsProps {
    value: string;
    onValueChange: (v: string) => void;
    children: ReactNode;
    className?: string;
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
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

    return (
        <TabsContext.Provider value={{ value, onValueChange, baseId, registerTab, indicatorStyle }}>
            <div className={cn("flex flex-col gap-4", className)}>
                {children}
            </div>
        </TabsContext.Provider>
    );
}