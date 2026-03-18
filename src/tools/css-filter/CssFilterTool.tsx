import { useState, useCallback, useMemo } from "react";
import { Button, Label } from "@/components/ui";
import { Panel } from "@/components/layout";
import SliderRow from "@/components/ui/SliderRow";
import FileDropZone from "@/components/advanced/FileDropZone";
import { CornerDownLeft, Download, Eye, EyeClosed } from "lucide-react";
import { ResultRow } from "@/components/advanced/ResultRow";

interface FilterState {
  brightness: number;
  contrast: number;
  saturate: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
  blur: number;
  invert: number;
  opacity: number;
}

const DEFAULTS: FilterState = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
  blur: 0,
  invert: 0,
  opacity: 100,
};

const FILTER_DEFS = [
  { key: "brightness", label: "Brightness", min: 0, max: 300, unit: "%", cssName: "brightness" },
  { key: "contrast", label: "Contrast", min: 0, max: 300, unit: "%", cssName: "contrast" },
  { key: "saturate", label: "Saturate", min: 0, max: 300, unit: "%", cssName: "saturate" },
  { key: "grayscale", label: "Grayscale", min: 0, max: 100, unit: "%", cssName: "grayscale" },
  { key: "sepia", label: "Sepia", min: 0, max: 100, unit: "%", cssName: "sepia" },
  { key: "hueRotate", label: "Hue Rotate", min: 0, max: 360, unit: "deg", cssName: "hue-rotate" },
  { key: "blur", label: "Blur", min: 0, max: 20, unit: "px", cssName: "blur" },
  { key: "invert", label: "Invert", min: 0, max: 100, unit: "%", cssName: "invert" },
  { key: "opacity", label: "Opacity", min: 0, max: 100, unit: "%", cssName: "opacity" },
] as const;

function buildFilterCSS(state: FilterState): string {
  const parts: string[] = [];

  for (const def of FILTER_DEFS) {
    const val = state[def.key];
    if (val !== DEFAULTS[def.key]) {
      parts.push(`${def.cssName}(${val}${def.unit})`);
    }
  }

  return parts.length ? parts.join(" ") : "none";
}

function buildTailwind(state: FilterState) {
  const classes: string[] = [];

  if (state.blur) classes.push(`blur-[${state.blur}px]`);
  if (state.brightness !== 100) classes.push(`brightness-[${state.brightness}%]`);
  if (state.contrast !== 100) classes.push(`contrast-[${state.contrast}%]`);
  if (state.grayscale) classes.push(`grayscale`);
  if (state.invert) classes.push(`invert`);
  if (state.opacity !== 100) classes.push(`opacity-[${state.opacity}%]`);
  if (state.saturate !== 100) classes.push(`saturate-[${state.saturate}%]`);
  if (state.sepia) classes.push(`sepia`);

  if (state.hueRotate) classes.push(`[filter:hue-rotate(${state.hueRotate}deg)]`);

  return classes.length ? classes.join(" ") : "none";
}

export default function CssFilterTool() {
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULTS });

  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);


  const updateFilter = useCallback((key: keyof FilterState, value: number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilter = useCallback((key: keyof FilterState) => {
    setFilters((prev) => ({ ...prev, [key]: DEFAULTS[key] }));
  }, []);

  const resetAll = () => setFilters({ ...DEFAULTS });

  const filterCSS = useMemo(() => buildFilterCSS(filters), [filters]);
  const tailwindCSS = useMemo(() => buildTailwind(filters), [filters]);

  const handleUpload = (e: any) => {
    const file = e.file;
    setImageName(file.name);
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImage(url);
  };

  const handleDownload = useCallback(() => {
    if (!image) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d")!;
      ctx.filter = filterCSS !== "none" ? filterCSS : "none";
      ctx.drawImage(img, 0, 0);  // No background fill → transparency preserved

      const isPng = imageFile?.name.match(/\.(png|webp)$/i);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `filtered-${imageName}`;
          a.click();
          URL.revokeObjectURL(a.href);
        },
        isPng ? "image/png" : "image/jpeg",
        0.95  // quality — ignored for PNG (lossless), applies to JPEG
      );
    };

    img.crossOrigin = "anonymous";
    img.src = image;
  }, [image, imageFile, imageName, filterCSS]);

  return (
    <div className="space-y-2">

      {/* Uploader */}

      {!image && <FileDropZone emoji="🖼️" accepts="image/png,image/jpeg,image/webp,image/bmp" onUpload={handleUpload} />}
      {image && <Panel>
        <div className="flex justify-between items-center">
          <Label>{imageName}</Label>
          <Button
            onClick={() => { setImage(null); setImageName(""); }}
            variant="ghost"
            size="xs"
            icon={CornerDownLeft}
          >
            New Image
          </Button>
        </div>
      </Panel>}


      {/* Preview + Filters */}
      <div className="grid md:grid-cols-2 gap-2">

        {/* Preview */}
        <Panel>
          <div className="space-y-2">

            <div className="flex justify-between items-center">
              <Label>Preview</Label>
            </div>

            <div
              className="rounded-lg border border-(--border-default) overflow-hidden relative"
              style={
                { background: "repeating-conic-gradient(var(--border-default) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px", }
              }
            >
              <div
                className="h-[500px] aspect-auto flex items-center justify-center"
                style={{ filter: filterCSS !== "none" ? filterCSS : undefined }}
              >
                {image ? (
                  <img
                    src={image}
                    className="max-h-full max-w-full object-fill"
                  />
                ) : (
                  <div className="text-sm text-(--text-tertiary)">
                    Upload an image
                  </div>
                )}
              </div>
            </div>
          </div>
        </Panel>

        {/* Filters */}
        <Panel className="space-y-4">
          <div className="flex justify-between">
            <Label>Filters</Label>
            <Button
              onClick={resetAll}
              variant="ghost"
              size="xs"
              icon={CornerDownLeft}
            >
              Reset
            </Button>
          </div>

          {FILTER_DEFS.map((def) => (
            <div key={def.key} className="w-full">
              <SliderRow
                label={def.label}
                value={filters[def.key]}
                min={def.min}
                max={def.max}
                unit={def.unit}
                isDefault={filters[def.key] === DEFAULTS[def.key]}
                onChange={(v) => updateFilter(def.key, v)}
                onReset={() => resetFilter(def.key)}
              />
            </div>
          ))}
          {image && <Button
            icon={Download}
            className="w-full"
            onClick={handleDownload}
          >
            Download Filtered Image
          </Button>}
        </Panel>
      </div>

      {/* Output */}
      <Panel className="space-y-2">
        <Label>Output</Label>
        <ResultRow label="CSS" value={filterCSS} />
        <ResultRow label="Tailwind" value={tailwindCSS} />
      </Panel>

    </div>
  );
}