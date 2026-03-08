export type ColorFormat = "hex" | "rgb" | "hsl" | "oklch" | "rgba" | "hsla";

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

function toHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
}

function getLuminance(r: number, g: number, b: number): number {
  return 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
}

export {
    formatColor,
    rgbToOklch,
    toHex,
    getLuminance
}