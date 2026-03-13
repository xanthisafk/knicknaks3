import { useState, useEffect } from "react";
import { formatColor, toHex, getLuminance } from "../../lib/formatColor";
import type { ColorFormat } from "@/lib/formatColor";
import { parseColor } from "@/lib/convertColor";
import { CopyButton } from "../ui";

// Types
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


// Format Cycle Order
const FORMAT_CYCLE: ColorFormat[] = ["hex", "rgb", "rgba", "hsl", "hsla", "oklch"];

const FORMAT_LABELS: Record<ColorFormat, string> = {
  hex: "HEX",
  rgb: "RGB",
  rgba: "RGBA",
  hsl: "HSL",
  hsla: "HSLA",
  oklch: "OKLCH",
};

export function ColorCard({ color, label, defaultFormat = "hex", className = "" }: ColorCardProps) {
  const parsed = parseColor(color);
  const [format, setFormat] = useState<ColorFormat>(defaultFormat);
  const [copied, setCopied] = useState(false);

  useEffect(() => setFormat(defaultFormat), [defaultFormat])

  if (!parsed) {
    return (
      <div className={`rounded-md border border-(--border-default) overflow-hidden ${className}`}>
        <div className="h-16 bg-(--surface-bg) flex items-center justify-center">
          <span className="text-xs text-(--text-tertiary)">Invalid color {color}</span>
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
    <div className={`rounded-md border border-(--border-default) overflow-hidden flex flex-col ${className} w-full`}>
      {/* Swatch */}
      <div
        className="min-h-40 flex items-end justify-between p-2 gap-1"
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
          className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded font-mono transition-opacity hover:opacity-100 opacity-70"
          style={{ backgroundColor: textOnColor.replace("0.65", "0.18").replace("0.75", "0.18"), color: textOnColor }}
        >
          {FORMAT_LABELS[format]}
        </button>
      </div>

      {/* Value row */}
      <div className="bg-(--surface-elevated) px-3 py-2.5 flex items-center gap-1.5 min-w-0">
        <span
          className="font-mono text-[12px] text-(--text-primary) flex-1 truncate"
          title={formattedValue}
        >
          {formattedValue}
        </span>
        <CopyButton text={formattedValue} />
      </div>
    </div>
  );
}

export default ColorCard;