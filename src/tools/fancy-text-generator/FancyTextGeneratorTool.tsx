import { useState, useEffect, useRef } from "react";
import { Panel } from "@/components/layout";
import { ResultRow } from "@/components/advanced/ResultRow";
import { Textarea } from "@/components/ui";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FontDef {
  name: string;
  upper: number;
  lower: number;
  digits?: number;
  exceptions?: Record<string, number>;
}

interface SpecialDef {
  name: string;
  transform: (input: string) => string;
}

interface VariantRow {
  name: string;
  text: string;
}

// ---------------------------------------------------------------------------
// Unicode math font definitions (offset-based)
// ---------------------------------------------------------------------------

const FONTS: FontDef[] = [
  { name: "𝐁𝐨𝐥𝐝", upper: 0x1d400, lower: 0x1d41a, digits: 0x1d7ce },
  {
    name: "𝐼𝑡𝑎𝑙𝑖𝑐",
    upper: 0x1d434,
    lower: 0x1d44e,
    exceptions: { h: 0x210e },
  },
  { name: "𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄", upper: 0x1d468, lower: 0x1d482 },
  {
    name: "𝒮𝒸𝓇𝒾𝓅𝓉",
    upper: 0x1d49c,
    lower: 0x1d4b6,
    exceptions: {
      B: 0x212c, E: 0x2130, F: 0x2131, H: 0x210b,
      I: 0x2110, L: 0x2112, M: 0x2133, R: 0x211b,
      e: 0x212f, g: 0x210a, o: 0x2134,
    },
  },
  { name: "𝓑𝓸𝓵𝓭 𝓢𝓬𝓻𝓲𝓹𝓽", upper: 0x1d4d0, lower: 0x1d4ea },
  {
    name: "𝔉𝔯𝔞𝔨𝔱𝔲𝔯",
    upper: 0x1d504,
    lower: 0x1d51e,
    exceptions: { C: 0x212d, H: 0x210c, I: 0x2111, R: 0x211c, Z: 0x2128 },
  },
  { name: "𝕭𝖔𝖑𝖉 𝕱𝖗𝖆𝖐𝖙𝖚𝖗", upper: 0x1d56c, lower: 0x1d586 },
  {
    name: "𝔻𝕠𝕦𝕓𝕝𝕖-𝕊𝕥𝕣𝕦𝕔𝕜",
    upper: 0x1d538,
    lower: 0x1d552,
    digits: 0x1d7d8,
    exceptions: {
      C: 0x2102, H: 0x210d, N: 0x2115, P: 0x2119,
      Q: 0x211a, R: 0x211d, Z: 0x2124,
    },
  },
  { name: "𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎", upper: 0x1d670, lower: 0x1d68a, digits: 0x1d7f6 },
  { name: "𝖲𝖺𝗇𝗌-𝖲𝖾𝗋𝗂𝖿", upper: 0x1d5a0, lower: 0x1d5ba, digits: 0x1d7e2 },
  { name: "𝗦𝗮𝗻𝘀 𝗕𝗼𝗹𝗱", upper: 0x1d5d4, lower: 0x1d5ee, digits: 0x1d7ec },
  { name: "𝘚𝘢𝘯𝘴 𝘐𝘵𝘢𝘭𝘪𝘤", upper: 0x1d608, lower: 0x1d622 },
  { name: "𝙎𝙖𝙣𝙨 𝘽𝙤𝙡𝙙 𝙄𝙩𝙖𝙡𝙞𝙘", upper: 0x1d63c, lower: 0x1d656 },
];

// ---------------------------------------------------------------------------
// Offset-based transform helpers
// ---------------------------------------------------------------------------

function transformChar(ch: string, font: FontDef): string {
  if (font.exceptions && ch in font.exceptions)
    return String.fromCodePoint(font.exceptions[ch]);
  const code = ch.codePointAt(0)!;
  if (code >= 65 && code <= 90) return String.fromCodePoint(font.upper + (code - 65));
  if (code >= 97 && code <= 122) return String.fromCodePoint(font.lower + (code - 97));
  if (font.digits !== undefined && code >= 48 && code <= 57)
    return String.fromCodePoint(font.digits + (code - 48));
  return ch;
}

function transformText(input: string, font: FontDef): string {
  return [...input].map((ch) => transformChar(ch, font)).join("");
}

// ---------------------------------------------------------------------------
// Special / lookup-table transforms
// ---------------------------------------------------------------------------

const CIRCLED: FontDef = { name: "Ⓒⓘⓡⓒⓛⓔⓓ", upper: 0x24b6, lower: 0x24d0 };
const FULLWIDTH: FontDef = { name: "Ｆｕｌｌｗｉｄｔｈ", upper: 0xff21, lower: 0xff41, digits: 0xff10 };

function transformSquared(ch: string): string {
  const c = ch.codePointAt(0)!;
  if (c >= 65 && c <= 90) return String.fromCodePoint(0x1f130 + (c - 65));
  if (c >= 97 && c <= 122) return String.fromCodePoint(0x1f130 + (c - 97));
  return ch;
}

