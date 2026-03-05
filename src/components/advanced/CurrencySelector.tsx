import { useState, useRef, useEffect } from "react";

// ─── Currency Data ────────────────────────────────────────────────────────────

export interface Currency {
  symbol: string;
  code: string;
  name: string;
}

export const CURRENCIES: Currency[] = [
  { symbol: "$",  code: "USD", name: "US Dollar"        },
  { symbol: "€",  code: "EUR", name: "Euro"             },
  { symbol: "£",  code: "GBP", name: "British Pound"    },
  { symbol: "¥",  code: "JPY", name: "Japanese Yen"     },
  { symbol: "¥",  code: "CNY", name: "Chinese Yuan"     },
  { symbol: "₹",  code: "INR", name: "Indian Rupee"     },
  { symbol: "₩",  code: "KRW", name: "South Korean Won" },
  { symbol: "₣",  code: "CHF", name: "Swiss Franc"      },
  { symbol: "C$", code: "CAD", name: "Canadian Dollar"  },
  { symbol: "A$", code: "AUD", name: "Australian Dollar"},
  { symbol: "R$", code: "BRL", name: "Brazilian Real"   },
  { symbol: "₽",  code: "RUB", name: "Russian Ruble"    },
  { symbol: "kr", code: "SEK", name: "Swedish Krona"    },
  { symbol: "kr", code: "NOK", name: "Norwegian Krone"  },
  { symbol: "kr", code: "DKK", name: "Danish Krone"     },
  { symbol: "zł", code: "PLN", name: "Polish Złoty"     },
  { symbol: "Kč", code: "CZK", name: "Czech Koruna"     },
  { symbol: "Ft", code: "HUF", name: "Hungarian Forint" },
  { symbol: "₺",  code: "TRY", name: "Turkish Lira"     },
  { symbol: "﷼",  code: "SAR", name: "Saudi Riyal"      },
  { symbol: "د.إ",code: "AED", name: "UAE Dirham"       },
  { symbol: "₪",  code: "ILS", name: "Israeli Shekel"   },
  { symbol: "฿",  code: "THB", name: "Thai Baht"        },
  { symbol: "₫",  code: "VND", name: "Vietnamese Dong"  },
  { symbol: "Rp", code: "IDR", name: "Indonesian Rupiah"},
  { symbol: "RM", code: "MYR", name: "Malaysian Ringgit"},
  { symbol: "₦",  code: "NGN", name: "Nigerian Naira"   },
  { symbol: "R",  code: "ZAR", name: "South African Rand"},
  { symbol: "MX$",code: "MXN", name: "Mexican Peso"     },
  { symbol: "S$", code: "SGD", name: "Singapore Dollar" },
  { symbol: "HK$",code: "HKD", name: "Hong Kong Dollar" },
  { symbol: "NZ$",code: "NZD", name: "New Zealand Dollar"},
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface CurrencySelectorProps {
  value: Currency;
  onChange: (currency: Currency) => void;
  /** If true, renders as a compact badge (for use inside an input prefix slot) */
  compact?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CurrencySelector({ value, onChange, compact = false }: CurrencySelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Focus search when opening
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const filtered = query.trim()
    ? CURRENCIES.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.code.toLowerCase().includes(query.toLowerCase()) ||
          c.symbol.includes(query)
      )
    : CURRENCIES;

  const handleSelect = (currency: Currency) => {
    onChange(currency);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={`${value.name} (${value.code}) — click to change currency`}
        className={`
          flex items-center gap-1 font-medium transition-all select-none group rounded-md border border-[var(--border-default)]
          ${compact
            ? `px-3 h-full text-sm border-r border-[var(--border-default)]
               bg-[var(--surface-elevated)] text-[var(--text-secondary)]
               hover:text-[var(--color-primary-500)] hover:bg-[var(--color-primary-500)]/5`
            : `px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--border-default)]
               bg-[var(--surface-bg)] text-[var(--text-secondary)]
               hover:text-[var(--text-primary)] hover:border-[var(--color-primary-500)]`
          }
          ${open ? "text-[var(--color-primary-500)]" : ""}
        `}
      >
        <span className="tabular-nums">{value.symbol}</span>
        <svg
          className={`w-3 h-3 opacity-50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12" fill="none"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute left-0 top-full mt-1.5 z-50
            w-64 rounded-[var(--radius-lg)] border border-[var(--border-default)]
            bg-[var(--surface-elevated)] shadow-xl
            flex flex-col overflow-hidden
          "
          style={{ maxHeight: "320px" }}
        >
          {/* Search */}
          <div className="p-2 border-b border-[var(--border-default)]">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search currency…"
              className="
                w-full px-3 py-1.5 text-xs rounded-[var(--radius-sm)]
                border border-[var(--border-default)] bg-[var(--surface-bg)]
                text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]
                outline-none focus:border-[var(--color-primary-500)] transition-colors
              "
            />
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <p className="px-4 py-6 text-xs text-center text-[var(--text-tertiary)]">No currencies found</p>
            ) : (
              filtered.map((currency) => {
                const active = currency.code === value.code;
                return (
                  <button
                    key={currency.code}
                    type="button"
                    onClick={() => handleSelect(currency)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 text-left transition-colors
                      ${active
                        ? "bg-[var(--color-primary-500)]/10 text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-bg)] hover:text-[var(--text-primary)]"
                      }
                    `}
                  >
                    {/* Symbol badge */}
                    <span
                      className={`
                        w-8 h-7 flex items-center justify-center rounded text-sm font-semibold flex-shrink-0
                        ${active
                          ? "bg-[var(--color-primary-500)] text-white"
                          : "bg-[var(--surface-bg)] border border-[var(--border-default)] text-[var(--text-primary)]"
                        }
                      `}
                    >
                      {currency.symbol.length > 2 ? currency.symbol.slice(0, 2) : currency.symbol}
                    </span>

                    <span className="flex-1 min-w-0">
                      <span className="text-xs font-medium block truncate">{currency.name}</span>
                      <span className="text-[10px] text-[var(--text-tertiary)]">{currency.code}</span>
                    </span>

                    {active && (
                      <svg className="w-3.5 h-3.5 text-[var(--color-primary-500)] flex-shrink-0" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7l3.5 3.5L12 3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Hook convenience ─────────────────────────────────────────────────────────

/** Returns the default USD currency for initialising state */
export const USD: Currency = CURRENCIES[0];