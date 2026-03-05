import { useState, useMemo } from "react";
import { CurrencySelector, USD } from "../../components/advanced/CurrencySelector";
import type { Currency } from "../../components/advanced/CurrencySelector";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] border border-[var(--border-default)] p-5 ${className}`}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">{children}</label>;
}

function ResultRow({ label, value, highlight = false, sub }: {
  label: string; value: string; highlight?: boolean; sub?: string;
}) {
  return (
    <div className={`flex items-center justify-between py-3.5 border-b border-[var(--border-default)] last:border-0 ${highlight ? "-mx-5 px-5 bg-[var(--color-primary-500)]/5" : ""}`}>
      <div>
        <span className="text-sm text-[var(--text-secondary)]">{label}</span>
        {sub && <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{sub}</p>}
      </div>
      <span className={`text-base font-semibold tabular-nums ${highlight ? "text-[var(--color-primary-500)]" : "text-[var(--text-primary)]"}`}>{value}</span>
    </div>
  );
}

const TIP_PRESETS = [10, 15, 18, 20, 25, 30];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TipCalculatorTool() {
  const [currency, setCurrency] = useState<Currency>(USD);
  const [bill, setBill] = useState("85.00");
  const [tipPct, setTipPct] = useState(18);
  const [customTip, setCustomTip] = useState("");
  const [people, setPeople] = useState(2);
  const [useCustom, setUseCustom] = useState(false);

  const sym = currency.symbol;
  const billAmt = parseFloat(bill) || 0;
  const activeTipPct = useCustom ? (parseFloat(customTip) || 0) : tipPct;

  const { tipAmount, total, perPerson, tipPerPerson } = useMemo(() => {
    const tipAmount = billAmt * (activeTipPct / 100);
    const total = billAmt + tipAmount;
    const perPerson = total / Math.max(1, people);
    const tipPerPerson = tipAmount / Math.max(1, people);
    return { tipAmount, total, perPerson, tipPerPerson };
  }, [billAmt, activeTipPct, people]);

  return (
    <div className="space-y-5">
      <Panel>
        {/* Bill amount with currency selector */}
        <div className="mb-5">
          <Label>Bill Amount</Label>
          <div className="flex items-stretch rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-bg)] overflow-visible focus-within:border-[var(--color-primary-500)] transition-colors h-[42px]">
            <CurrencySelector value={currency} onChange={setCurrency} compact />
            <input
              type="number"
              value={bill}
              min={0}
              step={0.01}
              onChange={(e) => setBill(e.target.value)}
              className="flex-1 min-w-0 px-3 text-sm bg-transparent text-[var(--text-primary)] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        {/* Tip presets */}
        <div className="mb-5">
          <Label>Tip Percentage</Label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
            {TIP_PRESETS.map((pct) => (
              <button
                key={pct}
                onClick={() => { setTipPct(pct); setUseCustom(false); }}
                className={`py-2 text-sm font-medium rounded-[var(--radius-md)] border transition-colors ${
                  !useCustom && tipPct === pct
                    ? "border-[var(--color-primary-500)] bg-[var(--color-primary-500)]/10 text-[var(--text-primary)]"
                    : "border-[var(--border-default)] bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-primary-500)]/60"
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setUseCustom((v) => !v)}
              className={`px-3 py-1.5 text-xs rounded-[var(--radius-sm)] border transition-colors ${
                useCustom
                  ? "border-[var(--color-primary-500)] bg-[var(--color-primary-500)]/10 text-[var(--text-primary)]"
                  : "border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Custom
            </button>
            {useCustom && (
              <div className="flex items-center rounded-[var(--radius-md)] border border-[var(--color-primary-500)] bg-[var(--surface-bg)] overflow-hidden">
                <input
                  type="number"
                  value={customTip}
                  min={0} max={100} step={0.5}
                  placeholder="0"
                  autoFocus
                  onChange={(e) => setCustomTip(e.target.value)}
                  className="w-20 px-3 py-1.5 text-sm bg-transparent text-[var(--text-primary)] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="pr-3 text-sm text-[var(--text-tertiary)]">%</span>
              </div>
            )}
          </div>
        </div>

        {/* Number of people */}
        <div>
          <Label>Split Between</Label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPeople((p) => Math.max(1, p - 1))}
              className="w-9 h-9 rounded-full border border-[var(--border-default)] bg-[var(--surface-bg)] text-[var(--text-primary)] text-lg flex items-center justify-center hover:border-[var(--color-primary-500)] transition-colors"
            >
              −
            </button>
            <span className="text-xl font-semibold text-[var(--text-primary)] tabular-nums w-8 text-center">{people}</span>
            <button
              onClick={() => setPeople((p) => Math.min(50, p + 1))}
              className="w-9 h-9 rounded-full border border-[var(--border-default)] bg-[var(--surface-bg)] text-[var(--text-primary)] text-lg flex items-center justify-center hover:border-[var(--color-primary-500)] transition-colors"
            >
              +
            </button>
            <span className="text-sm text-[var(--text-secondary)]">{people === 1 ? "person" : "people"}</span>
          </div>
        </div>
      </Panel>

      {/* Results */}
      {billAmt > 0 && (
        <Panel>
          <ResultRow label="Bill" value={`${sym}${fmt(billAmt)}`} />
          <ResultRow label="Tip" value={`${sym}${fmt(tipAmount)}`} sub={`${activeTipPct}% of bill`} />
          <ResultRow label="Total" value={`${sym}${fmt(total)}`} highlight />
          {people > 1 && (
            <>
              <ResultRow label={`Per Person (${people})`} value={`${sym}${fmt(perPerson)}`} highlight />
              <ResultRow label="Tip per Person" value={`${sym}${fmt(tipPerPerson)}`} />
            </>
          )}
        </Panel>
      )}

      {/* Tip guide */}
      <Panel>
        <p className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-3">Tipping Guide</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { label: "Counter service", range: "10–15%" },
            { label: "Sit-down restaurant", range: "15–20%" },
            { label: "Exceptional service", range: "20–25%+" },
            { label: "Delivery", range: "15–20%" },
            { label: "Bartender", range: `${sym}1–2 per drink` },
            { label: "Taxi / rideshare", range: "15–20%" },
          ].map((item) => (
            <div key={item.label} className="rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-bg)] px-3 py-2">
              <p className="text-[11px] text-[var(--text-tertiary)]">{item.label}</p>
              <p className="text-xs font-semibold text-[var(--text-primary)] mt-0.5">{item.range}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}