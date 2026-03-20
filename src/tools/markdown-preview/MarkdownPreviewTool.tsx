import { useState, useEffect } from "react";
import { marked } from "marked";
import { getSingletonHighlighter } from 'shiki';
import { Button, CopyButton, Label, Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { useTheme } from "@/hooks/useTheme";
import { FlaskConical, Loader2, Trash2 } from "lucide-react";

const SAMPLE_MARKDOWN = `# Hello Knicknaks! 👋

<a target="_blank"
 href="https://tenor.com/view/cecesrhaccc1-on-tiktok-cecesrhaccc1-wave-wave-cat-cecesgif-gif-13285291531648506491">![Cat waving](/content/tools/cecesrhaccc1-on-tiktok-cecesrhaccc1.gif)</a>


This is a **live preview** of sample Markdown content.

## Features

- ~~Strikethrough~~ text
- **Bold** and *italic* text
- [Links](https://knicknaks.xanthis.xyz)
- Inline \`code\` blocks

### Code Block

\`\`\`python
def greet(name):
  return (f"Hello, {name}!")
\`\`\`

### Multi language support in code

- SQL
\`\`\`sql
SELECT * FROM users;
\`\`\`

- JSON
\`\`\`json
{
  "name": "John Doe",
  "age": 30,
  "email": "[EMAIL_ADDRESS]"
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
      langs: [
        // Web
        "javascript", "typescript", "tsx", "jsx", "html", "css", "scss",

        // Data & config
        "json", "yaml", "toml", "xml", "csv",

        // Shell
        "bash", "sh", "powershell", "batch",

        // Backend
        "python", "ruby", "php", "java", "kotlin", "swift", "go", "rust", "c", "cpp", "csharp",

        // Query
        "sql", "graphql",

        // Infra / DevOps
        "dockerfile", "nginx", "terraform",

        // Docs & misc
        "markdown", "latex", "diff",
      ],
    });
  }
  return highlighterPromise;
}

export default function MarkdownPreviewTool() {
  const { theme } = useTheme();
  const [input, setInput] = useState(SAMPLE_MARKDOWN);
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const renderMarkdown = async () => {
      setLoading(true);
      const shikiTheme = theme === "dark" ? "github-dark" : "github-light";

      try {
        const highlighter = await getHighlighter();
        const renderer = new marked.Renderer();

        renderer.code = ({ text, lang }) => {
          try {
            return highlighter.codeToHtml(text, {
              lang: lang || "text",
              theme: shikiTheme,
            });
          } catch {
            return `<pre class="shiki"><code>${text}</code></pre>`;
          }
        };

        const result = marked.parse(input, {
          renderer,
          gfm: true,
          breaks: true,
        });

        setHtml(result as string);
      } catch (e) {
        console.error("Markdown render error:", e);
        setHtml("<p>Error rendering Markdown</p>");
      } finally {
        setLoading(false);
      }
    };

    renderMarkdown();
  }, [input, theme]);

  return (
    <div className="space-y-2">
      <div className="flex flex-col md:flex-row gap-2">
        <Panel className="flex-1 max-h-fit flex flex-col gap-3">
          <Textarea
            label="Markdown"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your Markdown here..."
            className="font-mono"
            rows={40}
            spellCheck={false} />
          <div className="flex justify-between">
            <Button
              icon={FlaskConical}
              variant="secondary"
              size="sm"
              onClick={() => setInput(SAMPLE_MARKDOWN)}
            >Load Sample</Button>
            <Button
              icon={Trash2}
              variant="ghost"
              size="sm"
              onClick={() => setInput("")}
            >Clear</Button>
          </div>
        </Panel>
        <Panel className="flex-1 space-y-3 max-h-fit">
          <div className="flex justify-between">
            <Label>Preview</Label>
            <CopyButton text={html} label="Copy HTML" />
          </div>
          {loading
            ? <div className="flex flex-col items-center justify-center gap-6">
              <Loader2 size="64" color="var(--color-primary-500)" className="animate-spin" />
              <h3 className="text-(--text-tertiary)">Rendering...</h3>
            </div>
            : <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />}
        </Panel>
      </div>
    </div>
  );
}
