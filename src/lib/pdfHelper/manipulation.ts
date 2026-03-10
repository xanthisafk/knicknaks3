/**
 * Swaps two elements in an array immutably.
 * Useful for drag-and-drop or arrow-key reordering.
 */
export function swapPages<T>(arr: T[], i: number, j: number): T[] {
  if (i === j) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

/**
 * Moves an element from `from` to `to` immutably (splice-style).
 * Useful for drag-and-drop reordering across non-adjacent positions.
 */
export function movePageTo<T>(arr: T[], from: number, to: number): T[] {
  if (from === to) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/**
 * Returns a new array with the given indices removed.
 *
 * @param arr      Source array (e.g. page order)
 * @param indices  Zero-based indices to remove
 */
export function removeAtIndices<T>(arr: T[], indices: Set<number>): T[] {
  return arr.filter((_, i) => !indices.has(i));
}