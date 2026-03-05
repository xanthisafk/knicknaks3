import { useState } from "react";
import { Textarea, Button, Input } from "@/components/ui";
import { Panel } from "@/components/layout";

// Unicode combining characters for Zalgo effect
const ZALGO_UP = [
  0x030d, 0x030e, 0x0304, 0x0305, 0x033f, 0x0311, 0x0306, 0x0310,
  0x0352, 0x0357, 0x0351, 0x0307, 0x0308, 0x030a, 0x0342, 0x0343,
  0x0344, 0x034a, 0x034b, 0x034c, 0x0303, 0x0302, 0x030c, 0x0350,
  0x0300, 0x0301, 0x030b, 0x030f, 0x0312, 0x0313, 0x0314, 0x033d,
  0x0309, 0x0363, 0x0364, 0x0365, 0x0366, 0x0367, 0x0368, 0x0369,
  0x036a, 0x036b, 0x036c, 0x036d, 0x036e, 0x036f, 0x033e, 0x035b,
];

const ZALGO_MID = [
  0x0315, 0x031b, 0x0340, 0x0341, 0x0358, 0x0321, 0x0322, 0x0327,
  0x0328, 0x0334, 0x0335, 0x0336, 0x034f, 0x035c, 0x035d, 0x035e,
  0x035f, 0x0360, 0x0362, 0x0338, 0x0337, 0x0361, 0x0489,
];

const ZALGO_DOWN = [
  0x0316, 0x0317, 0x0318, 0x0319, 0x031c, 0x031d, 0x031e, 0x031f,
  0x0320, 0x0324, 0x0325, 0x0326, 0x0329, 0x032a, 0x032b, 0x032c,
  0x032d, 0x032e, 0x032f, 0x0330, 0x0331, 0x0332, 0x0333, 0x0339,
  0x033a, 0x033b, 0x033c, 0x0345, 0x0347, 0x0348, 0x0349, 0x034d,
  0x034e, 0x0353, 0x0354, 0x0355, 0x0356, 0x0359, 0x035a, 0x0323,
];

type Intensity = "low" | "medium" | "high" | "extreme";

const INTENSITY_MAP: Record<Intensity, { up: number; mid: number; down: number }> = {
  low: { up: 1, mid: 0, down: 1 },
  medium: { up: 3, mid: 1, down: 3 },
  high: { up: 6, mid: 2, down: 6 },
  extreme: { up: 12, mid: 4, down: 12 },
};

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function zalgoify(text: string, intensity: Intensity, up: boolean, mid: boolean, down: boolean): string {
  const cfg = INTENSITY_MAP[intensity];
  return text
    .split("")
    .map((ch) => {
      if (ch === " " || ch === "\n") return ch;
      let result = ch;
      if (up) {
        const n = randInt(1, cfg.up);
        for (let i = 0; i < n; i++) result += String.fromCodePoint(rand(ZALGO_UP));
      }
      if (mid) {
        const n = randInt(0, cfg.mid);
        for (let i = 0; i < n; i++) result += String.fromCodePoint(rand(ZALGO_MID));
      }
      if (down) {
        const n = randInt(1, cfg.down);
        for (let i = 0; i < n; i++) result += String.fromCodePoint(rand(ZALGO_DOWN));
      }
      return result;
    })
    .join("");
}

const INTENSITY_OPTIONS: { value: Intensity; label: string; desc: string }[] = [
  { value: "low", label: "Low", desc: "Subtle" },
  { value: "medium", label: "Medium", desc: "Spooky" },
  { value: "high", label: "High", desc: "Chaotic" },
  { value: "extreme", label: "Extreme", desc: "He comes" },
];

export default function ZalgoTextGeneratorTool() {
  const [text, setText] = useState("");
  const [intensity, setIntensity] = useState<Intensity>("medium");
  const [useUp, setUseUp] = useState(true);
  const [useMid, setUseMid] = useState(true);
  const [useDown, setUseDown] = useState(true);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [seed, setSeed] = useState(0); // used to re-randomise

  const generate = () => {
    setOutput(zalgoify(text, intensity, useUp, useMid, useDown));
    setSeed((s) => s + 1);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleClear = () => {
    setOutput("");
    setText("");
  };

  return (
    <div className="space-y-6">
      <Panel>
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              Input Text
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type something innocent…"
              className="min-h-[80px]"
            />
          </div>

          {/* Intensity */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[var(--text-primary)]">Intensity</label>
            <div className="flex rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-default)] w-fit">
              {INTENSITY_OPTIONS.map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => setIntensity(value)}
                  title={desc}
                  className={`px-4 py-2 text-sm border-r border-[var(--border-default)] last:border-r-0 transition-colors ${
                    intensity === value
                      ? "bg-[var(--color-primary-500)] text-white"
                      : "bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="text-xs text-[var(--text-tertiary)]">
              {INTENSITY_OPTIONS.find((o) => o.value === intensity)?.desc}
            </span>
          </div>

          {/* Direction toggles */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[var(--text-primary)]">Corruption Direction</label>
            <div className="flex gap-3">
              {[
                { label: "↑ Above", checked: useUp, set: setUseUp },
                { label: "● Middle", checked: useMid, set: setUseMid },
                { label: "↓ Below", checked: useDown, set: setUseDown },
              ].map(({ label, checked, set }) => (
                <label key={label} className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => set(e.target.checked)}
                    className="rounded accent-[var(--color-primary-500)]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={generate}
              disabled={!text.trim()}
              className="px-6 py-2"
            >
              ☠ Zalgoify
            </Button>
            {output && (
              <Button variant="secondary" onClick={generate} className="px-4 py-2">
                ↻ Re-randomise
              </Button>
            )}
            {(text || output) && (
              <Button variant="secondary" onClick={handleClear} className="px-4 py-2">
                Clear
              </Button>
            )}
          </div>
        </div>
      </Panel>

      {output && (
        <Panel>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">
              Output
            </h3>
            <Button
              variant="secondary"
              className="px-4 py-1.5 text-sm"
              onClick={handleCopy}
            >
              {copied ? "✓ Copied" : "Copy"}
            </Button>
          </div>
          <div className="rounded-[var(--radius-md)] bg-[var(--surface-bg)] border border-[var(--border-default)] p-4 min-h-[5rem] font-mono text-2xl leading-[3rem] break-all text-[var(--text-primary)]">
            {output}
          </div>
        </Panel>
      )}

      <Panel>
        <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-4">
          What is Zalgo text?
        </h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Zalgo text uses Unicode <strong>combining characters</strong> — diacritics that stack above, below, or through base characters. These are normally used for accents like <code>é</code> or <code>ñ</code>, but stacking many of them creates the signature chaotic, glitchy look. The text remains fully copy-pasteable.
        </p>
        <ul className="text-sm text-[var(--text-secondary)] space-y-2 list-disc list-inside mt-3">
          <li>Hit <strong>Re-randomise</strong> for a different pattern with the same settings.</li>
          <li>Toggle directions to corrupt only above, below, or through the middle.</li>
          <li><strong>Extreme</strong> intensity will likely break most layouts — use wisely.</li>
        </ul>
      </Panel>
    </div>
  );
}