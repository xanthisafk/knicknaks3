import { useState, useMemo } from "react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function parseDateLocal(str: string): Date {
  // Parse YYYY-MM-DD as local date to avoid timezone offset issues
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

interface Diff {
  totalDays: number;
  weeks: number;
  remainderDays: number;
  months: number;
  remainderMonthDays: number;
  years: number;
  remainderYearMonths: number;
  sign: 1 | -1;
  workdays: number;
  weekends: number;
}

function computeDiff(startStr: string, endStr: string): Diff | null {
  if (!startStr || !endStr) return null;
  const start = parseDateLocal(startStr);
  const end = parseDateLocal(endStr);
  const sign = end >= start ? 1 : -1;
  const [a, b] = sign === 1 ? [start, end] : [end, start];

  const msPerDay = 86_400_000;
  const totalDays = Math.round((b.getTime() - a.getTime()) / msPerDay);

  // Count workdays (Mon-Fri)
  let workdays = 0;
  const cur = new Date(a);
  while (cur <= b) {
    const dow = cur.getDay();
    if (dow !== 0 && dow !== 6) workdays++;
    cur.setDate(cur.getDate() + 1);
  }
  const weekends = totalDays + 1 - workdays;

  // Months & years
  let years = b.getFullYear() - a.getFullYear();
  let months = b.getMonth() - a.getMonth();
  let remainderMonthDays = b.getDate() - a.getDate();
  if (remainderMonthDays < 0) {
    months--;
    const prev = new Date(b.getFullYear(), b.getMonth(), 0);
    remainderMonthDays += prev.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    totalDays,
    weeks: Math.floor(totalDays / 7),
    remainderDays: totalDays % 7,
    months: years * 12 + months,
    remainderMonthDays,
    years,
    remainderYearMonths: months,
    sign,
    workdays,
    weekends,
  };
}

function formatDate(str: string): string {
  if (!str) return "";
  const d = parseDateLocal(str);
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] border border-[var(--border-default)] p-5 ${className}`}>
      {children}
    </div>
  );
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 text-sm rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-bg)] text-[var(--text-primary)] outline-none focus:border-[var(--color-primary-500)] transition-colors"
      />
      {value && <p className="mt-1 text-[11px] text-[var(--text-tertiary)]">{formatDate(value)}</p>}
    </div>
  );
}

function ResultRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-3 border-b border-[var(--border-default)] last:border-0 ${highlight ? "bg-[var(--color-primary-500)]/5 -mx-5 px-5" : ""}`}>
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <span className={`text-sm font-semibold tabular-nums ${highlight ? "text-[var(--color-primary-500)]" : "text-[var(--text-primary)]"}`}>{value}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DateDifferenceCalculatorTool() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(today);

  const diff = useMemo(() => computeDiff(startDate, endDate), [startDate, endDate]);

  const swap = () => {
    setStartDate(endDate);
    setEndDate(startDate);
  };

  const setPreset = (label: string) => {
    const end = today();
    const start = parseDateLocal(end);
    switch (label) {
      case "1w": start.setDate(start.getDate() - 7); break;
      case "1m": start.setMonth(start.getMonth() - 1); break;
      case "3m": start.setMonth(start.getMonth() - 3); break;
      case "6m": start.setMonth(start.getMonth() - 6); break;
      case "1y": start.setFullYear(start.getFullYear() - 1); break;
      case "5y": start.setFullYear(start.getFullYear() - 5); break;
    }
    setStartDate(start.toISOString().slice(0, 10));
    setEndDate(end);
  };

  const presets = [
    { label: "1 week", key: "1w" },
    { label: "1 month", key: "1m" },
    { label: "3 months", key: "3m" },
    { label: "6 months", key: "6m" },
    { label: "1 year", key: "1y" },
    { label: "5 years", key: "5y" },
  ];

  return (
    <div className="space-y-5">
      {/* Date pickers */}
      <Panel>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <DateInput label="Start Date" value={startDate} onChange={setStartDate} />
          </div>

          <button
            onClick={swap}
            title="Swap dates"
            className="self-center sm:mb-1 w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--surface-bg)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:border-[var(--color-primary-500)] transition-colors text-base flex-shrink-0"
          >
            ⇄
          </button>

          <div className="flex-1">
            <DateInput label="End Date" value={endDate} onChange={setEndDate} />
          </div>
        </div>

        {/* Presets */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[var(--text-tertiary)]">Quick:</span>
          {presets.map((p) => (
            <button
              key={p.key}
              onClick={() => setPreset(p.key)}
              className="px-2.5 py-1 text-xs rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-primary-500)] transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </Panel>

      {/* Results */}
      {diff && (
        <>
          {diff.sign === -1 && (
            <div className="px-4 py-2.5 rounded-[var(--radius-md)] border border-amber-400/40 bg-amber-400/10 text-xs text-amber-600 dark:text-amber-400">
              ⚠ End date is before start date — showing the absolute difference.
            </div>
          )}

          <Panel>
            <ResultRow label="Total Days" value={`${diff.totalDays.toLocaleString()} days`} highlight />
            <ResultRow label="Total Weeks" value={`${diff.weeks.toLocaleString()} weeks${diff.remainderDays > 0 ? `, ${diff.remainderDays} day${diff.remainderDays !== 1 ? "s" : ""}` : ""}`} />
            <ResultRow label="Total Months" value={`${diff.months.toLocaleString()} months${diff.remainderMonthDays > 0 ? `, ${diff.remainderMonthDays} day${diff.remainderMonthDays !== 1 ? "s" : ""}` : ""}`} />
            <ResultRow label="Total Years" value={`${diff.years.toLocaleString()} yr${diff.years !== 1 ? "s" : ""}${diff.remainderYearMonths > 0 ? `, ${diff.remainderYearMonths} month${diff.remainderYearMonths !== 1 ? "s" : ""}` : ""}`} />
          </Panel>

          <Panel>
            <p className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-0">Breakdown by Day Type</p>
            <ResultRow label="Workdays (Mon-Fri)" value={`${diff.workdays.toLocaleString()} days`} />
            <ResultRow label="Weekend Days (Sat-Sun)" value={`${diff.weekends.toLocaleString()} days`} />
          </Panel>
        </>
      )}
    </div>
  );
}