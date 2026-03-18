import { useState } from "react";
import { Button, Label } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PdfDropZone } from "@/components/advanced/PdfDropZone";
import { PDFDocument } from "pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";
import { Check, CornerDownLeft, Download, TriangleAlert, X } from "lucide-react";
import StatBox from "@/components/ui/StatBox";
import { cn } from "@/lib";

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
        setStatus(`Reduced by ${pct}% (${formatFileSize(original)} → ${formatFileSize(compressed)})`);
      } else {
        downloadPdf(compressedBytes, `compressed_${file.name}`);
        setStatus("File is already well-optimized. Saved re-encoded copy.");
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
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-(--surface-secondary) border border-(--border-default)">
              <span className="font-emoji">📄</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-(--text-primary) truncate">{file.name}</p>
                <p className="text-xs text-(--text-tertiary)">{formatFileSize(file.size)}</p>
              </div>
              <Button variant="ghost" onClick={reset} size="sm" icon={X} />
            </div>
          </div>
        )}
      </Panel>

      {file && (
        <Panel>
          <div className="flex items-center gap-4">
            <Button onClick={handleCompress} disabled={isProcessing} icon={Download}>
              {isProcessing ? "Compressing..." : "Compress & Download"}
            </Button>
            <Button variant="ghost" onClick={reset} icon={CornerDownLeft}>Choose Another</Button>
          </div>

        </Panel>
      )}

      {result && (
        <>
          <Panel className="space-y-2">
            {status && (
              <Label
                className={cn(
                  status.startsWith("Error") && "text-error!",
                  status.startsWith("File") && "text-warning-300!",
                  status.startsWith("Reduced") && "text-success!",
                )}
                icon={
                  status.startsWith("Error") ? X : status.startsWith("File") ? TriangleAlert : Check
                }
              >
                {status}
              </Label>
            )}
            <div className="flex flex-col md:flex-row gap-2 grow">
              <div className="grow"><StatBox textSize="5xl" label="Original" value={formatFileSize(result.original)} /></div>
              <div className="grow"><StatBox textSize="5xl" label="Compressed" value={formatFileSize(result.compressed)} /></div>
            </div>
          </Panel>

        </>
      )}
    </div>
  );
}
