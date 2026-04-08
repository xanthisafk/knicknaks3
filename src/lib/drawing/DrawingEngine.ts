import type {
  DrawingEngineOptions,
  BrushSettings,
  BrushType,
  DrawPoint,
  Layer,
  Stroke,
  HistoryCommand,
  EngineEventType,
  EngineEventListener,
} from "./types";
import { InputHandler } from "./InputHandler";
import { BrushEngine } from "./BrushEngine";
import { StrokeStore } from "./StrokeStore";
import { LayerManager } from "./LayerManager";
import { HistoryManager } from "./HistoryManager";
import { Renderer } from "./Renderer";

const DEFAULT_BRUSH: BrushSettings = {
  type: "pen",
  size: 4,
  color: "#1a1a1a",
  opacity: 1,
  pressureSensitivity: true,
  smoothing: 0.5,
};

/**
 * DrawingEngine — the main public API that orchestrates input handling,
 * stroke management, layer compositing, history, and rendering.
 *
 * Usage:
 * ```ts
 * const engine = createDrawingEngine({ container: myDiv });
 * engine.start();
 * // ...later
 * engine.destroy();
 * ```
 */
export class DrawingEngine {
  // Sub-systems
  private inputHandler: InputHandler;
  private strokeStore: StrokeStore;
  private layerManager: LayerManager;
  private historyManager: HistoryManager;
  private renderer: Renderer;

  // Canvas
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private width: number;
  private height: number;
  private dpr: number;

  // State
  private brush: BrushSettings;
  private activeLayerId: string;
  private activeStrokeId: string | null = null;
  private started = false;
  private bgColor: string;

  // Events
  private listeners: Map<EngineEventType, Set<EngineEventListener>> = new Map();

  // Resize observer
  private resizeObserver: ResizeObserver | null = null;

  constructor(options: DrawingEngineOptions) {
    this.container = options.container;
    this.bgColor = options.backgroundColor ?? "transparent";
    this.dpr = window.devicePixelRatio || 1;
    this.width = options.width ?? this.container.clientWidth;
    this.height = options.height ?? this.container.clientHeight;

    // Merge brush defaults
    this.brush = { ...DEFAULT_BRUSH, ...options.brush };

    // Create the main output canvas
    this.canvas = document.createElement("canvas");
    this.canvas.style.display = "block";
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.canvas.style.cursor = "crosshair";
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.container.appendChild(this.canvas);

    // Initialise sub-systems
    this.strokeStore = new StrokeStore();
    this.layerManager = new LayerManager(this.width, this.height, this.dpr);
    this.historyManager = new HistoryManager();
    this.renderer = new Renderer(
      this.canvas,
      this.layerManager,
      this.strokeStore,
      this.dpr,
      this.bgColor
    );

    // Create first layer
    const firstLayer = this.layerManager.addLayer("Layer 1");
    this.activeLayerId = firstLayer.id;

    // Wire up history change events
    this.historyManager.onChange = () => {
      this.emit("historyChange");
    };

    // Input handling
    this.inputHandler = new InputHandler(this.canvas, {
      onPointerDown: this.onStrokeStart,
      onPointerMove: this.onStrokeMove,
      onPointerUp: this.onStrokeEnd,
      onPointerCancel: this.onStrokeCancel,
    });

    // Auto-resize
    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(this.container);

    // Auto-start unless disabled
    if (options.autoStart !== false) {
      this.start();
    }
  }

  // ===== Lifecycle =====

  /** Start the rendering loop */
  start(): void {
    if (this.started) return;
    this.started = true;
    this.renderer.start();
  }

  /** Stop the rendering loop (engine can be restarted) */
  stop(): void {
    this.started = false;
    this.renderer.stop();
  }

  /** Fully tear down the engine and free resources */
  destroy(): void {
    this.stop();
    this.inputHandler.destroy();
    this.renderer.destroy();
    this.layerManager.destroy();
    this.resizeObserver?.disconnect();
    this.canvas.remove();
    this.listeners.clear();
  }

  // ===== Brush API =====

  /** Get current brush settings (copy) */
  getBrush(): BrushSettings {
    return { ...this.brush };
  }

  /** Update brush settings (partial merge) */
  setBrush(settings: Partial<BrushSettings>): void {
    this.brush = { ...this.brush, ...settings };
    this.emit("brushChange", this.brush);
  }

  /** Shorthand: switch brush type */
  setBrushType(type: BrushType): void {
    this.setBrush({ type });
  }

  /** Shorthand: set brush size */
  setBrushSize(size: number): void {
    this.setBrush({ size: Math.max(1, size) });
  }

  /** Shorthand: set brush color */
  setBrushColor(color: string): void {
    this.setBrush({ color });
  }

  /** Shorthand: set brush opacity */
  setBrushOpacity(opacity: number): void {
    this.setBrush({ opacity: Math.max(0, Math.min(1, opacity)) });
  }

  // ===== Stroke Callbacks (wired to InputHandler) =====

