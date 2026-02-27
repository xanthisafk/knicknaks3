import { useState } from "react";
import { Button, Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

type SortMode = "alpha-asc" | "alpha-desc" | "length-asc" | "length-desc" | "numeric" | "random";

const SORT_OPTIONS: { id: SortMode; label: string }[] = [
  { id: "alpha-asc", label: "A → Z" },
  { id: "alpha-desc", label: "Z → A" },
  { id: "length-asc", label: "Short → Long" },
  { id: "length-desc", label: "Long → Short" },
  { id: "numeric", label: "Numeric" },
  { id: "random", label: "🎲 Shuffle" },
];

function sortLines(text: string, mode: SortMode): string {
  const lines = text.split("\n");
  switch (mode) {
    case "alpha-asc":
      return lines.sort((a, b) => a.localeCompare(b)).join("\n");
    case "alpha-desc":
      return lines.sort((a, b) => b.localeCompare(a)).join("\n");
    case "length-asc":
      return lines.sort((a, b) => a.length - b.length).join("\n");
    case "length-desc":
      return lines.sort((a, b) => b.length - a.length).join("\n");
    case "numeric":
      return lines.sort((a, b) => {
        const na = parseFloat(a) || 0;
        const nb = parseFloat(b) || 0;
        return na - nb;
      }).join("\n");
    case "random":
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }
      return lines.join("\n");
    default:
      return text;
  }
}

export default function TextSorterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("alpha-asc");
  const [copied, setCopied] = useState(false);

  const handleSort = (mode: SortMode) => {
    setSortMode(mode);
    setOutput(sortLines(input, mode));
  };

  const lineCount = input ? input.split("\n").length : 0;

  const handleCopy = async () => {
    if (await copyToClipboard(output)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <Panel>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[var(--text-primary)]">Input Lines</label>
            <span className="text-xs text-[var(--text-tertiary)]">{lineCount} lines</span>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"banana\napple\ncherry\ndate"}
            className="h-48 text-sm"
          />
        </div>
      </Panel>

      <Panel>
        <label className="text-sm font-medium text-[var(--text-primary)] mb-3 block">Sort by</label>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((opt) => (
            <Button
              key={opt.id}
              variant={sortMode === opt.id ? "primary" : "secondary"}
              size="sm"
              onClick={() => handleSort(opt.id)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </Panel>

      {output && (
        <Panel>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--text-primary)]">Sorted Result</label>
              <Button size="sm" variant="ghost" onClick={handleCopy}>
                {copied ? "✓ Copied!" : "📋 Copy"}
              </Button>
            </div>
            <Textarea value={output} readOnly className="h-48 text-sm" />
          </div>
        </Panel>
      )}
    </div>
  );
}
