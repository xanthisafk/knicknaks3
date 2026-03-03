import { useState, useMemo } from "react";
import { Input } from "@/components/ui";
import { Panel } from "@/components/layout";

function CalcCard({
  label,
  formula,
  children,
  result,
}: {
  label: string;
  formula: string;
  children: React.ReactNode;
  result: string;
}) {
  return (
    <Panel>
      <h3 className="text-sm font-semibold text(--text-primary) mb-1">{label}</h3>
      <p className="text-xs text-[var(--text-tertiary)] mb-3">{formula}</p>
      <div className="space-y-3">
        {children}
        {result && (
          <div className="px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/20 border border-[var(--color-primary-200)] dark:border-[var(--color-primary-800)]">
            <span className="text-sm font-medium text-[var(--color-primary-600)]">= {result}</span>
          </div>
        )}
      </div>
    </Panel>
  );
}

export default function PercentageCalcTool() {
  // What is X% of Y?
  const [pctOf_x, setPctOf_x] = useState("");
  const [pctOf_y, setPctOf_y] = useState("");
  const pctOfResult = useMemo(() => {
    const x = parseFloat(pctOf_x);
    const y = parseFloat(pctOf_y);
    if (isNaN(x) || isNaN(y)) return "";
    return ((x / 100) * y).toFixed(2);
  }, [pctOf_x, pctOf_y]);

  // X is what % of Y?
  const [isWhat_x, setIsWhat_x] = useState("");
  const [isWhat_y, setIsWhat_y] = useState("");
  const isWhatResult = useMemo(() => {
    const x = parseFloat(isWhat_x);
    const y = parseFloat(isWhat_y);
    if (isNaN(x) || isNaN(y) || y === 0) return "";
    return ((x / y) * 100).toFixed(2) + "%";
  }, [isWhat_x, isWhat_y]);

  // % change from X to Y
  const [change_x, setChange_x] = useState("");
  const [change_y, setChange_y] = useState("");
  const changeResult = useMemo(() => {
    const x = parseFloat(change_x);
    const y = parseFloat(change_y);
    if (isNaN(x) || isNaN(y) || x === 0) return "";
    const change = ((y - x) / x) * 100;
    const prefix = change > 0 ? "+" : "";
    return `${prefix}${change.toFixed(2)}%`;
  }, [change_x, change_y]);

  // Increase/decrease X by Y%
  const [adj_x, setAdj_x] = useState("");
  const [adj_y, setAdj_y] = useState("");
  const adjIncreaseResult = useMemo(() => {
    const x = parseFloat(adj_x);
    const y = parseFloat(adj_y);
    if (isNaN(x) || isNaN(y)) return "";
    return (x * (1 + y / 100)).toFixed(2);
  }, [adj_x, adj_y]);
  const adjDecreaseResult = useMemo(() => {
    const x = parseFloat(adj_x);
    const y = parseFloat(adj_y);
    if (isNaN(x) || isNaN(y)) return "";
    return (x * (1 - y / 100)).toFixed(2);
  }, [adj_x, adj_y]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CalcCard label="What is X% of Y?" formula="(X / 100) × Y" result={pctOfResult}>
        <div className="flex items-center gap-2">
          <Input
            value={pctOf_x}
            onChange={(e) => setPctOf_x(e.target.value)}
            placeholder="X"
            type="number"
            className="text-center"
          />
          <span className="text-sm text(--text-secondary)">% of</span>
          <Input
            value={pctOf_y}
            onChange={(e) => setPctOf_y(e.target.value)}
            placeholder="Y"
            type="number"
            className="text-center"
          />
        </div>
      </CalcCard>

      <CalcCard label="X is what % of Y?" formula="(X / Y) × 100" result={isWhatResult}>
        <div className="flex items-center gap-2">
          <Input
            value={isWhat_x}
            onChange={(e) => setIsWhat_x(e.target.value)}
            placeholder="X"
            type="number"
            className="text-center"
          />
          <span className="text-sm text(--text-secondary)">of</span>
          <Input
            value={isWhat_y}
            onChange={(e) => setIsWhat_y(e.target.value)}
            placeholder="Y"
            type="number"
            className="text-center"
          />
        </div>
      </CalcCard>

      <CalcCard label="% Change from X to Y" formula="((Y − X) / X) × 100" result={changeResult}>
        <div className="flex items-center gap-2">
          <Input
            value={change_x}
            onChange={(e) => setChange_x(e.target.value)}
            placeholder="From"
            type="number"
            className="text-center"
          />
          <span className="text-sm text(--text-secondary)">→</span>
          <Input
            value={change_y}
            onChange={(e) => setChange_y(e.target.value)}
            placeholder="To"
            type="number"
            className="text-center"
          />
        </div>
      </CalcCard>

      <CalcCard
        label="Increase / Decrease X by Y%"
        formula="X × (1 ± Y/100)"
        result={adjIncreaseResult ? `↑ ${adjIncreaseResult}  |  ↓ ${adjDecreaseResult}` : ""}
      >
        <div className="flex items-center gap-2">
          <Input
            value={adj_x}
            onChange={(e) => setAdj_x(e.target.value)}
            placeholder="Value"
            type="number"
            className="text-center"
          />
          <span className="text-sm text(--text-secondary)">by</span>
          <Input
            value={adj_y}
            onChange={(e) => setAdj_y(e.target.value)}
            placeholder="%"
            type="number"
            className="text-center"
          />
        </div>
      </CalcCard>
    </div>
  );
}
