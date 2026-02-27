import { useState, useMemo } from "react";
import { Button, Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

type Mode = "characters" | "words" | "lines";

function reverseText(text: string, mode: Mode): string {
  switch (mode) {
    case "characters":
      return [...text].reverse().join("");
    case "words":
      return text
        .split("\n")
        .map((line) => line.split(/\s+/).reverse().join(" "))
        .join("\n");
    case "lines":
      return text.split("\n").reverse().join("\n");
    default:
      return text;
  }
}

export default function ReverseTextTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("characters");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => reverseText(input, mode), [input, mode]);

  const handleCopy = async () => {
    if (await copyToClipboard(output)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const MODES: { id: Mode; label: string }[] = [
    { id: "characters", label: "🔤 Characters" },
    { id: "words", label: "📝 Words" },
    { id: "lines", label: "📃 Lines" },
  ];

  return (
    <div className="space-y-6">
      <Panel>
        <label className="text-sm font-medium text-[var(--text-primary)] mb-3 block">Reverse mode</label>
        <div className="flex flex-wrap gap-2">
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
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel>
          <div className="space-y-3">
            <label className="text-sm font-medium text-[var(--text-primary)]">Input</label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hello World"
              className="h-48 text-sm"
            />
          </div>
        </Panel>
        <Panel>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--text-primary)]">Reversed</label>
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
