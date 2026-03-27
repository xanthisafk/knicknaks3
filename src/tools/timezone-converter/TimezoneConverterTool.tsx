import { Panel } from "@/components/layout";
import { Box, Container } from "@/components/layout/Primitive";
import { Button, Input } from "@/components/ui";
import { DateInput } from "@/components/ui/DateInput";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import StatBox from "@/components/ui/StatBox";
import { detectUserTimezone, formatInTZ, fuzzyMatch, getRelativeTZDiff, parseDatetimeInTZ, TIMEZONES, toDatetimeLocal } from "@/lib/timeHelpers";
import { Clock, Pause, Search } from "lucide-react";
import { useState, useMemo, useEffect } from "react";


// - Main Component -

export default function TimezoneConverterTool() {
  const userTZ = useMemo(detectUserTimezone, []);

  const [sourceTZ, setSourceTZ] = useState(userTZ);
  const [targetTZs, setTargetTZs] = useState<string[]>(TIMEZONES.map(({ tz }) => tz));
  const [filter, setFilter] = useState("");

  const [sourceInput, setSourceInput] = useState(() => {
    const now = new Date();
    return toDatetimeLocal(now, userTZ);
  });

  // Current wall-clock time mode
  const [liveMode, setLiveMode] = useState(true);
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
  };

  const handleFilterChange = (v: string) => {
    setFilter(v);
    filterTimezones(v);
  }

  const filterTimezones = (input: string) => {
    const q = input.trim().toLowerCase();

    if (!q) {
      setTargetTZs(TIMEZONES.map(t => t.tz));
      return;
    }

    const filtered = TIMEZONES.filter(({ label, tz }) => {
      return (
        fuzzyMatch(q, label) ||
        fuzzyMatch(q, tz) ||
        label.toLowerCase().includes(q) ||
        tz.toLowerCase().includes(q)
      );
    }).map(t => t.tz);

    setTargetTZs(filtered);
  };

  const tzLabel = (tz: string) => TIMEZONES.find((t) => t.tz === tz)?.label ?? tz;

  return (
    <Container>
      <Panel>
        <Container cols={5}>
          <Box colSpan={2}>
            <Select
              label="Source"
              value={sourceTZ}
              onValueChange={v => handleSourceTZChange(v)}
            >
              <SelectTrigger>
                {TIMEZONES.find(t => t.tz === sourceTZ)?.label ?? sourceTZ}
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.tz} value={tz.tz}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Box>
          <Box colSpan={2}>
            <DateInput
              label="Date & Time"
              inputType="datetime-local"
              onClick={() => setLiveMode(false)}
              value={liveMode ? toDatetimeLocal(now, sourceTZ) : sourceInput}
              onChange={(e) => handleSourceInput(e.target.value)}
              readOnly={liveMode}
            />
          </Box>

          <Box colSpan={1}>
            <div className="min-h-0 md:min-h-4" aria-hidden></div>
            <Button
              onClick={() => { setLiveMode((v) => !v) }}
              variant={"ghost"}
              icon={liveMode ? Pause : Clock}
              className="w-full"
            >
              {liveMode ? "Stop Live" : "Start Live"}
            </Button>
          </Box>
        </Container>
      </Panel>
      <Panel>
        <Input
          leadingIcon={Search}
          value={filter}
          placeholder="Search cities or timezones..."
          onChange={(e) => handleFilterChange(e.target.value)}
        />
        <Container cols={2}>
          {/* Map all the time zones to statboxes */}
          {targetTZs.map((tz) => {
            const info = formatInTZ(sourceDate, tz);
            const rel = getRelativeTZDiff(sourceDate, sourceTZ, tz);
            const label = `${info.date} · ${info.abbr} · ${info.offset} · ${rel}`
            return (
              <StatBox
                key={tz}
                prefix={tzLabel(tz)}
                value={info.time}
                label={label}
              />
            )
          })}
        </Container>
      </Panel>
    </Container>
  );
}