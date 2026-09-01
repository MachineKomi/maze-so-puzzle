import { describe, expect, it } from "vitest";
import {
  DEFAULT_FOV_SIZE,
  getCameraWindow,
  getVisibleTileKeys,
  getVisibleTiles,
  revealVisibleTiles,
  toTileKey,
} from "./exploration";

describe("maze exploration", () => {
  it("uses a centred 7 by 7 field of view in open space", () => {
    const grid = { width: 15, height: 11 };
    const camera = getCameraWindow(grid, { x: 7, y: 5 });

    expect(DEFAULT_FOV_SIZE).toBe(7);
    expect(camera).toEqual({
      left: 4,
      top: 2,
      right: 10,
      bottom: 8,
      width: 7,
      height: 7,
    });
    expect(getVisibleTiles(grid, { x: 7, y: 5 })).toHaveLength(49);
  });

  it("clamps at corners and edges while retaining a 7 by 7 window", () => {
    const grid = { width: 15, height: 11 };

    expect(getCameraWindow(grid, { x: 0, y: 0 })).toEqual({
      left: 0,
      top: 0,
      right: 6,
      bottom: 6,
      width: 7,
      height: 7,
    });
    expect(getCameraWindow(grid, { x: 14, y: 5 })).toEqual({
      left: 8,
      top: 2,
      right: 14,
      bottom: 8,
      width: 7,
      height: 7,
    });
    expect(getCameraWindow(grid, { x: 14, y: 10 })).toEqual({
      left: 8,
      top: 4,
      right: 14,
      bottom: 10,
      width: 7,
      height: 7,
    });
  });

  it("accumulates newly visible tiles without mutating prior exploration", () => {
    const grid = { width: 15, height: 11 };
    const first = revealVisibleTiles([], grid, { x: 7, y: 5 });
    const second = revealVisibleTiles(first, grid, { x: 8, y: 5 });

    expect(first).toHaveLength(49);
    expect(second).toHaveLength(56);
    expect(first.has("11,5")).toBe(false);
    expect(second.has("11,5")).toBe(true);
    expect(second).not.toBe(first);
  });

  it("produces canonical unique keys in deterministic row-major order", () => {
    const keys = getVisibleTileKeys({ width: 9, height: 9 }, { x: 4, y: 4 });

    expect(keys[0]).toBe("1,1");
    expect(keys.at(-1)).toBe("7,7");
    expect(new Set(keys).size).toBe(keys.length);
    expect(toTileKey({ x: 12, y: 3 })).toBe("12,3");

    const once = revealVisibleTiles([], { width: 9, height: 9 }, { x: 4, y: 4 });
    const twice = revealVisibleTiles(once, { width: 9, height: 9 }, { x: 4, y: 4 });
    expect([...twice]).toEqual([...once]);
  });

  it("reveals an entire small rectangular level without inventing tiles", () => {
    const grid = { width: 4, height: 3 };
    const camera = getCameraWindow(grid, { x: 3, y: 2 });
    const keys = getVisibleTileKeys(grid, { x: 3, y: 2 });

    expect(camera).toEqual({
      left: 0,
      top: 0,
      right: 3,
      bottom: 2,
      width: 4,
      height: 3,
    });
    expect(keys).toHaveLength(12);
    expect(keys).toContain("0,0");
    expect(keys).toContain("3,2");
  });

  it("rejects invalid grids, focus tiles, and field-of-view sizes", () => {
    expect(() => getCameraWindow({ width: 0, height: 9 }, { x: 0, y: 0 })).toThrow(
      /Grid width/,
    );
    expect(() => getCameraWindow({ width: 9, height: 9 }, { x: 9, y: 0 })).toThrow(
      /inside the grid/,
    );
    expect(() => getCameraWindow({ width: 9, height: 9 }, { x: 0, y: 0 }, 0)).toThrow(
      /Field-of-view size/,
    );
  });
});
