import { useState, useMemo } from "react";
import { Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { hexToRgb } from "@/lib/convertColor";
import StatBox from "@/components/ui/StatBox";

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
  const [fg, setFg] = useState("#1a1a2e");
  const [bg, setBg] = useState("#ffffff");

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
    <div className="space-y-6">
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
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
        <Panel>
          <h3 className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase mb-3">Foreground (Text)</h3>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="w-12 h-12 rounded-md border border-(--border-default) cursor-pointer p-0.5"
            />
            <Input
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              placeholder="#1a1a2e"
              className="font-mono"
            />
          </div>
        </Panel>
        <button
          onClick={handleSwap}
          className="hidden sm:flex self-center items-center justify-center w-10 h-10 rounded-full bg-(--surface-secondary) border border-(--border-default) hover:bg-(--surface-elevated) hover:border-(--border-hover) cursor-pointer text-(--text-secondary) hover:text-(--text-primary) mb-2"
          title="Swap colors"
        >
          ⇄
        </button>
        <Panel>
          <h3 className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase mb-3">Background</h3>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="w-12 h-12 rounded-md border border-(--border-default) cursor-pointer p-0.5"
            />
            <Input
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              placeholder="#ffffff"
              className="font-mono"
            />
          </div>
        </Panel>
      </div>

      {/* Results */}
      {result && (
        <>
          <Panel>
            <div className="text-center">
              <p className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase mb-1">Contrast Ratio</p>
              <p className="text-4xl md:text-5xl font-bold font-mono text-primary-500 tabular-nums">
                {result.ratio}:1
              </p>
              <p className="text-sm mt-2 text-(--text-secondary)">{ratioLabel}</p>
            </div>
          </Panel>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
