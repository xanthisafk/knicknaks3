import { createContext, useContext } from "react";

export interface TabsContextValue {
    value: string;
    onValueChange: (v: string) => void;
    baseId: string;
    registerTab: (value: string, el: HTMLButtonElement | null) => void;
    indicatorStyle: { left: number; width: number };
}

export const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext() {
    const ctx = useContext(TabsContext);
    if (!ctx) throw new Error("<Tab> must be used inside <Tabs>");
    return ctx;
}