import { useState, useMemo } from "react";
import { Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import cronstrue from "cronstrue";

const PRESETS: { label: string; value: string }[] = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every day at midnight", value: "0 0 * * *" },
  { label: "Every Monday at 9 AM", value: "0 9 * * 1" },
  { label: "Every 15 minutes", value: "*/15 * * * *" },
  { label: "Weekdays at 6 PM", value: "0 18 * * 1-5" },
  { label: "1st of every month", value: "0 0 1 * *" },
  { label: "Every 6 hours", value: "0 */6 * * *" },
];

const FIELD_LABELS = ["Minute", "Hour", "Day (Month)", "Month", "Day (Week)"];
const FIELD_RANGES = ["0-59", "0-23", "1-31", "1-12", "0-7 (0,7=Sun)"];

/** Compute the next N run times from a cron expression */
function getNextRuns(expression: string, count = 5): Date[] {
  const parts = expression.trim().split(/\s+/);
  if (parts.length < 5) return [];

  const dates: Date[] = [];
  const now = new Date();
  const cursor = new Date(now);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  const maxIterations = 525600; // 1 year of minutes

  for (let i = 0; i < maxIterations && dates.length < count; i++) {
    if (matchesCron(cursor, parts)) {
      dates.push(new Date(cursor));
    }
    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  return dates;
}

function matchesCron(date: Date, parts: string[]): boolean {
  const minute = date.getMinutes();
  const hour = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay(); // 0 = Sunday

  return (
    matchField(parts[0], minute, 0, 59) &&
    matchField(parts[1], hour, 0, 23) &&
    matchField(parts[2], dayOfMonth, 1, 31) &&
    matchField(parts[3], month, 1, 12) &&
    matchField(parts[4], dayOfWeek, 0, 7)
  );
}

function matchField(field: string, value: number, min: number, max: number): boolean {
  // Handle day of week: 7 = Sunday = 0
  if (max === 7 && value === 0) {
    return matchField(field, 0, 0, 7) || matchField(field, 7, 0, 7);
  }

  for (const part of field.split(",")) {
    if (matchPart(part.trim(), value, min, max)) return true;
  }
  return false;
}

function matchPart(part: string, value: number, min: number, max: number): boolean {
  if (part === "*") return true;

  // Step: */n or range/n
  if (part.includes("/")) {
    const [rangePart, stepStr] = part.split("/");
    const step = parseInt(stepStr);
    if (isNaN(step) || step <= 0) return false;

    let start = min;
    let end = max;

    if (rangePart !== "*") {
      if (rangePart.includes("-")) {
        const [a, b] = rangePart.split("-").map(Number);
        start = a;
        end = b;
      } else {
        start = parseInt(rangePart);
      }
    }

    for (let i = start; i <= end; i += step) {
      if (i === value) return true;
    }
    return false;
  }

  // Range: a-b
  if (part.includes("-")) {
    const [a, b] = part.split("-").map(Number);
    return value >= a && value <= b;
  }

  // Exact
  return parseInt(part) === value;
}

export default function CronParserTool() {
  const [expression, setExpression] = useState("*/15 * * * *");

  const { description, error } = useMemo(() => {
    try {
      const desc = cronstrue.toString(expression, {
        throwExceptionOnParseError: true,
        use24HourTimeFormat: false,
      });
      return { description: desc, error: "" };
    } catch (e) {
      return { description: "", error: e instanceof Error ? e.message : "Invalid expression" };
    }
  }, [expression]);

  const nextRuns = useMemo(() => {
    if (error) return [];
    try {
      return getNextRuns(expression, 5);
    } catch {
      return [];
    }
  }, [expression, error]);

  const parts = expression.trim().split(/\s+/);

  return (
    <div className="space-y-2">
      {/* Input */}
      <Panel>
        <div className="space-y-4">
          <Input
            label="Cron Expression"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="* * * * *"
            className="font-mono text-base"
            error={error || undefined}
          />

          {/* Field breakdown */}
          {parts.length >= 5 && (
            <div className="grid grid-cols-5 gap-2">
              {FIELD_LABELS.map((label, i) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 p-2 rounded-md bg-(--surface-secondary)"
                >
                  <span className="font-mono text-sm font-semibold text-(--text-primary)">
                    {parts[i] ?? "—"}
                  </span>
                  <span className="text-[10px] text-(--text-secondary) text-center leading-tight">
                    {label}
                  </span>
                  <span className="text-[10px] text-(--text-tertiary)">
                    {FIELD_RANGES[i]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Panel>

      {/* Human-readable description */}
      {description && (
        <Panel>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-(--text-primary)">Plain English</h3>
            <p className="text-base text-(--text-primary) font-medium">
              {description}
            </p>
          </div>
        </Panel>
      )}

      {/* Next runs */}
      {nextRuns.length > 0 && (
        <Panel>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-(--text-primary)">Next 5 Runs</h3>
            <div className="space-y-1.5">
              {nextRuns.map((date, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2 rounded-md bg-(--surface-secondary)"
                >
                  <span className="text-xs font-medium text-(--text-tertiary) w-5">{i + 1}</span>
                  <span className="font-mono text-sm text-(--text-primary)">
                    {date.toLocaleString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      )}

      {/* Presets */}
      <Panel>
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-(--text-primary)">Quick Presets</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setExpression(preset.value)}
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-md border text-left cursor-pointer ${expression === preset.value
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-(--surface-secondary) text-(--text-primary) border-(--border-default) hover:border-(--border-hover)"
                  }`}
              >
                <span className="text-sm">{preset.label}</span>
                <span className="font-mono text-xs opacity-70">{preset.value}</span>
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {/* Cheat sheet */}
      <Panel>
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-(--text-primary)">Cheat Sheet</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-(--border-default)">
                  <th className="text-left py-2 pr-4 text-(--text-secondary) font-medium">Symbol</th>
                  <th className="text-left py-2 pr-4 text-(--text-secondary) font-medium">Meaning</th>
                  <th className="text-left py-2 text-(--text-secondary) font-medium">Example</th>
                </tr>
              </thead>
              <tbody className="text-(--text-primary)">
                {[
                  ["*", "Any value", "* (every minute)"],
                  [",", "List separator", "1,15 (1st and 15th)"],
                  ["-", "Range", "1-5 (Mon to Fri)"],
                  ["/", "Step", "*/10 (every 10)"],
                ].map(([sym, meaning, example]) => (
                  <tr key={sym} className="border-b border-(--border-default)/50">
                    <td className="py-2 pr-4 font-mono font-semibold">{sym}</td>
                    <td className="py-2 pr-4">{meaning}</td>
                    <td className="py-2 font-mono text-xs text-(--text-secondary)">{example}</td>
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