import { useState, useRef, useCallback, useEffect } from "react";
import { Panel } from "@/components/layout";
import FileDropZone from "@/components/advanced/FileDropZone";
import { Button, Label } from "@/components/ui";
import { ArrowLeftRightIcon, CornerDownLeft, Download, Loader2 } from "lucide-react";
import SplitCompare from "@/components/advanced/SplitCompare";

interface VisionType {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  matrix: number[];
}

const VISION_TYPES: VisionType[] = [
  {
    id: "normal",
    label: "Normal Vision",
    shortLabel: "Normal",
    description: "Full color vision — no simulation applied.",
    matrix: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  },
  {
    id: "protanopia",
    label: "Protanopia",
    shortLabel: "Protanopia",
    description: "Red-blind — missing or nonfunctional L cones. ~1% of males.",
    matrix: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  },
  {
    id: "protanomaly",
    label: "Protanomaly",
    shortLabel: "Protanomaly",
    description: "Reduced red sensitivity — weakened L cones. ~1% of males.",
    matrix: [0.817, 0.183, 0, 0.333, 0.667, 0, 0, 0.125, 0.875],
  },
  {
    id: "deuteranopia",
    label: "Deuteranopia",
    shortLabel: "Deuteranopia",
    description: "Green-blind — missing or nonfunctional M cones. ~1% of males.",
    matrix: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  },
  {
    id: "deuteranomaly",
    label: "Deuteranomaly",
    shortLabel: "Deuteranomaly",
    description: "Reduced green sensitivity — most common form. ~5% of males.",
    matrix: [0.8, 0.2, 0, 0.258, 0.742, 0, 0, 0.142, 0.858],
  },
  {
    id: "tritanopia",
    label: "Tritanopia",
    shortLabel: "Tritanopia",
    description: "Blue-blind — missing or nonfunctional S cones. Very rare.",
    matrix: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
  },
  {
    id: "tritanomaly",
    label: "Tritanomaly",
    shortLabel: "Tritanomaly",
    description: "Reduced blue sensitivity. Rare (~0.01% of population).",
    matrix: [0.967, 0.033, 0, 0, 0.733, 0.267, 0, 0.183, 0.817],
  },
  {
    id: "achromatopsia",
    label: "Achromatopsia",
    shortLabel: "Achromato.",
    description: "Complete color blindness — all color perceived as grey. Very rare.",
    matrix: [0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114],
  },
];

function applyMatrix(r: number, g: number, b: number, m: number[]): [number, number, number] {
  return [
    Math.min(255, Math.max(0, Math.round(m[0] * r + m[1] * g + m[2] * b))),
    Math.min(255, Math.max(0, Math.round(m[3] * r + m[4] * g + m[5] * b))),
    Math.min(255, Math.max(0, Math.round(m[6] * r + m[7] * g + m[8] * b))),
  ];
}

function simulateOnCanvas(
  source: HTMLCanvasElement,
  dest: HTMLCanvasElement,
  matrix: number[]
): void {
  dest.width = source.width;
  dest.height = source.height;
  const srcCtx = source.getContext("2d")!;
  const dstCtx = dest.getContext("2d")!;
  const src = srcCtx.getImageData(0, 0, source.width, source.height);
  const dst = dstCtx.createImageData(source.width, source.height);
  const d = src.data;
  const o = dst.data;

  const isIdentity = matrix.every((v, i) => v === [1, 0, 0, 0, 1, 0, 0, 0, 1][i]);
  if (isIdentity) {
    dstCtx.drawImage(source, 0, 0);
    return;
  }

  for (let i = 0; i < d.length; i += 4) {
    const [r, g, b] = applyMatrix(d[i], d[i + 1], d[i + 2], matrix);
    o[i] = r; o[i + 1] = g; o[i + 2] = b; o[i + 3] = d[i + 3];
  }
  dstCtx.putImageData(dst, 0, 0);
}

function simulateToDataUrl(source: HTMLCanvasElement, matrix: number[]): string {
  const dest = document.createElement("canvas");
  simulateOnCanvas(source, dest, matrix);
  return dest.toDataURL();
}

