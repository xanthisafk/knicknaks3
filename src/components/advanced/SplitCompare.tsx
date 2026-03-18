import { useCallback, useEffect, useRef, useState } from "react";
import { Label } from "../ui";
import { cn } from "@/lib";
import { ArrowLeftRightIcon } from "lucide-react";

export type SplitCompareProps = {
    leftImage: string;
    rightImage: string;
    leftLabel?: string;
    rightLabel?: string;
    className?: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Load an image and resolve its natural dimensions. */
function getNaturalSize(src: string): Promise<{ w: number; h: number }> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
        img.onerror = () => resolve({ w: 16, h: 9 }); // safe fallback
        img.src = src;
    });
}

/**
 * Given the natural sizes of two images, return the aspect ratio (w/h) that
 * best contains both without letterboxing either one more than necessary.
 * Strategy: pick the ratio whose area-weighted "waste" is minimised, which in
 * practice means we pick the wider ratio so both images always fill the width
 * and the taller image determines the height.
 */
function bestAspectRatio(
    a: { w: number; h: number },
    b: { w: number; h: number }
): number {
    // Normalise both to width=1 and find the max height
    const hA = a.h / a.w;
    const hB = b.h / b.w;
    const maxH = Math.max(hA, hB);
    // Clamp to a sensible range so the viewer doesn't become a thin strip
    const ratio = 1 / maxH;
    return Math.max(0.5, Math.min(3, ratio)); // between 1:2 and 3:1
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SplitCompare({
    leftImage,
    rightImage,
    leftLabel,
    rightLabel,
    className = "",
}: SplitCompareProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const leftImgRef = useRef<HTMLImageElement>(null);
    const rightImgRef = useRef<HTMLImageElement>(null);

    // Separate RAF handles so drag and pan never clobber each other
    const dragRafRef = useRef<number | null>(null);
    const panRafRef = useRef<number | null>(null);

    const [splitPos, setSplitPos] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    // Aspect ratio stored as a CSS string e.g. "16 / 9"
    const [aspectRatio, setAspectRatio] = useState("16 / 9");

    // Zoom + pan live in refs so they can be applied directly to the DOM
    // without triggering React re-renders on every pointer/wheel event.
    const zoomRef = useRef(1);
    const panRef = useRef({ x: 0, y: 0 });
    const [zoomDisplay, setZoomDisplay] = useState(1); // only for the % badge

    // ---------------------------------------------------------------------------
    // Runtime aspect-ratio detection
    // ---------------------------------------------------------------------------
    useEffect(() => {
        let cancelled = false;
        Promise.all([getNaturalSize(leftImage), getNaturalSize(rightImage)]).then(
            ([a, b]) => {
                if (cancelled) return;
                const ratio = bestAspectRatio(a, b);
                // Express as a clean fraction string for CSS
                // Use 100 as base width so we get integer-ish numbers
                const w = 100;
                const h = Math.round((100 / ratio) * 10) / 10;
                setAspectRatio(`${w} / ${h}`);
            }
        );
        return () => { cancelled = true; };
    }, [leftImage, rightImage]);

    // ---------------------------------------------------------------------------
    // Apply zoom + pan directly to DOM (bypasses React render cycle entirely)
    // ---------------------------------------------------------------------------
    const applyTransform = useCallback(() => {
        const z = zoomRef.current;
        const { x, y } = panRef.current;
        const transform = `scale(${z}) translate(${x / z}%, ${y / z}%)`;
        if (leftImgRef.current) leftImgRef.current.style.transform = transform;
        if (rightImgRef.current) rightImgRef.current.style.transform = transform;
    }, []);

    // ---------------------------------------------------------------------------
    // Clamp pan to zoomed bounds (pure, no state reads)
    // ---------------------------------------------------------------------------
    const clampPan = useCallback(
        (pan: { x: number; y: number }, zoom: number) => {
            const maxOffset = ((zoom - 1) / 2) * 100;
            return {
                x: Math.max(-maxOffset, Math.min(maxOffset, pan.x)),
                y: Math.max(-maxOffset, Math.min(maxOffset, pan.y)),
            };
        },
        []
    );

    // ---------------------------------------------------------------------------
    // Split-line position helpers
    // ---------------------------------------------------------------------------
    const getSplitFromClientX = useCallback((clientX: number) => {
        if (!containerRef.current) return 50;
        const rect = containerRef.current.getBoundingClientRect();
        return Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    }, []);

    // Is the pointer near the current divider?
    const isNearDivider = useCallback(
        (clientX: number) => {
            const pct = getSplitFromClientX(clientX);
            return Math.abs(pct - splitPos) < 4;
        },
        [getSplitFromClientX, splitPos]
    );

    // ---------------------------------------------------------------------------
    // Drag: move the split line
    // ---------------------------------------------------------------------------
    const onMouseDownDivider = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const onTouchStartDivider = useCallback((e: React.TouchEvent) => {
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    // Container mouse-down: start drag only if near divider, else start pan
    const panStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

    const onContainerMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (isNearDivider(e.clientX)) {
                e.preventDefault();
                setIsDragging(true);
                return;
            }
            if (zoomRef.current <= 1) return;
            e.preventDefault();
            panStart.current = {
                x: e.clientX,
                y: e.clientY,
                px: panRef.current.x,
                py: panRef.current.y,
            };
        },
        [isNearDivider]
    );

    // Drag effect — only active while isDragging
    useEffect(() => {
        if (!isDragging) return;

        const onMove = (e: MouseEvent | TouchEvent) => {
            const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
            if (dragRafRef.current) cancelAnimationFrame(dragRafRef.current);
            dragRafRef.current = requestAnimationFrame(() => {
                setSplitPos(getSplitFromClientX(clientX));
            });
        };
        const onUp = () => setIsDragging(false);

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        window.addEventListener("touchmove", onMove, { passive: true });
        window.addEventListener("touchend", onUp);

        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
            window.removeEventListener("touchmove", onMove);
            window.removeEventListener("touchend", onUp);
            if (dragRafRef.current) cancelAnimationFrame(dragRafRef.current);
        };
    }, [isDragging, getSplitFromClientX]);

    // ---------------------------------------------------------------------------
    // Pan effect — global, but no-ops when panStart is null
    // ---------------------------------------------------------------------------
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!panStart.current || !containerRef.current) return;
            if (panRafRef.current) cancelAnimationFrame(panRafRef.current);
            panRafRef.current = requestAnimationFrame(() => {
                if (!panStart.current || !containerRef.current) return;
                const rect = containerRef.current.getBoundingClientRect();
                const dx = ((e.clientX - panStart.current.x) / rect.width) * 100;
                const dy = ((e.clientY - panStart.current.y) / rect.height) * 100;
                panRef.current = clampPan(
                    { x: panStart.current.px + dx, y: panStart.current.py + dy },
                    zoomRef.current
                );
                applyTransform();
            });
        };
        const onUp = () => { panStart.current = null; };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
            if (panRafRef.current) cancelAnimationFrame(panRafRef.current);
        };
    }, [clampPan, applyTransform]); // stable refs — registers once

    // ---------------------------------------------------------------------------
    // Scroll to zoom — reads/writes refs, updates display badge via state
    // ---------------------------------------------------------------------------
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            const next = Math.max(1, Math.min(5, zoomRef.current + delta));
            zoomRef.current = next;
            if (next === 1) {
                panRef.current = { x: 0, y: 0 };
            } else {
                panRef.current = clampPan(panRef.current, next);
            }
            applyTransform();
            setZoomDisplay(next); // triggers re-render only for the badge
        };

        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [clampPan, applyTransform]);

    // ---------------------------------------------------------------------------
    // Cursor logic (derived, no extra state)
    // ---------------------------------------------------------------------------
    const cursor = isDragging
        ? "col-resize"
        : zoomRef.current > 1
            ? panStart.current
                ? "grabbing"
                : "grab"
            : "default";

    const showLabels = !!(leftLabel && rightLabel);

    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------
    return (
        <div
            className={`relative w-full overflow-hidden rounded-lg select-none bg-(--surface-primary) border border-(--border-default) ${className}`}
            ref={containerRef}
            onMouseDown={onContainerMouseDown}
            style={{ aspectRatio, cursor }}
        >
            {/* ── Left image ── */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img
                    ref={leftImgRef}
                    src={leftImage}
                    alt={leftLabel ?? "Left image"}
                    draggable={false}
                    decoding="async"
                    style={{
                        transformOrigin: "center center",
                        willChange: "transform",
                    }}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* ── Right image (clipped) ── */}
            <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 0 0 ${splitPos}%)` }}
            >
                <img
                    ref={rightImgRef}
                    src={rightImage}
                    alt={rightLabel ?? "Right image"}
                    draggable={false}
                    decoding="async"
                    style={{
                        transformOrigin: "center center",
                        willChange: "transform",
                    }}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* ── Labels ── */}
            {showLabels && (
                <>
                    {leftLabel && (
                        <div
                            className={cn(
                                "absolute top-3 left-3 z-20 pointer-events-none",
                                "bg-(--surface-elevated)",
                                "text-(--text-primary)",
                                "px-2 py-1 rounded",
                                "shadow-sm font-mono",
                                "overflow-hidden"
                            )}
                        >
                            <Label>
                                {leftLabel}
                            </Label>
                        </div>
                    )}
                    {rightLabel && (
                        <div
                            className={cn(
                                "absolute top-3 right-3 z-20 pointer-events-none",
                                "bg-(--surface-elevated)",
                                "text-(--text-primary)",
                                "px-2 py-1 rounded",
                                "shadow-sm font-mono",
                                "overflow-hidden"
                            )}
                        >
                            <Label>{rightLabel}</Label>
                        </div>
                    )}
                </>
            )}

            {/* ── Divider line ── */}
            <div
                className="absolute top-0 bottom-0 z-10"
                style={{
                    left: `calc(${splitPos}% - 1px)`,
                    width: 2,
                    background: "white",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.18)",
                    pointerEvents: "none",
                }}
            />

            {/* ── Drag handle ── */}
            <div
                className="absolute top-1/2 z-20 -translate-y-1/2 flex items-center justify-center"
                style={{
                    left: `calc(${splitPos}% - 20px)`,
                    width: 40,
                    height: 40,
                    cursor: "col-resize",
                    touchAction: "none",
                }}
                onMouseDown={onMouseDownDivider}
                onTouchStart={onTouchStartDivider}
            >
                <div
                    className={cn(
                        "flex items-center justify-center rounded-full",
                        "bg-(--surface-elevated)",
                        "border-(--border-color)",
                        "text-(--text-secondary)",
                        "w-[36px] h-[36px]"
                    )}
                >
                    <ArrowLeftRightIcon />
                </div>
            </div>

            {/* ── Zoom badge ── */}
            {zoomDisplay > 1 && (
                <div
                    className={cn(
                        "absolute bottom-3 right-3 z-20 pointer-events-none text-xs px-2 py-1 rounded",
                        "bg-(--surface-elevated)"
                    )}
                >
                    {Math.round(zoomDisplay * 100)}%
                </div>
            )}
        </div>
    );
}