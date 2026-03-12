import { useState } from "react";
import { Textarea, Button } from "@/components/ui";
import { Panel } from "@/components/layout";

interface CodePointInfo {
  char: string;
  display: string;
  codePoint: number;
  codePointHex: string;
  utf8Bytes: string;
  utf16Bytes: string;
  category: string;
  name: string;
  isEmoji: boolean;
}

function getUtf8Bytes(cp: number): string {
  if (cp < 0x80) return cp.toString(16).padStart(2, "0").toUpperCase();
  if (cp < 0x800) {
    const b1 = 0xc0 | (cp >> 6);
    const b2 = 0x80 | (cp & 0x3f);
    return [b1, b2].map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
  }
  if (cp < 0x10000) {
    const b1 = 0xe0 | (cp >> 12);
    const b2 = 0x80 | ((cp >> 6) & 0x3f);
    const b3 = 0x80 | (cp & 0x3f);
    return [b1, b2, b3].map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
  }
  const b1 = 0xf0 | (cp >> 18);
  const b2 = 0x80 | ((cp >> 12) & 0x3f);
  const b3 = 0x80 | ((cp >> 6) & 0x3f);
  const b4 = 0x80 | (cp & 0x3f);
  return [b1, b2, b3, b4].map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
}

function getUtf16Bytes(cp: number): string {
  if (cp < 0x10000) {
    return cp.toString(16).padStart(4, "0").toUpperCase();
  }
  const adjusted = cp - 0x10000;
  const high = 0xd800 + (adjusted >> 10);
  const low = 0xdc00 + (adjusted & 0x3ff);
  return [high, low].map((b) => b.toString(16).padStart(4, "0").toUpperCase()).join(" ");
}

function getCategory(cp: number): string {
  if (cp < 0x20) return "Control";
  if (cp < 0x7f) return "Basic Latin";
  if (cp < 0xa0) return "C1 Control";
  if (cp < 0x100) return "Latin-1 Supplement";
  if (cp < 0x250) return "Latin Extended";
  if (cp >= 0x370 && cp < 0x400) return "Greek";
  if (cp >= 0x400 && cp < 0x500) return "Cyrillic";
  if (cp >= 0x600 && cp < 0x700) return "Arabic";
  if (cp >= 0x4e00 && cp < 0xa000) return "CJK Unified";
  if (cp >= 0x1f300 && cp < 0x1fa00) return "Emoji";
  if (cp >= 0xd800 && cp < 0xe000) return "Surrogate";
  return "Other Unicode";
}

function isEmoji(cp: number): boolean {
  return (cp >= 0x1f300 && cp < 0x1fa00) || (cp >= 0x2600 && cp < 0x2700);
}

function analyzeText(text: string): CodePointInfo[] {
  const results: CodePointInfo[] = [];
  for (const char of text) {
    const cp = char.codePointAt(0)!;
    const hex = cp.toString(16).toUpperCase().padStart(4, "0");
    const isCtrl = cp < 0x20 || cp === 0x7f;
    results.push({
      char,
      display: isCtrl ? `U+${hex}` : char,
      codePoint: cp,
      codePointHex: `U+${hex}`,
      utf8Bytes: getUtf8Bytes(cp),
      utf16Bytes: getUtf16Bytes(cp),
      category: getCategory(cp),
      name: `U+${hex}`,
      isEmoji: isEmoji(cp),
    });
  }
  return results;
}

