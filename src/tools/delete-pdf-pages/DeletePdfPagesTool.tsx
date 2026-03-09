import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PDFDocument } from "pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";
import FileDropZone from "@/components/advanced/FileDropZone";

function parsePageNumbers(input: string, max: number): number[] {
  const set = new Set<number>();
  for (const part of input.split(",").map((s) => s.trim()).filter(Boolean)) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      for (let i = Math.max(1, a); i <= Math.min(max, b); i++) set.add(i);
    } else {
      const n = parseInt(part);
      if (n >= 1 && n <= max) set.add(n);
    }
  }
  return Array.from(set).sort((a, b) => a - b);
}

export default function DeletePdfPagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [deleteInput, setDeleteInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");

  const handleDelete = async () => {
    if (!file || !deleteInput.trim()) return;
    const toDelete = new Set(parsePageNumbers(deleteInput, pageCount));
    if (toDelete.size === 0) { setStatus("No valid pages selected."); return; }
    if (toDelete.size >= pageCount) { setStatus("Can't delete all pages."); return; }

    setIsProcessing(true);
    setStatus("Removing pages...");

    try {
      const buffer = await file.arrayBuffer();
      const src = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const dest = await PDFDocument.create();

      const keepIndices = src.getPageIndices().filter((i) => !toDelete.has(i + 1));
      const pages = await dest.copyPages(src, keepIndices);
      pages.forEach((page) => dest.addPage(page));

      const bytes = await dest.save();
      downloadPdf(bytes, `trimmed_${file.name}`);
      setStatus(`✓ Removed ${toDelete.size} page${toDelete.size > 1 ? "s" : ""}. ${keepIndices.length} remaining.`);
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Failed"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => { setFile(null); setPageCount(0); setDeleteInput(""); setStatus(""); };

  return (
    <div className="space-y-6">
      {!file && <FileDropZone accepts="application/pdf" emoji="📄" onUpload={e => setFile(e.file)} />}
      {file && <Panel>

        <div className="space-y-4">
          <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-(--surface-secondary) border border-(--border-default)">
            <span className="font-emoji">📄</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text(--text-primary) truncate">{file.name}</p>
              <p className="text-xs text-(--text-tertiary)">{formatFileSize(file.size)} · {pageCount} pages</p>
            </div>
            <button onClick={reset} className="text-xs text-(--text-tertiary) hover:text-error transition-colors cursor-pointer">✕</button>
          </div>

          <Input
            label="Pages to Delete"
            value={deleteInput}
            onChange={(e) => setDeleteInput(e.target.value)}
            placeholder="e.g. 2, 5-7"
            helperText={`Enter page numbers to remove. Total pages: ${pageCount}`}
          />
        </div>
      </Panel>}

      {file && (
        <Panel>
          <div className="flex items-center gap-4">
            <Button variant="danger" onClick={handleDelete} disabled={isProcessing || !deleteInput.trim()}>
              {isProcessing ? "Removing…" : "Remove Pages"}
            </Button>
            <Button variant="ghost" onClick={reset}>Choose Another</Button>
          </div>
          {status && (
            <p className={`mt-3 text-sm ${status.startsWith("Error") || status.startsWith("Can't") ? "text-error" : "text(--text-secondary)"}`}>
              {status}
            </p>
          )}
        </Panel>
      )}
    </div>
  );
}
