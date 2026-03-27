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


function parseDatetimeInTZ(localStr: string, tz: string): Date {
    const [datePart, timePart] = localStr.split("T");
    const [y, mo, d] = datePart.split("-").map(Number);
    const [h, mi] = (timePart || "00:00").split(":").map(Number);

    // Step 1: treat input as if it's UTC (temporary anchor)
    const utcDate = new Date(Date.UTC(y, mo - 1, d, h, mi, 0));

    // Step 2: get the timezone offset at that moment
    const offsetMinutes = getOffsetMinutes(utcDate, tz);

    // Step 3: subtract offset to get real UTC time
    return new Date(utcDate.getTime() - offsetMinutes * 60 * 1000);
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

function fuzzyMatch(query: string, target: string): boolean {
    query = query.toLowerCase();
    target = target.toLowerCase();

    let qi = 0;
    let ti = 0;

    while (qi < query.length && ti < target.length) {
        if (query[qi] === target[ti]) qi++;
        ti++;
    }

    return qi === query.length;
}

function getOffsetMinutes(date: Date, tz: string): number {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        timeZoneName: "shortOffset",
    }).formatToParts(date);

    const offsetStr = parts.find(p => p.type === "timeZoneName")?.value ?? "UTC+0";

    const match = offsetStr.match(/(?:UTC|GMT)([+-]\d{1,2})(?::?(\d{2}))?/);
    if (!match) return 0;

    const sign = match[1].startsWith("-") ? -1 : 1;
    const hours = Math.abs(parseInt(match[1], 10));
    const minutes = match[2] ? parseInt(match[2], 10) : 0;

    return sign * (hours * 60 + minutes);
}

function getRelativeTZDiff(date: Date, fromTZ: string, toTZ: string): string {
    const fromOffset = getOffsetMinutes(date, fromTZ);
    const toOffset = getOffsetMinutes(date, toTZ);

    const diffMinutes = toOffset - fromOffset;

    if (diffMinutes === 0) return "Same time";

    const abs = Math.abs(diffMinutes);
    const hours = Math.floor(abs / 60);
    const minutes = abs % 60;

    const unit =
        minutes === 0
            ? `${hours} hour${hours !== 1 ? "s" : ""}`
            : `${hours}h ${minutes}m`;

    return diffMinutes > 0
        ? `${unit} ahead`
        : `${unit} behind`;
}

export {
    TIMEZONES,
    detectUserTimezone,
    formatInTZ,
    parseDatetimeInTZ,
    toDatetimeLocal,
    fuzzyMatch,
    getOffsetMinutes,
    getRelativeTZDiff,
}