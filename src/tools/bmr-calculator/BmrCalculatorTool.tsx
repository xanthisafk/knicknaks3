import { useState, useMemo } from "react";
import { Panel } from "@/components/layout";

export default function BmrCalculatorTool() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("30");
  
  const [cm, setCm] = useState("170");
  const [kg, setKg] = useState("70");
  
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("7");
  const [lbs, setLbs] = useState("154");

  const bmr = useMemo(() => {
    let weightKg = 0;
    let heightCm = 0;
    const ageVal = parseInt(age);

    if (!ageVal || isNaN(ageVal)) return null;

    if (unit === "metric") {
      weightKg = parseFloat(kg);
      heightCm = parseFloat(cm);
    } else {
      weightKg = parseFloat(lbs) * 0.453592;
      heightCm = (parseFloat(feet) * 12 + parseFloat(inches || "0")) * 2.54;
    }

    if (!weightKg || !heightCm || isNaN(weightKg) || isNaN(heightCm)) return null;

    // Mifflin-St Jeor Equation
    let bmrValue = (10 * weightKg) + (6.25 * heightCm) - (5 * ageVal);
    
    if (gender === "male") {
      bmrValue += 5;
    } else {
      bmrValue -= 161;
    }

    return Math.round(bmrValue);
  }, [unit, gender, age, cm, kg, feet, inches, lbs]);

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
            
            <label className="block text-sm font-medium text-(--text-primary) mb-1">Age</label>
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
          </div>

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

      {bmr !== null && (
        <Panel>
          <div className="text-center py-6 space-y-4">
            <h3 className="text-sm font-medium text-(--text-secondary)">Your BMR</h3>
            <div className="text-5xl font-bold text-primary-500">
              {bmr.toLocaleString()}
            </div>
            <div className="text-sm text-(--text-secondary)">
              Calories / day
            </div>
          </div>
          <p className="text-xs text-(--text-tertiary) text-center max-w-lg mx-auto mt-4 px-4 bg-(--surface-secondary) p-3 rounded-lg border border-(--border-default)">
            Your Basal Metabolic Rate (BMR) is the amount of energy expended while at complete rest. It's the number of calories you'd burn if you stayed in bed all day doing absolutely nothing.
          </p>
        </Panel>
      )}
    </div>
  );
}
