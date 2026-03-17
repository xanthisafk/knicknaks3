import { useState, useMemo } from "react";
import { Panel } from "@/components/layout";
import { Tab, TabList, Tabs } from "@/components/ui/tab";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input, Label } from "@/components/ui";
import { toTitleCase } from "@/lib";
import StatBox from "@/components/ui/StatBox";
import { Info } from "lucide-react";

const activityLevels = {
  "1.2": {
    label: "Sedentary (little/no exercise)",
    value: 1.2
  },
  "1.375": {
    label: "Lightly active (1-3 days/week)",
    value: 1.375
  },
  "1.55": {
    label: "Moderately active (3-5 days/week)",
    value: 1.55
  },
  "1.725": {
    label: "Very active (6-7 days/week)",
    value: 1.725
  },
  "1.9": {
    label: "Extra active (physical job/2x day)",
    value: 1.9
  }
};

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
    <div className="space-y-2">
      <Panel className="flex flex-col gap-2">
        <Tabs value={unit} onValueChange={(v) => setUnit(v as "metric" | "imperial")}>
          <TabList>
            <Tab value="metric">Metric</Tab>
            <Tab value="imperial">Imperial</Tab>
          </TabList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Select label="Gender" value={gender} onValueChange={(v) => setGender(v as "male" | "female")}>
              <SelectTrigger>
                {toTitleCase(gender)}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              label="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="years"
              trailingText="years"
              min="1"
              max="120"
            />

            <Select label="Activity Level" value={activity} onValueChange={(v) => setActivity(v)}>
              <SelectTrigger>
                {activityLevels[activity as keyof typeof activityLevels].label}
              </SelectTrigger>
              <SelectContent>
                {Object.entries(activityLevels).map(([key, value]) => (
                  <SelectItem key={key} value={value.value.toString()}>
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">

            {unit === "metric" ? (
              <Input
                label="Height"
                type="number"
                value={cm}
                onChange={(e) => setCm(e.target.value)}
                placeholder="cm"
                trailingText="cm"
                min="0"
              />
            ) : (
              <>
                <Input
                  label="Feet"
                  type="number"
                  value={feet}
                  onChange={(e) => setFeet(e.target.value)}
                  placeholder="ft"
                  trailingText="ft"
                  min="0"
                />
                <Input
                  label="Inches"
                  type="number"
                  value={inches}
                  onChange={(e) => setInches(e.target.value)}
                  placeholder="in"
                  trailingText="in"
                  min="0"
                  max="11"
                />
              </>
            )}

            {unit === "metric" ? (
              <Input
                label="Weight"
                type="number"
                value={kg}
                onChange={(e) => setKg(e.target.value)}
                placeholder="kg"
                trailingText="kg"
                min="0"
              />
            ) : (
              <Input
                label="Weight"
                type="number"
                value={lbs}
                onChange={(e) => setLbs(e.target.value)}
                placeholder="lbs"
                trailingText="lbs"
                min="0"
              />
            )}
          </div>
        </div>
      </Panel>

      {results && (
        <div className="space-y-2">
          <StatBox
            prefix="Maintain Weight"
            label="Kcal/day"
            textSize="6xl"
            value={results.maintain.toLocaleString()}
            tooltip="Calories needed to maintain your current body weight"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Panel>
              <Label>Weight Loss</Label>
              <div className="space-y-1">
                <div className="flex justify-between items-center p-2 rounded-lg bg-(--surface-secondary) border border-(--border-default)">
                  <div className="text-sm flex flex-col">
                    <span className="font-semibold text-green-500">Mild Loss</span>
                    <span className="text-xs text-(--text-tertiary)">~0.25 kg / week</span>
                  </div>
                  <div className="text-lg font-bold tabular-nums">{results.mildLoss.toLocaleString()}</div>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-(--surface-secondary) border border-(--border-default)">
                  <div className="text-sm flex flex-col">
                    <span className="font-semibold text-green-500">Weight Loss</span>
                    <span className="text-xs text-(--text-tertiary)">~0.5 kg / week</span>
                  </div>
                  <div className="text-lg font-bold tabular-nums">{results.loss.toLocaleString()}</div>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-(--surface-secondary) border border-(--border-default)">
                  <div className="text-sm flex flex-col">
                    <span className="font-semibold text-yellow-500">Extreme Loss</span>
                    <span className="text-xs text-(--text-tertiary)">~1 kg / week</span>
                  </div>
                  <div className="text-lg font-bold tabular-nums">{results.extremeLoss.toLocaleString()}</div>
                </div>
              </div>
            </Panel>

            <Panel>
              <Label>Weight Gain</Label>
              <div className="space-y-1">
                <div className="flex justify-between items-center p-2 rounded-lg bg-(--surface-secondary) border border-(--border-default)">
                  <div className="text-sm flex flex-col">
                    <span className="font-semibold text-red-500">Mild Gain</span>
                    <span className="text-xs text-(--text-tertiary)">~0.25 kg / week</span>
                  </div>
                  <div className="text-lg font-bold tabular-nums">{results.mildGain.toLocaleString()}</div>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-(--surface-secondary) border border-(--border-default)">
                  <div className="text-sm flex flex-col">
                    <span className="font-semibold text-red-500">Weight Gain</span>
                    <span className="text-xs text-(--text-tertiary)">~0.5 kg / week</span>
                  </div>
                  <div className="text-lg font-bold tabular-nums">{results.gain.toLocaleString()}</div>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-(--surface-secondary) border border-(--border-default)">
                  <div className="text-sm flex flex-col">
                    <span className="font-semibold text-purple-500">Fast Gain</span>
                    <span className="text-xs text-(--text-tertiary)">~1 kg / week</span>
                  </div>
                  <div className="text-lg font-bold tabular-nums">{results.extremeGain.toLocaleString()}</div>
                </div>
              </div>
            </Panel>
          </div>
          <Panel className="flex flex-row items-center justify-center flex-nowrap">
            <Label icon={Info}>Privacy assurance: Data is not stored or sent to any third party.</Label>
          </Panel>
        </div>
      )}
    </div>
  );
}
