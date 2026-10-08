export interface GridFit {
  cols: number;
  rows: number;
  tileWidth: number;
  tileHeight: number;
}

export interface GridFitOptions {
  /** Number of tiles to place. */
  count: number;
  /** Available space, in px. */
  width: number;
  height: number;
  /** Space between tiles, in px. */
  gap?: number;
  /** Tile width / height; defaults to 4:3. */
  aspect?: number;
}

/** The biggest tile that fits `cols` columns, or null if none fits. */
const fitColumns = (
  cols: number,
  { count, width, height, gap = 0, aspect = 4 / 3 }: GridFitOptions
): GridFit | null => {
  const rows = Math.ceil(count / cols);
  const maxWidth = (width - gap * (cols - 1)) / cols;
  const maxHeight = (height - gap * (rows - 1)) / rows;
  // Fill whichever dimension runs out first, keeping the aspect ratio.
  const tileWidth = Math.min(maxWidth, maxHeight * aspect);
  if (tileWidth <= 0) return null;
  return {
    cols,
    rows,
    tileWidth: Math.floor(tileWidth),
    tileHeight: Math.floor(tileWidth / aspect),
  };
};

/**
 * The column count that gives `count` tiles of a fixed aspect ratio the
 * largest size inside the box. Tries every column count; cheap for the
 * handful of tiles on a page.
 */
export function fitGrid(options: GridFitOptions): GridFit | null {
  let best: GridFit | null = null;
  for (let cols = 1; cols <= options.count; cols++) {
    const fit = fitColumns(cols, options);
    // Strictly bigger only: on a tie the fewer-column layout, found first,
    // wins, which keeps 4 people as 2x2 rather than 3+1.
    if (fit && (!best || fit.tileWidth > best.tileWidth + 1)) best = fit;
  }
  return best;
}