export default function ColorBlindnessSimulatorTool() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [activeId, setActiveId] = useState("protanopia");
  const [processing, setProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [showSplit, setShowSplit] = useState(false);
  const [thumbnailUrls, setThumbnailUrls] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const srcCanvasRef = useRef<HTMLCanvasElement>(null);
  const dstCanvasRef = useRef<HTMLCanvasElement>(null);

  const activeType = VISION_TYPES.find((v) => v.id === activeId)!;

  const runSimulation = useCallback((matrix: number[]) => {
    const src = srcCanvasRef.current;
    const dst = dstCanvasRef.current;
    if (!src || !dst || src.width === 0) return;
    setProcessing(true);
    requestAnimationFrame(() => {
      simulateOnCanvas(src, dst, matrix);
      setOutputUrl(dst.toDataURL());
      setProcessing(false);
    });
  }, []);

  // Generate all thumbnails from the source canvas at a small size
  const generateThumbnails = useCallback(() => {
    const src = srcCanvasRef.current;
    if (!src || src.width === 0) return;

    // Downscale source to a small canvas for fast thumbnail generation
    const THUMB = 120;
    const scale = Math.min(1, THUMB / Math.max(src.width, src.height));
    const thumbSrc = document.createElement("canvas");
    thumbSrc.width = src.width * scale;
    thumbSrc.height = src.height * scale;
    thumbSrc.getContext("2d")!.drawImage(src, 0, 0, thumbSrc.width, thumbSrc.height);

    const urls: Record<string, string> = {};
    for (const vt of VISION_TYPES) {
      urls[vt.id] = simulateToDataUrl(thumbSrc, vt.matrix);
    }
    setThumbnailUrls(urls);
  }, []);

  useEffect(() => {
    runSimulation(activeType.matrix);
  }, [activeId, runSimulation, activeType.matrix]);

  const loadImage = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImageName(file.name);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    const img = new Image();
    img.onload = () => {
      // ✅ No scaling — use full resolution for the source canvas
      const src = srcCanvasRef.current!;
      src.width = img.width;
      src.height = img.height;
      src.getContext("2d")!.drawImage(img, 0, 0);
      runSimulation(activeType.matrix);
      generateThumbnails();
    };
    img.src = url;
  };

  const reset = () => {
    setImageUrl(null);
    setOutputUrl(null);
    setImageName("");
    setShowSplit(false);
    setThumbnailUrls({});
    if (fileInputRef.current) fileInputRef.current.value = "";
    const src = srcCanvasRef.current;
    if (src) { src.width = 0; src.height = 0; }
  };

  return (
    <div className="space-y-5">
      <canvas ref={srcCanvasRef} className="hidden" />
      <canvas ref={dstCanvasRef} className="hidden" />

      {!imageUrl ? <FileDropZone emoji="🖼️" accepts="image/*" onUpload={e => loadImage(e.file)} />
        : (
          <>
            <Panel>
              <div className="flex items-center justify-between mb-3">
                <Label>Vision Type</Label>
                <Button
                  onClick={reset}
                  size="xs"
                  icon={CornerDownLeft}
                  variant="ghost"
                >
                  New image
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {VISION_TYPES.map((vt) => (
                  <Button
                    key={vt.id}
                    onClick={() => setActiveId(vt.id)}
                    variant={activeId === vt.id ? "primary" : "secondary"}
                    size="lg"
                  >
                    <span className="font-medium text-xs block truncate">{vt.shortLabel}</span>
                  </Button>
                ))}
              </div>

              <p className="text-xs text-(--text-tertiary) mt-3 leading-relaxed">
                <Label>{activeType.label}:</Label>{" "}
                {activeType.description}
              </p>
            </Panel>

            <Panel className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Preview — {activeType.label}</Label>
                <div className="flex items-center gap-2">
                  {processing && (
                    <Loader2 className="animate-spin w-4 h-4 text-primary-500" />
                  )}

                  {outputUrl && !processing && activeId !== "normal" && (
                    <>

                      <Button
                        onClick={() => setShowSplit((s) => !s)}
                        variant={showSplit ? "primary" : "secondary"}
                        size="sm"
                        icon={ArrowLeftRightIcon}
                      >
                        {showSplit ? "Separate" : "Split"} view
                      </Button>
                      <Button
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = outputUrl;
                          link.download = `${imageName.replace(/\.[^.]+$/, "")}_${activeId}.png`;
                          link.click();
                        }}
                        icon={Download}
                        variant="secondary"
                        size="sm"
                      >Download</Button>
                    </>
                  )}
                </div>
              </div>

              {showSplit && imageUrl && outputUrl ? (
                <div className="flex flex-col gap-2">
                  <Label>Split View</Label>
                  <SplitCompare leftImage={imageUrl} rightImage={outputUrl} leftLabel="Original" rightLabel={activeType.label} />
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-2">
                  <div>
                    <Label>Original</Label>
                    <div className="rounded-md overflow-hidden border border-(--border-default) bg-(--surface-bg)">
                      <img src={imageUrl} alt="Original" className="w-full block" />
                    </div>
                  </div>
                  <div>
                    <Label>{activeType.label}</Label>
                    <div className="rounded-md overflow-hidden border border-(--border-default) bg-(--surface-bg) relative">
                      {outputUrl && <img src={outputUrl} alt="Simulated" className="w-full block" />}
                      {processing && (
                        <div className="absolute inset-0 bg-(--surface-elevated)/60 flex items-center justify-center">
                          <Loader2 className="animate-spin w-4 h-4 text-primary-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Panel>

            {/* All types quick-compare strip — now with real matrix-simulated thumbnails */}
            <Panel>
              <Label>All Vision Types</Label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {VISION_TYPES.map((vt) => (
                  <button
                    key={vt.id}
                    onClick={() => setActiveId(vt.id)}
                    title={vt.label}
                    className={`rounded-sm overflow-hidden border-2 cursor-pointer transition-all ${activeId === vt.id
                      ? "border-primary-500"
                      : "border-transparent hover:border-(--border-default)"
                      }`}
                  >
                    <div className="aspect-square bg-(--surface-bg) relative">
                      {thumbnailUrls[vt.id] ? (
                        <img
                          src={thumbnailUrls[vt.id]}
                          alt={vt.label}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      ) : (
                        // Fallback while thumbnails are generating
                        <img
                          src={imageUrl}
                          alt={vt.label}
                          className="w-full h-full object-cover opacity-40"
                          draggable={false}
                        />
                      )}
                    </div>
                    <Label size="xs">{vt.shortLabel}</Label>
                  </button>
                ))}
              </div>
            </Panel>
          </>
        )}

    </div>
  );
}