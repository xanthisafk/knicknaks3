/**
 * Schedule helpers for the Time Until Calculator.
 *
 * A "WeekSchedule" is a 7×24 boolean grid:
 *   schedule[dayOfWeek][hour] = true | false
 *
 * dayOfWeek: 0 = Sunday … 6 = Saturday  (matches JS Date.getDay())
 * hour:      0 = midnight … 23
 */

// ─── Types ───────────────────────────────────────────────────────────────────

/** 7 days × 24 hours */
export type WeekSchedule = boolean[][];

export type CountdownMode = "full" | "custom";

export interface CountdownResult {
  /** Total remaining seconds (filtered by schedule when in custom mode) */
  totalSeconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** true when end ≤ now */
  finished: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export const DAY_LABELS_FULL = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
] as const;

// ─── Preset generators ──────────────────────────────────────────────────────

/** Create a schedule with every hour enabled */
export function createFullSchedule(): WeekSchedule {
  return Array.from({ length: 7 }, () => Array(24).fill(true));
}

/** Create a schedule with every hour disabled */
export function createEmptySchedule(): WeekSchedule {
  return Array.from({ length: 7 }, () => Array(24).fill(false));
}

/** Mon–Fri, all 24 hours enabled */
export function createWeekdaysSchedule(): WeekSchedule {
  return Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: 24 }, () => day >= 1 && day <= 5),
  );
}

/** Sat–Sun, all 24 hours enabled */
export function createWeekendsSchedule(): WeekSchedule {
  return Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: 24 }, () => day === 0 || day === 6),
  );
}

/**
 * Mon–Fri, startHour..endHour-1 enabled (default 9–17 = 9 AM to 5 PM).
 */
export function createBusinessHoursSchedule(
  startHour = 9,
  endHour = 17,
): WeekSchedule {
  return Array.from({ length: 7 }, (_, day) =>
    Array.from(
      { length: 24 },
      (_, hour) => day >= 1 && day <= 5 && hour >= startHour && hour < endHour,
    ),
  );
}

// ─── Core calculation ────────────────────────────────────────────────────────

/**
 * Compute countdown seconds between `start` and `end`, honoring the schedule.
 *
 * Algorithm:
 *  - Walk hour-by-hour from start to end.
 *  - For each hour slot, if `schedule[day][hour]` is true, accumulate the
 *    effective seconds within that slot.
 *  - Partial first-hour and partial last-hour are handled precisely.
 */
export function computeScheduledSeconds(
  start: Date,
  end: Date,
  schedule: WeekSchedule,
): number {
  if (end <= start) return 0;

  let totalSeconds = 0;

  // Snap to the beginning of the start hour
  const cursor = new Date(start);
  cursor.setMinutes(0, 0, 0);

  const endTime = end.getTime();
  const startTime = start.getTime();

  while (cursor.getTime() < endTime) {
    const day = cursor.getDay();
    const hour = cursor.getHours();

    // Compute the effective window within this hour slot
    const slotStart = cursor.getTime();
    const slotEnd = slotStart + 3_600_000; // next hour boundary

    // Effective range: clamp by start/end
    const effectiveStart = Math.max(slotStart, startTime);
    const effectiveEnd = Math.min(slotEnd, endTime);

    if (effectiveEnd > effectiveStart && schedule[day]?.[hour]) {
      totalSeconds += (effectiveEnd - effectiveStart) / 1000;
    }

    // Advance cursor to next hour
    cursor.setTime(slotStart + 3_600_000);
  }

  return totalSeconds;
}

/**
 * Convert total seconds into a decomposed result with days/hours/minutes/seconds.
 */
export function decompose(totalSeconds: number): CountdownResult {
  if (totalSeconds <= 0) {
    return { totalSeconds: 0, days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  }

  const s = Math.floor(totalSeconds);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;

  return { totalSeconds: s, days, hours, minutes, seconds, finished: false };
}

/**
 * Full countdown: compute remaining time from `now` to `end`, with mode support.
 */
export function computeCountdown(
  now: Date,
  end: Date,
  mode: CountdownMode,
  schedule: WeekSchedule,
): CountdownResult {
  if (end <= now) {
    return decompose(0);
  }

  if (mode === "full") {
    const diffMs = end.getTime() - now.getTime();
    return decompose(diffMs / 1000);
  }

  // Custom mode: walk through the schedule
  const totalSec = computeScheduledSeconds(now, end, schedule);
  return decomposeScheduled(totalSec);
}

export function decomposeScheduled(totalSeconds: number): CountdownResult {
  if (totalSeconds <= 0) {
    return {
      totalSeconds: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      finished: true,
    };
  }

  const s = Math.floor(totalSeconds);

  const totalHours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;

  return {
    totalSeconds: s,
    days: 0,              // not meaningful in scheduled mode
    hours: totalHours,    // ← key change (accumulated hours)
    minutes,
    seconds,
    finished: false,
  };
}

// ─── Formatting ──────────────────────────────────────────────────────────────

/** Format as HH:MM:SS */
export function formatTime(h: number, m: number, s: number): string {
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

/** Format as "Xd HH:MM:SS" or just "HH:MM:SS" */
export function formatCountdown(result: CountdownResult, mode: CountdownMode): string {
  if (result.finished) return "00:00:00";

  const h = result.hours;
  const m = String(result.minutes).padStart(2, "0");
  const s = String(result.seconds).padStart(2, "0");

  if (mode === "full") {
    return `${result.days}d ${h}:${m}:${s}`;
  }

  return `${h}:${m}:${s}`;
}

/** Deep-clone a schedule */
export function cloneSchedule(schedule: WeekSchedule): WeekSchedule {
  return schedule.map((day) => [...day]);
}

/** Count how many hours are enabled */
export function countEnabledHours(schedule: WeekSchedule): number {
  return schedule.reduce(
    (sum, day) => sum + day.reduce((s, v) => s + (v ? 1 : 0), 0),
    0,
  );
}
