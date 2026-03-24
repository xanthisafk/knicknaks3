import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";

// ─── types ────────────────────────────────────────────────────────────────────

interface RotWheelProps {
    shift: number;
    size?: number;
}

// ─── theme helper ─────────────────────────────────────────────────────────────

function isDarkMode(): boolean {
    return (
        document.documentElement.getAttribute("data-theme") === "dark" ||
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
}

interface ThemeTokens {
    ringMain: string;
    ringAlt: string;
    ringBorder: string;
    letterColor: string;
    coreColor: string;
    coreBorder: string;
    fgText: string;
    indicator: string;
}

function getTokens(dark: boolean): ThemeTokens {
    return dark
        ? {
            ringMain: "oklch(0.38 0.07 260)",
            ringAlt: "oklch(0.33 0.05 260)",
            ringBorder: "oklch(0.55 0.06 260)",
            letterColor: "oklch(0.95 0.01 65)",
            coreColor: "oklch(0.32 0.04 260)",
            coreBorder: "oklch(0.50 0.06 260)",
            fgText: "oklch(0.95 0.01 65)",
            indicator: "#e05555",
        }
        : {
            ringMain: "oklch(0.42 0.12 265)",
            ringAlt: "oklch(0.36 0.14 265)",
            ringBorder: "oklch(0.55 0.12 260)",
            letterColor: "oklch(1 0 0)",
            coreColor: "oklch(0.38 0.09 265)",
            coreBorder: "oklch(0.55 0.13 260)",
            fgText: "oklch(1 0 0)",
            indicator: "#e05555",
        };
}

// ─── standalone helpers ───────────────────────────────────────────────────────

function drawSlices(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r1: number,
    r2: number,
    c1: string,
    c2: string,
    border: string,
    size: number
) {
    const LETTERS = 26;
    const sliceDeg = 360 / LETTERS;
    for (let i = 0; i < LETTERS; i++) {
        const startAngle = ((i - 0.5) * sliceDeg - 90) * (Math.PI / 180);
        const endAngle = ((i + 0.5) * sliceDeg - 90) * (Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r2, startAngle, endAngle);
        ctx.arc(cx, cy, r1, endAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = i % 2 === 0 ? c1 : c2;
        ctx.fill();
        ctx.strokeStyle = border;
        ctx.lineWidth = size * 0.002;
        ctx.stroke();
    }
}

function drawLettersAt(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    letters: string[],
    fontStyle: string,
    letterColor: string,
) {
    const LETTERS = 26;
    const sliceDeg = 360 / LETTERS;
    ctx.font = fontStyle;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < LETTERS; i++) {
        const angle = (i * sliceDeg - 90) * (Math.PI / 180);
        const lx = cx + radius * Math.cos(angle);
        const ly = cy + radius * Math.sin(angle);
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(angle + Math.PI / 2);
        ctx.fillStyle = letterColor;
        ctx.fillText(letters[i], 0, 0);
        ctx.restore();
    }
}

// ─── single draw function used for both display and download ──────────────────

function drawWheel(
    canvas: HTMLCanvasElement,
    shift: number,
    size: number,
    dark: boolean
): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const outerR = size * 0.46;
    const innerR = size * 0.32;
    const coreR = size * 0.19;
    const tok = getTokens(dark);
    const fontStyle = `bold ${size * 0.038}px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif`;
    const norm = ((shift % 26) + 26) % 26;

    drawSlices(ctx, cx, cy, innerR, outerR, tok.ringMain, tok.ringAlt, tok.ringBorder, size);
    drawSlices(ctx, cx, cy, coreR, innerR, tok.ringAlt, tok.ringMain, tok.ringBorder, size);

    const outerLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
    const innerLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + ((i + norm) % 26)));

    drawLettersAt(ctx, cx, cy, outerR * 0.845, outerLetters, fontStyle, tok.letterColor);
    drawLettersAt(ctx, cx, cy, (innerR + coreR) / 2, innerLetters, fontStyle, tok.letterColor);

    ctx.beginPath();
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
    ctx.fillStyle = tok.coreColor;
    ctx.fill();
    ctx.strokeStyle = tok.coreBorder;
    ctx.lineWidth = size * 0.003;
    ctx.stroke();

    ctx.font = `bold ${size * 0.048}px -apple-system, BlinkMacSystemFont, 'Outfit', sans-serif`;
    ctx.fillStyle = tok.fgText;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`ROT-${shift}`, cx, cy);

    // watermark
    ctx.font = `bold ${size * 0.030}px 'Gloria Hallelujah', cursive`;
    ctx.fillStyle = `oklch(0.55 0.015 50)`;
    ctx.globalAlpha = 0.6;

    const watermarkText = "Knicknaks";
    const offsetY = size * 0.05;

    ctx.fillText(
        watermarkText,
        cx,
        cy + offsetY
    );

    ctx.globalAlpha = 1;

    const triCY = cy - outerR - size * 0.012;
    const ts = size * 0.022;
    ctx.beginPath();
    ctx.moveTo(cx, triCY + ts * 1.4);
    ctx.lineTo(cx - ts * 0.7, triCY - ts * 0.4);
    ctx.lineTo(cx + ts * 0.7, triCY - ts * 0.4);
    ctx.closePath();
    ctx.fillStyle = tok.indicator;
    ctx.fill();
}

// ─── component ────────────────────────────────────────────────────────────────

export type RotWheelHandle = {
    download: () => void;
};

export const RotWheel = forwardRef<RotWheelHandle, RotWheelProps>(
    ({ shift }, ref) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const sizeRef = useRef(0);

        const render = useCallback(() => {
            const canvas = canvasRef.current;
            const size = sizeRef.current;
            if (!canvas || !size) return;

            drawWheel(canvas, shift, size, isDarkMode());
        }, [shift]);

        useEffect(() => {
            const el = containerRef.current;
            if (!el) return;

            const ro = new ResizeObserver(([entry]) => {
                const width = entry.contentRect.width;
                sizeRef.current = width;
                render();
            });

            ro.observe(el);
            return () => ro.disconnect();
        }, [render]);

        useEffect(() => {
            render();
        }, [render]);

        useEffect(() => {
            const mo = new MutationObserver(render);
            mo.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ["data-theme"],
            });

            const mq = window.matchMedia("(prefers-color-scheme: dark)");
            mq.addEventListener("change", render);

            return () => {
                mo.disconnect();
                mq.removeEventListener("change", render);
            };
        }, [render]);

        const handleDownload = useCallback(() => {
            const bigCanvas = document.createElement("canvas");
            drawWheel(bigCanvas, shift, 2000, isDarkMode());

            const link = document.createElement("a");
            link.download = `rot-${shift}-decoder-knicknaks.png`;
            link.href = bigCanvas.toDataURL("image/png");
            link.click();
        }, [shift]);

        useImperativeHandle(ref, () => ({
            download: handleDownload,
        }));

        return (
            <div ref={containerRef} className="w-full aspect-square">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full block"
                />
            </div>
        );
    }
);
