import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui";
import { Panel } from "@/components/layout";

interface FilterState {
  brightness: number;
  contrast: number;
  saturate: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
  blur: number;
  invert: number;
  opacity: number;
}

const DEFAULTS: FilterState = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
  blur: 0,
  invert: 0,
  opacity: 100,
};

const FILTER_DEFS: {
  key: keyof FilterState;
  label: string;
  min: number;
  max: number;
  unit: string;
  cssName: string;
}[] = [
  { key: "brightness", label: "Brightness", min: 0, max: 300, unit: "%", cssName: "brightness" },
  { key: "contrast", label: "Contrast", min: 0, max: 300, unit: "%", cssName: "contrast" },
  { key: "saturate", label: "Saturate", min: 0, max: 300, unit: "%", cssName: "saturate" },
  { key: "grayscale", label: "Grayscale", min: 0, max: 100, unit: "%", cssName: "grayscale" },
  { key: "sepia", label: "Sepia", min: 0, max: 100, unit: "%", cssName: "sepia" },
  { key: "hueRotate", label: "Hue Rotate", min: 0, max: 360, unit: "deg", cssName: "hue-rotate" },
  { key: "blur", label: "Blur", min: 0, max: 20, unit: "px", cssName: "blur" },
  { key: "invert", label: "Invert", min: 0, max: 100, unit: "%", cssName: "invert" },
  { key: "opacity", label: "Opacity", min: 0, max: 100, unit: "%", cssName: "opacity" },
];

function buildFilterCSS(state: FilterState): string {
  const parts: string[] = [];
  for (const def of FILTER_DEFS) {
    const val = state[def.key];
    if (val !== DEFAULTS[def.key]) {
      parts.push(`${def.cssName}(${val}${def.unit})`);
    }
  }
  return parts.length > 0 ? parts.join(" ") : "none";
}

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  isDefault: boolean;
  onChange: (v: number) => void;
  onReset: () => void;
}

function SliderRow({ label, value, min, max, unit, isDefault, onChange, onReset }: SliderRowProps) {
  return (
    <div className="grid grid-cols-[110px_1fr_60px_28px] items-center gap-3">
      <span className="text-xs text-[var(--text-tertiary)] font-medium uppercase tracking-wider">
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-[var(--border-default)] accent-[var(--color-primary-500)] cursor-pointer"
      />
      <div className="rounded-[var(--radius-sm)] bg-[var(--surface-secondary)] border border-[var(--border-default)] px-1.5 py-0.5 text-xs font-mono text-[var(--text-primary)] text-center">
        {value}{unit}
      </div>
      {!isDefault && (
        <button
          onClick={onReset}
          className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer text-xs"
          title="Reset"
        >
          ↩
        </button>
      )}
    </div>
  );
}

export default function CssFilterTool() {
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULTS });
  const [copied, setCopied] = useState(false);

  const updateFilter = useCallback((key: keyof FilterState, value: number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilter = useCallback((key: keyof FilterState) => {
    setFilters((prev) => ({ ...prev, [key]: DEFAULTS[key] }));
  }, []);

  const resetAll = useCallback(() => {
    setFilters({ ...DEFAULTS });
  }, []);

  const filterCSS = useMemo(() => buildFilterCSS(filters), [filters]);
  const fullCSS = `filter: ${filterCSS};`;
  const isDefault = filterCSS === "none";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Live Preview */}
      <Panel>
        <div className="space-y-3">
          <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">
            Preview
          </h3>
          <div
            className="rounded-[var(--radius-lg)] border border-[var(--border-default)] overflow-hidden relative"
            style={{ background: "repeating-conic-gradient(var(--border-default) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px" }}
          >
            <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-[1px]" />
            <div
              className="relative z-10 w-full aspect-video flex items-center justify-center"
              style={{ filter: filterCSS !== "none" ? filterCSS : undefined }}
            >
              {/* Colorful demo content */}
              <div className="w-full max-w-sm mx-auto p-6 space-y-3">
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-gradient-to-br from-rose-400 to-purple-500 shadow-md" />
                  <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-gradient-to-br from-cyan-400 to-blue-500 shadow-md" />
                  <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-gradient-to-br from-amber-400 to-orange-500 shadow-md" />
                  <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md" />
                </div>
                <div className="h-3 w-3/4 rounded-full bg-gradient-to-r from-indigo-400 to-pink-400" />
                <div className="h-3 w-1/2 rounded-full bg-gradient-to-r from-yellow-400 to-red-400" />
                <div className="h-3 w-5/6 rounded-full bg-gradient-to-r from-green-400 to-cyan-400" />
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* Filter Controls */}
      <Panel>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">
              Filters
            </h3>
            {!isDefault && (
              <button
                onClick={resetAll}
                className="text-xs text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] hover:underline transition-colors cursor-pointer font-medium"
              >
                Reset All
              </button>
            )}
          </div>

          <div className="space-y-4">
            {FILTER_DEFS.map((def) => (
              <SliderRow
                key={def.key}
                label={def.label}
                value={filters[def.key]}
                min={def.min}
                max={def.max}
                unit={def.unit}
                isDefault={filters[def.key] === DEFAULTS[def.key]}
                onChange={(v) => updateFilter(def.key, v)}
                onReset={() => resetFilter(def.key)}
              />
            ))}
          </div>
        </div>
      </Panel>

      {/* CSS Output */}
      <Panel>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">
              CSS Output
            </h3>
            <Button onClick={handleCopy} size="sm" variant={copied ? "primary" : "secondary"}>
              {copied ? "✓ Copied!" : "Copy CSS"}
            </Button>
          </div>
          <pre className="rounded-[var(--radius-lg)] bg-[var(--surface-secondary)] border border-[var(--border-default)] p-4 text-sm font-mono text-[var(--text-primary)] whitespace-pre-wrap break-all select-all leading-relaxed overflow-x-auto">
            {fullCSS}
          </pre>
        </div>
      </Panel>
    </div>
  );
}
