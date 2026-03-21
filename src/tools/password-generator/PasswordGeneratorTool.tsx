import { useState } from "react";
import { Button, CopyButton, Input, Label, Toggle } from "@/components/ui";
import { Panel } from "@/components/layout";
import { ResultRow } from "@/components/advanced/ResultRow";
import { Trash2 } from "lucide-react";

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

type StrengthLevel = "weak" | "moderate" | "strong" | "excellent";

function getStrength(entropy: number): { level: StrengthLevel; colorClass: string; label: string } {
  if (entropy >= 128) return { level: "excellent", colorClass: "text-green-500", label: "Excellent" };
  if (entropy >= 80) return { level: "strong", colorClass: "text-green-300", label: "Strong" };
  if (entropy >= 60) return { level: "moderate", colorClass: "text-yellow-500", label: "Moderate" };
  return { level: "weak", colorClass: "text-red-500", label: "Weak" };
}

export default function PasswordGeneratorTool() {
  const [length, setLength] = useState(20);
  const [charSets, setCharSets] = useState({
    uppercase: true,
    lowercase: true,
    digits: true,
    symbols: true,
  });
  const [amount, setAmount] = useState(10);
  const [passwords, setPasswords] = useState<string[]>([]);

  const entropy = calculateEntropy(length, charSets);
  const strength = getStrength(entropy);

  const generate = () => {
    const newPasswords = Array.from({ length: amount }, () =>
      generatePassword(length, charSets)
    );
    setPasswords(newPasswords);
  };

  const handleToggle = (key: string, value: boolean) => {
    const newSets = { ...charSets, [key]: value };
    if (Object.values(newSets).every((v) => !v)) return;
    setCharSets(newSets);
  };

  return (
    <div className="flex flex-col md:flex-row gap-2">
      {/* Controls */}
      <Panel className="flex-1 space-y-4">
        <Input
          type="number"
          label="Length"
          value={length}
          onChange={(e) => setLength(Math.min(512, Math.max(1, Number(e.target.value))))}
          min={1}
          max={512}
        />
        <div className="grid grid-cols-4 md:grid-cols-2 gap-2">
          <Toggle label="A-Z" checked={charSets.uppercase} onChange={(v) => handleToggle("uppercase", v)} />
          <Toggle label="a-z" checked={charSets.lowercase} onChange={(v) => handleToggle("lowercase", v)} />
          <Toggle label="0-9" checked={charSets.digits} onChange={(v) => handleToggle("digits", v)} />
          <Toggle label="!@#$" checked={charSets.symbols} onChange={(v) => handleToggle("symbols", v)} />
        </div>

        {/* Entropy indicator */}
        <div className="flex items-center justify-between">
          <Label className={`text-sm font-medium ${strength.colorClass}`}>
            Entropy: {entropy} bits
          </Label>
          <Label className={`text-xs font-semibold uppercase tracking-wide ${strength.colorClass}`}>
            {strength.label}
          </Label>
        </div>

        <Input
          type="number"
          label="Amount"
          value={amount}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value < 1 || value > 100) return;
            setAmount(value);
          }}
          min={1}
          max={100}
          helperText="Maximum: 100"
        />
        <Button onClick={generate} className="w-full">
          Generate Passwords
        </Button>
      </Panel>

      {/* Result */}
      {passwords.length === 0 ? (
        <Panel className="flex-2 flex flex-col items-center justify-center gap-6">
          <span className="font-emoji text-6xl">#️⃣</span>
          <h3 className="text-(--text-tertiary)">Generated passwords will appear here</h3>
        </Panel>
      ) : (
        <Panel className="flex-2 space-y-2">
          <div className="flex items-center justify-between">
            <Label>Generated Passwords</Label>
            <div className="flex gap-2">
              <CopyButton label="Copy All" text={passwords.join("\n")} />
              <Button size="s" variant="secondary" onClick={() => setPasswords([])} icon={Trash2} />
            </div>
          </div>
          {passwords.map((password, index) => (
            <ResultRow key={index} label={`${index + 1}.`} value={password} />
          ))}
        </Panel>
      )}
    </div>
  );
}