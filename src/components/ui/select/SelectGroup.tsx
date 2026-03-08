import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SelectGroupProps {
    children: ReactNode;
    className?: string;
}

export function SelectGroup({ children, className }: SelectGroupProps) {
    return (
        <div role="group" className={cn("py-0.5", className)}>
            {children}
        </div>
    );
}