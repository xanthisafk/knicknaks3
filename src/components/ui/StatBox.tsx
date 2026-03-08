import { cn } from "@/lib";
import { stringHasEmoji, wrapEmojisWithSpan } from "@/lib/emojiHelper";
import { BadgeQuestionMark, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function StatBox({
    label,
    value,
    tooltip,
    url,
    textSize
}: {
    label: string;
    value: string | number;
    tooltip?: string;
    url?: string;
    textSize?: string
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
            {tooltip && (
                <div className={cn(
                    "absolute bottom-full transition-opacity duration-200 mb-2 max-w-80 px-3 py-2 rounded-xl bg-(--surface-primary) border border-(--border-default) text-xs text-(--text-secondary) text-center shadow-lg z-10 pointer-events-none whitespace-pre-line",
                    !visible ? "opacity-0" : "opacity-100"
                )}>
                    {tooltip}
                </div>
            )}

            <span className={`text-${textSize ? textSize : "2xl"} font-bold text-primary-500 tabular-nums`} dangerouslySetInnerHTML={{ __html: wrapEmojisWithSpan(`${value}`) }} />
            <span className="text-xs text-(--text-tertiary) mt-2">{label}</span>
            {url
                ? <ExternalLink className="absolute right-2 top-2 opacity-30 size-3" />
                : tooltip
                    ? <BadgeQuestionMark className="absolute right-2 top-2 opacity-30 size-3" />
                    : ""
            }
        </div>
    );
}