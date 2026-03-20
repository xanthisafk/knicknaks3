import { useState, useMemo } from "react";
import { CurrencySelector, USD } from "../../components/advanced/CurrencySelector";
import type { Currency } from "../../components/advanced/CurrencySelector";
import { CURRENCIES } from "@/lib";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui";
import StatBox from "@/components/ui/StatBox";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tabs, Tab, TabList } from "@/components/ui/tab";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MortgageChart from "./MortgageChart";
import { Panel } from "@/components/layout";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AmortisationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface YearlyRow {
  year: number;
  totalPayment: number;
  totalPrincipal: number;
  totalInterest: number;
  balance: number;
}

interface ScheduleResult {
  monthly: AmortisationRow[];
  yearly: YearlyRow[];
  totalPaid: number;
  totalInterest: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcMonthly(principal: number, annualRate: number, months: number): number {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

/**
 * Single-pass build: produces monthly rows, yearly rollups, and totals together
 * so downstream consumers don't need to re-iterate the schedule.
 */
function buildSchedule(principal: number, annualRate: number, months: number): ScheduleResult {
  const r = annualRate / 100 / 12;
  const monthlyPayment = calcMonthly(principal, annualRate, months);

  const monthly: AmortisationRow[] = [];
  // Pre-size yearly array — avoids Map overhead and repeated lookups
  const yearCount = Math.ceil(months / 12);
  const yearly: YearlyRow[] = Array.from({ length: yearCount }, (_, i) => ({
    year: i + 1,
    totalPayment: 0,
    totalPrincipal: 0,
    totalInterest: 0,
    balance: 0,
  }));

  let balance = principal;
  let totalInterest = 0;

  for (let i = 0; i < months; i++) {
    const interest = balance * r;
    const principalPaid = monthlyPayment - interest;
    balance = Math.max(0, balance - principalPaid);

    monthly.push({ month: i + 1, payment: monthlyPayment, principal: principalPaid, interest, balance });

    const yr = yearly[Math.floor(i / 12)];
    yr.totalPayment += monthlyPayment;
    yr.totalPrincipal += principalPaid;
    yr.totalInterest += interest;
    yr.balance = balance;

    totalInterest += interest;
  }

  return { monthly, yearly, totalPaid: monthlyPayment * months, totalInterest };
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LoanMortgageCalculatorTool() {
  const [currency, setCurrency] = useState<Currency>(USD);
  const [principal, setPrincipal] = useState("300000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const [showTable, setShowTable] = useState(true);
  const [scheduleView, setScheduleView] = useState<"yearly" | "monthly">("yearly");

  const sym = currency.symbol;
  const p = parseFloat(principal) || 0;
  const r = parseFloat(rate) || 0;
  const months = (parseInt(years) || 0) * 12;

  // Single memo — one pass produces everything: monthly rows, yearly rollups, totals
  const result = useMemo<ScheduleResult | null>(
    () => (p > 0 && months > 0 ? buildSchedule(p, r, months) : null),
    [p, r, months]
  );

  if (!result) return (
    <Panel>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <CurrencyInputs
          currency={currency} setCurrency={setCurrency}
          principal={principal} setPrincipal={setPrincipal}
          rate={rate} setRate={setRate}
          years={years} setYears={setYears}
        />
      </div>
    </Panel>
  );

  const { monthly, yearly, totalPaid, totalInterest } = result;
  const monthlyPayment = monthly[0]?.payment ?? 0;

  return (
    <div className="space-y-2">
      <Panel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <CurrencyInputs
            currency={currency} setCurrency={setCurrency}
            principal={principal} setPrincipal={setPrincipal}
            rate={rate} setRate={setRate}
            years={years} setYears={setYears}
          />
        </div>
      </Panel>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <StatBox label="per month" prefix="monthly payment" value={`${sym}${fmt(monthlyPayment)}`} />
        <StatBox label="Total Interest" prefix="total interest" value={`${sym}${fmt(totalInterest)}`} />
        <StatBox label="Total Amount Paid" prefix="total amount paid" value={`${sym}${fmt(totalPaid)}`} />
      </div>

      <Panel className="py-4">
        {/* yearly already computed — chart receives it directly, no re-derivation */}
        <MortgageChart data={yearly} sym={sym} />
      </Panel>

      <Panel className="p-0 overflow-hidden">
        <SectionHeader
          title="Amortisation Schedule"
          open={showTable}
          onToggle={() => setShowTable(v => !v)}
        />

        {showTable && (
          <div>
            <div className="flex gap-2 px-5 py-3">
              <Tabs className="w-full" value={scheduleView} onValueChange={v => setScheduleView(v as "yearly" | "monthly")}>
                <TabList>
                  <Tab value="yearly">Yearly</Tab>
                  <Tab value="monthly">Monthly</Tab>
                </TabList>
              </Tabs>
            </div>

            <div className="overflow-x-auto max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{scheduleView === "yearly" ? "Year" : "Month"}</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Principal</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduleView === "yearly"
                    ? yearly.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell>{row.year}</TableCell>
                        <TableCell>{sym}{fmt(row.totalPayment)}</TableCell>
                        <TableCell>{sym}{fmt(row.totalPrincipal)}</TableCell>
                        <TableCell>{sym}{fmt(row.totalInterest)}</TableCell>
                        <TableCell>{sym}{fmt(row.balance)}</TableCell>
                      </TableRow>
                    ))
                    : monthly.map((row) => (
                      <TableRow key={row.month}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell>{sym}{fmt(row.payment)}</TableCell>
                        <TableCell>{sym}{fmt(row.principal)}</TableCell>
                        <TableCell>{sym}{fmt(row.interest)}</TableCell>
                        <TableCell>{sym}{fmt(row.balance)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}

// ─── Extracted input group — prevents re-rendering the whole page on input change ──

interface InputsProps {
  currency: Currency; setCurrency: (c: Currency) => void;
  principal: string; setPrincipal: (v: string) => void;
  rate: string; setRate: (v: string) => void;
  years: string; setYears: (v: string) => void;
}

function CurrencyInputs({ currency, setCurrency, principal, setPrincipal, rate, setRate, years, setYears }: InputsProps) {
  return (
    <>
      <div>
        <Select label="Currency" value={currency.code} onValueChange={v => setCurrency(CURRENCIES.find(c => c.code === v) || USD)}>
          <SelectTrigger>{currency.symbol} {currency.name}</SelectTrigger>
          <SelectContent>
            {CURRENCIES.map(c => (
              <SelectItem key={c.code} value={c.code}>{c.symbol} {c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Input leadingText={currency.symbol} label="Loan Amount" type="number"
          value={principal} onChange={e => setPrincipal(e.target.value)} min={0} step={1000} />
      </div>
      <div>
        <Input label="Annual Interest Rate" type="number"
          value={rate} onChange={e => setRate(e.target.value)} min={0} max={50} step={0.1} trailingText="%" />
      </div>
      <div>
        <Input label="Loan Term" type="number"
          value={years} onChange={e => setYears(e.target.value)} min={1} max={50} step={1} trailingText="yrs" />
      </div>
    </>
  );
}