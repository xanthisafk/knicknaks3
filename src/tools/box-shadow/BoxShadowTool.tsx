import { useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { Panel } from "@/components/layout";
import SliderRow from "@/components/ui/SliderRow";
import { TabList, Tabs, Tab } from "@/components/ui/tab";
import { toTitleCase } from "@/lib";

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

function shadowsToTailwind(layers: ShadowLayer[]): string {
  const raw = layers.map(layerToCSS).join(", ");
  const safe = raw.replace(/\s+/g, "_");
  return `shadow-[${safe}]`;
}

export default function BoxShadowTool() {
  const [layers, setLayers] = useState<ShadowLayer[]>([makeLayer()]);
  const [activeId, setActiveId] = useState<number>(layers[0].id);
  const [copied, setCopied] = useState(false);
  const [copiedTailwind, setCopiedTailwind] = useState(false);

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
    setLayers((_) => next);
    if (activeId === id) setActiveId(next[next.length - 1].id);
  };

  const cssValue = shadowsToCSS(layers);
  const tailwindValue = shadowsToTailwind(layers);
  const fullCSS = `box-shadow: ${cssValue};`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyTailwind = async () => {
    await navigator.clipboard.writeText(tailwindValue);
    setCopiedTailwind(true);
    setTimeout(() => setCopiedTailwind(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      <Panel>
        <div className="flex items-center justify-center py-12 rounded-lg bg-(--surface-secondary) border border-(--border-default) relative overflow-hidden"
          style={{ background: "repeating-conic-gradient(var(--border-default) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px" }}>
          <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-[1px]"></div>
          <div
            className="w-40 h-40 rounded-lg bg-white dark:bg-(--surface-primary) transition-shadow duration-200 ease-out relative z-10"
            style={{ boxShadow: cssValue }}
          />
        </div>
      </Panel>

      {/* Layers */}
      <Panel>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase">Shadow Layers</h3>
            <button
              onClick={addLayer}
              className="text-xs text-primary-500 hover:text-primary-600 hover:underline transition-colors cursor-pointer font-medium flex items-center gap-1"
            >
              <span>+</span> Add Layer
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {layers.map((l, i) => (
              <div key={l.id} className="flex items-center gap-1 group">
                <button
                  onClick={() => setActiveId(l.id)}
                  className={`px-4 py-2 rounded-md text-xs font-medium border cursor-pointer ${l.id === activeId
                    ? "bg-(--surface-primary) text-primary-600 dark:text-primary-300 border-primary-400 shadow-sm"
                    : "bg-(--surface-secondary) text-(--text-secondary) border-(--border-default) hover:text-(--text-primary) hover:border-(--border-hover) hover:bg-(--surface-elevated)"
                    }`}
                >
                  Layer {i + 1}
                </button>
                {layers.length > 1 && (
                  <button
                    onClick={() => removeLayer(l.id)}
                    className={`p-2 rounded-full text-(--text-tertiary) hover:bg-error/10 hover:text-error transition-colors cursor-pointer text-xs ${l.id === activeId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
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
          <h3 className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase mb-4">Controls</h3>

          <div className="space-y-4">
            <SliderRow label="Offset X" value={active.x} min={-60} max={60} onChange={(v) => updateActive({ x: v })} />
            <SliderRow label="Offset Y" value={active.y} min={-60} max={60} onChange={(v) => updateActive({ y: v })} />
            <SliderRow label="Blur" value={active.blur} min={0} max={100} onChange={(v) => updateActive({ blur: v })} />
            <SliderRow label="Spread" value={active.spread} min={-50} max={50} onChange={(v) => updateActive({ spread: v })} />
            <SliderRow label="Opacity" value={active.opacity} min={0} max={100} unit="%" onChange={(v) => updateActive({ opacity: v })} />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-(--border-default)">
            <div className="space-y-2">
              <label className="text-xs text-(--text-tertiary) font-medium uppercase tracking-wider block">Color</label>
              <div className="flex items-center gap-3 rounded-md bg-(--surface-secondary) border border-(--border-default) px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-shadow">
                <div className="w-8 h-8 rounded-full shadow-sm overflow-hidden relative cursor-pointer border border-(--border-default)">
                  <input
                    type="color"
                    value={active.color}
                    onChange={(e) => updateActive({ color: e.target.value })}
                    className="absolute -inset-4 w-[200%] h-[200%] cursor-pointer border-0 p-0"
                  />
                </div>
                <span className="text-sm font-mono text-(--text-primary) font-medium">{active.color.toUpperCase()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-(--text-tertiary) font-medium uppercase tracking-wider block">Type</label>
              <Tabs value={active.inset ? "inset" : "outset"} onValueChange={v => updateActive({ inset: v === "inset" })}>
                <TabList>
                  {(["outset", "inset"] as const).map((type) => <Tab value={type}>{toTitleCase(type)}</Tab>)}
                </TabList>
              </Tabs>
            </div>
          </div>
        </div>
      </Panel>

      {/* CSS Output */}
      <Panel>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold tracking-widest text-(--text-tertiary) uppercase">CSS Output</h3>
            <Button onClick={handleCopy} size="sm" variant={copied ? "primary" : "secondary"}>
              {copied ? "✓ Copied!" : "Copy CSS"}
            </Button>
          </div>
          <pre className="rounded-lg bg-(--surface-secondary) border border-(--border-default) p-4 text-sm font-mono text-(--text-primary) whitespace-pre-wrap break-all select-all leading-relaxed relative overflow-x-auto">
            {fullCSS}
          </pre>
        </div>
      </Panel>

      {/* Tailwind Output */}
      <Panel>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold tracking-widest text-(--text-tertiary) uppercase">Tailwind Output</h3>
            <Button onClick={handleCopyTailwind} size="sm" variant={copiedTailwind ? "primary" : "secondary"}>
              {copiedTailwind ? "✓ Copied!" : "Copy Tailwind"}
            </Button>
          </div>
          <pre className="rounded-lg bg-(--surface-secondary) border border-(--border-default) p-4 text-sm font-mono text-(--text-primary) whitespace-pre-wrap break-all select-all leading-relaxed relative overflow-x-auto">
            {tailwindValue}
          </pre>
        </div>
      </Panel>
    </div>
  );
}