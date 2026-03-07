import { useEffect, useRef, useState } from "react";
import { Panel } from "../layout";
import formatMime from "@/lib/formatMime";

export type FileDropZoneProps = {
    maxSize?: number;
    accepts?: string;
    emoji?: string;
    onUpload?: (payload: { file: File; }) => void;
};

export default function FileDropZone({
    maxSize,
    onUpload,
    accepts = "*",
    emoji = "📁",
    ...rest

}: FileDropZoneProps & React.InputHTMLAttributes<HTMLInputElement>) {
    const ref = useRef<HTMLInputElement>(null);
    const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [dragging, setDragging] = useState(false);
    const [_, setFile] = useState<File>();
    const [warning, setWarning] = useState("");

    useEffect(() => {
        return () => {
            if (warningTimer.current) clearTimeout(warningTimer.current);
        };
    }, [warningTimer]);

    function isValidType(file: File) {
        if (accepts === "*") return true;

        const acceptedTypes = accepts.split(",");

        return acceptedTypes.some(type => {
            type = type.trim();

            if (type === "image/*") {
                return file.type.startsWith("image/");
            }

            if (type.startsWith(".")) {
                return file.name.toLowerCase().endsWith(type);
            }

            return file.type === type;
        });
    }

    function showWarning(msg: string) {
        setWarning(msg);

        if (warningTimer.current) {
            clearTimeout(warningTimer.current);
        }

        warningTimer.current = setTimeout(() => {
            setWarning("");
        }, 5000);
    }

    function handleFile(f?: File) {
        if (!f) return;

        if (!isValidType(f)) {
            showWarning("Please upload a valid file");
            return;
        }

        if (maxSize && f.size > maxSize * 1024 * 1024) {
            showWarning(`Image must be smaller than ${maxSize}MB`);
            return;
        }

        setFile(f);

        onUpload?.({ file: f });
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragging(false);

        const f = e.dataTransfer.files?.[0];
        handleFile(f);
    }

    return (
        <Panel>
            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setDragging(false);
                    }
                }}
                onDrop={handleDrop}
                onClick={() => ref.current?.click()}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        ref.current?.click();
                    }
                }}
                className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all select-none ${dragging
                    ? "border-primary-500 bg-primary-500/5"
                    : "border-(--border-default) hover:border-primary-500/60 hover:bg-(--surface-bg)"
                    } focus:border-primary-500`}
            >
                <span className="text-4xl">{emoji}</span>

                <div className="text-center">
                    <p className={`text-sm font-medium text-(--text-primary) ${warning ? "text-red-500" : ""}`}>
                        {
                            warning
                                ? warning
                                : "Drop a file here, or click to browse"
                        }
                    </p>
                    <span className="text-xs">Accepts: {formatMime(accepts)}</span>
                </div>

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
            </div>
        </Panel>
    );
}