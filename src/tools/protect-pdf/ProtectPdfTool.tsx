import { useState } from "react";
import { Button, Input, Toggle } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PdfDropZone } from "@/components/advanced/PdfDropZone";
import { PDFDocument } from "@cantoo/pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";

export default function ProtectPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [userPassword, setUserPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(true);
  const [allowModifying, setAllowModifying] = useState(false);
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

  const handleProtect = async () => {
    if (!file) return;
    if (!userPassword && !ownerPassword) {
      setStatus("Please set at least one password.");
      return;
    }
    setIsProcessing(true);
    setStatus("Encrypting...");

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

      await pdf.encrypt({
        userPassword: userPassword || "",
        ownerPassword: ownerPassword || userPassword,
        permissions: {
          printing: allowPrinting ? "highResolution" : undefined,
          copying: allowCopying,
          modifying: allowModifying,
          annotating: false,
          fillingForms: false,
          contentAccessibility: allowCopying,
          documentAssembly: allowModifying,
        },
      });

      const bytes = await pdf.save();
      downloadPdf(bytes, `protected_${file.name}`);
      setStatus("✓ PDF protected and saved!");
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Failed to encrypt"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setUserPassword("");
    setOwnerPassword("");
    setStatus("");
  };

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
                <p className="text-xs text-[var(--text-tertiary)]">
                  {formatFileSize(file.size)} · {pageCount} pages
                </p>
              </div>
              <button
                onClick={reset}
                className="text-xs text-[var(--text-tertiary)] hover:text-[var(--color-error)] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <Input
              label="User Password (required to open)"
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              placeholder="Leave empty if not needed"
            />
            <Input
              label="Owner Password (required for full access)"
              type="password"
              value={ownerPassword}
              onChange={(e) => setOwnerPassword(e.target.value)}
              placeholder="Leave empty if not needed"
            />

            <div className="space-y-3">
              <h3 className="text-sm font-medium text(--text-primary)">Permissions</h3>
              <div className="space-y-2">
                <Toggle label="Allow Printing" checked={allowPrinting} onChange={setAllowPrinting} />
                <Toggle label="Allow Copying Text" checked={allowCopying} onChange={setAllowCopying} />
                <Toggle label="Allow Modifying" checked={allowModifying} onChange={setAllowModifying} />
              </div>
            </div>
          </div>
        )}
      </Panel>

      {file && (
        <Panel>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleProtect}
              disabled={isProcessing || (!userPassword && !ownerPassword)}
            >
              {isProcessing ? "Encrypting..." : "Protect & Download"}
            </Button>
            <Button variant="ghost" onClick={reset}>
              Choose Another
            </Button>
          </div>
          {status && (
            <p
              className={`mt-3 text-sm ${status.startsWith("Error") || status.startsWith("Please")
                  ? "text-[var(--color-error)]"
                  : "text(--text-secondary)"
                }`}
            >
              {status}
            </p>
          )}
        </Panel>
      )}
    </div>
  );
}