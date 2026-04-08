import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Panel } from "@/components/layout";
import { Button, Emoji, Label, Toggle } from "@/components/ui";
import { DateInput } from "@/components/ui/DateInput";
import { getStoredItem, setStoredItem } from "@/lib/storage";
import {
  type WeekSchedule,
  type CountdownMode,
  type CountdownResult,
  DAY_LABELS,
  createFullSchedule,
  createEmptySchedule,
  createWeekdaysSchedule,
  createWeekendsSchedule,
  createBusinessHoursSchedule,
  computeCountdown,
  formatCountdown,
  cloneSchedule,
  countEnabledHours,
} from "@/lib/scheduleHelpers";
import {
  LucideTimer,
  LucideCalendarClock,
  LucideBriefcase,
  LucideCalendarDays,
  LucideCalendarOff,
  LucideCheckSquare,
  LucideXSquare,
} from "lucide-react";
import { Box, Container } from "@/components/layout/Primitive";
import StatBox from "@/components/ui/StatBox";

// ─── localStorage keys ───────────────────────────────────────────────────────

const STORAGE_PREFIX = "knicknaks:time-until:";
const KEY_START = `${STORAGE_PREFIX}start`;
const KEY_END = `${STORAGE_PREFIX}end`;
const KEY_MODE = `${STORAGE_PREFIX}mode`;
const KEY_SCHEDULE = `${STORAGE_PREFIX}schedule`;

// ─── Defaults ────────────────────────────────────────────────────────────────

function defaultStart(): string {
  return toDatetimeLocalString(new Date());
}

function defaultEnd(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return toDatetimeLocalString(d);
}

