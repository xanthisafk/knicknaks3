import { useContext, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useSelect } from "./UseSelect";
import { LabelRegistryContext } from "./LabelContext";


export interface SelectItemProps {
    value: string;
    children: ReactNode;
    disabled?: boolean;
    icon?: ReactNode | string;
    className?: string;
}

export function SelectItem({ value, children, disabled, icon, className }: SelectItemProps) {
    const { value: selectedValue, onValueChange, activeIndex, setActiveIndex, registerItem, items } = useSelect();
    const labelMap = useContext(LabelRegistryContext);
    const isSelected = selectedValue === value;
    const itemIndex = items.indexOf(value);
    const isActive = activeIndex === itemIndex;

    useEffect(() => {
        registerItem(value);
        if (labelMap && typeof children === "string") {
            labelMap.set(value, children);
        }
    }, [value]);

    // Register string label for display in trigger
    if (labelMap && typeof children === "string") {
        labelMap.set(value, children);
    }

    return (
        <div
            role="option"
            aria-selected={isSelected}
            aria-disabled={disabled}
            onClick={() => !disabled && onValueChange(value)}
            onMouseEnter={() => setActiveIndex(itemIndex)}
            className={cn(
                "relative flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm",
                "text-sm text-(--text-primary) cursor-pointer select-none",
                "transition-colors duration-300",
                "hover:text-primary-400",
                isActive && "text-primary-500",
                isSelected && "font-medium text-primary-600",
                disabled && "opacity-40 cursor-not-allowed pointer-events-none",
                className
            )}
        >
            {/* Icon slot */}
            {icon && (
                <span className="shrink-0 size-4 text-(--text-tertiary) [&_svg]:size-4">
                    {icon}
                </span>
            )}

            {/* Label */}
            <span className="flex-1 truncate">{children}</span>

            {/* Check */}
            {isSelected && (
                <Check size={13} className="shrink-0 text-primary-500" />
            )}
        </div>
    );
}