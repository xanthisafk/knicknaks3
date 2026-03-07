import { useState, useRef, useCallback, useEffect } from "react";
import { ColorCard } from "@/components/advanced/ColorCard";
import Spinner from "@/components/ui/Spinner";
import type { ColorFormat } from "@/lib/formatColor";
import { rgbToHex } from "@/lib/convertColor";
import { Panel } from "@/components/layout";
import FileDropZone from "@/components/advanced/FileDropZone";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ColorSwatch {
  hex: string;
  percentage: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function colorDistance(a: [number, number, number], b: [number, number, number]): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

function quantizeColors(imageData: ImageData, maxColors = 10): ColorSwatch[] {
  const data = imageData.data;
  const colorMap = new Map<string, { r: number; g: number; b: number; count: number }>();
  for (let i = 0; i < data.length; i += 16) {
    const r = Math.round(data[i] / 16) * 16;
    const g = Math.round(data[i + 1] / 16) * 16;
    const b = Math.round(data[i + 2] / 16) * 16;
    if (data[i + 3] < 128) continue;
    const key = `${r},${g},${b}`;
    const existing = colorMap.get(key);
    if (existing) existing.count++;
    else colorMap.set(key, { r, g, b, count: 1 });
  }
  const sorted = Array.from(colorMap.values()).sort((a, b) => b.count - a.count);
  const palette: typeof sorted = [];
  for (const candidate of sorted) {
    const tooClose = palette.some(
      (p) => colorDistance([p.r, p.g, p.b], [candidate.r, candidate.g, candidate.b]) < 40
    );
    if (!tooClose) {
      palette.push(candidate);
      if (palette.length >= maxColors) break;
    }
  }
  const sampledPixels = data.length / 16;
  return palette.map((c) => ({
    hex: rgbToHex({ r: c.r, g: c.g, b: c.b }),
    percentage: Math.round((c.count / sampledPixels) * 100 * 10) / 10,
  }));
}

// Normalise any sRGB hex that the EyeDropper API may return (e.g. #rrggbb or #rrggbbaa)
function normaliseHex(raw: string): string {
  const hex = raw.replace("#", "").toUpperCase();
  if (hex.length === 6) return "#" + hex;
  if (hex.length === 8) return "#" + hex.slice(0, 6); // drop alpha
  return "#" + hex.padEnd(6, "0");
}

// ─── Main Component ───────────────────────────────────────────────────────────

// Extend the Window type to include EyeDropper (not yet in all TS lib versions)
declare global {
  interface Window {
    EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
  }
}

export default function ImageColorPickerTool() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [swatches, setSwatches] = useState<ColorSwatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [colorCount, setColorCount] = useState(10);
  const [copiedAll, setCopiedAll] = useState(false);
  const [globalFormat, setGlobalFormat] = useState<ColorFormat>("hex");

  // Eyedropper
  const [eyedropperSupported] = useState(() => typeof window !== "undefined" && !!window.EyeDropper);
  const [eyedropperPicking, setEyedropperPicking] = useState(false);
  const [pickedColors, setPickedColors] = useState<string[]>([]);

  const analysisCanvasRef = useRef<HTMLCanvasElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImageToDisplayCanvas = useCallback((url: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const MAX = 1400;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const dc = displayCanvasRef.current!;
      dc.width = img.width * scale;
      dc.height = img.height * scale;
      dc.getContext("2d")!.drawImage(img, 0, 0, dc.width, dc.height);
    };
    img.src = url;
  }, []);

  const processImage = useCallback((url: string) => {
    setLoading(true);
    setSwatches([]);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = analysisCanvasRef.current!;
      const MAX = 400;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height);
      setSwatches(quantizeColors(imageData, colorCount));
      setLoading(false);
    };
    img.src = url;
  }, [colorCount]);

  useEffect(() => {
    if (imageUrl) processImage(imageUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorCount]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImageName(file.name);
    setPickedColors([]);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    loadImageToDisplayCanvas(url);
    processImage(url);
  };

  // ── Native EyeDropper API ──────────────────────────────────────────────────
  const activateEyedropper = async () => {
    if (!window.EyeDropper) return;
    setEyedropperPicking(true);
    try {
      const dropper = new window.EyeDropper();
      const result = await dropper.open();
      const hex = normaliseHex(result.sRGBHex);
      setPickedColors((prev) => [hex, ...prev.filter((c) => c !== hex)].slice(0, 16));
    } catch {
      // User cancelled — do nothing
    } finally {
      setEyedropperPicking(false);
    }
  };

  const copyAll = () => {
    const text = swatches.map((s) => s.hex).join(", ");
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1400);
    });
  };

  const reset = () => {
    setImageUrl(null);
    setImageName("");
    setSwatches([]);
    setPickedColors([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-5">
      {/* Hidden analysis canvas */}
      <canvas ref={analysisCanvasRef} className="hidden" />

      {/* Upload zone */}
      {!imageUrl ? <FileDropZone accepts="image/*" emoji="🖼️" onUpload={e => handleFile(e.file)} />
        : (
          <>
            {/* Toolbar */}
            <Panel className="py-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-(--text-secondary) truncate max-w-[200px]">{imageName}</span>

                <div className="flex-1" />

                {/* Global format selector */}
                <div className="flex items-center gap-1.5">
                  <label className="text-xs text-(--text-secondary)">Format</label>
                  <select
                    value={globalFormat}
                    onChange={(e) => setGlobalFormat(e.target.value as ColorFormat)}
                    className="text-xs rounded-sm border border-(--border-default) bg-(--surface-bg) text-(--text-primary) px-2 py-1 cursor-pointer"
                  >
                    {(["hex", "rgb", "rgba", "hsl", "hsla", "oklch"] as ColorFormat[]).map((f) => (
                      <option key={f} value={f}>{f.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                {/* Eyedropper button — uses native EyeDropper API */}
                {eyedropperSupported && (
                  <button
                    onClick={activateEyedropper}
                    disabled={eyedropperPicking}
                    title="Pick any colour from anywhere on screen using the browser eyedropper"
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border transition-all ${eyedropperPicking
                      ? "border-primary-500 bg-primary-500/10 text-(--text-primary) opacity-70 cursor-wait"
                      : "border-(--border-default) bg-(--surface-bg) text-(--text-secondary) hover:text-(--text-primary) hover:border-primary-500/60"
                      }`}
                  >
                    <span>{eyedropperPicking ? "🧿" : "👁️"}</span>
                    <span>{eyedropperPicking ? "Picking…" : "Eyedropper"}</span>
                  </button>
                )}

                {/* Max colors slider */}
                <div className="flex items-center gap-2">
                  <label className="text-xs text-(--text-secondary) whitespace-nowrap">Colors</label>
                  <input type="range" min={4} max={16} value={colorCount}
                    onChange={(e) => setColorCount(Number(e.target.value))}
                    className="w-24 accent-primary-500" />
                  <span className="text-xs font-mono text-(--text-primary) w-4">{colorCount}</span>
                </div>

                {swatches.length > 0 && (
                  <button onClick={copyAll}
                    className="px-3 py-1.5 text-xs rounded-md border border-(--border-default) bg-(--surface-bg) text-(--text-secondary) hover:text-(--text-primary) hover:border-primary-500 transition-colors">
                    {copiedAll ? "✓ Copied" : "Copy all"}
                  </button>
                )}

                <button onClick={reset}
                  className="px-3 py-1.5 text-xs rounded-md border border-(--border-default) bg-(--surface-bg) text-(--text-secondary) hover:text-(--text-primary) hover:border-primary-500 transition-colors">
                  ↩ New image
                </button>
              </div>
            </Panel>

            {/* Image preview */}
            <Panel className="p-0 overflow-hidden">
              <canvas
                ref={displayCanvasRef}
                className="w-full h-auto block"
                style={{ maxHeight: "72vh", objectFit: "contain" }}
              />
            </Panel>

            {/* Loading */}
            {loading && (
              <Panel>
                <div className="flex items-center justify-center gap-3 py-4">
                  <Spinner />
                  <span className="text-sm text-(--text-secondary)">Analysing pixels…</span>
                </div>
              </Panel>
            )}

            {/* Extracted palette */}
            {!loading && swatches.length > 0 && (
              <Panel>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase">
                    Extracted Palette
                  </h3>
                  <div className="flex rounded-full overflow-hidden h-4 w-40 border border-(--border-default)">
                    {swatches.map((s) => (
                      <div key={s.hex} style={{ backgroundColor: s.hex, flex: s.percentage }} />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {swatches.map((swatch, i) => (
                    <ColorCard
                      key={swatch.hex + i}
                      color={swatch.hex}
                      label={`${swatch.percentage}%`}
                      defaultFormat={globalFormat}
                    />
                  ))}
                </div>
              </Panel>
            )}

            {/* Eyedropper picked colors */}
            {pickedColors.length > 0 && (
              <Panel>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase">
                    Picked Colors
                  </h3>
                  <button
                    onClick={() => setPickedColors([])}
                    className="text-[11px] text-(--text-tertiary) hover:text-(--text-primary) transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {pickedColors.map((color, i) => (
                    <ColorCard key={color + i} color={color} defaultFormat={globalFormat} />
                  ))}
                </div>
              </Panel>
            )}
          </>
        )}
    </div>
  );
}