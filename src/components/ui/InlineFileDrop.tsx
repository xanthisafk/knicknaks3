import { useRef, useState } from "react";
import { Label } from "./Label";
import { Emoji } from "./Emoji";

export type InlineFileDropSize = "default" | "full";

export type InlineFileDropProps = {
    accepts?: string;
    maxSize?: number;
    emoji?: string;
    variant?: InlineFileDropSize;
    label?: string;
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
    label = "Upload file",
    onUpload,
    ...rest
}: InlineFileDropProps & React.InputHTMLAttributes<HTMLInputElement>) {
    const ref = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [warning, setWarning] = useState("");

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
        <span
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={handleClick}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className={cn(
                "items-center gap-1 px-2 py-2 rounded-md border text-sm cursor-pointer select-none transition",
                isFull ? "flex w-full justify-center" : "inline-flex",
                dragging
                    ? "border-primary-500 bg-primary-500/10"
                    : "border-(--border-default) hover:border-primary-500/60"
            )}
        >
            <Emoji>{emoji}</Emoji><Label>{label}</Label>

            {warning && (
                <span className="text-red-500 text-[10px]">{warning}</span>
            )}

            <input
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
    );
}