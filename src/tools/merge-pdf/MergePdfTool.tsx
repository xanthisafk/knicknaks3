import { useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PdfDropZone, PdfFileList } from "@/components/advanced/PdfDropZone";
import { PDFDocument } from "pdf-lib";
import { downloadPdf } from "@/tools/_pdf-utils";

export default function MergePdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setStatus("");
  }, []);

  const handleRemove = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const moveFile = useCallback((from: number, direction: "up" | "down") => {
    setFiles((prev) => {
      const next = [...prev];
      const to = direction === "up" ? from - 1 : from + 1;
      if (to < 0 || to >= next.length) return prev;
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  }, []);

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    setStatus("Merging...");

    try {
      const merged = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((page) => merged.addPage(page));
      }

      const mergedBytes = await merged.save();
      downloadPdf(mergedBytes, "merged.pdf");
      setStatus(`✓ Merged ${files.length} files successfully!`);
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Failed to merge"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Panel>
        <div className="space-y-4">
          <PdfDropZone onFiles={handleFiles} multiple maxFiles={20} />
          <PdfFileList files={files} onRemove={handleRemove} />

          {files.length > 1 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text(--text-primary)">
                Reorder Files
              </h3>
              <div className="space-y-1">
                {files.map((file, i) => (
                  <div
                    key={`order-${file.name}-${i}`}
                    className="flex items-center gap-2 text-sm text(--text-secondary)"
                  >
                    <span className="w-6 text-center text-xs text-[var(--text-tertiary)]">
                      {i + 1}
                    </span>
                    <span className="flex-1 truncate">{file.name}</span>
                    <button
                      onClick={() => moveFile(i, "up")}
                      disabled={i === 0}
                      className="px-1.5 py-0.5 text-xs rounded bg-[var(--surface-secondary)] disabled:opacity-30 hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer disabled:cursor-default"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveFile(i, "down")}
                      disabled={i === files.length - 1}
                      className="px-1.5 py-0.5 text-xs rounded bg-[var(--surface-secondary)] disabled:opacity-30 hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer disabled:cursor-default"
                    >
                      ↓
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Panel>

      <Panel>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleMerge}
            disabled={files.length < 2 || isProcessing}
          >
            {isProcessing ? "Merging..." : `Merge ${files.length} Files`}
          </Button>
          {files.length > 0 && (
            <Button variant="ghost" onClick={() => { setFiles([]); setStatus(""); }}>
              Clear All
            </Button>
          )}
        </div>
        {status && (
          <p className={`mt-3 text-sm ${status.startsWith("Error") ? "text-[var(--color-error)]" : "text(--text-secondary)"}`}>
            {status}
          </p>
        )}
      </Panel>
    </div>
  );
}
