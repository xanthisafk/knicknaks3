import { useState, useMemo } from "react";
import { Panel } from "@/components/layout";
import { Tab, TabList, Tabs } from "@/components/ui/tab";
import { Input, Label } from "@/components/ui";

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
    <div className="space-y-2">
      <Panel>
        <div className="space-y-2">
          <Tabs value={unit} onValueChange={v => setUnit(v as "metric" | "imperial")}>
            <TabList>
              <Tab value="metric">Metric</Tab>
              <Tab value="imperial">US/Imperial</Tab>
            </TabList>
          </Tabs>
          <div className="flex flex-row gap-2">

            <Tabs value={gender} onValueChange={v => setGender(v as "male" | "female")} label="Gender" className="grow">
              <TabList>
                <Tab value="male">Male</Tab>
                <Tab value="female">Female</Tab>
              </TabList>
            </Tabs>


            <div className="space-y-2 grow">
              {unit === "metric" ? (
                <div className="flex items-center gap-2 h-full">
                  <Input
                    label="Height"
                    type="number"
                    trailingText="cm"
                    value={cm}
                    onChange={(e) => setCm(e.target.value)}
                    placeholder="Centimeters"
                    min="1"
                    className="w-full"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 h-full">
                  <Input
                    label="Height (ft)"
                    type="number"
                    value={feet}
                    trailingText="ft"
                    onChange={(e) => setFeet(e.target.value)}
                    className="w-full"
                    placeholder="Feet"
                    min="0"
                  />
                  <Input
                    label="Height (in)"
                    trailingText="in"
                    type="number"
                    value={inches}
                    onChange={(e) => setInches(e.target.value)}
                    className="w-full"
                    placeholder="Inches"
                    min="0"
                    max="11"
                  />
                </div>
              )}
            </div>
          </div>
        </div>


      </Panel>

      {results && (
        <Panel>
          <div className="text-center py-6 space-y-4">
            <Label>Healthy BMI Weight Range</Label>
            <div className="text-4xl font-bold text-green-500">
              {results.bmiRange}
            </div>
            <Label size="s">
              Based on the WHO healthy BMI range of 18.5 - 24.9
            </Label>
          </div>

          <div className="text-center">
            <Label>Specific Formula Result</Label>
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
