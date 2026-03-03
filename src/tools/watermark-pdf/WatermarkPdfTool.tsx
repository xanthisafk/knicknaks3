import { useState } from "react";
import { Button, Input, Slider } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PdfDropZone } from "@/components/advanced/PdfDropZone";
import { PDFDocument, StandardFonts, rgb, degrees as pdfDegrees } from "pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";

export default function WatermarkPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [watermarkText, setWatermarkText] = useState("DRAFT");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.15);
  const [rotation, setRotation] = useState(-45);
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

  const handleApply = async () => {
    if (!file || !watermarkText.trim()) return;
    setIsProcessing(true);
    setStatus("Applying watermark...");

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      const pages = pdf.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);

        page.drawText(watermarkText, {
          x: (width - textWidth) / 2,
          y: height / 2,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity,
          rotate: pdfDegrees(rotation),
        });
      }

      const bytes = await pdf.save();
      downloadPdf(bytes, `watermarked_${file.name}`);
      setStatus(`✓ Watermark applied to ${pages.length} pages!`);
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Failed"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => { setFile(null); setPageCount(0); setStatus(""); };

  return (
    <div className="space-y-6">
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

            <Input
              label="Watermark Text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              placeholder="e.g. CONFIDENTIAL, DRAFT, SAMPLE"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Font Size"
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Math.max(8, parseInt(e.target.value) || 48))}
                min={8}
                max={200}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text(--text-primary)">
                  Opacity: {Math.round(opacity * 100)}%
                </label>
                <Slider
                  min={0.01}
                  max={1}
                  step={0.01}
                  value={opacity}
                  onChange={setOpacity}
                />
              </div>
              <Input
                label="Rotation (°)"
                type="number"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value) || 0)}
                min={-180}
                max={180}
              />
            </div>

            {/* Preview */}
            <div className="relative w-full h-32 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-white overflow-hidden flex items-center justify-center">
              <span
                style={{
                  fontSize: `${Math.min(fontSize * 0.5, 32)}px`,
                  opacity,
                  transform: `rotate(${rotation}deg)`,
                  color: "#808080",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                {watermarkText || "Preview"}
              </span>
            </div>
          </div>
        )}
      </Panel>

      {file && (
        <Panel>
          <div className="flex items-center gap-4">
            <Button onClick={handleApply} disabled={isProcessing || !watermarkText.trim()}>
              {isProcessing ? "Applying…" : "Apply Watermark & Download"}
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
