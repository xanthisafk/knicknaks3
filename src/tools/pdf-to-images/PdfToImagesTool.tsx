import { useState } from "react";
import { Button } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PdfDropZone } from "@/components/advanced/PdfDropZone";
import { formatFileSize, downloadBlob } from "@/tools/_pdf-utils";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type Format = "png" | "jpeg";

export default function PdfToImagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [format, setFormat] = useState<Format>("png");
  const [scale, setScale] = useState(2);
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");

  const handleFile = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setImages([]);
    setStatus("");
    try {
      const buffer = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
      setPageCount(pdf.numPages);
    } catch {
      setStatus("Error: Could not read PDF.");
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStatus("Rendering pages...");
    setImages([]);

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
      const results: { url: string; name: string }[] = [];
      const ext = format === "png" ? "png" : "jpg";
      const baseName = file.name.replace(/\.pdf$/i, "");

      for (let i = 1; i <= pdf.numPages; i++) {
        setStatus(`Rendering page ${i} of ${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport }).promise;

        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((b) => resolve(b!), `image/${format}`, 0.92)
        );
        const url = URL.createObjectURL(blob);
        results.push({ url, name: `${baseName}_page${i}.${ext}` });
      }

      setImages(results);
      setStatus(`✓ Rendered ${pdf.numPages} pages as ${ext.toUpperCase()}!`);
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Failed"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (img: { url: string; name: string }) => {
    const a = document.createElement("a");
    a.href = img.url;
    a.download = img.name;
    a.click();
  };

  const downloadAll = async () => {
    for (const img of images) {
      downloadImage(img);
      await new Promise((r) => setTimeout(r, 300)); // stagger downloads
    }
  };

  const reset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setFile(null);
    setPageCount(0);
    setImages([]);
    setStatus("");
  };

  const scaleButton = (label: string, value: number) => (
    <button
      onClick={() => setScale(value)}
      className={`px-3 py-1.5 text-sm rounded-[var(--radius-md)] border transition-colors cursor-pointer ${scale === value
        ? "bg-[var(--color-primary-500)] text-white border-[var(--color-primary-500)]"
        : "bg-[var(--surface-secondary)] text(--text-primary) border-[var(--border-default)] hover:border-[var(--border-hover)]"
        }`}
    >
      {label}
    </button>
  );

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

            <div className="space-y-3">
              <label className="text-sm font-medium text(--text-primary)">Format</label>
              <div className="flex gap-2">
                {(["png", "jpeg"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`px-4 py-2 text-sm rounded-[var(--radius-md)] border transition-colors cursor-pointer uppercase ${format === f
                      ? "bg-[var(--color-primary-500)] text-white border-[var(--color-primary-500)]"
                      : "bg-[var(--surface-secondary)] text(--text-primary) border-[var(--border-default)] hover:border-[var(--border-hover)]"
                      }`}
                  >
                    {f === "jpeg" ? "JPG" : f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text(--text-primary)">Quality</label>
              <div className="flex gap-2">
                {scaleButton("Low (1x)", 1)}
                {scaleButton("Medium (2x)", 2)}
                {scaleButton("High (3x)", 3)}
              </div>
            </div>
          </div>
        )}
      </Panel>

      {file && (
        <Panel>
          <div className="flex items-center gap-4">
            <Button onClick={handleConvert} disabled={isProcessing}>
              {isProcessing ? "Rendering..." : "Convert to Images"}
            </Button>
            {images.length > 1 && (
              <Button variant="secondary" onClick={downloadAll}>
                Download All
              </Button>
            )}
            <Button variant="ghost" onClick={reset}>Choose Another</Button>
          </div>
          {status && (
            <p className={`mt-3 text-sm ${status.startsWith("Error") ? "text-[var(--color-error)]" : "text(--text-secondary)"}`}>
              {status}
            </p>
          )}
        </Panel>
      )}

      {images.length > 0 && (
        <Panel>
          <h3 className="text-sm font-medium text(--text-primary) mb-3">Rendered Pages</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <div key={i} className="flex flex-col gap-1.5 p-2 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-secondary)]">
                <img src={img.url} alt={img.name} className="w-full rounded-[var(--radius-sm)] shadow-sm cursor-pointer" onClick={() => downloadImage(img)} />
                <p className="text-xs text(--text-secondary) truncate">{img.name}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
