import type { ThumbnailOptions, ThumbnailResult } from "@/lib/pdfHelper";

export interface PdfPreviewProps {
  /** The PDF file to preview. Changing this prop re-renders the grid. */
  file: File;

  /**
   * Set of 1-based page numbers that should appear "selected".
   * The component does not manage this state itself.
   */
  selectedPages?: Set<number>;

  /**
   * Fired when a page card is clicked.
   * @param pageNumber 1-based page number
   */
  onPageClick?: (pageNumber: number) => void;

  /**
   * Render scale passed to the thumbnail renderer. Default: 0.25.
   * Higher values = sharper thumbnails but slower render.
   */
  scale?: number;

  /** Output format for thumbnails. Default: "image/jpeg" */
  thumbnailFormat?: ThumbnailOptions["format"];

  /**
   * Number of columns in the grid.
   * When omitted the grid is responsive (2 → 5 cols depending on viewport).
   */
  columns?: 2 | 3 | 4 | 5 | 6;

  /**
   * Render a custom badge element over each page card (e.g. a page-number
   * label, a delete icon, a checkbox). Receives the 1-based page number and
   * whether the page is currently selected.
   */
  renderBadge?: (pageNumber: number, selected: boolean) => React.ReactNode;

  /**
   * Render a full-bleed overlay on top of each thumbnail (e.g. arrow buttons
   * for reordering). Receives the 1-based page number.
   */
  renderOverlay?: (pageNumber: number, selected: boolean) => React.ReactNode;

  /**
   * Fired each time a single page thumbnail finishes rendering.
   * Useful for parent components that need to track streaming progress
   * (e.g. to update a page-count label or flip a "loading" flag).
   */
  onThumbnailReady?: (result: ThumbnailResult) => void;

  /** Additional class names on the outer wrapper. */
  className?: string;
}

export interface PdfPreviewPanelProps
  extends Omit<PdfPreviewProps, "file" | "className"> {
  /** The PDF file to preview. */
  file: File;

  /**
   * Called when the user clicks the × button to remove the current file.
   * Usually just: `onClear={() => setFile(null)}`
   */
  onClear: () => void;

  /**
   * Label shown next to the file size in the header.
   * Defaults to the actual page count once thumbnails start streaming.
   * Pass your own string to override (e.g. "12 of 20 pages selected").
   */
  pageCountLabel?: string;

  /** Class names forwarded to the inner grid. */
  gridClassName?: string;
}

export const COLUMN_CLASS: Record<number, string> = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
};

export const DEFAULT_GRID_CLASS =
    "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";
