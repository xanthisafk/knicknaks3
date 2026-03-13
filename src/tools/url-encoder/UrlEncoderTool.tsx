import { useState, useCallback } from "react";
import { Button, Textarea, Toggle } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

export default function UrlEncoderTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [componentMode, setComponentMode] = useState(true); // true = encodeURIComponent, false = encodeURI
  const [liveMode, setLiveMode] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const processInput = useCallback(
    (text: string, processMode: "encode" | "decode", isComponent: boolean) => {
      setError("");
      if (!text.trim()) {
        setOutput("");
        return;
      }
      try {
        if (processMode === "encode") {
          setOutput(isComponent ? encodeURIComponent(text) : encodeURI(text));
        } else {
          setOutput(isComponent ? decodeURIComponent(text) : decodeURI(text));
        }
      } catch {
        setError("Invalid input. Could not " + processMode + " the text.");
        setOutput("");
      }
    },
    []
  );

  const handleInputChange = (text: string) => {
    setInput(text);
    if (liveMode) processInput(text, mode, componentMode);
  };

  const handleSwap = () => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    setInput(output);
    setOutput("");
    if (liveMode && output) processInput(output, newMode, componentMode);
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
                onClick={() => {
                  setMode(m);
                  if (liveMode && input) processInput(input, m, componentMode);
                }}
                className={`px-4 py-1.5 text-sm font-medium rounded-[var(--radius-sm)] transition-colors cursor-pointer ${mode === m
                    ? "bg-[var(--surface-elevated)] text(--text-primary) shadow-sm"
                    : "text-[var(--text-tertiary)] hover:text(--text-primary)"
                  }`}
              >
                {m === "encode" ? "Encode" : "Decode"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Toggle
              label="Component mode"
              checked={componentMode}
              onChange={(checked) => {
                setComponentMode(checked);
                if (liveMode && input) processInput(input, mode, checked);
              }}
            />
            <Toggle label="Live" checked={liveMode} onChange={setLiveMode} />
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
              placeholder={mode === "encode" ? "Enter text to encode..." : "Enter encoded URL to decode..."}
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
              placeholder="Output will appear here..."
              className="h-48 font-[family-name:var(--font-mono)] text-sm"
            />
          </div>
        </Panel>
      </div>

      {error && (
        <p className="text-sm text-[var(--color-error)] px-1" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        {!liveMode && (
          <Button onClick={() => processInput(input, mode, componentMode)}>
            {mode === "encode" ? "Encode" : "Decode"}
          </Button>
        )}
        <Button variant="secondary" onClick={handleSwap}>
          🔄 Swap Input ↔ Output
        </Button>
        <Button variant="ghost" onClick={() => { setInput(""); setOutput(""); setError(""); }}>
          Clear
        </Button>
      </div>
    </div>
  );
}
