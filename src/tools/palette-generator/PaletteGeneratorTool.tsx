import { useState, useCallback, useMemo, useRef } from "react";
import { Button } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

// ===== Color math =====
interface HSL { h: number; s: number; l: number }

function hexToHsl(hex: string): HSL | null {
  const c = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(c)) return null;
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  const _h = h / 360, _s = s / 100, _l = l / 100;
  if (_s === 0) { const v = Math.round(_l * 255); return rgbHex(v, v, v); }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = _l < 0.5 ? _l * (1 + _s) : _l + _s - _l * _s;
  const p = 2 * _l - q;
  return rgbHex(
    Math.round(hue2rgb(p, q, _h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, _h) * 255),
    Math.round(hue2rgb(p, q, _h - 1 / 3) * 255),
  );
}

function rgbHex(r: number, g: number, b: number): string {
  const hex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

function wrapHue(h: number) { return ((h % 360) + 360) % 360; }

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
      return [hslToHex(h, s, l), hslToHex(wrapHue(h + 180), s, l)];
    case "analogous":
      return [hslToHex(wrapHue(h - 30), s, l), hslToHex(h, s, l), hslToHex(wrapHue(h + 30), s, l)];
    case "triadic":
      return [hslToHex(h, s, l), hslToHex(wrapHue(h + 120), s, l), hslToHex(wrapHue(h + 240), s, l)];
    case "split":
      return [hslToHex(h, s, l), hslToHex(wrapHue(h + 150), s, l), hslToHex(wrapHue(h + 210), s, l)];
    case "tetradic":
      return [hslToHex(h, s, l), hslToHex(wrapHue(h + 90), s, l), hslToHex(wrapHue(h + 180), s, l), hslToHex(wrapHue(h + 270), s, l)];
    case "monochromatic":
      return [
        hslToHex(h, s, Math.max(l - 30, 10)),
        hslToHex(h, s, Math.max(l - 15, 15)),
        hslToHex(h, s, l),
        hslToHex(h, s, Math.min(l + 15, 85)),
        hslToHex(h, s, Math.min(l + 30, 95)),
      ];
    default:
      return [hslToHex(h, s, l)];
  }
}

// ===== Median-cut palette extraction =====
function extractColorsFromImage(img: HTMLImageElement, count = 6): string[] {
  const canvas = document.createElement("canvas");
  const size = 64; // downsample for speed
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;

  // Collect pixels
  const pixels: [number, number, number][] = [];
  for (let i = 0; i < data.length; i += 4) {
    pixels.push([data[i], data[i + 1], data[i + 2]]);
  }

  // Simple median-cut
  function medianCut(bucket: [number, number, number][], depth: number): [number, number, number][] {
    if (depth === 0 || bucket.length === 0) {
      const avg: [number, number, number] = [0, 0, 0];
      for (const p of bucket) { avg[0] += p[0]; avg[1] += p[1]; avg[2] += p[2]; }
      return [[Math.round(avg[0] / bucket.length), Math.round(avg[1] / bucket.length), Math.round(avg[2] / bucket.length)]];
    }
    // Find channel with greatest range
    let maxRange = 0, maxCh = 0;
    for (let ch = 0; ch < 3; ch++) {
      const vals = bucket.map(p => p[ch]);
      const range = Math.max(...vals) - Math.min(...vals);
      if (range > maxRange) { maxRange = range; maxCh = ch; }
    }
    bucket.sort((a, b) => a[maxCh] - b[maxCh]);
    const mid = Math.floor(bucket.length / 2);
    return [...medianCut(bucket.slice(0, mid), depth - 1), ...medianCut(bucket.slice(mid), depth - 1)];
  }

  const depth = Math.ceil(Math.log2(count));
  const palette = medianCut(pixels, depth).slice(0, count);
  return palette.map(([r, g, b]) => rgbHex(r, g, b));
}

// ===== Swatch component =====
function Swatch({ hex, large }: { hex: string; large?: boolean }) {
  const [copied, setCopied] = useState(false);
  const textColor = isLightColor(hex) ? "#1a1a1a" : "#ffffff";

  return (
    <button
      onClick={async () => { await copyToClipboard(hex); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className={`group relative rounded-[var(--radius-lg)] transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-lg border border-[var(--border-default)] ${large ? "h-28 flex-1 min-w-[100px]" : "h-20 flex-1 min-w-[72px]"}`}
      style={{ backgroundColor: hex }}
      title={hex.toUpperCase()}
    >
      <span
        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-mono font-medium opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap"
        style={{ color: textColor }}
      >
        {copied ? "✓ Copied!" : hex.toUpperCase()}
      </span>
    </button>
  );
}

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) > 150;
}

