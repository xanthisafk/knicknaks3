import { useState, useMemo } from "react";
import { Panel } from "@/components/layout";

export default function BodyFatCalculatorTool() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("30");
  
  const [cm, setCm] = useState("170");
  const [neckCm, setNeckCm] = useState("40");
  const [waistCm, setWaistCm] = useState("90");
  const [hipCm, setHipCm] = useState("105");

  const [inches, setInches] = useState("67");
  const [neckInches, setNeckInches] = useState("15.5");
  const [waistInches, setWaistInches] = useState("35");
  const [hipInches, setHipInches] = useState("40");

  const result = useMemo(() => {
    let hCm = 0;
    let nCm = 0;
    let wCm = 0;
    let hipC = 0;

    if (unit === "metric") {
      hCm = parseFloat(cm);
      nCm = parseFloat(neckCm);
      wCm = parseFloat(waistCm);
      hipC = parseFloat(hipCm);
    } else {
      hCm = parseFloat(inches) * 2.54;
      nCm = parseFloat(neckInches) * 2.54;
      wCm = parseFloat(waistInches) * 2.54;
      hipC = parseFloat(hipInches) * 2.54;
    }

    if (!hCm || !nCm || !wCm || isNaN(hCm) || isNaN(nCm) || isNaN(wCm)) return null;
    if (gender === "female" && (!hipC || isNaN(hipC))) return null;

    let bodyFat = 0;
    if (gender === "male") {
      // 495 / ( 1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height) ) - 450
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(wCm - nCm) + 0.15456 * Math.log10(hCm)) - 450;
    } else {
      // 495 / ( 1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height) ) - 450
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(wCm + hipC - nCm) + 0.22100 * Math.log10(hCm)) - 450;
    }

    if (isNaN(bodyFat) || !isFinite(bodyFat) || bodyFat < 0 || bodyFat > 100) return null;

    let category = "";
    let color = "";

    const a = parseInt(age) || 30;

    // VERY rough approximation for categories based on ACE charts
    if (gender === "male") {
      if (bodyFat < 6) { category = "Essential fat"; color = "var(--color-blue-500)"; }
      else if (bodyFat < 14) { category = "Athletes"; color = "var(--color-purple-500)"; }
      else if (bodyFat < 18) { category = "Fitness"; color = "var(--color-green-500)"; }
      else if (bodyFat < 25) { category = "Average"; color = "var(--color-yellow-500)"; }
      else { category = "Obese"; color = "var(--color-red-500)"; }
    } else {
      if (bodyFat < 14) { category = "Essential fat"; color = "var(--color-blue-500)"; }
      else if (bodyFat < 21) { category = "Athletes"; color = "var(--color-purple-500)"; }
      else if (bodyFat < 25) { category = "Fitness"; color = "var(--color-green-500)"; }
      else if (bodyFat < 32) { category = "Average"; color = "var(--color-yellow-500)"; }
      else { category = "Obese"; color = "var(--color-red-500)"; }
    }

    return { value: bodyFat.toFixed(1), category, color };
  }, [unit, gender, age, cm, neckCm, waistCm, hipCm, inches, neckInches, waistInches, hipInches]);

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex justify-center mb-6">
          <div className="flex bg-(--surface-secondary) rounded-xl p-1 border border-(--border-default)">
            <button
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                unit === "metric"
                  ? "bg-(--surface-elevated) text-(--text-primary) shadow-sm"
                  : "text-(--text-secondary) hover:text-(--text-primary)"
              }`}
              onClick={() => setUnit("metric")}
            >
              Metric
            </button>
            <button
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                unit === "imperial"
                  ? "bg-(--surface-elevated) text-(--text-primary) shadow-sm"
                  : "text-(--text-secondary) hover:text-(--text-primary)"
              }`}
              onClick={() => setUnit("imperial")}
            >
              US/Imperial
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-(--text-primary) mb-1">Gender</label>
            <div className="flex bg-(--surface-elevated) rounded-xl p-1 border border-(--border-default)">
              <button
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  gender === "male"
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-(--text-secondary) hover:text-(--text-primary)"
                }`}
                onClick={() => setGender("male")}
              >
                Male
              </button>
              <button
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  gender === "female"
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-(--text-secondary) hover:text-(--text-primary)"
                }`}
                onClick={() => setGender("female")}
              >
                Female
              </button>
            </div>
            
            <label className="block text-sm font-medium text(--text-primary) mb-1">Age</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-(--surface-elevated) border border-(--border-default) text-(--text-primary)"
                placeholder="years"
                min="1"
                max="120"
              />
              <span className="text-sm text-(--text-secondary)">years</span>
            </div>
            
            <label className="block text-sm font-medium text(--text-primary) mb-1">Height</label>
            {unit === "metric" ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={cm}
                  onChange={(e) => setCm(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-(--surface-elevated) border border-(--border-default) text-(--text-primary)"
                  placeholder="cm"
                  min="0"
                />
                <span className="text-sm text-(--text-secondary)">cm</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={inches}
                  onChange={(e) => setInches(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-(--surface-elevated) border border-(--border-default) text-(--text-primary)"
                  placeholder="in"
                  min="0"
                />
                <span className="text-sm text-(--text-secondary)">in</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text(--text-primary) mb-1">Neck Circumference</label>
            {unit === "metric" ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={neckCm}
                  onChange={(e) => setNeckCm(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-(--surface-elevated) border border-(--border-default) text-(--text-primary)"
                  placeholder="cm"
                  min="0"
                />
                <span className="text-sm text-(--text-secondary)">cm</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={neckInches}
                  onChange={(e) => setNeckInches(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-(--surface-elevated) border border-(--border-default) text-(--text-primary)"
                  placeholder="in"
                  min="0"
                />
                <span className="text-sm text-(--text-secondary)">in</span>
              </div>
            )}

            <label className="block text-sm font-medium text(--text-primary) mb-1">Waist Circumference</label>
            {unit === "metric" ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={waistCm}
                  onChange={(e) => setWaistCm(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-(--surface-elevated) border border-(--border-default) text-(--text-primary)"
                  placeholder="cm"
                  min="0"
                />
                <span className="text-sm text-(--text-secondary)">cm</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={waistInches}
                  onChange={(e) => setWaistInches(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-(--surface-elevated) border border-(--border-default) text-(--text-primary)"
                  placeholder="in"
                  min="0"
                />
                <span className="text-sm text-(--text-secondary)">in</span>
              </div>
            )}

            {gender === "female" && (
              <>
                <label className="block text-sm font-medium text(--text-primary) mb-1">Hip Circumference</label>
                {unit === "metric" ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={hipCm}
                      onChange={(e) => setHipCm(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-(--surface-elevated) border border-(--border-default) text-(--text-primary)"
                      placeholder="cm"
                      min="0"
                    />
                    <span className="text-sm text-(--text-secondary)">cm</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={hipInches}
                      onChange={(e) => setHipInches(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-(--surface-elevated) border border-(--border-default) text-(--text-primary)"
                      placeholder="in"
                      min="0"
                    />
                    <span className="text-sm text-(--text-secondary)">in</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Panel>

      {result && (
        <Panel>
          <div className="text-center py-6 space-y-4">
            <h3 className="text-sm font-medium text-(--text-secondary)">Your Estimated Body Fat</h3>
            <div className="text-5xl font-bold" style={{ color: result.color }}>
              {result.value}%
            </div>
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: `${result.color}20`, color: result.color }}>
              {result.category}
            </div>
          </div>
          <p className="text-xs text-(--text-tertiary) text-center max-w-lg mx-auto mt-4 px-4 bg-(--surface-secondary) p-3 rounded-lg border border-(--border-default)">
            This estimation uses the U.S. Navy Method based on anatomical circumferences. It is a widely used and mostly accurate measurement, though no estimation method is 100% precise without clinical tools like a DEXA scan.
          </p>
        </Panel>
      )}
    </div>
  );
}
