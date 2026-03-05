import { useState, useMemo, useEffect } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const TIMEZONES = [
  { label: "UTC", tz: "UTC" },
  { label: "New York (ET)", tz: "America/New_York" },
  { label: "Chicago (CT)", tz: "America/Chicago" },
  { label: "Denver (MT)", tz: "America/Denver" },
  { label: "Los Angeles (PT)", tz: "America/Los_Angeles" },
  { label: "São Paulo (BRT)", tz: "America/Sao_Paulo" },
  { label: "London (GMT/BST)", tz: "Europe/London" },
  { label: "Paris (CET/CEST)", tz: "Europe/Paris" },
  { label: "Berlin (CET/CEST)", tz: "Europe/Berlin" },
  { label: "Moscow (MSK)", tz: "Europe/Moscow" },
  { label: "Dubai (GST)", tz: "Asia/Dubai" },
  { label: "Mumbai (IST)", tz: "Asia/Kolkata" },
  { label: "Bangkok (ICT)", tz: "Asia/Bangkok" },
  { label: "Singapore (SGT)", tz: "Asia/Singapore" },
  { label: "Shanghai (CST)", tz: "Asia/Shanghai" },
  { label: "Tokyo (JST)", tz: "Asia/Tokyo" },
  { label: "Seoul (KST)", tz: "Asia/Seoul" },
  { label: "Sydney (AEDT/AEST)", tz: "Australia/Sydney" },
  { label: "Auckland (NZST)", tz: "Pacific/Auckland" },
  { label: "Honolulu (HST)", tz: "Pacific/Honolulu" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function detectUserTimezone(): string {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return "UTC"; }
}

function formatInTZ(date: Date, tz: string): { time: string; date: string; offset: string; abbr: string } {
  const timeStr = date.toLocaleTimeString("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const dateStr = date.toLocaleDateString("en-US", { timeZone: tz, weekday: "short", month: "short", day: "numeric" });

  // Get the UTC offset via Intl
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, timeZoneName: "shortOffset",
  });
  const parts = fmt.formatToParts(date);
  const offset = parts.find((p) => p.type === "timeZoneName")?.value ?? "";

  const abbrFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, timeZoneName: "short",
  });
  const abbrParts = abbrFmt.formatToParts(date);
  const abbr = abbrParts.find((p) => p.type === "timeZoneName")?.value ?? "";

  return { time: timeStr, date: dateStr, offset, abbr };
}

// Parse a local datetime-local input string as if it's in a given timezone
// We build the Date by computing the UTC offset for that tz at approximately that time.
function parseDatetimeInTZ(localStr: string, tz: string): Date {
  // localStr: "YYYY-MM-DDTHH:mm"
  // Approximate: use the current UTC offset for the tz
  const [datePart, timePart] = localStr.split("T");
  const [y, mo, d] = datePart.split("-").map(Number);
  const [h, mi] = (timePart || "00:00").split(":").map(Number);

  // Trick: create the time in UTC, check what the tz thinks it is, adjust
  const utcGuess = new Date(Date.UTC(y, mo - 1, d, h, mi, 0));
  const tzTime = new Date(utcGuess.toLocaleString("en-US", { timeZone: tz }));
  const diff = utcGuess.getTime() - tzTime.getTime();
  return new Date(utcGuess.getTime() + diff);
}

function toDatetimeLocal(date: Date, tz: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour") === "24" ? "00" : get("hour")}:${get("minute")}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] border border-[var(--border-default)] p-5 ${className}`}>
      {children}
    </div>
  );
}

function TZSelect({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 text-sm rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-bg)] text-[var(--text-primary)] outline-none focus:border-[var(--color-primary-500)] transition-colors cursor-pointer"
      >
        {TIMEZONES.map((tz) => (
          <option key={tz.tz} value={tz.tz}>{tz.label}</option>
        ))}
        {/* If user tz not in list, add it */}
      </select>
    </div>
  );
}

