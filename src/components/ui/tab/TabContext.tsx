import { createContext, useContext } from "react";
import type { TabsSize } from "./Tabs";

export interface TabsContextValue {
    value: string;
    onValueChange: (v: string) => void;
    baseId: string;
    registerTab: (value: string, el: HTMLButtonElement | null) => void;
    indicatorStyle: { left: number; width: number };
    /** Controls tab height / text size — matches Input size tiers */
    size: TabsSize;
    /** ID of the label element rendered by <Tabs>, if any */
    labelId?: string;
}

export const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext() {
    const ctx = useContext(TabsContext);
    if (!ctx) throw new Error("<Tab> must be used inside <Tabs>");
    return ctx;
}