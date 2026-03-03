/**
 * Shared PDF utility functions
 * Used across all PDF tools to avoid boilerplate.
 */
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

/** Load a PDF from a File object using pdf-lib */
export async function loadPdf(file: File): Promise<PDFDocument> {
  const buffer = await file.arrayBuffer();
  return PDFDocument.load(buffer, { ignoreEncryption: true });
}

/** Load a PDF from a File with a password using pdf-lib */
export async function loadPdfWithPassword(
  file: File,
  password?: string
): Promise<PDFDocument> {
  const buffer = await file.arrayBuffer();
  return PDFDocument.load(buffer, {
    ignoreEncryption: true,
    ...(password ? { password } : {}),
  });
}

/** Get page count from a file without fully loading */
export async function getPdfPageCount(file: File): Promise<number> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  return pdf.getPageCount();
}

/** Render a single page to a canvas element and return a data URL */
export async function renderPageToDataUrl(
  file: File,
  pageIndex: number,
  scale = 0.5
): Promise<string> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) })
    .promise;
  const page = await pdf.getPage(pageIndex + 1); // pdfjs is 1-indexed
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d")!;

  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas.toDataURL("image/png");
}

/** Render all pages to data URLs (for thumbnails) */
export async function renderAllPageThumbnails(
  file: File,
  scale = 0.3
): Promise<string[]> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) })
    .promise;
  const thumbnails: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvasContext: ctx, viewport }).promise;
    thumbnails.push(canvas.toDataURL("image/png"));
  }

  return thumbnails;
}

/** Trigger a download of PDF bytes */
export function downloadPdf(bytes: Uint8Array, filename: string): void {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Trigger a download of any blob */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Format file size for display */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
