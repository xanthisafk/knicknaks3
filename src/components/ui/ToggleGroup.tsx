// ToggleGroup.tsx
interface ToggleGroupProps {
    options: { value: string; label?: string; title?: string }[];
    value: string[];
    onChange: (value: string[]) => void;
    label?: string;
}

export function ToggleGroup({ options, value, onChange, label }: ToggleGroupProps) {
    const toggle = (v: string) =>
        onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

    return (
        <div className="h-full flex flex-col gap-1.5">
            {label && (
                <label className="block text-xs font-medium uppercase tracking-wide text-(--text-tertiary) mb-1.5">
                    {label}
                </label>
            )}
            <div
                className="min-h-full flex border border-(--border-default) rounded-md overflow-hidden h-9"
                role="group"
                aria-label={label}
            >
                {options.map((opt, i) => (
                    <button
                        key={opt.value}
                        type="button"
                        title={opt.title}
                        aria-pressed={value.includes(opt.value)}
                        onClick={() => toggle(opt.value)}
                        className={[
                            "flex-1 min-w-9 px-2.5 font-mono text-xs font-medium cursor-pointer",
                            i < options.length - 1 ? "border-r border-(--border-default)" : "",
                            value.includes(opt.value)
                                ? "bg-primary-500 text-white"
                                : "bg-(--surface-elevated) text-(--text-tertiary) hover:bg-(--surface-secondary) hover:text-(--text-primary)",
                        ].join(" ")}
                    >
                        {opt.label ?? opt.value}
                    </button>
                ))}
            </div>
        </div>
    );
}