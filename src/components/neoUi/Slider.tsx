import { type InputHTMLAttributes, useCallback, useId, useRef } from "react";
import { Label } from "../ui";
import { cn } from "@/lib";

export interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    showValue?: boolean;
    beforeValue?: string;
    afterValue?: string;
}

function getTrackBackground(value: number, min: number, max: number) {
    const pct = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, var(--color-primary-400) ${pct}%, var(--surface-secondary) ${pct}%)`;
}

export const Slider = ({
    className,
    label,
    onChange,
    showValue = true,
    beforeValue = "",
    afterValue = "",
    ...props
}: SliderProps) => {
    const ref = useRef<HTMLInputElement>(null);
    const id = useId();

    const updateTrack = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        const min = Number(el.min || 0);
        const max = Number(el.max || 100);
        const val = Number(el.value);
        el.style.setProperty(
            "--track-bg",
            getTrackBackground(val, min, max)
        );
    }, []);

    return (
        <div className={cn("flex flex-col gap-3 pb-3", className)}>
            <div className={cn(
                "w-full max-h-2 flex flex-row items-center",
                (showValue && label) ? "justify-between" : "justify-end"
            )}>
                {label && <Label htmlFor={id}>{label}</Label>}
                {showValue && <Label size="s">{beforeValue}{props.value}{afterValue}</Label>}
            </div>
            <input
                ref={ref}
                id={id}
                type="range"
                {...props}
                onChange={(e) => {
                    updateTrack();
                    onChange?.(e);
                }}
                onLoad={updateTrack}
                className={cn(
                    "border-none outline-none",
                    "w-full bg-transparent appearance-none",
                    "[&::-webkit-slider-runnable-track]:rounded-sm",
                    "[&::-webkit-slider-runnable-track]:bg-(image:--track-bg)",
                    "[&::-webkit-slider-thumb]:appearance-none",
                    "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4",
                    "[&::-webkit-slider-thumb]:rounded-full",
                    "[&::-webkit-slider-thumb]:bg-primary-500",
                    "[&::-webkit-slider-thumb]:-my-1",
                    "[&:focus-visible::-webkit-slider-thumb]:ring-2",
                    "[&:focus-visible::-webkit-slider-thumb]:ring-primary-400",
                    "[&:focus-visible::-webkit-slider-thumb]:ring-offset-2",
                    "[&:focus-visible::-webkit-slider-thumb]:ring-offset-background",
                )}
                style={{
                    "--track-bg": getTrackBackground(
                        Number(props.value ?? props.defaultValue ?? 50),
                        Number(props.min ?? 0),
                        Number(props.max ?? 100)
                    ),
                    ...props.style,
                } as React.CSSProperties}
            />
        </div>
    );
};