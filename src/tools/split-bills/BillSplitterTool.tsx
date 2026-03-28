import { useState, useMemo, useCallback } from "react";
import { Plus, AlertTriangle, Split, Receipt, Percent, DollarSign } from "lucide-react";
import { USD } from "../../components/advanced/CurrencySelector";
import type { Currency } from "../../components/advanced/CurrencySelector";
import { Panel } from "@/components/layout";
import { Box, Container } from "@/components/layout/Primitive";
import { Button, Input, Label } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { CURRENCIES } from "@/lib";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { fmt, fmtPct, parseNum } from "./helpers";
import { PersonRow, type Person } from "./PersonRow";

let idCounter = 0;
function uid() { return ++idCounter; }



const TIP_PRESETS = [0, 10, 15, 18, 20, 25];

export default function BillSplitterTool() {
  const [currency, setCurrency] = useState<Currency>(USD);

  // Bill inputs — all stored as raw strings for controlled inputs
  const [subtotal, setSubtotal] = useState("100.00");
  const [taxPct, setTaxPct] = useState("8.5");
  const [tipMode, setTipMode] = useState<"percent" | "amount">("percent");
  const [tipPct, setTipPct] = useState("18");
  const [tipAmtInput, setTipAmtInput] = useState("");

  const [people, setPeople] = useState<Person[]>([
    { id: uid(), name: "", share: 50 },
    { id: uid(), name: "", share: 50 },
  ]);

  // ─── Derived amounts (single source of truth) ────────────────────────────

  const subtotalAmt = parseNum(subtotal);
  const taxAmt = subtotalAmt * (parseNum(taxPct) / 100);

  const tipAmt = useMemo(() => {
    if (tipMode === "amount") {
      return parseNum(tipAmtInput);
    }
    return subtotalAmt * (parseNum(tipPct) / 100);
  }, [tipMode, tipAmtInput, tipPct, subtotalAmt]);

  const activeTipPct = useMemo(() => {
    if (tipMode === "percent") return parseNum(tipPct);
    return subtotalAmt > 0 ? (tipAmt / subtotalAmt) * 100 : 0;
  }, [tipMode, tipPct, tipAmt, subtotalAmt]);

  const grandTotal = subtotalAmt + taxAmt + tipAmt;

  const totalSharePct = useMemo(
    () => people.reduce((s, p) => s + (p.share || 0), 0),
    [people]
  );
  const remaining = 100 - totalSharePct;
  const isBalanced = Math.abs(remaining) < 0.01;

  const addPerson = useCallback(() => {
    if (people.length >= 10) return;
    const newCount = people.length + 1;
    const eq = parseFloat((100 / newCount).toFixed(1));
    setPeople((prev) => {
      const updated = prev.map((p, i) =>
        i === 0
          ? { ...p, share: parseFloat((100 - eq * (newCount - 1)).toFixed(1)) }
          : { ...p, share: eq }
      );
      return [...updated, { id: uid(), name: "", share: eq }];
    });
  }, [people.length]);

  const removePerson = useCallback((id: number) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updatePerson = useCallback(
    (id: number, field: "name" | "share", val: string) => {
      setPeople((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, [field]: field === "share" ? parseNum(val) : val }
            : p
        )
      );
    },
    []
  );

  const equalizeShares = useCallback(() => {
    const count = people.length;
    const eq = parseFloat((100 / count).toFixed(1));
    setPeople((prev) =>
      prev.map((p, i) => ({
        ...p,
        share:
          i === count - 1
            ? parseFloat((100 - eq * (count - 1)).toFixed(1))
            : eq,
      }))
    );
  }, [people.length]);

  const sym = currency.symbol;


  return (
    <Container>
      {/* ── Bill Details ── */}
      <Panel>
        <Label icon={Receipt}>Bill Details</Label>


        <Container cols={2}>
          {/* Currency */}
          <Select
            label="Currency"
            value={currency.code}
            onValueChange={(v) =>
              setCurrency(CURRENCIES.find((c) => c.code === v) || USD)
            }
          >
            <SelectTrigger>
              {currency.symbol} {currency.name}
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.symbol} {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Subtotal */}
          <Input
            label="Subtotal"
            type="number"
            value={subtotal}
            onChange={(e) => setSubtotal(e.target.value)}
            placeholder="0.00"
            leadingText={sym}
            handlePaste={setSubtotal}
            min={0}
          />

          {/* Tax % */}
          <Input
            label="Tax %"
            type="number"
            value={taxPct}
            onChange={(e) => setTaxPct(e.target.value)}
            placeholder="0"
            trailingText="%"
            handlePaste={setTaxPct}
            min={0}
          />

          {/* Tax Amount — read-only derived */}
          <Input
            label="Tax Amount"
            value={fmt(taxAmt)}
            disabled
            leadingText={sym}
          />
        </Container>

        {/* Tip row — mode toggle + presets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Tip</Label>
            <div className="flex gap-1">
              <Button
                size="xs"
                variant={tipMode === "percent" ? "secondary" : "ghost"}
                onClick={() => setTipMode("percent")}
                icon={Percent}
              >
              </Button>
              <Button
                size="xs"
                variant={tipMode === "amount" ? "secondary" : "ghost"}
                onClick={() => setTipMode("amount")}
                icon={DollarSign}
              >
              </Button>
            </div>
          </div>

          {/* Presets */}
          <Container>

            {tipMode === "percent" ? (
              <>
                <Container cols={2}>
                  <Input
                    type="number"
                    value={tipPct}
                    onChange={(e) => setTipPct(e.target.value)}
                    placeholder="0"
                    trailingText="%"
                    min={0}
                  />
                  <Input
                    value={fmt(tipAmt)}
                    placeholder="0.00"
                    leadingText={sym}
                    min={0}
                    disabled
                  />
                </Container>
                <RadioGroup
                  orientation="horizontal"
                  value={tipMode === "percent" ? tipPct : ""}
                  onValueChange={(v) => setTipPct(v)}
                >
                  {TIP_PRESETS.map((pct) => (
                    <Radio key={pct} value={String(pct)} label={`${pct}%`} />
                  ))}
                </RadioGroup>
              </>
            ) : (
              <Input
                type="number"
                value={tipAmtInput}
                onChange={(e) => setTipAmtInput(e.target.value)}
                placeholder="0.00"
                trailingText={sym}
                min={0}
                helperText={
                  subtotalAmt > 0
                    ? `${fmtPct(activeTipPct)}% of subtotal`
                    : undefined
                }
              />
            )}

          </Container>

        </div>
      </Panel>

      {/* ── Split Between ── */}
      <Panel>
        <div className="flex items-center justify-between">
          <Label>Split Between ({people.length})</Label>
          <div className="flex gap-2">
            <Button
              onClick={equalizeShares}
              variant="ghost"
              icon={Split}
              size="xs"
            >
              Equal split
            </Button>
            {people.length < 10 && (
              <Button
                onClick={addPerson}
                variant="secondary"
                icon={Plus}
                size="xs"
              >
                Add person
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {people.map((person, i) => (
            <PersonRow
              key={person.id}
              person={person}
              index={i}
              grandTotal={grandTotal}
              sym={sym}
              onChange={updatePerson}
              onRemove={removePerson}
              canRemove={people.length > 2}
            />
          ))}
        </div>

        {/* Share balance indicator */}
        <div className="flex items-center justify-between pt-1">
          {isBalanced ? (
            <Label variant="success">✓ Shares add up to 100%</Label>
          ) : remaining > 0 ? (
            <Label variant="warning" icon={AlertTriangle}>
              {fmtPct(remaining)}% unassigned
            </Label>
          ) : (
            <Label variant="danger" icon={AlertTriangle}>
              {fmtPct(Math.abs(remaining))}% over 100%
            </Label>
          )}
          {!isBalanced && (
            <Button
              size="xs"
              variant="ghost"
              onClick={() => {
                setPeople((prev) => {
                  const last = prev[prev.length - 1];
                  return prev.map((p, i) =>
                    i === prev.length - 1
                      ? { ...p, share: parseFloat((last.share + remaining).toFixed(1)) }
                      : p
                  );
                });
              }}
            >
              Auto-fix
            </Button>
          )}
        </div>
      </Panel>

      {/* ── Summary ── */}
      <Panel>
        <Label>Summary</Label>

        <div>
          {[
            { label: "Subtotal", value: `${sym}${fmt(subtotalAmt)}` },
            {
              label: `Tax (${fmtPct(parseNum(taxPct))}%)`,
              value: `+${sym}${fmt(taxAmt)}`,
            },
            {
              label: `Tip (${fmtPct(activeTipPct)}%)`,
              value: `+${sym}${fmt(tipAmt)}`,
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between py-2 border-b border-(--border-default) last:border-0"
            >
              <Label>{label}</Label>
              <span className="text-sm tabular-nums text-(--text-secondary)">
                {value}
              </span>
            </div>
          ))}

          <div className="flex justify-between items-center pt-3 mt-1">
            <h3>Grand Total</h3>
            <span className="text-xl font-bold tabular-nums text-primary-500">
              {sym}{fmt(grandTotal)}
            </span>
          </div>
        </div>

        {/* Per-person breakdown */}
        {people.length > 0 && isBalanced && grandTotal > 0 && (
          <Box>
            <Label>Per person</Label>
            <div className="space-y-1">
              {people.map((p, i) => {
                const owes = grandTotal * (p.share / 100);
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between py-1.5 border-b border-(--border-default) last:border-0"
                  >
                    <span className="text-sm text-(--text-secondary)">
                      {p.name.trim() || `Person ${i + 1}`}
                      <span className="text-(--text-tertiary) ml-1">
                        ({fmtPct(p.share)}%)
                      </span>
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-(--text-primary)">
                      {sym}{fmt(owes)}
                    </span>
                  </div>
                );
              })}
            </div>
          </Box>
        )}

        {!isBalanced && (
          <Label variant="warning" icon={AlertTriangle}>
            Shares must total 100% to show final amounts
          </Label>
        )}
      </Panel>
    </Container>
  );
}