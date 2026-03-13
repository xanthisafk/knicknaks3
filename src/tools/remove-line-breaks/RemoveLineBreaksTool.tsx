import { useState, useMemo } from "react";
import { Button, Textarea, Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

export default function RemoveLineBreaksTool() {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState(" ");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!input) return "";
    return input
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .join(separator);
  }, [input, separator]);

  const handleCopy = async () => {
    if (await copyToClipboard(output)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const PRESETS = [
    { label: "Space", value: " " },
    { label: "Comma", value: ", " },
    { label: "Semicolon", value: "; " },
    { label: "Pipe", value: " | " },
    { label: "None", value: "" },
  ];

  return (
    <div className="space-y-2">
      <Panel>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text(--text-primary)">Join with</label>
            <div className="flex gap-1">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setSeparator(p.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-colors cursor-pointer ${separator === p.value
                      ? "bg-[var(--color-primary-500)] text-white"
                      : "bg-[var(--surface-secondary)] text(--text-secondary) hover:text(--text-primary)"
                    }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text(--text-secondary)">Custom</label>
            <input
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              className="w-24 px-3 py-1.5 rounded-[var(--radius-md)] bg-[var(--surface-elevated)] text(--text-primary) border border-[var(--border-default)] text-sm font-[family-name:var(--font-mono)]"
            />
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel>
          <div className="space-y-3">
            <label className="text-sm font-medium text(--text-primary)">Input (with line breaks)</label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"Line one\nLine two\nLine three"}
              className="h-48 text-sm"
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
            <Textarea value={output} readOnly className="h-48 text-sm" />
          </div>
        </Panel>
      </div>
    </div>
  );
}
