import { useEffect, useRef, useState } from "react";
import { Panel } from "../layout";
import formatMime from "@/lib/formatMime";

type SingleProps = {
    multiple?: false;
    onUpload?: (payload: { file: File }) => void;
};

type MultipleProps = {
    multiple: true;
    onUpload?: (payload: { files: File[] }) => void;
};

export type FileDropZoneProps = (SingleProps | MultipleProps) & {
    maxSize?: number;
    accepts?: string;
    emoji?: string;
};


export default function FileDropZone({
    maxSize,
    onUpload,
    accepts = "*",
    emoji = "📁",
    multiple = false,
    ...rest
}: FileDropZoneProps & React.InputHTMLAttributes<HTMLInputElement>) {
    const ref = useRef<HTMLInputElement>(null);
    const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [dragging, setDragging] = useState(false);
    const [_, setFiles] = useState<File[]>([]);
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

    function handleFiles(incoming: File[]) {
        if (incoming.length === 0) return;

        const invalidType = incoming.find(f => !isValidType(f));
        if (invalidType) {
            showWarning("Please upload a valid file");
            return;
        }

        const oversized = incoming.find(f => maxSize && f.size > maxSize * 1024 * 1024);
        if (oversized) {
            showWarning(`Files must be smaller than ${maxSize}MB`);
            return;
        }

        setFiles(incoming);

        if (multiple) {
            (onUpload as ((payload: { files: File[] }) => void) | undefined)?.({ files: incoming });
        } else {
            (onUpload as ((payload: { file: File }) => void) | undefined)?.({ file: incoming[0] });
        }
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragging(false);

        const dropped = Array.from(e.dataTransfer.files ?? []);
        handleFiles(multiple ? dropped : dropped.slice(0, 1));
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
                className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center gap-3 cursor-pointer transition-color duration-200 select-none ${dragging
                    ? "border-primary-500 bg-primary-500/5"
                    : "border-(--border-default) hover:border-primary-500/60 hover:bg-(--surface-bg)"
                    } focus:border-primary-500`}
            >
                <span className="text-4xl font-emoji">{emoji}</span>

                <div className="text-center">
                    <p className={`text-sm font-medium text-(--text-primary) ${warning ? "text-red-500" : ""}`}>
                        {warning
                            ? warning
                            : multiple
                                ? "Drop files here, or click to browse"
                                : "Drop a file here, or click to browse"
                        }
                    </p>
                    <span className="text-xs">Accepts: {formatMime(accepts)}</span>
                </div>

                <input
                    ref={ref}
                    type="file"
                    accept={accepts}
                    multiple={multiple}
                    className="hidden"
                    {...rest}
                    onChange={(e) => {
                        const picked = Array.from(e.target.files ?? []);
                        handleFiles(multiple ? picked : picked.slice(0, 1));
                        e.target.value = "";
                    }}
                />
            </div>
        </Panel>
    );
}