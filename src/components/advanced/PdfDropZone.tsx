import { useCallback, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/tools/_pdf-utils";

interface PdfDropZoneProps {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  children?: ReactNode;
  className?: string;
}

export function PdfDropZone({
  onFiles,
  multiple = false,
  accept = ".pdf",
  maxFiles = 20,
  children,
  className,
}: PdfDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type === "application/pdf" || f.name.endsWith(".pdf")
      );
      if (files.length > 0) {
        onFiles(multiple ? files.slice(0, maxFiles) : [files[0]]);
      }
    },
    [onFiles, multiple, maxFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length > 0) {
        onFiles(multiple ? files.slice(0, maxFiles) : [files[0]]);
      }
      e.target.value = "";
    },
    [onFiles, multiple, maxFiles]
  );

  return (
    <label
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-8",
        "rounded-lg border-2 border-dashed",
        "transition-colors duration-(--duration-fast) cursor-pointer",
        isDragOver
          ? "border-primary-500 bg-primary-500/5"
          : "border-(--border-default) hover:border-(--border-hover) bg-(--surface-secondary)/50",
        className
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      {children ?? (
        <>
          <span className="text-3xl">📄</span>
          <span className="text-sm font-medium text-(--text-primary)">
            Drop {multiple ? "PDF files" : "a PDF"} here or click to browse
          </span>
          <span className="text-xs text-(--text-tertiary)">
            {multiple ? `Up to ${maxFiles} files` : "Single PDF file"}
          </span>
        </>
      )}
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
    </label>
  );
}

/** Display a list of loaded PDF files with remove button */
interface PdfFileListProps {
  files: File[];
  onRemove: (index: number) => void;
  onReorder?: (from: number, to: number) => void;
}

export function PdfFileList({ files, onRemove }: PdfFileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      {files.map((file, i) => (
        <div
          key={`${file.name}-${i}`}
          className="flex items-center gap-3 px-3 py-2 rounded-md bg-(--surface-secondary) border border-(--border-default)"
        >
          <span className="text-sm font-emoji">📄</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-(--text-primary) truncate">
              {file.name}
            </p>
            <p className="text-xs text-(--text-tertiary)">
              {formatFileSize(file.size)}
            </p>
          </div>
          <button
            onClick={() => onRemove(i)}
            className="text-xs text-(--text-tertiary) hover:text-error transition-colors cursor-pointer"
            aria-label={`Remove ${file.name}`}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
