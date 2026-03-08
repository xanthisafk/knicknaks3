import { createContext, useContext } from "react";

export interface SelectContextValue {
    value: string;
    onValueChange: (value: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    triggerId: string;
    listboxId: string;
    activeIndex: number;
    setActiveIndex: (i: number) => void;
    registerItem: (value: string) => void;
    items: string[];
}

export const SelectContext = createContext<SelectContextValue | null>(null);

export function useSelect() {
    const ctx = useContext(SelectContext);
    if (!ctx) throw new Error("Select compound components must be used inside <Select>");
    return ctx;
}