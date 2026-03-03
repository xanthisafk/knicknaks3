import { useState, useCallback } from "react";
import { Button, Toggle } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:',.<>?/`~",
};

function generatePassword(length: number, charSets: Record<string, boolean>): string {
  let pool = "";
  if (charSets.uppercase) pool += CHAR_SETS.uppercase;
  if (charSets.lowercase) pool += CHAR_SETS.lowercase;
  if (charSets.digits) pool += CHAR_SETS.digits;
  if (charSets.symbols) pool += CHAR_SETS.symbols;
  if (!pool) return "";

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (n) => pool[n % pool.length]).join("");
}

function calculateEntropy(length: number, charSets: Record<string, boolean>): number {
  let poolSize = 0;
  if (charSets.uppercase) poolSize += 26;
  if (charSets.lowercase) poolSize += 26;
  if (charSets.digits) poolSize += 10;
  if (charSets.symbols) poolSize += CHAR_SETS.symbols.length;
  if (poolSize === 0) return 0;
  return Math.round(length * Math.log2(poolSize));
}

function getStrength(entropy: number): { label: string; color: string; percent: number } {
  if (entropy >= 128) return { label: "Overkill 🛡️", color: "var(--color-primary-500)", percent: 100 };
  if (entropy >= 80) return { label: "Very Strong 💪", color: "var(--color-success)", percent: 85 };
  if (entropy >= 60) return { label: "Strong ✅", color: "oklch(0.7 0.15 145)", percent: 70 };
  if (entropy >= 40) return { label: "Moderate ⚠️", color: "var(--color-warning)", percent: 50 };
  if (entropy >= 20) return { label: "Weak 🟠", color: "oklch(0.65 0.2 50)", percent: 30 };
  return { label: "Very Weak ❌", color: "var(--color-error)", percent: 15 };
}

export default function PasswordGeneratorTool() {
  const [length, setLength] = useState(20);
  const [charSets, setCharSets] = useState({
    uppercase: true,
    lowercase: true,
    digits: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const entropy = calculateEntropy(length, charSets);
  const strength = getStrength(entropy);

  const generate = useCallback(() => {
    setPassword(generatePassword(length, charSets));
    setCopied(false);
  }, [length, charSets]);

  const handleCopy = async () => {
    if (await copyToClipboard(password)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggle = (key: string, value: boolean) => {
    // Prevent disabling all character sets
    const newSets = { ...charSets, [key]: value };
    if (Object.values(newSets).every((v) => !v)) return;
    setCharSets(newSets);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Panel>
        <div className="space-y-5">
          {/* Length slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text(--text-primary)">Length</label>
              <span className="text-sm font-[family-name:var(--font-mono)] text-[var(--color-primary-500)] font-bold">
                {length}
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={128}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full accent-[var(--color-primary-500)]"
            />
            <div className="flex justify-between text-xs text-[var(--text-tertiary)]">
              <span>4</span>
              <span>128</span>
            </div>
          </div>

          {/* Character set toggles */}
          <div className="flex flex-wrap gap-4">
            <Toggle label="A-Z" checked={charSets.uppercase} onChange={(v) => handleToggle("uppercase", v)} />
            <Toggle label="a-z" checked={charSets.lowercase} onChange={(v) => handleToggle("lowercase", v)} />
            <Toggle label="0-9" checked={charSets.digits} onChange={(v) => handleToggle("digits", v)} />
            <Toggle label="!@#$" checked={charSets.symbols} onChange={(v) => handleToggle("symbols", v)} />
          </div>

          {/* Entropy bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text(--text-secondary)">Entropy: {entropy} bits</span>
              <span style={{ color: strength.color }} className="font-medium">{strength.label}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[var(--surface-secondary)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${strength.percent}%`, backgroundColor: strength.color }}
              />
            </div>
          </div>

          <Button onClick={generate} className="w-full">
            ⚡ Generate Password
          </Button>
        </div>
      </Panel>

      {/* Result */}
      {password && (
        <Panel>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text(--text-primary)">Your Password</label>
              <Button size="sm" variant="ghost" onClick={handleCopy}>
                {copied ? "✓ Copied!" : "📋 Copy"}
              </Button>
            </div>
            <div
              className="px-4 py-3 rounded-[var(--radius-md)] bg-[var(--surface-secondary)] font-[family-name:var(--font-mono)] text-base break-all text(--text-primary) select-all cursor-pointer border border-[var(--border-default)]"
              onClick={handleCopy}
              role="button"
              tabIndex={0}
              title="Click to copy"
            >
              {password}
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}
