import { useState } from "react";
import { Button, Input, Label } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PDFDocument } from "pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";
import FileDropZone from "@/components/advanced/FileDropZone";
import { Check, CornerDownLeft, Loader2, Save, X } from "lucide-react";

interface Metadata {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
}

export default function PdfMetadataTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [meta, setMeta] = useState<Metadata>({
    title: "", author: "", subject: "", keywords: "", creator: "",
  });
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");

  const handleFile = async (file: File) => {
    if (!file) return;
    setLoading(true);
    setFile(file);
    setStatus("");
    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPageCount(pdf.getPageCount());
      setMeta({
        title: pdf.getTitle() ?? "",
        author: pdf.getAuthor() ?? "",
        subject: pdf.getSubject() ?? "",
        keywords: (pdf.getKeywords() ?? ""),
        creator: pdf.getCreator() ?? "",
      });
    } catch {
      setStatus("Error: Could not read PDF.");
    } finally {
      setLoading(false);
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

      const bytes = await pdf.save();
      downloadPdf(bytes, file.name);
      setStatus("Metadata updated and saved!");
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Failed"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateField = (key: keyof Metadata, value: string) => {
    setMeta((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => { setFile(null); setPageCount(0); setMeta({ title: "", author: "", subject: "", keywords: "", creator: "" }); setStatus(""); };

  return (
    <div className="space-y-2">
      {!file ? (
        <FileDropZone accepts=".pdf" onUpload={f => handleFile(f.file)} emoji="📄" />
      ) : (
        <Panel className="flex flex-col gap-3">

          <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-(--surface-secondary) border border-(--border-default)">
            <span className="font-emoji">📄</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text(--text-primary) truncate">{file.name}</p>
              <p className="text-xs text-(--text-tertiary)">{formatFileSize(file.size)} · {pageCount} pages</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              icon={CornerDownLeft}
            >Choose Another</Button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-6">
              <Loader2 size={32} className="animate-spin text-primary-500" />
              <Label>Loading metadata...</Label>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Title" value={meta.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Document title" />
              <Input label="Author" value={meta.author} onChange={(e) => updateField("author", e.target.value)} placeholder="Author name" />
              <Input label="Creator" value={meta.creator} onChange={(e) => updateField("creator", e.target.value)} placeholder="Creator application" />
              <Input label="Subject" value={meta.subject} onChange={(e) => updateField("subject", e.target.value)} placeholder="Document subject" />
              <Input label="Keywords" value={meta.keywords} onChange={(e) => updateField("keywords", e.target.value)} placeholder="keyword1, keyword2, ..." helperText="Comma-separated" className="md:col-span-2" />
            </div>
          )}
          <Button onClick={handleSave} disabled={isProcessing} icon={Save}>
            {isProcessing ? "Saving..." : "Save Metadata & Download"}
          </Button>
          {status && isProcessing ? (
            <Label
              icon={Loader2}
              variant="default">
              {status}
            </Label>
          ) : status && (
            <Label
              icon={status.startsWith("Error") ? X : Check}
              variant={status.startsWith("Error") ? "danger" : "success"}>
              {status}
            </Label>
          )}
        </Panel>
      )}
    </div>
  );
}
