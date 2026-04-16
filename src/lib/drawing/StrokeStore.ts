import type { Stroke, DrawPoint, BrushSettings } from "./types";
import { BrushEngine } from "./BrushEngine";

/**
 * Manages the collection of strokes. Each stroke is an immutable record
 * once completed. Provides APIs to add/remove strokes and re-render from data.
 */
export class StrokeStore {
  private strokes: Map<string, Stroke> = new Map();
  private idCounter = 0;

  /** Generate a unique stroke ID */
  private nextId(): string {
    return `stroke-${Date.now()}-${this.idCounter++}`;
  }

  /**
   * Begin a new stroke and return its ID.
   * The stroke is added to the store immediately with the initial point.
   */
  beginStroke(layerId: string, point: DrawPoint, brush: BrushSettings): string {
    const id = this.nextId();
    const stroke: Stroke = {
      id,
      layerId,
      points: [point],
      brush: { ...brush },
      pathData: null,
    };
    this.strokes.set(id, stroke);
    return id;
  }

  /** Append a point to an in-progress stroke */
  addPoint(strokeId: string, point: DrawPoint): void {
    const stroke = this.strokes.get(strokeId);
    if (!stroke) return;
    stroke.points.push(point);
    // Invalidate cached path so it's recomputed on next render
    stroke.pathData = null;
  }

  /**
   * Finalise a stroke: compute and cache the final path data.
   * Returns the completed Stroke or null if not found.
   */
  finishStroke(strokeId: string): Stroke | null {
    const stroke = this.strokes.get(strokeId);
    if (!stroke) return null;
    stroke.pathData = BrushEngine.getStrokePath(stroke.points, stroke.brush);
    return { ...stroke, points: [...stroke.points] };
  }

  /** Get live (or cached) SVG path for a stroke */
  getStrokePath(strokeId: string): string {
    const stroke = this.strokes.get(strokeId);
    if (!stroke) return "";
    if (stroke.pathData) return stroke.pathData;
    return BrushEngine.getStrokePath(stroke.points, stroke.brush);
  }

  /** Add a fully-formed stroke (e.g. during redo) */
  addStroke(stroke: Stroke): void {
    this.strokes.set(stroke.id, { ...stroke });
  }

  /** Remove a stroke by ID. Returns the removed stroke or null. */
  removeStroke(strokeId: string): Stroke | null {
    const stroke = this.strokes.get(strokeId);
    if (!stroke) return null;
    this.strokes.delete(strokeId);
    return stroke;
  }

  /** Get all strokes for a specific layer, ordered by insertion */
  getStrokesForLayer(layerId: string): Stroke[] {
    const result: Stroke[] = [];
    for (const stroke of this.strokes.values()) {
      if (stroke.layerId === layerId) {
        result.push(stroke);
      }
    }
    return result;
  }

  /** Get all strokes across all layers */
  getAllStrokes(): Stroke[] {
    return Array.from(this.strokes.values());
  }

  /** Remove all strokes for a given layer */
  clearLayer(layerId: string): Stroke[] {
    const removed: Stroke[] = [];
    for (const [id, stroke] of this.strokes) {
      if (stroke.layerId === layerId) {
        removed.push(stroke);
        this.strokes.delete(id);
      }
    }
    return removed;
  }

  /** Remove all strokes */
  clearAll(): Stroke[] {
    const all = this.getAllStrokes();
    this.strokes.clear();
    return all;
  }

  /** Get total stroke count */
  get count(): number {
    return this.strokes.size;
  }
}
