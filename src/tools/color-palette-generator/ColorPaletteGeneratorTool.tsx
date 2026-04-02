import ColorCard from "@/components/advanced/ColorCard";
import { Box, Container, FloatingContainer, Panel } from "@/components/layout/Primitive";
import { Button } from "@/components/ui";
import { useCallback, useEffect, useRef, useState } from "react";
import { hslToHex, hexToRgb, randomVibrantHsl, rgbToCmyk, rgbToOklch, downloadAsDataURL, type ColorFormat } from "@/lib";
import { ChevronDown, ChevronUp, Lock, Unlock } from "lucide-react";
import { Select, SelectContent, SelectTrigger, SelectItem } from "@/components/ui/select";

const FORMATS: { [key: string]: string } = {
  HEX: "hex",
  RGB: "rgb",
  HSL: "hsl",
  OKLCH: "oklch",
  CMYK: "cmyk",
}

// ─── helpers ────────────────────────────────────────────────────────────────

/** Generate a vibrant HSL colour – high saturation, mid-high lightness */


/** Clamp a number between min and max */
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

// ─── types ───────────────────────────────────────────────────────────────────

interface ColorEntry {
  h: number;
  s: number;
  l: number;
  locked: boolean;
}

// ─── PNG download ────────────────────────────────────────────────────────────

const SHADE_STEPS = 9; // how many shade columns to render in the PNG

function buildShadeStrip(
  base: ColorEntry
): { hex: string; label: string }[] {
  return Array.from({ length: SHADE_STEPS }, (_, i) => {
    // lightness from 90 % (lightest) → 15 % (darkest)
    const l = Math.round(90 - i * (75 / (SHADE_STEPS - 1)));
    const hex = hslToHex({ h: base.h, s: base.s, l });
    const shade = Math.round(((i + 1) / SHADE_STEPS) * 900);
    return { hex, label: String(shade) };
  });
}

async function downloadPaletteAsPng(entries: ColorEntry[]): Promise<void> {
  const W = 2000;
  const swatchCount = SHADE_STEPS;
  const swatchW = W / swatchCount;
  const swatchH = Math.round(swatchW * 3);
  const labelH = 80;
  const rowH = swatchH + labelH;
  const H = rowH * entries.length;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  entries.forEach((entry, rowIdx) => {
    const shades = buildShadeStrip(entry);
    const baseHex = hslToHex({ h: entry.h, s: entry.s, l: entry.l });
    const rowY = rowIdx * rowH;

    shades.forEach(({ hex, label }, i) => {
      const x = i * swatchW;

      ctx.fillStyle = hex;
      ctx.fillRect(x, rowY, swatchW, swatchH);

      ctx.font = `500 ${Math.round(swatchW * 0.115)}px Inter`;
      ctx.fillStyle = "#111827";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(
        label,
        x + swatchW / 2,
        rowY + swatchH + Math.round(labelH * 0.42)
      );

      ctx.font = `400 ${Math.round(swatchW * 0.10)}px "JetBrains Mono"`;
      ctx.fillStyle = "#6b7280";
      ctx.textAlign = "center";
      ctx.fillText(
        hex.toUpperCase(),
        x + swatchW / 2,
        rowY + swatchH + Math.round(labelH * 0.78)
      );
    });

    // watermark + base hex on first swatch of each row
    ctx.font = `${Math.round(swatchW * 0.085)}px "Gloria Hallelujah"`;
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("knicknaks", swatchW * 0.05, rowY + 34);

    ctx.font = `500 ${Math.round(swatchW * 0.085)}px Inter`;
    ctx.fillStyle = "rgba(255,255,255,0.90)";
    ctx.textAlign = "right";
    ctx.fillText(
      baseHex.toUpperCase(),
      W - swatchW * 0.05,
      rowY + 34
    );
  });

  downloadAsDataURL(canvas.toDataURL("image/png"), `palette-knicknaks.png`);
}

const getColor = (destination: string, value: string) => {
  switch (destination) {
    case "rgb":
      return hexToRgb(value);
    case "cmyk":
      const color = hexToRgb(value)!;
      return rgbToCmyk({ r: color.r, g: color.g, b: color.b });
    case "oklch":
      const color2 = hexToRgb(value)!;
      return rgbToOklch(color2.r, color2.g, color2.b);
    default:
      return value;
  }
}

// ─── component ───────────────────────────────────────────────────────────────

