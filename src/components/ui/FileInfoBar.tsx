import { CornerDownLeft } from "lucide-react";
import { Button } from "./Button";
import { Emoji } from "./Emoji";
import { Label } from "./Label";

interface FileInfoBarProps {
    emoji?: string;
    fileName: string;
    fileSize?: string;
    text?: string;
    onReset?: () => void;
}

export function FileInfoBar({
    emoji = "📄",
    fileName,
    fileSize,
    text,
    onReset
}: FileInfoBarProps) {
    const reset = () => {
        onReset?.();
    };
    return (
        <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-(--surface-secondary) border border-(--border-default)">
            <Emoji>{emoji}</Emoji>
            <div className="flex-1 flex flex-col gap-1 min-w-0">
                <p className="text-sm font-medium text-(--text-secondary) truncate">{fileName}</p>
                {fileSize && (
                    <Label size="xs">{fileSize} {text && `· ${text}`}</Label>
                )}
            </div>
            {onReset && <Button variant="ghost" size="sm" onClick={reset} icon={CornerDownLeft}>Change</Button>}
        </div>
    );
}