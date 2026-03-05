import { useState } from "react";
import { Textarea, Button } from "@/components/ui";
import { Panel } from "@/components/layout";

type BitGroup = 8 | 16 | 32;
type Separator = "space" | "dash" | "none";

function textToBinary(text: string, bits: BitGroup, sep: Separator): string {
  const sepChar = sep === "space" ? " " : sep === "dash" ? "-" : "";
  return text
    .split("")
    .map((ch) => ch.charCodeAt(0).toString(2).padStart(bits, "0"))
    .join(sepChar);
}

function binaryToText(binary: string): string {
  const cleaned = binary.replace(/[^01]/g, "");
  const chunks: string[] = [];
  for (let i = 0; i + 8 <= cleaned.length; i += 8) {
    chunks.push(cleaned.slice(i, i + 8));
  }
  return chunks.map((b) => String.fromCharCode(parseInt(b, 2))).join("");
}

const BIT_OPTIONS: BitGroup[] = [8, 16, 32];
const SEP_OPTIONS: { value: Separator; label: string }[] = [
  { value: "space", label: "Space" },
  { value: "dash", label: "Dash" },
  { value: "none", label: "None" },
];

export default function TextToBinaryTool() {
  const [text, setText] = useState("");
  const [bits, setBits] = useState<BitGroup>(8);
  const [sep, setSep] = useState<Separator>("space");
  const [copied, setCopied] = useState(false);

  const binary = text ? textToBinary(text, bits, sep) : "";
  const bitCount = text.split("").reduce((a, ch) => a + ch.charCodeAt(0).toString(2).padStart(bits, "0").length, 0);

  const handleBinaryChange = (val: string) => {
    setText(binaryToText(val));
  };

  const handleCopy = () => {
    if (!binary) return;
    navigator.clipboard.writeText(binary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="space-y-6">
      <Panel>
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              Text Input
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type text to convert to binary…"
              className="min-h-[100px]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Bit width */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--text-primary)]">Bit Width</label>
              <div className="flex rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-default)] w-fit">
                {BIT_OPTIONS.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBits(b)}
                    className={`px-4 py-2 text-sm font-mono border-r border-[var(--border-default)] last:border-r-0 transition-colors ${
                      bits === b
                        ? "bg-[var(--color-primary-500)] text-white"
                        : "bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {b}-bit
                  </button>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--text-primary)]">Separator</label>
              <div className="flex rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-default)] w-fit">
                {SEP_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setSep(value)}
                    className={`px-4 py-2 text-sm border-r border-[var(--border-default)] last:border-r-0 transition-colors ${
                      sep === value
                        ? "bg-[var(--color-primary-500)] text-white"
                        : "bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-[var(--text-primary)]">
                Binary Output
                {text && (
                  <span className="ml-2 text-xs text-[var(--text-tertiary)] font-normal">
                    {bitCount} bits · {text.length} char{text.length !== 1 ? "s" : ""}
                  </span>
                )}
              </label>
              <Button
                variant="secondary"
                className="px-4 py-1.5 text-sm"
                onClick={handleCopy}
                disabled={!binary}
              >
                {copied ? "✓ Copied" : "Copy"}
              </Button>
            </div>
            <Textarea
              value={binary}
              onChange={(e) => handleBinaryChange(e.target.value)}
              placeholder="Binary output appears here… or paste binary to decode"
              className="min-h-[100px] font-mono text-sm tracking-wider break-all"
            />
          </div>
        </div>
      </Panel>

      {/* Visual bit display */}
      {text.length > 0 && text.length <= 24 && (
        <Panel>
          <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-4">
            Bit Visualiser
          </h3>
          <div className="flex flex-wrap gap-3">
            {text.split("").map((ch, i) => {
              const binStr = ch.charCodeAt(0).toString(2).padStart(8, "0");
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-xs font-mono text-[var(--color-primary-500)] font-bold">{ch === " " ? "·" : ch}</span>
                  <div className="flex gap-0.5">
                    {binStr.split("").map((bit, j) => (
                      <div
                        key={j}
                        className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-mono font-bold transition-colors ${
                          bit === "1"
                            ? "bg-[var(--color-primary-500)] text-white"
                            : "bg-[var(--surface-bg)] text-[var(--text-tertiary)] border border-[var(--border-default)]"
                        }`}
                      >
                        {bit}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-[var(--text-tertiary)] font-mono">{ch.charCodeAt(0)}</span>
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      <Panel>
        <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-4">Tips</h3>
        <ul className="text-sm text-[var(--text-secondary)] space-y-2 list-disc list-inside">
          <li>8-bit is standard ASCII; 16-bit and 32-bit pad with leading zeros.</li>
          <li>Paste binary into the output field to decode back to text.</li>
          <li>The bit visualiser shows individual bits for short inputs (up to 24 chars).</li>
        </ul>
      </Panel>
    </div>
  );
}