import { useState } from "react";
import { Button, Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

type IndentStyle = "2" | "4" | "tab";

export default function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState<IndentStyle>("2");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const format = () => {
    setError("");
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const space = indent === "tab" ? "\t" : parseInt(indent);
      setOutput(JSON.stringify(parsed, null, space));
    } catch (e: unknown) {
      setError((e instanceof Error ? e.message : "Invalid JSON").replace("JSON.parse: ", ""));
      setOutput("");
    }
  };

  const minify = () => {
    setError("");
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e: unknown) {
      setError((e instanceof Error ? e.message : "Invalid JSON").replace("JSON.parse: ", ""));
      setOutput("");
    }
  };

  const handleCopy = async () => {
    if (await copyToClipboard(output)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSampleJson = () => {
    const sample = JSON.stringify({
      name: "Knicknaks",
      version: "1.0.0",
      features: ["offline", "fast", "free"],
      config: { theme: "dark", tools: 100, nested: { deep: true } },
    });
    setInput(sample);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--text-primary)]">Input JSON</label>
              <Button size="sm" variant="ghost" onClick={handleSampleJson}>
                📝 Sample
              </Button>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Paste your JSON here... e.g. {"key": "value"}'
              className="h-72 font-[family-name:var(--font-mono)] text-sm"
            />
          </div>
        </Panel>

        <Panel>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--text-primary)]">Formatted Output</label>
              {output && (
                <Button size="sm" variant="ghost" onClick={handleCopy}>
                  {copied ? "✓ Copied!" : "📋 Copy"}
                </Button>
              )}
            </div>
            <Textarea
              value={output}
              readOnly
              placeholder="Formatted JSON will appear here..."
              className="h-72 font-[family-name:var(--font-mono)] text-sm"
            />
          </div>
        </Panel>
      </div>

      {error && (
        <Panel padding="sm">
          <p className="text-sm text-[var(--color-error)] font-[family-name:var(--font-mono)]" role="alert">
            ❌ {error}
          </p>
        </Panel>
      )}

      <Panel>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[var(--text-secondary)]">Indent</label>
            <select
              value={indent}
              onChange={(e) => setIndent(e.target.value as IndentStyle)}
              className="px-3 py-1.5 rounded-[var(--radius-md)] bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border-default)] text-sm cursor-pointer"
            >
              <option value="2">2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="tab">Tabs</option>
            </select>
          </div>
          <div className="flex items-center gap-2 mt-auto">
            <Button onClick={format}>✨ Format</Button>
            <Button variant="secondary" onClick={minify}>
              📦 Minify
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setInput("");
                setOutput("");
                setError("");
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
