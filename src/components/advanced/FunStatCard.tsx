import InfoToolTip from "@/components/advanced/InfoTooltip";

export default function FunStat({
    emoji,
    label,
    value,
    subLabel,
    infoText,
    infoUrl,
    highlight,
}: {
    emoji: string;
    label: string;
    value: string;
    subLabel?: string;
    infoText: string;
    infoUrl?: string;
    highlight?: boolean;
}) {
    highlight = false;
    return (
        <div
            className="flex flex-col gap-2 p-4 rounded-2xl"
            style={
                highlight
                    ? {
                        background: "var(--color-primary-500)",
                        color: "white",
                    }
                    : {
                        background: "var(--surface-secondary)",
                        border: "1px solid var(--border-default)",
                        color: "inherit",
                    }
            }
        >
            <div className="flex items-center gap-2">
                <span className="text-lg leading-none hover:animate-pulse cursor-default font-emoji">{emoji}</span>
                <span
                    className="text-[10px] font-semibold tracking-widest uppercase"
                    style={{ color: highlight ? "rgba(255,255,255,0.65)" : "var(--text-tertiary)" }}
                >
                    {label}
                </span>
                <span className="ml-auto">
                    <InfoToolTip text={infoText} url={infoUrl} />
                </span>
            </div>

            <span
                className="text-2xl font-bold tabular-nums leading-none"
                style={{ color: highlight ? "white" : "var(--color-primary-500)" }}
            >
                {value}
            </span>

            {subLabel && (
                <span
                    className="text-[10px] leading-snug"
                    style={{ color: highlight ? "rgba(255,255,255,0.5)" : "var(--text-tertiary)" }}
                >
                    {subLabel}
                </span>
            )}
        </div>
    );
}