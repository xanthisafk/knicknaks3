import { useState, useMemo } from "react";
import { ToWords } from "to-words";
import { Input, Label } from "@/components/ui";
import { Panel } from "@/components/layout";
import { CURRENCIES } from "@/lib";
import { ResultRow } from "@/components/advanced/ResultRow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { TriangleAlert } from "lucide-react";

// ─── Locale mapping ───────────────────────────────────────────────────────────
// Maps each currency code to the best to-words locale.

const CURRENCY_LOCALE: Record<string, string> = {
  // Indian numbering — lakh, crore, arab...
  INR: "en-IN",

  // East Asian
  JPY: "ja-JP",
  CNY: "zh-CN",
  KRW: "ko-KR",

  // European
  EUR: "de-DE",
  GBP: "en-GB",
  CHF: "de-CH",
  SEK: "sv-SE",
  NOK: "nb-NO",
  DKK: "da-DK",
  PLN: "pl-PL",
  CZK: "cs-CZ",
  HUF: "hu-HU",
  TRY: "tr-TR",
  RUB: "ru-RU",

  // Middle-East / Africa
  SAR: "ar-SA",
  AED: "ar-AE",
  ILS: "he-IL",
  NGN: "en-NG",
  ZAR: "en-ZA",

  // South / South-East Asia
  THB: "th-TH",
  VND: "vi-VN",
  IDR: "id-ID",
  MYR: "ms-MY",
  SGD: "en-SG",

  // Americas & Oceania
  USD: "en-US",
  CAD: "en-US",
  AUD: "en-AU",
  BRL: "pt-BR",
  MXN: "es-MX",
  NZD: "en-NZ",
  HKD: "en-HK",
};

// Currency name overrides for locales that would otherwise use a wrong default
type CurrencyOverride = {
  name: string;
  plural: string;
  symbol: string;
  fractionalUnit: { name: string; plural: string; symbol: string };
};

const CURRENCY_OPTS: Record<string, CurrencyOverride> = {
  CAD: { name: "Dollar", plural: "Dollars", symbol: "C$", fractionalUnit: { name: "Cent", plural: "Cents", symbol: "" } },
  AUD: { name: "Dollar", plural: "Dollars", symbol: "A$", fractionalUnit: { name: "Cent", plural: "Cents", symbol: "" } },
  NZD: { name: "Dollar", plural: "Dollars", symbol: "NZ$", fractionalUnit: { name: "Cent", plural: "Cents", symbol: "" } },
  SGD: { name: "Dollar", plural: "Dollars", symbol: "S$", fractionalUnit: { name: "Cent", plural: "Cents", symbol: "" } },
  HKD: { name: "Dollar", plural: "Dollars", symbol: "HK$", fractionalUnit: { name: "Cent", plural: "Cents", symbol: "" } },
  GBP: { name: "Pound", plural: "Pounds", symbol: "£", fractionalUnit: { name: "Penny", plural: "Pence", symbol: "" } },
  CHF: { name: "Franc", plural: "Francs", symbol: "₣", fractionalUnit: { name: "Rappen", plural: "Rappen", symbol: "" } },
  NGN: { name: "Naira", plural: "Naira", symbol: "₦", fractionalUnit: { name: "Kobo", plural: "Kobo", symbol: "" } },
  ZAR: { name: "Rand", plural: "Rand", symbol: "R", fractionalUnit: { name: "Cent", plural: "Cents", symbol: "" } },
  MYR: { name: "Ringgit", plural: "Ringgit", symbol: "RM", fractionalUnit: { name: "Sen", plural: "Sen", symbol: "" } },
  IDR: { name: "Rupiah", plural: "Rupiah", symbol: "Rp", fractionalUnit: { name: "Sen", plural: "Sen", symbol: "" } },
};

// ─── Converter factory ────────────────────────────────────────────────────────

function makeConverter(currencyCode: string, forCurrency: boolean) {
  const localeCode = CURRENCY_LOCALE[currencyCode] ?? "en-US";
  const currencyOptions = CURRENCY_OPTS[currencyCode];

  return new ToWords({
    localeCode,
    converterOptions: {
      currency: forCurrency,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      ...(forCurrency && currencyOptions ? { currencyOptions } : {}),
    },
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

const DEFAULT_CURRENCY = "INR";

export default function NumberToWordsTool() {
  const [input, setInput] = useState("");
  const [currencyCode, setCurrencyCode] = useState(DEFAULT_CURRENCY);

  const result = useMemo(() => {
    const raw = input.trim().replace(/,/g, "");
    if (!raw) return null;

    const n = parseFloat(raw);
    if (isNaN(n)) return { error: "Please enter a valid number" };
    if (Math.abs(n) > 999_999_999_999_999)
      return { error: "Number too large (max: 999 trillion)" };

    try {
      const wordsConverter = makeConverter(currencyCode, false);
      const currencyConverter = makeConverter(currencyCode, true);
      return {
        words: wordsConverter.convert(n),
        currency: currencyConverter.convert(Math.abs(n)),
      };
    } catch (e: unknown) {
      return { error: e instanceof Error ? e.message : "Conversion failed" };
    }
  }, [input, currencyCode]);

  const selectedCurrency = CURRENCIES.find((c) => c.code === currencyCode);

  return (
    <div className="space-y-2">
      <Panel className="flex flex-col md:flex-row gap-2">
        <div className="flex-1">
          <Select label="Currency" value={currencyCode} onValueChange={setCurrencyCode}>
            <SelectTrigger>
              {selectedCurrency
                ? `${selectedCurrency.symbol}  ${selectedCurrency.name}`
                : "Select Currency"}
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.symbol}&nbsp;&nbsp;{c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Input
          label="Number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 500000 or 3.14"
          className="font-mono flex-1"
          inputMode="decimal"
        />
      </Panel>

      {result && (
        <Panel className="space-y-2">
          {"error" in result
            ? <Label icon={TriangleAlert} variant="danger">{result.error}</Label>
            : [
              { label: "In Words", value: result.words },
              {
                label: `Currency (${selectedCurrency?.symbol ?? currencyCode})`,
                value: result.currency,
              },
            ].map((r) => (
              <ResultRow key={r.label} label={r.label} value={r.value} />
            ))}
        </Panel>
      )}
    </div>
  );
}