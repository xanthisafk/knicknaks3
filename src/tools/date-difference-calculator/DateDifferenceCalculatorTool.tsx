import { useState, useMemo } from "react";
import { today, parseDateLocal } from "@/lib";
import { ResultRow } from "@/components/advanced/ResultRow";
import { Panel } from "@/components/layout";
import { DateInput } from "@/components/ui/DateInput";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { Button, Label } from "@/components/ui";
import { LucideArrowRightLeft } from "lucide-react";


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

const presets = [
  { label: "1 week", key: "1w" },
  { label: "1 month", key: "1m" },
  { label: "3 months", key: "3m" },
  { label: "6 months", key: "6m" },
  { label: "1 year", key: "1y" },
  { label: "5 years", key: "5y" },
];

export default function DateDifferenceCalculatorTool() {
  const [currentPreset, setCurrentPreset] = useState(presets[0].key);
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

  return (
    <div className="space-y-5">
      {/* Date pickers */}
      <Panel>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <DateInput label="Start Date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>

          <Button
            onClick={swap}
            title="Swap dates"
            variant="ghost"
            icon={LucideArrowRightLeft} />
          <div className="flex-1">
            <DateInput label="End Date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>

        {/* Presets */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-(--text-tertiary)">Quick:</span>
          <RadioGroup value={currentPreset} onValueChange={v => {
            setPreset(v);
            setCurrentPreset(v);
          }}>
            {presets.map((p) => (
              <Radio
                key={p.key}
                value={p.key}
                label={p.label}
              />
            ))}
          </RadioGroup>
        </div>
      </Panel>

      {/* Results */}
      {diff && (
        <>
          {diff.sign === -1 && (
            <div className="px-4 py-2.5 rounded-md border border-red-400/40 bg-(--surface-elevated) text-xs text-red-600 dark:text-red-400">
              <span className="font-emoji">⚠️</span> End date is before start date. Showing the absolute difference.
            </div>
          )}

          <Panel className="flex flex-col gap-2">
            <ResultRow label="Total Days" value={`${diff.totalDays.toLocaleString()} days`} />
            <ResultRow label="Total Weeks" value={`${diff.weeks.toLocaleString()} weeks${diff.remainderDays > 0 ? `, ${diff.remainderDays} day${diff.remainderDays !== 1 ? "s" : ""}` : ""}`} />
            <ResultRow label="Total Months" value={`${diff.months.toLocaleString()} months${diff.remainderMonthDays > 0 ? `, ${diff.remainderMonthDays} day${diff.remainderMonthDays !== 1 ? "s" : ""}` : ""}`} />
            <ResultRow label="Total Years" value={`${diff.years.toLocaleString()} yr${diff.years !== 1 ? "s" : ""}${diff.remainderYearMonths > 0 ? `, ${diff.remainderYearMonths} month${diff.remainderYearMonths !== 1 ? "s" : ""}` : ""}`} />
          </Panel>

          <Panel className="flex flex-col gap-2">
            <Label>Breakdown by Day Type</Label>
            <ResultRow label="Workdays (Mon-Fri)" value={`${diff.workdays.toLocaleString()} days`} />
            <ResultRow label="Weekend Days (Sat-Sun)" value={`${diff.weekends.toLocaleString()} days`} />
          </Panel>
        </>
      )}
    </div>
  );
}