export default function PaletteGeneratorTool() {
  const [hex, setHex] = useState("#3B82F6");
  const [mode, setMode] = useState<HarmonyMode>("analogous");
  const [imageColors, setImageColors] = useState<string[] | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const hsl = useMemo(() => hexToHsl(hex), [hex]);

  const palette = useMemo(() => {
    if (!hsl) return [hex];
    return generateHarmony(hsl, mode);
  }, [hsl, mode, hex]);

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => setHex(e.target.value);

  const handleHexInput = (value: string) => {
    setHex(value);
  };

  const handleImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageName(file.name);
    const img = new Image();
    img.onload = () => {
      const colors = extractColorsFromImage(img, 6);
      setImageColors(colors);
    };
    img.src = URL.createObjectURL(file);
  }, []);

  const clearImage = () => {
    setImageColors(null);
    setImageName(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const activePalette = imageColors ?? palette;
  const cssVars = activePalette.map((c, i) => `  --palette-${i + 1}: ${c};`).join("\n");
  const cssOutput = `:root {\n${cssVars}\n}`;
  const [copiedCSS, setCopiedCSS] = useState(false);

  return (
    <div className="space-y-6">
      {/* Seed color */}
      <Panel>
        <div className="space-y-4">
          <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">Seed Color</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[var(--radius-lg)] border-2 border-[var(--border-default)] shadow-sm flex-shrink-0 relative overflow-hidden" style={{ backgroundColor: hex }}>
              <input
                type="color"
                value={hex}
                onChange={handlePickerChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Pick a color"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 rounded-[var(--radius-md)] bg-[var(--surface-secondary)] border border-[var(--border-default)] px-3 py-2.5 focus-within:ring-2 focus-within:ring-[var(--color-primary-500)] focus-within:border-[var(--color-primary-500)] transition-shadow">
                <span className="text-xs font-medium text-[var(--text-tertiary)]">HEX</span>
                <input
                  type="text"
                  value={hex}
                  onChange={(e) => handleHexInput(e.target.value)}
                  className="flex-1 bg-transparent text-sm font-mono text-[var(--text-primary)] outline-none"
                  placeholder="#3B82F6"
                />
              </div>
            </div>
          </div>

          {/* Image upload */}
          <div className="flex items-center gap-3 pt-2 border-t border-[var(--border-default)]">
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" id="palette-image-input" />
            <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
              📷 Extract from Image
            </Button>
            {imageName && (
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                <span className="truncate max-w-[200px]">{imageName}</span>
                <button onClick={clearImage} className="text-[var(--text-tertiary)] hover:text-[var(--color-error)] cursor-pointer transition-colors">✕</button>
              </div>
            )}
          </div>
        </div>
      </Panel>

      {/* Harmony mode selector (only when not using image) */}
      {!imageColors && (
        <Panel>
          <div className="space-y-4">
            <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">Harmony Mode</h3>
            <div className="flex flex-wrap gap-1 p-1 bg-[var(--surface-secondary)] rounded-[var(--radius-lg)] border border-[var(--border-default)]">
              {HARMONIES.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setMode(id)}
                  className={`px-3 py-2 rounded-[var(--radius-md)] text-xs font-medium transition-all duration-200 cursor-pointer ${
                    mode === id
                      ? "bg-white dark:bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-sm border border-[var(--border-default)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] border border-transparent"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </Panel>
      )}

      {/* Palette preview */}
      <Panel>
        <div className="space-y-4">
          <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">
            {imageColors ? "Extracted Palette" : "Generated Palette"}
          </h3>
          <div className="flex gap-3 flex-wrap">
            {activePalette.map((c, i) => (
              <Swatch key={`${c}-${i}`} hex={c} large />
            ))}
          </div>
        </div>
      </Panel>

      {/* CSS Output */}
      <Panel>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">CSS Variables</h3>
            <Button
              onClick={async () => { await copyToClipboard(cssOutput); setCopiedCSS(true); setTimeout(() => setCopiedCSS(false), 2000); }}
              size="sm"
              variant={copiedCSS ? "primary" : "secondary"}
            >
              {copiedCSS ? "✓ Copied!" : "Copy CSS"}
            </Button>
          </div>
          <pre className="rounded-[var(--radius-lg)] bg-[var(--surface-secondary)] border border-[var(--border-default)] p-4 text-sm font-mono text-[var(--text-primary)] whitespace-pre-wrap break-all select-all leading-relaxed overflow-x-auto">
            {cssOutput}
          </pre>
        </div>
      </Panel>
    </div>
  );
}
