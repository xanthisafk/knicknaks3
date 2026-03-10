import type { DownloadOptions } from "./types";

/**
 * Triggers a browser download for a PDF byte array.
 *
 * @param bytes    Raw PDF bytes (from pdf-lib's `.save()`)
 * @param filename Suggested filename for the download
 * @param options  Optional overrides
 */
export function downloadPdf(
  bytes: Uint8Array,
  filename: string,
  options: DownloadOptions = {}
): void {
  const { mimeType = "application/pdf" } = options;
  const blob = new Blob([bytes as unknown as ArrayBuffer], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = options.filename ?? filename;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  // Revoke after a tick to ensure the download starts.
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Creates an object URL for a PDF byte array and returns both the URL
 * and a cleanup function. Use when you need to display a PDF in an
 * `<iframe>` or `<embed>` rather than download it.
 *
 * @example
 * const { url, revoke } = createPdfObjectUrl(bytes);
 * // later:
 * revoke();
 */
export function createPdfObjectUrl(bytes: Uint8Array): {
  url: string;
  revoke: () => void;
} {
  const blob = new Blob([bytes as unknown as ArrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  return { url, revoke: () => URL.revokeObjectURL(url) };
}
