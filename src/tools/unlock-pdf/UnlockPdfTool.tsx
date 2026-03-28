import { useState } from "react";
import { Button, FileInfoBar, Input, Label } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PDFDocument } from "@cantoo/pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";
import FileDropZone from "@/components/advanced/FileDropZone";
import { Container } from "@/components/layout/Primitive";
import { AlertTriangle, Check, Hourglass, Unlock } from "lucide-react";
import { useToast } from "@/hooks/useToast";

export default function UnlockPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");

  const toast = useToast();

  const handleFile = (file: File) => {
    setFile(file);
    setStatus("");
  };

  const handleUnlock = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStatus("Unlocking...");

    try {
      const buffer = await file.arrayBuffer();

      const pdf = await PDFDocument.load(buffer, {
        password: password || undefined,
      });

      // Copy all pages into an unencrypteed document
      const dest = await PDFDocument.create();
      const pages = await dest.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => dest.addPage(page));

      const title = pdf.getTitle();
      const author = pdf.getAuthor();
      const subject = pdf.getSubject();
      const creator = pdf.getCreator();

      if (title) dest.setTitle(title);
      if (author) dest.setAuthor(author);
      if (subject) dest.setSubject(subject);
      if (creator) dest.setCreator(creator);

      const bytes = await dest.save();
      downloadPdf(bytes, `unlocked_${file.name}`);
      const msg = "PDF unlocked and saved!";
      toast.success(msg);
      setStatus(msg);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed";
      if (msg.toLowerCase().includes("password") || msg.toLowerCase().includes("encrypt")) {
        toast.error("Error: Incorrect password or unsupported encryption.");
        setStatus("Error: Incorrect password or unsupported encryption.");
      } else {
        toast.error(`Error: ${msg}`);
        setStatus(`Error: ${msg}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isProcessing) {
      handleUnlock();
    }
  };

  const reset = () => { setFile(null); setPassword(""); setStatus(""); };

  return (
    <Container>
      {!file ? (
        <FileDropZone
          onUpload={f => handleFile(f.file)}
          accepts=".pdf"
          emoji="📄"
        />
      ) : (
        <Panel className="flex flex-col">
          <FileInfoBar
            fileName={file.name}
            emoji="📄"
            fileSize={formatFileSize(file.size)}
            onReset={reset} />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter the current password"
            helperText="Required if the PDF is password protected"
          />
          <Button
            variant="primary"
            onClick={handleUnlock}
            disabled={isProcessing}
            icon={isProcessing ? Hourglass : Unlock}
            className="max-w-fit"
          >
            {isProcessing ? "Unlocking..." : "Unlock & Download"}
          </Button>
          {status && (
            <Label
              variant={status.startsWith("Error") ? "danger" : "success"}
              icon={status.startsWith("Error") ? AlertTriangle : Check}
            >
              {status}
            </Label>
          )}
        </Panel>
      )}
    </Container>
  );
}