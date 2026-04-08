import { useEffect, useRef, useState, useCallback } from "react";
import { Button, Label, Tooltip } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Slider } from "@/components/neoUi/Slider";
import {
  createDrawingEngine,
  type DrawingEngine,
  type BrushType,
  type Stroke,
} from "@/lib/drawing";
import {
  Undo2,
  Redo2,
  Trash2,
  Download,
  Plus,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Copy,
  Pen,
  Eraser,
  Droplets,
} from "lucide-react";
import { cn } from "@/lib";

// ===== Types =====
interface Frame {
  id: string;
  strokes: Stroke[];
  thumbnail: string; // data URL
}

const BRUSHES: { type: BrushType; label: string; icon: typeof Pen }[] = [
  { type: "pen", label: "Pen", icon: Pen },
  { type: "soft", label: "Soft Brush", icon: Droplets },
  { type: "eraser", label: "Eraser", icon: Eraser },
];

const COLOR_PRESETS = [
  "#1a1a1a", "#ffffff", "#ef4444", "#f97316", "#eab308",
  "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280",
];

let frameIdCounter = 0;
function nextFrameId(): string {
  return `frame-${Date.now()}-${frameIdCounter++}`;
}

// ===== Component =====
export default function AnimatorTool() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<DrawingEngine | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Frame state
  const [frames, setFrames] = useState<Frame[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  // Playback
  const [isPlaying, setIsPlaying] = useState(false);
  const [fps, setFps] = useState(8);
  const [onionSkin, setOnionSkin] = useState(true);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Brush
  const [brushType, setBrushType] = useState<BrushType>("pen");
  const [brushSize, setBrushSize] = useState(4);
  const [brushColor, setBrushColor] = useState("#1a1a1a");
  const [brushOpacity, setBrushOpacity] = useState(1);

  // History
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const syncHistory = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    setCanUndo(engine.canUndo);
    setCanRedo(engine.canRedo);
  }, []);

  // ── Save current frame strokes from engine ─────────────────────────────────
  const captureCurrentFrame = useCallback((): Frame | null => {
    const engine = engineRef.current;
    if (!engine) return null;

    const strokes = engine.getAllStrokes();
    const thumbnail = engine.toDataURL("image/png", 0.3);
    const frame: Frame = {
      id: frames[currentFrameIndex]?.id ?? nextFrameId(),
      strokes: strokes.map((s) => ({ ...s, points: [...s.points] })),
      thumbnail,
    };
    return frame;
  }, [frames, currentFrameIndex]);

  // ── Load a frame's strokes into the engine ─────────────────────────────────
  const loadFrameIntoEngine = useCallback((frame: Frame) => {
    const engine = engineRef.current;
    if (!engine) return;

    // Clear engine
    engine.clearAll();

    // Re-add strokes — we need to add them to the stroke store.
    // We'll use a direct approach: re-add each stroke
    const layerId = engine.getActiveLayerId();
    for (const stroke of frame.strokes) {
      const adjustedStroke = { ...stroke, layerId };
      // Access engine internals — a bit hacky but needed for restore
      // Instead, use the engine's internal stroke store via the exposed getAllStrokes path
      (engine as any).strokeStore?.addStroke(adjustedStroke);
    }

    // Force re-render
    (engine as any).renderer?.markDirty();
  }, []);

  // ── Initialise engine and first frame ──────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const engine = createDrawingEngine({
      container,
      backgroundColor: "#ffffff",
      brush: {
        type: brushType,
        size: brushSize,
        color: brushColor,
        opacity: brushOpacity,
        smoothing: 0.5,
      },
    });

    engineRef.current = engine;

    engine.on("historyChange", syncHistory);
    engine.on("strokeEnd", syncHistory);
    syncHistory();

    // Create first empty frame
    const firstFrame: Frame = {
      id: nextFrameId(),
      strokes: [],
      thumbnail: "",
    };
    setFrames([firstFrame]);
    setCurrentFrameIndex(0);

    return () => {
      engine.destroy();
      engineRef.current = null;
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sync brush to engine ────────────────────────────────────────────────
  useEffect(() => {
    engineRef.current?.setBrush({
      type: brushType,
      size: brushSize,
      color: brushColor,
      opacity: brushOpacity,
      smoothing: 0.5,
    });
  }, [brushType, brushSize, brushColor, brushOpacity]);

  // ── Save frame before switching ─────────────────────────────────────────
  const saveCurrentFrame = useCallback(() => {
    const frame = captureCurrentFrame();
    if (!frame) return;

    setFrames((prev) => {
      const next = [...prev];
      next[currentFrameIndex] = frame;
      return next;
    });
  }, [captureCurrentFrame, currentFrameIndex]);

  // ── Frame navigation ──────────────────────────────────────────────────
  const goToFrame = useCallback(
    (index: number) => {
      if (index < 0 || index >= frames.length) return;
      // Save current
      saveCurrentFrame();
      // Switch
      setCurrentFrameIndex(index);
      loadFrameIntoEngine(frames[index]);
    },
    [frames, saveCurrentFrame, loadFrameIntoEngine]
  );

  const addFrame = useCallback(() => {
    saveCurrentFrame();
    const newFrame: Frame = { id: nextFrameId(), strokes: [], thumbnail: "" };
    setFrames((prev) => {
      const next = [...prev];
      next.splice(currentFrameIndex + 1, 0, newFrame);
      return next;
    });
    setCurrentFrameIndex((i) => i + 1);
    // Clear engine for fresh frame
    engineRef.current?.clearAll();
  }, [saveCurrentFrame, currentFrameIndex]);

  const duplicateFrame = useCallback(() => {
    saveCurrentFrame();
    const source = captureCurrentFrame();
    if (!source) return;
    const dupe: Frame = {
      ...source,
      id: nextFrameId(),
      strokes: source.strokes.map((s) => ({ ...s, id: `${s.id}-dup-${Date.now()}` })),
    };
    setFrames((prev) => {
      const next = [...prev];
      next.splice(currentFrameIndex + 1, 0, dupe);
      return next;
    });
    setCurrentFrameIndex((i) => i + 1);
  }, [saveCurrentFrame, captureCurrentFrame, currentFrameIndex]);

  const deleteFrame = useCallback(() => {
    if (frames.length <= 1) {
      // Clear the only frame
      engineRef.current?.clearAll();
      setFrames([{ id: nextFrameId(), strokes: [], thumbnail: "" }]);
      setCurrentFrameIndex(0);
      return;
    }
    setFrames((prev) => prev.filter((_, i) => i !== currentFrameIndex));
    const newIdx = Math.min(currentFrameIndex, frames.length - 2);
    setCurrentFrameIndex(newIdx);
    if (frames[newIdx === currentFrameIndex ? (newIdx > 0 ? newIdx - 1 : 0) : newIdx]) {
      const target = newIdx === currentFrameIndex && newIdx > 0 ? newIdx - 1 : newIdx;
      loadFrameIntoEngine(frames[target < frames.length ? target : 0]);
    }
  }, [frames, currentFrameIndex, loadFrameIntoEngine]);

  // ── Playback ──────────────────────────────────────────────────────────
  const startPlayback = useCallback(() => {
    if (frames.length < 2) return;
    saveCurrentFrame();
    setIsPlaying(true);

    let idx = currentFrameIndex;
    playIntervalRef.current = setInterval(() => {
      idx = (idx + 1) % frames.length;
      setCurrentFrameIndex(idx);
      loadFrameIntoEngine(frames[idx]);
    }, 1000 / fps);
  }, [frames, fps, currentFrameIndex, saveCurrentFrame, loadFrameIntoEngine]);

  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
  }, []);

  // ── Export as animated GIF frames (download as PNG sequence) ──────────
  const handleExport = useCallback(async () => {
    saveCurrentFrame();
    const engine = engineRef.current;
    if (!engine) return;

    // Save current state
    const savedIdx = currentFrameIndex;
    const savedStrokes = engine.getAllStrokes();

    // Create a zip-like download — for simplicity, download each frame
    for (let i = 0; i < frames.length; i++) {
      loadFrameIntoEngine(frames[i]);
      const blob = await engine.toBlob("image/png");
      if (!blob) continue;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `knicknaks-anim-frame-${String(i + 1).padStart(3, "0")}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }

    // Restore
    loadFrameIntoEngine(frames[savedIdx]);
  }, [frames, currentFrameIndex, saveCurrentFrame, loadFrameIntoEngine]);

  // ── Onion skin overlay ────────────────────────────────────────────────
  useEffect(() => {
    if (!onionSkin || currentFrameIndex === 0 || !containerRef.current) return;

    const prevFrame = frames[currentFrameIndex - 1];
    if (!prevFrame?.thumbnail) return;

    // We'll use a CSS overlay for the onion skin effect
    const container = containerRef.current;
    const existing = container.querySelector("[data-onion-skin]");
    existing?.remove();

    const overlay = document.createElement("div");
    overlay.setAttribute("data-onion-skin", "true");
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 1;
      opacity: 0.15;
      background-image: url(${prevFrame.thumbnail});
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    `;
    container.style.position = "relative";
    container.appendChild(overlay);

    return () => {
      overlay.remove();
    };
  }, [onionSkin, currentFrameIndex, frames]);

  // ── Keyboard shortcuts ────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const engine = engineRef.current;
      if (!engine) return;
      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key === "z" && !e.shiftKey) { e.preventDefault(); engine.undo(); syncHistory(); }
      if (ctrl && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); engine.redo(); syncHistory(); }

      if (!ctrl && e.key === "b") setBrushType("pen");
      if (!ctrl && e.key === "e") setBrushType("eraser");
      if (e.key === "[") setBrushSize((s) => Math.max(1, s - 2));
      if (e.key === "]") setBrushSize((s) => Math.min(100, s + 2));

      // Frame navigation
      if (e.key === "ArrowLeft" && ctrl) { e.preventDefault(); goToFrame(currentFrameIndex - 1); }
      if (e.key === "ArrowRight" && ctrl) { e.preventDefault(); goToFrame(currentFrameIndex + 1); }
      if (e.key === " " && ctrl) { e.preventDefault(); isPlaying ? stopPlayback() : startPlayback(); }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [syncHistory, goToFrame, currentFrameIndex, isPlaying, startPlayback, stopPlayback]);

  return (
    <div className="space-y-2">
      {/* ── Toolbar ──────────────────────────────────────────── */}
      <Panel padding="sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Brush type */}
          <div className="flex border border-(--border-default) rounded-md overflow-hidden" role="group" aria-label="Brush type">
            {BRUSHES.map((b) => {
              const Icon = b.icon;
              return (
                <Tooltip key={b.type} content={b.label}>
                  <button
                    type="button"
                    aria-pressed={brushType === b.type}
                    onClick={() => setBrushType(b.type)}
                    className={cn(
                      "px-2.5 py-1.5 cursor-pointer transition-colors duration-(--duration-fast)",
                      "border-r border-(--border-default) last:border-r-0",
                      brushType === b.type
                        ? "bg-primary-500 text-white"
                        : "bg-(--surface-elevated) text-(--text-tertiary) hover:bg-(--surface-secondary) hover:text-(--text-primary)"
                    )}
                  >
                    <Icon size={16} />
                  </button>
                </Tooltip>
              );
            })}
          </div>

          {/* Color presets */}
          <div className="flex items-center gap-1 ml-1" role="group" aria-label="Color presets">
            {COLOR_PRESETS.slice(0, 6).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setBrushColor(c)}
                className={cn(
                  "w-5 h-5 rounded-full border-2 cursor-pointer transition-transform duration-(--duration-fast)",
                  "hover:scale-110",
                  brushColor === c ? "border-primary-500 ring-2 ring-primary-300" : "border-(--border-default)"
                )}
                style={{ backgroundColor: c }}
              />
            ))}
            <input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="w-5 h-5 rounded-full cursor-pointer border border-(--border-default)"
            />
          </div>

          <div className="flex-1" />

          {/* Undo/Redo */}
          <Tooltip content="Undo"><Button variant="ghost" size="xs" icon={Undo2} onClick={() => { engineRef.current?.undo(); syncHistory(); }} disabled={!canUndo} /></Tooltip>
          <Tooltip content="Redo"><Button variant="ghost" size="xs" icon={Redo2} onClick={() => { engineRef.current?.redo(); syncHistory(); }} disabled={!canRedo} /></Tooltip>
          <Tooltip content="Clear frame"><Button variant="ghost" size="xs" icon={Trash2} onClick={() => engineRef.current?.clearAll()} /></Tooltip>
        </div>
      </Panel>

      {/* ── Canvas ────────────────────────────────────────────── */}
      <Panel padding="none">
        <div
          ref={containerRef}
          className="w-full rounded-lg overflow-hidden border border-(--border-default)"
          style={{
            minHeight: "360px",
            height: "50vh",
            background: "#ffffff",
            position: "relative",
          }}
        />
      </Panel>

      {/* ── Brush Settings ────────────────────────────────────── */}
      <Panel>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Slider
            label="Size"
            value={brushSize}
            min={1}
            max={60}
            step={1}
            afterValue="px"
            onChange={(e) => setBrushSize(Number(e.target.value))}
          />
          <Slider
            label="Opacity"
            value={Math.round(brushOpacity * 100)}
            min={1}
            max={100}
            step={1}
            afterValue="%"
            onChange={(e) => setBrushOpacity(Number(e.target.value) / 100)}
          />
          <Slider
            label="FPS"
            value={fps}
            min={1}
            max={24}
            step={1}
            onChange={(e) => setFps(Number(e.target.value))}
          />
        </div>
      </Panel>

      {/* ── Playback Controls ─────────────────────────────────── */}
      <Panel padding="sm">
        <div className="flex flex-wrap items-center gap-2">
          <Tooltip content="Previous frame (Ctrl+←)">
            <Button
              variant="ghost"
              size="xs"
              icon={SkipBack}
              onClick={() => goToFrame(currentFrameIndex - 1)}
              disabled={currentFrameIndex === 0 || isPlaying}
            />
          </Tooltip>

          {isPlaying ? (
            <Button variant="primary" size="s" icon={Pause} onClick={stopPlayback}>
              Pause
            </Button>
          ) : (
            <Button variant="primary" size="s" icon={Play} onClick={startPlayback} disabled={frames.length < 2}>
              Play
            </Button>
          )}

          <Tooltip content="Next frame (Ctrl+→)">
            <Button
              variant="ghost"
              size="xs"
              icon={SkipForward}
              onClick={() => goToFrame(currentFrameIndex + 1)}
              disabled={currentFrameIndex >= frames.length - 1 || isPlaying}
            />
          </Tooltip>

          {/* Frame counter */}
          <span
            className="text-sm font-mono tabular-nums px-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {currentFrameIndex + 1} / {frames.length}
          </span>

          <div className="flex-1" />

          {/* Frame actions */}
          <Tooltip content="Add new frame">
            <Button variant="ghost" size="xs" icon={Plus} onClick={addFrame} disabled={isPlaying}>
              New
            </Button>
          </Tooltip>
          <Tooltip content="Duplicate frame">
            <Button variant="ghost" size="xs" icon={Copy} onClick={duplicateFrame} disabled={isPlaying}>
              Dupe
            </Button>
          </Tooltip>
          <Tooltip content="Delete frame">
            <Button variant="ghost" size="xs" icon={Trash2} onClick={deleteFrame} disabled={isPlaying} />
          </Tooltip>

          {/* Onion skin toggle */}
          <button
            type="button"
            onClick={() => setOnionSkin((s) => !s)}
            className={cn(
              "px-2 py-1 text-xs rounded-md cursor-pointer border transition-colors duration-(--duration-fast)",
              onionSkin
                ? "bg-primary-500 text-white border-primary-500"
                : "bg-(--surface-secondary) text-(--text-secondary) border-(--border-default) hover:border-(--border-hover)"
            )}
            title="Toggle onion skin (show previous frame)"
          >
            🧅 Onion
          </button>

          <Tooltip content="Export all frames as PNG">
            <Button variant="ghost" size="xs" icon={Download} onClick={handleExport} disabled={isPlaying} />
          </Tooltip>
        </div>
      </Panel>

      {/* ── Frame Timeline ────────────────────────────────────── */}
      <Panel padding="sm">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {frames.map((frame, idx) => (
            <button
              key={frame.id}
              type="button"
              onClick={() => !isPlaying && goToFrame(idx)}
              className={cn(
                "flex-shrink-0 w-16 h-12 rounded-md border-2 cursor-pointer overflow-hidden transition-all duration-(--duration-fast)",
                "hover:scale-105",
                idx === currentFrameIndex
                  ? "border-primary-500 ring-2 ring-primary-300 shadow-md"
                  : "border-(--border-default) hover:border-(--border-hover)"
              )}
            >
              {frame.thumbnail ? (
                <img
                  src={frame.thumbnail}
                  alt={`Frame ${idx + 1}`}
                  className="w-full h-full object-contain bg-white"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-(--surface-secondary)">
                  <span className="text-[10px] text-(--text-tertiary)">{idx + 1}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </Panel>

      {/* ── Shortcut hints ─────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 px-1">
        {[
          ["B", "Pen"], ["E", "Eraser"], ["[/]", "Size ±"],
          ["Ctrl+←/→", "Frames"], ["Ctrl+Z/Y", "Undo/Redo"],
        ].map(([key, action]) => (
          <span key={key} className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            <kbd
              className="px-1.5 py-0.5 rounded text-[10px] font-mono border"
              style={{
                background: "var(--surface-secondary)",
                borderColor: "var(--border-default)",
                color: "var(--text-secondary)",
              }}
            >
              {key}
            </kbd>{" "}
            {action}
          </span>
        ))}
      </div>
    </div>
  );
}
