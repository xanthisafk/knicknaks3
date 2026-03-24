import { useState, useCallback, useRef } from "react";
import { Button, Input, Label, WaitForContent } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PDFDocument, degrees } from "pdf-lib";
import { downloadPdf } from "@/tools/_pdf-utils";
import {
  CornerDownLeft,
  Loader2,
  RotateCcw,
  RotateCw,
  Check,
  X,
  RefreshCcw,
  AlertTriangle,
} from "lucide-react";
import FileDropZone from "@/components/advanced/FileDropZone";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min?url";
import { Container, FloatingContainer } from "@/components/layout/Primitive";
import { useToast } from "@/hooks/useToast";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// ─── Types ─────────────────────────────────────────────────────────────────────
interface PageItem {
  index: number; // original 0-based page index
  label: string; // display label e.g. "Page 1"
  rotation: 0 | 90 | 180 | 270; // additional rotation to apply
  thumbnail: string | null; // base64 data URL rendered via canvas
}

// Cache the loaded pdf.js document so we don't re-parse bytes for every page
let cachedPdfDoc: { bytes: ArrayBuffer; doc: any } | null = null;

async function getPdfDoc(pdfBytes: ArrayBuffer): Promise<any> {
  if (cachedPdfDoc && cachedPdfDoc.bytes === pdfBytes) return cachedPdfDoc.doc;
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(pdfBytes.slice(0)) }).promise;
  cachedPdfDoc = { bytes: pdfBytes, doc };
  return doc;
}

async function renderPageThumbnail(
  pdfBytes: ArrayBuffer,
  pageIndex: number,
  size = 120
): Promise<string> {
  try {
    const pdfDoc = await getPdfDoc(pdfBytes);
    const page = await pdfDoc.getPage(pageIndex + 1);
    const viewport = page.getViewport({ scale: 1 });
    const scale = size / Math.max(viewport.width, viewport.height);
    const scaled = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(scaled.width);
    canvas.height = Math.ceil(scaled.height);
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvasContext: ctx, viewport: scaled }).promise;
    return canvas.toDataURL("image/png");
  } catch (e) {
    console.error("Thumbnail render failed for page", pageIndex, e);
    return "";
  }
}

// ─── Page Card ─────────────────────────────────────────────────────────────────
function PageCard({
  item,
  onRotateCw,
  onRotateCcw,
}: {
  item: PageItem;
  onRotateCw: () => void;
  onRotateCcw: () => void;
}) {
  return (
    <div className="relative flex flex-col gap-1.5 p-2 rounded-md border border-(--border-default) bg-(--surface-secondary)">
      {/* Thumbnail */}
      <div className="w-full h-24 flex items-center justify-center overflow-hidden rounded-sm bg-(--surface-primary)">
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.label}
            className="max-w-full max-h-full object-contain transition-transform duration-300"
            style={{ transform: `rotate(${item.rotation}deg)` }}
          />
        ) : (
          <WaitForContent size={16} />
        )}
      </div>

      <div className="flex flex-row justify-between">
        <Label variant="primary">Rotate: {item.rotation !== 0 ? `+${item.rotation}°` : "0°"}</Label>
        <Label size="xs">{item.label}</Label>
      </div>


      <div className="grid grid-cols-2">

        {/* Rotate CCW */}
        <Button
          onClick={onRotateCcw}
          title="Rotate 90° counter-clockwise"
          variant="ghost"
          size="xs"
          icon={RotateCcw}
        />
        {/* Rotate CW */}
        <Button
          onClick={onRotateCw}
          title="Rotate 90° clockwise"
          variant="ghost"
          size="xs"
          icon={RotateCw}
        />
      </div>


    </div>
  );
}