  private onStrokeStart = (point: DrawPoint): void => {
    const id = this.strokeStore.beginStroke(this.activeLayerId, point, this.brush);
    this.activeStrokeId = id;
    this.renderer.setActiveStroke(id);
    this.renderer.markDirty();
    this.emit("strokeStart", { strokeId: id });
  };

  private onStrokeMove = (point: DrawPoint): void => {
    if (!this.activeStrokeId) return;
    this.strokeStore.addPoint(this.activeStrokeId, point);
    this.renderer.markDirty();
    this.emit("strokeUpdate", { strokeId: this.activeStrokeId });
  };

  private onStrokeEnd = (_point: DrawPoint): void => {
    if (!this.activeStrokeId) return;
    const completed = this.strokeStore.finishStroke(this.activeStrokeId);
    this.renderer.setActiveStroke(null);
    this.renderer.markDirty();

    if (completed) {
      // Push to undo stack
      const command: HistoryCommand = {
        type: "addStroke",
        data: completed,
        undoData: completed.id,
      };
      this.historyManager.push(command);
    }

    this.emit("strokeEnd", { strokeId: this.activeStrokeId, stroke: completed });
    this.activeStrokeId = null;
  };

  private onStrokeCancel = (): void => {
    if (!this.activeStrokeId) {
      return;
    }
    // Remove the partial stroke
    this.strokeStore.removeStroke(this.activeStrokeId);
    this.renderer.setActiveStroke(null);
    this.renderer.markDirty();
    this.activeStrokeId = null;
  };

  // ===== Undo / Redo =====

  undo(): void {
    const command = this.historyManager.undo();
    if (!command) return;
    this.applyUndo(command);
    this.renderer.markDirty();
  }

  redo(): void {
    const command = this.historyManager.redo();
    if (!command) return;
    this.applyRedo(command);
    this.renderer.markDirty();
  }

  get canUndo(): boolean {
    return this.historyManager.canUndo;
  }

  get canRedo(): boolean {
    return this.historyManager.canRedo;
  }

  private applyUndo(command: HistoryCommand): void {
    switch (command.type) {
      case "addStroke": {
        const strokeId = command.undoData as string;
        this.strokeStore.removeStroke(strokeId);
        break;
      }
      case "removeStroke": {
        const stroke = command.undoData as Stroke;
        this.strokeStore.addStroke(stroke);
        break;
      }
      case "clear": {
        const strokes = command.undoData as Stroke[];
        for (const s of strokes) {
          this.strokeStore.addStroke(s);
        }
        break;
      }
      case "addLayer": {
        const layerId = command.undoData as string;
        this.layerManager.removeLayer(layerId);
        if (this.activeLayerId === layerId) {
          const layers = this.layerManager.getLayers();
          this.activeLayerId = layers.length > 0 ? layers[layers.length - 1].id : "";
        }
        this.emit("layerChange");
        break;
      }
      case "removeLayer": {
        const layerData = command.undoData as { layer: Layer; strokes: Stroke[] };
        const restored = this.layerManager.addLayer(layerData.layer.name);
        // Transfer properties
        this.layerManager.setVisibility(restored.id, layerData.layer.visible);
        this.layerManager.setOpacity(restored.id, layerData.layer.opacity);
        // Re-add strokes with updated layer ID mapping
        for (const s of layerData.strokes) {
          this.strokeStore.addStroke({ ...s, layerId: restored.id });
        }
        this.emit("layerChange");
        break;
      }
    }
  }

  private applyRedo(command: HistoryCommand): void {
    switch (command.type) {
      case "addStroke": {
        const stroke = command.data as Stroke;
        this.strokeStore.addStroke(stroke);
        break;
      }
      case "removeStroke": {
        const strokeId = command.data as string;
        this.strokeStore.removeStroke(strokeId);
        break;
      }
      case "clear": {
        const layerId = command.data as string;
        this.strokeStore.clearLayer(layerId);
        break;
      }
      case "addLayer": {
        // Re-add the layer
        const layerName = command.data as string;
        this.layerManager.addLayer(layerName);
        this.emit("layerChange");
        break;
      }
      case "removeLayer": {
        const layerId = command.data as string;
        this.strokeStore.clearLayer(layerId);
        this.layerManager.removeLayer(layerId);
        this.emit("layerChange");
        break;
      }
    }
  }

  // ===== Layer API =====

  /** Add a new layer and return it */
  addLayer(name?: string): Layer {
    const layer = this.layerManager.addLayer(name);

    const command: HistoryCommand = {
      type: "addLayer",
      data: layer.name,
      undoData: layer.id,
    };
    this.historyManager.push(command);

    this.activeLayerId = layer.id;
    this.emit("layerChange");
    return layer;
  }

  /** Remove a layer by ID */
  removeLayer(layerId: string): void {
    if (this.layerManager.count <= 1) return; // Always keep at least one layer

    const layer = this.layerManager.getLayer(layerId);
    if (!layer) return;

    const strokes = this.strokeStore.clearLayer(layerId);
    this.layerManager.removeLayer(layerId);

    const command: HistoryCommand = {
      type: "removeLayer",
      data: layerId,
      undoData: { layer, strokes },
    };
    this.historyManager.push(command);

    // Switch active layer if needed
    if (this.activeLayerId === layerId) {
      const layers = this.layerManager.getLayers();
      this.activeLayerId = layers[layers.length - 1]?.id ?? "";
    }

    this.renderer.markDirty();
    this.emit("layerChange");
  }

