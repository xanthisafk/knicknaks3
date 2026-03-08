import { createContext, useContext } from "react";

export interface RadioGroupContextValue {
    name: string;
    value: string;
    onValueChange: (value: string) => void;
    disabled?: boolean;
    size: "sm" | "md" | "lg";
    error?: string;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function useRadioGroup() {
    const ctx = useContext(RadioGroupContext);
    if (!ctx) throw new Error("<Radio> must be used inside <RadioGroup>");
    return ctx;
}