function transformNegSquared(ch: string): string {
  const c = ch.codePointAt(0)!;
  if (c >= 65 && c <= 90) return String.fromCodePoint(0x1f170 + (c - 65));
  if (c >= 97 && c <= 122) return String.fromCodePoint(0x1f170 + (c - 97));
  return ch;
}

function transformRegional(ch: string): string {
  const c = ch.codePointAt(0)!;
  if (c >= 65 && c <= 90) return String.fromCodePoint(0x1f1e6 + (c - 65));
  if (c >= 97 && c <= 122) return String.fromCodePoint(0x1f1e6 + (c - 97));
  return ch;
}

function transformParen(ch: string): string {
  const c = ch.codePointAt(0)!;
  if (c >= 97 && c <= 122) return String.fromCodePoint(0x249c + (c - 97));
  if (c >= 65 && c <= 90) return String.fromCodePoint(0x249c + (c - 65));
  if (c >= 49 && c <= 57) return String.fromCodePoint(0x2474 + (c - 49));
  return ch;
}

const SMALL_CAPS: Record<string, string> = {
  a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ",
  k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ", s: "ꜱ", t: "ᴛ",
  u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ",
};
function transformSmallCaps(input: string): string {
  return [...input].map(ch => SMALL_CAPS[ch.toLowerCase()] ?? ch).join("");
}

const SUPERSCRIPT: Record<string, string> = {
  a: "ᵃ", b: "ᵇ", c: "ᶜ", d: "ᵈ", e: "ᵉ", f: "ᶠ", g: "ᵍ", h: "ʰ", i: "ⁱ", j: "ʲ",
  k: "ᵏ", l: "ˡ", m: "ᵐ", n: "ⁿ", o: "ᵒ", p: "ᵖ", q: "q", r: "ʳ", s: "ˢ", t: "ᵗ",
  u: "ᵘ", v: "ᵛ", w: "ʷ", x: "ˣ", y: "ʸ", z: "ᶻ",
  A: "ᴬ", B: "ᴮ", C: "ᶜ", D: "ᴰ", E: "ᴱ", F: "ᶠ", G: "ᴳ", H: "ᴴ", I: "ᴵ", J: "ᴶ",
  K: "ᴷ", L: "ᴸ", M: "ᴹ", N: "ᴺ", O: "ᴼ", P: "ᴾ", Q: "Q", R: "ᴿ", S: "ˢ", T: "ᵀ",
  U: "ᵁ", V: "ⱽ", W: "ᵂ", X: "ˣ", Y: "ʸ", Z: "ᶻ",
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
};
function transformSuperscript(input: string): string {
  return [...input].map(ch => SUPERSCRIPT[ch] ?? ch).join("");
}

const SUBSCRIPT: Record<string, string> = {
  a: "ₐ", e: "ₑ", h: "ₕ", i: "ᵢ", j: "ⱼ", k: "ₖ", l: "ₗ", m: "ₘ", n: "ₙ", o: "ₒ",
  p: "ₚ", r: "ᵣ", s: "ₛ", t: "ₜ", u: "ᵤ", v: "ᵥ", x: "ₓ",
  "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
};
function transformSubscript(input: string): string {
  return [...input].map(ch => SUBSCRIPT[ch] ?? ch).join("");
}

const FLIP: Record<string, string> = {
  a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ɓ", h: "ɥ", i: "ᵻ", j: "ɾ",
  k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ", s: "s", t: "ʇ",
  u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
  A: "∀", B: "ᗺ", C: "Ɔ", D: "ᗡ", E: "Ǝ", F: "Ⅎ", G: "⅁", H: "H", I: "I", J: "ſ",
  K: "ʞ", L: "⅂", M: "W", N: "N", O: "O", P: "Ԁ", Q: "Ό", R: "ᴚ", S: "S", T: "⊥",
  U: "∩", V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z",
  "0": "0", "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ᔭ", "5": "ϛ", "6": "9", "7": "ㄥ", "8": "8", "9": "6",
  ".": "˙", ",": "'", "?": "¿", "!": "¡", "(": ")", ")": "(",
};
function transformFlip(input: string): string {
  return [...input].map(ch => FLIP[ch] ?? ch).reverse().join("");
}

function addCombining(input: string, combiner: string): string {
  return [...input].map(ch => ch === " " ? ch : ch + combiner).join("");
}

// Zalgo-lite — deterministic so output is stable per input
const ZALGO_UP = ["\u030d", "\u030e", "\u0304", "\u0305", "\u033f", "\u0311", "\u0306", "\u0310", "\u0352", "\u0357"];
const ZALGO_MID = ["\u0315", "\u031b", "\u0340", "\u0341", "\u0358", "\u0321", "\u0322"];
const ZALGO_DOWN = ["\u0317", "\u0318", "\u0319", "\u031c", "\u031d", "\u031e", "\u031f", "\u0320", "\u0324", "\u0325"];
let _seed = 42;
function pseudoRand(max: number): number {
  _seed = (_seed * 1664525 + 1013904223) & 0xffffffff;
  return Math.abs(_seed) % max;
}
function transformZalgoLite(input: string): string {
  _seed = 42;
  return [...input].map(ch => {
    if (ch === " ") return ch;
    return ch + ZALGO_UP[pseudoRand(ZALGO_UP.length)]
      + ZALGO_MID[pseudoRand(ZALGO_MID.length)]
      + ZALGO_DOWN[pseudoRand(ZALGO_DOWN.length)];
  }).join("");
}

