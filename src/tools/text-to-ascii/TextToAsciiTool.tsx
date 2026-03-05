import { useState } from "react";
import { Textarea, Button, Input } from "@/components/ui";
import { Panel } from "@/components/layout";

type DisplayFormat = "decimal" | "hex" | "octal" | "binary";

function textToAscii(text: string, format: DisplayFormat): string {
  return text
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      switch (format) {
        case "decimal": return code.toString(10);
        case "hex": return "0x" + code.toString(16).toUpperCase().padStart(2, "0");
        case "octal": return "0o" + code.toString(8);
        case "binary": return code.toString(2).padStart(8, "0");
      }
    })
    .join("  ");
}

function asciiToText(raw: string): string {
  const tokens = raw.trim().split(/\s+/);
  return tokens
    .map((t) => {
      let code: number;
      if (/^0x/i.test(t)) code = parseInt(t, 16);
      else if (/^0o/i.test(t)) code = parseInt(t.slice(2), 8);
      else if (/^[01]{8}$/.test(t)) code = parseInt(t, 2);
      else code = parseInt(t, 10);
      return isNaN(code) ? "" : String.fromCharCode(code);
    })
    .join("");
}

const FORMAT_LABELS: { value: DisplayFormat; label: string }[] = [
  { value: "decimal", label: "Dec" },
  { value: "hex", label: "Hex" },
  { value: "octal", label: "Oct" },
  { value: "binary", label: "Bin" },
];

export default function TextToAsciiTool() {
  const [text, setText] = useState("");
  const [format, setFormat] = useState<DisplayFormat>("decimal");
  const [copied, setCopied] = useState(false);

  const output = text ? textToAscii(text, format) : "";

  const handleOutputChange = (val: string) => {
    setText(asciiToText(val));
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const charCount = text.length;
  const rows = text
    ? text.split("").map((ch) => ({
        char: ch === " " ? "·" : ch === "\n" ? "↵" : ch,
        decimal: ch.charCodeAt(0),
        hex: "0x" + ch.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0"),
        octal: "0o" + ch.charCodeAt(0).toString(8),
        binary: ch.charCodeAt(0).toString(2).padStart(8, "0"),
      }))
    : [];

  return (
    <div className="space-y-6">
      <Panel>
        <div className="space-y-5">
          {/* Input */}
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              Text Input
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type something to convert to ASCII codes…"
              className="min-h-[100px]"
            />
          </div>

          {/* Format selector */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[var(--text-primary)]">Number Format</label>
            <div className="flex rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-default)] w-fit">
              {FORMAT_LABELS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFormat(value)}
                  className={`px-4 py-2 text-sm font-mono border-r border-[var(--border-default)] last:border-r-0 transition-colors ${
                    format === value
                      ? "bg-[var(--color-primary-500)] text-white"
                      : "bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Output */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-[var(--text-primary)]">
                ASCII Output
                {charCount > 0 && (
                  <span className="ml-2 text-xs text-[var(--text-tertiary)] font-normal">
                    {charCount} character{charCount !== 1 ? "s" : ""}
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
              placeholder="ASCII codes appear here…"
              className="min-h-[80px] font-mono text-sm tracking-wide"
            />
          </div>
        </div>
      </Panel>

      {/* Character table */}
      {rows.length > 0 && rows.length <= 80 && (
        <Panel>
          <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-4">
            Character Table
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="text-[var(--text-tertiary)] text-xs border-b border-[var(--border-default)]">
                  <th className="text-left py-2 pr-6">Char</th>
                  <th className="text-left py-2 pr-6">Dec</th>
                  <th className="text-left py-2 pr-6">Hex</th>
                  <th className="text-left py-2 pr-6">Oct</th>
                  <th className="text-left py-2">Bin</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] transition-colors"
                  >
                    <td className="py-1.5 pr-6 text-[var(--color-primary-500)] font-bold">{row.char}</td>
                    <td className="py-1.5 pr-6 text-[var(--text-primary)]">{row.decimal}</td>
                    <td className="py-1.5 pr-6 text-[var(--text-secondary)]">{row.hex}</td>
                    <td className="py-1.5 pr-6 text-[var(--text-secondary)]">{row.octal}</td>
                    <td className="py-1.5 text-[var(--text-tertiary)]">{row.binary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <Panel>
        <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-4">Tips</h3>
        <ul className="text-sm text-[var(--text-secondary)] space-y-2 list-disc list-inside">
          <li>Switch between Decimal, Hex, Octal, and Binary formats.</li>
          <li>You can also paste ASCII codes into the output field to decode back to text.</li>
          <li>The character table shows all four formats side-by-side (up to 80 chars).</li>
        </ul>
      </Panel>
    </div>
  );
}