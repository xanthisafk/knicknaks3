/**
 * Formats a byte count into a human-readable string.
 *
 * @example
 * formatFileSize(1048576) // "1.0 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const exp = Math.min(Math.floor(Math.log2(bytes) / 10), units.length - 1);
  const value = bytes / Math.pow(1024, exp);
  return `${value.toFixed(exp === 0 ? 0 : 1)} ${units[exp]}`;
}

/**
 * Reads a File as an ArrayBuffer.
 * Prefer this over `file.arrayBuffer()` when you need abort-signal support.
 */
export function readFileAsArrayBuffer(
  file: File,
  signal?: AbortSignal
): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const reader = new FileReader();

    const onAbort = () => {
      reader.abort();
      reject(new DOMException("Aborted", "AbortError"));
    };

    reader.onload = () => {
      signal?.removeEventListener("abort", onAbort);
      resolve(reader.result as ArrayBuffer);
    };

    reader.onerror = () => {
      signal?.removeEventListener("abort", onAbort);
      reject(new Error(`Failed to read file: ${file.name}`));
    };

    signal?.addEventListener("abort", onAbort, { once: true });
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Returns true if the file appears to be a PDF (magic bytes %PDF).
 */
export async function isPdf(file: File): Promise<boolean> {
  try {
    const slice = file.slice(0, 5);
    const buf = await slice.arrayBuffer();
    const header = new TextDecoder().decode(buf);
    return header.startsWith("%PDF");
  } catch {
    return false;
  }
}