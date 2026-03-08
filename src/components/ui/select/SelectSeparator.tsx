import { cn } from "@/lib/utils";

export interface SelectSeparatorProps {
    className?: string;
}

export function SelectSeparator({ className }: SelectSeparatorProps) {
    return (
        <div
            role="separator"
            className={cn("my-1 mx-1 h-px bg-(--border-default)", className)}
        />
    );
}