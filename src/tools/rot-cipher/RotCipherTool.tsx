import { useState } from "react";
import { Button, Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

function rotN(text: string, shift: number): string {
  const n = ((shift % 26) + 26) % 26;
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch >= "a" ? 97 : 65;
    return String.fromCharCode(((ch.charCodeAt(0) - base + n) % 26) + base);
  });
}

export default function RotCipherTool() {
  const [input, setInput] = useState("");
  const [shift, setShift] = useState(13);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleInputChange = (text: string) => {
    setInput(text);
    setOutput(rotN(text, shift));
  };

  const handleShiftChange = (n: number) => {
    setShift(n);
    setOutput(rotN(input, n));
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
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text(--text-primary)">Shift (N)</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={25}
                value={shift}
                onChange={(e) => handleShiftChange(parseInt(e.target.value))}
                className="w-40 accent-primary-500"
              />
              <span className="text-lg font-bold font-mono text-primary-500 w-8 text-center tabular-nums">
                {shift}
              </span>
            </div>
          </div>
          <div className="flex gap-1.5 ml-auto">
            {[1, 3, 5, 10, 13].map((n) => (
              <button
                key={n}
                onClick={() => handleShiftChange(n)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${shift === n
                  ? "bg-primary-500 text-white"
                  : "bg-(--surface-secondary) text(--text-secondary) hover:text(--text-primary)"
                  }`}
              >
                ROT{n}
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
              placeholder="Enter text to cipher..."
              className="h-48 text-sm"
            />
          </div>
        </Panel>
        <Panel>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text(--text-primary)">
                Output (ROT{shift})
              </label>
              {output && (
                <Button size="sm" variant="ghost" onClick={handleCopy}>
                  {copied ? "✓ Copied!" : "📋 Copy"}
                </Button>
              )}
            </div>
            <Textarea
              value={output}
              readOnly
              placeholder="Ciphered text will appear here..."
              className="h-48 text-sm font-mono"
            />
          </div>
        </Panel>
      </div>

      <Panel padding="sm">
        <p className="text-xs text-(--text-tertiary) text-center">
          💡 To decode, apply ROT{26 - shift} (or{" "}
          <button
            onClick={() => handleShiftChange(26 - shift)}
            className="underline hover:text(--text-primary) cursor-pointer"
          >
            click here
          </button>
          )
        </p>
      </Panel>
    </div>
  );
}
