import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ColorFormat = "hex" | "rgb" | "hsl" | "oklch" | "rgba" | "hsla";

export interface ColorCardProps {
  /** Accept any CSS color string: #rrggbb, rgb(...), rgba(...), hsl(...), hsla(...), oklch(...) */
  color: string;
  /** Optional label shown below the swatch block (e.g. "46.2%") */
  label?: string;
  /** Default format to show. Falls back to "hex". */
  defaultFormat?: ColorFormat;
  /** Optional extra class on the root element */
  className?: string;
}

// ─── Color conversion helpers ─────────────────────────────────────────────────

/** Parse any supported CSS color string into {r,g,b,a} with components 0-255 / 0-1. */
function parseColor(input: string): { r: number; g: number; b: number; a: number } | null {
  const s = input.trim();

  // HEX  #rgb / #rrggbb / #rrggbbaa
  const hex = s.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    if (h.length === 6) h += "ff";
    const n = parseInt(h, 16);
    return {
      r: (n >> 24) & 0xff,
      g: (n >> 16) & 0xff,
      b: (n >> 8) & 0xff,
      a: ((n & 0xff) / 255),
    };
  }

  // rgb / rgba
  const rgbMatch = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
  if (rgbMatch) {
    return {
      r: parseFloat(rgbMatch[1]),
      g: parseFloat(rgbMatch[2]),
      b: parseFloat(rgbMatch[3]),
      a: rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1,
    };
  }

  // hsl / hsla
  const hslMatch = s.match(/^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)$/i);
  if (hslMatch) {
    const h2 = parseFloat(hslMatch[1]) / 360;
    const sl = parseFloat(hslMatch[2]) / 100;
    const l = parseFloat(hslMatch[3]) / 100;
    const a2 = hslMatch[4] !== undefined ? parseFloat(hslMatch[4]) : 1;
    const { r, g, b } = hslToRgb(h2, sl, l);
    return { r, g, b, a: a2 };
  }

  // oklch(L C H) — approximate via LCH → Lab → XYZ → sRGB
  const oklchMatch = s.match(/^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/i);
  if (oklchMatch) {
    const L = parseFloat(oklchMatch[1]);
    const C = parseFloat(oklchMatch[2]);
    const H = parseFloat(oklchMatch[3]) * (Math.PI / 180);
    const a2 = oklchMatch[4] !== undefined ? parseFloat(oklchMatch[4]) : 1;
    const { r, g, b } = oklchToRgb(L, C, H);
    return { r, g, b, a: a2 };
  }

  return null;
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  let r: number, g: number, b: number;
  if (s === 0) { r = g = b = l; }
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function hue2rgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function oklchToRgb(L: number, C: number, H: number): { r: number; g: number; b: number } {
  // OKLab intermediary
  const a = C * Math.cos(H);
  const b = C * Math.sin(H);
  // OKLab → LMS
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const lc = l_ ** 3, mc = m_ ** 3, sc = s_ ** 3;
  // LMS → linear sRGB
  const rl =  4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc;
  const gl = -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc;
  const bl = -0.0041960863 * lc - 0.7034186147 * mc + 1.7076147010 * sc;
  // linear → gamma
  const gamma = (x: number) =>
    x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(Math.max(0, x), 1 / 2.4) - 0.055;
  return {
    r: Math.round(Math.min(1, Math.max(0, gamma(rl))) * 255),
    g: Math.round(Math.min(1, Math.max(0, gamma(gl))) * 255),
    b: Math.round(Math.min(1, Math.max(0, gamma(bl))) * 255),
  };
}

// ─── Format serialisers ───────────────────────────────────────────────────────

function toHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
    case g: h = ((b - r) / d + 2) / 6; break;
    case b: h = ((r - g) / d + 4) / 6; break;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToOklch(r: number, g: number, b: number): { L: number; C: number; H: number } {
  // sRGB → linear
  const lin = (x: number) => {
    x /= 255;
    return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };
  const rl = lin(r), gl = lin(g), bl = lin(b);
  // linear sRGB → LMS
  const l = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
  const m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
  const s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  // LMS → OKLab
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const bv = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;
  const C = Math.sqrt(a * a + bv * bv);
  const H = (Math.atan2(bv, a) * 180) / Math.PI;
  return {
    L: Math.round(L * 1000) / 1000,
    C: Math.round(C * 1000) / 1000,
    H: Math.round(((H % 360) + 360) % 360 * 10) / 10,
  };
}

