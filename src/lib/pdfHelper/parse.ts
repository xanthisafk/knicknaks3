import { QuickSelect, type ParsedPageSelection } from "./types";

/**
 * Parses a human-friendly page-selection string into both zero-based indices
 * and 1-based page numbers, clamped to [1, totalPages].
 *
 * Supports:
 *  - Individual pages: "1, 3, 5"
 *  - Ranges:           "2-6"
 *  - Mixed:            "1, 3-5, 8"
 *  - Reversed ranges:  "5-3" (treated as "3-5")
 *
 * @param input     Raw user string, e.g. "1, 3-5, 8"
 * @param totalPages Maximum valid page number (1-based)
 * @returns ParsedPageSelection with deduplicated, sorted results
 *
 * @example
 * parsePageSelection("1, 3-5", 10)
 * // { indices: [0, 2, 3, 4], pageNumbers: [1, 3, 4, 5] }
 */
export function parsePageSelection(
  input: string,
  totalPages: number
): ParsedPageSelection {
  const pageNumbers = new Set<number>();

  for (const raw of input.split(",")) {
    const part = raw.trim();
    if (!part) continue;

    if (part.includes("-")) {
      const [aStr, bStr] = part.split("-", 2);
      const a = parseInt(aStr, 10);
      const b = parseInt(bStr, 10);

      if (!isNaN(a) && !isNaN(b)) {
        const lo = Math.max(1, Math.min(a, b));
        const hi = Math.min(totalPages, Math.max(a, b));
        for (let p = lo; p <= hi; p++) pageNumbers.add(p);
      }
    } else {
      const n = parseInt(part, 10);
      if (!isNaN(n) && n >= 1 && n <= totalPages) pageNumbers.add(n);
    }
  }

  const sorted = Array.from(pageNumbers).sort((a, b) => a - b);

  return {
    pageNumbers: sorted,
    indices: sorted.map((n) => n - 1),
  };
}

/**
 * Serialises a set of 1-based page numbers back into a compact range string.
 *
 * @example
 * pageNumbersToRangeString([1, 2, 3, 5, 7, 8]) // "1-3, 5, 7-8"
 */
export function pageNumbersToRangeString(pageNumbers: number[]): string {
  if (pageNumbers.length === 0) return "";

  const sorted = [...pageNumbers].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = sorted[i];
      end = sorted[i];
    }
  }

  ranges.push(start === end ? `${start}` : `${start}-${end}`);
  return ranges.join(", ");
}

export function selectPages(key: string, totalPages: number) {
  const item = QuickSelect.find((q) => q.key === key);
  if (!item) throw new Error(`Unknown mode: "${key}"`);
  return item.select(totalPages);
}