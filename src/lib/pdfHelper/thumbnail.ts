import type { ThumbnailOptions, ThumbnailResult } from "./types";
import { readFileAsArrayBuffer } from "./files";

let _pdfjs: typeof import("pdfjs-dist") | null = null;

async function getPdfJs() {
  if (_pdfjs) return _pdfjs;

  const pdfjs = await import("pdfjs-dist");

  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    // Import the worker directly — no CDN needed.
    // Vite/Astro will bundle it and return a resolved URL.
    const workerUrl = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    );
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl.toString();
  }

  _pdfjs = pdfjs;
  return pdfjs;
}

/**
 * Renders every page of a PDF file into thumbnail data URLs.
 *
 * Emits pages one-by-one via `onPageRendered` so the UI can show progress
 * before the full document is done.
 *
 * @param file            The PDF File object
 * @param options         Rendering options
 * @param onPageRendered  Optional callback fired after each page is rendered
 * @returns Array of ThumbnailResult, one per page, in page order
 *
 * @example
 * const thumbs = await renderAllPageThumbnails(file, { scale: 0.3 }, (r) => {
 *   setThumbnails((prev) => [...prev, r]);
 * });
 */
export async function renderAllPageThumbnails(
  file: File,
  options: ThumbnailOptions = {},
  onPageRendered?: (result: ThumbnailResult) => void
): Promise<ThumbnailResult[]> {
  const {
    scale = 0.25,
    format = "image/jpeg",
    quality = 0.85,
    signal,
  } = options;

  const pdfjs = await getPdfJs();
  const buffer = await readFileAsArrayBuffer(file, signal);

  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  const loadingTask = pdfjs.getDocument({ data: buffer });

  if (signal) {
    signal.addEventListener("abort", () => loadingTask.destroy(), { once: true });
  }

  const pdf = await loadingTask.promise;
  const results: ThumbnailResult[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    if (signal?.aborted) {
      await loadingTask.destroy();
      throw new DOMException("Aborted", "AbortError");
    }

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2D canvas context");

    await page.render({ canvasContext: ctx as CanvasRenderingContext2D, canvas, viewport }).promise;

    const dataUrl = canvas.toDataURL(format, quality);
    const result: ThumbnailResult = {
      pageNumber: pageNum,
      dataUrl,
      width: canvas.width,
      height: canvas.height,
    };

    results.push(result);
    onPageRendered?.(result);
    page.cleanup();
  }

  await loadingTask.destroy();
  return results;
}

/**
 * Renders a single page of a PDF to a data URL.
 * Useful for lazy/on-demand thumbnail loading.
 */
export async function renderPageThumbnail(
  file: File,
  pageNumber: number,
  options: ThumbnailOptions = {}
): Promise<ThumbnailResult> {
  const { scale = 0.25, format = "image/jpeg", quality = 0.85, signal } = options;

  const pdfjs = await getPdfJs();
  const buffer = await readFileAsArrayBuffer(file, signal);

  const loadingTask = pdfjs.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  if (pageNumber < 1 || pageNumber > pdf.numPages) {
    await loadingTask.destroy();
    throw new RangeError(
      `Page ${pageNumber} is out of range (1-${pdf.numPages})`
    );
  }

  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2D canvas context");

  await page.render({ canvasContext: ctx as CanvasRenderingContext2D, canvas, viewport }).promise;
  const dataUrl = canvas.toDataURL(format, quality);

  page.cleanup();
  await loadingTask.destroy();

  return { pageNumber, dataUrl, width: canvas.width, height: canvas.height };
}

/**
 * Returns the total page count of a PDF file without rendering anything.
 */
export async function getPdfPageCount(file: File): Promise<number> {
  const pdfjs = await getPdfJs();
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;
  const count = pdf.numPages;
  await loadingTask.destroy();
  return count;
}