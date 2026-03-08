import { copyToClipboard } from "@/lib/utils";
import { useState } from "react";

export function ResultRow({ label, value }: { label: string; value: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <div className="flex items-center justify-between py-2 px-3 rounded-md bg-(--surface-secondary)">
            <span className="text-xs font-medium text(--text-secondary) min-w-[120px]">{label}</span>
            <span className="text-sm font-mono text(--text-primary) flex-1 ml-3 break-all">
                {value || "—"}
            </span>
            {value && (
                <button
                    onClick={async () => {
                        await copyToClipboard(value);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                    }}
                    className="text-xs text-(--text-tertiary) hover:text(--text-primary) transition-colors cursor-pointer ml-2"
                >
                    {copied ? "✓" : "Copy"}
                </button>
            )}
        </div>
    );
}