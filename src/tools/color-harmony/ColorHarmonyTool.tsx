import { useState, useMemo } from "react";
import { Button } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";
import ColorCard from "@/components/advanced/ColorCard";
import { hexToHsl, hslToHex, wrapHue } from "@/lib/convertColor";
import type { HSL } from "@/lib/convertColor";

// ===== Harmony generators =====
type HarmonyMode = "complementary" | "analogous" | "triadic" | "split" | "tetradic" | "monochromatic";

const HARMONIES: { id: HarmonyMode; label: string }[] = [
  { id: "complementary", label: "Complementary" },
  { id: "analogous", label: "Analogous" },
  { id: "triadic", label: "Triadic" },
  { id: "split", label: "Split-Comp" },
  { id: "tetradic", label: "Tetradic" },
  { id: "monochromatic", label: "Mono" },
];

function generateHarmony(hsl: HSL, mode: HarmonyMode): string[] {
  const { h, s, l } = hsl;
  switch (mode) {
    case "complementary":
      return [hslToHex({ h, s, l }), hslToHex({ h: wrapHue(h + 180), s, l })];
    case "analogous":
      return [hslToHex({ h: wrapHue(h - 30), s, l }), hslToHex({ h, s, l }), hslToHex({ h: wrapHue(h + 30), s, l })];
    case "triadic":
      return [hslToHex({ h, s, l }), hslToHex({ h: wrapHue(h + 120), s, l }), hslToHex({ h: wrapHue(h + 240), s, l })];
    case "split":
      return [hslToHex({ h, s, l }), hslToHex({ h: wrapHue(h + 150), s, l }), hslToHex({ h: wrapHue(h + 210), s, l })];
    case "tetradic":
      return [hslToHex({ h, s, l }), hslToHex({ h: wrapHue(h + 90), s, l }), hslToHex({ h: wrapHue(h + 180), s, l }), hslToHex({ h: wrapHue(h + 270), s, l })];
    case "monochromatic":
      return [
        hslToHex({ h, s, l: Math.max(l - 30, 10) }),
        hslToHex({ h, s, l: Math.max(l - 15, 15) }),
        hslToHex({ h, s, l }),
        hslToHex({ h, s, l: Math.min(l + 15, 85) }),
        hslToHex({ h, s, l: Math.min(l + 30, 95) }),
      ];
    default:
      return [hslToHex({ h, s, l })];
  }
}

export default function PaletteGeneratorTool() {
  const [hex, setHex] = useState("#f500d8");
  const [mode, setMode] = useState<HarmonyMode>("analogous");

  const hsl = useMemo(() => hexToHsl(hex), [hex]);

  const palette = useMemo(() => {
    if (!hsl) return [hex];
    return generateHarmony(hsl, mode);
  }, [hsl, mode, hex]);

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => setHex(e.target.value);

  const handleHexInput = (value: string) => {
    setHex(value);
  };

  const activePalette = palette;
  let cssVars = `  --seed-color: ${hex.toLowerCase()};` + "\n";
  cssVars += activePalette.map((c, i) => `  --${mode}-${i + 1}: ${c.toLowerCase()};`).join("\n");
  const cssOutput = `:root {\n${cssVars}\n}`;
  const [copiedCSS, setCopiedCSS] = useState(false);

  return (
    <div className="space-y-2">
      {/* Seed color */}
      <Panel>
        <div className="space-y-4">
          <h3 className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase">Seed Color</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg border-2 border-(--border-default) shadow-sm shrink-0 relative overflow-hidden" style={{ backgroundColor: hex }}>
              <input
                type="color"
                value={hex}
                onChange={handlePickerChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Pick a color"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 rounded-md bg-(--surface-secondary) border border-(--border-default) px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-shadow">
                <span className="text-xs font-medium text-(--text-tertiary)">HEX</span>
                <input
                  type="text"
                  value={hex}
                  onChange={(e) => handleHexInput(e.target.value)}
                  className="flex-1 bg-transparent text-sm font-mono text-(--text-primary) outline-none"
                  placeholder="#3B82F6"
                />
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {
        <Panel>
          <div className="space-y-4">
            <h3 className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase">Harmony Mode</h3>
            <div className="flex flex-wrap gap-1 p-1 bg-(--surface-secondary) rounded-lg border border-(--border-default)">
              {HARMONIES.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setMode(id)}
                  className={`px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer ${mode === id
                    ? "bg-white dark:bg-(--surface-primary) text-(--text-primary) shadow-sm border border-(--border-default)"
                    : "text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-elevated) border border-transparent"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </Panel>
      }

      {/* Palette preview */}
      <Panel>
        <div className="space-y-4">
          <h3 className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase">
            Generated Palette
          </h3>
          <div className="flex gap-3">
            {activePalette.map((c, i) => (
              <ColorCard color={c} />
            ))}
          </div>
        </div>
      </Panel>

      {/* CSS Output */}
      <Panel>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase">CSS Variables</h3>
            <Button
              onClick={async () => { await copyToClipboard(cssOutput); setCopiedCSS(true); setTimeout(() => setCopiedCSS(false), 2000); }}
              size="sm"
              variant={copiedCSS ? "primary" : "secondary"}
            >
              {copiedCSS ? "✓ Copied!" : "Copy CSS"}
            </Button>
          </div>
          <pre className="rounded-lg bg-(--surface-secondary) border border-(--border-default) p-4 text-sm font-mono text-(--text-primary) whitespace-pre-wrap break-all select-all leading-relaxed overflow-x-auto">
            {cssOutput}
          </pre>
        </div>
      </Panel>
    </div>
  );
}