// ─── Bulk rotation toolbar ─────────────────────────────────────────────────────
function BulkToolbar({ onRotateAll }: { onRotateAll: (deg: 90 | 180 | 270) => void }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Label>Rotate all:</Label>
      {([90, 180, 270] as const).map((deg) => (
        <Button
          key={deg}
          onClick={() => onRotateAll(deg)}
          variant="ghost"
          size="xs"
          icon={deg === 90 ? RotateCw : deg === 180 ? RotateCcw : RotateCcw}
        >
          {deg}
        </Button>
      ))}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function RotatePdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [filename, setFilename] = useState("");
  const abortRef = useRef(false);
  const toast = useToast();

  // ── Load PDF and render thumbnails ───────────────────────────────────────────
  const handleFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setStatus("");
    abortRef.current = false;

    try {
      const buffer = await file.arrayBuffer();
      cachedPdfDoc = null;
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdf.getPageCount();

      setFile(file);
      setPdfBytes(buffer);
      setFilename(file.name.replace(/\.pdf$/i, ""));

      // Initialise page items without thumbnails first for instant feedback
      const initial: PageItem[] = Array.from({ length: count }, (_, i) => ({
        index: i,
        label: `Page ${i + 1}`,
        rotation: 0,
        thumbnail: null,
      }));
      setPages(initial);
      setIsLoading(false);

      // Render thumbnails progressively
      for (let i = 0; i < count; i++) {
        if (abortRef.current) break;
        const thumb = await renderPageThumbnail(buffer, i);
        setPages((prev) =>
          prev.map((p) => (p.index === i ? { ...p, thumbnail: thumb } : p))
        );
      }
    } catch {
      const msg = "Error: Could not read PDF.";
      toast.error(msg);
      setStatus(msg);
      setIsLoading(false);
    }
  }, []);

  const reset = () => {
    abortRef.current = true;
    setFile(null);
    setPdfBytes(null);
    setPages([]);
    setStatus("");
    setFilename("");
  };

  // ── Per-page action ─────────────────────────────────────────────────────────
  const rotatePage = (index: number, delta: 90 | -90) => {
    setPages((prev) =>
      prev.map((p, i) =>
        i === index
          ? {
            ...p,
            rotation: (((p.rotation + delta) % 360 + 360) % 360) as 0 | 90 | 180 | 270,
          }
          : p
      )
    );
  };

  const rotateAll = (deg: 90 | 180 | 270) => {
    setPages((prev) =>
      prev.map((p) => ({
        ...p,
        rotation: (((p.rotation + deg) % 360) as 0 | 90 | 180 | 270),
      }))
    );
  };

  // ── Convert ──────────────────────────────────────────────────────────────────
  const handleApply = async () => {
    if (!pdfBytes || pages.length === 0) return;
    setIsProcessing(true);
    const msg = "Applying rotations...";
    toast.info(msg);
    setStatus(msg);

    try {
      const sourcePdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const outputPdf = await PDFDocument.create();

      // Copy pages in the (potentially reordered) sequence
      const copiedPages = await outputPdf.copyPages(
        sourcePdf,
        pages.map((p) => p.index)
      );

      for (let i = 0; i < copiedPages.length; i++) {
        const page = copiedPages[i];
        const extraRotation = pages[i].rotation;
        if (extraRotation !== 0) {
          const current = page.getRotation().angle;
          page.setRotation(degrees(current + extraRotation));
        }
        outputPdf.addPage(page);
      }

      const bytes = await outputPdf.save();
      const name = (filename || "rotated") + ".pdf";
      downloadPdf(bytes, name);
      const msg = `Created PDF with ${pages.length} page${pages.length !== 1 ? "s" : ""}!`;
      toast.success(msg);
      setStatus(msg);
    } catch (err) {
      const msg = `Error: ${err instanceof Error ? err.message : "Failed"}`;
      toast.error(msg, 10);
      setStatus(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container>
      {/* ── Drop zone ── */}
      {!file && (
        isLoading ? (
          <Panel>
            <WaitForContent text="Loading PDF..." />
          </Panel>
        ) : (
          <FileDropZone accepts=".pdf" emoji="📄" onUpload={f => handleFile(f.file)} />
        )
      )}

      {/* ── Page grid ── */}
      {pages.length > 0 && (
        <Panel>
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-(--text-primary) truncate max-w-48">
                  {file?.name}
                </span>
                <span className="text-xs text-(--text-tertiary)">
                  {pages.length} page{pages.length !== 1 ? "s" : ""}
                </span>
              </div>
              <BulkToolbar onRotateAll={rotateAll} />
            </div>
            {status && <Label
              variant={status.includes("Error") ? "danger" : "success"}
              icon={status.includes("Error") ? AlertTriangle : Check}
            >{status}</Label>}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {pages.map((page, i) => (
                <PageCard
                  key={`${page.index}-${i}`}
                  item={page}
                  onRotateCw={() => rotatePage(i, 90)}
                  onRotateCcw={() => rotatePage(i, -90)}
                />
              ))}
            </div>
          </div>
        </Panel>
      )}

      {/* ── Actions ── */}
      {pages.length > 0 && (
        <FloatingContainer>
          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Input
                leadingText="FILENAME"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="rotated"
                trailingText=".pdf"
              />

              <div className="space-x-3">
                <Button
                  onClick={handleApply}
                  icon={RefreshCcw}
                  disabled={pages.length === 0 || isProcessing}
                >
                  {isProcessing
                    ? "Applying..."
                    : `Apply & Download${pages.length > 0 ? ` (${pages.length} page${pages.length !== 1 ? "s" : ""})` : ""}`}
                </Button>
                <Button
                  variant="ghost"
                  icon={CornerDownLeft}
                  onClick={reset}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </FloatingContainer>
      )}
    </Container>
  );
}