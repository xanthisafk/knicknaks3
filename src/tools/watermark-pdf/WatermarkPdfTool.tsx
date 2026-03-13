// WatermarkPdfTool.tsx
import { useState, useEffect, useRef } from "react";
import { Button, Input, Slider } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PdfDropZone } from "@/components/advanced/PdfDropZone";
import { PDFDocument, StandardFonts, rgb, degrees as pdfDegrees } from "pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";

const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

function usePdfJs() {
  const [pdfjsLib, setPdfjsLib] = useState(null);
  useEffect(() => {
    if (window.pdfjsLib) { setPdfjsLib(window.pdfjsLib); return; }
    const script = document.createElement("script");
    script.src = PDFJS_CDN;
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
      setPdfjsLib(window.pdfjsLib);
    };
    document.head.appendChild(script);
  }, []);
  return pdfjsLib;
}

function PdfPageCanvas({ pdfDoc, pageNum, watermarkText, fontSize, opacity, rotation }) {
  const canvasRef = useRef(null);
  const [pageSize, setPageSize] = useState({ width: 1, height: 1 });

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    let cancelled = false;
    (async () => {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.2 });
      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      if (!cancelled) setPageSize({ width: viewport.width, height: viewport.height });
      await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    })();
    return () => { cancelled = true; };
  }, [pdfDoc, pageNum]);

  // Scale watermark font relative to page width (page is rendered at scale 1.2)
  const scaledFont = Math.min(fontSize * 1.2, pageSize.width * 0.4);

  return (
    <div className="relative inline-block border border-[var(--border-default)] rounded-[var(--radius-md)] overflow-hidden shadow-md bg-white">
      <canvas ref={canvasRef} style={{ display: "block", maxWidth: "100%", height: "auto" }} />
      {/* Watermark overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontSize: `${scaledFont}px`,
            opacity,
            transform: `rotate(-${rotation}deg)`,
            color: "#808080",
            fontWeight: 700,
            whiteSpace: "nowrap",
            userSelect: "none",
            letterSpacing: "0.05em",
          }}
        >
          {watermarkText || " "}
        </span>
      </div>
      <div className="absolute top-1.5 left-2 text-xs font-medium text-[var(--text-tertiary)] bg-white/70 rounded px-1">
        Page {pageNum}
      </div>
    </div>
  );
}

export default function WatermarkPdfTool() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [watermarkText, setWatermarkText] = useState("DRAFT");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.15);
  const [rotation, setRotation] = useState(45);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [pdfDoc, setPdfDoc] = useState(null); // pdf.js document for preview
  const pdfjsLib = usePdfJs();

  const handleFile = async (files) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setStatus("");
    setPdfDoc(null);
    try {
      const buffer = await f.arrayBuffer();
      // Load with pdf-lib for page count
      const pdfLib = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPageCount(pdfLib.getPageCount());
      // Load with pdf.js for rendering (need a fresh ArrayBuffer)
      if (pdfjsLib) {
        const buf2 = await f.arrayBuffer();
        const doc = await pdfjsLib.getDocument({ data: buf2 }).promise;
        setPdfDoc(doc);
      }
    } catch {
      setStatus("Error: Could not read PDF.");
    }
  };

  // Load pdf.js doc once pdfjsLib becomes available after file is set
  useEffect(() => {
    if (!pdfjsLib || !file || pdfDoc) return;
    (async () => {
      const buf = await file.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: buf }).promise;
      setPdfDoc(doc);
    })();
  }, [pdfjsLib, file]);

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

        // Mirror the canvas preview logic exactly:
        // Preview renders at scale 1.2 and clamps font to 40% of canvas width.
        const PREVIEW_SCALE = 1.2;
        const canvasWidth = width * PREVIEW_SCALE;
        const scaledFont = Math.min(fontSize * PREVIEW_SCALE, canvasWidth * 0.4);
        // Convert back to PDF points (undo the 1.2x scale)
        const effectiveFontSize = scaledFont / PREVIEW_SCALE;

        const textWidth = font.widthOfTextAtSize(watermarkText, effectiveFontSize);
        const textHeight = font.heightAtSize(effectiveFontSize);

        // pdf-lib's origin is bottom-left, so y center = (height + textHeight) / 2
        page.drawText(watermarkText, {
          x: (width - textWidth) / 2,
          y: (height + textHeight) / 2,
          size: effectiveFontSize,
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

  const reset = () => { setFile(null); setPageCount(0); setStatus(""); setPdfDoc(null); };
  const previewPages = Math.min(pageCount, 2);

  return (
    <div className="space-y-2">
      <Panel>
        {!file ? (
          <PdfDropZone onFiles={handleFile} />
        ) : (
          <div className="space-y-4">
            {/* File info */}
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
                <Slider min={0.01} max={1} step={0.01} value={opacity} onChange={setOpacity} />
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
          </div>
        )}
      </Panel>

      {/* Live Preview */}
      {file && (
        <Panel>
          <p className="text-sm font-medium text(--text-primary) mb-3">
            Live Preview {previewPages > 0 ? `(${previewPages === 1 ? "Page 1" : "Pages 1-2"})` : ""}
          </p>
          {!pdfDoc ? (
            <div className="flex items-center justify-center h-40 text-sm text-[var(--text-tertiary)]">
              Loading preview...
            </div>
          ) : (
            <div className={`flex gap-4 ${previewPages > 1 ? "flex-col sm:flex-row" : ""}`}>
              {Array.from({ length: previewPages }, (_, i) => (
                <div key={i} className="flex-1 min-w-0">
                  <PdfPageCanvas
                    pdfDoc={pdfDoc}
                    pageNum={i + 1}
                    watermarkText={watermarkText}
                    fontSize={fontSize}
                    opacity={opacity}
                    rotation={rotation}
                  />
                </div>
              ))}
            </div>
          )}
        </Panel>
      )}

      {/* Actions */}
      {file && (
        <Panel>
          <div className="flex items-center gap-4">
            <Button onClick={handleApply} disabled={isProcessing || !watermarkText.trim()}>
              {isProcessing ? "Applying..." : "Apply Watermark & Download"}
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