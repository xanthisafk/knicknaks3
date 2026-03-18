import { useState, useMemo } from "react";
import { Button, Input, Label, Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";
import ColorCard from "@/components/advanced/ColorCard";
import { hexToHsl, hslToHex, wrapHue } from "@/lib/convertColor";
import type { HSL } from "@/lib/convertColor";
import { Tab, TabList, Tabs } from "@/components/ui/tab";

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
  const [hex, setHex] = useState("#db0d2a");
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

  return (
    <div className="space-y-2">
      {/* Seed color */}
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
              label="Seed color"
              value={hex}
              onChange={(e) => handleHexInput(e.target.value)}
              placeholder="#3B82F6"
              className="font-mono"
            />
            <Label size="xs">Click the swatch to use the color picker</Label>
          </div>
        </div>
      </Panel>


      {
        <Panel>
          <div className="space-y-4">
            <Label>Harmony Mode</Label>
            <Tabs value={mode} onValueChange={v => setMode(v as HarmonyMode)}>
              <TabList>
                {HARMONIES.map(({ id, label }) => (
                  <Tab key={id} value={id}>{label}</Tab>
                ))}
              </TabList>
            </Tabs>
          </div>
        </Panel>
      }

      {/* Palette preview */}
      <Panel className="space-y-4">
        <div className="space-y-2">
          <Label>Generated Palette</Label>
          <div className="flex gap-3">
            {activePalette.map((c, i) => (
              <ColorCard key={c + i} color={c} />
            ))}
          </div>
        </div>
        <Textarea
          label="CSS Variables"
          readOnly={true}
          value={cssOutput}
          className="font-mono"
          rows={8}
        />
      </Panel>
    </div>
  );
}
