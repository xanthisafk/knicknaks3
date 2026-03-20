import { useState } from "react";
import { Button, Input, Label } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PDFDocument } from "pdf-lib";
import { downloadPdf } from "@/tools/_pdf-utils";
import FileDropZone from "@/components/advanced/FileDropZone";
import { ArrowDown, ArrowUp, ArrowUpDown, Check, Loader2, Merge, Trash2, TriangleAlert } from "lucide-react";

export default function MergePdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [merging, setMerging] = useState(false);
  const [filename, setFilename] = useState("merged");

  const move = (i: number, dir: -1 | 1) =>
    setFiles(f => {
      const next = [...f];
      const j = i + dir;
      if (j < 0 || j >= next.length) return f;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const handleMerge = async () => {
    setMerging(true);
    setStatus(null);
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        (await merged.copyPages(src, src.getPageIndices())).forEach(p => merged.addPage(p));
      }
      downloadPdf(await merged.save(), `${filename || "merged"}.pdf`);
      setStatus({ ok: true, msg: `Merged ${files.length} files successfully!` });
    } catch (err) {
      setStatus({ ok: false, msg: err instanceof Error ? err.message : "Failed to merge" });
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="space-y-2">
      <FileDropZone
        multiple
        accepts=".pdf"
        emoji="📑"
        onUpload={f => { setFiles(prev => [...prev, ...f.files]); setStatus(null); }}
      />

      {files.length > 1 && (
        <Panel className="space-y-4">
          <div className="space-y-1">
            <Label icon={ArrowUpDown}>Order &amp; Remove</Label>
            {files.map((file, i) => (
              <div key={`${file.name}-${i}`} className="flex items-center gap-2 text-sm text-(--text-secondary) hover:bg-(--surface-secondary) rounded-md p-1 transition-colors">
                <span className="w-6 text-center text-xs text-(--text-tertiary)">{i + 1}</span>
                <span className="flex-1 truncate">{file.name}</span>
                <Button onClick={() => move(i, -1)} disabled={i === 0} variant="ghost" size="sm" icon={ArrowUp} />
                <Button onClick={() => move(i, 1)} disabled={i === files.length - 1} variant="ghost" size="sm" icon={ArrowDown} />
                <Button onClick={() => setFiles(f => f.filter((_, j) => j !== i))} variant="ghost" size="sm" icon={Trash2} />
              </div>
            ))}
          </div>
          <Input
            label="Filename"
            placeholder="merged"
            trailingText=".pdf"
            value={filename}
            onChange={e => setFilename(e.target.value)}
          />
          <div className="flex items-center flex-row justify-between gap-2">
            <Button onClick={handleMerge} disabled={merging} icon={merging ? Loader2 : Merge}>
              {merging ? "Merging…" : `Merge ${files.length} Files`}
            </Button>
            <Button icon={Trash2} variant="ghost" onClick={() => { setFiles([]); setStatus(null); }}>
              Clear All
            </Button>
          </div>

          {status && (
            <Label icon={status.ok ? Check : TriangleAlert} variant={status.ok ? "success" : "danger"}>
              {status.msg}
            </Label>
          )}
        </Panel>
      )}
    </div>
  );
}