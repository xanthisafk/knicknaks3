import { useState, useMemo } from "react";
import { Button, Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { marked } from "marked";
import { downloadBlob } from "@/tools/_pdf-utils";

const DEFAULT_MD = `# Hello World

This is a **Markdown to PDF** converter.

## Features

- Write or paste Markdown
- Preview rendered HTML
- Export as PDF

> All processing happens in your browser. No data leaves your device.
`;

export default function MarkdownToPdfTool() {
  const [markdown, setMarkdown] = useState(DEFAULT_MD);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");

  const html = useMemo(() => {
    try {
      return marked.parse(markdown, { async: false }) as string;
    } catch {
      return "<p>Error rendering Markdown.</p>";
    }
  }, [markdown]);

  const handleExport = async () => {
    if (!markdown.trim()) return;
    setIsProcessing(true);
    setStatus("Generating PDF...");

    try {
      // Create a printable HTML document and use print-to-PDF approach
      const printHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 800px;
              margin: 40px auto;
              padding: 0 20px;
              line-height: 1.6;
              color: #1a1a1a;
              font-size: 14px;
            }
            h1 { font-size: 24px; margin-top: 32px; }
            h2 { font-size: 20px; margin-top: 24px; }
            h3 { font-size: 16px; margin-top: 20px; }
            code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-size: 13px; }
            pre { background: #f5f5f5; padding: 16px; border-radius: 6px; overflow-x: auto; }
            pre code { background: none; padding: 0; }
            blockquote { border-left: 3px solid #ccc; margin-left: 0; padding-left: 16px; color: #555; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f5f5f5; font-weight: 600; }
            img { max-width: 100%; }
            hr { border: none; border-top: 1px solid #ddd; margin: 24px 0; }
          </style>
        </head>
        <body>${html}</body>
        </html>
      `;

      // Open a new window for printing/saving as PDF
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        setStatus("Error: Pop-up blocked. Please allow pop-ups and try again.");
        return;
      }

      printWindow.document.write(printHtml);
      printWindow.document.close();

      // Small delay to ensure content is rendered
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        setStatus("✓ Print dialog opened — choose 'Save as PDF' to download!");
      }, 500);
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
          <Textarea
            label="Markdown"
            value={markdown}
            onChange={(e) => { setMarkdown(e.target.value); setStatus(""); }}
            placeholder="Type or paste Markdown here..."
            className="h-48 font-[family-name:var(--font-mono)] text-sm"
          />
        </div>
      </Panel>

      <Panel>
        <div className="space-y-3">
          <h3 className="text-sm font-medium text(--text-primary)">Preview</h3>
          <div
            className="prose prose-sm max-w-none p-4 rounded-[var(--radius-md)] bg-white border border-[var(--border-default)] text-gray-900 overflow-auto max-h-96"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </Panel>

      <Panel>
        <div className="flex items-center gap-4">
          <Button onClick={handleExport} disabled={isProcessing || !markdown.trim()}>
            {isProcessing ? "Generating…" : "Export to PDF"}
          </Button>
          <Button variant="ghost" onClick={() => setMarkdown("")}>
            Clear
          </Button>
        </div>
        {status && (
          <p className={`mt-3 text-sm ${status.startsWith("Error") ? "text-[var(--color-error)]" : "text(--text-secondary)"}`}>
            {status}
          </p>
        )}
        <p className="mt-2 text-xs text-[var(--text-tertiary)]">
          Uses the browser's built-in Print → Save as PDF for best quality output.
        </p>
      </Panel>
    </div>
  );
}
