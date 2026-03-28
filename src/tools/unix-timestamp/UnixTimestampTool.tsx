import { useState, useEffect, useCallback } from "react";
import { Button, Input, Label } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Box, Container } from "@/components/layout/Primitive";
import StatBox from "@/components/ui/StatBox";
import { DateInput } from "@/components/ui/DateInput";
import { ResultRow } from "@/components/advanced/ResultRow";

// --- Pure helpers (defined outside component so they're never recreated) ---

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

// Auto-detect seconds vs milliseconds and return a valid Date, or null
function parseTimestamp(raw: string): Date | null {
  const ts = parseInt(raw, 10);
  if (isNaN(ts)) return null;
  const msTs = ts > 1e12 ? ts : ts * 1000;
  const date = new Date(msTs);
  return isNaN(date.getTime()) ? null : date;
}

// --- Component ---

export default function UnixTimestampTool() {
  const [currentTime, setCurrentTime] = useState(() => Math.floor(Date.now() / 1000));

  // Two independent input states — fixes the "resets while typing" bug
  const [timestampInput, setTimestampInput] = useState("");
  const [dateInput, setDateInput] = useState("");

  const [result, setResult] = useState<Record<string, string> | null>(null);
  const [resultTimestamp, setResultTimestamp] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Live clock — only updates its own state slice
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentTime(Math.floor(Date.now() / 1000)),
      1000
    );
    return () => clearInterval(interval);
  }, []);

  const showResult = useCallback((date: Date) => {
    setError("");
    setResult(formatDate(date));
    setResultTimestamp(Math.floor(date.getTime() / 1000));
  }, []);

  const handleTimestampConvert = useCallback(() => {
    const date = parseTimestamp(timestampInput);
    if (!date) {
      setError("Please enter a valid Unix timestamp (seconds or milliseconds).");
      setResult(null);
      setResultTimestamp(null);
      return;
    }
    showResult(date);
  }, [timestampInput, showResult]);

  const handleDateConvert = useCallback(() => {
    if (!dateInput) {
      setError("Please select a date.");
      return;
    }
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      setError("Invalid date value.");
      return;
    }
    // Also populate the timestamp input so both sides stay in sync
    setTimestampInput(Math.floor(date.getTime() / 1000).toString());
    showResult(date);
  }, [dateInput, showResult]);

  const handleNow = useCallback(() => {
    const now = new Date();
    const ts = Math.floor(now.getTime() / 1000);
    setTimestampInput(ts.toString());
    setDateInput(now.toISOString().slice(0, 16)); // "YYYY-MM-DDTHH:MM" for datetime-local
    showResult(now);
  }, [showResult]);

  return (
    <Container>
      <Box>
        <StatBox
          prefix="Current Unix Timestamp"
          textSize="4xl"
          label=""
          value={currentTime.toString()}
        />
      </Box>

      <Container cols={2}>
        {/* Left panel: Timestamp → Date */}
        <Box>
          <Panel>
            <Input
              label="Timestamp to date"
              placeholder="e.g. 1711584000"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTimestampConvert()}
            />
            <Container cols={2}>
              <Button
                onClick={handleTimestampConvert}
                size="sm"
                variant="primary"
                disabled={!timestampInput}
              >
                Convert
              </Button>
              <Button onClick={handleNow} size="sm" variant="secondary">
                Now
              </Button>
            </Container>
          </Panel>
        </Box>

        {/* Right panel: Date → Timestamp */}
        <Box>
          <Panel>
            <DateInput
              label="Date to timestamp"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
            />
            <Container cols={2}>
              <Button
                onClick={handleDateConvert}
                size="sm"
                variant="primary"
                disabled={!dateInput}
              >
                Convert
              </Button>
              <Button onClick={handleNow} size="sm" variant="secondary">
                Now
              </Button>
            </Container>
          </Panel>
        </Box>
      </Container>

      {(result || error) && (
        <Box>
          <Panel>
            <Label>Results</Label>
            {error && <Label variant="danger">{error}</Label>}
            {resultTimestamp != null && (
              <ResultRow label="Timestamp" value={resultTimestamp.toString()} />
            )}
            {result &&
              Object.entries(result).map(([label, value]) => (
                <ResultRow key={label} label={label} value={value} />
              ))}
          </Panel>
        </Box>
      )}
    </Container>
  );
}