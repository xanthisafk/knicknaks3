import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui";
import { Panel } from "@/components/layout";
import SliderRow from "@/components/ui/SliderRow";
import FileDropZone from "@/components/advanced/FileDropZone";

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

const FILTER_DEFS = [
  { key: "brightness", label: "Brightness", min: 0, max: 300, unit: "%", cssName: "brightness" },
  { key: "contrast", label: "Contrast", min: 0, max: 300, unit: "%", cssName: "contrast" },
  { key: "saturate", label: "Saturate", min: 0, max: 300, unit: "%", cssName: "saturate" },
  { key: "grayscale", label: "Grayscale", min: 0, max: 100, unit: "%", cssName: "grayscale" },
  { key: "sepia", label: "Sepia", min: 0, max: 100, unit: "%", cssName: "sepia" },
  { key: "hueRotate", label: "Hue Rotate", min: 0, max: 360, unit: "deg", cssName: "hue-rotate" },
  { key: "blur", label: "Blur", min: 0, max: 20, unit: "px", cssName: "blur" },
  { key: "invert", label: "Invert", min: 0, max: 100, unit: "%", cssName: "invert" },
  { key: "opacity", label: "Opacity", min: 0, max: 100, unit: "%", cssName: "opacity" },
] as const;

function buildFilterCSS(state: FilterState): string {
  const parts: string[] = [];

  for (const def of FILTER_DEFS) {
    const val = state[def.key];
    if (val !== DEFAULTS[def.key]) {
      parts.push(`${def.cssName}(${val}${def.unit})`);
    }
  }

  return parts.length ? parts.join(" ") : "none";
}

function buildTailwind(state: FilterState) {
  const classes: string[] = [];

  if (state.blur) classes.push(`blur-[${state.blur}px]`);
  if (state.brightness !== 100) classes.push(`brightness-[${state.brightness}%]`);
  if (state.contrast !== 100) classes.push(`contrast-[${state.contrast}%]`);
  if (state.grayscale) classes.push(`grayscale`);
  if (state.invert) classes.push(`invert`);
  if (state.opacity !== 100) classes.push(`opacity-[${state.opacity}%]`);
  if (state.saturate !== 100) classes.push(`saturate-[${state.saturate}%]`);
  if (state.sepia) classes.push(`sepia`);

  if (state.hueRotate) classes.push(`[filter:hue-rotate(${state.hueRotate}deg)]`);

  return classes.length ? classes.join(" ") : "none";
}

export default function CssFilterTool() {
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULTS });
  const [copied, setCopied] = useState(false);
  const [copiedTw, setCopiedTw] = useState(false);

  const [image, setImage] = useState<string | null>(null);
  const [showGradient, setShowGradient] = useState(true);

  const updateFilter = useCallback((key: keyof FilterState, value: number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilter = useCallback((key: keyof FilterState) => {
    setFilters((prev) => ({ ...prev, [key]: DEFAULTS[key] }));
  }, []);

  const resetAll = () => setFilters({ ...DEFAULTS });

  const filterCSS = useMemo(() => buildFilterCSS(filters), [filters]);
  const tailwindCSS = useMemo(() => buildTailwind(filters), [filters]);

  const handleUpload = (e: any) => {
    const file = e.file;
    const url = URL.createObjectURL(file);
    setImage(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`filter: ${filterCSS};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyTw = async () => {
    await navigator.clipboard.writeText(tailwindCSS);
    setCopiedTw(true);
    setTimeout(() => setCopiedTw(false), 2000);
  };

  return (
    <div className="space-y-2">

      {/* Uploader */}
      <Panel>
        <FileDropZone emoji="🖼️" accepts="image/*" onUpload={handleUpload} />
      </Panel>

      {/* Preview + Filters */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Preview */}
        <Panel>
          <div className="space-y-3">

            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-(--text-tertiary)">
                Preview
              </h3>

              <button
                onClick={() => setShowGradient((v) => !v)}
                className="text-xs text-primary-500 hover:underline cursor-pointer"
              >
                {showGradient ? "Hide Demo BG" : "Show Demo BG"}
              </button>
            </div>

            <div
              className="rounded-lg border border-(--border-default) overflow-hidden relative"
              style={
                showGradient
                  ? {
                    background:
                      "repeating-conic-gradient(var(--border-default) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px",
                  }
                  : undefined
              }
            >
              <div
                className="w-full aspect-video flex items-center justify-center"
                style={{ filter: filterCSS !== "none" ? filterCSS : undefined }}
              >
                {image ? (
                  <img
                    src={image}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-sm text-(--text-tertiary)">
                    Upload an image
                  </div>
                )}
              </div>
            </div>
          </div>
        </Panel>

        {/* Filters */}
        <Panel>
          <div className="space-y-4">

            <div className="flex justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-(--text-tertiary)">
                Filters
              </h3>

              <button
                onClick={resetAll}
                className="text-xs text-primary-500 hover:underline"
              >
                Reset
              </button>
            </div>

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
        </Panel>
      </div>

      {/* CSS Output */}
      <Panel>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-(--text-tertiary)">
              CSS Output
            </h3>

            <Button onClick={handleCopy} size="sm">
              {copied ? "✓ Copied!" : "Copy"}
            </Button>
          </div>

          <pre className="p-4 rounded-lg bg-(--surface-secondary) border border-(--border-default) font-mono text-sm">
            {`filter: ${filterCSS};`}
          </pre>
        </div>
      </Panel>

      {/* Tailwind Output */}
      <Panel>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-(--text-tertiary)">
              Tailwind Output
            </h3>

            <Button onClick={handleCopyTw} size="sm">
              {copiedTw ? "✓ Copied!" : "Copy"}
            </Button>
          </div>

          <pre className="p-4 rounded-lg bg-(--surface-secondary) border border-(--border-default) font-mono text-sm">
            {tailwindCSS}
          </pre>
        </div>
      </Panel>

    </div>
  );
}