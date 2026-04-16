import { getStroke } from "perfect-freehand";
import type { BrushSettings, DrawPoint } from "./types";

/**
 * BrushEngine converts raw DrawPoints + BrushSettings into renderable
 * SVG path data using perfect-freehand for smooth, pressure-sensitive strokes.
 */
export class BrushEngine {
  /**
   * Generate an SVG path `d` attribute from a set of draw points and brush settings.
   * This is the main entry point for turning raw input into a renderable stroke outline.
   */
  static getStrokePath(points: DrawPoint[], brush: BrushSettings): string {
    if (points.length === 0) return "";

    const inputPoints = points.map((p) => [p.x, p.y, p.pressure]);

    const outlinePoints = getStroke(inputPoints, {
      size: brush.size,
      thinning: brush.pressureSensitivity ? 0.5 : 0,
      smoothing: Math.max(0.1, brush.smoothing),
      streamline: Math.max(0.1, brush.smoothing * 0.8),
      // easing for pen-feel
      easing: (t: number) => t,
      start: {
        taper: 0,
        cap: true,
      },
      end: {
        taper: 0,
        cap: true,
      },
      simulatePressure: !brush.pressureSensitivity,
      last: true,
    });

    return BrushEngine.getSvgPathFromStroke(outlinePoints);
  }

  /**
   * Converts the polygon points from perfect-freehand into an SVG path string
   * using quadratic bezier curves for smooth outlines.
   */
  private static getSvgPathFromStroke(stroke: number[][]): string {
    if (stroke.length === 0) return "";

    const d: string[] = [];
    const [first, ...rest] = stroke;

    d.push(`M ${first[0].toFixed(2)} ${first[1].toFixed(2)}`);

    if (rest.length === 0) return d.join(" ");

    for (let i = 0; i < rest.length; i++) {
      const [x0, y0] = rest[i];
      const [x1, y1] = rest[(i + 1) % rest.length];
      const mx = ((x0 + x1) / 2).toFixed(2);
      const my = ((y0 + y1) / 2).toFixed(2);
      d.push(`Q ${x0.toFixed(2)} ${y0.toFixed(2)} ${mx} ${my}`);
    }

    d.push("Z");
    return d.join(" ");
  }

  /**
   * Returns the correct canvas composite operation for a brush type.
   */
  static getCompositeOperation(brush: BrushSettings): GlobalCompositeOperation {
    switch (brush.type) {
      case "eraser":
        return "destination-out";
      case "soft":
      case "pen":
      default:
        return "source-over";
    }
  }

  /**
   * Returns the effective global alpha for a brush type.
   * Soft brush uses reduced opacity for a watercolour-like effect.
   */
  static getGlobalAlpha(brush: BrushSettings): number {
    switch (brush.type) {
      case "soft":
        return brush.opacity * 0.4;
      case "eraser":
        return 1; // eraser always fully removes
      case "pen":
      default:
        return brush.opacity;
    }
  }
}
