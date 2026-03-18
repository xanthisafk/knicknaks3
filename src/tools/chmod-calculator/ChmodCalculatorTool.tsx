import { useState, useCallback } from "react";
import { Button, Label } from "@/components/ui";
import { Panel } from "@/components/layout";
import StatBox from "@/components/ui/StatBox";
import { ResultRow } from "@/components/advanced/ResultRow";
import { Radio, RadioGroup } from "@/components/ui/radio";

type Scope = "owner" | "group" | "others";
type Perm = "read" | "write" | "execute";

interface Permissions {
  owner: { read: boolean; write: boolean; execute: boolean };
  group: { read: boolean; write: boolean; execute: boolean };
  others: { read: boolean; write: boolean; execute: boolean };
}

const SCOPES: Scope[] = ["owner", "group", "others"];
const PERMS: Perm[] = ["read", "write", "execute"];
const PERM_BITS: Record<Perm, number> = { read: 4, write: 2, execute: 1 };

const PRESETS: { label: string; octal: string; desc: string }[] = [
  { label: "755", octal: "755", desc: "Standard directory / executable" },
  { label: "644", octal: "644", desc: "Standard file" },
  { label: "777", octal: "777", desc: "Full access (unsafe)" },
  { label: "600", octal: "600", desc: "Owner only (private)" },
  { label: "444", octal: "444", desc: "Read-only for all" },
  { label: "700", octal: "700", desc: "Owner full access" },
];

function octalDigit(scope: { read: boolean; write: boolean; execute: boolean }): number {
  return (scope.read ? 4 : 0) + (scope.write ? 2 : 0) + (scope.execute ? 1 : 0);
}

function permsToOctal(p: Permissions): string {
  return `${octalDigit(p.owner)}${octalDigit(p.group)}${octalDigit(p.others)}`;
}

function symbolicChar(val: boolean, ch: string): string {
  return val ? ch : "-";
}

function permsToSymbolic(p: Permissions): string {
  return (
    symbolicChar(p.owner.read, "r") + symbolicChar(p.owner.write, "w") + symbolicChar(p.owner.execute, "x") +
    symbolicChar(p.group.read, "r") + symbolicChar(p.group.write, "w") + symbolicChar(p.group.execute, "x") +
    symbolicChar(p.others.read, "r") + symbolicChar(p.others.write, "w") + symbolicChar(p.others.execute, "x")
  );
}

function octalToPerms(octal: string): Permissions {
  const digits = octal.split("").map(Number);
  const fromDigit = (d: number) => ({
    read: !!(d & 4),
    write: !!(d & 2),
    execute: !!(d & 1),
  });
  return {
    owner: fromDigit(digits[0] ?? 0),
    group: fromDigit(digits[1] ?? 0),
    others: fromDigit(digits[2] ?? 0),
  };
}

export default function ChmodCalculatorTool() {
  const [perms, setPerms] = useState<Permissions>(octalToPerms("755"));
  const [copied, setCopied] = useState<string>("");

  const toggle = useCallback((scope: Scope, perm: Perm) => {
    setPerms((prev) => ({
      ...prev,
      [scope]: { ...prev[scope], [perm]: !prev[scope][perm] },
    }));
  }, []);

  const octal = permsToOctal(perms);
  const symbolic = permsToSymbolic(perms);
  const command = `chmod ${octal} <file>`;

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const applyPreset = (preset: string) => {
    setPerms(octalToPerms(preset));
  };

  return (
    <div className="space-y-2">
      {/* Permission Matrix */}
      <Panel>
        <div className="space-y-4">
          <Label>Permission Matrix</Label>

          {/* Header row */}
          <div className="grid grid-cols-4 gap-2">
            <div />
            {PERMS.map((perm) => (
              <div key={perm} className="text-center">
                <Label>{perm} ({PERM_BITS[perm]})</Label>
              </div>
            ))}
          </div>

          {/* Permission rows */}
          {SCOPES.map((scope) => (
            <div key={scope} className="grid grid-cols-4 gap-2 items-center">
              <div className="flex flex-col">
                <Label>{scope} ({octalDigit(perms[scope])})</Label>
              </div>
              {PERMS.map((perm) => (
                <div key={perm} className="flex justify-center">
                  <Button
                    onClick={() => toggle(scope, perm)}
                    variant={perms[scope][perm] ? "primary" : "secondary"}
                    size="lg"
                    className="w-12 h-12"
                    aria-label={`${scope} ${perm}`}
                    aria-pressed={perms[scope][perm]}
                  >
                    {perms[scope][perm] ? perm[0].toUpperCase() : "—"}
                  </Button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Panel>

      {/* Quick Presets */}
      <Panel>
        <div className="space-y-2">
          <Label>Quick Presets</Label>
          <RadioGroup orientation="horizontal" value={octal} onValueChange={v => applyPreset(v)}>
            {PRESETS.map((preset) => (
              <Radio key={preset.label} label={`${preset.desc} (${preset.label})`} value={preset.octal} />
            ))}
          </RadioGroup>

        </div>
      </Panel>

      {/* Result */}
      <Panel>
        <div className="space-y-2">
          <Label>Result</Label>

          <div className="grid grid-cols-2 gap-2">
            <StatBox textSize="3xl" label="Octal" value={octal} />
            <StatBox textSize="3xl" label="Symbolic" value={symbolic} />
          </div>

          {/* Command */}
          <ResultRow label="Command" value={command} />
        </div>
      </Panel>

      {/* Reference Table */}
      <Panel>
        <div className="space-y-3">
          <Label>Reference</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-(--border-default)">
                  <th className="text-start"><Label>Digit</Label></th>
                  <th className="text-start"><Label>Symbolic</Label></th>
                  <th className="text-start"><Label>Meaning</Label></th>
                </tr>
              </thead>
              <tbody className="text-(--text-primary)">
                {[
                  ["7", "rwx", "Read + Write + Execute"],
                  ["6", "rw-", "Read + Write"],
                  ["5", "r-x", "Read + Execute"],
                  ["4", "r--", "Read only"],
                  ["3", "-wx", "Write + Execute"],
                  ["2", "-w-", "Write only"],
                  ["1", "--x", "Execute only"],
                  ["0", "---", "No permissions"],
                ].map(([digit, sym, meaning]) => (
                  <tr key={digit} className="border-b border-(--border-default)/50 text-start">
                    <td className="py-2 pr-4 font-mono font-semibold">{digit}</td>
                    <td className="py-2 pr-4 font-mono text-(--text-secondary)">{sym}</td>
                    <td className="py-2">{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>
    </div>
  );
}
