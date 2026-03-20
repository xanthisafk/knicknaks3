import { useState, useMemo } from "react";
import { Input, Button } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

const ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const SCALES = ["", "thousand", "million", "billion", "trillion"];

function numToWords(n: number): string {
  if (n < 0) return "negative " + numToWords(-n);
  if (n === 0) return "zero";
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? "-" + ONES[n % 10] : "");
  if (n < 1000) return ONES[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + numToWords(n % 100) : "");

  for (let i = SCALES.length - 1; i >= 1; i--) {
    const scale = Math.pow(1000, i);
    if (n >= scale) {
      const head = numToWords(Math.floor(n / scale));
      const tail = n % scale;
      return head + " " + SCALES[i] + (tail ? " " + numToWords(tail) : "");
    }
  }
  return n.toString();
}

function convert(input: string): { words: string; currency: string } | { error: string } {
  const n = parseFloat(input.replace(/,/g, ""));
  if (isNaN(n)) return { error: "Please enter a valid number" };
  if (Math.abs(n) > 999_999_999_999_999) return { error: "Number too large (max: 999 trillion)" };

  const whole = Math.floor(Math.abs(n));
  const decimals = Math.round((Math.abs(n) - whole) * 100);

  const words = (n < 0 ? "negative " : "") + numToWords(whole) + (decimals > 0 ? " point " + numToWords(decimals) : "");
  const dollar = numToWords(whole) + " dollar" + (whole !== 1 ? "s" : "");
  const cents = decimals > 0 ? " and " + numToWords(decimals) + " cent" + (decimals !== 1 ? "s" : "") : "";
  const currency = (n < 0 ? "negative " : "") + dollar + cents;

  return { words, currency };
}

export default function NumberToWordsTool() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const result = useMemo(() => input ? convert(input) : null, [input]);

  return (
    <div className="space-y-2">
      <Panel>
        <Input
          label="Number"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. 1542 or 3.14"
          className="font-mono text-lg"
        />
      </Panel>

      {result && "error" in result ? (
        <p className="text-sm text-(--color-error) px-1">{result.error}</p>
      ) : result ? (
        <div className="space-y-3">
          {[
            { label: "Words", value: result.words },
            { label: "Currency (USD)", value: result.currency },
          ].map(r => (
            <Panel key={r.label}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text(--text-primary)">{r.label}</span>
                  <button onClick={async () => { await copyToClipboard(r.value); setCopied(r.label); setTimeout(() => setCopied(null), 1500); }} className="text-xs text-(--text-tertiary) hover:text(--text-primary) cursor-pointer">{copied === r.label ? "✓ Copied" : "Copy"}</button>
                </div>
                <p className="text(--text-primary) capitalize leading-relaxed">{r.value}</p>
              </div>
            </Panel>
          ))}
        </div>
      ) : null}
    </div>
  );
}
