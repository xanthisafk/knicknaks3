import { useState, useMemo } from "react";
import { Input } from "@/components/ui";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, Radio } from "@/components/ui/radio";
import { Panel } from "@/components/layout";
import { ResultRow } from "@/components/advanced/ResultRow";

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
                className="font-mono"
                error={!isValid ? "Invalid number for the selected base" : undefined}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text(--text-primary)">From Base</label>
              <Select value={String(fromBase)} onValueChange={(v) => setFromBase(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMMON_BASES.map(({ base, label }) => (
                    <SelectItem key={base} value={String(base)}>{label}</SelectItem>
                  ))}
                  {!COMMON_BASES.some((b) => b.base === customBase) && (
                    <SelectItem value={String(customBase)}>Custom ({customBase})</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <label className="text-xs font-semibold tracking-widest text-(--text-tertiary) uppercase">Quick presets</label>
          <div className="flex items-center gap-3">
            <RadioGroup value={`${fromBase}`} orientation="horizontal" onValueChange={() => null}>
              {[2, 8, 10, 16].map((b) => (
                <Radio
                  key={b}
                  value={`${b}`}
                  onClick={() => setFromBase(b)}
                  label={`Base ${b}`}
                />
              ))}
            </RadioGroup>
          </div>
        </div>
      </Panel>

      {Object.keys(results).length > 0 && (
        <Panel>
          <h3 className="text-sm font-medium text(--text-primary) mb-3">Results</h3>
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
