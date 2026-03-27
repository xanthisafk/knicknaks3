import type { ReactNode } from "react";
import { useState, useRef, useId, useEffect } from "react";
import { SelectContext } from "./UseSelect";
import { Label } from "../Label";

export interface SelectProps {
    value?: string;
    defaultValue?: string;
    label?: string;
    onValueChange?: (value: string) => void;
    children: ReactNode;
}

export function Select({ value, defaultValue = "", label, onValueChange, children }: SelectProps) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [items, setItems] = useState<string[]>([]);

    const controlled = value !== undefined;
    const currentValue = controlled ? value : internalValue;

    const id = useId();
    const triggerId = `select-trigger-${id}`;
    const listboxId = `select-listbox-${id}`;

    const registeredRef = useRef<Set<string>>(new Set());

    function registerItem(val: string) {
        if (!registeredRef.current.has(val)) {
            registeredRef.current.add(val);
            setItems((prev) => [...prev, val]);
        }
    }

    function handleValueChange(val: string) {
        if (!controlled) setInternalValue(val);
        onValueChange?.(val);
        setOpen(false);
    }

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        function handle(e: MouseEvent) {
            const trigger = document.getElementById(triggerId);
            const listbox = document.getElementById(listboxId);
            if (!trigger?.contains(e.target as Node) && !listbox?.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [open, triggerId, listboxId]);

    return (
        <SelectContext.Provider value={{
            value: currentValue,
            onValueChange: handleValueChange,
            open,
            setOpen,
            triggerId,
            listboxId,
            activeIndex,
            setActiveIndex,
            registerItem,
            items,
        }}>
            <div className="flex flex-col gap-1.5 grow">
                {label && <Label className="max-h-4">{label}</Label>}
                <div className="relative inline-block w-full">
                    {children}
                </div>
            </div>
        </SelectContext.Provider>
    );
}