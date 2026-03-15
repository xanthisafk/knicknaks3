import { useState, useMemo } from "react";
import { Panel } from "@/components/layout";
import { Input, Label } from "@/components/ui";
import { Tab, Tabs, TabList } from "@/components/ui/tab";
import StatBox from "@/components/ui/StatBox";

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label>Height</Label>
            {unit === "metric" ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={cm}
                  onChange={(e) => setCm(e.target.value)}
                  className="flex-1"
                  min="0"
                  trailingText="cm"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={feet}
                  onChange={(e) => setFeet(e.target.value)}
                  className="flex-1"
                  trailingText="ft"
                  min="0"
                />

                <Input
                  type="number"
                  value={inches}
                  onChange={(e) => setInches(e.target.value)}
                  className="flex-1"
                  min="0"
                  max="11"
                  trailingText="in"
                />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Weight</Label>
            {unit === "metric" ? (
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={kg}
                  onChange={(e) => setKg(e.target.value)}
                  className="w-full grow"
                  trailingText="kg"
                  min="0"
                />
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={lbs}
                  onChange={(e) => setLbs(e.target.value)}
                  className="w-full grow"
                  trailingText="lbs"
                  min="0"
                />
              </div>
            )}
          </div>
        </div>
      </Panel>

      {result && (
        <>
          <Panel>
            <div className="text-center py-6 space-y-2">
              <Label>Your BMI</Label>
              <div className="text-5xl font-bold" style={{ color: result.color }}>
                {result.value}
              </div>
              <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: `${result.color}20`, color: result.color }}>
                {result.category}
              </div>
            </div>
          </Panel>
          <Label>Quick reference</Label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <StatBox label="Underweight" value="Less than 18.5" />
            <StatBox label="Normal weight" value="18.5 - 24.9" />
            <StatBox label="Overweight" value="25 - 29.9" />
            <StatBox label="Obesity" value="30 or greater" />
          </div>
        </>
      )}
    </div>
  );
}
