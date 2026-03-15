import { useState, useMemo } from "react";
import { CurrencySelector, USD } from "../../components/advanced/CurrencySelector";
import type { Currency } from "../../components/advanced/CurrencySelector";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AmortisationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcMonthly(principal: number, annualRate: number, months: number): number {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function buildSchedule(principal: number, annualRate: number, months: number): AmortisationRow[] {
  const r = annualRate / 100 / 12;
  const monthly = calcMonthly(principal, annualRate, months);
  const rows: AmortisationRow[] = [];
  let balance = principal;
  for (let i = 1; i <= months; i++) {
    const interest = balance * r;
    const principalPaid = monthly - interest;
    balance = Math.max(0, balance - principalPaid);
    rows.push({ month: i, payment: monthly, principal: principalPaid, interest, balance });
  }
  return rows;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg bg-(--surface-elevated) border border-(--border-default) p-5 ${className}`}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-medium text-(--text-secondary) block mb-1.5">{children}</label>;
}

/** A number input that optionally has a CurrencySelector on the left and/or a text suffix on the right. */
function NumericInput({ value, onChange, currency, onCurrencyChange, min, max, step, suffix }: {
  value: string; onChange: (v: string) => void;
  currency?: Currency; onCurrencyChange?: (c: Currency) => void;
  min?: number; max?: number; step?: number; suffix?: string;
}) {
  return (
    <div className="flex items-stretch rounded-md border border-(--border-default) bg-(--surface-bg) overflow-visible focus-within:border-primary-500 transition-colors h-[42px]">
      {currency && onCurrencyChange && (
        <CurrencySelector value={currency} onChange={onCurrencyChange} compact />
      )}
      <input
        type="number"
        value={value}
        min={min} max={max} step={step}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 min-w-0 px-3 text-sm bg-transparent text-(--text-primary) outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {suffix && (
        <span className="px-3 text-sm text-(--text-tertiary) border-l border-(--border-default) bg-(--surface-elevated) flex items-center select-none shrink-0">
          {suffix}
        </span>
      )}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-md border border-(--border-default) bg-(--surface-bg) p-4 flex flex-col gap-1">
      <span className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase">{label}</span>
      <span className="text-2xl font-semibold text-(--text-primary) tabular-nums">{value}</span>
      {sub && <span className="text-xs text-(--text-tertiary)">{sub}</span>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LoanMortgageCalculatorTool() {
  const [currency, setCurrency] = useState<Currency>(USD);
  const [principal, setPrincipal] = useState("300000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleView, setScheduleView] = useState<"yearly" | "monthly">("yearly");

  const sym = currency.symbol;
  const p = parseFloat(principal) || 0;
  const r = parseFloat(rate) || 0;
  const y = parseInt(years) || 0;
  const months = y * 12;

  const monthly = useMemo(() => (p > 0 && months > 0 ? calcMonthly(p, r, months) : 0), [p, r, months]);
  const totalPaid = monthly * months;
  const totalInterest = totalPaid - p;

  const schedule = useMemo(
    () => (showSchedule && p > 0 && months > 0 ? buildSchedule(p, r, months) : []),
    [showSchedule, p, r, months]
  );

  const yearlySchedule = useMemo(() => {
    const map = new Map<number, { totalPayment: number; totalPrincipal: number; totalInterest: number; balance: number }>();
    for (const row of schedule) {
      const yr = Math.ceil(row.month / 12);
      const existing = map.get(yr) ?? { totalPayment: 0, totalPrincipal: 0, totalInterest: 0, balance: 0 };
      existing.totalPayment += row.payment;
      existing.totalPrincipal += row.principal;
      existing.totalInterest += row.interest;
      existing.balance = row.balance;
      map.set(yr, existing);
    }
    return Array.from(map.entries()).map(([yr, v]) => ({ year: yr, ...v }));
  }, [schedule]);

  const interestPct = totalPaid > 0 ? (totalInterest / totalPaid) * 100 : 0;
  const principalPct = 100 - interestPct;

  return (
    <div className="space-y-5">
      <Panel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label>Loan Amount</Label>
            <NumericInput
              value={principal} onChange={setPrincipal}
              currency={currency} onCurrencyChange={setCurrency}
              min={0} step={1000}
            />
          </div>
          <div>
            <Label>Annual Interest Rate</Label>
            <NumericInput value={rate} onChange={setRate} min={0} max={50} step={0.1} suffix="%" />
          </div>
          <div>
            <Label>Loan Term</Label>
            <NumericInput value={years} onChange={setYears} min={1} max={50} step={1} suffix="yrs" />
          </div>
        </div>
      </Panel>

      {monthly > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard label="Monthly Payment" value={`${sym}${fmt(monthly)}`} sub="per month" />
            <StatCard label="Total Interest" value={`${sym}${fmt(totalInterest)}`} sub={`${interestPct.toFixed(1)}% of total paid`} />
            <StatCard label="Total Amount Paid" value={`${sym}${fmt(totalPaid)}`} sub={`over ${y} year${y !== 1 ? "s" : ""}`} />
          </div>

          <Panel className="py-4">
            <p className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase mb-3">Payment Breakdown</p>
            <div className="flex rounded-full overflow-hidden h-5 w-full border border-(--border-default) mb-3">
              <div style={{ width: `${principalPct}%`, backgroundColor: "var(--color-primary-500)" }} className="h-full transition-all duration-500" />
              <div style={{ width: `${interestPct}%` }} className="h-full bg-(--color-primary-200,#bfdbfe) transition-all duration-500" />
            </div>
            <div className="flex items-center gap-5 text-xs text-(--text-secondary)">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-500 inline-block" />
                Principal ({principalPct.toFixed(1)}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-(--color-primary-200,#bfdbfe) inline-block border border-(--border-default)" />
                Interest ({interestPct.toFixed(1)}%)
              </span>
            </div>
          </Panel>

          <Panel className="p-0 overflow-hidden">
            <button
              onClick={() => setShowSchedule((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-(--text-primary) hover:bg-(--surface-bg) transition-colors"
            >
              <span>Amortisation Schedule</span>
              <span className="text-(--text-tertiary) text-xs">{showSchedule ? "▲ Hide" : "▼ Show"}</span>
            </button>

            {showSchedule && (
              <div className="border-t border-(--border-default)">
                <div className="flex gap-2 px-5 py-3 border-b border-(--border-default)">
                  {(["yearly", "monthly"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setScheduleView(v)}
                      className={`px-3 py-1 text-xs rounded-sm border transition-colors ${scheduleView === v
                          ? "border-primary-500 bg-primary-500/10 text-(--text-primary)"
                          : "border-(--border-default) text-(--text-secondary) hover:text-(--text-primary)"
                        }`}
                    >
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-(--surface-elevated) border-b border-(--border-default)">
                      <tr>
                        <th className="px-4 py-2.5 text-left font-semibold text-(--text-tertiary) uppercase tracking-wider">
                          {scheduleView === "yearly" ? "Year" : "Month"}
                        </th>
                        <th className="px-4 py-2.5 text-right font-semibold text-(--text-tertiary) uppercase tracking-wider">Payment</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-(--text-tertiary) uppercase tracking-wider">Principal</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-(--text-tertiary) uppercase tracking-wider">Interest</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-(--text-tertiary) uppercase tracking-wider">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-(--border-default)">
                      {scheduleView === "yearly"
                        ? yearlySchedule.map((row) => (
                          <tr key={row.year} className="hover:bg-(--surface-bg) transition-colors">
                            <td className="px-4 py-2.5 text-(--text-primary) font-medium">{row.year}</td>
                            <td className="px-4 py-2.5 text-right text-(--text-secondary) tabular-nums">{sym}{fmt(row.totalPayment)}</td>
                            <td className="px-4 py-2.5 text-right text-(--text-secondary) tabular-nums">{sym}{fmt(row.totalPrincipal)}</td>
                            <td className="px-4 py-2.5 text-right text-(--text-secondary) tabular-nums">{sym}{fmt(row.totalInterest)}</td>
                            <td className="px-4 py-2.5 text-right text-(--text-primary) tabular-nums font-medium">{sym}{fmt(row.balance)}</td>
                          </tr>
                        ))
                        : schedule.map((row) => (
                          <tr key={row.month} className="hover:bg-(--surface-bg) transition-colors">
                            <td className="px-4 py-2.5 text-(--text-primary) font-medium">{row.month}</td>
                            <td className="px-4 py-2.5 text-right text-(--text-secondary) tabular-nums">{sym}{fmt(row.payment)}</td>
                            <td className="px-4 py-2.5 text-right text-(--text-secondary) tabular-nums">{sym}{fmt(row.principal)}</td>
                            <td className="px-4 py-2.5 text-right text-(--text-secondary) tabular-nums">{sym}{fmt(row.interest)}</td>
                            <td className="px-4 py-2.5 text-right text-(--text-primary) tabular-nums font-medium">{sym}{fmt(row.balance)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Panel>
        </>
      )}
    </div>
  );
}