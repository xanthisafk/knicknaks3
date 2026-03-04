import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PdfDropZone } from "@/components/advanced/PdfDropZone";
import { PDFDocument } from "@cantoo/pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";

export default function UnlockPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");

  const handleFile = (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setStatus("");
  };

  const handleUnlock = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStatus("Unlocking...");

    try {
      const buffer = await file.arrayBuffer();

      // Load with password — @cantoo/pdf-lib actually decrypts it
      const pdf = await PDFDocument.load(buffer, {
        password: password || undefined,
      });

      // Copy all pages into a fresh, unencrypted document
      const dest = await PDFDocument.create();
      const pages = await dest.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => dest.addPage(page));

      // Carry over metadata
      dest.setTitle(pdf.getTitle() ?? "");
      dest.setAuthor(pdf.getAuthor() ?? "");
      dest.setSubject(pdf.getSubject() ?? "");
      dest.setCreator(pdf.getCreator() ?? "");

      const bytes = await dest.save();
      downloadPdf(bytes, `unlocked_${file.name}`);
      setStatus("✓ PDF unlocked and saved!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed";
      if (msg.toLowerCase().includes("password") || msg.toLowerCase().includes("encrypt")) {
        setStatus("Error: Incorrect password or unsupported encryption.");
      } else {
        setStatus(`Error: ${msg}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => { setFile(null); setPassword(""); setStatus(""); };

  return (
    <div className="space-y-6">
      <Panel>
        {!file ? (
          <PdfDropZone onFiles={handleFile} />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--surface-secondary)] border border-[var(--border-default)]">
              <span>🔒</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text(--text-primary) truncate">{file.name}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{formatFileSize(file.size)}</p>
              </div>
              <button onClick={reset} className="text-xs text-[var(--text-tertiary)] hover:text-[var(--color-error)] transition-colors cursor-pointer">✕</button>
            </div>

            <Input
              label="PDF Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter the current password"
              helperText="Required if the PDF is password-protected"
            />
          </div>
        )}
      </Panel>

      {file && (
        <Panel>
          <div className="flex items-center gap-4">
            <Button onClick={handleUnlock} disabled={isProcessing}>
              {isProcessing ? "Unlocking…" : "Unlock & Download"}
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