import { useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { Panel } from "@/components/layout";

interface ShadowLayer {
  id: number;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

let idCounter = 1;

function makeLayer(overrides: Partial<ShadowLayer> = {}): ShadowLayer {
  return {
    id: idCounter++,
    x: 4,
    y: 4,
    blur: 12,
    spread: 0,
    color: "#000000",
    opacity: 25,
    inset: false,
    ...overrides,
  };
}

function layerToCSS(l: ShadowLayer): string {
  const hex = l.color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const a = (l.opacity / 100).toFixed(2);
  const inset = l.inset ? "inset " : "";
  return `${inset}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px rgba(${r}, ${g}, ${b}, ${a})`;
}

function shadowsToCSS(layers: ShadowLayer[]): string {
  return layers.map(layerToCSS).join(",\n       ");
}

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (v: number) => void;
}

function SliderRow({ label, value, min, max, unit = "px", onChange }: SliderRowProps) {
  return (
    <div className="grid grid-cols-[90px_1fr_52px] items-center gap-3">
      <span className="text-xs text-[var(--text-tertiary)] font-medium uppercase tracking-wider">{label}</span>
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
    </div>
  );
}

export default function BoxShadowTool() {
  const [layers, setLayers] = useState<ShadowLayer[]>([makeLayer()]);
  const [activeId, setActiveId] = useState<number>(layers[0].id);
  const [copied, setCopied] = useState(false);

  const active = layers.find((l) => l.id === activeId) ?? layers[0];

  const updateActive = useCallback((patch: Partial<ShadowLayer>) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === activeId ? { ...l, ...patch } : l))
    );
  }, [activeId]);

  const addLayer = () => {
    const layer = makeLayer({ x: 6, y: 6, blur: 16, spread: -2, opacity: 20 });
    setLayers((prev) => [...prev, layer]);
    setActiveId(layer.id);
  };

  const removeLayer = (id: number) => {
    if (layers.length === 1) return;
    const next = layers.filter((l) => l.id !== id);
    setLayers((prev) => next);
    if (activeId === id) setActiveId(next[next.length - 1].id);
  };

  const cssValue = shadowsToCSS(layers);
  const fullCSS = `box-shadow: ${cssValue};`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      <Panel>
        <div className="flex items-center justify-center py-12 rounded-[var(--radius-lg)] bg-[var(--surface-secondary)] border border-[var(--border-default)] relative overflow-hidden"
          style={{ background: "repeating-conic-gradient(var(--border-default) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px" }}>
            <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-[1px]"></div>
          <div
            className="w-40 h-40 rounded-[var(--radius-lg)] bg-white dark:bg-[var(--surface-primary)] transition-shadow duration-200 ease-out relative z-10"
            style={{ boxShadow: cssValue }}
          />
        </div>
      </Panel>

      {/* Layers */}
      <Panel>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">Shadow Layers</h3>
            <button
              onClick={addLayer}
              className="text-xs text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] hover:underline transition-colors cursor-pointer font-medium flex items-center gap-1"
            >
              <span>+</span> Add Layer
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {layers.map((l, i) => (
              <div key={l.id} className="flex items-center gap-1 group">
                <button
                  onClick={() => setActiveId(l.id)}
                  className={`px-4 py-2 rounded-[var(--radius-md)] text-xs font-medium border transition-all duration-200 cursor-pointer ${
                    l.id === activeId
                      ? "bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)] text-[var(--color-primary-600)] dark:text-[var(--color-primary-300)] border-[var(--color-primary-400)] shadow-sm"
                      : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border-default)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-elevated)]"
                  }`}
                >
                  Layer {i + 1}
                </button>
                {layers.length > 1 && (
                  <button
                    onClick={() => removeLayer(l.id)}
                    className={`p-2 rounded-full text-[var(--text-tertiary)] hover:bg-[var(--color-error)]/10 hover:text-[var(--color-error)] transition-colors cursor-pointer text-xs ${l.id === activeId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    title="Remove Layer"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* Controls */}
      <Panel>
        <div className="space-y-6">
          <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-4">Controls</h3>

          <div className="space-y-4">
            <SliderRow label="Offset X" value={active.x} min={-60} max={60} onChange={(v) => updateActive({ x: v })} />
            <SliderRow label="Offset Y" value={active.y} min={-60} max={60} onChange={(v) => updateActive({ y: v })} />
            <SliderRow label="Blur" value={active.blur} min={0} max={100} onChange={(v) => updateActive({ blur: v })} />
            <SliderRow label="Spread" value={active.spread} min={-50} max={50} onChange={(v) => updateActive({ spread: v })} />
            <SliderRow label="Opacity" value={active.opacity} min={0} max={100} unit="%" onChange={(v) => updateActive({ opacity: v })} />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border-default)]">
            <div className="space-y-2">
              <label className="text-xs text-[var(--text-tertiary)] font-medium uppercase tracking-wider block">Color</label>
              <div className="flex items-center gap-3 rounded-[var(--radius-md)] bg-[var(--surface-secondary)] border border-[var(--border-default)] px-3 py-2.5 focus-within:ring-2 focus-within:ring-[var(--color-primary-500)] focus-within:border-[var(--color-primary-500)] transition-shadow">
                <div className="w-8 h-8 rounded-full shadow-sm overflow-hidden relative cursor-pointer border border-[var(--border-default)]">
                     <input
                        type="color"
                        value={active.color}
                        onChange={(e) => updateActive({ color: e.target.value })}
                        className="absolute -inset-4 w-[200%] h-[200%] cursor-pointer border-0 p-0"
                    />
                </div>
                <span className="text-sm font-mono text-[var(--text-primary)] font-medium">{active.color.toUpperCase()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-[var(--text-tertiary)] font-medium uppercase tracking-wider block">Type</label>
              <div className="flex gap-1 p-1 bg-[var(--surface-secondary)] rounded-[var(--radius-lg)] border border-[var(--border-default)]">
                {(["outset", "inset"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => updateActive({ inset: type === "inset" })}
                    className={`flex-1 py-2 px-3 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200 cursor-pointer capitalize ${
                      active.inset === (type === "inset")
                        ? "bg-white dark:bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-sm border border-[var(--border-default)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] border border-transparent"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* CSS Output */}
      <Panel>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">CSS Output</h3>
               <Button onClick={handleCopy} size="sm" variant={copied ? "primary" : "secondary"}>
                {copied ? "✓ Copied!" : "Copy CSS"}
              </Button>
          </div>
          <pre className="rounded-[var(--radius-lg)] bg-[var(--surface-secondary)] border border-[var(--border-default)] p-4 text-sm font-mono text-[var(--text-primary)] whitespace-pre-wrap break-all select-all leading-relaxed relative overflow-x-auto">
            {fullCSS}
          </pre>
        </div>
      </Panel>
    </div>
  );
}