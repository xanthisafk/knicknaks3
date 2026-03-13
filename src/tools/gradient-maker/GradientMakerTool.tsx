import { useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

// ===== Types =====
type GradientType = "linear" | "radial" | "conic";

interface ColorStop {
  id: number;
  color: string;
  position: number; // 0-100
}

let stopId = 1;

function makeStop(color: string, position: number): ColorStop {
  return { id: stopId++, color, position };
}

// ===== CSS generation =====
function stopsToCSS(stops: ColorStop[]): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  return sorted.map((s) => `${s.color} ${s.position}%`).join(", ");
}

function gradientCSS(type: GradientType, angle: number, stops: ColorStop[]): string {
  const colorStops = stopsToCSS(stops);
  switch (type) {
    case "linear":
      return `linear-gradient(${angle}deg, ${colorStops})`;
    case "radial":
      return `radial-gradient(circle, ${colorStops})`;
    case "conic":
      return `conic-gradient(from ${angle}deg, ${colorStops})`;
  }
}

// ===== Sub-components =====
interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (v: number) => void;
}

function SliderRow({ label, value, min, max, unit = "°", onChange }: SliderRowProps) {
  return (
    <div className="grid grid-cols-[90px_1fr_52px] items-center gap-3">
      <span className="text-xs text-(--text-tertiary) font-medium uppercase tracking-wider">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-(--border-default) accent-primary-500 cursor-pointer"
      />
      <div className="rounded-sm bg-(--surface-secondary) border border-(--border-default) px-1.5 py-0.5 text-xs font-mono text-(--text-primary) text-center">
        {value}{unit}
      </div>
    </div>
  );
}

function StopRow({
  stop,
  onUpdate,
  onRemove,
  canRemove,
}: {
  stop: ColorStop;
  onUpdate: (patch: Partial<ColorStop>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className="flex items-center gap-3 group">
      <div className="w-8 h-8 rounded-full shadow-sm overflow-hidden relative cursor-pointer border border-(--border-default) shrink-0">
        <input
          type="color"
          value={stop.color}
          onChange={(e) => onUpdate({ color: e.target.value })}
          className="absolute -inset-4 w-[200%] h-[200%] cursor-pointer border-0 p-0"
        />
      </div>
      <span className="text-xs font-mono text-(--text-secondary) w-16">{stop.color.toUpperCase()}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={stop.position}
        onChange={(e) => onUpdate({ position: Number(e.target.value) })}
        className="flex-1 h-1.5 rounded-full appearance-none bg-(--border-default) accent-primary-500 cursor-pointer"
      />
      <div className="rounded-sm bg-(--surface-secondary) border border-(--border-default) px-1.5 py-0.5 text-xs font-mono text-(--text-primary) text-center w-12">
        {stop.position}%
      </div>
      {canRemove && (
        <button
          onClick={onRemove}
          className="p-1.5 rounded-full text-(--text-tertiary) hover:bg-error/10 hover:text-error transition-colors cursor-pointer text-xs opacity-0 group-hover:opacity-100"
          title="Remove stop"
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ===== Main =====
export default function GradientMakerTool() {
  const [type, setType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>([
    makeStop("#6366f1", 0),
    makeStop("#ec4899", 50),
    makeStop("#f59e0b", 100),
  ]);
  const [copied, setCopied] = useState(false);

  const updateStop = useCallback((id: number, patch: Partial<ColorStop>) => {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const removeStop = useCallback((id: number) => {
    setStops((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const addStop = () => {
    // Insert at the midpoint with a blended default
    const newPos = stops.length > 0 ? Math.round(stops.reduce((sum, s) => sum + s.position, 0) / stops.length) : 50;
    setStops((prev) => [...prev, makeStop("#8b5cf6", Math.min(100, Math.max(0, newPos)))]);
  };

  const cssValue = gradientCSS(type, angle, stops);
  const fullCSS = `background: ${cssValue};`;

  const handleCopy = async () => {
    await copyToClipboard(fullCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const randomize = () => {
    const randomHex = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    const count = 2 + Math.floor(Math.random() * 3);
    const newStops: ColorStop[] = [];
    for (let i = 0; i < count; i++) {
      newStops.push(makeStop(randomHex(), Math.round((i / (count - 1)) * 100)));
    }
    setStops(newStops);
    setAngle(Math.floor(Math.random() * 360));
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      <Panel>
        <div
          className="flex items-center justify-center rounded-lg border border-(--border-default) relative overflow-hidden"
          style={{ height: "240px", background: "repeating-conic-gradient(var(--border-default) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px" }}
        >
          <div className="absolute inset-0" style={{ background: cssValue }} />
        </div>
      </Panel>

      {/* Gradient type */}
      <Panel>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase">Gradient Type</h3>
            <button
              onClick={randomize}
              className="text-xs text-primary-500 hover:text-primary-600 hover:underline transition-colors cursor-pointer font-medium"
            >
              🎲 Randomize
            </button>
          </div>
          <div className="flex gap-1 p-1 bg-(--surface-secondary) rounded-lg border border-(--border-default)">
            {(["linear", "radial", "conic"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer capitalize ${type === t
                    ? "bg-white dark:bg-(--surface-primary) text-(--text-primary) shadow-sm border border-(--border-default)"
                    : "text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-elevated) border border-transparent"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {/* Angle (for linear & conic) */}
      {type !== "radial" && (
        <Panel>
          <div className="space-y-4">
            <h3 className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase">
              {type === "linear" ? "Angle" : "Start Angle"}
            </h3>
            <SliderRow label="Angle" value={angle} min={0} max={360} onChange={setAngle} />
          </div>
        </Panel>
      )}

      {/* Color Stops */}
      <Panel>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase">Color Stops</h3>
            <button
              onClick={addStop}
              className="text-xs text-primary-500 hover:text-primary-600 hover:underline transition-colors cursor-pointer font-medium flex items-center gap-1"
            >
              <span>+</span> Add Stop
            </button>
          </div>
          <div className="space-y-3">
            {stops.map((stop) => (
              <StopRow
                key={stop.id}
                stop={stop}
                onUpdate={(patch) => updateStop(stop.id, patch)}
                onRemove={() => removeStop(stop.id)}
                canRemove={stops.length > 2}
              />
            ))}
          </div>
        </div>
      </Panel>

      {/* CSS Output */}
      <Panel>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase">CSS Output</h3>
            <Button onClick={handleCopy} size="sm" variant={copied ? "primary" : "secondary"}>
              {copied ? "✓ Copied!" : "Copy CSS"}
            </Button>
          </div>
          <pre className="rounded-lg bg-(--surface-secondary) border border-(--border-default) p-4 text-sm font-mono text-(--text-primary) whitespace-pre-wrap break-all select-all leading-relaxed overflow-x-auto">
            {fullCSS}
          </pre>
        </div>
      </Panel>
    </div>
  );
}
