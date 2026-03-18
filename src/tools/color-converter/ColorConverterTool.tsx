import { useState, useCallback } from "react";
import { Input, Label, Slider } from "@/components/ui";
import { Panel } from "@/components/layout";
import type { HSL, RGB, CMYK } from "@/lib/convertColor";
import { rgbToHsl, rgbToCmyk, rgbToHex, hexToRgb, hslToRgb, cmykToRgb } from "@lib/convertColor"
import { ResultRow } from "@/components/advanced/ResultRow";



export default function ColorConverterTool() {
  const [hex, setHex] = useState("#db0d2a");
  const [rgb, setRgb] = useState<RGB>({ r: 219, g: 13, b: 42 });
  const [hsl, setHsl] = useState<HSL>(() => rgbToHsl({ r: 219, g: 13, b: 42 }));
  const [cmyk, setCmyk] = useState<CMYK>(() => rgbToCmyk({ r: 219, g: 13, b: 42 }));

  const updateFromRgb = useCallback((newRgb: RGB) => {
    setRgb(newRgb);
    setHex(rgbToHex(newRgb));
    setHsl(rgbToHsl(newRgb));
    setCmyk(rgbToCmyk(newRgb));
  }, []);

  const handleHexChange = (value: string) => {
    if (value[0] !== "#") value = "#" + value;
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
        <div className="flex items-center gap-4">
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
            <Label size="xs">Click the swatch to use the color picker</Label>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* RGB */}
        <Panel>
          <Label>RGB</Label>
          <div className="space-y-2">
            {(["r", "g", "b"] as const).map((ch) => (
              <div key={ch} className="flex items-center gap-2">
                <Label size="xs">{ch}</Label>
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
          <Label>HSL</Label>
          <div className="space-y-2">
            {([
              { key: "h" as const, label: "H", max: 360 },
              { key: "s" as const, label: "S", max: 100 },
              { key: "l" as const, label: "L", max: 100 },
            ]).map(({ key, label, max }) => (
              <div key={key} className="flex items-center gap-2">
                <Label size="xs">{label}</Label>
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
          <Label>CMYK</Label>
          <div className="space-y-2">
            {(["c", "m", "y", "k"] as const).map((ch) => (
              <div key={ch} className="flex items-center gap-2">
                <Label size="xs">{ch}</Label>
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
        <Label>All Values</Label>
        <div className="space-y-2">
          <ResultRow label="HEX" value={hex.toUpperCase()} />
          <ResultRow label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
          <ResultRow label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
          <ResultRow label="CMYK" value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`} />
        </div>
      </Panel>
    </div>
  );
}
