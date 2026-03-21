import { useState, useMemo } from "react";
import { Panel } from "@/components/layout";
import { Tab, TabList, Tabs } from "@/components/ui/tab";
import { Input } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import StatBox from "@/components/ui/StatBox";

const DISTANCES: Record<string, number> = {
  m: 1,
  km: 1000,
  mi: 1609.344,
  "5k": 5000,
  "10k": 10000,
  "half-marathon": 21097.5,
  marathon: 42195,
};

const DISTANCE_OPTIONS = [
  { value: "m", label: "Meters" },
  { value: "km", label: "Kilometers" },
  { value: "mi", label: "Miles" },
  { value: "5k", label: "5K" },
  { value: "10k", label: "10K" },
  { value: "half-marathon", label: "Half Marathon" },
  { value: "marathon", label: "Marathon" },
];

const PACE_OPTIONS = [
  { value: "km", label: "Kilometer" },
  { value: "mi", label: "Mile" },
];

type Mode = "pace" | "time" | "distance";

const toNum = (val: string) => parseFloat(val) || 0;

function formatTime(totalSecs: number): string {
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

function getDistanceMeters(distValue: string, distUnit: string): number {
  const fixed = ["5k", "10k", "half-marathon", "marathon"];
  return fixed.includes(distUnit)
    ? DISTANCES[distUnit]
    : toNum(distValue) * (DISTANCES[distUnit] ?? 1);
}

export default function PaceCalculatorTool() {
  const [mode, setMode] = useState<Mode>("pace");

  const [timeHrs, setTimeHrs] = useState("0");
  const [timeMins, setTimeMins] = useState("30");
  const [timeSecs, setTimeSecs] = useState("0");

  const [distValue, setDistValue] = useState("5");
  const [distUnit, setDistUnit] = useState("km");

  const [paceMins, setPaceMins] = useState("6");
  const [paceSecs, setPaceSecs] = useState("0");
  const [paceUnit, setPaceUnit] = useState("km");

  const result = useMemo(() => {
    const timeTotalSecs = toNum(timeHrs) * 3600 + toNum(timeMins) * 60 + toNum(timeSecs);
    const paceTotalSecs = toNum(paceMins) * 60 + toNum(paceSecs);
    const distMeters = getDistanceMeters(distValue, distUnit);
    const paceMultiplier = paceUnit === "km" ? 1000 : 1609.344;

    if (mode === "pace") {
      if (timeTotalSecs <= 0 || distMeters <= 0) return null;
      const paceSec = (timeTotalSecs / distMeters) * paceMultiplier;
      let pM = Math.floor(paceSec / 60);
      let pS = Math.round(paceSec % 60);
      if (pS === 60) {
        pS = 0;
        pM++;
      }
      return { label: "Pace", value: `${pM}:${String(pS).padStart(2, "0")} / ${paceUnit}` };
    }

    if (mode === "time") {
      if (paceTotalSecs <= 0 || distMeters <= 0) return null;
      const totalSecs = Math.round((paceTotalSecs / paceMultiplier) * distMeters);
      return { label: "Time", value: formatTime(totalSecs) };
    }

    if (mode === "distance") {
      if (paceTotalSecs <= 0 || timeTotalSecs <= 0) return null;
      const meters = (timeTotalSecs / paceTotalSecs) * paceMultiplier;
      const resolvedUnit = ["5k", "10k", "half-marathon", "marathon"].includes(distUnit) ? "km" : distUnit;
      const divisor = resolvedUnit === "km" ? 1000 : resolvedUnit === "mi" ? 1609.344 : 1;
      return { label: "Distance", value: `${(meters / divisor).toFixed(2)} ${resolvedUnit}` };
    }

    return null;
  }, [mode, timeHrs, timeMins, timeSecs, distValue, distUnit, paceMins, paceSecs, paceUnit]);

  const paceUnitSelect = (
    <Select label="Pace Unit" value={paceUnit} onValueChange={setPaceUnit}>
      <SelectTrigger>{PACE_OPTIONS.find((o) => o.value === paceUnit)?.label}</SelectTrigger>
      <SelectContent>
        {PACE_OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="space-y-2">
      <Panel className="space-y-3">
        <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
          <TabList>
            <Tab value="pace">Calculate Pace</Tab>
            <Tab value="time">Calculate Time</Tab>
            <Tab value="distance">Calculate Distance</Tab>
          </TabList>
        </Tabs>

        <div className="space-y-3">
          {mode !== "time" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input type="number" label="Time (Hours)" value={timeHrs} trailingText="hr" onChange={(e) => setTimeHrs(e.target.value)} className="flex-1" />
              <Input type="number" label="Time (Minutes)" value={timeMins} trailingText="min" onChange={(e) => setTimeMins(e.target.value)} className="flex-1" />
              <Input type="number" label="Time (Seconds)" value={timeSecs} trailingText="sec" onChange={(e) => setTimeSecs(e.target.value)} className="flex-1" />
            </div>
          )}

          {mode !== "distance" && (
            <Select label="Distance" value={distUnit} onValueChange={setDistUnit}>
              <SelectTrigger>{DISTANCE_OPTIONS.find((o) => o.value === distUnit)?.label}</SelectTrigger>
              <SelectContent>
                {DISTANCE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {mode !== "pace" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input type="number" label="Pace (Minutes)" value={paceMins} trailingText="mins" onChange={(e) => setPaceMins(e.target.value)} className="flex-1" />
              <Input type="number" label="Pace (Seconds)" value={paceSecs} trailingText="secs" onChange={(e) => setPaceSecs(e.target.value)} className="flex-1" />
              {paceUnitSelect}
            </div>
          )}

          {mode === "pace" && paceUnitSelect}
        </div>
      </Panel>

      {result && (
        <StatBox label={`Your Calculated ${result.label}`} textSize="6xl" value={result.value} />
      )}
    </div>
  );
}