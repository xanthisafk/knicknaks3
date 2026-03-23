import { useState, useCallback } from "react";
import { ClipboardCheck, ClipboardCopy } from "lucide-react";
import { pasteFromClipboard } from "@/lib/utils";
import { Button } from "./Button";

type PasteButtonSize = "xs" | "s" | "s" | "m" | "l" | "lg";
type PasteButtonVariant = "primary" | "secondary" | "ghost";

interface PasteButtonProps {
    /** Button label — defaults to "Copy" */
    label?: string;
    /** Duration the "copied" state stays visible (ms) */
    resetMs?: number;
    size?: PasteButtonSize;
    variant?: PasteButtonVariant;
    className?: string;
    onPaste?: (text: string) => void
}

export function PasteButton({
    label = "",
    resetMs = 2000,
    size = "xs",
    variant = "ghost",
    className,
    onPaste
}: PasteButtonProps) {

    const [pasted, setPasted] = useState(false);

    const handlePaste = useCallback(async () => {
        const text = await pasteFromClipboard();
        onPaste?.(text);
        setPasted(true);
        setTimeout(() => setPasted(false), resetMs);
    }, [onPaste]);

    const displayLabel = pasted && label
        ? "Pasted!"
        : label;

    return (
        <Button
            type="button"
            onClick={handlePaste}
            aria-label={pasted ? "Pasted from clipboard" : "Paste from clipboard"}
            className={className}
            variant={variant}
            size={size}
            icon={pasted ? ClipboardCheck : ClipboardCopy}
        >
            <span>{displayLabel}</span>
        </Button>
    );
}
