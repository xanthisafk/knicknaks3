import { useState } from "react";
import { Button, Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

function encodeHtmlEntities(text: string): string {
  const el = document.createElement("textarea");
  el.textContent = text;
  return el.innerHTML;
}

function decodeHtmlEntities(text: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
}

export default function HtmlEntitiesTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);

  const handleInputChange = (text: string) => {
    setInput(text);
    setOutput(mode === "encode" ? encodeHtmlEntities(text) : decodeHtmlEntities(text));
  };

  const handleModeChange = (newMode: "encode" | "decode") => {
    setMode(newMode);
    setOutput(newMode === "encode" ? encodeHtmlEntities(input) : decodeHtmlEntities(input));
  };

  const handleSwap = () => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    setInput(output);
    const newOutput = newMode === "encode" ? encodeHtmlEntities(output) : decodeHtmlEntities(output);
    setOutput(newOutput);
  };

  const handleCopy = async () => {
    if (await copyToClipboard(output)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-2">
      <Panel>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-1 p-1 rounded-[var(--radius-md)] bg-[var(--surface-secondary)]">
            {(["encode", "decode"] as const).map((m) => (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                className={`px-4 py-1.5 text-sm font-medium rounded-[var(--radius-sm)] transition-colors cursor-pointer ${mode === m
                    ? "bg-[var(--surface-elevated)] text(--text-primary) shadow-sm"
                    : "text-[var(--text-tertiary)] hover:text(--text-primary)"
                  }`}
              >
                {m === "encode" ? "Encode" : "Decode"}
              </button>
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
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={mode === "encode" ? '<div class="hello">&</div>' : "&lt;div class=&quot;hello&quot;&gt;&amp;&lt;/div&gt;"}
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
            <Textarea
              value={output}
              readOnly
              placeholder="Converted text will appear here..."
              className="h-48 font-[family-name:var(--font-mono)] text-sm"
            />
          </div>
        </Panel>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={handleSwap}>🔄 Swap</Button>
        <Button variant="ghost" onClick={() => { setInput(""); setOutput(""); }}>Clear</Button>
      </div>
    </div>
  );
}
