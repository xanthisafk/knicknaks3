// PercentageCalcTool.tsx
import { useState } from "react";
import { PercentCard } from "./PercentCard";

const parseInputs = (...vals: string[]) => vals.map(parseFloat);
const hasInvalid = (...nums: number[]) => nums.some(isNaN);

export default function PercentageCalcTool() {
  const [vals, setVals] = useState({
    pctOf_x: "", pctOf_y: "",
    isWhat_x: "", isWhat_y: "",
    change_x: "", change_y: "",
    adj_x: "", adj_y: "",
  });

  const set = (key: keyof typeof vals) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setVals(v => ({ ...v, [key]: e.target.value }));

  const computePctOf = () => {
    const [x, y] = parseInputs(vals.pctOf_x, vals.pctOf_y);
    return hasInvalid(x, y) ? "" : ((x / 100) * y).toFixed(2);
  };

  const computeIsWhat = () => {
    const [x, y] = parseInputs(vals.isWhat_x, vals.isWhat_y);
    return hasInvalid(x, y) || y === 0 ? "" : ((x / y) * 100).toFixed(2) + "%";
  };

  const computeChange = () => {
    const [x, y] = parseInputs(vals.change_x, vals.change_y);
    if (hasInvalid(x, y) || x === 0) return "";
    const change = ((y - x) / x) * 100;
    return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
  };

  const computeAdj = () => {
    const [x, y] = parseInputs(vals.adj_x, vals.adj_y);
    if (hasInvalid(x, y)) return "";
    const inc = (x * (1 + y / 100)).toFixed(2);
    const dec = (x * (1 - y / 100)).toFixed(2);
    return `↑ ${inc}  |  ↓ ${dec}`;
  };

  return (
    <div className="flex flex-col gap-2">
      <PercentCard
        label="What is X% of Y?"
        formula="(X / 100) x Y"
        input1={{ value: vals.pctOf_x, onChange: set("pctOf_x"), placeholder: "Value of X", leadingText: "X", trailingText: "% of" }}
        input2={{ value: vals.pctOf_y, onChange: set("pctOf_y"), placeholder: "Value of Y", leadingText: "Y", trailingText: "" }}
        result={computePctOf()}
      />
      <PercentCard
        label="X is what % of Y?"
        formula="(X / Y) x 100"
        input1={{ value: vals.isWhat_x, onChange: set("isWhat_x"), placeholder: "Value of X", leadingText: "X", trailingText: "of" }}
        input2={{ value: vals.isWhat_y, onChange: set("isWhat_y"), placeholder: "Value of Y", leadingText: "Y", trailingText: "%" }}
        result={computeIsWhat()}
      />
      <PercentCard
        label="% Change from X to Y"
        formula="((Y - X) / X) x 100"
        input1={{ value: vals.change_x, onChange: set("change_x"), placeholder: "From", leadingText: "From", trailingText: "% to" }}
        input2={{ value: vals.change_y, onChange: set("change_y"), placeholder: "To", leadingText: "To", trailingText: "%" }}
        result={computeChange()}
      />
      <PercentCard
        label="Increase / Decrease X by Y%"
        formula="X x (1 ± Y/100)"
        input1={{ value: vals.adj_x, onChange: set("adj_x"), placeholder: "Value", leadingText: "X", trailingText: "by" }}
        input2={{ value: vals.adj_y, onChange: set("adj_y"), placeholder: "%", leadingText: "Y", trailingText: "%" }}
        result={computeAdj()}
      />
    </div>
  );
}