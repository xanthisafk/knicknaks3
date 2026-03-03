import { useState, useEffect } from "react";
import { Button, Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

function formatDate(date: Date): Record<string, string> {
  return {
    "Local": date.toLocaleString(),
    "UTC": date.toUTCString(),
    "ISO 8601": date.toISOString(),
    "Date only": date.toLocaleDateString("en-CA"), // YYYY-MM-DD
    "Time only": date.toLocaleTimeString(),
    "Relative": getRelativeTime(date),
  };
}

function getRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = date.getTime() - now;
  const absDiff = Math.abs(diff);
  const isPast = diff < 0;
  const prefix = isPast ? "" : "in ";
  const suffix = isPast ? " ago" : "";

  if (absDiff < 60_000) return "just now";
  if (absDiff < 3_600_000) {
    const m = Math.floor(absDiff / 60_000);
    return `${prefix}${m} minute${m > 1 ? "s" : ""}${suffix}`;
  }
  if (absDiff < 86_400_000) {
    const h = Math.floor(absDiff / 3_600_000);
    return `${prefix}${h} hour${h > 1 ? "s" : ""}${suffix}`;
  }
  const d = Math.floor(absDiff / 86_400_000);
  if (d < 365) return `${prefix}${d} day${d > 1 ? "s" : ""}${suffix}`;
  const y = Math.floor(d / 365);
  return `${prefix}${y} year${y > 1 ? "s" : ""}${suffix}`;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-[var(--radius-md)] bg-[var(--surface-secondary)]">
      <span className="text-xs font-medium text(--text-secondary) w-20">{label}</span>
      <span className="text-sm font-[family-name:var(--font-mono)] text(--text-primary) flex-1 ml-3">{value}</span>
      <button
        onClick={async () => {
          await copyToClipboard(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="text-xs text-[var(--text-tertiary)] hover:text(--text-primary) transition-colors cursor-pointer ml-2"
      >
        {copied ? "✓" : "Copy"}
      </button>
    </div>
  );
}

export default function UnixTimestampTool() {
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));
  const [timestampInput, setTimestampInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [result, setResult] = useState<Record<string, string> | null>(null);
  const [resultTimestamp, setResultTimestamp] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTimestampConvert = () => {
    setError("");
    const ts = parseInt(timestampInput);
    if (isNaN(ts)) {
      setError("Please enter a valid number.");
      return;
    }
    // Auto-detect seconds vs milliseconds
    const msTs = ts > 1e12 ? ts : ts * 1000;
    const date = new Date(msTs);
    if (isNaN(date.getTime())) {
      setError("Invalid timestamp.");
      return;
    }
    setResult(formatDate(date));
    setResultTimestamp(Math.floor(msTs / 1000));
  };

  const handleDateConvert = () => {
    setError("");
    if (!dateInput) {
      setError("Please select a date.");
      return;
    }
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      setError("Invalid date.");
      return;
    }
    const ts = Math.floor(date.getTime() / 1000);
    setResultTimestamp(ts);
    setTimestampInput(ts.toString());
    setResult(formatDate(date));
  };

  const handleNow = () => {
    const now = new Date();
    setTimestampInput(Math.floor(now.getTime() / 1000).toString());
    setResult(formatDate(now));
    setResultTimestamp(Math.floor(now.getTime() / 1000));
  };

  return (
    <div className="space-y-6">
      {/* Live clock */}
      <Panel>
        <div className="text-center">
          <p className="text-xs text-[var(--text-tertiary)] mb-1">Current Unix Timestamp</p>
          <p className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-mono)] text-[var(--color-primary-500)] tabular-nums">
            {currentTime}
          </p>
        </div>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Timestamp → Date */}
        <Panel>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text(--text-primary)">Timestamp → Date</h3>
            <Input
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              placeholder="e.g. 1700000000"
              className="font-[family-name:var(--font-mono)]"
            />
            <div className="flex gap-2">
              <Button onClick={handleTimestampConvert} size="sm">Convert</Button>
              <Button onClick={handleNow} size="sm" variant="secondary">Now</Button>
            </div>
          </div>
        </Panel>

        {/* Date → Timestamp */}
        <Panel>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text(--text-primary)">Date → Timestamp</h3>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-[var(--surface-elevated)] text(--text-primary) border border-[var(--border-default)] text-sm"
            />
            <Button onClick={handleDateConvert} size="sm">Convert</Button>
          </div>
        </Panel>
      </div>

      {error && (
        <p className="text-sm text-[var(--color-error)] px-1" role="alert">{error}</p>
      )}

      {result && (
        <Panel>
          <h3 className="text-sm font-medium text(--text-primary) mb-3">Conversion Result</h3>
          <div className="space-y-2">
            {resultTimestamp !== null && (
              <InfoRow label="Timestamp" value={resultTimestamp.toString()} />
            )}
            {Object.entries(result).map(([label, value]) => (
              <InfoRow key={label} label={label} value={value} />
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
