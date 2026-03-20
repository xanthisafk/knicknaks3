import { useState, useEffect, useRef } from "react";
import { Button, Label, Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { marked } from "marked";
import { getSingletonHighlighter } from "shiki";
import { useTheme } from "@/hooks/useTheme";
import { Check, Download, Loader2, Trash2, TriangleAlert } from "lucide-react";

const DEFAULT_PRINT = `<!DOCTYPE html>
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
      background: transparent;
      font-size: 14px;
    }
    h1 { font-size: 24px; margin-top: 32px; }
    h2 { font-size: 20px; margin-top: 24px; }
    h3 { font-size: 16px; margin-top: 20px; }
    code {
      background: #f0f0f0;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 13px;
    }
    /* Shiki renders its own pre — let its bg through but strip double padding */
    pre:not(.shiki) {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
    }
    pre:not(.shiki) code { background: none; padding: 0; }
    .shiki {
      border-radius: 6px;
      padding: 12px 16px !important;
      overflow-x: auto;
      font-size: 13px;
      line-height: 1.6;
    }
    .shiki code { background: transparent !important; padding: 0 !important; }
    blockquote {
      border-left: 3px solid #ccc;
      margin-left: 0;
      padding-left: 16px;
      color: #555;
    }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f5f5f5; font-weight: 600; }
    img { max-width: 100%; }
    hr { border: none; border-top: 1px solid #ddd; margin: 24px 0; }

    @media print {
      body { margin: 0; background: transparent; }
    }
  </style>
</head>
<body>%%HTML%%</body>
</html>`

const DEFAULT_MD = `# Hello World

This is a **Markdown to PDF** converter.

## Features

- Write or paste Markdown
- Preview rendered HTML
- Export as PDF

> All processing happens in your browser. No data leaves your device.

\`\`\`python
def greet(name):
  return f"Hello, {name}!"
\`\`\`
`;

let highlighterPromise: ReturnType<typeof getSingletonHighlighter>;
function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = getSingletonHighlighter({
      themes: ["github-dark", "github-light"],
      langs: [
        "javascript", "typescript", "tsx", "jsx", "html", "css", "scss",
        "json", "yaml", "toml", "xml",
        "bash", "sh", "powershell",
        "python", "ruby", "php", "java", "kotlin", "swift", "go", "rust", "c", "cpp", "csharp",
        "sql", "graphql",
        "dockerfile", "nginx", "terraform",
        "markdown", "diff",
      ],
    });
  }
  return highlighterPromise;
}

export default function MarkdownToPdfTool() {
  const [markdown, setMarkdown] = useState(DEFAULT_MD);
  const [html, setHtml] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const { theme } = useTheme();
  const shikiTheme = theme === "dark" ? "github-dark" : "github-light";

  // Render markdown with Shiki, re-runs when markdown or theme changes
  useEffect(() => {
    const render = async () => {
      try {
        const highlighter = await getHighlighter();
        const renderer = new marked.Renderer();

        renderer.code = ({ text, lang }) => {
          const supported = highlighter.getLoadedLanguages();
          const resolvedLang = lang && supported.includes(lang) ? lang : "text";
          try {
            return highlighter.codeToHtml(text, { lang: resolvedLang, theme: shikiTheme });
          } catch {
            return `<pre class="shiki"><code>${text}</code></pre>`;
          }
        };

        const result = marked.parse(markdown, { renderer, gfm: true, breaks: true });
        setHtml(result as string);
      } catch {
        setHtml("<p>Error rendering Markdown.</p>");
      }
    };

    render();
  }, [markdown, shikiTheme]);

  const handleExport = async () => {
    if (!markdown.trim()) return;
    setIsProcessing(true);
    setStatus("Generating PDF...");

    try {
      // For print, always use github-light so it renders cleanly on white paper
      const highlighter = await getHighlighter();
      const printRenderer = new marked.Renderer();

      printRenderer.code = ({ text, lang }) => {
        const supported = highlighter.getLoadedLanguages();
        const resolvedLang = lang && supported.includes(lang) ? lang : "text";
        try {
          return highlighter.codeToHtml(text, { lang: resolvedLang, theme: "github-light" });
        } catch {
          return `<pre><code>${text}</code></pre>`;
        }
      };

      const printHtml = marked.parse(markdown, {
        renderer: printRenderer,
        gfm: true,
        breaks: true,
      }) as string;

      const fullPrintDoc = DEFAULT_PRINT.replace("%%HTML%%", printHtml);

      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;width:0;height:0;opacity:0;pointer-events:none;";
      iframe.srcdoc = fullPrintDoc;
      iframeRef.current = iframe;
      document.body.appendChild(iframe);

      iframe.onload = () => {
        try {
          iframe.contentWindow?.print();
        } finally {
          setTimeout(() => {
            iframe.remove();
            iframeRef.current = null;
          }, 1000);
        }
        setStatus("Print dialog opened");
        setIsProcessing(false);
      };
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Failed"}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="flex-1 flex flex-col gap-2">
        <Panel className="max-h-fit">
          <Textarea
            label="Markdown"
            value={markdown}
            onChange={(e) => { setMarkdown(e.target.value); setStatus(""); }}
            placeholder="Type or paste Markdown here..."
            className="font-mono"
            rows={20}
          />
        </Panel>

        <Panel className="flex-1 space-y-2">
          <div className="flex justify-between items-center gap-4">
            <Button
              icon={isProcessing ? Loader2 : Download}
              onClick={handleExport}
              disabled={isProcessing || !markdown.trim()}>
              {isProcessing ? "Generating..." : "Export to PDF"}
            </Button>
            <Button variant="ghost" icon={Trash2} onClick={() => setMarkdown("")}>Clear</Button>
          </div>
          {status && (
            <Label icon={status.startsWith("Error") ? TriangleAlert : Check}
              variant={status.startsWith("Error") ? "danger" : "success"}>
              {status}
            </Label>
          )}
        </Panel>
      </div>

      {html ? (
        <Panel className="flex-1 max-h-fit">
          <div className="space-y-2 max-h-fit">
            <Label>Preview</Label>
            {/* No hardcoded colors — inherits theme surface + prose-invert in dark */}
            <div
              className="prose prose-sm max-w-none dark:prose-invert p-4 rounded-md border border-(--border-default) bg-(--surface-secondary) overflow-auto max-h-96"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </Panel>
      ) : (
        <Panel className="flex-1 max-h-60 flex items-center justify-center flex-col gap-6">
          <span className="font-emoji text-6xl">📝</span>
          <h3 className="text-(--text-tertiary)">Preview will appear here</h3>
        </Panel>
      )}


    </div>
  );
}