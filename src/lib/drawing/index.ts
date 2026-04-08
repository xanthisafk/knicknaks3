// Drawing Engine — barrel exports
export { DrawingEngine, createDrawingEngine } from "./DrawingEngine";
export { BrushEngine } from "./BrushEngine";
export { InputHandler } from "./InputHandler";
export { StrokeStore } from "./StrokeStore";
export { LayerManager } from "./LayerManager";
export { HistoryManager } from "./HistoryManager";
export { Renderer } from "./Renderer";

export type {
  DrawPoint,
  BrushType,
  BrushSettings,
  Stroke,
  Layer,
  CommandType,
  HistoryCommand,
  DrawingEngineOptions,
  EngineEventType,
  EngineEvent,
  EngineEventListener,
} from "./types";
