import { useState, useEffect } from "react";
import { marked } from "marked";
import { getSingletonHighlighter } from 'shiki';
import { Button } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

const SAMPLE_MARKDOWN = `# Hello Markdown! 👋

This is a **live preview** of your Markdown content.

## Features

- ~~Strikethrough~~ text
- **Bold** and *italic* text
- [Links](https://knicknaks.xanthis.xyz)
- Inline \`code\` blocks

### Code Block

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Table

| Feature | Supported |
|---------|-----------|
| GFM     | ✅        |
| Tables  | ✅        |
| Tasks   | ✅        |

### Task List

- [x] Write Markdown
- [x] Preview it live
- [ ] Export as HTML

> 💡 **Tip:** Start typing on the left to see the preview update in real-time.
`;

let highlighterPromise: ReturnType<typeof getSingletonHighlighter>;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = getSingletonHighlighter({
      themes: ["github-dark", "github-light"],
      langs: ["javascript", "ts", "tsx", "json", "bash", "html", "css"],
    });
  }
  return highlighterPromise;
}

export default function MarkdownPreviewTool() {
  const { theme } = useTheme();
  const [input, setInput] = useState(SAMPLE_MARKDOWN);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
  const renderMarkdown = async () => {
    const shikiTheme = theme === "dark" ? "github-dark" : "github-light";

    try {
      const highlighter = await getHighlighter();

      const result = await marked.parse(input, {
        async: true,
        gfm: true,
        breaks: true,
        walkTokens: async (token) => {
          if (token.type === "code") {
            try {
              const html = highlighter.codeToHtml(token.text, {
                lang: token.lang || "text",
                theme: shikiTheme,
              });

              token.type = "html";
              token.text = html;
            } catch (e) {
              console.warn("Shiki error:", e);
            }
          }
        },
      });

      setHtml(result as string);
    } catch (e) {
      console.error("Markdown render error:", e);
      setHtml("<p>Error rendering Markdown</p>");
    }
  };

  renderMarkdown();
}, [input, theme]);

  const handleCopyHtml = async () => {
    if (await copyToClipboard(html)) {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setInput(SAMPLE_MARKDOWN)}
          >
            📝 Load Sample
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setInput("")}>
            Clear
          </Button>
        </div>
        <Button size="sm" variant="secondary" onClick={handleCopyHtml}>
          {copiedHtml ? "✓ Copied!" : "📋 Copy HTML"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: "600px" }}>
        {/* Editor */}
        <Panel padding="none" className="flex flex-col overflow-hidden border border-(--border-default)">
          <div className="px-4 py-2 border-b border-(--border-default) bg-(--surface-secondary) flex justify-between items-center">
            <span className="text-xs font-medium text-(--text-secondary) uppercase tracking-wider">✏️ Editor</span>
            <span className="text-[10px] text-(--text-tertiary)">{input.length} characters</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your Markdown here..."
            className="flex-1 w-full p-4 bg-transparent text(--text-primary) font-[family-name:var(--font-mono)] text-sm resize-none border-none outline-none min-h-[400px]"
            spellCheck={false}
          />
        </Panel>

        {/* Preview */}
        <Panel padding="none" className="flex flex-col overflow-hidden border border-(--border-default) bg-(--surface-primary)">
          <div className="px-4 py-2 border-b border-(--border-default) bg-(--surface-secondary) uppercase tracking-wider">
            <span className="text-xs font-medium text-(--text-secondary)">👁️ Preview</span>
          </div>
          <div
            className="flex-1 p-6 overflow-y-auto prose prose-sm max-w-none
                      dark:prose-invert
                      [&_pre]:bg-transparent
                      [&_.shiki]:bg-transparent
                      [&_.shiki]:p-4
                      [&_.shiki]:rounded-md
                      [&_.shiki]:overflow-x-auto
                      [&_.shiki]:font-[family-name:var(--font-mono)]
                      [&_.shiki]:text-sm
                      [&_.shiki]:leading-6"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Panel>
      </div>
    </div>
  );
}