  /** Get all layers sorted by order */
  getLayers(): Layer[] {
    return this.layerManager.getLayers();
  }

  /** Get the currently active layer ID */
  getActiveLayerId(): string {
    return this.activeLayerId;
  }

  /** Set the active drawing layer */
  setActiveLayer(layerId: string): void {
    if (this.layerManager.getLayer(layerId)) {
      this.activeLayerId = layerId;
      this.emit("layerChange");
    }
  }

  /** Toggle layer visibility */
  setLayerVisibility(layerId: string, visible: boolean): void {
    this.layerManager.setVisibility(layerId, visible);
    this.renderer.markDirty();
    this.emit("layerChange");
  }

  /** Set layer opacity */
  setLayerOpacity(layerId: string, opacity: number): void {
    this.layerManager.setOpacity(layerId, opacity);
    this.renderer.markDirty();
    this.emit("layerChange");
  }

  /** Set layer name */
  setLayerName(layerId: string, name: string): void {
    this.layerManager.setName(layerId, name);
    this.emit("layerChange");
  }

  /** Reorder a layer */
  moveLayer(layerId: string, newOrder: number): void {
    this.layerManager.moveLayer(layerId, newOrder);
    this.renderer.markDirty();
    this.emit("layerChange");
  }

  // ===== Canvas Operations =====

  /** Clear the active layer (with undo support) */
  clearActiveLayer(): void {
    const strokes = this.strokeStore.clearLayer(this.activeLayerId);
    if (strokes.length === 0) return;

    const command: HistoryCommand = {
      type: "clear",
      data: this.activeLayerId,
      undoData: strokes,
    };
    this.historyManager.push(command);
    this.renderer.markDirty();
  }

  /** Clear all layers (with undo support for each) */
  clearAll(): void {
    const allStrokes = this.strokeStore.clearAll();
    if (allStrokes.length === 0) return;

    const command: HistoryCommand = {
      type: "clear",
      data: this.activeLayerId,
      undoData: allStrokes,
    };
    this.historyManager.push(command);
    this.renderer.markDirty();
  }

  /** Set the background color */
  setBackground(color: string): void {
    this.bgColor = color;
    this.renderer.setBackground(color);
  }

  /** Get the background color */
  getBackground(): string {
    return this.bgColor;
  }

  /** Export the canvas as a data URL */
  toDataURL(type?: string, quality?: number): string {
    return this.renderer.toDataURL(type, quality);
  }

  /** Export the canvas as a Blob */
  toBlob(type?: string, quality?: number): Promise<Blob | null> {
    return this.renderer.toBlob(type, quality);
  }

  /** Get the raw output canvas element (for advanced use) */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /** Get current dimensions */
  getSize(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  // ===== Resize =====

  private handleResize = (entries: ResizeObserverEntry[]): void => {
    const entry = entries[0];
    if (!entry) return;

    const { width, height } = entry.contentRect;
    if (width === this.width && height === this.height) return;

    this.resize(width, height);
  };

  /** Manually resize the canvas */
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.dpr = window.devicePixelRatio || 1;

    // Resize output canvas
    this.canvas.width = width * this.dpr;
    this.canvas.height = height * this.dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    // Resize layer canvases
    this.layerManager.resize(width, height, this.dpr);
    this.renderer.setDpr(this.dpr);
    this.renderer.markDirty();
    this.emit("resize", { width, height });
  }

  // ===== Event System =====

  on(event: EngineEventType, listener: EngineEventListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(listener);
    };
  }

  off(event: EngineEventType, listener: EngineEventListener): void {
    this.listeners.get(event)?.delete(listener);
  }

  private emit(type: EngineEventType, data?: unknown): void {
    const eventListeners = this.listeners.get(type);
    if (!eventListeners) return;
    const event = { type, data };
    for (const listener of eventListeners) {
      listener(event);
    }
  }

  // ===== Stroke Data Access (for animation/export) =====

  /** Get all strokes (useful for serialisation or animation playback) */
  getAllStrokes(): Stroke[] {
    return this.strokeStore.getAllStrokes();
  }

  /** Get strokes for a specific layer */
  getStrokesForLayer(layerId: string): Stroke[] {
    return this.strokeStore.getStrokesForLayer(layerId);
  }

  /** Get the total stroke count */
  get strokeCount(): number {
    return this.strokeStore.count;
  }
}

// ===== Factory Function =====

/**
 * Create and initialise a new DrawingEngine instance.
 *
 * @example
 * ```ts
 * const engine = createDrawingEngine({ container: document.getElementById('canvas-container')! });
 * engine.setBrush({ type: 'pen', size: 6, color: '#000' });
 * // ...
 * engine.destroy();
 * ```
 */
export function createDrawingEngine(options: DrawingEngineOptions): DrawingEngine {
  return new DrawingEngine(options);
}
