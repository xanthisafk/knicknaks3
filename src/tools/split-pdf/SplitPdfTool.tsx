import { useState } from "react";
import { Button, FileInfoBar, Input, Label } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PDFDocument } from "pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";
import FileDropZone from "@/components/advanced/FileDropZone";
import { useToast } from "@/hooks/useToast";
import { Container } from "@/components/layout/Primitive";
import { Split } from "lucide-react";

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
  const toast = useToast();

  const handleFile = async (file: File) => {
    if (!file) return;
    setFile(file);
    setStatus("");
    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdf.getPageCount();
      setPageCount(count);
      setRangeInput(`1-${count}`);
    } catch {
      const msg = "Could not read PDF."
      setStatus(`Error: ${msg}`);
      toast.error(msg, 10);
    }
  };

  const handleExtract = async () => {
    if (!file || !rangeInput.trim()) return;
    const indices = parsePageRanges(rangeInput, pageCount);
    if (indices.length === 0) {
      const msg = "No valid pages selected.";
      setStatus(`Error: ${msg}`);
      toast.error(msg, 10);
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
      const msg = `Extracted ${indices.length} page${indices.length > 1 ? "s" : ""} successfully!`;
      setStatus(msg);
      toast.success(msg, 10);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to split";
      setStatus(`Error: ${msg}`);
      toast.error(msg, 10);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setRangeInput("");
    setStatus("");
  }

  return (
    <Container>
      {!file ? (
        <FileDropZone accepts=".pdf" emoji="📄" onUpload={f => handleFile(f.file)} />
      ) : (
        <Panel className="space-y-3">
          <FileInfoBar
            fileName={file.name}
            fileSize={formatFileSize(file.size)}
            text={`${pageCount} pages`}
            onReset={reset}
          />
          <Input
            label="Page Ranges"
            value={rangeInput}
            onChange={(e) => setRangeInput(e.target.value)}
            placeholder="e.g. 1-3, 5, 7-10"
            helperText={`Enter page numbers or ranges. Total pages: ${pageCount}`}
          />
          <Button onClick={handleExtract}
            icon={Split}
            disabled={isProcessing || !rangeInput.trim()}>
            {isProcessing ? "Splitting..." : "Split PDF"}
          </Button>
          {status && (
            status.startsWith("Error")
              ? <Label variant="danger">{status}</Label>
              : <Label variant="success">{status}</Label>
          )}
        </Panel>
      )}
    </Container>
  );
}
