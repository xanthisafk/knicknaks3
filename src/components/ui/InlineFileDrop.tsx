import { useId, useRef, useState } from "react";
import { Label } from "./Label";
import { Emoji } from "./Emoji";
import { TriangleAlert } from "lucide-react";

export type InlineFileDropSize = "default" | "full";

export type InlineFileDropProps = {
    accepts?: string;
    maxSize?: number;
    emoji?: string;
    variant?: InlineFileDropSize;
    label?: string;
    text?: string;
    onUpload?: (payload: { file: File }) => void;
};

function cn(...classes: (string | false | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}

export function InlineFileDrop({
    accepts = "*",
    maxSize,
    emoji = "📎",
    variant = "default",
    text = "Upload File",
    label,
    onUpload,
    ...rest
}: InlineFileDropProps & React.InputHTMLAttributes<HTMLInputElement>) {
    const ref = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [warning, setWarning] = useState("");
    const id = useId();

    function isValidType(file: File) {
        if (accepts === "*") return true;
        return accepts.split(",").some((raw) => {
            const type = raw.trim();
            if (type === "image/*") return file.type.startsWith("image/");
            if (type.startsWith(".")) return file.name.toLowerCase().endsWith(type);
            return file.type === type;
        });
    }

    function handleFile(f?: File) {
        if (!f) return;
        if (!isValidType(f)) { setWarning("Invalid file"); return; }
        if (maxSize && f.size > maxSize * 1024 * 1024) { setWarning(`>${maxSize}MB`); return; }
        setWarning("");
        onUpload?.({ file: f });
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files?.[0]);
    }

    function handleClick() { ref.current?.click(); }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") ref.current?.click();
    }

    const isFull = variant === "full";

    return (
        <div className={cn("flex flex-col gap-3", isFull ? "w-full" : "inline-flex")}>
            {label && <div className="max-h-4 h-4">
                <Label htmlFor={id}>{label}</Label>
            </div>}
            <span
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={handleClick}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                aria-labelledby={id}
                className={cn(
                    // Match Input's wrapperBase tokens 1-to-1
                    "flex items-center gap-2 justify-start",
                    "rounded-md border px-3 py-2",
                    "bg-(--surface-elevated)",
                    "border-(--border-default)",
                    "hover:border-(--border-hover)",
                    "focus-within:border-(--border-focus) focus-within:ring-2 focus-within:ring-(--ring-color)",
                    "transition-colors duration-(--duration-fast)",
                    "text-sm cursor-pointer select-none",
                    isFull ? "w-full" : "inline-flex",
                    dragging && "border-primary-500 bg-primary-500/10",
                )}
            >
                <Emoji>{emoji}</Emoji>
                <Label className="truncate">{text}</Label>

                {warning && (
                    <Label variant="danger" icon={TriangleAlert}>{warning}</Label>
                )}

                <input
                    id={id}
                    ref={ref}
                    type="file"
                    accept={accepts}
                    className="hidden"
                    {...rest}
                    onChange={(e) => {
                        handleFile(e.target.files?.[0]);
                        e.target.value = "";
                    }}
                />
            </span>
        </div>
    );
}