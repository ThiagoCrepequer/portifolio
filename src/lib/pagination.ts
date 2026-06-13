/**
 * Pure pagination utility.
 *
 * Returns a sliding-window array of page numbers (and `"ellipsis"` markers)
 * suitable for rendering a pagination control.
 *
 * @param current  - The active page (1‑based, clamped to [1, total]).
 * @param total    - Total number of pages.
 * @param siblingCount - How many pages to show on each side of `current`.
 */
export function paginate(
  current: number,
  total: number,
  siblingCount: number = 1,
): (number | "ellipsis")[] {
  if (total === 0) return [];
  if (total === 1) return [1];

  // Keep current within valid range
  const clamped = Math.max(1, Math.min(current, total));

  // Pre-compute window boundaries before clamping ends
  const windowSize = siblingCount * 2 + 1;

  let startPage = Math.max(1, clamped - siblingCount);
  let endPage = Math.min(total, clamped + siblingCount);

  // Extend the window to reach windowSize when near boundaries
  if (endPage - startPage + 1 < windowSize) {
    const shortage = windowSize - (endPage - startPage + 1);
    if (startPage === 1) {
      endPage = Math.min(total, endPage + shortage);
    } else {
      startPage = Math.max(1, startPage - shortage);
    }
  }

  const result: (number | "ellipsis")[] = [];

  // Page 1 is always shown
  result.push(1);

  // Left ellipsis if there is a gap between 1 and startPage
  if (startPage > 2) {
    result.push("ellipsis");
  }

  // Central sliding window (exclude page 1 if it is part of the window)
  for (let i = startPage; i <= endPage; i++) {
    if (i === 1) continue;
    result.push(i);
  }

  // Right ellipsis if there is a gap between endPage and total
  if (endPage < total - 1) {
    result.push("ellipsis");
  }

  // Last page (if not already included)
  if (endPage < total) {
    result.push(total);
  }

  return result;
}
