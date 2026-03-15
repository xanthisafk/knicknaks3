import { Icon, type LucideIcon } from "lucide-react";
import { useRef, useState } from "react";

export type InlineFileDropProps = {
    accepts?: string;
    maxSize?: number;
    emoji?: string;
    onUpload?: (payload: { file: File }) => void;
};

export default function InlineFileDrop({
    accepts = "*",
    maxSize,
    emoji = "📎",
    onUpload,
    ...rest
}: InlineFileDropProps & React.InputHTMLAttributes<HTMLInputElement>) {
    const ref = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [warning, setWarning] = useState("");

    function isValidType(file: File) {
        if (accepts === "*") return true;

        const accepted = accepts.split(",");

        return accepted.some((type) => {
            type = type.trim();

            if (type === "image/*") return file.type.startsWith("image/");
            if (type.startsWith(".")) return file.name.toLowerCase().endsWith(type);

            return file.type === type;
        });
    }

    function handleFile(f?: File) {
        if (!f) return;

        if (!isValidType(f)) {
            setWarning("Invalid file");
            return;
        }

        if (maxSize && f.size > maxSize * 1024 * 1024) {
            setWarning(`>${maxSize}MB`);
            return;
        }

        setWarning("");
        onUpload?.({ file: f });
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files?.[0]);
    }

    return (
        <span
            onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => ref.current?.click()}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") ref.current?.click();
            }}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs cursor-pointer select-none transition
        ${dragging
                    ? "border-primary-500 bg-primary-500/10"
                    : "border-(--border-default) hover:border-primary-500/60"
                }`}
        >
            <span className="font-emoji">{emoji}</span> Upload file

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
