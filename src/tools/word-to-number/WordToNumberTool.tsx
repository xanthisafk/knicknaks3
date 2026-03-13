import { useState, useMemo } from "react";
import { Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

type Field = "start" | "end";

function pad2(n: number) { return String(n).padStart(2, "0"); }

function diff(start: Date, end: Date) {
  let ms = end.getTime() - start.getTime();
  const neg = ms < 0;
  ms = Math.abs(ms);
  const totalSecs = Math.floor(ms / 1000);
  const totalMins = Math.floor(totalSecs / 60);
  const totalHours = Math.floor(totalMins / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);

  const d = totalDays;
  const h = totalHours % 24;
  const m = totalMins % 60;
  const s = totalSecs % 60;

  const label = `${d}d ${pad2(h)}h ${pad2(m)}m ${pad2(s)}s`;
  return { label: (neg ? "−" : "+") + label, totalDays, totalHours, totalMins, totalSecs, totalWeeks, negative: neg };
}

function nowLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export default function WordToNumberTool() {
  // Repurposed: this file is for "Word to Number & Number to Word"
  const [start, setStart] = useState(nowLocal);
  const [end, setEnd] = useState(nowLocal);
  const [copied, setCopied] = useState<string | null>(null);

  const result = useMemo(() => {
    try {
      const s = new Date(start), e = new Date(end);
      if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
      return diff(s, e);
    } catch { return null; }
  }, [start, end]);

  const rows = result ? [
    ["Duration", result.label],
    ["Total Days", result.totalDays.toLocaleString()],
    ["Total Hours", result.totalHours.toLocaleString()],
    ["Total Minutes", result.totalMins.toLocaleString()],
    ["Total Seconds", result.totalSecs.toLocaleString()],
    ["Total Weeks", result.totalWeeks.toLocaleString()],
  ] : [];

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Panel>
          <div className="space-y-2">
            <label className="text-sm font-medium text(--text-primary)">Start Date & Time</label>
            <input type="datetime-local" value={start} onChange={e => setStart(e.target.value)}
              className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-[var(--surface-elevated)] text(--text-primary) border border-[var(--border-default)] text-sm" />
          </div>
        </Panel>
        <Panel>
          <div className="space-y-2">
            <label className="text-sm font-medium text(--text-primary)">End Date & Time</label>
            <input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)}
              className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-[var(--surface-elevated)] text(--text-primary) border border-[var(--border-default)] text-sm" />
          </div>
        </Panel>
      </div>

      {result && (
        <Panel>
          <div className="space-y-2">
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between px-3 py-2 rounded-[var(--radius-md)] bg-[var(--surface-secondary)]">
                <span className="text-xs text-[var(--text-tertiary)] w-32">{label}</span>
                <span className={`font-[family-name:var(--font-mono)] text-sm font-medium flex-1 ${label === "Duration" ? (result.negative ? "text-red-500" : "text-green-500") : "text(--text-primary)"}`}>{value}</span>
                <button onClick={async () => { await copyToClipboard(value); setCopied(String(label)); setTimeout(() => setCopied(null), 1500); }} className="text-xs text-[var(--text-tertiary)] hover:text(--text-primary) cursor-pointer">{copied === String(label) ? "✓" : "Copy"}</button>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
