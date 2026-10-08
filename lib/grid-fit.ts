export interface GridFit {
  cols: number;
  rows: number;
  tileWidth: number;
  tileHeight: number;
}

/**
 * The column count that gives `count` tiles of a fixed aspect ratio the
 * largest size inside a `width` x `height` box with `gap` between tiles.
 * Tries every column count; cheap for the handful of tiles on a page.
 */
export function fitGrid(
  count: number,
  width: number,
  height: number,
  gap: number,
  aspect = 4 / 3
): GridFit | null {
  if (count < 1 || width <= 0 || height <= 0) return null;

  let best: GridFit | null = null;
  for (let cols = 1; cols <= count; cols++) {
    const rows = Math.ceil(count / cols);
    const maxWidth = (width - gap * (cols - 1)) / cols;
    const maxHeight = (height - gap * (rows - 1)) / rows;
    if (maxWidth <= 0 || maxHeight <= 0) continue;

    // Fill whichever dimension runs out first, keeping the aspect ratio.
    const tileWidth = Math.min(maxWidth, maxHeight * aspect);
    const tileHeight = tileWidth / aspect;
    // Strictly bigger only: on a tie the fewer-column layout, found first,
    // wins, which keeps 4 people as 2x2 rather than 3+1.
    if (!best || tileWidth > best.tileWidth + 1) {
      best = { cols, rows, tileWidth: Math.floor(tileWidth), tileHeight: Math.floor(tileHeight) };
    }
  }
  return best;
}
