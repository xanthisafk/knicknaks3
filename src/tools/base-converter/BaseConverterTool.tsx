import { useState, useMemo } from "react";
import { Input, Button } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

const COMMON_BASES = [
  { base: 2, label: "Binary (2)" },
  { base: 8, label: "Octal (8)" },
  { base: 10, label: "Decimal (10)" },
  { base: 16, label: "Hexadecimal (16)" },
  { base: 32, label: "Base 32" },
  { base: 36, label: "Base 36" },
];

function convertBase(value: string, fromBase: number, toBase: number): string {
  try {
    const decimal = parseInt(value, fromBase);
    if (isNaN(decimal)) return "";
    return decimal.toString(toBase).toUpperCase();
  } catch {
    return "";
  }
}

function ResultRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-[var(--radius-md)] bg-[var(--surface-secondary)]">
      <span className="text-xs font-medium text-[var(--text-secondary)] min-w-[120px]">{label}</span>
      <span className="text-sm font-[family-name:var(--font-mono)] text-[var(--text-primary)] flex-1 ml-3 break-all">
        {value || "—"}
      </span>
      {value && (
        <button
          onClick={async () => {
            await copyToClipboard(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer ml-2"
        >
          {copied ? "✓" : "Copy"}
        </button>
      )}
    </div>
  );
}

export default function BaseConverterTool() {
  const [input, setInput] = useState("");
  const [fromBase, setFromBase] = useState(10);
  const [customBase, setCustomBase] = useState(2);

  const results = useMemo(() => {
    if (!input.trim()) return {};
    const out: Record<string, string> = {};
    for (const { base, label } of COMMON_BASES) {
      out[label] = convertBase(input, fromBase, base);
    }
    if (!COMMON_BASES.some((b) => b.base === customBase)) {
      out[`Base ${customBase}`] = convertBase(input, fromBase, customBase);
    }
    return out;
  }, [input, fromBase, customBase]);

  const isValid = !input.trim() || Object.values(results).some(Boolean);

  return (
    <div className="space-y-6">
      <Panel>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Input Number"
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                placeholder="Enter a number..."
                className="font-[family-name:var(--font-mono)]"
                error={!isValid ? "Invalid number for the selected base" : undefined}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-primary)]">From Base</label>
              <select
                value={fromBase}
                onChange={(e) => setFromBase(parseInt(e.target.value))}
                className="px-3 py-2 rounded-[var(--radius-md)] bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border-default)] text-sm cursor-pointer"
              >
                {COMMON_BASES.map(({ base, label }) => (
                  <option key={base} value={base}>{label}</option>
                ))}
                {!COMMON_BASES.some((b) => b.base === customBase) && (
                  <option value={customBase}>Custom ({customBase})</option>
                )}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--text-secondary)]">Quick:</span>
            {[2, 8, 10, 16].map((b) => (
              <button
                key={b}
                onClick={() => setFromBase(b)}
                className={`px-3 py-1 text-xs font-medium rounded-[var(--radius-md)] transition-colors cursor-pointer ${
                  fromBase === b
                    ? "bg-[var(--color-primary-500)] text-white"
                    : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
                }`}
              >
                Base {b}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {Object.keys(results).length > 0 && (
        <Panel>
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">Results</h3>
          <div className="space-y-2">
            {Object.entries(results).map(([label, value]) => (
              <ResultRow key={label} label={label} value={value} />
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
