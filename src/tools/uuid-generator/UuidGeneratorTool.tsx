import { useState } from "react";
import { Button } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

type UUIDVersion = "v4" | "v7";

function generateUUIDv4(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 1
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function generateUUIDv7(): string {
  const now = Date.now();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  // Timestamp (48 bits)
  bytes[0] = (now / 2 ** 40) & 0xff;
  bytes[1] = (now / 2 ** 32) & 0xff;
  bytes[2] = (now / 2 ** 24) & 0xff;
  bytes[3] = (now / 2 ** 16) & 0xff;
  bytes[4] = (now / 2 ** 8) & 0xff;
  bytes[5] = now & 0xff;
  bytes[6] = (bytes[6] & 0x0f) | 0x70; // version 7
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 1
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function generateUUID(version: UUIDVersion): string {
  return version === "v4" ? generateUUIDv4() : generateUUIDv7();
}

export default function UuidGeneratorTool() {
  const [version, setVersion] = useState<UUIDVersion>("v4");
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = () => {
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      results.push(generateUUID(version));
    }
    setUuids(results);
  };

  const handleCopyAll = async () => {
    if (await copyToClipboard(uuids.join("\n"))) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const handleCopyOne = async (uuid: string, index: number) => {
    if (await copyToClipboard(uuid)) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <div className="space-y-2">
      <Panel>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text(--text-primary)">Version</label>
            <div className="flex gap-1 p-1 rounded-[var(--radius-md)] bg-[var(--surface-secondary)]">
              {(["v4", "v7"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setVersion(v)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-[var(--radius-sm)] transition-colors cursor-pointer ${version === v
                      ? "bg-[var(--surface-elevated)] text(--text-primary) shadow-sm"
                      : "text-[var(--text-tertiary)] hover:text(--text-primary)"
                    }`}
                >
                  {v.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text(--text-primary)">Count</label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              className="w-24 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--surface-elevated)] text(--text-primary) border border-[var(--border-default)] text-sm"
            />
          </div>

          <Button onClick={generate}>⚡ Generate</Button>
        </div>
      </Panel>

      {uuids.length > 0 && (
        <Panel>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text(--text-primary)">
                Generated UUIDs ({uuids.length})
              </h3>
              <Button size="sm" variant="ghost" onClick={handleCopyAll}>
                {copiedAll ? "✓ Copied all!" : "📋 Copy All"}
              </Button>
            </div>
            <div className="space-y-1.5 max-h-96 overflow-y-auto">
              {uuids.map((uuid, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 rounded-[var(--radius-md)] bg-[var(--surface-secondary)] hover:bg(--surface-bg) transition-colors group"
                >
                  <code className="text-sm font-[family-name:var(--font-mono)] text(--text-primary) select-all">
                    {uuid}
                  </code>
                  <button
                    onClick={() => handleCopyOne(uuid, i)}
                    className="text-xs text-[var(--text-tertiary)] hover:text(--text-primary) transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    {copiedIndex === i ? "✓" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}
