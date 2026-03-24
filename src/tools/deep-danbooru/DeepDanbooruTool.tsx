import { useState, useEffect, useRef, useMemo } from "react";
import { Panel } from "@/components/layout";
import { Button, Label } from "@/components/ui";
import { Copy, Cpu, HardDrive } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import FileDropZone from "@/components/advanced/FileDropZone";

type Tag = { name: string; category: number; prob: number };

const CAT_COLORS: Record<number, { bg: string; text: string; label: string }> = {
  0: { bg: "bg-blue-500/10", text: "text-blue-400", label: "General" },
  4: { bg: "bg-green-500/10", text: "text-green-400", label: "Character" },
  3: { bg: "bg-purple-500/10", text: "text-purple-400", label: "Copyright" },
  1: { bg: "bg-red-500/10", text: "text-red-400", label: "Rating" },
};

export default function DeepDanbooruTool() {
  const toast = useToast();

  const [isCached, setIsCached] = useState<boolean | null>(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [task, setTask] = useState("");

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isInferencing, setIsInferencing] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [threshold, setThreshold] = useState(0.35);

  const workerRef = useRef<Worker | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ── Worker setup ──────────────────────────────────────────────────────────
  useEffect(() => {
    const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const { type } = e.data;
      if (type === "CACHE_STATUS") setIsCached(e.data.cached);
      else if (type === "PROGRESS") { setProgress(e.data.progress); setTask(e.data.task); }
      else if (type === "READY") { setModelReady(true); setModelLoading(false); toast.success("Model ready!"); }
      else if (type === "RESULT") { setTags(e.data.tags); setIsInferencing(false); }
      else if (type === "ERROR") {
        toast.error(e.data.error);
        setModelLoading(false);
        setIsInferencing(false);
      }
    };

    worker.postMessage({ type: "CHECK_CACHE" });
    return () => worker.terminate();
  }, []);

  // ── Model / inference helpers ─────────────────────────────────────────────
  const loadModel = () => {
    if (modelLoading || modelReady) return;
    setModelLoading(true);
    workerRef.current?.postMessage({ type: "INIT" });
  };

  const runInference = (src: string) => {
    if (!modelReady) return;
    setIsInferencing(true);
    setTags([]);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const cvs = canvasRef.current;
      if (!cvs) return;
      const ctx = cvs.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      cvs.width = cvs.height = 448;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 448, 448);
      ctx.drawImage(img, 0, 0, 448, 448);
      const imageData = ctx.getImageData(0, 0, 448, 448);
      workerRef.current?.postMessage({
        type: "RUN",
        payload: { rgba: imageData.data, width: 448, height: 448 },
      });
    };
    img.src = src;
  };

  // Auto-run once model finishes loading if image is already waiting
  useEffect(() => {
    if (modelReady && imageSrc && tags.length === 0 && !isInferencing) {
      runInference(imageSrc);
    }
  }, [modelReady]);

  // ── Upload handler ────────────────────────────────────────────────────────
  const handleUpload = (e: { file: File }) => {
    const url = URL.createObjectURL(e.file);
    setImageSrc(url);
    setTags([]);
    if (!modelReady && !modelLoading) loadModel();
    else if (modelReady) runInference(url);
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const filteredTags = useMemo(() => tags.filter(t => t.prob >= threshold), [tags, threshold]);
  const categoriesPresent = useMemo(() =>
    Array.from(new Set(filteredTags.map(t => t.category))).sort((a, b) => a - b),
    [filteredTags]
  );

  const copyTags = (sep: string) => {
    navigator.clipboard.writeText(filteredTags.map(t => t.name.replace(/_/g, " ")).join(sep));
    toast.success("Tags copied!");
  };

  // ── Status label ──────────────────────────────────────────────────────────
  const cacheLabel = isCached === null
    ? <Label variant="primary" icon={HardDrive}>Checking cache…</Label>
    : isCached
      ? <Label variant="success" icon={HardDrive}>Model cached · works offline</Label>
      : <Label variant="warning" icon={HardDrive}>~388 MB download on first use</Label>;

  // ── Loading bar ───────────────────────────────────────────────────────────
  const showProgress = modelLoading || isInferencing;

  return (
    <div className="space-y-4">
      {/* ── Top panel ── */}
      <Panel>
        <div className="flex flex-col md:flex-row gap-6">

          {/* Left: upload + info */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-xl font-semibold">AI Image Tagger</h1>
              <p className="text-sm text-(--text-secondary) mt-0.5">
                Runs entirely in your browser via ONNX — no data ever leaves your device.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {cacheLabel}
              {modelReady && <Label variant="success" icon={Cpu}>Model ready</Label>}
            </div>

            {!imageSrc ? (
              <FileDropZone emoji="🖼️" accepts="image/*" onUpload={handleUpload} />
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-(--border-primary) bg-(--surface-tertiary)">
                <img src={imageSrc} className="w-full object-contain max-h-72" alt="Input" />
                <button
                  type="button"
                  onClick={() => { setImageSrc(null); setTags([]); }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-red-500 transition-colors"
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Right: controls */}
          <div className="w-full md:w-60 shrink-0 flex flex-col gap-4">

            {/* Threshold slider */}
            <div className="p-4 rounded-xl border border-(--border-primary) bg-(--surface-secondary) space-y-2">
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Confidence threshold</span>
                <span className="text-primary-500 tabular-nums">{(threshold * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range" min={0.05} max={1} step={0.01}
                value={threshold}
                onChange={e => setThreshold(parseFloat(e.target.value))}
                className="w-full accent-primary-500"
              />
              <p className="text-xs text-(--text-tertiary)">
                Hide tags below this probability.
              </p>
            </div>

            {/* Progress */}
            {showProgress && (
              <div className="p-4 rounded-xl border border-(--border-primary) bg-(--surface-secondary) space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-(--text-secondary) truncate">
                    {modelLoading ? task || "Loading…" : "Running inference…"}
                  </span>
                  <span className="text-xs text-(--text-tertiary) tabular-nums shrink-0 ml-2">
                    {progress}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-(--surface-tertiary) overflow-hidden">
                  <div
                    className="h-full bg-primary-500 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Pre-load button (shown only before model is ready) */}
            {!modelReady && !modelLoading && (
              <Button variant="secondary" onClick={loadModel}>
                Pre-load model
              </Button>
            )}

            {/* Re-run button */}
            {modelReady && imageSrc && !isInferencing && (
              <Button variant="primary" onClick={() => runInference(imageSrc)}>
                Re-run tagging
              </Button>
            )}
          </div>
        </div>
      </Panel>

      {/* ── Results panel ── */}
      {filteredTags.length > 0 && (
        <Panel>
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg font-semibold">
                Tags <span className="text-(--text-tertiary) font-normal text-sm">({filteredTags.length})</span>
              </h2>
              <div className="flex gap-2">
                <Button variant="ghost" icon={Copy} onClick={() => copyTags(", ")}>
                  Comma
                </Button>
                <Button variant="ghost" icon={Copy} onClick={() => copyTags(" ")}>
                  Space
                </Button>
              </div>
            </div>

            <div className="space-y-5">
              {categoriesPresent.map(catId => {
                const catTags = filteredTags.filter(t => t.category === catId);
                const conf = CAT_COLORS[catId] ?? {
                  bg: "bg-gray-500/10", text: "text-gray-400", label: `Cat ${catId}`,
                };
                return (
                  <div key={catId} className="space-y-2">
                    <p className={`text-xs uppercase tracking-widest font-bold ${conf.text}`}>
                      {conf.label}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {catTags.map(t => (
                        <span
                          key={t.name}
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-sm
                            ${conf.bg} ${conf.text} border border-current/10`}
                        >
                          {t.name.replace(/_/g, " ")}
                          <span className="text-[10px] opacity-60 tabular-nums">
                            {(t.prob * 100).toFixed(0)}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Panel>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}