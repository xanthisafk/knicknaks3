// WatermarkPdfTool.tsx
import { useState, useEffect, useRef } from "react";
import { Button, FileInfoBar, Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PDFDocument, StandardFonts, rgb, degrees as pdfDegrees } from "pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";
import FileDropZone from "@/components/advanced/FileDropZone";
import { Container, FloatingContainer } from "@/components/layout/Primitive";
import { CornerDownLeft, Download, Type, Image as ImageIcon } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

// Use the worker bundled with pdfjs-dist
import PdfjsWorker from "pdfjs-dist/build/pdf.worker?worker";
pdfjsLib.GlobalWorkerOptions.workerPort = new PdfjsWorker();

// ─── Preview canvas ───────────────────────────────────────────────────────────

interface TextWatermarkOpts {
  mode: "text";
  text: string;
  fontSize: number;
  opacity: number;
  rotation: number;
}

interface ImageWatermarkOpts {
  mode: "image";
  src: string; // object URL or data URL
  scale: number; // 0–1, fraction of page width
  opacity: number;
  rotation: number;
}

type WatermarkOpts = TextWatermarkOpts | ImageWatermarkOpts;

function PdfPageCanvas({
  pdfDoc,
  pageNum,
  watermark,
}: {
  pdfDoc: pdfjsLib.PDFDocumentProxy;
  pageNum: number;
  watermark: WatermarkOpts;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pageSize, setPageSize] = useState({ width: 1, height: 1 });

  const PREVIEW_SCALE = 0.7; // smaller scale so previews fit on screen

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    let cancelled = false;
    (async () => {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: PREVIEW_SCALE });
      const canvas = canvasRef.current!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      if (!cancelled) setPageSize({ width: viewport.width, height: viewport.height });
      const ctx = canvas.getContext("2d");
      await page.render({ canvasContext: ctx as CanvasRenderingContext2D, canvas, viewport }).promise;
    })();
    return () => {
      cancelled = true;
    };
  }, [pdfDoc, pageNum]);

  // ── CSS overlay watermark (mirrors the pdf-lib output as closely as possible) ──
  const overlayStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    overflow: "hidden",
  };

  let watermarkEl: React.ReactNode = null;

  if (watermark.mode === "text") {
    // Cap font at 40 % of page width (same cap used in pdf output)
    const scaledFont = Math.min(
      watermark.fontSize * PREVIEW_SCALE,
      pageSize.width * 0.4
    );
    watermarkEl = (
      <span
        style={{
          fontSize: `${scaledFont}px`,
          opacity: watermark.opacity,
          // In pdf-lib positive rotation is counter-clockwise; CSS positive is clockwise →
          // negate to match the rendered PDF
          transform: `rotate(${-watermark.rotation}deg)`,
          color: "#808080",
          fontWeight: 700,
          whiteSpace: "nowrap",
          userSelect: "none",
          letterSpacing: "0.05em",
        }}
      >
        {watermark.text || " "}
      </span>
    );
  } else {
    const imgWidth = pageSize.width * watermark.scale;
    watermarkEl = (
      <img
        src={watermark.src}
        style={{
          width: `${imgWidth}px`,
          opacity: watermark.opacity,
          transform: `rotate(${-watermark.rotation}deg)`,
          objectFit: "contain",
          userSelect: "none",
          pointerEvents: "none",
        }}
        alt="watermark preview"
      />
    );
  }

  return (
    <div
      className="relative inline-block border border-[var(--border-default)] rounded-[var(--radius-md)] overflow-hidden shadow-md bg-white"
      style={{ maxHeight: "55vh", maxWidth: "100%" }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", maxWidth: "100%", height: "auto", maxHeight: "55vh" }}
      />
      <div aria-hidden="true" style={overlayStyle}>
        {watermarkEl}
      </div>
      <div className="absolute top-1.5 left-2 text-xs font-medium text-[var(--text-tertiary)] bg-white/70 rounded px-1">
        Page {pageNum}
      </div>
    </div>
  );
}

// ─── Main tool ────────────────────────────────────────────────────────────────

