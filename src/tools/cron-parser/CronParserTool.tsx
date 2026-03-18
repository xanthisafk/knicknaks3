import { useState, useMemo } from "react";
import { Input, Label } from "@/components/ui";
import { Panel } from "@/components/layout";
import cronstrue from "cronstrue";
import StatBox from "@/components/ui/StatBox";
import { ResultRow } from "@/components/advanced/ResultRow";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        <div className="space-y-2">
          <div className="flex flex-col md:flex-row gap-2">
            <Input
              label="Cron Expression"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="* * * * *"
              className="font-mono text-base grow"
              error={error || undefined}
            />

            <Select label="Preset" value={expression} onValueChange={(value) => setExpression(value)}>
              <SelectTrigger>
                {PRESETS.find((preset) => preset.value === expression)?.label || "Select a preset"}
              </SelectTrigger>
              <SelectContent>
                {PRESETS.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Field breakdown */}
          {parts.length >= 5 && (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">

              {FIELD_LABELS.map((label, i) => (
                <div className="grow" key={label + i} >
                  <StatBox prefix={FIELD_RANGES[i]} label={label} value={parts[i]} />
                </div>
              ))}
            </div>
          )}
          {description && <>
            <div className="flex flex-col gap-2">
              <Label>Parsed Description</Label>
              <span>{description}</span>
            </div>
          </>}
        </div>
      </Panel>

      {/* Next runs */}
      {nextRuns.length > 0 && (
        <Panel>
          <div className="space-y-2">
            <Label>Next 5 Runs</Label>
            <div className="space-y-1.5">
              {nextRuns.map((date, i) => (
                <ResultRow label={`${i + 1}.`} value={date.toLocaleString(undefined, {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })} />
              ))}
            </div>
          </div>
        </Panel>
      )}

      {/* Cheat sheet */}
      <Panel>
        <div className="space-y-3">
          <Label>Cheat Sheet</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-(--border-default)">
                  <th className="text-start"><Label>Symbol</Label></th>
                  <th className="text-start"><Label>Meaning</Label></th>
                  <th className="text-start"><Label>Example</Label></th>
                </tr>
              </thead>
              <tbody className="text-(--text-primary)">
                {[
                  ["*", "Any value", "* (every minute)"],
                  [",", "List separator", "1,15 (1st and 15th)"],
                  ["-", "Range", "1-5 (Mon to Fri)"],
                  ["/", "Step", "*/10 (every 10)"],
                ].map(([sym, meaning, example]) => (
                  <tr key={sym} className="border-b border-(--border-default)/50 text-start">
                    <td className="py-2 pr-4 font-mono font-semibold">{sym}</td>
                    <td className="py-2 pr-4 font-mono text-(--text-secondary)">{meaning}</td>
                    <td className="py-2">{example}</td>
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