// ---------------------------------------------------------------------------
// All special styles
// ---------------------------------------------------------------------------

const SPECIALS: SpecialDef[] = [
  { name: "Ⓒⓘⓡⓒⓛⓔⓓ", transform: (s) => transformText(s, CIRCLED) },
  { name: "🅂🅀🅄🄰🅁🄴🄳", transform: (s) => [...s].map(transformSquared).join("") },
  { name: "🅽🅴🅶 🆂🆀", transform: (s) => [...s].map(transformNegSquared).join("") },
  { name: "🇷🇪🇬🇮🇴🇳🇦🇱", transform: (s) => [...s].map(transformRegional).join("") },
  { name: "⒫⒜⒭⒠⒩⒮", transform: (s) => [...s].map(transformParen).join("") },
  { name: "Ｆｕｌｌｗｉｄｔｈ", transform: (s) => transformText(s, FULLWIDTH) },
  { name: "ꜱᴍᴀʟʟ ᴄᴀᴘꜱ", transform: transformSmallCaps },
  { name: "ˢᵘᵖᵉʳˢᶜʳⁱᵖᵗ", transform: transformSuperscript },
  { name: "ₛᵤᵦₛcᵣᵢₚₜ", transform: transformSubscript },
  { name: "uʍop ǝpᴉsdn", transform: transformFlip },
  { name: "ɹǝʌǝɹsǝp", transform: (s) => [...s].reverse().join("") },
  { name: "W  i  d  e", transform: (s) => [...s].join("  ") },
  { name: "S̶t̶r̶i̶k̶e̶", transform: (s) => addCombining(s, "\u0336") },
  { name: "U͟n͟d͟e͟r͟l͟i͟n͟e͟", transform: (s) => addCombining(s, "\u0332") },
  { name: "D̳o̳u̳b̳l̳e̳ ̳U̳n̳d̳e̳r̳", transform: (s) => addCombining(s, "\u0333") },
  { name: "O̅v̅e̅r̅l̅i̅n̅e̅", transform: (s) => addCombining(s, "\u0305") },
  { name: "Z̃ą͟l͜g̐o̊", transform: transformZalgoLite },
];

// ---------------------------------------------------------------------------
// Build the master list
// ---------------------------------------------------------------------------

function buildAllVariants(input: string): VariantRow[] {
  if (!input) return [];
  const out: VariantRow[] = [];
  for (const font of FONTS)
    out.push({ name: font.name, text: transformText(input, font) });
  for (const s of SPECIALS)
    out.push({ name: s.name, text: s.transform(input) });
  return out;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FancyTextGeneratorTool() {
  const [input, setInput] = useState("");
  const [visibleVariants, setVisibleVariants] = useState<VariantRow[]>([]);
  const inputRef = useRef(input);
  inputRef.current = input;

  useEffect(() => {
    setVisibleVariants([]);
    if (!input) return;

    const allVariants = buildAllVariants(input);
    const captured = input;
    let i = 0;

    function scheduleNext() {
      if (inputRef.current !== captured) return; // stale — abort
      if (i >= allVariants.length) return;
      const next = allVariants[i++];
      setVisibleVariants((prev) => [...prev, next]);
      setTimeout(scheduleNext, 18);
    }

    // Small debounce so rapid keystrokes don't fire a storm of effects
    const debounce = setTimeout(scheduleNext, 80);
    return () => clearTimeout(debounce);
  }, [input]);

  return (
    <div className="space-y-2">
      <Panel>
        <div className="space-y-2">
          <Textarea
            value={input}
            label="Your Text"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type something here..."
            rows={3}
          />
          <p className="text-xs text-(--text-tertiary) text-right">
            {input.length} character{input.length !== 1 ? "s" : ""}
          </p>
        </div>
      </Panel>

      {input.length > 0 && (
        <Panel>
          <div className="space-y-3">
            <label
              className="block text-xs font-medium uppercase tracking-wide text-(--text-tertiary) mb-1.5"
            >
              Click any style to copy
            </label>
            <div className="space-y-2">
              {visibleVariants.map((v, i) => (
                <ResultRow key={i} label={v.name} value={v.text} />
              ))}
            </div>
          </div>
        </Panel>
      )}

      {!input && (
        <Panel>
          <div className="text-center py-8 text-(--text-tertiary)">
            <p className="text-4xl mb-3">✨</p>
            <p className="text-sm">
              Type some text above to see it in fancy Unicode styles
            </p>
          </div>
        </Panel>
      )}
    </div>
  );
}