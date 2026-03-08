import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TabPanelsProps {
    children: ReactNode;
    className?: string;
}

export function TabPanels({ children, className }: TabPanelsProps) {
    return <div className={cn(className)}>{children}</div>;
}