type WatermarkMode = "text" | "image";

export default function WatermarkPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);

  // Shared
  const [mode, setMode] = useState<WatermarkMode>("text");
  const [opacity, setOpacity] = useState(0.2);
  const [rotation, setRotation] = useState(45);

  // Text mode
  const [watermarkText, setWatermarkText] = useState("DRAFT");
  const [fontSize, setFontSize] = useState(60);

  // Image mode
  const [wmImageFile, setWmImageFile] = useState<File | null>(null);
  const [wmImageSrc, setWmImageSrc] = useState<string>("");
  const [wmImageScale, setWmImageScale] = useState(0.4); // fraction of page width
  const wmImageBytesRef = useRef<Uint8Array | null>(null);
  const wmImageTypeRef = useRef<string>("image/png");

  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");


  const handleFile = async (f: File) => {
    setFile(f);
    setStatus("");
    setPdfDoc(null);
    try {
      const buf = await f.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: buf }).promise;
      setPageCount(doc.numPages);
      setPdfDoc(doc);
    } catch {
      setStatus("Error: Could not read PDF.");
    }
  };


  const handleWmImage = async (f: File) => {
    setWmImageFile(f);
    const url = URL.createObjectURL(f);
    setWmImageSrc(url);
    const arr = new Uint8Array(await f.arrayBuffer());
    wmImageBytesRef.current = arr;
    wmImageTypeRef.current = f.type;
  };


  const handleApply = async () => {
    if (!file) return;
    if (mode === "text" && !watermarkText.trim()) return;
    if (mode === "image" && !wmImageBytesRef.current) return;

    setIsProcessing(true);
    setStatus("Applying watermark…");
    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = pdf.getPages();

      if (mode === "text") {
        const font = await pdf.embedFont(StandardFonts.HelveticaBold);

        for (const page of pages) {
          const { width, height } = page.getSize();
          const effectiveFontSize = Math.min(fontSize, width * 0.4);
          const cx = width / 2;
          const cy = height / 2;

          const textWidth = font.widthOfTextAtSize(watermarkText, effectiveFontSize);
          const textHeight = font.heightAtSize(effectiveFontSize);

          page.drawText(watermarkText, {
            x: cx - textWidth / 2,
            y: cy - textHeight / 2,
            size: effectiveFontSize,
            font,
            color: rgb(0.5, 0.5, 0.5),
            opacity,
            rotate: pdfDegrees(rotation),
          });
        }
      } else {
        // Image watermark
        const bytes = wmImageBytesRef.current!;
        const mimeType = wmImageTypeRef.current;

        let embeddedImage;
        if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
          embeddedImage = await pdf.embedJpg(bytes);
        } else {
          embeddedImage = await pdf.embedPng(bytes);
        }

        for (const page of pages) {
          const { width, height } = page.getSize();
          const imgWidth = width * wmImageScale;
          const imgHeight = (embeddedImage.height / embeddedImage.width) * imgWidth;

          page.drawImage(embeddedImage, {
            x: (width - imgWidth) / 2,
            y: (height - imgHeight) / 2,
            width: imgWidth,
            height: imgHeight,
            opacity,
            rotate: pdfDegrees(rotation),
          });
        }
      }

      const bytes = await pdf.save();
      downloadPdf(bytes, `watermarked_${file.name}`);
      setStatus(`✓ Watermark applied to ${pages.length} page${pages.length !== 1 ? "s" : ""}!`);
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Failed"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setStatus("");
    setPdfDoc(null);
  };

  // Build watermark opts for preview
  const watermarkOpts: WatermarkOpts =
    mode === "text"
      ? { mode: "text", text: watermarkText, fontSize, opacity, rotation }
      : { mode: "image", src: wmImageSrc, scale: wmImageScale, opacity, rotation };

  const previewPages = Math.min(pageCount, 2);
  const canApply =
    !isProcessing &&
    !!file &&
    (mode === "text" ? !!watermarkText.trim() : !!wmImageBytesRef.current);

  return (
    <Container>
      {!file && (
        <FileDropZone onUpload={(f) => handleFile(f.file)} accepts=".pdf" emoji="📄" />
      )}

      {file && (
        <Container>
          {/* ── Controls ── */}
          <Panel>
            <FileInfoBar
              fileName={file.name}
              fileSize={formatFileSize(file.size)}
              text={`${pageCount} page${pageCount !== 1 ? "s" : ""}`}
              onReset={reset}
            />

            {/* Mode toggle */}
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setMode("text")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium transition-colors ${mode === "text"
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                  }`}
              >
                <Type size={14} /> Text
              </button>
              <button
                onClick={() => setMode("image")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium transition-colors ${mode === "image"
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                  }`}
              >
                <ImageIcon size={14} /> Image
              </button>
            </div>

            {/* Text mode controls */}
            {mode === "text" && (
              <>
                <Input
                  label="Watermark Text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  handlePaste={setWatermarkText}
                  placeholder="e.g. CONFIDENTIAL, DRAFT, SAMPLE"
                />
                <Container cols={2}>
                  <Input
                    label="Font Size (pt)"
                    type="number"
                    value={fontSize}
                    onChange={(e) =>
                      setFontSize(Math.max(8, parseInt(e.target.value) || 60))
                    }
                    min={8}
                    max={300}
                  />
                </Container>
                {status && (
                  <p
                    className={`mt-3 text-sm ${status.startsWith("Error")
                      ? "text-[var(--color-error)]"
                      : "text-[var(--text-secondary)]"
                      }`}
                  >
                    {status}
                  </p>
                )}
              </>
            )}

            {/* Image mode controls */}
            {mode === "image" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Watermark Image
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-[var(--radius-sm)] border border-dashed border-[var(--border-default)] hover:border-[var(--color-accent)] transition-colors text-sm text-[var(--text-secondary)]">
                    <ImageIcon size={14} />
                    {wmImageFile ? wmImageFile.name : "Choose PNG / JPG…"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleWmImage(f);
                      }}
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Size (% of page width): {Math.round(wmImageScale * 100)}%
                  </label>
                  <input
                    type="range"
                    min={0.05}
                    max={1}
                    step={0.01}
                    value={wmImageScale}
                    onChange={(e) => setWmImageScale(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </>
            )}

            {/* Shared controls */}
            <Container cols={2}>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Opacity: {Math.round(opacity * 100)}%
                </label>
                <input
                  type="range"
                  min={0.01}
                  max={1}
                  step={0.01}
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <Input
                label="Rotation (°)"
                type="number"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value) ?? 45)}
                min={-360}
                max={360}
              />
            </Container>
          </Panel>

          {/* ── Preview ── */}
          <Panel>
            <p className="text-sm font-medium text-[var(--text-primary)] mb-3">
              Live Preview
              {previewPages > 0
                ? ` (${previewPages === 1 ? "Page 1" : "Pages 1–2"})`
                : ""}
            </p>
            {!pdfDoc ? (
              <div className="flex items-center justify-center h-40 text-sm text-[var(--text-tertiary)]">
                Loading preview…
              </div>
            ) : (
              <div
                className={`flex gap-4 ${previewPages > 1 ? "flex-col sm:flex-row" : ""}`}
              >
                {Array.from({ length: previewPages }, (_, i) => (
                  <div key={i} className="flex-1 min-w-0 flex justify-center">
                    <PdfPageCanvas
                      pdfDoc={pdfDoc}
                      pageNum={i + 1}
                      watermark={watermarkOpts}
                    />
                  </div>
                ))}
              </div>
            )}
          </Panel>

          {/* ── Actions ── */}
          <FloatingContainer>
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3">
              <Button icon={Download} onClick={handleApply} disabled={!canApply} className="w-full md:w-auto">
                {isProcessing ? "Applying…" : "Apply Watermark & Download"}
              </Button>
              <Button variant="ghost" icon={CornerDownLeft} onClick={reset} className="w-full md:w-auto">
                Choose Another
              </Button>
            </div>
          </FloatingContainer>
        </Container>
      )}
    </Container>
  );
}