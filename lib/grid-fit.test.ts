import { describe, expect, it } from "vitest";
import { fitGrid } from "./grid-fit";

const GAP = 16;

describe("fitGrid", () => {
  it("returns nothing for no tiles or no space", () => {
    expect(fitGrid(0, 1000, 600, GAP)).toBeNull();
    expect(fitGrid(3, 0, 600, GAP)).toBeNull();
  });

  it("gives a single person as much room as the height allows", () => {
    expect(fitGrid(1, 1400, 700, GAP)).toEqual({ cols: 1, rows: 1, tileWidth: 933, tileHeight: 700 });
  });

  it("puts two people side by side on a wide screen", () => {
    expect(fitGrid(2, 1400, 700, GAP)).toMatchObject({ cols: 2, rows: 1 });
  });

  it("stacks two people on a tall phone screen", () => {
    expect(fitGrid(2, 470, 640, GAP)).toMatchObject({ cols: 1, rows: 2 });
  });

  it.each([3, 4, 5, 6, 9, 12])("always fits %i tiles inside the box", (count) => {
    for (const [w, h] of [
      [1400, 700],
      [800, 900],
      [470, 640],
    ]) {
      const fit = fitGrid(count, w, h, GAP)!;
      expect(fit.cols * fit.rows).toBeGreaterThanOrEqual(count);
      expect(fit.cols * fit.tileWidth + (fit.cols - 1) * GAP).toBeLessThanOrEqual(w);
      expect(fit.rows * fit.tileHeight + (fit.rows - 1) * GAP).toBeLessThanOrEqual(h);
    }
  });

  it("keeps the 4:3 shape", () => {
    const fit = fitGrid(6, 1400, 700, GAP)!;
    expect(fit.tileWidth / fit.tileHeight).toBeCloseTo(4 / 3, 1);
  });

  it("prefers a full 2x2 over 3+1 when the tiles would be the same size", () => {
    // Height-bound: 2 or 3 columns give equally tall tiles.
    expect(fitGrid(4, 1400, 604, GAP)).toMatchObject({ cols: 2, rows: 2 });
  });

  it("picks the arrangement with the biggest tiles", () => {
    // Six on a wide screen: 3x2 beats 2x3 and 6x1.
    expect(fitGrid(6, 1400, 700, GAP)).toMatchObject({ cols: 3, rows: 2 });
  });
});
