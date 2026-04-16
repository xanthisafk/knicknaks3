import type { HistoryCommand } from "./types";

/**
 * Command-based undo/redo manager. Stores a linear stack of commands
 * with apply/undo callbacks. Branching (new commands after undo) discards
 * the redo tail.
 */
export class HistoryManager {
  private stack: HistoryCommand[] = [];
  private pointer = -1;
  private maxSize: number;

  /** Fired when the undo/redo state changes */
  onChange: (() => void) | null = null;

  constructor(maxSize = 200) {
    this.maxSize = maxSize;
  }

  /**
   * Push a new command onto the stack.
   * Discards any redo history beyond the current pointer.
   */
  push(command: HistoryCommand): void {
    // Discard redo tail
    this.stack = this.stack.slice(0, this.pointer + 1);
    this.stack.push(command);

    // Enforce max size by trimming from the front
    if (this.stack.length > this.maxSize) {
      const excess = this.stack.length - this.maxSize;
      this.stack = this.stack.slice(excess);
    }

    this.pointer = this.stack.length - 1;
    this.onChange?.();
  }

  /** Returns the command to undo, or null if nothing to undo */
  undo(): HistoryCommand | null {
    if (this.pointer < 0) return null;
    const command = this.stack[this.pointer];
    this.pointer--;
    this.onChange?.();
    return command;
  }

  /** Returns the command to redo, or null if nothing to redo */
  redo(): HistoryCommand | null {
    if (this.pointer >= this.stack.length - 1) return null;
    this.pointer++;
    const command = this.stack[this.pointer];
    this.onChange?.();
    return command;
  }

  get canUndo(): boolean {
    return this.pointer >= 0;
  }

  get canRedo(): boolean {
    return this.pointer < this.stack.length - 1;
  }

  /** Current number of commands in the stack */
  get size(): number {
    return this.stack.length;
  }

  /** Clear all history */
  clear(): void {
    this.stack = [];
    this.pointer = -1;
    this.onChange?.();
  }
}
