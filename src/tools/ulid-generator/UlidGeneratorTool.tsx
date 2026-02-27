import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

// Crockford's Base32 alphabet
const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function generateULID(): string {
  const now = Date.now();
  let timeStr = "";
  let t = now;
  for (let i = 9; i >= 0; i--) {
    timeStr = ENCODING[t % 32] + timeStr;
    t = Math.floor(t / 32);
  }
  let randStr = "";
  for (let i = 0; i < 16; i++) {
    randStr += ENCODING[Math.floor(Math.random() * 32)];
  }
  return timeStr + randStr;
}

function decodeULID(ulid: string): { timestamp: Date; random: string } | null {
  if (!/^[0-9A-HJKMNP-TV-Z]{26}$/.test(ulid.toUpperCase())) return null;
  const u = ulid.toUpperCase();
  let ms = 0;
  for (let i = 0; i < 10; i++) {
    ms = ms * 32 + ENCODING.indexOf(u[i]);
  }
  return { timestamp: new Date(ms), random: u.slice(10) };
}

export default function UlidGeneratorTool() {
  const [ulids, setUlids] = useState<string[]>(() => [generateULID()]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);
  const [inspect, setInspect] = useState("");

  const generate = () => {
    const newOnes = Array.from({ length: Math.min(count, 100) }, generateULID);
    setUlids(newOnes);
  };

  const decoded = inspect ? decodeULID(inspect) : null;

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex gap-3 items-end">
          <div className="w-32">
            <Input label="Count" type="number" value={count} onChange={e => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))} />
          </div>
          <Button onClick={generate}>Generate</Button>
        </div>
      </Panel>

      <Panel>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">ULIDs</h3>
            <button onClick={async () => { await copyToClipboard(ulids.join("\n")); setCopied("all"); setTimeout(() => setCopied(null), 1500); }} className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer">{copied === "all" ? "✓ Copied all" : "Copy All"}</button>
          </div>
          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {ulids.map((u, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--surface-secondary)] hover:bg-[var(--surface-elevated)] transition-colors group">
                <span className="font-[family-name:var(--font-mono)] text-sm text-[var(--text-primary)] flex-1 select-all">{u}</span>
                <button onClick={async () => { await copyToClipboard(u); setCopied(u); setTimeout(() => setCopied(null), 1500); }} className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer opacity-0 group-hover:opacity-100">{copied === u ? "✓" : "Copy"}</button>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Inspect a ULID</h3>
          <Input value={inspect} onChange={e => setInspect(e.target.value)} placeholder="Paste a ULID to decode..." className="font-[family-name:var(--font-mono)]" />
          {decoded ? (
            <div className="space-y-2">
              <div className="flex gap-3 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--surface-secondary)]">
                <span className="text-xs text-[var(--text-tertiary)] w-24">Timestamp</span>
                <span className="text-sm font-[family-name:var(--font-mono)] text-[var(--text-primary)]">{decoded.timestamp.toISOString()}</span>
              </div>
              <div className="flex gap-3 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--surface-secondary)]">
                <span className="text-xs text-[var(--text-tertiary)] w-24">Random</span>
                <span className="text-sm font-[family-name:var(--font-mono)] text-[var(--text-primary)]">{decoded.random}</span>
              </div>
            </div>
          ) : inspect ? (
            <p className="text-xs text-[var(--color-error)]">Invalid ULID format</p>
          ) : null}
        </div>
      </Panel>
    </div>
  );
}
