import { useRef, useState } from "react";
import { Button, FileInfoBar, Label } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PDFDocument } from "pdf-lib";
import { downloadPdf, renderAllPageThumbnails } from "@/tools/_pdf-utils";
import FileDropZone from "@/components/advanced/FileDropZone";
import { Check, CornerDownLeft, Download, Loader2, TriangleAlert, X } from "lucide-react";

export default function RearrangePdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");

  // Ref to the last page card for scroll-to
  const lastPageRef = useRef<HTMLDivElement>(null);
  // Cache the raw buffer so we don't re-read the file on save
  const fileBufferRef = useRef<ArrayBuffer | null>(null);

  const handleFile = async (f: File) => {
    setFile(f);
    setStatus("");
    setIsLoading(true);
    fileBufferRef.current = null;

    try {
      const buffer = await f.arrayBuffer();
      fileBufferRef.current = buffer;
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
      // Re-use cached buffer — avoids a second File.arrayBuffer() read
      const buffer = fileBufferRef.current ?? (await file.arrayBuffer());
      const src = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const dest = await PDFDocument.create();

      const pages = await dest.copyPages(src, pageOrder);
      pages.forEach((page) => dest.addPage(page));

      const bytes = await dest.save();
      downloadPdf(bytes, `reordered_${file.name}`);
      setStatus("Saved reordered PDF!");
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Failed"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetOrder = () => {
    setPageOrder(Array.from({ length: pageCount }, (_, i) => i));
  };

  const resetFile = () => {
    setFile(null);
    setPageCount(0);
    setPageOrder([]);
    setThumbnails([]);
    setStatus("");
    fileBufferRef.current = null;
  };

  const scrollToLastPage = () => {
    lastPageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const isReordered = pageOrder.some((v, i) => v !== i);

  return (
    <div className="space-y-2">
      {!file ? (
        <FileDropZone onUpload={(f) => handleFile(f.file)} accepts=".pdf" emoji="📄" />
      ) : (
        <Panel>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-6 py-8">
              <Loader2 size={32} className="animate-spin text-primary-500" />
              <Label>Loading document...</Label>
            </div>
          ) : (
            <div className="space-y-4">
              <FileInfoBar
                fileName={file.name}
                fileSize={`${file.size}`}
                text={`${pageCount} pages`}
                onReset={resetFile}
              />

              {/* Shortcut to jump past the page grid to the action bar */}
              <Button variant="ghost" onClick={scrollToLastPage}>
                Jump to actions ↓
              </Button>

              {/* Page grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {pageOrder.map((originalIdx, currentPos) => {
                  const isLast = currentPos === pageOrder.length - 1;
                  return (
                    <div
                      key={`page-${originalIdx}`}
                      ref={isLast ? lastPageRef : null}
                      className="relative flex flex-col items-center gap-1.5 p-2 rounded-md border border-(--border-default) bg-(--surface-secondary)"
                    >
                      {thumbnails[originalIdx] && (
                        <img
                          src={thumbnails[originalIdx]}
                          alt={`Page ${originalIdx + 1}`}
                          className="w-full rounded-sm shadow-sm"
                        />
                      )}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => movePage(currentPos, "up")}
                          disabled={currentPos === 0}
                          className="px-1.5 py-0.5 text-xs rounded bg-(--surface-elevated) disabled:opacity-30 hover:bg-primary-500 hover:text-white cursor-pointer disabled:cursor-default"
                          aria-label="Move page left"
                        >
                          ←
                        </button>
                        {/* Show current position (1-indexed), not original page number */}
                        <span className="text-xs font-medium text-(--text-secondary) px-1">
                          {currentPos + 1}
                        </span>
                        <button
                          onClick={() => movePage(currentPos, "down")}
                          disabled={currentPos === pageOrder.length - 1}
                          className="px-1.5 py-0.5 text-xs rounded bg-(--surface-elevated) disabled:opacity-30 hover:bg-primary-500 hover:text-white cursor-pointer disabled:cursor-default"
                          aria-label="Move page right"
                        >
                          →
                        </button>
                      </div>
                      {/* Original page number badge so users know where this page came from */}
                      <Label className="absolute top-1.5 right-1.5 leading-none px-1 py-0.5 rounded bg-(--surface-elevated) text-(--text-tertiary) opacity-70">
                        p{originalIdx + 1}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Panel>
      )}

      {/* Sticky bottom action bar — always visible once a file is loaded */}
      {file && !isLoading && (
        <div className="sticky bottom-0 z-10 bg-(--surface-default)/90 backdrop-blur-sm border-t border-(--border-default) -mx-2 px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              icon={Download}
              variant="primary"
              onClick={handleSave}
              disabled={isProcessing || !isReordered}
            >
              {isProcessing ? "Saving…" : "Save Reordered PDF"}
            </Button>

            <Button
              variant="ghost"
              onClick={resetOrder}
              disabled={!isReordered}
              icon={CornerDownLeft}
            >
              Reset Order
            </Button>

            <span className="flex-1" />

            <Button variant="ghost" onClick={resetFile} icon={X}>
              Change File
            </Button>
          </div>

          {status && status.startsWith("Error") && (
            <div className="mt-2">
              <Label icon={TriangleAlert} variant="danger">{status}</Label>
            </div>
          )}
          {status && !status.startsWith("Error") && (
            <div className="mt-2">
              <Label icon={Check} variant="success">{status}</Label>
            </div>
          )}
        </div>
      )}
    </div>
  );
}