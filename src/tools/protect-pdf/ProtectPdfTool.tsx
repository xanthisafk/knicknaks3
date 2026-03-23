import { useState, useCallback } from "react";
import { Button, FileInfoBar, Input, Label } from "@/components/ui";
import { Panel } from "@/components/layout";
import FileDropZone from "@/components/advanced/FileDropZone";
import { PDFDocument } from "@cantoo/pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";
import { Check, Download, Trash2, TriangleAlert } from "lucide-react";

export default function ProtectPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [previousPassword, setPreviousPassword] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    setStatus("");
    try {
      const buffer = await f.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPageCount(pdf.getPageCount());
    } catch {
      setStatus("Error: Could not read PDF.");
    }
  }, []);

  const handleProtect = useCallback(async () => {
    if (!file) return;
    if (!userPassword && !ownerPassword) {
      setStatus("Please set at least one password.");
      return;
    }
    setIsProcessing(true);
    setStatus("Encrypting...");

    try {
      const buffer = await file.arrayBuffer();

      let pdf: PDFDocument;
      try {
        pdf = await PDFDocument.load(buffer, {
          password: previousPassword || undefined,
        });
      } catch {
        setStatus("Error: This PDF is already encrypted. Please enter the correct existing password.");
        setIsProcessing(false);
        return;
      }

      await pdf.encrypt({
        userPassword: userPassword || "",
        ownerPassword: ownerPassword || userPassword,
      });

      const bytes = await pdf.save();
      downloadPdf(bytes, `protected_${file.name}`);
      setStatus("PDF protected and saved!");
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Failed to encrypt"}`);
    } finally {
      setIsProcessing(false);
    }
  }, [file, previousPassword, userPassword, ownerPassword]);

  const reset = useCallback(() => {
    setFile(null);
    setPageCount(0);
    setPreviousPassword("");
    setUserPassword("");
    setOwnerPassword("");
    setStatus("");
  }, []);

  const clearPasswords = useCallback(() => {
    setPreviousPassword("");
    setUserPassword("");
    setOwnerPassword("");
    setStatus("");
  }, []);

  return (
    <div className="space-y-2">
      {!file ? (
        <FileDropZone accepts=".pdf" onUpload={f => handleFile(f.file)} emoji="📄" />
      ) : (
        <Panel>
          <div className="space-y-3">
            <FileInfoBar
              emoji="📄"
              fileName={file.name}
              fileSize={formatFileSize(file.size)}
              text={`${pageCount} page${pageCount !== 1 ? "s" : ""}`}
              onReset={reset}
            />

            <Input
              label="Open Password"
              type="password"
              value={userPassword}
              onChange={e => setUserPassword(e.target.value)}
              placeholder="Required to open the PDF"
            />
            <Input
              label="Owner Password"
              type="password"
              value={ownerPassword}
              onChange={e => setOwnerPassword(e.target.value)}
              placeholder="Required for full access (defaults to open password)"
            />
            <Input
              label="Existing Password"
              type="password"
              value={previousPassword}
              onChange={e => setPreviousPassword(e.target.value)}
              placeholder="Only needed if PDF is already encrypted"
            />
          </div>
        </Panel>
      )}

      {file && (
        <Panel>
          <div className="flex items-center justify-between space-y-3">
            <Button
              onClick={handleProtect}
              disabled={isProcessing || (!userPassword && !ownerPassword)}
              icon={Download}
            >
              {isProcessing ? "Encrypting..." : "Protect & Download"}
            </Button>
            <Button variant="ghost" icon={Trash2} onClick={clearPasswords}>
              Clear
            </Button>
          </div>
          {status && (
            <Label
              variant={status.startsWith("Error") || status.startsWith("Please") ? "danger" : "success"}
              icon={status.startsWith("Error") || status.startsWith("Please") ? TriangleAlert : Check}
            >
              {status}
            </Label>
          )}
        </Panel>
      )}
    </div>
  );
}