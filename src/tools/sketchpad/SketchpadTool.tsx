import { useEffect, useRef, useState, useCallback } from "react";
import { Button, Label, Tooltip } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Slider } from "@/components/neoUi/Slider";
import {
  createDrawingEngine,
  type DrawingEngine,
  type BrushType,
  type Layer,
} from "@/lib/drawing";
import {
  Undo2,
  Redo2,
  Trash2,
  Download,
  Plus,
  Eye,
  EyeOff,
  Pen,
  Eraser,
  Droplets,
  Layers,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";
import { cn } from "@/lib";

// ===== Brush Definitions =====
const BRUSHES: { type: BrushType; label: string; icon: typeof Pen; emoji?: string }[] = [
  { type: "pen", label: "Pen", icon: Pen },
  { type: "soft", label: "Soft Brush", icon: Droplets },
  { type: "eraser", label: "Eraser", icon: Eraser },
];

const COLOR_PRESETS = [
  "#1a1a1a", "#ffffff", "#ef4444", "#f97316", "#eab308",
  "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280",
];

// ===== Component =====
export default function SketchpadTool() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<DrawingEngine | null>(null);

  // Brush state
  const [brushType, setBrushType] = useState<BrushType>("pen");
  const [brushSize, setBrushSize] = useState(4);
  const [brushColor, setBrushColor] = useState("#1a1a1a");
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [smoothing, setSmoothing] = useState(0.5);

  // History state
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Layer state
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState("");
  const [showLayers, setShowLayers] = useState(false);

  // Background
  const [bgColor, setBgColor] = useState("#ffffff");

  // ── Sync history state from engine ───────────────────────────────────────────
  const syncHistory = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    setCanUndo(engine.canUndo);
    setCanRedo(engine.canRedo);
  }, []);

  const syncLayers = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    setLayers(engine.getLayers());
    setActiveLayerId(engine.getActiveLayerId());
  }, []);

  // ── Initialise engine ──────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const engine = createDrawingEngine({
      container,
      backgroundColor: bgColor,
      brush: {
        type: brushType,
        size: brushSize,
        color: brushColor,
        opacity: brushOpacity,
        smoothing,
      },
    });

    engineRef.current = engine;

    // Listen for changes
    engine.on("historyChange", syncHistory);
    engine.on("layerChange", syncLayers);
    engine.on("strokeEnd", syncHistory);

    // Sync initial state
    syncLayers();
    syncHistory();

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
    // Only run on mount/unmount — brush state is synced via separate effects
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sync brush changes to engine ─────────────────────────────────────────
  useEffect(() => {
    engineRef.current?.setBrush({
      type: brushType,
      size: brushSize,
      color: brushColor,
      opacity: brushOpacity,
      smoothing,
    });
  }, [brushType, brushSize, brushColor, brushOpacity, smoothing]);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const engine = engineRef.current;
      if (!engine) return;
      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        engine.undo();
        syncHistory();
      }
      if (ctrl && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        engine.redo();
        syncHistory();
      }
      // Brush shortcuts
      if (!ctrl && e.key === "b") setBrushType("pen");
      if (!ctrl && e.key === "s" && !e.altKey) {
        e.preventDefault();
        setBrushType("soft");
      }
      if (!ctrl && e.key === "e") setBrushType("eraser");

      // Size shortcuts
      if (e.key === "[") setBrushSize((s) => Math.max(1, s - 2));
      if (e.key === "]") setBrushSize((s) => Math.min(100, s + 2));
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [syncHistory]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleUndo = () => {
    engineRef.current?.undo();
    syncHistory();
  };
  const handleRedo = () => {
    engineRef.current?.redo();
    syncHistory();
  };
  const handleClear = () => {
    engineRef.current?.clearActiveLayer();
    syncHistory();
  };
  const handleDownload = async () => {
    const engine = engineRef.current;
    if (!engine) return;
    const blob = await engine.toBlob("image/png");
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `knicknaks-sketch-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddLayer = () => {
    engineRef.current?.addLayer();
    syncLayers();
  };
  const handleRemoveLayer = (id: string) => {
    engineRef.current?.removeLayer(id);
    syncLayers();
  };
  const handleToggleVisibility = (id: string, visible: boolean) => {
    engineRef.current?.setLayerVisibility(id, !visible);
    syncLayers();
  };
  const handleSetActiveLayer = (id: string) => {
    engineRef.current?.setActiveLayer(id);
    syncLayers();
  };
  const handleMoveLayer = (id: string, direction: "up" | "down") => {
    const engine = engineRef.current;
    if (!engine) return;
    const currentLayers = engine.getLayers();
    const idx = currentLayers.findIndex((l) => l.id === id);
    const newIdx = direction === "up" ? idx + 1 : idx - 1;
    if (newIdx < 0 || newIdx >= currentLayers.length) return;
    engine.moveLayer(id, newIdx);
    syncLayers();
  };
  const handleLayerOpacity = (id: string, opacity: number) => {
    engineRef.current?.setLayerOpacity(id, opacity);
    syncLayers();
  };

  const handleBgChange = (color: string) => {
    setBgColor(color);
    engineRef.current?.setBackground(color);
  };

  return (
    <div className="space-y-2">
      {/* ── Toolbar ──────────────────────────────────────────────── */}
      <Panel padding="sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Brush type buttons */}
          <div
            className="flex border border-(--border-default) rounded-md overflow-hidden"
            role="group"
            aria-label="Brush type"
          >
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
            {COLOR_PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                title={c}
                onClick={() => setBrushColor(c)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 cursor-pointer transition-transform duration-(--duration-fast)",
                  "hover:scale-110 active:scale-95",
                  brushColor === c ? "border-primary-500 ring-2 ring-primary-300" : "border-(--border-default)"
                )}
                style={{ backgroundColor: c }}
              />
            ))}
            <input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="w-6 h-6 rounded-full cursor-pointer border border-(--border-default)"
              title="Custom color"
            />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Tooltip content="Undo (Ctrl+Z)">
              <Button variant="ghost" size="xs" icon={Undo2} onClick={handleUndo} disabled={!canUndo} />
            </Tooltip>
            <Tooltip content="Redo (Ctrl+Y)">
              <Button variant="ghost" size="xs" icon={Redo2} onClick={handleRedo} disabled={!canRedo} />
            </Tooltip>
            <Tooltip content="Clear layer">
              <Button variant="ghost" size="xs" icon={Trash2} onClick={handleClear} />
            </Tooltip>
            <Tooltip content="Layers">
              <Button
                variant={showLayers ? "primary" : "ghost"}
                size="xs"
                icon={Layers}
                onClick={() => setShowLayers((s) => !s)}
              />
            </Tooltip>
            <Tooltip content="Download PNG">
              <Button variant="ghost" size="xs" icon={Download} onClick={handleDownload} />
            </Tooltip>
          </div>
        </div>
      </Panel>

      {/* ── Canvas ────────────────────────────────────────────────── */}
      <Panel padding="none">
        <div
          ref={containerRef}
          className="w-full rounded-lg overflow-hidden border border-(--border-default)"
          style={{
            minHeight: "420px",
            height: "60vh",
            background: `repeating-conic-gradient(var(--border-default) 0% 25%, transparent 0% 50%) 0 0 / 16px 16px`,
          }}
        />
      </Panel>

      {/* ── Brush Settings ────────────────────────────────────────── */}
      <Panel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Slider
            label="Size"
            value={brushSize}
            min={1}
            max={100}
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
            label="Smoothing"
            value={Math.round(smoothing * 100)}
            min={0}
            max={100}
            step={5}
            afterValue="%"
            onChange={(e) => setSmoothing(Number(e.target.value) / 100)}
          />
          <div className="flex flex-col gap-1">
            <Label>Background</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => handleBgChange(e.target.value)}
                className="w-8 h-8 rounded-md cursor-pointer border border-(--border-default)"
              />
              <button
                type="button"
                onClick={() => handleBgChange("transparent")}
                className={cn(
                  "px-2 py-1 text-xs rounded-md cursor-pointer border transition-colors duration-(--duration-fast)",
                  bgColor === "transparent"
                    ? "bg-primary-500 text-white border-primary-500"
                    : "bg-(--surface-secondary) text-(--text-secondary) border-(--border-default) hover:border-(--border-hover)"
                )}
              >
                Transparent
              </button>
            </div>
          </div>
        </div>
      </Panel>

      {/* ── Layers Panel ──────────────────────────────────────────── */}
      {showLayers && (
        <Panel>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label icon={Layers}>Layers</Label>
              <Button
                variant="ghost"
                size="xs"
                icon={Plus}
                onClick={handleAddLayer}
              >
                Add Layer
              </Button>
            </div>

            <div className="space-y-1">
              {[...layers].reverse().map((layer) => (
                <div
                  key={layer.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSetActiveLayer(layer.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSetActiveLayer(layer.id);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors duration-(--duration-fast)",
                    layer.id === activeLayerId
                      ? "bg-primary-500/10 border border-primary-500/30"
                      : "hover:bg-(--surface-secondary) border border-transparent"
                  )}
                >
                  {/* Visibility toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleVisibility(layer.id, layer.visible);
                    }}
                    className="text-(--text-tertiary) hover:text-(--text-primary) cursor-pointer p-0.5"
                    title={layer.visible ? "Hide layer" : "Show layer"}
                  >
                    {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>

                  {/* Name */}
                  <span className="flex-1 text-sm truncate" style={{ color: "var(--text-primary)" }}>
                    {layer.name}
                  </span>

                  {/* Opacity */}
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(layer.opacity * 100)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleLayerOpacity(layer.id, Number(e.target.value) / 100);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-16 h-1 accent-primary-500"
                    title={`Opacity: ${Math.round(layer.opacity * 100)}%`}
                  />

                  {/* Move */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleMoveLayer(layer.id, "up"); }}
                    className="text-(--text-tertiary) hover:text-(--text-primary) cursor-pointer p-0.5"
                    title="Move up"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleMoveLayer(layer.id, "down"); }}
                    className="text-(--text-tertiary) hover:text-(--text-primary) cursor-pointer p-0.5"
                    title="Move down"
                  >
                    <ChevronDown size={14} />
                  </button>

                  {/* Delete */}
                  {layers.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleRemoveLayer(layer.id); }}
                      className="text-(--text-tertiary) hover:text-danger-500 cursor-pointer p-0.5"
                      title="Delete layer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Panel>
      )}

      {/* ── Keyboard shortcut hints ──────────────────────────────── */}
      <div className="flex flex-wrap gap-3 px-1">
        {[
          ["B", "Pen"], ["S", "Soft"], ["E", "Eraser"],
          ["[/]", "Size ±"], ["Ctrl+Z", "Undo"], ["Ctrl+Y", "Redo"],
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
