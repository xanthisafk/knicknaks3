import { useState } from "react";

import { renderAllPageThumbnails } from "@/lib/pdfHelper";
import { useCallback, useEffect, useRef } from "react";
import { PageSkeleton } from "./PageSkeleton";
import { PageCard } from "./PageCard";
import type { ThumbnailOptions, ThumbnailResult } from "@/lib/pdfHelper";
import type { PdfPreviewProps } from "./types";
import { COLUMN_CLASS, DEFAULT_GRID_CLASS } from "./types";

export function PdfPreview({
    file,
    selectedPages,
    onPageClick,
    onThumbnailReady,
    scale = 0.25,
    thumbnailFormat = "image/jpeg",
    columns,
    renderBadge,
    renderOverlay,
    className = "",
}: PdfPreviewProps) {
    const [thumbnails, setThumbnails] = useState<ThumbnailResult[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    // Track the current file identity so stale render callbacks can be ignored.
    const activeFileRef = useRef<File | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const handleClick = useCallback(
        (pageNumber: number) => onPageClick?.(pageNumber),
        [onPageClick]
    );

    useEffect(() => {
        if (!file) return;

        // Cancel any previous render pass.
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        activeFileRef.current = file;

        setThumbnails([]);
        setTotalPages(0);
        setError(null);

        const options: ThumbnailOptions = {
            scale,
            format: thumbnailFormat,
            signal: controller.signal,
        };

        renderAllPageThumbnails(
            file,
            options,
            // Stream pages in one-by-one — only update if this file is still active.
            (result) => {
                if (activeFileRef.current !== file) return;
                setThumbnails((prev) => [...prev, result]);
                setTotalPages(result.pageNumber); // grows as pages arrive
                onThumbnailReady?.(result);
            }
        ).catch((err: unknown) => {
            if ((err as DOMException)?.name === "AbortError") return;
            setError(
                err instanceof Error ? err.message : "Failed to render PDF preview."
            );
        });

        return () => {
            controller.abort();
        };
    }, [file, scale, thumbnailFormat]);

    // Build a fast lookup for rendered thumbnails by page number.
    const thumbnailMap = new Map(thumbnails.map((t) => [t.pageNumber, t]));

    // Estimate total pages from first load — we know it once all thumbs arrive.
    // While streaming, use thumbnails.length as a lower-bound placeholder count
    // so skeletons fill the expected grid area.
    const placeholderCount = totalPages || thumbnails.length;

    const gridClass = columns
        ? `grid ${COLUMN_CLASS[columns] ?? DEFAULT_GRID_CLASS}`
        : `grid ${DEFAULT_GRID_CLASS}`;

    if (error) {
        return (
            <div className="flex items-center justify-center py-12 text-sm text-error">
                {error}
            </div>
        );
    }

    return (
        <div className={`${gridClass} gap-3 ${className}`}>
            {Array.from({ length: Math.max(placeholderCount, 1) }, (_, i) => {
                const pageNumber = i + 1;
                const result = thumbnailMap.get(pageNumber);

                if (!result) {
                    return <PageSkeleton key={`skeleton-${pageNumber}`} index={i} />;
                }

                const selected = selectedPages?.has(pageNumber) ?? false;

                return (
                    <PageCard
                        key={`page-${pageNumber}`}
                        result={result}
                        selected={selected}
                        onClick={handleClick}
                        renderBadge={renderBadge}
                        renderOverlay={renderOverlay}
                    />
                );
            })}
        </div>
    );
}