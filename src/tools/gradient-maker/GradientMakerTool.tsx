import { useState, useCallback, useRef } from "react";
import { Button, Input, Label } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard, toTitleCase } from "@/lib/utils";
import type { ColorStop, GradientType } from "@/lib/colorHelper/types";
import { StopRow } from "./ColorStopRow";
import SliderRow from "@/components/ui/SliderRow";
import { TabList, Tabs, Tab } from "@/components/ui/tab";
import { ResultRow } from "@/components/advanced/ResultRow";
import { Download } from "lucide-react";


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

// ===== Tailwind CSS generation =====
function gradientToTailwind(type: GradientType, angle: number, stops: ColorStop[]): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position);

  // Direction mapping for linear gradients
  const angleToDirection: Record<number, string> = {
    0: "to-t",
    45: "to-tr",
    90: "to-r",
    135: "to-br",
    180: "to-b",
    225: "to-bl",
    270: "to-l",
    315: "to-tl",
    360: "to-t",
  };

  // Find closest direction or use arbitrary
  const closestAngle = Object.keys(angleToDirection)
    .map(Number)
    .sort((a, b) => Math.abs(a - angle) - Math.abs(b - angle))[0];

  const isArbitraryAngle = Math.abs(closestAngle - angle) > 22;

  if (type === "radial") {
    // Tailwind doesn't have a built-in radial gradient class, use arbitrary
    const colorStops = stopsToCSS(sorted);
    return `[background:radial-gradient(circle,${colorStops.replace(/ /g, "_")})]`;
  }

  if (type === "conic") {
    const colorStops = stopsToCSS(sorted);
    return `[background:conic-gradient(from_${angle}deg,${colorStops.replace(/ /g, "_")})]`;
  }

  // Linear gradient
  const dirClass = isArbitraryAngle
    ? `bg-[linear-gradient(${angle}deg,${stopsToCSS(sorted).replace(/ /g, "_")})]`
    : buildLinearTailwind(angleToDirection[closestAngle], sorted);

  return dirClass;
}

function buildLinearTailwind(direction: string, stops: ColorStop[]): string {
  if (stops.length === 2) {
    const fromColor = hexToTailwindArbitrary(stops[0].color, "from");
    const toColor = hexToTailwindArbitrary(stops[1].color, "to");
    return `bg-gradient-${direction} ${fromColor} ${toColor}`;
  } else if (stops.length === 3) {
    const fromColor = hexToTailwindArbitrary(stops[0].color, "from");
    const viaColor = hexToTailwindArbitrary(stops[1].color, "via");
    const toColor = hexToTailwindArbitrary(stops[2].color, "to");
    return `bg-gradient-${direction} ${fromColor} ${viaColor} ${toColor}`;
  } else {
    // For 4+ stops, fall back to arbitrary value
    const colorStops = stops.map((s) => `${s.color} ${s.position}%`).join(",");
    return `[background:linear-gradient(${direction.replace("to-", "to ")},${colorStops.replace(/ /g, "_")})]`;
  }
}

function hexToTailwindArbitrary(hex: string, prefix: "from" | "via" | "to"): string {
  return `${prefix}-[${hex}]`;
}


// ===== PNG Download =====
function downloadGradientPng(
  type: GradientType,
  angle: number,
  stops: ColorStop[],
  width: number,
  height: number
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const sorted = [...stops].sort((a, b) => a.position - b.position);

  if (type === "linear") {
    const rad = (angle * Math.PI) / 180;
    // Compute start/end points so the gradient spans the full canvas
    const cx = width / 2;
    const cy = height / 2;
    const halfLen = Math.abs(width * Math.sin(rad)) / 2 + Math.abs(height * Math.cos(rad)) / 2;
    const x0 = cx - Math.sin(rad) * halfLen;
    const y0 = cy + Math.cos(rad) * halfLen;
    const x1 = cx + Math.sin(rad) * halfLen;
    const y1 = cy - Math.cos(rad) * halfLen;
    const grad = ctx.createLinearGradient(x0, y0, x1, y1);
    sorted.forEach((s) => grad.addColorStop(s.position / 100, s.color));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (type === "radial") {
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.max(width, height) / 2;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    sorted.forEach((s) => grad.addColorStop(s.position / 100, s.color));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else {
    // Conic — Canvas2D supports createConicGradient in modern browsers
    if (typeof ctx.createConicGradient === "function") {
      const rad = (angle * Math.PI) / 180 - Math.PI / 2;
      const grad = ctx.createConicGradient(rad, width / 2, height / 2);
      sorted.forEach((s) => grad.addColorStop(s.position / 100, s.color));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Fallback to linear if conic not supported
      const grad = ctx.createLinearGradient(0, 0, width, height);
      sorted.forEach((s) => grad.addColorStop(s.position / 100, s.color));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  }

  const filename = `knicknaks-gradient.png`;

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
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

  // Download dimensions
  const [dlWidth, setDlWidth] = useState(1920);
  const [dlHeight, setDlHeight] = useState(1080);

  const updateStop = useCallback((id: number, patch: Partial<ColorStop>) => {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const removeStop = useCallback((id: number) => {
    setStops((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const addStop = () => {
    const newPos = stops.length > 0 ? Math.round(stops.reduce((sum, s) => sum + s.position, 0) / stops.length) : 50;
    setStops((prev) => [...prev, makeStop("#8b5cf6", Math.min(100, Math.max(0, newPos)))]);
  };

  const cssValue = gradientCSS(type, angle, stops);
  const fullCSS = `background: ${cssValue};`;
  const tailwindValue = gradientToTailwind(type, angle, stops);

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

  const handleDownload = () => {
    const w = Math.min(8000, Math.max(1, dlWidth));
    const h = Math.min(8000, Math.max(1, dlHeight));
    downloadGradientPng(type, angle, stops, w, h);
  };

  return (
    <div className="space-y-2">
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
            <Button
              onClick={randomize}
              size="xs"
              emoji="🎲"
              variant="secondary"
            >
              Randomize
            </Button>
          </div>

          <Tabs value={type} onValueChange={(v) => setType(v as GradientType)}>
            <TabList>
              {(["linear", "radial", "conic"] as const).map((t) => (
                <Tab key={t} value={t}>{toTitleCase(t)}</Tab>
              ))}
            </TabList>
          </Tabs>
        </div>
      </Panel>

      {/* Angle (for linear & conic) */}
      {type !== "radial" && (
        <Panel>
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-widest text-(--text-tertiary) uppercase">
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
            <Button
              onClick={addStop}
              size="xs"
              emoji="➕"
              variant="secondary"
            >
              Add Stop
            </Button>
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
        <div className="flex flex-col gap-2">
          <Label>Output</Label>
          <ResultRow value={fullCSS} label="CSS Output" />
          <ResultRow value={tailwindValue} label="Tailwind Classes" />
        </div>
      </Panel>

      {/* PNG Download */}
      <Panel>
        <div className="space-y-4">
          <Label>Export PNG</Label>
          <div className="flex align-end gap-2">
            <Input label="Width" type="number" className="w-full" min={1} max={8000} value={dlWidth} onChange={(e) => setDlWidth(Number(e.target.value))} />

            <Input label="Height" type="number" className="w-full" min={1} max={8000} value={dlHeight} onChange={(e) => setDlHeight(Number(e.target.value))} />
          </div>
          <Button
            onClick={handleDownload}
            icon={Download}
            variant="secondary"
          >
            Download PNG
          </Button>
        </div>
        <Label size="xs">Max 8000 x 8000 (px)</Label>
      </Panel>
    </div>
  );
}