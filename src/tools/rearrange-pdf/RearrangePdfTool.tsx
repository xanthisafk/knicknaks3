import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PdfDropZone } from "@/components/advanced/PdfDropZone";
import { PDFDocument } from "pdf-lib";
import { downloadPdf, renderAllPageThumbnails, formatFileSize } from "@/tools/_pdf-utils";

export default function RearrangePdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");

  const handleFile = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setStatus("");
    setIsLoading(true);

    try {
      const buffer = await f.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdf.getPageCount();
      setPageCount(count);
      setPageOrder(Array.from({ length: count }, (_, i) => i));

      const thumbs = await renderAllPageThumbnails(f, 0.25);
      setThumbnails(thumbs);
    } catch {
      setStatus("Error: Could not read PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  const movePage = (from: number, direction: "up" | "down") => {
    const to = direction === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= pageOrder.length) return;
    setPageOrder((prev) => {
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  };

  const handleSave = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStatus("Saving...");

    try {
      const buffer = await file.arrayBuffer();
      const src = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const dest = await PDFDocument.create();

      const pages = await dest.copyPages(src, pageOrder);
      pages.forEach((page) => dest.addPage(page));

      const bytes = await dest.save();
      downloadPdf(bytes, `reordered_${file.name}`);
      setStatus("✓ Saved reordered PDF!");
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Failed"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setPageOrder([]);
    setThumbnails([]);
    setStatus("");
  };

  const isReordered = pageOrder.some((v, i) => v !== i);

  return (
    <div className="space-y-6">
      <Panel>
        {!file ? (
          <PdfDropZone onFiles={handleFile} />
        ) : isLoading ? (
          <div className="text-center py-8">
            <p className="text-sm text(--text-secondary)">Loading page thumbnails…</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text(--text-primary)">{file.name}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{formatFileSize(file.size)} · {pageCount} pages</p>
              </div>
              <button onClick={reset} className="text-xs text-[var(--text-tertiary)] hover:text-[var(--color-error)] transition-colors cursor-pointer">✕ Clear</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {pageOrder.map((originalIdx, currentPos) => (
                <div
                  key={`page-${originalIdx}`}
                  className="relative flex flex-col items-center gap-1.5 p-2 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-secondary)]"
                >
                  {thumbnails[originalIdx] && (
                    <img
                      src={thumbnails[originalIdx]}
                      alt={`Page ${originalIdx + 1}`}
                      className="w-full rounded-[var(--radius-sm)] shadow-sm"
                    />
                  )}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => movePage(currentPos, "up")}
                      disabled={currentPos === 0}
                      className="px-1.5 py-0.5 text-xs rounded bg-[var(--surface-elevated)] disabled:opacity-30 hover:bg-[var(--color-primary-500)] hover:text-white transition-colors cursor-pointer disabled:cursor-default"
                    >
                      ←
                    </button>
                    <span className="text-xs font-medium text(--text-secondary) px-1">
                      {originalIdx + 1}
                    </span>
                    <button
                      onClick={() => movePage(currentPos, "down")}
                      disabled={currentPos === pageOrder.length - 1}
                      className="px-1.5 py-0.5 text-xs rounded bg-[var(--surface-elevated)] disabled:opacity-30 hover:bg-[var(--color-primary-500)] hover:text-white transition-colors cursor-pointer disabled:cursor-default"
                    >
                      →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Panel>

      {file && !isLoading && (
        <Panel>
          <div className="flex items-center gap-4">
            <Button onClick={handleSave} disabled={isProcessing || !isReordered}>
              {isProcessing ? "Saving…" : "Save Reordered PDF"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setPageOrder(Array.from({ length: pageCount }, (_, i) => i))}
              disabled={!isReordered}
            >
              Reset Order
            </Button>
          </div>
          {status && (
            <p className={`mt-3 text-sm ${status.startsWith("Error") ? "text-[var(--color-error)]" : "text(--text-secondary)"}`}>
              {status}
            </p>
          )}
        </Panel>
      )}
    </div>
  );
}
