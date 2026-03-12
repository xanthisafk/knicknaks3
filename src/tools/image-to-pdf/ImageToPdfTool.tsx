import { useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PDFDocument } from "pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";

export default function ImageToPdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");

  const handleFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files ?? []);
    if (newFiles.length === 0) return;
    setFiles((prev) => [...prev, ...newFiles]);
    setStatus("");

    // Generate previews
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (from: number, direction: "up" | "down") => {
    const to = direction === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= files.length) return;
    setFiles((prev) => { const n = [...prev];[n[from], n[to]] = [n[to], n[from]]; return n; });
    setPreviews((prev) => { const n = [...prev];[n[from], n[to]] = [n[to], n[from]]; return n; });
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setStatus("Converting...");

    try {
      const pdf = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const uint8 = new Uint8Array(bytes);

        let image;
        if (file.type === "image/png") {
          image = await pdf.embedPng(uint8);
        } else {
          // For JPG, WebP and others — convert to PNG via canvas if needed
          if (file.type === "image/jpeg" || file.type === "image/jpg") {
            image = await pdf.embedJpg(uint8);
          } else {
            // Convert other formats (webp, bmp, etc.) to PNG via canvas
            const bitmap = await createImageBitmap(new Blob([bytes], { type: file.type }));
            const canvas = document.createElement("canvas");
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(bitmap, 0, 0);
            const pngBlob = await new Promise<Blob>((resolve) =>
              canvas.toBlob((b) => resolve(b!), "image/png")
            );
            const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());
            image = await pdf.embedPng(pngBytes);
          }
        }

        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdf.save();
      downloadPdf(pdfBytes, "images.pdf");
      setStatus(`✓ Created PDF with ${files.length} page${files.length > 1 ? "s" : ""}!`);
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Failed"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Panel>
        <div className="space-y-4">
          <label
            className="flex flex-col items-center justify-center gap-3 p-8 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--border-default)] bg-[var(--surface-secondary)]/50 cursor-pointer hover:border-[var(--border-hover)] transition-colors"
          >
            <span className="text-3xl">🖼️</span>
            <span className="text-sm font-medium text(--text-primary)">Drop images here or click to browse</span>
            <span className="text-xs text-[var(--text-tertiary)]">PNG, JPG, WebP, BMP</span>
            <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
          </label>

          {files.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {files.map((file, i) => (
                <div key={`img-${i}`} className="relative flex flex-col gap-1.5 p-2 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-secondary)]">
                  {previews[i] && (
                    <img src={previews[i]} alt={file.name} className="w-full h-24 object-cover rounded-[var(--radius-sm)]" />
                  )}
                  <p className="text-xs text(--text-secondary) truncate">{file.name}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{formatFileSize(file.size)}</p>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveFile(i, "up")} disabled={i === 0} className="px-1.5 py-0.5 text-xs rounded bg-[var(--surface-elevated)] disabled:opacity-30 cursor-pointer disabled:cursor-default">←</button>
                    <button onClick={() => moveFile(i, "down")} disabled={i === files.length - 1} className="px-1.5 py-0.5 text-xs rounded bg-[var(--surface-elevated)] disabled:opacity-30 cursor-pointer disabled:cursor-default">→</button>
                    <button onClick={() => removeFile(i)} className="ml-auto px-1.5 py-0.5 text-xs rounded text-[var(--color-error)] bg-[var(--surface-elevated)] cursor-pointer">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Panel>

      <Panel>
        <div className="flex items-center gap-4">
          <Button onClick={handleConvert} disabled={files.length === 0 || isProcessing}>
            {isProcessing ? "Converting..." : `Convert ${files.length} Image${files.length !== 1 ? "s" : ""} to PDF`}
          </Button>
          {files.length > 0 && (
            <Button variant="ghost" onClick={() => { setFiles([]); setPreviews([]); setStatus(""); }}>
              Clear All
            </Button>
          )}
        </div>
        {status && (
          <p className={`mt-3 text-sm ${status.startsWith("Error") ? "text-[var(--color-error)]" : "text(--text-secondary)"}`}>
            {status}
          </p>
        )}
      </Panel>
    </div>
  );
}
