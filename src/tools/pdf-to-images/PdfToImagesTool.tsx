import { useState, useCallback } from "react";
import { Button, FileInfoBar, Label } from "@/components/ui";
import { Panel } from "@/components/layout";
import { formatFileSize } from "@/tools/_pdf-utils";
import * as pdfjsLib from "pdfjs-dist";
import FileDropZone from "@/components/advanced/FileDropZone";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { ArrowRight, Download, DownloadCloud, TriangleAlert, X } from "lucide-react";
import JSZip from "jszip";
import { cn } from "@/lib";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type Format = "png" | "jpeg";

const SCALE_OPTIONS = [
  { label: "Low (1x)", value: 1 },
  { label: "Medium (2x)", value: 2 },
  { label: "High (3x)", value: 3 },
];

type ImageEntry = { url: string; name: string; blob: Blob };

export default function PdfToImagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [format, setFormat] = useState<Format>("png");
  const [scale, setScale] = useState(2);
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  const handleFile = async (file: File) => {
    setFile(file);
    setImages([]);
    setError(null);
    setProgress(null);
    try {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
      setPageCount(pdf.numPages);
    } catch {
      setError("Could not read PDF. Make sure it's a valid file.");
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    // Revoke old URLs
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
    setProgress({ current: 0, total: 0 });

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
      const total = pdf.numPages;
      setProgress({ current: 0, total });
      const results: ImageEntry[] = [];
      const ext = format === "png" ? "png" : "jpg";
      const baseName = file.name.replace(/\.pdf$/i, "");

      for (let i = 1; i <= total; i++) {
        setProgress({ current: i, total });
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx as CanvasRenderingContext2D, canvas, viewport }).promise;

        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((b) => resolve(b!), `image/${format}`, 0.92)
        );
        const url = URL.createObjectURL(blob);
        results.push({ url, name: `${baseName}_page${i}.${ext}`, blob });
        // Stream results in as they render
        setImages([...results]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed. Please try again.");
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const downloadImage = useCallback((img: ImageEntry) => {
    const a = document.createElement("a");
    a.href = img.url;
    a.download = img.name;
    a.click();
  }, []);

  const downloadAll = async () => {
    if (!file || images.length === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      for (const img of images) {
        // Use the actual blob, not the object URL string
        zip.file(img.name, img.blob);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${file.name.replace(/\.pdf$/i, "")}_images.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
    } finally {
      setIsZipping(false);
    }
  };

  const reset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setFile(null);
    setPageCount(0);
    setImages([]);
    setError(null);
    setProgress(null);
  };

  const progressPercent =
    progress && progress.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : 0;

  return (
    <div className="space-y-2">
      {!file ? (
        <FileDropZone onUpload={(f) => handleFile(f.file)} accepts=".pdf" emoji="📄" />
      ) : (
        <Panel className="space-y-3">
          <div className="space-y-3">
            <FileInfoBar
              emoji="📄"
              fileName={file.name}
              fileSize={formatFileSize(file.size)}
              text={`${pageCount} page${pageCount !== 1 ? "s" : ""}`}
              onReset={reset}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Select
                label="Format"
                value={format}
                onValueChange={(v) => setFormat(v as Format)}
              >
                <SelectTrigger>{format.toUpperCase()}</SelectTrigger>
                <SelectContent>
                  {(["png", "jpeg"] as const).map((f) => (
                    <SelectItem key={f} value={f}>
                      {f.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                label="Quality"
                value={scale.toString()}
                onValueChange={(v) => setScale(Number(v))}
              >
                <SelectTrigger>
                  {SCALE_OPTIONS.find((s) => s.value === scale)?.label}
                </SelectTrigger>
                <SelectContent>
                  {SCALE_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value.toString()}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <Button onClick={handleConvert} disabled={isProcessing} icon={ArrowRight}>
                {isProcessing ? "Rendering..." : images.length > 0 ? "Re-convert" : "Convert to Images"}
              </Button>
              {images.length > 1 && (
                <Button
                  variant="secondary"
                  onClick={downloadAll}
                  disabled={isZipping || isProcessing}
                  icon={DownloadCloud}
                >
                  {isZipping ? "Zipping..." : `Download All (${images.length})`}
                </Button>
              )}
            </div>

            {/* Progress bar */}
            {isProcessing && progress && progress.total > 0 && (
              <div className="space-y-1">
                <div
                  className={cn(
                    "w-full rounded-full overflow-hidden",
                    "h-6",
                    "bg-surface-secondary"
                  )}
                >
                  <div
                    className={cn(
                      "h-full rounded-full",
                      "bg-primary-500",
                      "transition-all duration-200 ease-out"
                    )}
                    style={{
                      width: `${progressPercent}%`,
                    }}
                  />
                </div>
                <Label size="s">Rendering page {progress.current} of {progress.total}...</Label>
              </div>
            )}
            {error && <Label variant="warning" icon={TriangleAlert} size="s">{error}</Label>}
          </div>

        </Panel>
      )}



      {images.length > 0 && (
        <Panel>
          <div className="flex items-center justify-between mb-3">
            <Label>
              {images.length} of {pageCount}
              {isProcessing && " (rendering...)"}
            </Label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => downloadImage(img)}
                title={`Download ${img.name}`}
                className={cn(
                  "group flex flex-col gap-1.5 p-2 rounded-lg text-left w-full",
                  "border border-(--border-default)",
                  "bg-(--surface-secondary)",
                  "cursor-pointer",
                )}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Image with download overlay */}
                <div className="relative w-full overflow-hidden rounded-sm" style={{ aspectRatio: "auto" }}>
                  <img
                    src={img.url}
                    alt={`Page ${i + 1}`}
                    className="w-full block"
                    style={{ display: "block" }}
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100",
                      "bg-(--surface-overlay)",
                      "transition-all duration-fast ease-out",
                      "rounded-sm",
                    )}
                  >
                    <Download
                      size={20}
                      style={{ color: "var(--text-inverse)" }}
                    />
                  </div>
                </div>
                {/* Page label */}
                <div className="flex items-center justify-between px-0.5">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      "text-(--text-secondary)",
                    )}
                  >
                    Page {i + 1}
                  </span>
                  <Download
                    size={12}
                    className={cn(
                      "opacity-0 group-hover:opacity-100",
                      "text-(--text-tertiary)",
                      "transition-all duration-fast ease-out",
                      "shrink-0",
                    )}
                  />
                </div>
              </button>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}