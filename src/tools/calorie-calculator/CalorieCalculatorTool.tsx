import { useState, useMemo } from "react";
import { Panel } from "@/components/layout";

export default function CalorieCalculatorTool() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("30");

  const [cm, setCm] = useState("170");
  const [kg, setKg] = useState("70");

  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("7");
  const [lbs, setLbs] = useState("154");

  const [activity, setActivity] = useState("1.55");

  const results = useMemo(() => {
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

    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * ageVal);

    if (gender === "male") {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const tdee = bmr * parseFloat(activity);

    return {
      maintain: Math.round(tdee),
      mildLoss: Math.round(tdee - 250),
      loss: Math.round(tdee - 500),
      extremeLoss: Math.round(tdee - 1000),
      mildGain: Math.round(tdee + 250),
      gain: Math.round(tdee + 500),
      extremeGain: Math.round(tdee + 1000),
    };
  }, [unit, gender, age, cm, kg, feet, inches, lbs, activity]);

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex justify-center mb-6">
          <div className="flex bg-(--surface-secondary) rounded-xl p-1 border border-(--border-default)">
            <button
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${unit === "metric"
                  ? "bg-(--surface-elevated) text-(--text-primary) shadow-sm"
                  : "text-(--text-secondary) hover:text-(--text-primary)"
                }`}
              onClick={() => setUnit("metric")}
            >
              Metric
            </button>
            <button
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${unit === "imperial"
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
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${gender === "male"
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-(--text-secondary) hover:text-(--text-primary)"
                  }`}
                onClick={() => setGender("male")}
              >
                Male
              </button>
              <button
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${gender === "female"
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

            <label className="block text-sm font-medium text(--text-primary) mb-1">Activity Level</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-(--surface-elevated) border border-(--border-default) text-(--text-primary)"
            >
              <option value="1.2">Sedentary (little/no exercise)</option>
              <option value="1.375">Lightly active (1-3 days/week)</option>
              <option value="1.55">Moderately active (3-5 days/week)</option>
              <option value="1.725">Very active (6-7 days/week)</option>
              <option value="1.9">Extra active (physical job/2x day)</option>
            </select>
          </div>

          <div className="space-y-4">
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

            <label className="block text-sm font-medium text(--text-primary) mb-1">Weight</label>
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

      {results && (
        <div className="space-y-4">
          <Panel>
            <div className="text-center py-4">
              <h3 className="text-sm font-medium text-(--text-secondary)">Maintain Weight</h3>
              <div className="text-4xl font-bold text-primary-500 mt-2">
                {results.maintain.toLocaleString()} <span className="text-lg font-normal text-(--text-tertiary) ml-1">kcal/day</span>
              </div>
              <p className="text-xs text-(--text-tertiary) mt-2 max-w-sm mx-auto">
                Calories needed to maintain your current body weight.
              </p>
            </div>
          </Panel>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Panel>
              <h4 className="text-sm font-bold text-(--text-primary) mb-4 text-center">Weight Loss</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-(--surface-secondary) border border-(--border-default)">
                  <div className="text-sm flex flex-col">
                    <span className="font-semibold text-green-500">Mild Loss</span>
                    <span className="text-xs text-(--text-tertiary)">~0.25 kg / week</span>
                  </div>
                  <div className="text-lg font-bold tabular-nums">{results.mildLoss.toLocaleString()}</div>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-(--surface-secondary) border border-(--border-default)">
                  <div className="text-sm flex flex-col">
                    <span className="font-semibold text-green-500">Weight Loss</span>
                    <span className="text-xs text-(--text-tertiary)">~0.5 kg / week</span>
                  </div>
                  <div className="text-lg font-bold tabular-nums">{results.loss.toLocaleString()}</div>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-(--surface-secondary) border border-(--border-default)">
                  <div className="text-sm flex flex-col">
                    <span className="font-semibold text-yellow-500">Extreme Loss</span>
                    <span className="text-xs text-(--text-tertiary)">~1 kg / week</span>
                  </div>
                  <div className="text-lg font-bold tabular-nums">{results.extremeLoss.toLocaleString()}</div>
                </div>
              </div>
            </Panel>

            <Panel>
              <h4 className="text-sm font-bold text-(--text-primary) mb-4 text-center">Weight Gain</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-(--surface-secondary) border border-(--border-default)">
                  <div className="text-sm flex flex-col">
                    <span className="font-semibold text-red-500">Mild Gain</span>
                    <span className="text-xs text-(--text-tertiary)">~0.25 kg / week</span>
                  </div>
                  <div className="text-lg font-bold tabular-nums">{results.mildGain.toLocaleString()}</div>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-(--surface-secondary) border border-(--border-default)">
                  <div className="text-sm flex flex-col">
                    <span className="font-semibold text-red-500">Weight Gain</span>
                    <span className="text-xs text-(--text-tertiary)">~0.5 kg / week</span>
                  </div>
                  <div className="text-lg font-bold tabular-nums">{results.gain.toLocaleString()}</div>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-(--surface-secondary) border border-(--border-default)">
                  <div className="text-sm flex flex-col">
                    <span className="font-semibold text-purple-500">Fast Gain</span>
                    <span className="text-xs text-(--text-tertiary)">~1 kg / week</span>
                  </div>
                  <div className="text-lg font-bold tabular-nums">{results.extremeGain.toLocaleString()}</div>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}