function toDatetimeLocalString(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function parseDatetimeLocal(str: string): Date {
  // "YYYY-MM-DDTHH:mm" → local Date
  const [datePart, timePart] = str.split("T");
  const [y, mo, d] = datePart.split("-").map(Number);
  const [h, mi] = (timePart || "00:00").split(":").map(Number);
  return new Date(y, mo - 1, d, h, mi, 0, 0);
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function TimeUntilCalculatorTool() {
  // State with localStorage hydration
  const [startStr, setStartStr] = useState(() =>
    getStoredItem(KEY_START, defaultStart()),
  );
  const [endStr, setEndStr] = useState(() =>
    getStoredItem(KEY_END, defaultEnd()),
  );
  const [mode, setMode] = useState<CountdownMode>(() =>
    getStoredItem<CountdownMode>(KEY_MODE, "full"),
  );
  const [schedule, setSchedule] = useState<WeekSchedule>(() =>
    getStoredItem(KEY_SCHEDULE, createBusinessHoursSchedule()),
  );

  // Persist to localStorage on change
  useEffect(() => setStoredItem(KEY_START, startStr), [startStr]);
  useEffect(() => setStoredItem(KEY_END, endStr), [endStr]);
  useEffect(() => setStoredItem(KEY_MODE, mode), [mode]);
  useEffect(() => setStoredItem(KEY_SCHEDULE, schedule), [schedule]);

  // Live countdown
  const [result, setResult] = useState<CountdownResult>(() =>
    computeCountdown(new Date(), parseDatetimeLocal(endStr), mode, schedule),
  );

  useEffect(() => {
    const tick = () => {
      const start = parseDatetimeLocal(startStr);
      const now = new Date();

      // If start is in the future → countdown hasn't begun yet
      // If start is in the past → use now (live countdown)
      const effectiveStart = now > start ? now : start;

      const end = parseDatetimeLocal(endStr);

      setResult(
        computeCountdown(effectiveStart, end, mode, schedule)
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startStr, endStr, mode, schedule]);

  // Derived
  const enabledCount = useMemo(() => countEnabledHours(schedule), [schedule]);
  const isCustom = mode === "custom";

  // Set start to now
  const setStartNow = () => setStartStr(toDatetimeLocalString(new Date()));

  return (
    <Container>
      <CountdownDisplay result={result} mode={mode} />
      {/* ── Date/Time Inputs ─── */}
      <Panel>
        <Container cols={2}>
          <Box className="flex flex-col gap-1.5">
            <DateInput
              label="Start"
              inputType="datetime-local"
              value={startStr}
              onChange={(e) => setStartStr(e.target.value)}
            />
            <Button
              onClick={setStartNow}
              variant="ghost"
              size="s"
              text="Now"
              icon={LucideTimer}
              className="shrink-0 self-start"
            />
          </Box>
          <DateInput
            label="End"
            inputType="datetime-local"
            value={endStr}
            onChange={(e) => setEndStr(e.target.value)}
          />
        </Container>
      </Panel>

      {/* ── Mode Toggle ─── */}
      <Panel>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Toggle
              label="Custom working hours"
              checked={isCustom}
              onChange={(v) => setMode(v ? "custom" : "full")}
              id="mode-toggle"
            />
          </div>
          {isCustom && (
            <span className="text-xs text-(--text-tertiary) font-mono tabular-nums">
              {enabledCount} / 168 hours enabled
            </span>
          )}
        </div>
        {isCustom && (
          <ScheduleGrid
            schedule={schedule}
            onChange={setSchedule}
          />
        )}
      </Panel>

      {/* ── Schedule Grid (custom mode only) ─── */}


      <Container cols={4}>
        <StatBox textSize="4xl" label="Days" value={result.days} />
        <StatBox textSize="4xl" label="Hours" value={result.hours} />
        <StatBox textSize="4xl" label="Minutes" value={result.minutes} />
        <StatBox textSize="4xl" label="Seconds" value={result.seconds} />
      </Container>
    </Container>
  );
}

// ─── Countdown Display ───────────────────────────────────────────────────────

function CountdownDisplay({
  result,
  mode,
}: {
  result: CountdownResult;
  mode: CountdownMode;
}) {
  const formatted = formatCountdown(result);
  const parts = formatted.split(" ");
  const daysPart = parts.length > 1 ? parts[0] : null;
  const timePart = parts.length > 1 ? parts[1] : parts[0];
  const digits = timePart.split(":");

  return (
    <Panel padding="lg" className="text-center!">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Emoji>
          {result.finished ? "🎉" : "🕙"}
        </Emoji>
        <Label size="m" variant="default" font="heading">
          {result.finished ? "Time's up!" : mode === "custom" ? "Hours Remaining" : "Time Remaining"}
        </Label>
      </div>

      {result.finished ? (
        <p className="text-2xl font-heading font-bold text-(--color-success)">
          Countdown Complete
        </p>
      ) : (
        <div className="flex items-baseline justify-center gap-1">
          {daysPart && (
            <>
              <span className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-primary-500 tabular-nums tracking-tight">
                {daysPart.replace("d", "")}
              </span>
              <span className="text-lg sm:text-xl font-heading font-medium text-(--text-tertiary) mr-2">
                d
              </span>
            </>
          )}
          {digits.map((d, i) => (
            <span key={i} className="contents">
              <span className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-primary-500 tabular-nums tracking-tight">
                {d}
              </span>
              {i < digits.length - 1 && (
                <span className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-(--text-tertiary) mx-0.5 animate-pulse">
                  :
                </span>
              )}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-(--text-tertiary) mt-3 font-mono tabular-nums">
        {result.totalSeconds.toLocaleString()} total seconds
      </p>
    </Panel>
  );
}


// ─── Schedule Grid ───────────────────────────────────────────────────────────

function ScheduleGrid({
  schedule,
  onChange,
}: {
  schedule: WeekSchedule;
  onChange: (s: WeekSchedule) => void;
}) {
  // Drag-to-paint state
  const painting = useRef<boolean | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const toggleCell = useCallback(
    (day: number, hour: number, forceValue?: boolean) => {
      onChange(
        schedule.map((d, di) =>
          di === day
            ? d.map((h, hi) => (hi === hour ? (forceValue ?? !h) : h))
            : d,
        ),
      );
    },
    [schedule, onChange],
  );

  const handlePointerDown = useCallback(
    (day: number, hour: number) => {
      const newVal = !schedule[day][hour];
      painting.current = newVal;
      toggleCell(day, hour, newVal);
    },
    [schedule, toggleCell],
  );

  const handlePointerEnter = useCallback(
    (day: number, hour: number) => {
      if (painting.current !== null) {
        toggleCell(day, hour, painting.current);
      }
    },
    [toggleCell],
  );

  useEffect(() => {
    const up = () => {
      painting.current = null;
    };
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  }, []);

  // Hour labels
  const hourLabels = Array.from({ length: 24 }, (_, i) => {
    if (i === 0) return "12am";
    if (i < 12) return `${i}am`;
    if (i === 12) return "12pm";
    return `${i - 12}pm`;
  });

  return (
    <>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
        <Label>Schedule</Label>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            onClick={() => onChange(createBusinessHoursSchedule())}
            variant="ghost"
            size="s"
            text="Business"
            icon={LucideBriefcase}
          />
          <Button
            onClick={() => onChange(createWeekdaysSchedule())}
            variant="ghost"
            size="xs"
            text="Weekdays"
            icon={LucideCalendarDays}
          />
          <Button
            onClick={() => onChange(createWeekendsSchedule())}
            variant="ghost"
            size="xs"
            text="Weekends"
            icon={LucideCalendarOff}
          />
          <Button
            onClick={() => onChange(createFullSchedule())}
            variant="ghost"
            size="xs"
            text="All"
            icon={LucideCheckSquare}
          />
          <Button
            onClick={() => onChange(createEmptySchedule())}
            variant="ghost"
            size="xs"
            text="None"
            icon={LucideXSquare}
          />
        </div>
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        className="overflow-x-auto -mx-4 md:-mx-6 px-4 md:px-6 pb-2"
        onContextMenu={(e) => e.preventDefault()}
      >
        <div
          className="grid select-none touch-none"
          style={{
            gridTemplateColumns: `48px repeat(24, minmax(28px, 1fr))`,
            gap: "2px",
            minWidth: "720px",
          }}
        >
          {/* Header row: hour labels */}
          <div /> {/* empty corner */}
          {hourLabels.map((label, i) => (
            <Label
              key={i}
              size="xs"
            >
              {label}
            </Label>
          ))}

          {/* Data rows */}
          {DAY_LABELS.map((dayLabel, day) => (
            <>
              <Label
                key={`label-${day}`}
                size="xs"
              >
                {dayLabel}
              </Label>
              {Array.from({ length: 24 }, (_, hour) => {
                const active = schedule[day]?.[hour] ?? false;
                return (
                  <button
                    key={`${day}-${hour}`}
                    type="button"
                    aria-label={`${DAY_LABELS[day]} ${hour}:00 — ${active ? "enabled" : "disabled"}`}
                    aria-pressed={active}
                    className="aspect-square rounded-[3px] transition-colors duration-75 cursor-pointer border border-transparent hover:border-(--border-hover)"
                    style={{
                      backgroundColor: active
                        ? "var(--color-primary-500)"
                        : "var(--surface-secondary)",
                      opacity: active ? 1 : 0.6,
                    }}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      handlePointerDown(day, hour);
                    }}
                    onPointerEnter={() => handlePointerEnter(day, hour)}
                  />
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-[10px] text-(--text-tertiary)">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded-[2px]"
            style={{ backgroundColor: "var(--color-primary-500)" }}
          />
          Enabled
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded-[2px] opacity-60"
            style={{ backgroundColor: "var(--surface-secondary)" }}
          />
          Disabled
        </span>
        <Label className="ml-auto" size="xs">Click & drag to paint</Label>
      </div>
    </>
  );
}