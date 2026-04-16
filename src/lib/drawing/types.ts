// ===== Point & Stroke Data =====

/** A single captured point during drawing */
export interface DrawPoint {
  x: number;
  y: number;
  pressure: number;
  timestamp: number;
}

/** Brush types supported by the engine */
export type BrushType = "pen" | "soft" | "eraser";

/** Configuration for a brush */
export interface BrushSettings {
  type: BrushType;
  /** Brush diameter in CSS pixels (before DPI scaling) */
  size: number;
  /** Base color as CSS color string */
  color: string;
  /** Base opacity 0–1 */
  opacity: number;
  /** Whether pen pressure affects size */
  pressureSensitivity: boolean;
  /** Smoothing amount 0 (none) – 1 (max). Controls perfect-freehand streamline */
  smoothing: number;
}

/** A complete stroke with its associated brush and metadata */
export interface Stroke {
  id: string;
  layerId: string;
  points: DrawPoint[];
  brush: BrushSettings;
  /** Pre-computed SVG path data for cached rendering */
  pathData: string | null;
}

// ===== Layer System =====

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  /** Rendering order (lower = further back) */
  order: number;
}

// ===== History / Commands =====

export type CommandType = "addStroke" | "removeStroke" | "addLayer" | "removeLayer" | "reorderLayers" | "updateLayer" | "clear";

export interface HistoryCommand {
  type: CommandType;
  /** Data needed to apply the command */
  data: unknown;
  /** Data needed to undo the command */
  undoData: unknown;
}

// ===== Engine Configuration =====

export interface DrawingEngineOptions {
  /** The container element the engine will mount into */
  container: HTMLElement;
  /** Initial canvas width in CSS pixels. Defaults to container width */
  width?: number;
  /** Initial canvas height in CSS pixels. Defaults to container height */
  height?: number;
  /** Background color. Defaults to transparent */
  backgroundColor?: string;
  /** Initial brush settings */
  brush?: Partial<BrushSettings>;
  /** Whether to start the render loop immediately. Defaults to true */
  autoStart?: boolean;
}

// ===== Engine Events =====

export type EngineEventType =
  | "strokeStart"
  | "strokeEnd"
  | "strokeUpdate"
  | "historyChange"
  | "layerChange"
  | "brushChange"
  | "resize";

export interface EngineEvent {
  type: EngineEventType;
  data?: unknown;
}

export type EngineEventListener = (event: EngineEvent) => void;
