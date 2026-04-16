import type { Layer } from "./types";

/**
 * Manages drawing layers. Each layer has its own offscreen canvas.
 * The LayerManager handles creation, deletion, reordering, and visibility.
 */
export class LayerManager {
  private layers: Map<string, Layer> = new Map();
  private canvases: Map<string, HTMLCanvasElement> = new Map();
  private contexts: Map<string, CanvasRenderingContext2D> = new Map();
  private idCounter = 0;
  private canvasWidth: number;
  private canvasHeight: number;
  private dpr: number;

  constructor(width: number, height: number, dpr: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.dpr = dpr;
  }

  /** Generate a unique layer ID */
  private nextId(): string {
    return `layer-${Date.now()}-${this.idCounter++}`;
  }

  /** Create an offscreen canvas sized to match the drawing surface */
  private createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = this.canvasWidth * this.dpr;
    canvas.height = this.canvasHeight * this.dpr;
    canvas.style.width = `${this.canvasWidth}px`;
    canvas.style.height = `${this.canvasHeight}px`;
    return canvas;
  }

  /**
   * Add a new layer. Returns the new Layer object.
   * @param name - Optional display name
   */
  addLayer(name?: string): Layer {
    const id = this.nextId();
    const order = this.layers.size;
    const layer: Layer = {
      id,
      name: name ?? `Layer ${order + 1}`,
      visible: true,
      opacity: 1,
      order,
    };

    this.layers.set(id, layer);

    const canvas = this.createCanvas();
    this.canvases.set(id, canvas);

    const ctx = canvas.getContext("2d")!;
    ctx.scale(this.dpr, this.dpr);
    this.contexts.set(id, ctx);

    return { ...layer };
  }

  /** Remove a layer and its associated canvas */
  removeLayer(layerId: string): Layer | null {
    const layer = this.layers.get(layerId);
    if (!layer) return null;

    this.layers.delete(layerId);
    this.canvases.delete(layerId);
    this.contexts.delete(layerId);

    // Recompute order for remaining layers
    this.recomputeOrder();

    return layer;
  }

  /** Get a layer by ID */
  getLayer(layerId: string): Layer | null {
    return this.layers.get(layerId) ?? null;
  }

  /** Get the canvas for a layer */
  getCanvas(layerId: string): HTMLCanvasElement | null {
    return this.canvases.get(layerId) ?? null;
  }

  /** Get the 2D context for a layer */
  getContext(layerId: string): CanvasRenderingContext2D | null {
    return this.contexts.get(layerId) ?? null;
  }

  /** Get all layers sorted by order (back to front) */
  getLayers(): Layer[] {
    return Array.from(this.layers.values()).sort((a, b) => a.order - b.order);
  }

  /** Toggle a layer's visibility */
  setVisibility(layerId: string, visible: boolean): void {
    const layer = this.layers.get(layerId);
    if (layer) layer.visible = visible;
  }

  /** Set a layer's opacity */
  setOpacity(layerId: string, opacity: number): void {
    const layer = this.layers.get(layerId);
    if (layer) layer.opacity = Math.max(0, Math.min(1, opacity));
  }

  /** Set a layer's name */
  setName(layerId: string, name: string): void {
    const layer = this.layers.get(layerId);
    if (layer) layer.name = name;
  }

  /** Move a layer to a new order position */
  moveLayer(layerId: string, newOrder: number): void {
    const layers = this.getLayers();
    const idx = layers.findIndex((l) => l.id === layerId);
    if (idx === -1) return;

    const clamped = Math.max(0, Math.min(layers.length - 1, newOrder));
    const [moved] = layers.splice(idx, 1);
    layers.splice(clamped, 0, moved);

    // Reassign order values
    layers.forEach((l, i) => {
      l.order = i;
    });
  }

  private recomputeOrder(): void {
    const sorted = this.getLayers();
    sorted.forEach((l, i) => {
      l.order = i;
    });
  }

  /** Resize all layer canvases. DOES NOT preserve content — caller must re-render strokes. */
  resize(width: number, height: number, dpr: number): void {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.dpr = dpr;

    for (const [id, canvas] of this.canvases) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = this.contexts.get(id)!;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
  }

  /** Clear a single layer's canvas */
  clearLayerCanvas(layerId: string): void {
    const ctx = this.contexts.get(layerId);
    if (!ctx) return;
    const canvas = this.canvases.get(layerId)!;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  /** Clear all layer canvases */
  clearAll(): void {
    for (const id of this.canvases.keys()) {
      this.clearLayerCanvas(id);
    }
  }

  get count(): number {
    return this.layers.size;
  }

  destroy(): void {
    this.layers.clear();
    this.canvases.clear();
    this.contexts.clear();
  }
}
