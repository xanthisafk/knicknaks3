import { useState, useMemo } from "react";
import { Button, Input, Label } from "@/components/ui";
import { Panel } from "@/components/layout";
import { hexToRgb } from "@/lib/convertColor";
import StatBox from "@/components/ui/StatBox";
import { ArrowRightLeft } from "lucide-react";
import { ColorPickerSwatch } from "@/components/advanced"

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

interface WCAGResult {
  ratio: number;
  aa: { normal: boolean; large: boolean };
  aaa: { normal: boolean; large: boolean };
}

function checkWCAG(fg: string, bg: string): WCAGResult | null {
  const fgRgb = hexToRgb(fg);
  const bgRgb = hexToRgb(bg);
  if (!fgRgb || !bgRgb) return null;
  const fgLum = relativeLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const bgLum = relativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  const ratio = contrastRatio(fgLum, bgLum);
  return {
    ratio: Math.round(ratio * 100) / 100,
    aa: { normal: ratio >= 4.5, large: ratio >= 3 },
    aaa: { normal: ratio >= 7, large: ratio >= 4.5 },
  };
}

export default function ContrastCheckerTool() {
  const [fg, setFg] = useState(document.documentElement.dataset.theme === "dark" ? "#ffffff" : "#000000");
  const [bg, setBg] = useState(document.documentElement.dataset.theme === "dark" ? "#000000" : "#ffffff");

  const result = useMemo(() => checkWCAG(fg, bg), [fg, bg]);

  const ratioLabel = result
    ? result.ratio >= 7
      ? "Excellent"
      : result.ratio >= 4.5
        ? "Good"
        : result.ratio >= 3
          ? "Okay for large text"
          : "Poor"
    : "";

  const handleSwap = () => {
    setFg(bg);
    setBg(fg);
  };

  return (
    <div className="space-y-2">
      {/* Preview */}
      <Panel padding="none" className="overflow-hidden">
        <div
          className="p-8 md:p-12 text-center"
          style={{ backgroundColor: bg, color: fg }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Sample Heading
          </h2>
          <p className="text-base md:text-lg mb-4">
            The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-sm opacity-80">
            Small text sample for accessibility checking.
          </p>
        </div>
      </Panel>

      {/* Color pickers */}
      <div className="flex flex-col md:flex-row gap-2">
        <Panel className="grow">
          <ColorPickerSwatch
            onChange={setFg}
            value={fg}
            label="Foreground color"
            placeholder="000000"
            disabled={false}
          />
        </Panel>
        <Button
          onClick={handleSwap}
          variant="secondary"
          icon={ArrowRightLeft}
          title="Swap colors"
        />
        <Panel className="grow">
          <ColorPickerSwatch
            onChange={setBg}
            value={bg}
            label="Background color"
            placeholder="000000"
            disabled={false}
          />
        </Panel>
      </div>

      {/* Results */}
      {result && (
        <>
          <StatBox
            textSize="6xl"
            prefix="Contrast Ratio"
            label={ratioLabel}
            value={result.ratio + ":1"}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <StatBox value={result.aa.normal ? "Pass" : "Fail"} label="AA Normal" tooltip="Good contrast for normal text" />
            <StatBox value={result.aa.large ? "Pass" : "Fail"} label="AA Large" tooltip="Good contrast for large text" />
            <StatBox value={result.aaa.normal ? "Pass" : "Fail"} label="AAA Normal" tooltip="Excellent contrast for normal text" />
            <StatBox value={result.aaa.large ? "Pass" : "Fail"} label="AA Large" tooltip="Excellent contrast for large text" />
          </div>
        </>
      )}
    </div>
  );
}
