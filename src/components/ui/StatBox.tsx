import { stringHasEmoji } from "@/lib/emojiHelper";
import { useState } from "react";

export default function StatBox({
    label,
    value,
    tooltip,
    url,
}: {
    label: string;
    value: string | number;
    tooltip?: string;
    url?: string;
}) {
    const [visible, setVisible] = useState(false);

    return (
        <div
            className={"relative flex flex-col items-center justify-center gap-1 p-4 rounded-xl bg-(--surface-secondary) border border-(--border-default)" + (url ? " cursor-pointer" : tooltip ? " cursor-help" : "")}
            onMouseEnter={() => {
                if (tooltip) setVisible(true);
            }}
            onMouseLeave={() => {
                if (tooltip) setVisible(false);
            }}
            onClick={() => {
                if (url) window.open(url, "_blank");
            }}
        >
            {visible && tooltip && (
                <div className="absolute bottom-full mb-2 w-max px-3 py-2 rounded-xl bg-(--surface-primary) border border-(--border-default) text-xs text-(--text-secondary) text-center shadow-lg z-10 pointer-events-none whitespace-pre-line">
                    {tooltip}
                </div>
            )}

            <span className={`text-2xl font-bold text-primary-500 tabular-nums ${(typeof value === "string" && stringHasEmoji(value)) && "font-emoji"}`}>{value}</span>
            <span className="text-xs text-(--text-tertiary)">{label}</span>
        </div>
    );
}