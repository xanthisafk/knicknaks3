import { Button } from "@/components/ui";
import type { ColorStop } from "@/lib/colorHelper/types";

export function StopRow({
    stop,
    onUpdate,
    onRemove,
    canRemove,
}: {
    stop: ColorStop;
    onUpdate: (patch: Partial<ColorStop>) => void;
    onRemove: () => void;
    canRemove: boolean;
}) {
    return (
        <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full shadow-sm overflow-hidden relative cursor-pointer border border-(--border-default) shrink-0">
                <input
                    type="color"
                    value={stop.color}
                    onChange={(e) => onUpdate({ color: e.target.value })}
                    className="absolute -inset-4 w-[200%] h-[200%] cursor-pointer border-0 p-0"
                />
            </div>
            <span className="text-xs font-mono text-(--text-secondary) w-16">{stop.color.toUpperCase()}</span>
            <input
                type="range"
                min={0}
                max={100}
                value={stop.position}
                onChange={(e) => onUpdate({ position: Number(e.target.value) })}
                className="flex-1 h-1.5 rounded-full appearance-none bg-(--border-default) accent-primary-500 cursor-pointer"
            />
            <div className="rounded-sm bg-(--surface-secondary) border border-(--border-default) px-1.5 py-0.5 text-xs font-mono text-(--text-primary) text-center w-12">
                {stop.position}%
            </div>
            {canRemove && (
                <Button
                    onClick={onRemove}
                    title="Remove stop"
                    size="xs"
                    emoji="❌"
                    variant="ghost"
                >
                </Button>
            )}
        </div>
    );
}