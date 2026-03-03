import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PdfDropZone } from "@/components/advanced/PdfDropZone";
import { PDFDocument } from "pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";

interface Metadata {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
}

export default function PdfMetadataTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [meta, setMeta] = useState<Metadata>({
    title: "", author: "", subject: "", keywords: "", creator: "", producer: "",
  });
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
      setMeta({
        title: pdf.getTitle() ?? "",
        author: pdf.getAuthor() ?? "",
        subject: pdf.getSubject() ?? "",
        keywords: (pdf.getKeywords() ?? ""),
        creator: pdf.getCreator() ?? "",
        producer: pdf.getProducer() ?? "",
      });
    } catch {
      setStatus("Error: Could not read PDF.");
    }
  };

  const handleSave = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStatus("Saving metadata...");

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

      pdf.setTitle(meta.title);
      pdf.setAuthor(meta.author);
      pdf.setSubject(meta.subject);
      pdf.setKeywords(meta.keywords.split(",").map((k) => k.trim()));
      pdf.setCreator(meta.creator);
      pdf.setProducer(meta.producer);

      const bytes = await pdf.save();
      downloadPdf(bytes, file.name);
      setStatus("✓ Metadata updated and saved!");
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Failed"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateField = (key: keyof Metadata, value: string) => {
    setMeta((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => { setFile(null); setPageCount(0); setMeta({ title: "", author: "", subject: "", keywords: "", creator: "", producer: "" }); setStatus(""); };

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Title" value={meta.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Document title" />
              <Input label="Author" value={meta.author} onChange={(e) => updateField("author", e.target.value)} placeholder="Author name" />
              <Input label="Subject" value={meta.subject} onChange={(e) => updateField("subject", e.target.value)} placeholder="Document subject" />
              <Input label="Keywords" value={meta.keywords} onChange={(e) => updateField("keywords", e.target.value)} placeholder="keyword1, keyword2, ..." helperText="Comma-separated" />
              <Input label="Creator" value={meta.creator} onChange={(e) => updateField("creator", e.target.value)} placeholder="Creator application" />
              <Input label="Producer" value={meta.producer} onChange={(e) => updateField("producer", e.target.value)} placeholder="Producer application" />
            </div>
          </div>
        )}
      </Panel>

      {file && (
        <Panel>
          <div className="flex items-center gap-4">
            <Button onClick={handleSave} disabled={isProcessing}>
              {isProcessing ? "Saving…" : "Save Metadata & Download"}
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
