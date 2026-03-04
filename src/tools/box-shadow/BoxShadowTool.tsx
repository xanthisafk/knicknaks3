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
      <span className="text-xs text-[--text-tertiary] font-medium">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-[--border-default] accent-[--color-primary] cursor-pointer"
      />
      <div className="rounded-radius-sm bg-[--surface-secondary] border border-[--border-default] px-1.5 py-0.5 text-xs font-mono text-[--text-primary] text-center">
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
    setLayers(next);
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
    <div className="space-y-4">
      {/* Preview */}
      <Panel>
        <div className="flex items-center justify-center py-10 rounded-radius-md bg-(--surface-secondary)"
          style={{ background: "repeating-conic-gradient(var(--border-default) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px" }}>
          <div
            className="w-32 h-32 rounded-radius-md bg-white transition-shadow duration-150"
            style={{ boxShadow: cssValue }}
          />
        </div>
      </Panel>

      {/* Layers */}
      <Panel>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-(--text-tertiary) uppercase tracking-wider">Shadow Layers</p>
            <button
              onClick={addLayer}
              className="text-xs text-(--color-primary) hover:opacity-75 transition-opacity cursor-pointer font-medium"
            >
              + Add Layer
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {layers.map((l, i) => (
              <div key={l.id} className="flex items-center gap-1">
                <button
                  onClick={() => setActiveId(l.id)}
                  className={`px-3 py-1.5 rounded-radius-sm text-xs font-medium border transition-colors cursor-pointer ${
                    l.id === activeId
                      ? "bg-(--color-primary) border-[--color-primary]"
                      : "bg-(--surface-secondary) text-[--text-secondary] border-[--border-default] hover:text-[--text-primary]"
                  }`}
                >
                  Layer {i + 1}
                </button>
                {layers.length > 1 && (
                  <button
                    onClick={() => removeLayer(l.id)}
                    className="text-[--text-tertiary] hover:text-[--color-error] transition-colors cursor-pointer text-xs leading-none"
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
        <div className="space-y-4">
          <p className="text-xs font-medium text-(--text-tertiary) uppercase tracking-wider">Controls</p>

          <div className="space-y-3">
            <SliderRow label="Offset X" value={active.x} min={-60} max={60} onChange={(v) => updateActive({ x: v })} />
            <SliderRow label="Offset Y" value={active.y} min={-60} max={60} onChange={(v) => updateActive({ y: v })} />
            <SliderRow label="Blur" value={active.blur} min={0} max={100} onChange={(v) => updateActive({ blur: v })} />
            <SliderRow label="Spread" value={active.spread} min={-50} max={50} onChange={(v) => updateActive({ spread: v })} />
            <SliderRow label="Opacity" value={active.opacity} min={0} max={100} unit="%" onChange={(v) => updateActive({ opacity: v })} />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs text-[--text-tertiary] font-medium">Color</label>
              <div className="flex items-center gap-2 rounded-radius-md bg-[--surface-secondary] border border-[--border-default] px-3 py-2">
                <input
                  type="color"
                  value={active.color}
                  onChange={(e) => updateActive({ color: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
                />
                <span className="text-xs font-mono text-[--text-primary]">{active.color.toUpperCase()}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[--text-tertiary] font-medium">Type</label>
              <div className="flex gap-2">
                {(["outset", "inset"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => updateActive({ inset: type === "inset" })}
                    className={`flex-1 py-2 rounded-radius-md text-xs font-medium border transition-colors cursor-pointer ${
                      active.inset === (type === "inset")
                        ? "bg-[--color-primary] text-white border-[--color-primary]"
                        : "bg-[--surface-secondary] text-[--text-secondary] border-[--border-default] hover:text-[--text-primary]"
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
        <div className="space-y-3">
          <p className="text-xs font-medium text-[--text-tertiary] uppercase tracking-wider">CSS Output</p>
          <pre className="rounded-radius-md bg-[--surface-secondary] border border-[--border-default] px-3 py-2.5 text-xs font-mono text-[--text-primary] whitespace-pre-wrap break-all select-all">
            {fullCSS}
          </pre>
          <Button onClick={handleCopy}>
            {copied ? "✓ Copied!" : "Copy CSS"}
          </Button>
        </div>
      </Panel>
    </div>
  );
}