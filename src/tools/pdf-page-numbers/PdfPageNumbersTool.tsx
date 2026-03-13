import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PdfDropZone } from "@/components/advanced/PdfDropZone";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";

type VPos = "top" | "bottom";
type HPos = "left" | "center" | "right";

export default function PdfPageNumbersTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [vPos, setVPos] = useState<VPos>("bottom");
  const [hPos, setHPos] = useState<HPos>("center");
  const [fontSize, setFontSize] = useState(12);
  const [startNum, setStartNum] = useState(1);
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
      setPageCount(pdf.getPageCount());
    } catch {
      setStatus("Error: Could not read PDF.");
    }
  };

  const handleAddNumbers = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStatus("Adding page numbers...");

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      const margin = 36;

      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const text = String(startNum + i);
        const textWidth = font.widthOfTextAtSize(text, fontSize);

        let x: number;
        if (hPos === "left") x = margin;
        else if (hPos === "right") x = width - margin - textWidth;
        else x = (width - textWidth) / 2;

        const y = vPos === "bottom" ? margin : height - margin - fontSize;

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
      });

      const bytes = await pdf.save();
      downloadPdf(bytes, `numbered_${file.name}`);
      setStatus(`✓ Added page numbers to ${pages.length} pages!`);
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Failed"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => { setFile(null); setPageCount(0); setStatus(""); };

  const posButton = (label: string, active: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-[var(--radius-md)] border transition-colors cursor-pointer ${active
        ? "bg-[var(--color-primary-500)] text-white border-[var(--color-primary-500)]"
        : "bg-[var(--surface-secondary)] text(--text-primary) border-[var(--border-default)] hover:border-[var(--border-hover)]"
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-2">
      <Panel>
        {!file ? (
          <PdfDropZone onFiles={handleFile} />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--surface-secondary)] border border-[var(--border-default)]">
              <span>📄</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text(--text-primary) truncate">{file.name}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{formatFileSize(file.size)} · {pageCount} pages</p>
              </div>
              <button onClick={reset} className="text-xs text-[var(--text-tertiary)] hover:text-[var(--color-error)] transition-colors cursor-pointer">✕</button>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text(--text-primary)">Vertical Position</label>
              <div className="flex gap-2">
                {posButton("Top", vPos === "top", () => setVPos("top"))}
                {posButton("Bottom", vPos === "bottom", () => setVPos("bottom"))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text(--text-primary)">Horizontal Position</label>
              <div className="flex gap-2">
                {posButton("Left", hPos === "left", () => setHPos("left"))}
                {posButton("Center", hPos === "center", () => setHPos("center"))}
                {posButton("Right", hPos === "right", () => setHPos("right"))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Font Size"
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Math.max(6, parseInt(e.target.value) || 12))}
                min={6}
                max={72}
              />
              <Input
                label="Start Number"
                type="number"
                value={startNum}
                onChange={(e) => setStartNum(parseInt(e.target.value) || 1)}
                min={0}
              />
            </div>
          </div>
        )}
      </Panel>

      {file && (
        <Panel>
          <div className="flex items-center gap-4">
            <Button onClick={handleAddNumbers} disabled={isProcessing}>
              {isProcessing ? "Adding..." : "Add Page Numbers & Download"}
            </Button>
            <Button variant="ghost" onClick={reset}>Choose Another</Button>
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
