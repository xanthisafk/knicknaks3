import { useState, useCallback } from "react";
import { Button, Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

// ===== Color conversion utilities =====
interface RGB { r: number; g: number; b: number }
interface HSL { h: number; s: number; l: number }
interface CMYK { c: number; m: number; y: number; k: number }

function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360, s = hsl.s / 100, l = hsl.l / 100;
  if (s === 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v }; }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1/3) * 255),
  };
}

function rgbToCmyk(rgb: RGB): CMYK {
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - r - k) / (1 - k)) * 100),
    m: Math.round(((1 - g - k) / (1 - k)) * 100),
    y: Math.round(((1 - b - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

function cmykToRgb(cmyk: CMYK): RGB {
  const c = cmyk.c / 100, m = cmyk.m / 100, y = cmyk.y / 100, k = cmyk.k / 100;
  return {
    r: Math.round(255 * (1 - c) * (1 - k)),
    g: Math.round(255 * (1 - m) * (1 - k)),
    b: Math.round(255 * (1 - y) * (1 - k)),
  };
}

function ColorValueRow({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-[var(--radius-md)] bg-[var(--surface-secondary)]">
      <span className="text-xs font-medium text(--text-secondary) w-12">{label}</span>
      <span className="text-sm font-[family-name:var(--font-mono)] text(--text-primary) flex-1 ml-3">{value}</span>
      <button
        onClick={async () => {
          await copyToClipboard(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="text-xs text-[var(--text-tertiary)] hover:text(--text-primary) transition-colors cursor-pointer"
      >
        {copied ? "✓" : "Copy"}
      </button>
    </div>
  );
}

export default function ColorConverterTool() {
  const [hex, setHex] = useState("#3B82F6");
  const [rgb, setRgb] = useState<RGB>({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState<HSL>(() => rgbToHsl({ r: 59, g: 130, b: 246 }));
  const [cmyk, setCmyk] = useState<CMYK>(() => rgbToCmyk({ r: 59, g: 130, b: 246 }));

  const updateFromRgb = useCallback((newRgb: RGB) => {
    setRgb(newRgb);
    setHex(rgbToHex(newRgb));
    setHsl(rgbToHsl(newRgb));
    setCmyk(rgbToCmyk(newRgb));
  }, []);

  const handleHexChange = (value: string) => {
    setHex(value);
    const parsed = hexToRgb(value);
    if (parsed) updateFromRgb(parsed);
  };

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleHexChange(e.target.value);
  };

  const handleRgbChange = (channel: keyof RGB, value: number) => {
    const newRgb = { ...rgb, [channel]: Math.max(0, Math.min(255, value)) };
    updateFromRgb(newRgb);
  };

  const handleHslChange = (channel: keyof HSL, value: number) => {
    const max = channel === "h" ? 360 : 100;
    const newHsl = { ...hsl, [channel]: Math.max(0, Math.min(max, value)) };
    setHsl(newHsl);
    updateFromRgb(hslToRgb(newHsl));
  };

  const handleCmykChange = (channel: keyof CMYK, value: number) => {
    const newCmyk = { ...cmyk, [channel]: Math.max(0, Math.min(100, value)) };
    setCmyk(newCmyk);
    updateFromRgb(cmykToRgb(newCmyk));
  };

  return (
    <div className="space-y-6">
      {/* Color Preview & Picker */}
      <Panel>
        <div className="flex items-center gap-6">
          <div
            className="w-24 h-24 rounded-[var(--radius-lg)] border-2 border-[var(--border-default)] shadow-sm flex-shrink-0 relative overflow-hidden"
            style={{ backgroundColor: hex }}
          >
            <input
              type="color"
              value={hex}
              onChange={handlePickerChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="Pick a color"
            />
          </div>
          <div className="flex-1 space-y-2">
            <Input
              label="HEX"
              value={hex}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder="#3B82F6"
              className="font-[family-name:var(--font-mono)]"
            />
            <p className="text-xs text-[var(--text-tertiary)]">Click the swatch to use the color picker</p>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* RGB */}
        <Panel>
          <h3 className="text-sm font-medium text(--text-primary) mb-3">RGB</h3>
          <div className="space-y-2">
            {(["r", "g", "b"] as const).map((ch) => (
              <div key={ch} className="flex items-center gap-2">
                <span className="text-xs font-medium text(--text-secondary) w-4 uppercase">{ch}</span>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={rgb[ch]}
                  onChange={(e) => handleRgbChange(ch, parseInt(e.target.value))}
                  className="flex-1 accent-[var(--color-primary-500)]"
                />
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={rgb[ch]}
                  onChange={(e) => handleRgbChange(ch, parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-xs rounded-[var(--radius-sm)] bg-[var(--surface-secondary)] border border-[var(--border-default)] text-center text(--text-primary)"
                />
              </div>
            ))}
          </div>
        </Panel>

        {/* HSL */}
        <Panel>
          <h3 className="text-sm font-medium text(--text-primary) mb-3">HSL</h3>
          <div className="space-y-2">
            {([
              { key: "h" as const, label: "H", max: 360 },
              { key: "s" as const, label: "S", max: 100 },
              { key: "l" as const, label: "L", max: 100 },
            ]).map(({ key, label, max }) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs font-medium text(--text-secondary) w-4">{label}</span>
                <input
                  type="range"
                  min={0}
                  max={max}
                  value={hsl[key]}
                  onChange={(e) => handleHslChange(key, parseInt(e.target.value))}
                  className="flex-1 accent-[var(--color-primary-500)]"
                />
                <input
                  type="number"
                  min={0}
                  max={max}
                  value={hsl[key]}
                  onChange={(e) => handleHslChange(key, parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-xs rounded-[var(--radius-sm)] bg-[var(--surface-secondary)] border border-[var(--border-default)] text-center text(--text-primary)"
                />
              </div>
            ))}
          </div>
        </Panel>

        {/* CMYK */}
        <Panel>
          <h3 className="text-sm font-medium text(--text-primary) mb-3">CMYK</h3>
          <div className="space-y-2">
            {(["c", "m", "y", "k"] as const).map((ch) => (
              <div key={ch} className="flex items-center gap-2">
                <span className="text-xs font-medium text(--text-secondary) w-4 uppercase">{ch}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={cmyk[ch]}
                  onChange={(e) => handleCmykChange(ch, parseInt(e.target.value))}
                  className="flex-1 accent-[var(--color-primary-500)]"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={cmyk[ch]}
                  onChange={(e) => handleCmykChange(ch, parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-xs rounded-[var(--radius-sm)] bg-[var(--surface-secondary)] border border-[var(--border-default)] text-center text(--text-primary)"
                />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* All values summary */}
      <Panel>
        <h3 className="text-sm font-medium text(--text-primary) mb-3">All Values</h3>
        <div className="space-y-2">
          <ColorValueRow label="HEX" value={hex.toUpperCase()} onCopy={() => copyToClipboard(hex)} />
          <ColorValueRow label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} onCopy={() => {}} />
          <ColorValueRow label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} onCopy={() => {}} />
          <ColorValueRow label="CMYK" value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`} onCopy={() => {}} />
        </div>
      </Panel>
    </div>
  );
}
