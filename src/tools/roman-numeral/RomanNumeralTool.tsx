import { useState, useMemo } from "react";
import { Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

const VALUES = [
  { value: 1000, numeral: "M" },
  { value: 900, numeral: "CM" },
  { value: 500, numeral: "D" },
  { value: 400, numeral: "CD" },
  { value: 100, numeral: "C" },
  { value: 90, numeral: "XC" },
  { value: 50, numeral: "L" },
  { value: 40, numeral: "XL" },
  { value: 10, numeral: "X" },
  { value: 9, numeral: "IX" },
  { value: 5, numeral: "V" },
  { value: 4, numeral: "IV" },
  { value: 1, numeral: "I" },
];

function toRoman(n: number): string {
  if (n < 1 || n > 3999) return "Out of range (1–3999)";
  let result = "";
  for (const { value, numeral } of VALUES) {
    while (n >= value) { result += numeral; n -= value; }
  }
  return result;
}

function fromRoman(s: string): number | null {
  const upper = s.toUpperCase().trim();
  if (!/^[IVXLCDM]+$/.test(upper)) return null;
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let result = 0;
  for (let i = 0; i < upper.length; i++) {
    const cur = map[upper[i]];
    const next = map[upper[i + 1]] ?? 0;
    if (cur < next) result -= cur;
    else result += cur;
  }
  return result;
}

export default function RomanNumeralTool() {
  const [numInput, setNumInput] = useState("");
  const [romInput, setRomInput] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const romanResult = useMemo(() => {
    const n = parseInt(numInput);
    if (!numInput || isNaN(n)) return null;
    return toRoman(n);
  }, [numInput]);

  const numResult = useMemo(() => {
    if (!romInput) return null;
    return fromRoman(romInput);
  }, [romInput]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Panel>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text(--text-primary)">Integer → Roman</h3>
            <Input value={numInput} onChange={e => setNumInput(e.target.value)} type="number" label="Integer (1–3999)" placeholder="e.g. 2024" />
            {romanResult && (
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold font-serif text-[var(--color-primary-500)] flex-1">{romanResult}</p>
                <button onClick={async () => { await copyToClipboard(romanResult); setCopied("rom"); setTimeout(() => setCopied(null), 1500); }} className="text-xs text-[var(--text-tertiary)] hover:text(--text-primary) cursor-pointer">{copied === "rom" ? "✓" : "Copy"}</button>
              </div>
            )}
          </div>
        </Panel>

        <Panel>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text(--text-primary)">Roman → Integer</h3>
            <Input value={romInput} onChange={e => setRomInput(e.target.value)} label="Roman Numeral" placeholder="e.g. MMXXIV" className="font-[family-name:var(--font-mono)] uppercase" />
            {numResult !== null ? (
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold font-[family-name:var(--font-mono)] text-[var(--color-primary-500)] flex-1">{numResult}</p>
                <button onClick={async () => { await copyToClipboard(String(numResult)); setCopied("num"); setTimeout(() => setCopied(null), 1500); }} className="text-xs text-[var(--text-tertiary)] hover:text(--text-primary) cursor-pointer">{copied === "num" ? "✓" : "Copy"}</button>
              </div>
            ) : romInput ? (
              <p className="text-xs text-[var(--color-error)]">Invalid Roman numeral</p>
            ) : null}
          </div>
        </Panel>
      </div>

      <Panel>
        <h3 className="text-sm font-semibold text(--text-primary) mb-3">Reference Table</h3>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {VALUES.map(v => (
            <div key={v.numeral} className="flex items-center gap-1.5 px-2 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-secondary)]">
              <span className="font-serif font-bold text-[var(--color-primary-500)] text-sm">{v.numeral}</span>
              <span className="text-xs text-[var(--text-tertiary)]">= {v.value}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
