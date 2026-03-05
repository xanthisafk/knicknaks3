import { useState, useRef, useCallback, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VisionType {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  matrix: number[]; // 3×3 row-major color transform
}

// ─── Vision deficiency matrices ──────────────────────────────────────────────
// Source: Machado, Oliveira, Fernandes (2009) and Brettel (1997) approximations

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
    matrix: [
      0.567, 0.433, 0,
      0.558, 0.442, 0,
      0,     0.242, 0.758,
    ],
  },
  {
    id: "protanomaly",
    label: "Protanomaly",
    shortLabel: "Protanomaly",
    description: "Reduced red sensitivity — weakened L cones. ~1% of males.",
    matrix: [
      0.817, 0.183, 0,
      0.333, 0.667, 0,
      0,     0.125, 0.875,
    ],
  },
  {
    id: "deuteranopia",
    label: "Deuteranopia",
    shortLabel: "Deuteranopia",
    description: "Green-blind — missing or nonfunctional M cones. ~1% of males.",
    matrix: [
      0.625, 0.375, 0,
      0.7,   0.3,   0,
      0,     0.3,   0.7,
    ],
  },
  {
    id: "deuteranomaly",
    label: "Deuteranomaly",
    shortLabel: "Deuteranomaly",
    description: "Reduced green sensitivity — most common form. ~5% of males.",
    matrix: [
      0.8,   0.2,   0,
      0.258, 0.742, 0,
      0,     0.142, 0.858,
    ],
  },
  {
    id: "tritanopia",
    label: "Tritanopia",
    shortLabel: "Tritanopia",
    description: "Blue-blind — missing or nonfunctional S cones. Very rare.",
    matrix: [
      0.95,  0.05,  0,
      0,     0.433, 0.567,
      0,     0.475, 0.525,
    ],
  },
  {
    id: "tritanomaly",
    label: "Tritanomaly",
    shortLabel: "Tritanomaly",
    description: "Reduced blue sensitivity. Rare (~0.01% of population).",
    matrix: [
      0.967, 0.033, 0,
      0,     0.733, 0.267,
      0,     0.183, 0.817,
    ],
  },
  {
    id: "achromatopsia",
    label: "Achromatopsia",
    shortLabel: "Achromato.",
    description: "Complete color blindness — all color perceived as grey. Very rare.",
    matrix: [
      0.299, 0.587, 0.114,
      0.299, 0.587, 0.114,
      0.299, 0.587, 0.114,
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

  // Identity shortcut
  const isIdentity = matrix.every((v, i) => v === [1,0,0,0,1,0,0,0,1][i]);
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] border border-[var(--border-default)] p-5 ${className}`}>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ColorBlindnessSimulatorTool() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [activeId, setActiveId] = useState("normal");
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [showSplit, setShowSplit] = useState(false);
  const [splitPos, setSplitPos] = useState(50); // percent

  const fileInputRef = useRef<HTMLInputElement>(null);
  const srcCanvasRef = useRef<HTMLCanvasElement>(null);
  const dstCanvasRef = useRef<HTMLCanvasElement>(null);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  const activeType = VISION_TYPES.find((v) => v.id === activeId)!;

  // Run simulation whenever activeId or source image changes
  const runSimulation = useCallback((matrix: number[]) => {
    const src = srcCanvasRef.current;
    const dst = dstCanvasRef.current;
    if (!src || !dst || src.width === 0) return;
    setProcessing(true);
    // Defer to next frame for smoother UX
    requestAnimationFrame(() => {
      simulateOnCanvas(src, dst, matrix);
      setOutputUrl(dst.toDataURL());
      setProcessing(false);
    });
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
      const MAX = 800;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const src = srcCanvasRef.current!;
      src.width = img.width * scale;
      src.height = img.height * scale;
      src.getContext("2d")!.drawImage(img, 0, 0, src.width, src.height);
      runSimulation(activeType.matrix);
    };
    img.src = url;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) loadImage(file);
  };

  const reset = () => {
    setImageUrl(null);
    setOutputUrl(null);
    setImageName("");
    setShowSplit(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    const src = srcCanvasRef.current;
    if (src) { src.width = 0; src.height = 0; }
  };

  // Split drag handling
  const handleSplitDrag = (e: React.MouseEvent) => {
    const container = splitContainerRef.current;
    if (!container) return;
    const onMove = (ev: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const pct = Math.min(100, Math.max(0, ((ev.clientX - rect.left) / rect.width) * 100));
      setSplitPos(pct);
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div className="space-y-5">
      {/* Hidden canvases */}
      <canvas ref={srcCanvasRef} className="hidden" />
      <canvas ref={dstCanvasRef} className="hidden" />

      {/* Upload zone */}
      {!imageUrl ? (
        <Panel>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-[var(--radius-lg)] p-12 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all select-none ${
              dragging
                ? "border-[var(--color-primary-500)] bg-[var(--color-primary-500)]/5"
                : "border-[var(--border-default)] hover:border-[var(--color-primary-500)]/60 hover:bg-[var(--surface-bg)]"
            }`}
          >
            <span className="text-4xl">🖼️</span>
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Drop an image here, or click to browse
              </p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">
                PNG, JPG, WEBP — processed entirely in your browser
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) loadImage(f); }}
            />
          </div>
        </Panel>
      ) : (
        <>
          {/* Vision type selector */}
          <Panel>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">
                Vision Type
              </h3>
              <button
                onClick={reset}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)] hover:border-[var(--color-primary-500)] px-2.5 py-1 rounded-[var(--radius-sm)] transition-colors bg-[var(--surface-bg)]"
              >
                ↩ New image
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {VISION_TYPES.map((vt) => (
                <button
                  key={vt.id}
                  onClick={() => setActiveId(vt.id)}
                  className={`px-3 py-2 rounded-[var(--radius-md)] text-left transition-all border text-sm ${
                    activeId === vt.id
                      ? "border-[var(--color-primary-500)] bg-[var(--color-primary-500)]/10 text-[var(--text-primary)]"
                      : "border-[var(--border-default)] bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-primary-500)]/50"
                  }`}
                >
                  <span className="font-medium text-xs block truncate">{vt.shortLabel}</span>
                </button>
              ))}
            </div>

            {/* Active description */}
            <p className="text-xs text-[var(--text-tertiary)] mt-3 leading-relaxed">
              <strong className="text-[var(--text-secondary)]">{activeType.label}:</strong>{" "}
              {activeType.description}
            </p>
          </Panel>

          {/* Image preview */}
          <Panel>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">
                Preview — {activeType.label}
              </h3>
              <div className="flex items-center gap-2">
                {processing && (
                  <svg className="animate-spin w-4 h-4 text-[var(--color-primary-500)]" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                )}
                <button
                  onClick={() => setShowSplit((s) => !s)}
                  className={`text-xs px-3 py-1 rounded-[var(--radius-sm)] border transition-colors ${
                    showSplit
                      ? "border-[var(--color-primary-500)] bg-[var(--color-primary-500)]/10 text-[var(--text-primary)]"
                      : "border-[var(--border-default)] bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  ⟺ Split compare
                </button>
              </div>
            </div>

            {showSplit && imageUrl && outputUrl ? (
              /* Split view */
              <div
                ref={splitContainerRef}
                className="relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-default)] select-none"
                style={{ cursor: "col-resize" }}
              >
                {/* Simulated (bottom layer) */}
                <img
                  src={outputUrl}
                  alt="Simulated"
                  className="w-full block"
                  draggable={false}
                />
                {/* Original (clipped on top) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${splitPos}%` }}
                >
                  <img
                    src={imageUrl}
                    alt="Original"
                    className="block"
                    style={{ width: `${(100 / splitPos) * 100}%`, maxWidth: "none" }}
                    draggable={false}
                  />
                </div>
                {/* Divider handle */}
                <div
                  className="absolute inset-y-0 flex items-center justify-center"
                  style={{ left: `calc(${splitPos}% - 16px)`, width: 32 }}
                  onMouseDown={handleSplitDrag}
                >
                  <div className="w-0.5 h-full bg-white/70 backdrop-blur-sm" />
                  <div className="absolute w-7 h-7 rounded-full bg-white shadow-lg flex items-center justify-center text-[10px] font-bold text-gray-700 select-none">
                    ⟺
                  </div>
                </div>
                {/* Labels */}
                <div className="absolute top-2 left-2 text-[10px] font-semibold bg-black/40 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                  Original
                </div>
                <div className="absolute top-2 right-2 text-[10px] font-semibold bg-black/40 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {activeType.shortLabel}
                </div>
              </div>
            ) : (
              /* Single view: side by side on large, stacked on small */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase mb-1.5">
                    Original
                  </p>
                  <div className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-default)] bg-[var(--surface-bg)]">
                    <img src={imageUrl} alt="Original" className="w-full block" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase mb-1.5">
                    {activeType.label}
                  </p>
                  <div className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-default)] bg-[var(--surface-bg)] relative">
                    {outputUrl && <img src={outputUrl} alt="Simulated" className="w-full block" />}
                    {processing && (
                      <div className="absolute inset-0 bg-[var(--surface-elevated)]/60 flex items-center justify-center">
                        <svg className="animate-spin w-6 h-6 text-[var(--color-primary-500)]" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Download simulated */}
            {outputUrl && !processing && activeId !== "normal" && (
              <div className="mt-3 flex justify-end">
                <a
                  href={outputUrl}
                  download={`${imageName.replace(/\.[^.]+$/, "")}_${activeId}.png`}
                  className="text-xs px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-primary-500)] transition-colors"
                >
                  ↓ Download simulated image
                </a>
              </div>
            )}
          </Panel>

          {/* All types quick-compare strip */}
          <Panel>
            <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-3">
              All Vision Types
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {VISION_TYPES.map((vt) => (
                <button
                  key={vt.id}
                  onClick={() => setActiveId(vt.id)}
                  title={vt.label}
                  className={`rounded-[var(--radius-sm)] overflow-hidden border-2 transition-all ${
                    activeId === vt.id
                      ? "border-[var(--color-primary-500)] scale-105"
                      : "border-transparent hover:border-[var(--border-default)]"
                  }`}
                >
                  <div className="aspect-square bg-[var(--surface-bg)] relative">
                    <img
                      src={imageUrl}
                      alt={vt.label}
                      className="w-full h-full object-cover"
                      style={{
                        filter: vt.id === "achromatopsia" ? "grayscale(1)" : "none",
                      }}
                    />
                  </div>
                  <p className="text-[9px] text-center text-[var(--text-tertiary)] py-1 px-0.5 truncate leading-tight">
                    {vt.shortLabel}
                  </p>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[var(--text-tertiary)] mt-2">
              Tap any thumbnail to switch — thumbnails use CSS filters as a quick preview.
            </p>
          </Panel>
        </>
      )}

      {/* Info */}
      <Panel>
        <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-3">
          About color vision deficiencies
        </h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Color blindness affects roughly <strong>8% of males</strong> and <strong>0.5% of females</strong> of Northern European descent. The most common forms involve reduced sensitivity to red (protanomaly) or green (deuteranomaly). Designing with accessible contrast and not relying on color alone helps make interfaces inclusive for everyone.
        </p>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-2">
          Simulations use established color transformation matrices. All processing happens locally — images never leave your device.
        </p>
      </Panel>
    </div>
  );
}