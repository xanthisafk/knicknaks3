import { copyToClipboard } from "@/lib/utils";
import { useState } from "react";
import { Button, Label } from "../ui";
import { Check, Copy, LucideArrowUpRightFromSquare } from "lucide-react";

export function ResultRow({ label, value, externalLink }: { label: string; value: string, externalLink?: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <div className="flex items-center justify-between py-2 px-3 rounded-md bg-(--surface-secondary)">
            <Label size="xs">{label}</Label>
            <span className="text-sm font-mono text(--text-primary) flex-1 ml-3 break-all">
                {value || "—"}
            </span>
            {externalLink && (
                <Button
                    onClick={async () => {
                        window.open(externalLink, "_blank");
                    }}
                    variant="ghost"
                    icon={LucideArrowUpRightFromSquare}
                    size="xs"
                />
            )}
            {value && (
                <Button
                    onClick={async () => {
                        await copyToClipboard(value);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                    }}
                    variant="ghost"
                    icon={copied ? Check : Copy}
                    size="xs"
                />
            )}
        </div>
    );
}