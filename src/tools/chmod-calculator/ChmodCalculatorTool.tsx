import { useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { Panel } from "@/components/layout";

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
    <div className="space-y-6">
      {/* Permission Matrix */}
      <Panel>
        <div className="space-y-4">
          <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">
            Permission Matrix
          </h3>

          {/* Header row */}
          <div className="grid grid-cols-4 gap-2">
            <div />
            {PERMS.map((perm) => (
              <div key={perm} className="text-center">
                <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  {perm}
                </span>
                <span className="block text-[10px] text-[var(--text-tertiary)] font-mono mt-0.5">
                  ({PERM_BITS[perm]})
                </span>
              </div>
            ))}
          </div>

          {/* Permission rows */}
          {SCOPES.map((scope) => (
            <div key={scope} className="grid grid-cols-4 gap-2 items-center">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[var(--text-primary)] capitalize">
                  {scope}
                </span>
                <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                  {octalDigit(perms[scope])}
                </span>
              </div>
              {PERMS.map((perm) => (
                <div key={perm} className="flex justify-center">
                  <button
                    onClick={() => toggle(scope, perm)}
                    className={`w-10 h-10 rounded-[var(--radius-md)] border-2 transition-all duration-200 cursor-pointer flex items-center justify-center text-sm font-bold ${
                      perms[scope][perm]
                        ? "bg-[var(--color-primary-500)] border-[var(--color-primary-500)] text-white shadow-sm"
                        : "bg-[var(--surface-secondary)] border-[var(--border-default)] text-[var(--text-tertiary)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-elevated)]"
                    }`}
                    aria-label={`${scope} ${perm}`}
                    aria-pressed={perms[scope][perm]}
                  >
                    {perms[scope][perm] ? perm[0].toUpperCase() : "—"}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Panel>

      {/* Result */}
      <Panel>
        <div className="space-y-4">
          <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">
            Result
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[var(--radius-lg)] bg-[var(--surface-secondary)] border border-[var(--border-default)] p-4 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-50)] to-transparent dark:from-[var(--color-primary-900)] opacity-20 transition-opacity group-hover:opacity-40" />
              <p className="text-xs text-[var(--text-tertiary)] font-medium mb-1 relative z-10">Octal</p>
              <p className="text-3xl font-bold text-[var(--text-primary)] font-mono tracking-tight relative z-10">
                {octal}
              </p>
            </div>
            <div className="rounded-[var(--radius-lg)] bg-[var(--surface-secondary)] border border-[var(--border-default)] p-4 flex flex-col items-center justify-center">
              <p className="text-xs text-[var(--text-tertiary)] font-medium mb-1">Symbolic</p>
              <p className="text-2xl font-bold text-[var(--text-primary)] font-mono tracking-tight">
                {symbolic}
              </p>
            </div>
          </div>

          {/* Command */}
          <div className="flex items-center gap-3">
            <pre className="flex-1 rounded-[var(--radius-md)] bg-[var(--surface-secondary)] border border-[var(--border-default)] px-4 py-3 text-sm font-mono text-[var(--text-primary)] select-all">
              {command}
            </pre>
            <Button
              onClick={() => handleCopy(command, "command")}
              size="sm"
              variant={copied === "command" ? "primary" : "secondary"}
            >
              {copied === "command" ? "✓ Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      </Panel>

      {/* Quick Presets */}
      <Panel>
        <div className="space-y-3">
          <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">
            Quick Presets
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset.octal)}
                className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-[var(--radius-md)] border text-left transition-all duration-200 cursor-pointer ${
                  octal === preset.octal
                    ? "bg-[var(--color-primary-500)] text-white border-[var(--color-primary-500)] shadow-sm"
                    : "bg-[var(--surface-secondary)] text-[var(--text-primary)] border-[var(--border-default)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-elevated)]"
                }`}
              >
                <div>
                  <span className="text-sm font-mono font-semibold">{preset.label}</span>
                  <span className={`block text-[10px] mt-0.5 ${octal === preset.octal ? "text-white/70" : "text-[var(--text-tertiary)]"}`}>
                    {preset.desc}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {/* Reference Table */}
      <Panel>
        <div className="space-y-3">
          <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">
            Reference
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-default)]">
                  <th className="text-left py-2 pr-4 text-[var(--text-secondary)] font-medium">Digit</th>
                  <th className="text-left py-2 pr-4 text-[var(--text-secondary)] font-medium">Symbolic</th>
                  <th className="text-left py-2 text-[var(--text-secondary)] font-medium">Meaning</th>
                </tr>
              </thead>
              <tbody className="text-[var(--text-primary)]">
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
                  <tr key={digit} className="border-b border-[var(--border-default)]/50">
                    <td className="py-2 pr-4 font-mono font-semibold">{digit}</td>
                    <td className="py-2 pr-4 font-mono text-[var(--text-secondary)]">{sym}</td>
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
