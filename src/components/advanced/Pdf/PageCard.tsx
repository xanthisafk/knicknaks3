import type { ThumbnailResult } from "@/lib/pdfHelper";
import type { PdfPreviewProps } from "./types";

interface PageCardProps {
    result: ThumbnailResult;
    selected: boolean;
    onClick: (pageNumber: number) => void;
    renderBadge?: PdfPreviewProps["renderBadge"];
    renderOverlay?: PdfPreviewProps["renderOverlay"];
}

export function PageCard({
    result,
    selected,
    onClick,
    renderBadge,
    renderOverlay,
}: PageCardProps) {
    const { pageNumber, dataUrl } = result;

    return (
        <button
            type="button"
            onClick={() => onClick(pageNumber)}
            aria-label={`Page ${pageNumber}${selected ? " (selected)" : ""}`}
            aria-pressed={selected}
            className={[
                "group relative flex flex-col items-center gap-1.5 p-2 w-full",
                "rounded-md border cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)",
                selected
                    ? "border-primary-500 ring-2 ring-primary-500 bg-(--surface-secondary)"
                    : "border-(--border-default) bg-(--surface-secondary) hover:border-(--border-hover)",
            ].join(" ")}
        >
            {/* Thumbnail */}
            <div className="relative w-full overflow-hidden rounded-sm shadow-sm">
                <img
                    src={dataUrl}
                    alt={`Page ${pageNumber}`}
                    draggable={false}
                    className="w-full h-auto block select-none"
                />

                {/* Full-bleed overlay slot */}
                {renderOverlay && (
                    <div className="absolute inset-0 flex items-end justify-center">
                        {renderOverlay(pageNumber, selected)}
                    </div>
                )}

                {/* Hover tint when no custom overlay */}
                {!renderOverlay && (
                    <div
                        className={[
                            "absolute inset-0 transition-opacity duration-150",
                            "bg-primary-500 opacity-0",
                            selected ? "opacity-10" : "group-hover:opacity-5",
                        ].join(" ")}
                    />
                )}
            </div>

            {/* Badge slot — defaults to plain page number */}
            {renderBadge ? (
                renderBadge(pageNumber, selected)
            ) : (
                <span
                    className={[
                        "text-xs font-medium tabular-nums transition-colors",
                        selected
                            ? "text-primary-500"
                            : "text-(--text-tertiary) group-hover:text-(--text-secondary)",
                    ].join(" ")}
                >
                    {pageNumber}
                </span>
            )}
        </button>
    );
}