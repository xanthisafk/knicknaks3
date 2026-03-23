export type Gap = "0" | "0.5" | "1" | "1.5" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12";
export type Align = "start" | "center" | "end" | "stretch" | "baseline";
export type Justify = "start" | "center" | "end" | "between" | "around" | "evenly";
export type Wrap = "wrap" | "nowrap" | "wrap-reverse";
export type FloatEdge = "top" | "bottom" | "left" | "right";
export type FloatBackground = "blur" | "opaque" | "transparent";

// ─────────────────────────────────────────────
// Gap / align / justify maps
// ─────────────────────────────────────────────

export const gapMap: Record<Gap, string> = {
    "0": "gap-0",
    "0.5": "gap-0.5",
    "1": "gap-1",
    "1.5": "gap-1.5",
    "2": "gap-2",
    "3": "gap-3",
    "4": "gap-4",
    "5": "gap-5",
    "6": "gap-6",
    "8": "gap-8",
    "10": "gap-10",
    "12": "gap-12",
};

export const alignMap: Record<Align, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
};

export const justifyMap: Record<Justify, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
};

export const wrapMap: Record<Wrap, string> = {
    wrap: "flex-wrap",
    nowrap: "flex-nowrap",
    "wrap-reverse": "flex-wrap-reverse",
};

/** Absolute-position classes per edge */
export const edgeClasses: Record<FloatEdge, string> = {
    top: "top-0 left-0 right-0",
    bottom: "bottom-0 left-0 right-0",
    left: "top-0 left-0 bottom-0",
    right: "top-0 right-0 bottom-0",
};

/** Natural flex direction for each edge */
export const edgeOrientation: Record<FloatEdge, "horizontal" | "vertical"> = {
    top: "horizontal",
    bottom: "horizontal",
    left: "vertical",
    right: "vertical",
};

/** Border on the inward-facing side */
export const edgeBorder: Record<FloatEdge, string> = {
    top: "border-b border-(--border-default)",
    bottom: "border-t border-(--border-default)",
    left: "border-r border-(--border-default)",
    right: "border-l border-(--border-default)",
};

export const bgClasses: Record<FloatBackground, string> = {
    blur: "bg-(--surface-default)/80 backdrop-blur-sm",
    opaque: "bg-(--surface-default)",
    transparent: "bg-transparent",
};