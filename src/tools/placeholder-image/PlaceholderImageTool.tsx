import { useState, useMemo, useCallback } from "react";
import { Input, Button, ColorInput, Label, CopyButton } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Download } from "lucide-react";

type Format = "svg" | "png" | "jpg";

const fontSize = (w: number, h: number) =>
  Math.min(Math.floor(Math.min(w, h) / 8), 40);

function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(href);
}

function drawCanvas(
  w: number, h: number,
  bg: string, fg: string,
  text: string
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = fg;
  ctx.font = `bold ${fontSize(w, h)}px system-ui,sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2);
  return canvas;
}

export default function PlaceholderImageTool() {
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [bgColor, setBgColor] = useState("#d75c00");
  const [textColor, setTextColor] = useState("#ffffff");
  const [label, setLabel] = useState("");
  const [format, setFormat] = useState<Format>("svg");

  const displayLabel = label || `${width}x${height}`;

  const svg = useMemo(() =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}" font-family="system-ui,sans-serif" font-size="${fontSize(width, height)}">${displayLabel}</text>
</svg>`, [width, height, bgColor, textColor, displayLabel]);

  const dataUri = useMemo(
    () => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    [svg]
  );

  const htmlTag = useMemo(
    () => `<img src="${dataUri}" width="${width}" height="${height}" alt="${displayLabel}" />`,
    [dataUri, width, height, displayLabel]
  );

  const download = useCallback(() => {
    if (format === "svg") {
      const blob = new Blob([svg], { type: "image/svg+xml" });
      triggerDownload(URL.createObjectURL(blob), `placeholder-${width}x${height}.svg`);
      return;
    }
    const mimeType = format === "png" ? "image/png" : "image/jpeg";
    const canvas = drawCanvas(width, height, bgColor, textColor, displayLabel);
    canvas.toBlob(blob => {
      if (!blob) return;
      triggerDownload(URL.createObjectURL(blob), `placeholder-${width}x${height}.${format}`);
    }, mimeType);
  }, [format, svg, width, height, bgColor, textColor, displayLabel]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <div className="col-span-2 max-h-fit space-y-2">
        <Panel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Width"
              type="number"
              value={width}
              onChange={e => setWidth(Math.max(1, parseInt(e.target.value) || 400))}
              trailingText="px"
            />
            <Input
              label="Height"
              type="number"
              value={height}
              onChange={e => setHeight(Math.max(1, parseInt(e.target.value) || 300))}
              trailingText="px"
            />
            <ColorInput
              label="Background"
              value={bgColor}
              onChange={e => setBgColor(e.target.value)}
            />
            <ColorInput
              label="Text Color"
              value={textColor}
              onChange={e => setTextColor(e.target.value)}
            />
            <Input
              label="Label (optional)"
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder={`${width}x${height}`}
              className="col-span-full"
            />
          </div>
        </Panel>

        <Panel>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex flex-col gap-1">
              <Select label="format" value={format} onValueChange={v => setFormat(v as Format)}>
                <SelectTrigger>{format.toUpperCase()}</SelectTrigger>
                <SelectContent>
                  <SelectItem value="svg">SVG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpg">JPG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Button onClick={download} icon={Download} variant="primary" className="col-span-2">
                Download
              </Button>
              <CopyButton label="Copy Data URI" text={dataUri} />
              <CopyButton label="Copy HTML" text={htmlTag} />
            </div>
          </div>
        </Panel>
      </div>

      <Panel className="flex-1 flex items-center justify-center overflow-hidden rounded-md min-h-[120px]">
        <img src={dataUri} alt={displayLabel} className="max-w-full" />
      </Panel>
    </div>
  );
}