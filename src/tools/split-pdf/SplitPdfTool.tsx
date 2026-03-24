import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PdfDropZone } from "@/components/advanced/PdfDropZone";
import { PDFDocument } from "pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";

/** Parse page ranges like "1,3,5-8" into zero-indexed array */
function parsePageRanges(input: string, maxPages: number): number[] {
  const pages = new Set<number>();
  const parts = input.split(",").map((s) => s.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      const start = Math.max(1, parseInt(startStr));
      const end = Math.min(maxPages, parseInt(endStr));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) pages.add(i - 1);
      }
    } else {
      const p = parseInt(part);
      if (!isNaN(p) && p >= 1 && p <= maxPages) pages.add(p - 1);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

export default function SplitPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rangeInput, setRangeInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");

  const handleFile = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setStatus("");
    try {
      const buffer = await f.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdf.getPageCount();
      setPageCount(count);
      setRangeInput(`1-${count}`);
    } catch {
      setStatus("Error: Could not read PDF.");
    }
  };

  const handleExtract = async () => {
    if (!file || !rangeInput.trim()) return;
    const indices = parsePageRanges(rangeInput, pageCount);
    if (indices.length === 0) {
      setStatus("No valid pages selected.");
      return;
    }

    setIsProcessing(true);
    setStatus("Extracting...");

    try {
      const buffer = await file.arrayBuffer();
      const src = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const dest = await PDFDocument.create();
      const pages = await dest.copyPages(src, indices);
      pages.forEach((page) => dest.addPage(page));
      const bytes = await dest.save();
      downloadPdf(bytes, `split_${file.name}`);
      setStatus(`✓ Extracted ${indices.length} page${indices.length > 1 ? "s" : ""} successfully!`);
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Failed to split"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <Panel>
        {!file ? (
          <PdfDropZone onFiles={handleFile} />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-(--surface-secondary) border border-(--border-default)">
              <span>📄</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text(--text-primary) truncate">{file.name}</p>
                <p className="text-xs text-(--text-tertiary)">{formatFileSize(file.size)} · {pageCount} pages</p>
              </div>
              <button
                onClick={() => { setFile(null); setPageCount(0); setRangeInput(""); setStatus(""); }}
                className="text-xs text-(--text-tertiary) hover:text-(--color-error) transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <Input
              label="Page Ranges"
              value={rangeInput}
              onChange={(e) => setRangeInput(e.target.value)}
              placeholder="e.g. 1-3, 5, 7-10"
              helperText={`Enter page numbers or ranges. Total pages: ${pageCount}`}
            />
          </div>
        )}
      </Panel>

      {file && (
        <Panel>
          <div className="flex items-center gap-4">
            <Button onClick={handleExtract} disabled={isProcessing || !rangeInput.trim()}>
              {isProcessing ? "Extracting..." : "Extract Pages"}
            </Button>
            <Button variant="ghost" onClick={() => { setFile(null); setPageCount(0); setRangeInput(""); setStatus(""); }}>
              Choose Another File
            </Button>
          </div>
          {status && (
            <p className={`mt-3 text-sm ${status.startsWith("Error") ? "text-(--color-error)" : "text(--text-secondary)"}`}>
              {status}
            </p>
          )}
        </Panel>
      )}
    </div>
  );
}
