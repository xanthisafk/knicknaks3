import { useState, useMemo } from "react";
import { Panel } from "@/components/layout";

export default function IdealWeightCalculatorTool() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [gender, setGender] = useState<"male" | "female">("male");

  const [cm, setCm] = useState("170");
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("7");

  const results = useMemo(() => {
    let hCm = 0;

    if (unit === "metric") {
      hCm = parseFloat(cm);
    } else {
      hCm = (parseFloat(feet) * 12 + parseFloat(inches || "0")) * 2.54;
    }

    if (!hCm || isNaN(hCm) || hCm <= 0) return null;

    // WHO BMI Ideal Range (18.5 - 24.9)
    const hMeters = hCm / 100;
    const minWeightKg = 18.5 * (hMeters * hMeters);
    const maxWeightKg = 24.9 * (hMeters * hMeters);

    const formatWeight = (kg: number) => {
      if (unit === "metric") return `${Math.round(kg)} kg`;
      return `${Math.round(kg * 2.20462)} lbs`;
    };

    const inchesOver5Ft = (hCm / 2.54) - 60;

    // Robinson Formula
    let robinsonKg = 0;
    if (inchesOver5Ft > 0) {
      if (gender === "male") {
        robinsonKg = 52 + 1.9 * inchesOver5Ft;
      } else {
        robinsonKg = 49 + 1.7 * inchesOver5Ft;
      }
    } else {
      robinsonKg = gender === "male" ? 52 : 49;
    }

    return {
      bmiRange: `${formatWeight(minWeightKg)} - ${formatWeight(maxWeightKg)}`,
      robinson: formatWeight(robinsonKg),
    };
  }, [unit, gender, cm, feet, inches]);

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex justify-center mb-6">
          <div className="flex bg-(--surface-secondary) rounded-xl p-1 border border-(--border-default)">
            <button
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${unit === "metric"
                ? "bg-(--surface-elevated) text(--text-primary) shadow-sm"
                : "text(--text-secondary) hover:text(--text-primary)"
                }`}
              onClick={() => setUnit("metric")}
            >
              Metric
            </button>
            <button
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${unit === "imperial"
                ? "bg-(--surface-elevated) text(--text-primary) shadow-sm"
                : "text(--text-secondary) hover:text(--text-primary)"
                }`}
              onClick={() => setUnit("imperial")}
            >
              US/Imperial
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <label className="block text-sm font-medium text(--text-primary) mb-1">Gender</label>
            <div className="flex bg-(--surface-elevated) rounded-xl p-1 border border-(--border-default)">
              <button
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${gender === "male"
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text(--text-secondary) hover:text(--text-primary)"
                  }`}
                onClick={() => setGender("male")}
              >
                Male
              </button>
              <button
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${gender === "female"
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text(--text-secondary) hover:text(--text-primary)"
                  }`}
                onClick={() => setGender("female")}
              >
                Female
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text(--text-primary) mb-1">Height</label>
            {unit === "metric" ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={cm}
                  onChange={(e) => setCm(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-(--surface-elevated) border border-(--border-default) text(--text-primary)"
                  placeholder="cm"
                  min="0"
                />
                <span className="text-sm text(--text-secondary)">cm</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={feet}
                  onChange={(e) => setFeet(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-(--surface-elevated) border border-(--border-default) text(--text-primary)"
                  placeholder="ft"
                  min="0"
                />
                <span className="text-sm text(--text-secondary)">ft</span>
                <input
                  type="number"
                  value={inches}
                  onChange={(e) => setInches(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-(--surface-elevated) border border-(--border-default) text(--text-primary)"
                  placeholder="in"
                  min="0"
                  max="11"
                />
                <span className="text-sm text(--text-secondary)">in</span>
              </div>
            )}
          </div>
        </div>
      </Panel>

      {results && (
        <Panel>
          <div className="text-center py-6 space-y-4">
            <h3 className="text-sm font-medium text(--text-secondary)">Healthy BMI Weight Range</h3>
            <div className="text-4xl font-bold text-green-500">
              {results.bmiRange}
            </div>
            <p className="text-xs text-(--text-tertiary) py-2">
              Based on the WHO healthy BMI range of 18.5 - 24.9
            </p>
          </div>

          <div className="mt-6 border-t border-(--border-default) pt-6">
            <h3 className="text-sm font-medium text(--text-secondary) text-center mb-4">Specific Formula Result</h3>
            <div className="flex justify-center items-center">
              <div className="flex justify-between items-center w-full max-w-sm p-3 rounded-lg bg-(--surface-secondary) border border-(--border-default)">
                <span className="text-sm font-semibold text(--text-primary)">Robinson Formula (1983)</span>
                <span className="text-lg font-bold tabular-nums text-primary-500">{results.robinson}</span>
              </div>
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}
