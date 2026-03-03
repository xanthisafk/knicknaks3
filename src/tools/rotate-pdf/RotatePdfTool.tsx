import { useState } from "react";
import { Button } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PdfDropZone } from "@/components/advanced/PdfDropZone";
import { PDFDocument, degrees } from "pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";

const ROTATIONS = [90, 180, 270] as const;

export default function RotatePdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rotation, setRotation] = useState<number>(90);
  const [applyTo, setApplyTo] = useState<"all" | "specific">("all");
  const [specificPages, setSpecificPages] = useState("");
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

  const handleRotate = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStatus("Rotating...");

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = pdf.getPages();

      let targetIndices: number[];
      if (applyTo === "all") {
        targetIndices = pages.map((_, i) => i);
      } else {
        targetIndices = parseIndices(specificPages, pageCount);
      }

      for (const i of targetIndices) {
        if (i >= 0 && i < pages.length) {
          const page = pages[i];
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + rotation));
        }
      }

      const bytes = await pdf.save();
      downloadPdf(bytes, `rotated_${file.name}`);
      setStatus(`✓ Rotated ${targetIndices.length} page${targetIndices.length > 1 ? "s" : ""} by ${rotation}°!`);
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Failed to rotate"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => { setFile(null); setPageCount(0); setSpecificPages(""); setStatus(""); };

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
              <label className="text-sm font-medium text(--text-primary)">Rotation</label>
              <div className="flex gap-2">
                {ROTATIONS.map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setRotation(deg)}
                    className={`px-4 py-2 text-sm rounded-[var(--radius-md)] border transition-colors cursor-pointer ${
                      rotation === deg
                        ? "bg-[var(--color-primary-500)] text-white border-[var(--color-primary-500)]"
                        : "bg-[var(--surface-secondary)] text(--text-primary) border-[var(--border-default)] hover:border-[var(--border-hover)]"
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text(--text-primary)">Apply to</label>
              <div className="flex gap-2">
                {(["all", "specific"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setApplyTo(opt)}
                    className={`px-4 py-2 text-sm rounded-[var(--radius-md)] border transition-colors cursor-pointer capitalize ${
                      applyTo === opt
                        ? "bg-[var(--color-primary-500)] text-white border-[var(--color-primary-500)]"
                        : "bg-[var(--surface-secondary)] text(--text-primary) border-[var(--border-default)] hover:border-[var(--border-hover)]"
                    }`}
                  >
                    {opt === "all" ? "All Pages" : "Specific Pages"}
                  </button>
                ))}
              </div>
              {applyTo === "specific" && (
                <input
                  value={specificPages}
                  onChange={(e) => setSpecificPages(e.target.value)}
                  placeholder="e.g. 1, 3, 5-8"
                  className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-[var(--surface-elevated)] text(--text-primary) border border-[var(--border-default)] placeholder:text-[var(--text-tertiary)] text-sm focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--ring-color)]"
                />
              )}
            </div>
          </div>
        )}
      </Panel>

      {file && (
        <Panel>
          <div className="flex items-center gap-4">
            <Button onClick={handleRotate} disabled={isProcessing}>
              {isProcessing ? "Rotating…" : "Rotate & Download"}
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

/** Parse page indices from "1,3,5-8" to zero-indexed array */
function parseIndices(input: string, max: number): number[] {
  const set = new Set<number>();
  for (const part of input.split(",").map((s) => s.trim()).filter(Boolean)) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      for (let i = Math.max(1, a); i <= Math.min(max, b); i++) set.add(i - 1);
    } else {
      const n = parseInt(part);
      if (n >= 1 && n <= max) set.add(n - 1);
    }
  }
  return Array.from(set).sort((a, b) => a - b);
}
