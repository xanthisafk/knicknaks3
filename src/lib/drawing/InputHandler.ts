import type { DrawPoint } from "./types";

/**
 * Translates raw Pointer Events into normalized DrawPoints.
 * Handles mouse, touch, and pen input uniformly.
 */

export type InputCallback = (point: DrawPoint) => void;

export interface InputHandlerCallbacks {
  onPointerDown: InputCallback;
  onPointerMove: InputCallback;
  onPointerUp: InputCallback;
  onPointerCancel: () => void;
}

export class InputHandler {
  private target: HTMLElement;
  private callbacks: InputHandlerCallbacks;
  private isDrawing = false;
  private activePointerId: number | null = null;

  // Bound handlers for cleanup
  private handleDown: (e: PointerEvent) => void;
  private handleMove: (e: PointerEvent) => void;
  private handleUp: (e: PointerEvent) => void;
  private handleCancel: (e: PointerEvent) => void;
  private handleContextMenu: (e: Event) => void;

  constructor(target: HTMLElement, callbacks: InputHandlerCallbacks) {
    this.target = target;
    this.callbacks = callbacks;

    this.handleDown = this.onDown.bind(this);
    this.handleMove = this.onMove.bind(this);
    this.handleUp = this.onUp.bind(this);
    this.handleCancel = this.onCancel.bind(this);
    this.handleContextMenu = (e: Event) => e.preventDefault();

    this.attach();
  }

  private attach(): void {
    const el = this.target;
    // Prevent default touch behaviour (scroll, zoom) on the canvas
    el.style.touchAction = "none";
    el.style.userSelect = "none";
    (el.style as unknown as Record<string, string>)["-webkit-user-select"] = "none";

    el.addEventListener("pointerdown", this.handleDown);
    el.addEventListener("pointermove", this.handleMove);
    el.addEventListener("pointerup", this.handleUp);
    el.addEventListener("pointercancel", this.handleCancel);
    el.addEventListener("contextmenu", this.handleContextMenu);
  }

  /** Convert a PointerEvent into a normalised DrawPoint relative to the target */
  private toPoint(e: PointerEvent): DrawPoint {
    const rect = this.target.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      // Mouse has no pressure → fallback to 0.5
      pressure: e.pointerType === "mouse" ? 0.5 : e.pressure,
      timestamp: e.timeStamp,
    };
  }

  private onDown(e: PointerEvent): void {
    // Only track a single pointer at a time (first finger wins)
    if (this.isDrawing) return;

    // Only accept primary button (left mouse / touch / pen tip)
    if (e.button !== 0) return;

    this.isDrawing = true;
    this.activePointerId = e.pointerId;
    this.target.setPointerCapture(e.pointerId);
    this.callbacks.onPointerDown(this.toPoint(e));
  }

  private onMove(e: PointerEvent): void {
    if (!this.isDrawing || e.pointerId !== this.activePointerId) return;

    // Coalesced events give us higher-resolution input on supported browsers
    const coalesced = e.getCoalescedEvents?.() ?? [e];
    for (const ce of coalesced) {
      this.callbacks.onPointerMove(this.toPoint(ce));
    }
  }

  private onUp(e: PointerEvent): void {
    if (!this.isDrawing || e.pointerId !== this.activePointerId) return;
    this.isDrawing = false;
    this.activePointerId = null;
    this.callbacks.onPointerUp(this.toPoint(e));
  }

  private onCancel(e: PointerEvent): void {
    if (!this.isDrawing || e.pointerId !== this.activePointerId) return;
    this.isDrawing = false;
    this.activePointerId = null;
    this.callbacks.onPointerCancel();
  }

  /** Whether a stroke is currently in progress */
  get drawing(): boolean {
    return this.isDrawing;
  }

  destroy(): void {
    const el = this.target;
    el.removeEventListener("pointerdown", this.handleDown);
    el.removeEventListener("pointermove", this.handleMove);
    el.removeEventListener("pointerup", this.handleUp);
    el.removeEventListener("pointercancel", this.handleCancel);
    el.removeEventListener("contextmenu", this.handleContextMenu);
  }
}
