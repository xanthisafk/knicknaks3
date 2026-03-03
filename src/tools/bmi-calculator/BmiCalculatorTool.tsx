import { useState, useMemo } from "react";
import { Panel } from "@/components/layout";

export default function BmiCalculatorTool() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  
  const [cm, setCm] = useState("170");
  const [kg, setKg] = useState("70");
  
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("7");
  const [lbs, setLbs] = useState("154");

  const result = useMemo(() => {
    let bmiValue = 0;
    
    if (unit === "metric") {
      const h = parseFloat(cm) / 100;
      const w = parseFloat(kg);
      if (h > 0 && w > 0) {
        bmiValue = w / (h * h);
      }
    } else {
      const h = parseFloat(feet) * 12 + parseFloat(inches || "0");
      const w = parseFloat(lbs);
      if (h > 0 && w > 0) {
        bmiValue = (703 * w) / (h * h);
      }
    }

    if (!bmiValue || isNaN(bmiValue)) return null;

    let category = "";
    let color = "";
    
    if (bmiValue < 18.5) {
      category = "Underweight";
      color = "var(--color-blue-500)";
    } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
      category = "Normal weight";
      color = "var(--color-green-500)";
    } else if (bmiValue >= 25 && bmiValue < 29.9) {
      category = "Overweight";
      color = "var(--color-yellow-500)";
    } else {
      category = "Obesity";
      color = "var(--color-red-500)";
    }

    return { value: bmiValue.toFixed(1), category, color };
  }, [unit, cm, kg, feet, inches, lbs]);

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
            <label className="block text-sm font-medium text-(--text-primary) mb-1">Height</label>
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
                  value={feet}
                  onChange={(e) => setFeet(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-(--surface-elevated) border border-(--border-default) text-(--text-primary)"
                  placeholder="ft"
                  min="0"
                />
                <span className="text-sm text-(--text-secondary)">ft</span>
                <input
                  type="number"
                  value={inches}
                  onChange={(e) => setInches(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-(--surface-elevated) border border-(--border-default) text-(--text-primary)"
                  placeholder="in"
                  min="0"
                  max="11"
                />
                <span className="text-sm text-(--text-secondary)">in</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-(--text-primary) mb-1">Weight</label>
            {unit === "metric" ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={kg}
                  onChange={(e) => setKg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-(--surface-elevated) border border-(--border-default) text-(--text-primary)"
                  placeholder="kg"
                  min="0"
                />
                <span className="text-sm text-(--text-secondary)">kg</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={lbs}
                  onChange={(e) => setLbs(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-(--surface-elevated) border border-(--border-default) text-(--text-primary)"
                  placeholder="lbs"
                  min="0"
                />
                <span className="text-sm text-(--text-secondary)">lbs</span>
              </div>
            )}
          </div>
        </div>
      </Panel>

      {result && (
        <Panel>
          <div className="text-center py-6 space-y-4">
            <h3 className="text-sm font-medium text-(--text-secondary)">Your BMI</h3>
            <div className="text-5xl font-bold" style={{ color: result.color }}>
              {result.value}
            </div>
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: `${result.color}20`, color: result.color }}>
              {result.category}
            </div>
          </div>
          <div className="mt-6 border-t border-(--border-default) pt-4">
            <div className="text-xs text-(--text-secondary) space-y-2">
              <div className="flex justify-between"><span>Less than 18.5</span> <span>Underweight</span></div>
              <div className="flex justify-between"><span>18.5 - 24.9</span> <span>Normal weight</span></div>
              <div className="flex justify-between"><span>25 - 29.9</span> <span>Overweight</span></div>
              <div className="flex justify-between"><span>30 or greater</span> <span>Obesity</span></div>
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}
