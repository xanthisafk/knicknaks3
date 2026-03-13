import { useState } from "react";
import { Textarea, Button } from "@/components/ui";
import { Panel } from "@/components/layout";

type Case = "upper" | "lower";
type Prefix = "none" | "0x" | "\\x" | "%";
type Separator = "space" | "comma" | "colon" | "none";

function textToHex(text: string, caseMode: Case, prefix: Prefix, sep: Separator): string {
  const sepChar = sep === "space" ? " " : sep === "comma" ? ", " : sep === "colon" ? ":" : "";
  return text
    .split("")
    .map((ch) => {
      const hex = ch.charCodeAt(0).toString(16).padStart(2, "0");
      const formatted = caseMode === "upper" ? hex.toUpperCase() : hex;
      return prefix === "none" ? formatted : prefix + formatted;
    })
    .join(sepChar);
}

function hexToText(raw: string): string {
  // Strip known prefixes and separators, extract hex pairs
  const cleaned = raw
    .replace(/0x/gi, " ")
    .replace(/\\x/gi, " ")
    .replace(/%/g, " ")
    .replace(/[,:\s]+/g, " ")
    .trim();

  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((h) => {
      const code = parseInt(h, 16);
      return isNaN(code) ? "" : String.fromCharCode(code);
    })
    .join("");
}

const CASE_OPTIONS: { value: Case; label: string }[] = [
  { value: "upper", label: "UPPER" },
  { value: "lower", label: "lower" },
];

const PREFIX_OPTIONS: { value: Prefix; label: string }[] = [
  { value: "none", label: "None" },
  { value: "0x", label: "0x" },
  { value: "\\x", label: "\\x" },
  { value: "%", label: "% (URL)" },
];

const SEP_OPTIONS: { value: Separator; label: string }[] = [
  { value: "space", label: "Space" },
  { value: "comma", label: "Comma" },
  { value: "colon", label: "Colon" },
  { value: "none", label: "None" },
];

function ToggleGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-[var(--text-primary)]">{label}</label>
      <div className="flex rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-default)] w-fit">
        {options.map(({ value: v, label: l }) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`px-3 py-2 text-sm font-mono border-r border-[var(--border-default)] last:border-r-0 transition-colors whitespace-nowrap ${value === v
              ? "bg-[var(--color-primary-500)] text-white"
              : "bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TextToHexTool() {
  const [text, setText] = useState("");
  const [caseMode, setCaseMode] = useState<Case>("upper");
  const [prefix, setPrefix] = useState<Prefix>("none");
  const [sep, setSep] = useState<Separator>("space");
  const [copied, setCopied] = useState(false);

  const output = text ? textToHex(text, caseMode, prefix, sep) : "";

  const handleOutputChange = (val: string) => {
    setText(hexToText(val));
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const byteCount = text.length;

  return (
    <div className="space-y-2">
      <Panel>
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              Text Input
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to convert to hexadecimal..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <ToggleGroup label="Case" options={CASE_OPTIONS} value={caseMode} onChange={setCaseMode} />
            <ToggleGroup label="Prefix" options={PREFIX_OPTIONS} value={prefix} onChange={setPrefix} />
            <ToggleGroup label="Separator" options={SEP_OPTIONS} value={sep} onChange={setSep} />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-[var(--text-primary)]">
                Hex Output
                {byteCount > 0 && (
                  <span className="ml-2 text-xs text-[var(--text-tertiary)] font-normal">
                    {byteCount} byte{byteCount !== 1 ? "s" : ""}
                  </span>
                )}
              </label>
              <Button
                variant="secondary"
                className="px-4 py-1.5 text-sm"
                onClick={handleCopy}
                disabled={!output}
              >
                {copied ? "✓ Copied" : "Copy"}
              </Button>
            </div>
            <Textarea
              value={output}
              onChange={(e) => handleOutputChange(e.target.value)}
              placeholder="Hex output appears here... or paste hex to decode"
              className="min-h-[100px] font-mono text-sm tracking-widest break-all"
            />
          </div>
        </div>
      </Panel>

      {/* Colour swatches for short text */}
      {text.length > 0 && text.length <= 64 && (
        <Panel>
          <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-4">
            Byte Map
          </h3>
          <div className="flex flex-wrap gap-2">
            {text.split("").map((ch, i) => {
              const code = ch.charCodeAt(0);
              const hex = code.toString(16).padStart(2, "0").toUpperCase();
              const brightness = code;
              const bg = `hsl(${(code * 4.7) % 360}, 55%, ${Math.max(30, Math.min(70, brightness / 2 + 35))}%)`;
              return (
                <div
                  key={i}
                  title={`'${ch}' = ${code}`}
                  className="flex flex-col items-center gap-0.5 rounded-[var(--radius-sm)] p-1.5 min-w-[2.5rem]"
                  style={{ backgroundColor: bg }}
                >
                  <span className="text-[10px] font-mono font-bold text-white drop-shadow">{hex}</span>
                  <span className="text-[10px] text-white/80 font-mono">{ch === " " ? "·" : ch}</span>
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      <Panel>
        <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-4">Tips</h3>
        <ul className="text-sm text-[var(--text-secondary)] space-y-2 list-disc list-inside">
          <li>Use <code>0x</code> prefix for C/JS style, <code>\x</code> for escape sequences, <code>%</code> for URL encoding.</li>
          <li>Paste any hex string into the output to decode it back.</li>
          <li>The byte map colours each byte by its value — great for spotting patterns.</li>
        </ul>
      </Panel>
    </div>
  );
}