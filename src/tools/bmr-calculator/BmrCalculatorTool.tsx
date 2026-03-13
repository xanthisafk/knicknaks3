import { useState, useMemo } from "react";
import { Panel } from "@/components/layout";
import { Input } from "@/components/ui";
import { Tabs, Tab, TabList } from "@/components/ui/tab";
import StatBox from "@/components/ui/StatBox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toTitleCase } from "@/lib";

export default function BmrCalculatorTool() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [gender, setGender] = useState<"male" | "female">("female");
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
    <div className="space-y-2">
      <Panel>
        <div className="flex justify-center mb-6">
          <Tabs value={unit} onValueChange={v => setUnit(v === "metric" ? "metric" : "imperial")}>
            <TabList>
              <Tab value="metric">Metric</Tab>
              <Tab value="imperial">US/Imperial</Tab>
            </TabList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-(--text-primary) mb-1">Gender</label>
            <Select value={toTitleCase(gender)} onValueChange={v => setGender(v === "male" ? "male" : "female")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
              </SelectContent>
            </Select>

            <label className="block text-sm font-medium text-(--text-primary) mb-1">Age</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full"
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
                <Input
                  type="number"
                  value={cm}
                  onChange={(e) => setCm(e.target.value)}
                  className="w-full"
                  placeholder="cm"
                  min="0"
                />
                <span className="text-sm text-(--text-secondary)">cm</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={feet}
                  onChange={(e) => setFeet(e.target.value)}
                  className="w-full"
                  placeholder="ft"
                  min="0"
                />
                <span className="text-sm text-(--text-secondary)">ft</span>
                <Input
                  type="number"
                  value={inches}
                  onChange={(e) => setInches(e.target.value)}
                  className="w-full"
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
                <Input
                  type="number"
                  value={kg}
                  onChange={(e) => setKg(e.target.value)}
                  className="w-full"
                  placeholder="kg"
                  min="0"
                />
                <span className="text-sm text-(--text-secondary)">kg</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={lbs}
                  onChange={(e) => setLbs(e.target.value)}
                  className="w-full"
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
        <>
          <Panel>
            <label className="block text-xs text-center font-semibold uppercase tracking-widest text-(--text-tertiary) mb-2">Your BMR</label>
            <StatBox
              label="Calories / day"
              value={bmr.toLocaleString()}
              textSize="6xl"
              tooltip="Your Basal Metabolic Rate (BMR) is the amount of energy expended while at complete rest. It's the number of calories you'd burn if you stayed in bed all day doing absolutely nothing."
            />
          </Panel>

        </>
      )}
    </div>
  );
}
