import { useState, useMemo } from "react";
import { Panel } from "@/components/layout";
import { Tab, TabList, Tabs } from "@/components/ui/tab";
import { Input, Label } from "@/components/ui";
import StatBox from "@/components/ui/StatBox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toTitleCase } from "@/lib";

export default function BodyFatCalculatorTool() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [gender, setGender] = useState<"male" | "female">("female");
  const [age, setAge] = useState("30");

  const [cm, setCm] = useState("170");
  const [neckCm, setNeckCm] = useState("40");
  const [waistCm, setWaistCm] = useState("50");
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
          <div className="space-y-2">
            <Select label="Gender" value={toTitleCase(gender)} onValueChange={v => setGender(v === "male" ? "male" : "female")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
              </SelectContent>
            </Select>

            <Input
              label="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full"
              placeholder="Your age..."
              trailingText="years"
              min="1"
              max="120"
            />
            {unit === "metric" ? (
              <Input
                type="number"
                label="Height"
                value={cm}
                onChange={(e) => setCm(e.target.value)}
                className="w-full"
                placeholder="Your height..."
                trailingText="cm"
                min="0"
              />
            ) : (
              <Input
                type="number"
                label="Height"
                value={inches}
                onChange={(e) => setInches(e.target.value)}
                className="w-full"
                placeholder="Your height..."
                trailingText="in"
                min="0"
              />
            )}
          </div>

          <div className="space-y-2">
            {unit === "metric" ? (

              <Input
                type="number"
                label="Neck Circumference"
                value={neckCm}
                onChange={(e) => setNeckCm(e.target.value)}
                className="w-full"
                placeholder="cm"
                trailingText="cm"
                min="0"
              />

            ) : (
              <Input
                type="number"
                label="Neck Circumference"
                value={neckInches}
                onChange={(e) => setNeckInches(e.target.value)}
                className="w-full"
                placeholder="in"
                trailingText="in"
                min="0"
              />

            )}

            {unit === "metric" ? (
              <Input
                type="number"
                label="Waist Circumference"
                value={waistCm}
                onChange={(e) => setWaistCm(e.target.value)}
                className="w-full"
                placeholder="cm"
                trailingText="cm"
                min="0"
              />
            ) : (
              <Input
                type="number"
                label="Waist Circumference"
                value={waistInches}
                onChange={(e) => setWaistInches(e.target.value)}
                className="w-full"
                placeholder="in"
                trailingText="in"
                min="0"
              />
            )}

            {gender === "female" && (
              <>
                {unit === "metric" ? (
                  <Input
                    type="number"
                    label="Hip Circumference"
                    value={hipCm}
                    onChange={(e) => setHipCm(e.target.value)}
                    className="w-full"
                    placeholder="cm"
                    min="0"
                  />
                ) : (
                  <Input
                    type="number"
                    label="Hip Circumference"
                    value={hipInches}
                    onChange={(e) => setHipInches(e.target.value)}
                    className="w-full"
                    placeholder="in"
                    min="0"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </Panel >

      {result && (

        <Panel>
          <Label>Your estimated body fat</Label>
          <StatBox
            label={result.category}
            value={`${result.value}%`}
            textSize="6xl"
            tooltip="This estimation uses the U.S. Navy Method based on anatomical circumferences. It is a widely used and mostly accurate measurement, though no estimation method is 100% precise without clinical tools like a DEXA scan."
          />
        </Panel>
      )
      }
    </div >
  );
}