export default function UnicodeInspectorTool() {
  const [text, setText] = useState("");
  const [selected, setSelected] = useState<CodePointInfo | null>(null);

  const chars = text ? analyzeText(text) : [];
  const uniqueCount = new Set(chars.map((c) => c.codePoint)).size;
  const totalBytes = chars.reduce((sum, c) => sum + getUtf8Bytes(c.codePoint).split(" ").length, 0);

  return (
    <div className="space-y-6">
      <Panel>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              Input Text
            </label>
            <Textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setSelected(null); }}
              placeholder="Paste any text — emoji, scripts, symbols — to inspect its Unicode..."
              className="min-h-[100px]"
            />
          </div>

          {text && (
            <div className="flex gap-4 flex-wrap">
              {[
                { label: "Characters", value: chars.length },
                { label: "Unique", value: uniqueCount },
                { label: "UTF-8 Bytes", value: totalBytes },
                { label: "Code Points", value: chars.length },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-[10px] tracking-widest text-[var(--text-tertiary)] uppercase">{label}</span>
                  <span className="text-2xl font-bold text-[var(--text-primary)] font-mono">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Panel>

      {/* Character grid */}
      {chars.length > 0 && (
        <Panel>
          <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-4">
            Character Map — click a character to inspect
          </h3>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {chars.map((info, i) => (
              <button
                key={i}
                onClick={() => setSelected(selected?.codePoint === info.codePoint && selected === chars[i] ? null : info)}
                title={info.codePointHex}
                className={`w-10 h-10 rounded-[var(--radius-sm)] font-mono text-base flex items-center justify-center border transition-all ${selected === info
                    ? "border-[var(--color-primary-500)] bg-[var(--color-primary-500)] text-white scale-110"
                    : "border-[var(--border-default)] bg-[var(--surface-elevated)] text-[var(--text-primary)] hover:border-[var(--color-primary-500)] hover:scale-105"
                  }`}
              >
                {info.display}
              </button>
            ))}
          </div>

          {selected && (
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-bg)] p-4 mt-2">
              <div className="flex items-start gap-6">
                <div className="text-5xl leading-none font-mono text-[var(--text-primary)] w-16 shrink-0 flex items-center justify-center">
                  {selected.display}
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm flex-1">
                  {[
                    ["Code Point", selected.codePointHex],
                    ["Category", selected.category],
                    ["UTF-8 Bytes", selected.utf8Bytes],
                    ["UTF-16", selected.utf16Bytes],
                    ["Decimal", selected.codePoint.toString()],
                    ["Octal", "0o" + selected.codePoint.toString(8)],
                    ["HTML Entity", `&#${selected.codePoint};`],
                    ["CSS Escape", `\\${selected.codePoint.toString(16).toUpperCase()}`],
                  ].map(([label, val]) => (
                    <div key={label} className="flex flex-col">
                      <span className="text-[10px] tracking-widest text-[var(--text-tertiary)] uppercase">{label}</span>
                      <span className="font-mono text-[var(--text-primary)]">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Panel>
      )}

      {/* Full table for small inputs */}
      {chars.length > 0 && chars.length <= 50 && (
        <Panel>
          <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-4">
            Full Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="text-[var(--text-tertiary)] text-xs border-b border-[var(--border-default)]">
                  <th className="text-left py-2 pr-4">Char</th>
                  <th className="text-left py-2 pr-4">Code Point</th>
                  <th className="text-left py-2 pr-4">UTF-8</th>
                  <th className="text-left py-2 pr-4">UTF-16</th>
                  <th className="text-left py-2">Category</th>
                </tr>
              </thead>
              <tbody>
                {chars.map((info, i) => (
                  <tr key={i} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-hover)]">
                    <td className="py-1.5 pr-4 text-[var(--color-primary-500)] font-bold text-base">{info.display}</td>
                    <td className="py-1.5 pr-4 text-[var(--text-primary)]">{info.codePointHex}</td>
                    <td className="py-1.5 pr-4 text-[var(--text-secondary)]">{info.utf8Bytes}</td>
                    <td className="py-1.5 pr-4 text-[var(--text-secondary)]">{info.utf16Bytes}</td>
                    <td className="py-1.5 text-[var(--text-tertiary)]">{info.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <Panel>
        <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-4">Tips</h3>
        <ul className="text-sm text-[var(--text-secondary)] space-y-2 list-disc list-inside">
          <li>Click any character tile to see its full encoding details.</li>
          <li>Emoji and multi-byte characters are fully supported.</li>
          <li>HTML entities and CSS escapes are shown for each code point.</li>
        </ul>
      </Panel>
    </div>
  );
}