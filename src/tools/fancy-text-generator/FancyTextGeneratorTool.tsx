import { useState, useMemo, useCallback } from "react";
import { Panel } from "@/components/layout";

// Unicode math font offsets for A-Z and a-z mapping
interface FontDef {
  name: string;
  upper: number; // codepoint offset for 'A'
  lower: number; // codepoint offset for 'a'
  digits?: number; // codepoint offset for '0'
}

const FONTS: FontDef[] = [
  { name: "𝐁𝐨𝐥𝐝", upper: 0x1D400, lower: 0x1D41A, digits: 0x1D7CE },
  { name: "𝐼𝑡𝑎𝑙𝑖𝑐", upper: 0x1D434, lower: 0x1D44E },
  { name: "𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄", upper: 0x1D468, lower: 0x1D482 },
  { name: "𝒮𝒸𝓇𝒾𝓅𝓉", upper: 0x1D49C, lower: 0x1D4B6 },
  { name: "𝓑𝓸𝓵𝓭 𝓢𝓬𝓻𝓲𝓹𝓽", upper: 0x1D4D0, lower: 0x1D4EA },
  { name: "𝔉𝔯𝔞𝔨𝔱𝔲𝔯", upper: 0x1D504, lower: 0x1D51E },
  { name: "𝕭𝖔𝖑𝖉 𝕱𝖗𝖆𝖐𝖙𝖚𝖗", upper: 0x1D56C, lower: 0x1D586 },
  { name: "𝔻𝕠𝕦𝕓𝕝𝕖-𝕊𝕥𝕣𝕦𝕔𝕜", upper: 0x1D538, lower: 0x1D552, digits: 0x1D7D8 },
  { name: "𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎", upper: 0x1D670, lower: 0x1D68A, digits: 0x1D7F6 },
  { name: "𝖲𝖺𝗇𝗌-𝖲𝖾𝗋𝗂𝖿", upper: 0x1D5A0, lower: 0x1D5BA, digits: 0x1D7E2 },
  { name: "𝗦𝗮𝗻𝘀 𝗕𝗼𝗹𝗱", upper: 0x1D5D4, lower: 0x1D5EE, digits: 0x1D7EC },
  { name: "𝘚𝘢𝘯𝘴 𝘐𝘵𝘢𝘭𝘪𝘤", upper: 0x1D608, lower: 0x1D622 },
  { name: "𝙎𝙖𝙣𝙨 𝘽𝙤𝙡𝙙 𝙄𝙩𝙖𝙡𝙞𝙘", upper: 0x1D63C, lower: 0x1D656 },
];

// Circled letters: Ⓐ-Ⓩ and ⓐ-ⓩ
const CIRCLED: FontDef = { name: "Ⓒⓘⓡⓒⓛⓔⓓ", upper: 0x24B6, lower: 0x24D0 };

// Squared letters (only uppercase): 🄰-🅉
const SQUARED_UPPER_START = 0x1F130;

// Fullwidth: Ａ-Ｚ and ａ-ｚ
const FULLWIDTH: FontDef = { name: "Ｆｕｌｌｗｉｄｔｈ", upper: 0xFF21, lower: 0xFF41, digits: 0xFF10 };

function transformChar(ch: string, font: FontDef): string {
  const code = ch.codePointAt(0)!;
  if (code >= 65 && code <= 90) {
    return String.fromCodePoint(font.upper + (code - 65));
  }
  if (code >= 97 && code <= 122) {
    return String.fromCodePoint(font.lower + (code - 97));
  }
  if (font.digits !== undefined && code >= 48 && code <= 57) {
    return String.fromCodePoint(font.digits + (code - 48));
  }
  return ch;
}

function transformSquared(ch: string): string {
  const code = ch.codePointAt(0)!;
  if (code >= 65 && code <= 90) {
    return String.fromCodePoint(SQUARED_UPPER_START + (code - 65));
  }
  if (code >= 97 && code <= 122) {
    return String.fromCodePoint(SQUARED_UPPER_START + (code - 97));
  }
  return ch;
}

function transformText(input: string, font: FontDef): string {
  return [...input].map((ch) => transformChar(ch, font)).join("");
}

interface VariantRow {
  name: string;
  text: string;
}

function generateVariants(input: string): VariantRow[] {
  if (!input) return [];
  const variants: VariantRow[] = [];
  for (const font of FONTS) {
    variants.push({ name: font.name, text: transformText(input, font) });
  }
  variants.push({ name: CIRCLED.name, text: transformText(input, CIRCLED) });
  variants.push({ name: "🅂🅀🅄🄰🅁🄴🄳", text: [...input].map(transformSquared).join("") });
  variants.push({ name: FULLWIDTH.name, text: transformText(input, FULLWIDTH) });
  return variants;
}

export default function FancyTextGeneratorTool() {
  const [input, setInput] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const variants = useMemo(() => generateVariants(input), [input]);

  const handleCopy = useCallback(async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }, []);

  return (
    <div className="space-y-6">
      {/* Input */}
      <Panel>
        <div className="space-y-2">
          <label className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
            Your Text
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type something here..."
            rows={3}
            className="w-full resize-none rounded-[var(--radius-md)] bg-[var(--surface-secondary)] border border-[var(--border-default)] px-3 py-2.5 text-base text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] transition-shadow"
          />
          <p className="text-xs text-[var(--text-tertiary)] text-right">
            {input.length} character{input.length !== 1 ? "s" : ""}
          </p>
        </div>
      </Panel>

      {/* Variants */}
      {variants.length > 0 && (
        <Panel>
          <div className="space-y-3">
            <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">
              Click any style to copy
            </h3>
            <div className="space-y-2">
              {variants.map((v, i) => (
                <button
                  key={i}
                  onClick={() => handleCopy(v.text, i)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-[var(--radius-md)] border text-left transition-all duration-200 cursor-pointer group ${
                    copiedIdx === i
                      ? "bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)] border-[var(--color-primary-400)] shadow-sm"
                      : "bg-[var(--surface-secondary)] border-[var(--border-default)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-elevated)]"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-base text-[var(--text-primary)] break-all select-all block">
                      {v.text}
                    </span>
                  </div>
                  <span className={`text-xs whitespace-nowrap shrink-0 font-medium transition-colors ${
                    copiedIdx === i
                      ? "text-[var(--color-primary-600)] dark:text-[var(--color-primary-300)]"
                      : "text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"
                  }`}>
                    {copiedIdx === i ? "✓ Copied!" : v.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Panel>
      )}

      {/* Empty state */}
      {!input && (
        <Panel>
          <div className="text-center py-8 text-[var(--text-tertiary)]">
            <p className="text-4xl mb-3">✨</p>
            <p className="text-sm">Type some text above to see it in fancy Unicode styles</p>
          </div>
        </Panel>
      )}
    </div>
  );
}
