import { useState, useMemo } from "react";
import { Input, Button } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

const PRESETS = [
  { label: "Newline", value: "\\n" },
  { label: "Space", value: " " },
  { label: "Comma", value: ", " },
  { label: "Pipe", value: " | " },
  { label: "None", value: "" },
];

export default function TextRepeaterTool() {
  const [text, setText] = useState("");
  const [count, setCount] = useState(3);
  const [sep, setSep] = useState("\\n");
  const [copied, setCopied] = useState(false);

  const actualSep = sep === "\\n" ? "\n" : sep === "\\t" ? "\t" : sep;
  const output = useMemo(() =>
    text ? Array(Math.min(count, 1000)).fill(text).join(actualSep) : "",
    [text, count, actualSep]
  );

  const handleCopy = async () => {
    if (!output) return;
    await copyToClipboard(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      <Panel>
        <div className="space-y-4">
          <Input label="Text to repeat" value={text} onChange={e => setText(e.target.value)} placeholder="Hello!" />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Repeat count"
              type="number"
              value={count}
              onChange={e => setCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text(--text-primary)">Separator</label>
              <input
                value={sep}
                onChange={e => setSep(e.target.value)}
                className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-[var(--surface-elevated)] text(--text-primary) border border-[var(--border-default)] text-sm font-[family-name:var(--font-mono)]"
                placeholder="\n"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => setSep(p.value)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${sep === p.value ? "border-[var(--color-primary-500)] bg-[var(--color-primary-500)]/10 text-[var(--color-primary-500)]" : "border-[var(--border-default)] text(--text-secondary) hover:border-[var(--color-primary-500)]"}`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {output && (
        <Panel>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text(--text-primary)">
                Output <span className="text-[var(--text-tertiary)] font-normal">({count}x)</span>
              </span>
              <Button size="sm" variant="secondary" onClick={handleCopy}>
                {copied ? "✓ Copied" : "Copy"}
              </Button>
            </div>
            <div className="px-3 py-3 rounded-[var(--radius-md)] bg-[var(--surface-secondary)] text-sm text(--text-primary) whitespace-pre-wrap max-h-64 overflow-y-auto font-[family-name:var(--font-mono)] break-all">
              {output}
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}
