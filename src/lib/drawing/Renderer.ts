import type { Stroke, BrushSettings } from "./types";
import { BrushEngine } from "./BrushEngine";
import type { LayerManager } from "./LayerManager";
import type { StrokeStore } from "./StrokeStore";

/**
 * Renderer composites all visible layers onto the main output canvas
 * using requestAnimationFrame. It only redraws when flagged dirty.
 */
export class Renderer {
  private outputCanvas: HTMLCanvasElement;
  private outputCtx: CanvasRenderingContext2D;
  private layerManager: LayerManager;
  private strokeStore: StrokeStore;
  private rafId: number | null = null;
  private dirty = true;
  private running = false;
  private dpr: number;
  private bgColor: string;

  /** The stroke currently being drawn (live preview) */
  private activeStrokeId: string | null = null;

  constructor(
    outputCanvas: HTMLCanvasElement,
    layerManager: LayerManager,
    strokeStore: StrokeStore,
    dpr: number,
    bgColor: string
  ) {
    this.outputCanvas = outputCanvas;
    this.outputCtx = outputCanvas.getContext("2d")!;
    this.layerManager = layerManager;
    this.strokeStore = strokeStore;
    this.dpr = dpr;
    this.bgColor = bgColor;
  }

  /** Mark the canvas as needing a redraw */
  markDirty(): void {
    this.dirty = true;
  }

  /** Set the currently-active (drawing) stroke for live preview */
  setActiveStroke(strokeId: string | null): void {
    this.activeStrokeId = strokeId;
  }

  /** Update DPI (after resize) */
  setDpr(dpr: number): void {
    this.dpr = dpr;
  }

  /** Set background color */
  setBackground(color: string): void {
    this.bgColor = color;
    this.markDirty();
  }

  /** Start the render loop */
  start(): void {
    if (this.running) return;
    this.running = true;
    this.loop();
  }

  /** Stop the render loop */
  stop(): void {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private loop = (): void => {
    if (!this.running) return;

    if (this.dirty || this.activeStrokeId) {
      this.render();
      this.dirty = false;
    }

    this.rafId = requestAnimationFrame(this.loop);
  };

  /**
   * Full render pass:
   * 1. Clear output canvas
   * 2. Draw background
   * 3. For each visible layer (back to front):
   *    a. Clear the layer canvas
   *    b. Re-render all strokes for that layer
   *    c. Composite the layer onto the output canvas
   */
  private render(): void {
    const ctx = this.outputCtx;
    const w = this.outputCanvas.width;
    const h = this.outputCanvas.height;

    // 1. Clear
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // 2. Background
    if (this.bgColor && this.bgColor !== "transparent") {
      ctx.fillStyle = this.bgColor;
      ctx.fillRect(0, 0, w, h);
    }

    // 3. Composite layers
    const layers = this.layerManager.getLayers();
    for (const layer of layers) {
      if (!layer.visible) continue;

      // Render strokes onto the layer canvas
      const layerCtx = this.layerManager.getContext(layer.id);
      if (!layerCtx) continue;

      this.layerManager.clearLayerCanvas(layer.id);

      const strokes = this.strokeStore.getStrokesForLayer(layer.id);
      for (const stroke of strokes) {
        this.renderStrokeToContext(stroke, layerCtx);
      }

      // Composite layer onto output
      const layerCanvas = this.layerManager.getCanvas(layer.id)!;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = layer.opacity;
      ctx.drawImage(layerCanvas, 0, 0);
      ctx.restore();
    }
  }

  /** Render a single stroke onto a canvas context */
  private renderStrokeToContext(stroke: Stroke, ctx: CanvasRenderingContext2D): void {
    const pathStr = stroke.pathData ?? BrushEngine.getStrokePath(stroke.points, stroke.brush);
    if (!pathStr) return;

    const path = new Path2D(pathStr);

    ctx.save();
    ctx.globalCompositeOperation = BrushEngine.getCompositeOperation(stroke.brush);
    ctx.globalAlpha = BrushEngine.getGlobalAlpha(stroke.brush);
    ctx.fillStyle = stroke.brush.color;
    ctx.fill(path);
    ctx.restore();
  }

  /**
   * Render the full scene once (non-loop, synchronous).
   * Useful for exporting or thumbnail generation.
   */
  renderOnce(): void {
    this.render();
  }

  /**
   * Export the current canvas content as a data URL.
   */
  toDataURL(type = "image/png", quality?: number): string {
    this.renderOnce();
    return this.outputCanvas.toDataURL(type, quality);
  }

  /**
   * Export the current canvas as a Blob.
   */
  toBlob(type = "image/png", quality?: number): Promise<Blob | null> {
    this.renderOnce();
    return new Promise((resolve) => {
      this.outputCanvas.toBlob(resolve, type, quality);
    });
  }

  destroy(): void {
    this.stop();
  }
}
