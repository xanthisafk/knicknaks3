import { Panel } from "@/components/layout";
import { Container } from "@/components/layout/Primitive";
import { Input } from "@/components/ui";
import StatBox from "@/components/ui/StatBox";
import { detectUserTimezone, formatInTZ, TIMEZONES } from "@/lib/timeHelpers";
import { Search } from "lucide-react";
import { useState, useMemo, useEffect } from "react";


export default function WorldClockTool() {
  const userTZ = useMemo(detectUserTimezone, []);
  const [now, setNow] = useState(new Date());
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const filteredTZs = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return TIMEZONES;
    return TIMEZONES.filter(
      (t) => t.label.toLowerCase().includes(q) || t.tz.toLowerCase().includes(q)
    );
  }, [filter]);

  const localInfo = formatInTZ(now, userTZ);

  return (
    <Container>
      {/* Primary Local Clock */}
      <StatBox
        prefix="Local Time (System)"
        value={localInfo.time}
        label={`${localInfo.abbr} • ${localInfo.offset}`}
        textSize="6xl"
      />
      <Panel>
        <Input
          placeholder="Search cities or timezones..."
          leadingIcon={Search}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1"
        />

        <Container cols={2} gap={4}>
          {filteredTZs.map((tz) => {
            const info = formatInTZ(now, tz.tz);
            if (tz.tz === userTZ) return null;

            return (
              <StatBox
                key={tz.tz}
                prefix={tz.label}
                value={info.time}
                label={`${info.abbr} • ${info.offset}`}
              />
            );
          })}
        </Container>
      </Panel>
    </Container>
  );
}