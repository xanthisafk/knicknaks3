import { useState } from "react";
import { Button } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PdfDropZone } from "@/components/advanced/PdfDropZone";
import { PDFDocument } from "pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";

export default function CompressPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ original: number; compressed: number } | null>(null);
  const [status, setStatus] = useState("");

  const handleFile = (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    setStatus("");
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStatus("Compressing...");

    try {
      const buffer = await file.arrayBuffer();
      const original = buffer.byteLength;

      // Load and re-serialize: copies only used objects into a fresh document
      const src = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const dest = await PDFDocument.create();

      const pages = await dest.copyPages(src, src.getPageIndices());
      pages.forEach((page) => dest.addPage(page));

      // Copy basic metadata
      const title = src.getTitle();
      if (title) dest.setTitle(title);
      const author = src.getAuthor();
      if (author) dest.setAuthor(author);

      const compressedBytes = await dest.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const compressed = compressedBytes.length;
      setResult({ original, compressed });

      if (compressed < original) {
        downloadPdf(compressedBytes, `compressed_${file.name}`);
        const pct = ((1 - compressed / original) * 100).toFixed(1);
        setStatus(`✓ Reduced by ${pct}% (${formatFileSize(original)} → ${formatFileSize(compressed)})`);
      } else {
        downloadPdf(compressedBytes, `compressed_${file.name}`);
        setStatus("ℹ️ File is already well-optimized. Saved re-encoded copy.");
      }
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Failed"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); setStatus(""); };

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
                <p className="text-sm font-medium text-(--text-primary) truncate">{file.name}</p>
                <p className="text-xs text-(--text-tertiary)">{formatFileSize(file.size)}</p>
              </div>
              <button onClick={reset} className="text-xs text-(--text-tertiary) hover:text-error transition-colors cursor-pointer">✕</button>
            </div>

            {result && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-md bg-(--surface-secondary) text-center">
                  <p className="text-xs text-(--text-tertiary)">Original</p>
                  <p className="text-lg font-semibold text-(--text-primary)">{formatFileSize(result.original)}</p>
                </div>
                <div className="p-3 rounded-md bg-(--surface-secondary) text-center">
                  <p className="text-xs text-(--text-tertiary)">Compressed</p>
                  <p className="text-lg font-semibold text-(--text-primary)">{formatFileSize(result.compressed)}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Panel>

      {file && (
        <Panel>
          <div className="flex items-center gap-4">
            <Button onClick={handleCompress} disabled={isProcessing}>
              {isProcessing ? "Compressing..." : "Compress & Download"}
            </Button>
            <Button variant="ghost" onClick={reset}>Choose Another</Button>
          </div>
          {status && (
            <p className={`mt-3 text-sm ${status.startsWith("Error") ? "text-error" : "text-(--text-secondary)"}`}>
              {status}
            </p>
          )}
        </Panel>
      )}
    </div>
  );
}
