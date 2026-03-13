import { useState, useMemo } from "react";
import { Panel } from "@/components/layout";

const DISTANCES: Record<string, number> = {
  m: 1,
  km: 1000,
  mi: 1609.344,
  "5k": 5000,
  "10k": 10000,
  "half-marathon": 21097.5,
  marathon: 42195,
};

export default function PaceCalculatorTool() {
  const [calculateMode, setCalculateMode] = useState<"pace" | "time" | "distance">("pace");

  // Time
  const [timeHrs, setTimeHrs] = useState("0");
  const [timeMins, setTimeMins] = useState("30");
  const [timeSecs, setTimeSecs] = useState("0");

  // Distance
  const [distValue, setDistValue] = useState("5");
  const [distUnit, setDistUnit] = useState("km");

  // Pace
  const [paceMins, setPaceMins] = useState("6");
  const [paceSecs, setPaceSecs] = useState("0");
  const [paceUnit, setPaceUnit] = useState("km"); // "per km" or "per mi"

  const result = useMemo(() => {
    const parseNum = (val: string) => parseFloat(val) || 0;

    let timeSecsTotal = parseNum(timeHrs) * 3600 + parseNum(timeMins) * 60 + parseNum(timeSecs);
    let paceSecsTotal = parseNum(paceMins) * 60 + parseNum(paceSecs);

    let distanceMeters = 0;
    if (distUnit in DISTANCES) {
      if (distUnit === "m" || distUnit === "km" || distUnit === "mi") {
        distanceMeters = parseNum(distValue) * DISTANCES[distUnit];
      } else {
        distanceMeters = DISTANCES[distUnit]; // predefined
      }
    }

    if (calculateMode === "pace") {
      if (timeSecsTotal <= 0 || distanceMeters <= 0) return null;
      let paceDistMultiplier = paceUnit === "km" ? 1000 : 1609.344;
      let newPaceSecsTotal = (timeSecsTotal / distanceMeters) * paceDistMultiplier;

      let pM = Math.floor(newPaceSecsTotal / 60);
      let pS = Math.floor(newPaceSecsTotal % 60);
      return { type: "pace", label: "Pace", value: `${pM}:${pS.toString().padStart(2, "0")} / ${paceUnit}` };
    }
    else if (calculateMode === "time") {
      if (paceSecsTotal <= 0 || distanceMeters <= 0) return null;
      let paceDistMultiplier = paceUnit === "km" ? 1000 : 1609.344;

      // seconds per meter
      let secPerMeter = paceSecsTotal / paceDistMultiplier;
      let newTimeSecsTotal = Math.round(secPerMeter * distanceMeters);

      let tH = Math.floor(newTimeSecsTotal / 3600);
      let tM = Math.floor((newTimeSecsTotal % 3600) / 60);
      let tS = newTimeSecsTotal % 60;

      let str = tH > 0 ? `${tH}:${tM.toString().padStart(2, "0")}:${tS.toString().padStart(2, "0")}` : `${tM}:${tS.toString().padStart(2, "0")}`;
      return { type: "time", label: "Time", value: str };
    }
    else if (calculateMode === "distance") {
      if (paceSecsTotal <= 0 || timeSecsTotal <= 0) return null;
      let paceDistMultiplier = paceUnit === "km" ? 1000 : 1609.344;

      let secPerMeter = paceSecsTotal / paceDistMultiplier;
      let newDistMeters = Math.round(timeSecsTotal / secPerMeter);

      let newDistVal = 0;
      let newDistLabel = distUnit;

      if (distUnit === "km") { newDistVal = newDistMeters / 1000; }
      else if (distUnit === "mi") { newDistVal = newDistMeters / 1609.344; }
      else if (distUnit === "m") { newDistVal = newDistMeters; }
      else {
        // fallback generic generic
        newDistVal = newDistMeters / 1000;
        newDistLabel = "km";
      }

      return { type: "distance", label: "Distance", value: `${newDistVal.toFixed(2)} ${newDistLabel}` };
    }

    return null;
  }, [calculateMode, timeHrs, timeMins, timeSecs, distValue, distUnit, paceMins, paceSecs, paceUnit]);

  return (
    <div className="space-y-2">
      <Panel>
        <div className="flex justify-center mb-6">
          <div className="flex bg-(--surface-secondary) rounded-xl p-1 border border-(--border-default)">
            <button
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${calculateMode === "pace" ? "bg-(--surface-elevated) text-(--text-primary) shadow-sm" : "text-(--text-secondary) hover:text-(--text-primary)"
                }`}
              onClick={() => setCalculateMode("pace")}
            >
              Calculate Pace
            </button>
            <button
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${calculateMode === "time" ? "bg-(--surface-elevated) text-(--text-primary) shadow-sm" : "text-(--text-secondary) hover:text-(--text-primary)"
                }`}
              onClick={() => setCalculateMode("time")}
            >
              Calculate Time
            </button>
            <button
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${calculateMode === "distance" ? "bg-(--surface-elevated) text-(--text-primary) shadow-sm" : "text-(--text-secondary) hover:text-(--text-primary)"
                }`}
              onClick={() => setCalculateMode("distance")}
            >
              Calculate Distance
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {calculateMode !== "time" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-(--text-primary)">Time</label>
              <div className="flex items-center gap-2">
                <input type="number" value={timeHrs} onChange={(e) => setTimeHrs(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-default)] text-(--text-primary)" placeholder="hr" min="0" />
                <span className="text-xs text-(--text-secondary)">h</span>

                <input type="number" value={timeMins} onChange={(e) => setTimeMins(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-default)] text-(--text-primary)" placeholder="min" min="0" max="59" />
                <span className="text-xs text-(--text-secondary)">m</span>

                <input type="number" value={timeSecs} onChange={(e) => setTimeSecs(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-default)] text-(--text-primary)" placeholder="sec" min="0" max="59" />
                <span className="text-xs text-(--text-secondary)">s</span>
              </div>
            </div>
          )}

          {calculateMode !== "distance" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-(--text-primary)">Distance</label>
              <div className="flex items-center gap-2">
                {["km", "mi", "m"].includes(distUnit) && (
                  <input type="number" value={distValue} onChange={(e) => setDistValue(e.target.value)} className="flex-1 px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-default)] text-(--text-primary)" placeholder="Distance" min="0" step="0.01" />
                )}
                <select value={distUnit} onChange={(e) => setDistUnit(e.target.value)} className="flex-1 px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-default)] text-(--text-primary)">
                  <option value="km">Kilometers (km)</option>
                  <option value="mi">Miles (mi)</option>
                  <option value="m">Meters (m)</option>
                  <option value="5k">5K</option>
                  <option value="10k">10K</option>
                  <option value="half-marathon">Half Marathon</option>
                  <option value="marathon">Marathon</option>
                </select>
              </div>
            </div>
          )}

          {calculateMode !== "pace" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-(--text-primary)">Pace</label>
              <div className="flex items-center gap-2">
                <input type="number" value={paceMins} onChange={(e) => setPaceMins(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-default)] text-(--text-primary)" placeholder="min" min="0" />
                <span className="text-xs text-(--text-secondary)">m</span>
                <input type="number" value={paceSecs} onChange={(e) => setPaceSecs(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-default)] text-(--text-primary)" placeholder="sec" min="0" max="59" />
                <span className="text-xs text-(--text-secondary)">s</span>
                <span className="text-sm font-medium px-2 text-(--text-primary)">per</span>
                <select value={paceUnit} onChange={(e) => setPaceUnit(e.target.value as "km" | `mi`)} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-default)] text-(--text-primary)">
                  <option value="km">km</option>
                  <option value="mi">mi</option>
                </select>
              </div>
            </div>
          )}

          {calculateMode === "pace" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-(--text-primary)">Pace Format</label>
              <select value={paceUnit} onChange={(e) => setPaceUnit(e.target.value as "km" | `mi`)} className="w-full md:w-1/2 px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-default)] text-(--text-primary)">
                <option value="km">Minutes per km</option>
                <option value="mi">Minutes per mile</option>
              </select>
            </div>
          )}
        </div>
      </Panel>

      {result && (
        <Panel>
          <div className="text-center py-6 space-y-4">
            <h3 className="text-sm font-medium text-(--text-secondary)">Your Calculated {result.label}</h3>
            <div className="text-5xl font-bold text-primary-500">
              {result.value}
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}
