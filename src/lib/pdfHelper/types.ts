export interface ThumbnailOptions {
  /** Render scale relative to the native PDF page size. Default: 0.25 */
  scale?: number;
  /** Output image format. Default: "image/jpeg" */
  format?: "image/jpeg" | "image/png" | "image/webp";
  /** JPEG/WebP quality 0-1. Default: 0.85 */
  quality?: number;
  /** Signal to abort an in-progress render pass. */
  signal?: AbortSignal;
}

export interface ThumbnailResult {
  /** 1-based page number */
  pageNumber: number;
  /** Data URL for the rendered thumbnail */
  dataUrl: string;
  /** Rendered width in CSS pixels */
  width: number;
  /** Rendered height in CSS pixels */
  height: number;
}

export interface ParsedPageSelection {
  /** Zero-based indices, sorted ascending */
  indices: number[];
  /** 1-based page numbers, sorted ascending */
  pageNumbers: number[];
}

export interface DownloadOptions {
  /** Override the suggested filename. */
  filename?: string;
  /** MIME type for the Blob. Default: "application/pdf" */
  mimeType?: string;
}

type PageSelector = (totalPages: number) => number[];

export const QuickSelect: {
  key: string;
  label: string;
  select: PageSelector;
}[] = [
    {
      key: "all",
      label: "All",
      select: (total) => Array.from({ length: total }, (_, i) => i + 1),
    },
    {
      key: "allbutcover",
      label: "All but first",
      select: (total) => Array.from({ length: total - 1 }, (_, i) => i + 2),
    },
    {
      key: "allbutlast",
      label: "All but last",
      select: (total) => Array.from({ length: total - 1 }, (_, i) => i + 1),
    },
    // {
    //   key: "allbutcoverandlast",
    //   label: "All but first and last",
    //   select: (total) => Array.from({ length: total - 2 }, (_, i) => i + 2),
    // },
    {
      key: "odd",
      label: "Odd pages",
      select: (total) =>
        Array.from({ length: total }, (_, i) => i + 1).filter((p) => p % 2),
    },
    {
      key: "even",
      label: "Even pages",
      select: (total) =>
        Array.from({ length: total }, (_, i) => i + 1).filter((p) => p % 2 === 0),
    },
    {
      key: "firsthalf",
      label: "First half",
      select: (total) =>
        Array.from({ length: Math.floor(total / 2) }, (_, i) => i + 1),
    },
    {
      key: "secondhalf",
      label: "Second half",
      select: (total) =>
        Array.from(
          { length: total - Math.floor(total / 2) },
          (_, i) => i + Math.floor(total / 2) + 1
        ),
    },
    // {
    //   key: "coveronly",
    //   label: "Only first page",
    //   select: () => [1],
    // },
    // {
    //   key: "lastonly",
    //   label: "Only last page",
    //   select: (total) => [total],
    // },
    {
      key: "coverandlast",
      label: "First and last page",
      select: (total) => (total > 1 ? [1, total] : [1]),
    },
    // {
    //   key: "everythird",
    //   label: "Every third page",
    //   select: (total) =>
    //     Array.from({ length: total }, (_, i) => i + 1).filter((_, i) => i % 3 === 0),
    // },
  ];