export default function ColorPaletteGeneratorTool() {
  const [entries, setEntries] = useState<ColorEntry[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [format, setFormat] = useState<ColorFormat>("hex");

  // ── initialise ──────────────────────────────────────────────────────────
  useEffect(() => {
    setEntries(
      Array.from({ length: 5 }, () => ({
        ...randomVibrantHsl(),
        locked: false,
      }))
    );
  }, []);

  // ── focus container so keydown works immediately ────────────────────────
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // ── generation ──────────────────────────────────────────────────────────
  const generate = useCallback(() => {
    setEntries((prev) =>
      prev.map((e) =>
        e.locked ? e : { ...randomVibrantHsl(), locked: false }
      )
    );
  }, []);

  const addColor = () => {
    if (entries.length >= 100) return;
    setEntries((prev) => [...prev, { ...randomVibrantHsl(), locked: false }]);
  };

  const removeColor = () => {
    if (entries.length <= 1) return;
    setEntries((prev) => prev.slice(0, -1));
  };

  // ── per-card actions ────────────────────────────────────────────────────
  const toggleLock = (idx: number) => {
    setEntries((prev) =>
      prev.map((e, i) => (i === idx ? { ...e, locked: !e.locked } : e))
    );
  };

  const shadeUp = (idx: number) => {
    setEntries((prev) =>
      prev.map((e, i) =>
        i === idx ? { ...e, l: clamp(e.l + 5, 10, 95) } : e
      )
    );
  };

  const shadeDown = (idx: number) => {
    setEntries((prev) =>
      prev.map((e, i) =>
        i === idx ? { ...e, l: clamp(e.l - 5, 10, 95) } : e
      )
    );
  };

  // ── CSS export ──────────────────────────────────────────────────────────
  const copyCss = () => {


    const colors = entries.map((e) => {
      const hex = hslToHex({ h: e.h, s: e.s, l: e.l });
      if (format !== "hsl") {
        return getColor(format, hex);
      } else {
        return hex;
      }
    });


    const css = `:root {\n${entries
      .map(
        (e, i) =>
          `  --color-${i + 1}: ${hslToHex({ h: e.h, s: e.s, l: e.l })}; /* hsl(${Math.round(e.h)}, ${Math.round(e.s)}%, ${Math.round(e.l)}%) */`
      )
      .join("\n")}\n}`;
    navigator.clipboard.writeText(css);
  };

  // ── keyboard ────────────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      generate();
    }
  };

  const count = entries.length;
  const cols = Math.min(count, 3);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="space-y-3 focus:border-none focus:ring-0 focus:outline-none"
      aria-label="Color palette generator. Press Enter or Space to regenerate."
    >
      <Container cols={3}>
        <Box colSpan={2}>
          <Panel>
            <Container cols={cols}>
              {entries.map((entry, i) => {
                const hex = hslToHex({ h: entry.h, s: entry.s, l: entry.l });
                return (
                  <div key={i} className="flex flex-col gap-1">
                    <ColorCard
                      color={`hsl(${entry.h}, ${entry.s}%, ${entry.l}%)`}
                      defaultFormat="hex"
                    />
                    {/* shade + lock controls */}
                    <div className="grid grid-cols-3 gap-1 px-1">
                      <Button
                        title="Darken Color"
                        onClick={() => shadeDown(i)}
                        variant="secondary"
                        size="sm"
                        icon={ChevronDown}
                      />
                      <Button
                        onClick={() => toggleLock(i)}
                        title={entry.locked ? "Unlock Color" : "Lock Color"}
                        variant="secondary"
                        size="sm"
                        icon={entry.locked ? Lock : Unlock}
                      />
                      <Button
                        onClick={() => shadeUp(i)}
                        title="Lighten Color"
                        variant="secondary"
                        size="sm"
                        icon={ChevronUp}
                      />
                    </div>
                    <div className="text-center text-[10px] text-gray-400 font-mono">
                      {hex.toUpperCase()}
                    </div>
                  </div>
                );
              })}
            </Container>
          </Panel>
        </Box>

        <Panel className="flex flex-col gap-2">
          <p className="text-xs text-gray-500 text-center select-none">
            Press <kbd className="px-1 py-0.5 rounded border text-[10px]">Enter</kbd> or{" "}
            <kbd className="px-1 py-0.5 rounded border text-[10px]">Space</kbd> to regenerate
          </p>

          <Button onClick={generate}>
            Generate Colors
          </Button>

          <div className="flex items-center justify-around">
            <Button
              disabled={count >= 100}
              variant="secondary"
              onClick={addColor}
            >
              Add
            </Button>
            <span className="text-xs text-gray-400 tabular-nums">{count}</span>
            <Button
              disabled={count <= 1}
              variant="secondary"
              onClick={removeColor}
            >
              Remove
            </Button>
          </div>
          <p className="text-[10px] text-gray-400 text-center leading-tight select-none">
            🔒 Lock colors before regenerating to keep them.
            <br />↑ / ↓ buttons adjust lightness per swatch.
          </p>
        </Panel>
      </Container>
      <FloatingContainer>
        <Select value={format} onValueChange={v => setFormat(v as ColorFormat)}>
          <SelectTrigger>
            {format.toUpperCase()}
          </SelectTrigger>
          <SelectContent>
            {Object.values(FORMATS).map((format) => (
              <SelectItem key={format} value={format}>
                {format.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={() => downloadPaletteAsPng(entries)}
        >
          Download Palette (PNG)
        </Button>

        <Button onClick={copyCss}>Copy CSS Variables</Button>
      </FloatingContainer>
    </div>
  );
}