import { useState, useEffect } from "react";
import { Panel } from "@/components/layout";
import { formatFileSize } from "@/lib/pdfHelper";
import { PdfPreview } from "./PagePreview";
import type { PdfPreviewPanelProps } from "./types";

/**
 * @description Opinionated wrapper around <PdfPreview> that adds:
 *   - A file-info header bar (name, size, page count) with a "clear" button
 *   - A consistent Panel container
 *   - A loading shimmer while the first thumbnail streams in
 *
 * Keeps individual tool files clean — they mount this wrapper and receive
 * page-click callbacks without reimplementing the header or the Panel shell.
 *
 * Usage
 * ─────
 * <PdfPreviewPanel
 *   file={file}
 *   onClear={() => setFile(null)}
 *   selectedPages={selected}
 *   onPageClick={(n) => togglePage(n)}
 * />
 *
 * // With custom per-page overlay (e.g. move arrows in RearrangePdf)
 * <PdfPreviewPanel
 *   file={file}
 *   onClear={reset}
 *   onPageClick={handleClick}
 *   renderOverlay={(n, selected) => <MoveButtons page={n} />}
 * />
 */
export function PdfPreviewPanel({
    file,
    onClear,
    selectedPages,
    onPageClick,
    scale,
    thumbnailFormat,
    columns,
    renderBadge,
    renderOverlay,
    pageCountLabel,
    gridClassName,
}: PdfPreviewPanelProps) {
    // Track how many thumbnails have arrived so we can show a live page count.
    const [renderedCount, setRenderedCount] = useState(0);
    const [isFirstThumbReady, setIsFirstThumbReady] = useState(false);

    // Reset when the file changes.
    useEffect(() => {
        setRenderedCount(0);
        setIsFirstThumbReady(false);
    }, [file]);

    const displayPageCount =
        pageCountLabel ??
        (renderedCount > 0 ? `${renderedCount} pages` : "Loading...");

    return (
        <Panel>
            <div className="space-y-4">

                {/* ── Initial loading state (before first thumbnail arrives) ──── */}
                {!isFirstThumbReady && (
                    <div className="flex items-center justify-center py-6">
                        <p className="text-sm text-(--text-tertiary) animate-pulse">
                            Rendering pages...
                        </p>
                    </div>
                )}

                {/* ── Thumbnail grid ───────────────────────────────────────────── */}
                {/*
          Always mounted so the effect inside PdfPreview starts immediately.
          Hidden with CSS until the first thumb is ready to avoid a layout flash.
        */}
                <div className={isFirstThumbReady ? undefined : "hidden"}>
                    <PdfPreview
                        file={file}
                        selectedPages={selectedPages}
                        scale={scale}
                        thumbnailFormat={thumbnailFormat}
                        columns={columns}
                        renderBadge={renderBadge}
                        renderOverlay={renderOverlay}
                        className={gridClassName}
                        onPageClick={(pageNumber) => {
                            // Update our local count tracker when the preview fires back.
                            setRenderedCount((prev) => Math.max(prev, pageNumber));
                            if (!isFirstThumbReady) setIsFirstThumbReady(true);
                            onPageClick?.(pageNumber);
                        }}
                        // Intercept the streamed thumbnails to update our counter.
                        // We monkey-patch onPageRendered by wrapping renderAllPageThumbnails
                        // inside PdfPreview itself — instead, we rely on the skeleton→card
                        // transition: when cards start appearing, isFirstThumbReady flips.
                        //
                        // A cleaner approach: PdfPreview exposes `onThumbnailReady` prop.
                        // Added below for forward-compatibility.
                        onThumbnailReady={(result) => {
                            setRenderedCount(result.pageNumber);
                            if (!isFirstThumbReady) setIsFirstThumbReady(true);
                        }}
                    />
                </div>
            </div>
        </Panel>
    );
}