function formatColor(r: number, g: number, b: number, a: number, fmt: ColorFormat): string {
  switch (fmt) {
    case "hex":
      return toHex(r, g, b);
    case "rgb":
      return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    case "rgba":
      return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${Math.round(a * 100) / 100})`;
    case "hsl": {
      const { h, s, l } = rgbToHsl(r, g, b);
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
    case "hsla": {
      const { h, s, l } = rgbToHsl(r, g, b);
      return `hsla(${h}, ${s}%, ${l}%, ${Math.round(a * 100) / 100})`;
    }
    case "oklch": {
      const { L, C, H } = rgbToOklch(r, g, b);
      return `oklch(${L} ${C} ${H})`;
    }
  }
}

function getLuminance(r: number, g: number, b: number): number {
  return 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
}

// ─── Format cycle order ───────────────────────────────────────────────────────

const FORMAT_CYCLE: ColorFormat[] = ["hex", "rgb", "rgba", "hsl", "hsla", "oklch"];

const FORMAT_LABELS: Record<ColorFormat, string> = {
  hex: "HEX",
  rgb: "RGB",
  rgba: "RGBA",
  hsl: "HSL",
  hsla: "HSLA",
  oklch: "OKLCH",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ColorCard({ color, label, defaultFormat = "hex", className = "" }: ColorCardProps) {
  const parsed = parseColor(color);

  const [format, setFormat] = useState<ColorFormat>(defaultFormat);
  const [copied, setCopied] = useState(false);

  if (!parsed) {
    return (
      <div className={`rounded-[var(--radius-md)] border border-[var(--border-default)] overflow-hidden ${className}`}>
        <div className="h-16 bg-[var(--surface-bg)] flex items-center justify-center">
          <span className="text-xs text-[var(--text-tertiary)]">Invalid color</span>
        </div>
      </div>
    );
  }

  const { r, g, b, a } = parsed;
  const displayHex = toHex(r, g, b);
  const formattedValue = formatColor(r, g, b, a, format);
  const textOnColor = getLuminance(r, g, b) > 0.35 ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.75)";

  const cycleFormat = () => {
    const idx = FORMAT_CYCLE.indexOf(format);
    setFormat(FORMAT_CYCLE[(idx + 1) % FORMAT_CYCLE.length]);
  };

  const copy = () => {
    navigator.clipboard.writeText(formattedValue).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  };

  return (
    <div className={`rounded-[var(--radius-md)] border border-[var(--border-default)] overflow-hidden flex flex-col ${className}`}>
      {/* Swatch */}
      <div
        className="h-20 flex items-end justify-between p-2 gap-1"
        style={{ backgroundColor: displayHex }}
      >
        {label && (
          <span
            className="text-[11px] font-semibold px-1.5 py-0.5 rounded font-mono"
            style={{ backgroundColor: textOnColor.replace("0.65", "0.18").replace("0.75", "0.18"), color: textOnColor }}
          >
            {label}
          </span>
        )}
        {/* Format cycle pill */}
        <button
          onClick={cycleFormat}
          title="Switch color format"
          className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded font-mono transition-opacity hover:opacity-100 opacity-70"
          style={{ backgroundColor: textOnColor.replace("0.65", "0.18").replace("0.75", "0.18"), color: textOnColor }}
        >
          {FORMAT_LABELS[format]}
        </button>
      </div>

      {/* Value row */}
      <div className="bg-[var(--surface-elevated)] px-3 py-2.5 flex items-center gap-1.5 min-w-0">
        <span
          className="font-mono text-[12px] text-[var(--text-primary)] flex-1 truncate"
          title={formattedValue}
        >
          {formattedValue}
        </span>
        <button
          onClick={copy}
          className="flex-shrink-0 px-2 py-0.5 text-[11px] rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-bg)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:border-[var(--color-primary-500)] transition-colors font-mono"
        >
          {copied ? "✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}

export default ColorCard;