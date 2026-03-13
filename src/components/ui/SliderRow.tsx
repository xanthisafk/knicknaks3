import { CornerDownLeft, type LucideIcon } from "lucide-react";
import { Button } from "./Button";

export interface SliderRowProps {
    label?: string;
    value: number;
    min?: number;
    max?: number;
    unit?: string;
    isDefault?: boolean;
    onChange?: (v: number) => void;
    onReset?: () => void;
}

export default function SliderRow({ label, value, min, max, unit, isDefault, onChange, onReset }: SliderRowProps) {
    return (
        <div className="grid grid-cols-[110px_1fr_60px_28px] items-center gap-3">
            <span className="text-xs text-(--text-tertiary) font-medium uppercase tracking-wider">
                {label}
            </span>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange?.(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none bg-(--border-default) accent-primary-500 cursor-pointer"
            />
            <div className="rounded-sm bg-(--surface-secondary) border border-(--border-default) px-1.5 py-0.5 text-xs font-mono text-(--text-primary) text-center">
                {value}{unit}
            </div>
            {!isDefault && (
                <Button
                    onClick={onReset}
                    title="Reset"
                    size="xs"
                    variant="ghost"
                    icon={CornerDownLeft}
                />
            )}
        </div>
    );
}