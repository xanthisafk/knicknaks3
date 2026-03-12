import { useState, useMemo } from "react";
import { Input, Button } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

export default function PlaceholderImageTool() {
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [bgColor, setBgColor] = useState("#6366f1");
  const [textColor, setTextColor] = useState("#ffffff");
  const [label, setLabel] = useState("");
  const [copied, setCopied] = useState<"uri" | "html" | null>(null);

  const displayLabel = label || `${width}x${height}`;

  const svg = useMemo(() => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}" font-family="system-ui,sans-serif" font-size="${Math.min(Math.floor(Math.min(width, height) / 8), 40)}">${displayLabel}</text>
</svg>`, [width, height, bgColor, textColor, displayLabel]);

  const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  const htmlTag = `<img src="${dataUri}" width="${width}" height="${height}" alt="${displayLabel}" />`;

  const download = () => {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `placeholder-${width}x${height}.svg`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <Panel>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Width (px)" type="number" value={width} onChange={e => setWidth(Math.max(1, parseInt(e.target.value) || 400))} />
            <Input label="Height (px)" type="number" value={height} onChange={e => setHeight(Math.max(1, parseInt(e.target.value) || 300))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text(--text-primary)">Background</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-9 rounded cursor-pointer border-0" />
                <span className="text-sm font-[family-name:var(--font-mono)] text(--text-secondary)">{bgColor.toUpperCase()}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text(--text-primary)">Text Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-10 h-9 rounded cursor-pointer border-0" />
                <span className="text-sm font-[family-name:var(--font-mono)] text(--text-secondary)">{textColor.toUpperCase()}</span>
              </div>
            </div>
          </div>
          <Input label="Label (optional)" value={label} onChange={e => setLabel(e.target.value)} placeholder={`${width}x${height}`} />
        </div>
      </Panel>

      {/* Preview */}
      <Panel>
        <div className="flex items-center justify-center overflow-hidden rounded-[var(--radius-md)]" style={{ minHeight: "120px" }}>
          <img src={dataUri} alt={displayLabel} style={{ maxWidth: "100%", maxHeight: "240px" }} />
        </div>
      </Panel>

      <Panel>
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={download} variant="secondary" size="sm">⬇ Download SVG</Button>
            <Button onClick={async () => { await copyToClipboard(dataUri); setCopied("uri"); setTimeout(() => setCopied(null), 1500); }} variant="secondary" size="sm">
              {copied === "uri" ? "✓ Copied" : "Copy Data URI"}
            </Button>
            <Button onClick={async () => { await copyToClipboard(htmlTag); setCopied("html"); setTimeout(() => setCopied(null), 1500); }} variant="secondary" size="sm">
              {copied === "html" ? "✓ Copied" : "Copy HTML"}
            </Button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