function TimeCard({ label, info, isSource = false, onEdit, editValue }: {
  label: string;
  info: ReturnType<typeof formatInTZ> | null;
  isSource?: boolean;
  onEdit?: (v: string) => void;
  editValue?: string;
}) {
  return (
    <div className={`rounded-[var(--radius-md)] border p-4 flex flex-col gap-1 transition-colors ${
      isSource
        ? "border-[var(--color-primary-500)] bg-[var(--color-primary-500)]/5"
        : "border-[var(--border-default)] bg-[var(--surface-bg)]"
    }`}>
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase truncate">{label}</span>
        {info && <span className="text-[10px] text-[var(--text-tertiary)] font-mono ml-2 shrink-0">{info.offset}</span>}
      </div>
      {isSource && onEdit !== undefined && editValue !== undefined ? (
        <input
          type="datetime-local"
          value={editValue}
          onChange={(e) => onEdit(e.target.value)}
          className="text-xl font-semibold text-[var(--text-primary)] bg-transparent border-none outline-none w-full"
        />
      ) : (
        <span className="text-2xl font-semibold text-[var(--text-primary)] tabular-nums font-mono">{info?.time ?? "—"}</span>
      )}
      {info && (
        <span className="text-xs text-[var(--text-secondary)]">{info.date} · <span className="font-medium">{info.abbr}</span></span>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TimezoneConverterTool() {
  const userTZ = useMemo(detectUserTimezone, []);

  const [sourceTZ, setSourceTZ] = useState(userTZ);
  const [targetTZs, setTargetTZs] = useState<string[]>([
    "UTC",
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
  ].filter((tz) => tz !== userTZ).slice(0, 4));

  const [sourceInput, setSourceInput] = useState(() => {
    const now = new Date();
    return toDatetimeLocal(now, userTZ);
  });

  // Current wall-clock time mode
  const [liveMode, setLiveMode] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!liveMode) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [liveMode]);

  const sourceDate = useMemo(() => {
    if (liveMode) return now;
    return parseDatetimeInTZ(sourceInput, sourceTZ);
  }, [liveMode, now, sourceInput, sourceTZ]);

  const handleSourceInput = (v: string) => {
    setLiveMode(false);
    setSourceInput(v);
  };

  const handleSourceTZChange = (tz: string) => {
    setSourceTZ(tz);
    if (!liveMode) {
      // Re-anchor so the displayed source time stays the same number
      // (user is changing what timezone their typed time is in)
    }
  };

  const addTargetTZ = (tz: string) => {
    if (!targetTZs.includes(tz) && tz !== sourceTZ) {
      setTargetTZs((prev) => [...prev, tz]);
    }
  };

  const removeTargetTZ = (tz: string) => setTargetTZs((prev) => prev.filter((t) => t !== tz));

  const tzLabel = (tz: string) => TIMEZONES.find((t) => t.tz === tz)?.label ?? tz;

  const availableToAdd = TIMEZONES.filter((t) => t.tz !== sourceTZ && !targetTZs.includes(t.tz));

  return (
    <div className="space-y-5">
      {/* Source */}
      <Panel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <TZSelect label="Source Timezone" value={sourceTZ} onChange={handleSourceTZChange} />
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">Date & Time</label>
              <input
                type="datetime-local"
                value={liveMode ? toDatetimeLocal(now, sourceTZ) : sourceInput}
                onChange={(e) => handleSourceInput(e.target.value)}
                disabled={liveMode}
                className="w-full px-3 py-2.5 text-sm rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-bg)] text-[var(--text-primary)] outline-none focus:border-[var(--color-primary-500)] transition-colors disabled:opacity-50"
              />
            </div>
            <button
              onClick={() => { setLiveMode((v) => !v); }}
              title="Toggle live clock"
              className={`mb-0 px-3 py-2.5 text-xs rounded-[var(--radius-md)] border transition-colors whitespace-nowrap ${
                liveMode
                  ? "border-[var(--color-primary-500)] bg-[var(--color-primary-500)]/10 text-[var(--text-primary)]"
                  : "border-[var(--border-default)] bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {liveMode ? "🔴 Live" : "⏱ Live"}
            </button>
          </div>
        </div>

        <div className="rounded-[var(--radius-md)] border border-[var(--color-primary-500)] bg-[var(--color-primary-500)]/5 p-4">
          {(() => {
            const info = formatInTZ(sourceDate, sourceTZ);
            return (
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-0.5">{tzLabel(sourceTZ)}</p>
                  <p className="text-3xl font-semibold tabular-nums text-[var(--text-primary)] font-mono">{info.time}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{info.date} · <span className="font-medium">{info.abbr}</span> · {info.offset}</p>
                </div>
              </div>
            );
          })()}
        </div>
      </Panel>

      {/* Target timezones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {targetTZs.map((tz) => {
          const info = formatInTZ(sourceDate, tz);
          return (
            <div
              key={tz}
              className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-bg)] p-4 relative group"
            >
              <button
                onClick={() => removeTargetTZ(tz)}
                className="absolute top-3 right-3 w-5 h-5 rounded-full text-[var(--text-tertiary)] hover:text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center justify-center border border-[var(--border-default)] bg-[var(--surface-elevated)]"
              >
                ×
              </button>
              <p className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-0.5 pr-6">{tzLabel(tz)}</p>
              <p className="text-2xl font-semibold tabular-nums text-[var(--text-primary)] font-mono">{info.time}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{info.date} · <span className="font-medium">{info.abbr}</span> · {info.offset}</p>
            </div>
          );
        })}
      </div>

      {/* Add timezone */}
      {availableToAdd.length > 0 && (
        <Panel className="py-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-[var(--text-secondary)]">Add timezone:</span>
            <select
              defaultValue=""
              onChange={(e) => { if (e.target.value) { addTargetTZ(e.target.value); e.target.value = ""; } }}
              className="text-xs px-2.5 py-1.5 rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-bg)] text-[var(--text-primary)] cursor-pointer outline-none focus:border-[var(--color-primary-500)] transition-colors"
            >
              <option value="" disabled>Select timezone…</option>
              {availableToAdd.map((tz) => (
                <option key={tz.tz} value={tz.tz}>{tz.label}</option>
              ))}
            </select>
          </div>
        </Panel>
      )}
    </div>
  );
}