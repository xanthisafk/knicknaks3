export interface HSL { h: number; s: number; l: number }
export interface RGB { r: number; g: number; b: number }
export interface LCH { l: number; c: number; h: number }
export interface CMYK { c: number; m: number; y: number; k: number }
export interface RGBA { r: number; g: number; b: number, a: number }

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
    const { r, g, b } = hslToRgb({h: h2, s: sl, l});
    return { r, g, b, a: a2 };
  }

  // oklch(L C H) — approximate via LCH → Lab → XYZ → sRGB
  const oklchMatch = s.match(/^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/i);
  if (oklchMatch) {
    const L = parseFloat(oklchMatch[1]);
    const C = parseFloat(oklchMatch[2]);
    const H = parseFloat(oklchMatch[3]) * (Math.PI / 180);
    const a2 = oklchMatch[4] !== undefined ? parseFloat(oklchMatch[4]) : 1;
    const { r, g, b } = oklchToRgb({l: L, c: C, h: H});
    return { r, g, b, a: a2 };
  }

  return null;
}


// ------------
// HSL
// ------------
function hslToRgb({h, s, l}: HSL): RGB {
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


function hslToHex({h, s, l}: HSL): string {
  const _h = h / 360, _s = s / 100, _l = l / 100;
  if (_s === 0) { const v = Math.round(_l * 255); return rgbToHex({r: v, g: v, b: v}); }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = _l < 0.5 ? _l * (1 + _s) : _l + _s - _l * _s;
  const p = 2 * _l - q;
  return rgbToHex({
    r: Math.round(hue2rgb(p, q, _h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, _h) * 255),
    b: Math.round(hue2rgb(p, q, _h - 1 / 3) * 255),
});
}


// ------------
// OKLCH
// ------------
function oklchToRgb({l,c,h}: LCH): { r: number; g: number; b: number } {
  // OKLab intermediary
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);
  // OKLab → LMS
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;
  const lc = l_ ** 3, mc = m_ ** 3, sc = s_ ** 3;
  // LMS → linear sRGB
  const rl = 4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc;
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


// ------------
// HEX
// ------------
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

function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}


// ------------
// RGB
// ------------
function rgbToHex({r, g, b}: RGB): string {
  const hex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

function rgbToCmyk(rgb: RGB): CMYK {
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - r - k) / (1 - k)) * 100),
    m: Math.round(((1 - g - k) / (1 - k)) * 100),
    y: Math.round(((1 - b - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// ------------
// CMYK
// ------------
function cmykToRgb(cmyk: CMYK): RGB {
  const c = cmyk.c / 100, m = cmyk.m / 100, y = cmyk.y / 100, k = cmyk.k / 100;
  return {
    r: Math.round(255 * (1 - c) * (1 - k)),
    g: Math.round(255 * (1 - m) * (1 - k)),
    b: Math.round(255 * (1 - y) * (1 - k)),
  };
}


// ------------
// HUE
// ------------
function wrapHue(h: number) { return ((h % 360) + 360) % 360; }

function hue2rgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

export {
    parseColor,

    // HSL
    hslToRgb,
    hslToHex,

    // OKLCH
    oklchToRgb,

    // HEX
    hexToHsl,
    hexToRgb,

    // RGB
    rgbToHex,
    rgbToCmyk,
    rgbToHsl,

    // CMYK
    cmykToRgb,

    // Hue
    wrapHue,
    hue2rgb,
}
