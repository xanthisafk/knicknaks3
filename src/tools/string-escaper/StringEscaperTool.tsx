import { useState, useMemo } from "react";
import { Button, Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

type EscapeMode = "javascript" | "json" | "html" | "csv" | "sql";

const MODES: { id: EscapeMode; label: string }[] = [
  { id: "javascript", label: "JavaScript" },
  { id: "json", label: "JSON" },
  { id: "html", label: "HTML" },
  { id: "csv", label: "CSV" },
  { id: "sql", label: "SQL" },
];

function escapeString(text: string, mode: EscapeMode): string {
  if (!text) return "";
  switch (mode) {
    case "javascript":
      return text
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
        .replace(/\0/g, "\\0");
    case "json":
      return JSON.stringify(text).slice(1, -1); // Remove surrounding quotes
    case "html":
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    case "csv":
      if (text.includes(",") || text.includes('"') || text.includes("\n")) {
        return '"' + text.replace(/"/g, '""') + '"';
      }
      return text;
    case "sql":
      return text.replace(/'/g, "''");
    default:
      return text;
  }
}

function unescapeString(text: string, mode: EscapeMode): string {
  if (!text) return "";
  switch (mode) {
    case "javascript":
    case "json":
      try {
        return JSON.parse(`"${text}"`);
      } catch {
        return text
          .replace(/\\n/g, "\n")
          .replace(/\\r/g, "\r")
          .replace(/\\t/g, "\t")
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'")
          .replace(/\\\\/g, "\\");
      }
    case "html": {
      const el = document.createElement("textarea");
      el.innerHTML = text;
      return el.value;
    }
    case "csv":
      if (text.startsWith('"') && text.endsWith('"')) {
        return text.slice(1, -1).replace(/""/g, '"');
      }
      return text;
    case "sql":
      return text.replace(/''/g, "'");
    default:
      return text;
  }
}

export default function StringEscaperTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<EscapeMode>("javascript");
  const [direction, setDirection] = useState<"escape" | "unescape">("escape");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    return direction === "escape"
      ? escapeString(input, mode)
      : unescapeString(input, mode);
  }, [input, mode, direction]);

  const handleCopy = async () => {
    if (await copyToClipboard(output)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-1 p-1 rounded-[var(--radius-md)] bg-[var(--surface-secondary)]">
            {(["escape", "unescape"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDirection(d)}
                className={`px-4 py-1.5 text-sm font-medium rounded-[var(--radius-sm)] transition-colors cursor-pointer ${
                  direction === d
                    ? "bg-[var(--surface-elevated)] text(--text-primary) shadow-sm"
                    : "text-[var(--text-tertiary)] hover:text(--text-primary)"
                }`}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MODES.map((m) => (
              <Button
                key={m.id}
                variant={mode === m.id ? "primary" : "secondary"}
                size="sm"
                onClick={() => setMode(m.id)}
              >
                {m.label}
              </Button>
            ))}
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel>
          <div className="space-y-3">
            <label className="text-sm font-medium text(--text-primary)">Input</label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Enter string to ${direction}...`}
              className="h-48 font-[family-name:var(--font-mono)] text-sm"
            />
          </div>
        </Panel>
        <Panel>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text(--text-primary)">Output</label>
              {output && (
                <Button size="sm" variant="ghost" onClick={handleCopy}>
                  {copied ? "✓ Copied!" : "📋 Copy"}
                </Button>
              )}
            </div>
            <Textarea value={output} readOnly className="h-48 font-[family-name:var(--font-mono)] text-sm" />
          </div>
        </Panel>
      </div>
    </div>
  );
}
