import { useState, useCallback } from "react";
import { Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";
import type { HSL, RGB, CMYK } from "@/lib/convertColor";
import { rgbToHsl, rgbToCmyk, rgbToHex, hexToRgb, hslToRgb, cmykToRgb } from "@lib/convertColor"

function ColorValueRow({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-md bg-(--surface-secondary)">
      <span className="text-xs font-medium text-(--text-secondary) w-12">{label}</span>
      <span className="text-sm font-mono text-(--text-primary) flex-1 ml-3">{value}</span>
      <button
        onClick={async () => {
          await copyToClipboard(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="text-xs text-(--text-tertiary) hover:text-(--text-primary) transition-colors cursor-pointer"
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
    <div className="space-y-2">
      {/* Color Preview & Picker */}
      <Panel>
        <div className="flex items-center gap-6">
          <div
            className="w-28 h-28 rounded-lg border-2 border-(--border-default) shadow-sm shrink-0 relative overflow-hidden"
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
              className="font-mono"
            />
            <p className="text-xs text-(--text-tertiary)">Click the swatch to use the color picker</p>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* RGB */}
        <Panel>
          <h3 className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase mb-3">RGB</h3>
          <div className="space-y-2">
            {(["r", "g", "b"] as const).map((ch) => (
              <div key={ch} className="flex items-center gap-2">
                <span className="text-xs font-medium text-(--text-secondary) w-4 uppercase">{ch}</span>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={rgb[ch]}
                  onChange={(e) => handleRgbChange(ch, parseInt(e.target.value))}
                  className="flex-1 accent-primary-500"
                />
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={rgb[ch]}
                  onChange={(e) => handleRgbChange(ch, parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-xs rounded-sm bg-(--surface-secondary) border border-(--border-default) text-center text-(--text-primary)"
                />
              </div>
            ))}
          </div>
        </Panel>

        {/* HSL */}
        <Panel>
          <h3 className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase mb-3">HSL</h3>
          <div className="space-y-2">
            {([
              { key: "h" as const, label: "H", max: 360 },
              { key: "s" as const, label: "S", max: 100 },
              { key: "l" as const, label: "L", max: 100 },
            ]).map(({ key, label, max }) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs font-medium text-(--text-secondary) w-4">{label}</span>
                <input
                  type="range"
                  min={0}
                  max={max}
                  value={hsl[key]}
                  onChange={(e) => handleHslChange(key, parseInt(e.target.value))}
                  className="flex-1 accent-primary-500"
                />
                <input
                  type="number"
                  min={0}
                  max={max}
                  value={hsl[key]}
                  onChange={(e) => handleHslChange(key, parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-xs rounded-sm bg-(--surface-secondary) border border-(--border-default) text-center text(--text-primary)"
                />
              </div>
            ))}
          </div>
        </Panel>

        {/* CMYK */}
        <Panel>
          <h3 className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase mb-3">CMYK</h3>
          <div className="space-y-2">
            {(["c", "m", "y", "k"] as const).map((ch) => (
              <div key={ch} className="flex items-center gap-2">
                <span className="text-xs font-medium text-(--text-secondary) w-4 uppercase">{ch}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={cmyk[ch]}
                  onChange={(e) => handleCmykChange(ch, parseInt(e.target.value))}
                  className="flex-1 accent-primary-500"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={cmyk[ch]}
                  onChange={(e) => handleCmykChange(ch, parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-xs rounded-sm bg-(--surface-secondary) border border-(--border-default) text-center text(--text-primary)"
                />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* All values summary */}
      <Panel>
        <h3 className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase mb-3">All Values</h3>
        <div className="space-y-2">
          <ColorValueRow label="HEX" value={hex.toUpperCase()} onCopy={() => copyToClipboard(hex)} />
          <ColorValueRow label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} onCopy={() => { }} />
          <ColorValueRow label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} onCopy={() => { }} />
          <ColorValueRow label="CMYK" value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`} onCopy={() => { }} />
        </div>
      </Panel>
    </div>
  );
}
