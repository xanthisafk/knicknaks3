import { Tooltip } from "@/components/ui";
import { Info } from "lucide-react";

export interface FieldLabelProps {
    children: React.ReactNode;
    tooltip?: string;
    htmlFor?: string;
}

export function FieldLabel({ children, tooltip, htmlFor }: FieldLabelProps) {
    return (
        <label htmlFor={htmlFor} className="flex items-center gap-1 text-sm font-medium text-(--text-primary) mb-1">
            {children}
            {tooltip && <Tooltip content={tooltip}><Info /></Tooltip>}
        </label>
    );
}