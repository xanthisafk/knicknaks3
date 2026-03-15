import { useState, useMemo } from "react";
import { Input, Label } from "@/components/ui";
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
    <div className="space-y-2">
      <Panel>
        <div className="space-y-2">
          <div className="flex flex-col md:flex-row gap-1.5">
            <Input
              label="Input Number"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              placeholder="Enter a number..."
              className="flex-1 h-full"
              error={!isValid ? "Invalid number for the selected base" : undefined}
            />
            <div className="flex flex-col gap-1.5">
              <Label>From Base</Label>
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


          <div className="flex flex-col items-start align-start sm:items-center sm:flex-row gap-1.5">
            <Label>Quick presets</Label>
            <RadioGroup value={`${fromBase}`} orientation="horizontal" onValueChange={() => null}>
              {[2, 8, 10, 16].map((b) => (
                <Radio
                  key={b}
                  value={`${b}`}
                  onClick={() => setFromBase(b)}
                  label={`Base ${b}`}
                  className="flex-1 grow w-full"
                />
              ))}
            </RadioGroup>
          </div>
        </div>
      </Panel>

      {Object.keys(results).length > 0 && (
        <Panel>
          <div className="flex flex-col gap-1.5">
            <Label>Results</Label>
            {Object.entries(results).map(([label, value]) => (
              <ResultRow key={label} label={label} value={value} />
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
