import { useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { Panel } from "@/components/layout";

// Full Unicode flip map — a-z, A-Z, 0-9, and common punctuation
const FLIP_MAP: Record<string, string> = {
  a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ",
  i: "ᴉ", j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d",
  q: "b", r: "ɹ", s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x",
  y: "ʎ", z: "z",
  A: "∀", B: "ᗺ", C: "Ɔ", D: "ᗡ", E: "Ǝ", F: "Ⅎ", G: "פ", H: "H",
  I: "I", J: "ſ", K: "ʞ", L: "˥", M: "W", N: "N", O: "O", P: "Ԁ",
  Q: "Q", R: "ᴚ", S: "S", T: "┴", U: "∩", V: "Λ", W: "M", X: "X",
  Y: "⅄", Z: "Z",
  "0": "0", "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ㄣ", "5": "ϛ",
  "6": "9", "7": "ㄥ", "8": "8", "9": "6",
  ".": "˙", ",": "'", "'": ",", "!": "¡", "?": "¿", "&": "⅋",
  "_": "‾", "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{",
  "<": ">", ">": "<", "/": "\\", "\\": "/",
};

function flipText(input: string): string {
  return input
    .split("")
    .map((ch) => FLIP_MAP[ch] ?? ch)
    .reverse()
    .join("");
}

export default function UpsideDownTextTool() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const flipped = flipText(input);
  const hasOutput = input.length > 0;

  const handleCopy = useCallback(async () => {
    if (!flipped) return;
    await navigator.clipboard.writeText(flipped);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [flipped]);

  const handleClear = () => {
    setInput("");
    setCopied(false);
  };

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-2">
          <label className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
            Your Text
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type something here..."
            rows={4}
            className="w-full resize-none rounded-[var(--radius-md)] bg-[var(--surface-secondary)] border border-[var(--border-default)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow"
          />
          <p className="text-xs text-[var(--text-tertiary)] text-right">
            {input.length} character{input.length !== 1 ? "s" : ""}
          </p>
        </div>
      </Panel>

      <Panel>
        <div className="space-y-2">
          <label className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
            Flipped Result
          </label>
          <div
            className="min-h-24 rounded-md bg-(--surface-secondary) border border-[var(--border-default)] px-3 py-2 text-sm text-[var(--text-primary)] break-all select-all"
          >
            {hasOutput ? (
              <span className="font-mono">{flipped}</span>
            ) : (
              <span className="text-(--text-tertiary) font-mono">
                ˙˙˙ǝɹǝɥ ƃuᴉɥʇǝɯos ǝdʎ┴
              </span>
            )}
          </div>
        </div>
      </Panel>

      {hasOutput && (
        <Panel>
          <div className="flex items-center gap-3">
            <Button onClick={handleCopy}>
              {copied ? "✓ Copied!" : "Copy Flipped Text"}
            </Button>
            <Button variant="ghost" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </Panel>
      )}
    </div>
  );
}