import { useState, useMemo, useEffect } from "react";
import { Users, Receipt, Percent, Plus, Minus, Trash2, ChevronDown } from "lucide-react";
import { CurrencySelector, USD } from "../../components/advanced/CurrencySelector";
import type { Currency } from "../../components/advanced/CurrencySelector";
import { Panel } from "@/components/layout";
import { Container } from "@/components/layout/Primitive";
import { Input } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { CURRENCIES } from "@/lib";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtPct(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

let idCounter = 0;
function uid() { return ++idCounter; }

// ─── Types ────────────────────────────────────────────────────────────────────

interface Person {
  id: number;
  name: string;
  share: number; // percentage 0–100
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Label({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[var(--text-secondary)] uppercase mb-2">
      {icon && <span className="opacity-60">{icon}</span>}
      {children}
    </label>
  );
}

function NumericInput({
  value, onChange, prefix, suffix, placeholder, step = "0.01", min = "0",
}: {
  value: string; onChange: (v: string) => void;
  prefix?: React.ReactNode; suffix?: string;
  placeholder?: string; step?: string; min?: string;
}) {
  return (
    <div className="flex items-center h-10 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-bg)] overflow-hidden focus-within:border-[var(--color-primary-500)] transition-colors">
      {prefix && <div className="flex items-center pl-3 text-[var(--text-tertiary)] shrink-0">{prefix}</div>}
      <input
        type="number"
        value={value}
        min={min}
        step={step}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 min-w-0 px-3 text-sm bg-transparent text-[var(--text-primary)] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {suffix && <span className="pr-3 text-sm text-[var(--text-tertiary)] shrink-0">{suffix}</span>}
    </div>
  );
}

const TIP_PRESETS = [0, 10, 15, 18, 20, 25];

// ─── Share bar ────────────────────────────────────────────────────────────────

function ShareBar({ people }: { people: Person[] }) {
  const colors = [
    "bg-[var(--color-primary-500)]",
    "bg-violet-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-rose-500",
    "bg-sky-500",
    "bg-fuchsia-500",
    "bg-orange-500",
  ];

  const total = people.reduce((s, p) => s + p.share, 0);
  const remainder = Math.max(0, 100 - total);

  return (
    <div className="flex h-2 w-full rounded-full overflow-hidden gap-px bg-[var(--border-default)]">
      {people.map((p, i) => (
        <div
          key={p.id}
          className={`${colors[i % colors.length]} transition-all duration-300`}
          style={{ width: `${p.share}%` }}
        />
      ))}
      {remainder > 0 && (
        <div className="bg-[var(--surface-raised)] transition-all duration-300" style={{ width: `${remainder}%` }} />
      )}
    </div>
  );
}

// ─── Person row ───────────────────────────────────────────────────────────────

const personColors = [
  "text-[var(--color-primary-500)] bg-[var(--color-primary-500)]/10 border-[var(--color-primary-500)]/20",
  "text-violet-500 bg-violet-500/10 border-violet-500/20",
  "text-amber-500 bg-amber-500/10 border-amber-500/20",
  "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  "text-rose-500 bg-rose-500/10 border-rose-500/20",
  "text-sky-500 bg-sky-500/10 border-sky-500/20",
  "text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/20",
  "text-orange-500 bg-orange-500/10 border-orange-500/20",
];

function PersonRow({
  person, index, totalOwed, sym, onChange, onRemove, canRemove,
}: {
  person: Person; index: number; totalOwed: number; sym: string;
  onChange: (id: number, field: "name" | "share", val: string) => void;
  onRemove: (id: number) => void;
  canRemove: boolean;
}) {
  const colorClass = personColors[index % personColors.length];
  const owes = totalOwed * (person.share / 100);

  return (
    <div className="flex items-center gap-3 py-3 border-b border-[var(--border-default)] last:border-0">
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${colorClass}`}>
        {person.name.trim() ? person.name.trim()[0].toUpperCase() : (index + 1)}
      </div>

      {/* Name */}
      <input
        type="text"
        value={person.name}
        placeholder={`Person ${index + 1}`}
        onChange={(e) => onChange(person.id, "name", e.target.value)}
        className="flex-1 min-w-0 text-sm bg-transparent text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
      />

      {/* Share input */}
      <div className="flex items-center h-8 w-24 rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-bg)] focus-within:border-[var(--color-primary-500)] transition-colors overflow-hidden">
        <input
          type="number"
          value={person.share}
          min={0}
          max={100}
          step={1}
          onChange={(e) => onChange(person.id, "share", e.target.value)}
          className="flex-1 min-w-0 pl-2 text-sm bg-transparent text-[var(--text-primary)] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="pr-2 text-xs text-[var(--text-tertiary)]">%</span>
      </div>

      {/* Owes */}
      <span className="text-sm font-semibold tabular-nums text-[var(--text-primary)] w-20 text-right shrink-0">
        {sym}{fmt(owes)}
      </span>

      {/* Remove */}
      {canRemove && (
        <button
          onClick={() => onRemove(person.id)}
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
        >
          <Trash2 size={13} />
        </button>
      )}
      {!canRemove && <div className="w-7 shrink-0" />}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function BillSplitterTool() {
  const [currency, setCurrency] = useState<Currency>(USD);
  const [subtotal, setSubtotal] = useState("100.00");
  const [taxPct, setTaxPct] = useState("8.5");
  const [taxAmt, setTaxAmt] = useState("0");
  const [tipPct, setTipPct] = useState("18");
  const [tipAmt, setTipAmt] = useState("0");
  const [customTip, setCustomTip] = useState("");
  const [useCustomTip, setUseCustomTip] = useState(false);
  const [people, setPeople] = useState<Person[]>([
    { id: uid(), name: "", share: 50 },
    { id: uid(), name: "", share: 50 },
  ]);

  useEffect(() => {
    setTaxAmt(fmt(subtotalAmt * ((parseFloat(taxPct) || 0) / 100)));
  }, [subtotal, taxPct]);

  useEffect(() => {
    setTipAmt(fmt(subtotalAmt * (parseFloat(tipPct) || 0) / 100));
  }, [subtotal, tipPct]);

  const sym = currency.symbol;
  const subtotalAmt = parseFloat(subtotal) || 0;
  const taxAmt1 = subtotalAmt * ((parseFloat(taxPct) || 0) / 100);
  const activeTipPct = useCustomTip ? (parseFloat(customTip) || 0) : parseFloat(tipPct);
  const tipAmt1 = subtotalAmt * (activeTipPct / 100);
  const grandTotal = subtotalAmt + taxAmt + tipAmt;

  const totalSharePct = useMemo(() => people.reduce((s, p) => s + (p.share || 0), 0), [people]);
  const remaining = Math.max(0, 100 - totalSharePct);
  const isBalanced = Math.abs(totalSharePct - 100) < 0.01;

  function addPerson() {
    if (people.length >= 8) return;
    const equalShare = parseFloat((100 / (people.length + 1)).toFixed(1));
    setPeople((prev) => [...prev, { id: uid(), name: "", share: equalShare }]);
  }

  function removePerson(id: number) {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }

  function updatePerson(id: number, field: "name" | "share", val: string) {
    setPeople((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, [field]: field === "share" ? parseFloat(val) || 0 : val }
          : p
      )
    );
  }

  function equalizeShares() {
    const eq = parseFloat((100 / people.length).toFixed(1));
    const adjusted = people.map((p, i) => ({
      ...p,
      share: i === people.length - 1
        ? parseFloat((100 - eq * (people.length - 1)).toFixed(1))
        : eq,
    }));
    setPeople(adjusted);
  }

  return (
    <div className="space-y-4">
      <Container>
        {/* Bill Details */}
        <Panel>
          <Container cols={2}>
            <Select
              label="Currency"
              value={currency.code}
              onValueChange={v => setCurrency(CURRENCIES.find(c => c.code === v) || USD)}
            >
              <SelectTrigger>
                {currency.symbol} {currency.name}
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map(c => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.symbol} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              label="Subtotal"
              type="number"
              value={subtotal}
              onChange={e => setSubtotal(e.target.value)}
              placeholder="0"
              trailingText={currency.symbol}
              handlePaste={setSubtotal}
            />
            <Input
              label="Tax %"
              type="number"
              value={taxPct}
              onChange={e => setTaxPct(e.target.value)}
              placeholder="0"
              trailingText="%"
              handlePaste={setTaxPct}
            />
            <Input
              label="Tax Amount"
              type="number"
              value={fmt(parseFloat(taxAmt))}
              onChange={e => setTaxAmt(e.target.value)}
              placeholder="0"
              trailingText={currency.symbol}
              handlePaste={setTaxAmt}
            />
            <Input
              type="number"
              label="Tip %"
              value={fmt(parseFloat(tipAmt))}
              onChange={e => setTipPct(e.target.value)}
              placeholder="0"
              trailingText={currency.symbol}
              handlePaste={setTipPct}
              helperText={`Amount: ${fmt(parseFloat(tipAmt))}`}
            />
            <Input
              type="number"
              label="Tip Amount"
              value={fmt(parseFloat(tipAmt))}
              onChange={e => setTipAmt(e.target.value)}
              placeholder="0"
              trailingText={currency.symbol}
              handlePaste={setTipAmt}
            />
          </Container>
        </Panel>
      </Container>

      {/* ── People & Shares ── */}
      <Panel>
        <div className="flex items-center justify-between mb-3">
          <Label icon={<Users size={12} />}>Split Between</Label>
          <div className="flex items-center gap-2">
            <button
              onClick={equalizeShares}
              className="text-[11px] px-2.5 py-1 rounded-[var(--radius-sm)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-primary-500)]/50 transition-colors"
            >
              Split equally
            </button>
            {people.length < 8 && (
              <button
                onClick={addPerson}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-[var(--radius-sm)] border border-[var(--color-primary-500)]/40 text-[var(--color-primary-500)] hover:bg-[var(--color-primary-500)]/10 transition-colors"
              >
                <Plus size={11} />
                Add person
              </button>
            )}
          </div>
        </div>

        {/* Share bar */}
        <ShareBar people={people} />

        {/* Status */}
        <div className="flex items-center justify-between mt-2 mb-1">
          <span className="text-[11px] text-[var(--text-tertiary)]">
            {isBalanced
              ? "✓ Shares add up to 100%"
              : remaining > 0
                ? `${fmtPct(remaining)}% unassigned`
                : `${fmtPct(Math.abs(remaining))}% over 100%`}
          </span>
          <span className={`text-[11px] font-semibold ${isBalanced ? "text-emerald-500" : "text-amber-500"}`}>
            {fmtPct(totalSharePct)}% / 100%
          </span>
        </div>

        {/* Column headers */}
        <div className="flex items-center gap-3 pt-2 pb-1 border-b border-[var(--border-default)]">
          <div className="w-8 shrink-0" />
          <span className="flex-1 text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide">Name</span>
          <span className="w-24 text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide text-center">Share</span>
          <span className="w-20 text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide text-right">Owes</span>
          <div className="w-7 shrink-0" />
        </div>

        {/* Person rows */}
        {people.map((person, i) => (
          <PersonRow
            key={person.id}
            person={person}
            index={i}
            totalOwed={parseFloat(grandTotal)}
            sym={sym}
            onChange={updatePerson}
            onRemove={removePerson}
            canRemove={people.length > 2}
          />
        ))}
      </Panel>

      {/* ── Summary ── */}
      {subtotalAmt > 0 && (
        <Panel>
          <p className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-3">Summary</p>

          <div className="space-y-0">
            {[
              { label: "Subtotal", value: `${sym}${fmt(subtotalAmt)}` },
              { label: `Tax (${parseFloat(taxPct) || 0}%)`, value: `${sym}${fmt(parseFloat(taxAmt))}` },
              { label: `Tip (${activeTipPct}%)`, value: `${sym}${fmt(parseFloat(tipAmt))}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2 border-b border-[var(--border-default)] last:border-0">
                <span className="text-sm text-[var(--text-secondary)]">{label}</span>
                <span className="text-sm tabular-nums text-[var(--text-primary)]">{value}</span>
              </div>
            ))}

            <div className="flex justify-between items-center pt-3 mt-1">
              <span className="text-sm font-bold text-[var(--text-primary)]">Grand Total</span>
              <span className="text-xl font-bold tabular-nums text-[var(--color-primary-500)]">
                {sym}{fmt(parseFloat(grandTotal))}
              </span>
            </div>
          </div>

          {/* Per-person breakdown */}
          {people.length > 0 && isBalanced && (
            <div className="mt-4 pt-4 border-t border-[var(--border-default)]">
              <p className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-2">Each Person Pays</p>
              <div className="space-y-2">
                {people.map((p, i) => {
                  const owes = parseFloat(grandTotal) * (p.share / 100);
                  const colorClass = personColors[i % personColors.length];
                  return (
                    <div key={p.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold ${colorClass}`}>
                          {p.name.trim() ? p.name.trim()[0].toUpperCase() : i + 1}
                        </div>
                        <span className="text-sm text-[var(--text-secondary)]">
                          {p.name.trim() || `Person ${i + 1}`}
                          <span className="text-[var(--text-tertiary)] ml-1">({fmtPct(p.share)}%)</span>
                        </span>
                      </div>
                      <span className="text-sm font-semibold tabular-nums text-[var(--text-primary)]">
                        {sym}{fmt(owes)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!isBalanced && (
            <p className="mt-3 text-[11px] text-amber-500">
              ⚠ Shares must total 100% before final amounts are shown.
            </p>
          )}
        </Panel>
      )}
    </div>
  );
}