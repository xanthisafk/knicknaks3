import { useContext } from "react";
import { useSelect } from "./UseSelect";
import { cn } from "@/lib/utils";
import { LabelRegistryContext } from "./LabelContext";

export interface SelectValueProps {
    placeholder?: string;
    className?: string;
}

export function SelectValue({ placeholder, className }: SelectValueProps) {
    const { value } = useSelect();

    // Find the label of the selected item by inspecting the DOM after render
    // We use a simpler approach: expose label via item registry
    const labelRef = useContext(LabelRegistryContext);
    const label = labelRef?.get(value) ?? value;

    return (
        <span className={cn("truncate flex-1 text-left", !label && "text-(--text-tertiary)", className)}>
            {label || placeholder}
        </span>
    );
}