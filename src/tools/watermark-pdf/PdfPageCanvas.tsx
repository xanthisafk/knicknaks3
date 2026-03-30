import type { PDFDocumentProxy } from "pdfjs-dist";
import type { WatermarkOpts } from "./types";
import { useEffect, useRef, useState } from "react";

export function PdfPageCanvas({
    pdfDoc,
    pageNum,
    watermark,
}: {
    pdfDoc: PDFDocumentProxy;
    pageNum: number;
    watermark: WatermarkOpts;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 1, height: 1 });

    const PREVIEW_SCALE = 0.7;

    useEffect(() => {
        if (!pdfDoc || !canvasRef.current) return;
        let cancelled = false;
        (async () => {
            const page = await pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: PREVIEW_SCALE });
            const canvas = canvasRef.current!;
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            if (!cancelled) setCanvasSize({ width: viewport.width, height: viewport.height });
            const ctx = canvas.getContext("2d");
            await page.render({ canvasContext: ctx as CanvasRenderingContext2D, canvas, viewport }).promise;
        })();
        return () => { cancelled = true; };
    }, [pdfDoc, pageNum]);
    const overlayStyle: React.CSSProperties = {
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        overflow: "hidden",
    };

    let watermarkEl: React.ReactNode = null;

    if (watermark.mode === "text") {
        // Cap font at 40% of canvas width (same cap used in pdf output)
        const scaledFont = Math.min(
            watermark.fontSize * PREVIEW_SCALE,
            canvasSize.width * 0.4
        );
        watermarkEl = (
            <span
                style={{
                    fontSize: `${scaledFont}px`,
                    opacity: watermark.opacity,
                    transform: `rotate(${-watermark.rotation}deg)`,
                    color: "#808080",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    userSelect: "none",
                    letterSpacing: "0.05em",
                    // Ensure the rotated element pivots around its own center
                    transformOrigin: "center center",
                }}
            >
                {watermark.text || " "}
            </span>
        );
    } else {
        const imgWidth = canvasSize.width * watermark.scale;
        watermarkEl = (
            <img
                src={watermark.src ?? null}
                style={{
                    width: `${imgWidth}px`,
                    opacity: watermark.opacity,
                    transform: `rotate(${-watermark.rotation}deg)`,
                    transformOrigin: "center center",
                    objectFit: "contain",
                    userSelect: "none",
                    pointerEvents: "none",
                }}
                alt="watermark preview"
            />
        );
    }

    return (
        <div className="relative inline-block border border-(--border-default) rounded-md overflow-hidden shadow-md bg-white">
            <canvas
                ref={canvasRef}
                style={{ display: "block", maxWidth: "100%", height: "auto", maxHeight: "55vh" }}
            />
            {/* inset-0 tracks CSS-rendered size, not raw canvas pixel dims */}
            <div aria-hidden="true" style={overlayStyle}>
                {watermarkEl}
            </div>
            <div className="absolute top-1.5 left-2 text-xs font-medium text-(--text-tertiary) bg-white/70 rounded px-1">
                Page {pageNum}
            </div>
        </div>
    );
}