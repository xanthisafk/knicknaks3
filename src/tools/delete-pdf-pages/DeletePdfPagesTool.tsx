import { useEffect, useMemo, useState } from "react";
import { Button, Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PDFDocument } from "pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";
import FileDropZone from "@/components/advanced/FileDropZone";
import { PdfPreviewPanel } from "@/components/advanced/Pdf";
import { parsePageSelection, pageNumbersToRangeString, getPdfPageCount, isPdf, selectPages, QuickSelect } from "@/lib/pdfHelper";

export default function DeletePdfPagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [deleteInput, setDeleteInput] = useState("");
  const parsedDeleteList = useMemo(
    () => parsePageSelection(deleteInput, pageCount).pageNumbers,
    [deleteInput, pageCount]
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");

  const handleUpload = async (file: File) => {
    if (!isPdf(file)) {
      setStatus("Please upload a valid PDF file.");
      return;
    }
    setFile(file);
    setPageCount(await getPdfPageCount(file));
  }

  const handleDelete = async () => {
    if (!file || !deleteInput.trim()) return;
    const toDelete = new Set(parsePageSelection(deleteInput, pageCount).pageNumbers);
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

  const handlePageClick = (num: number) => {
    const parse = parsePageSelection(deleteInput, pageCount).pageNumbers;
    if (parse.includes(num)) {
      const index = parse.indexOf(num);
      if (index > -1) {
        parse.splice(index, 1);
      }
    } else {
      parse.push(num);
    }
    setDeleteInput(pageNumbersToRangeString(parse));
  }

  return (
    <div className="space-y-2">
      {!file && <FileDropZone accepts="application/pdf" emoji="📄" onUpload={e => handleUpload(e.file)} />}
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

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text(--text-primary)">Quick Select</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 py-2 rounded-md">
              {QuickSelect.map((item) => (
                <Button
                  variant="secondary"
                  key={item.key}
                  onClick={() => {
                    setDeleteInput(
                      pageNumbersToRangeString(item.select(pageCount))
                    );
                  }}
                  className="w-full text-xs"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-4">
              <Button variant="danger" onClick={handleDelete} disabled={isProcessing || !deleteInput.trim()}>
                {isProcessing ? "Removing..." : "Remove Pages and save file"}
              </Button>
              <Button variant="ghost" onClick={reset}>Choose Another</Button>
            </div>
            {status && (
              <p className={`mt-3 text-sm ${status.startsWith("Error") || status.startsWith("Can't") ? "text-error" : "text(--text-secondary)"}`}>
                {status}
              </p>
            )}
          </div>
        </div>
      </Panel>}

      {file &&
        <PdfPreviewPanel
          file={file}
          onClear={reset}
          onPageClick={handlePageClick}
          renderOverlay={(pageNo, _) => {
            return parsedDeleteList.includes(pageNo) ? (
              <div className="absolute inset-0 flex items-center justify-center rounded-sm bg-red-500/40 pointer-events-none">
                <span className="text-white text-2xl font-bold font-emoji">❌</span>
              </div>
            ) : null
          }
          }
        />
      }
    </div>
  );
}
