// WatermarkPdfTool.tsx
import { useState, useEffect, useRef } from "react";
import { Button, ExpectContent, FileInfoBar, InlineFileDrop, Input, Label, NeoSlider, WaitForContent } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PDFDocument, StandardFonts, rgb, degrees as pdfDegrees } from "pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";
import FileDropZone from "@/components/advanced/FileDropZone";
import { Container, FloatingContainer } from "@/components/layout/Primitive";
import { CornerDownLeft, Download, Type, Image as ImageIcon, Check, AlertTriangle } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

// Use the worker bundled with pdfjs-dist
import PdfjsWorker from "pdfjs-dist/build/pdf.worker?worker";
import { Tab, TabList, Tabs } from "@/components/ui/tab";
import { fmt } from "../split-bills/helpers";
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
  const [canvasSize, setCanvasSize] = useState({ width: 1, height: 1 });

  const PREVIEW_SCALE = 0.7;

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    let cancelled = false;
    (async () => {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: PREVIEW_SCALE });
      const canvas = canvasRef.current!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      if (!cancelled) setCanvasSize({ width: viewport.width, height: viewport.height });
      const ctx = canvas.getContext("2d");
      await page.render({ canvasContext: ctx as CanvasRenderingContext2D, canvas, viewport }).promise;
    })();
    return () => { cancelled = true; };
  }, [pdfDoc, pageNum]);

  // The overlay div is position:absolute inset-0, same pixel dimensions as the canvas.
  // We place a single child element at the exact center using flexbox,
  // then apply rotation via CSS transform — matching what pdf-lib does.
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
    // Cap font at 40% of canvas width (same cap used in pdf output)
    const scaledFont = Math.min(
      watermark.fontSize * PREVIEW_SCALE,
      canvasSize.width * 0.4
    );
    watermarkEl = (
      <span
        style={{
          fontSize: `${scaledFont}px`,
          opacity: watermark.opacity,
          // pdf-lib: positive rotation = counter-clockwise.
          // CSS transform rotate: positive = clockwise.
          // So negate to keep preview in sync with PDF output.
          transform: `rotate(${-watermark.rotation}deg)`,
          color: "#808080",
          fontWeight: 700,
          whiteSpace: "nowrap",
          userSelect: "none",
          letterSpacing: "0.05em",
          // Ensure the rotated element pivots around its own center (default)
          transformOrigin: "center center",
        }}
      >
        {watermark.text || " "}
      </span>
    );
  } else {
    const imgWidth = canvasSize.width * watermark.scale;
    watermarkEl = (
      <img
        src={watermark.src}
        style={{
          width: `${imgWidth}px`,
          opacity: watermark.opacity,
          transform: `rotate(${-watermark.rotation}deg)`,
          transformOrigin: "center center",
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
      className="relative inline-block border border-(--border-default) rounded-md overflow-hidden shadow-md bg-white"
      style={{ maxHeight: "55vh", maxWidth: "100%" }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", maxWidth: "100%", height: "auto", maxHeight: "55vh" }}
      />
      {/* Overlay sits exactly over the canvas — same dimensions */}
      <div aria-hidden="true" style={{ ...overlayStyle, width: canvasSize.width, height: canvasSize.height }}>
        {watermarkEl}
      </div>
      <div className="absolute top-1.5 left-2 text-xs font-medium text-(--text-tertiary) bg-white/70 rounded px-1">
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
  const [wmImageScale, setWmImageScale] = useState(0.4);
  const wmImageBytesRef = useRef<Uint8Array | null>(null);
  const wmImageTypeRef = useRef<string>("image/png");

  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");

  // ── DEBUG: auto-load local PDF on mount ──────────────────────────────────────
  useEffect(() => {
    const loadDebugPdf = async () => {
      try {
        // fetch() can load local file:// paths in dev environments (Vite serves from disk).
        // Adjust the path separator for your OS if needed.
        const response = await fetch(
          "C:/Users/Xanthis/Desktop/e1bc5898-891f-49e5-abec-b4f622792e17.pdf"
        );
        if (!response.ok) {
          console.warn("[DEBUG] Could not fetch debug PDF:", response.status);
          return;
        }
        const blob = await response.blob();
        const debugFile = new File([blob], "debug.pdf", { type: "application/pdf" });
        await handleFile(debugFile);
        console.log("[DEBUG] Debug PDF loaded successfully");
      } catch (err) {
        console.warn("[DEBUG] Auto-load failed (normal if not running locally):", err);
      }
    };
    loadDebugPdf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // ────────────────────────────────────────────────────────────────────────────

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

          // Cap font size at 40% of page width (same as preview cap)
          const effectiveFontSize = Math.min(fontSize, width * 0.4);

          // Measure text in pdf-lib units
          const textWidth = font.widthOfTextAtSize(watermarkText, effectiveFontSize);
          // heightAtSize returns the full cap-height; descender is ~20% of that
          const textHeight = font.heightAtSize(effectiveFontSize);

          // pdf-lib coordinate origin: bottom-left.
          // drawText x/y is the bottom-left corner of the text bounding box.
          // To center the text on the page center:
          //   x = pageCenter.x - textWidth/2
          //   y = pageCenter.y - textHeight/2
          // Rotation in pdf-lib is applied around the (x, y) anchor point,
          // NOT around the text center. To rotate around the text center instead,
          // we must shift the anchor by half the text dimensions:
          //   anchorX = pageCenter.x - (textWidth/2) * cos(θ) + (textHeight/2) * sin(θ)
          //   anchorY = pageCenter.y - (textWidth/2) * sin(θ) - (textHeight/2) * cos(θ)
          // This keeps the visual center of the rotated text at the page center.
          const cx = width / 2;
          const cy = height / 2;
          const rad = (rotation * Math.PI) / 180;
          const cos = Math.cos(rad);
          const sin = Math.sin(rad);
          const hw = textWidth / 2;
          const hh = textHeight / 2;

          const anchorX = cx - hw * cos + hh * sin;
          const anchorY = cy - hw * sin - hh * cos;

          page.drawText(watermarkText, {
            x: anchorX,
            y: anchorY,
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

          const cx = width / 2;
          const cy = height / 2;

          // pdf-lib drawImage x/y is the bottom-left corner of the image bounding box.
          // Rotation is applied around that same bottom-left anchor point — NOT the center.
          // To rotate around the image center:
          //   anchorX = cx - (imgWidth/2)*cos(θ) + (imgHeight/2)*sin(θ)
          //   anchorY = cy - (imgWidth/2)*sin(θ) - (imgHeight/2)*cos(θ)
          const rad = (rotation * Math.PI) / 180;
          const cos = Math.cos(rad);
          const sin = Math.sin(rad);
          const hw = imgWidth / 2;
          const hh = imgHeight / 2;

          const anchorX = cx - hw * cos + hh * sin;
          const anchorY = cy - hw * sin - hh * cos;

          page.drawImage(embeddedImage, {
            x: anchorX,
            y: anchorY,
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

  // Build watermark opts for preview — only page 1
  const watermarkOpts: WatermarkOpts =
    mode === "text"
      ? { mode: "text", text: watermarkText, fontSize, opacity, rotation }
      : { mode: "image", src: wmImageSrc, scale: wmImageScale, opacity, rotation };

  const canApply =
    !isProcessing &&
    !!file &&
    (mode === "text" ? !!watermarkText.trim() : !!wmImageBytesRef.current);

  return (
    <Container cols={2}>
      {!file && (
        <FileDropZone onUpload={(f) => handleFile(f.file)} accepts=".pdf" emoji="📄" />
      )}

      {file && (
        <Container>
          {/* ── Controls ── */}
          <Panel className="max-h-fit space-y-3">
            <FileInfoBar
              fileName={file.name}
              fileSize={formatFileSize(file.size)}
              text={`${pageCount} page${pageCount !== 1 ? "s" : ""}`}
              onReset={reset}
            />

            {/* Mode */}
            <Tabs
              label="Watermark Type"
              value={mode}
              onValueChange={(v) => setMode(v as "text" | "image")}
            >
              <TabList>
                <Tab value="text">Text</Tab>
                <Tab value="image">Image</Tab>
              </TabList>
            </Tabs>

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

              </>
            )}

            {/* Image mode controls */}
            {mode === "image" && (
              <>
                <Label>
                  Watermark Image
                </Label>
                <div className="w-full">
                  <InlineFileDrop
                    variant="full"
                    onUpload={f => handleWmImage(f.file)}
                    accept=".png,.jpg,.jpeg,.webp" />
                </div>
                <NeoSlider
                  label="Size (% of page width)"
                  min={5}
                  max={100}
                  step={1}
                  value={Math.ceil(wmImageScale * 100)}
                  onValueChange={(v) => setWmImageScale(v / 100)}
                  className="w-full"
                />

              </>
            )}

            {/* Shared controls */}

            <NeoSlider
              label="Opacity"
              min={1}
              max={100}
              step={1}
              value={Math.ceil(opacity * 100)}
              onValueChange={(v) => setOpacity(v / 100)}
              className="w-full"
            />

            <NeoSlider
              label="Rotation (°)"
              min={0}
              max={360}
              step={1}
              value={Math.ceil(rotation)}
              onValueChange={(v) => setRotation(v)}
              className="w-full"
            />
          </Panel>
          <Panel>
            <Button
              icon={Download}
              onClick={handleApply}
              disabled={!canApply}
              className="w-full"
            >
              {isProcessing ? "Applying…" : "Apply Watermark & Download"}
            </Button>
            <Button
              variant="ghost"
              icon={CornerDownLeft}
              onClick={reset}
              className="w-full"
            >
              Choose Another
            </Button>
            {status && (
              <Label
                icon={status.startsWith("Error") ? AlertTriangle : Check}
                variant={status.startsWith("Error") ? "danger" : "success"}
              >
                {status}
              </Label>
            )}
          </Panel>
        </Container>
      )}
      <Panel>
        <Label>Preview</Label>
        {!pdfDoc ? (
          <ExpectContent emoji="📄" text="Upload a PDF to preview" />
        ) : (
          <div className="flex justify-center">
            <PdfPageCanvas
              pdfDoc={pdfDoc}
              pageNum={1}
              watermark={watermarkOpts}
            />
          </div>
        )}
      </Panel>
    </Container>
  );
}