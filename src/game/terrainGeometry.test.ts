import { describe, expect, it, vi } from "vitest";
import {
  createRoundedCellUnionPath,
  createRoundedTerrainPath,
  DEFAULT_TERRAIN_CORNER_RADIUS,
} from "./terrainGeometry";
import type { TerrainKind } from "./types";

function fromRows(rows: readonly string[], occupied = "#") {
  return createRoundedCellUnionPath(
    { left: 0, top: 0, right: rows[0]!.length - 1, bottom: rows.length - 1 },
    (x, y) => rows[y]?.[x] === occupied,
  );
}

function commandCount(path: string, command: "M" | "A" | "L" | "Z"): number {
  return path.split(" ").filter((part) => part === command).length;
}

function sweepCount(path: string, sweep: 0 | 1): number {
  return [...path.matchAll(/A [\d.-]+ [\d.-]+ 0 0 ([01]) /g)]
    .filter((match) => Number(match[1]) === sweep).length;
}

describe("createRoundedCellUnionPath", () => {
  it("returns one exact rounded loop for a single cell", () => {
    const result = fromRows(["#"]);

    expect(result).toEqual({
      d: "M 0 0.12 A 0.12 0.12 0 0 1 0.12 0 L 0.88 0 A 0.12 0.12 0 0 1 1 0.12 L 1 0.88 A 0.12 0.12 0 0 1 0.88 1 L 0.12 1 A 0.12 0.12 0 0 1 0 0.88 L 0 0.12 Z",
      fillRule: "evenodd",
      loopCount: 1,
    });
  });

  it("removes every internal edge from an orthogonally connected run", () => {
    const result = fromRows(["###"]);

    expect(result.loopCount).toBe(1);
    expect(commandCount(result.d, "A")).toBe(4);
    expect(result.d).toContain("L 2.88 0");
    expect(result.d).not.toMatch(/(?:M|L) 1 [01](?:\s|$)/);
    expect(result.d).not.toMatch(/(?:M|L) 2 [01](?:\s|$)/);
  });

  it("rounds a connected L bend with one concave and five convex arcs", () => {
    const result = fromRows([
      "##",
      "#.",
    ]);

    expect(result.loopCount).toBe(1);
    expect(commandCount(result.d, "A")).toBe(6);
    expect(sweepCount(result.d, 0)).toBe(1);
    expect(sweepCount(result.d, 1)).toBe(5);
    expect(result.d).toContain("A 0.12 0.12 0 0 0 1 1.12");
  });

  it("emits a separate counter-clockwise subpath for a hole", () => {
    const result = fromRows([
      "###",
      "#.#",
      "###",
    ]);

    expect(result.fillRule).toBe("evenodd");
    expect(result.loopCount).toBe(2);
    expect(commandCount(result.d, "M")).toBe(2);
    expect(sweepCount(result.d, 1)).toBe(4);
    expect(sweepCount(result.d, 0)).toBe(4);
  });

  it.each([
    [["#.", ".#"]],
    [[".#", "#."]],
  ])("keeps diagonal-only contacts as two non-self-touching loops", (rows) => {
    const result = fromRows(rows);

    expect(result.loopCount).toBe(2);
    expect(commandCount(result.d, "M")).toBe(2);
    expect(commandCount(result.d, "A")).toBe(8);
    expect(sweepCount(result.d, 0)).toBe(0);
  });

  it("uses an even-odd compound path for nested holes and islands", () => {
    const result = fromRows([
      "#####",
      "#...#",
      "#.#.#",
      "#...#",
      "#####",
    ]);

    expect(result.loopCount).toBe(3);
    expect(commandCount(result.d, "M")).toBe(3);
    expect(result.fillRule).toBe("evenodd");
  });

  it("honours a custom radius and clamps it to half the shortest edge", () => {
    const custom = createRoundedCellUnionPath(
      { left: 0, top: 0, right: 0, bottom: 0 },
      () => true,
      0.2,
    );
    const clamped = createRoundedCellUnionPath(
      { left: 0, top: 0, right: 3, bottom: 2 },
      () => true,
      4,
    );

    expect(custom.d).toContain("A 0.2 0.2");
    expect(clamped.d).toContain("A 0.5 0.5");
    expect(clamped.d).not.toContain("A 4 4");
  });

  it("traces every possible 3 by 3 occupancy without an open or invalid loop", () => {
    for (let mask = 1; mask < 2 ** 9; mask += 1) {
      const result = createRoundedCellUnionPath(
        { left: 0, top: 0, right: 2, bottom: 2 },
        (x, y) => (mask & (1 << (y * 3 + x))) !== 0,
      );

      expect(result.d, `mask ${mask}`).not.toBe("");
      expect(result.d, `mask ${mask}`).not.toMatch(/NaN|Infinity/);
      expect(commandCount(result.d, "M"), `mask ${mask}`).toBe(result.loopCount);
      expect(commandCount(result.d, "Z"), `mask ${mask}`).toBe(result.loopCount);
    }
  });

  it("supports sharp corners when the requested radius is zero", () => {
    const result = createRoundedCellUnionPath(
      { left: -2, top: 3, right: -2, bottom: 3 },
      () => true,
      0,
    );

    expect(result.d).not.toContain(" A ");
    expect(commandCount(result.d, "A")).toBe(0);
    expect(result.d).toContain("M -2 3");
    expect(result.loopCount).toBe(1);
  });

  it("returns the canonical empty path and evaluates each bounded cell once", () => {
    const predicate = vi.fn(() => false);
    const result = createRoundedCellUnionPath(
      { left: 4, top: 7, right: 6, bottom: 8 },
      predicate,
    );

    expect(result).toEqual({ d: "", fillRule: "evenodd", loopCount: 0 });
    expect(predicate).toHaveBeenCalledTimes(6);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, -0.01])(
    "rejects invalid radius %s",
    (radius) => {
      expect(() => createRoundedCellUnionPath(
        { left: 0, top: 0, right: 0, bottom: 0 },
        () => true,
        radius,
      )).toThrow(/radius/i);
    },
  );

  it("rejects fractional, reversed, and empty bounds", () => {
    expect(() => createRoundedCellUnionPath(
      { left: 0.5, top: 0, right: 1, bottom: 1 },
      () => true,
    )).toThrow(/integer/i);
    expect(() => createRoundedCellUnionPath(
      { left: 2, top: 0, right: 1, bottom: 1 },
      () => true,
    )).toThrow(/at least one cell/i);
  });

  it("uses the documented default radius", () => {
    expect(DEFAULT_TERRAIN_CORNER_RADIUS).toBe(0.12);
  });
});

describe("createRoundedTerrainPath", () => {
  const terrain: readonly (readonly TerrainKind[])[] = [
    ["wall", "wall", "wall", "wall", "wall", "wall", "wall"],
    ["floor", "water", "water", "floor", "lava", "lava", "floor"],
    ["floor", "floor", "floor", "floor", "floor", "floor", "floor"],
  ];
  const level = { width: 7, height: 3, terrain };

  it("selects a terrain kind and retains absolute world coordinates", () => {
    const result = createRoundedTerrainPath(
      level,
      { left: 2, top: 1, right: 4, bottom: 1 },
      "wall",
    );

    // The offscreen gutter is x=1..5, rather than coordinates rebased to 0.
    expect(result.d).toContain("M 1 0.12");
    expect(result.d).toContain("L 5.88 0");
    expect(result.loopCount).toBe(1);
  });

  it("accepts a terrain predicate for combined selections", () => {
    const result = createRoundedTerrainPath(
      level,
      { left: 0, top: 0, right: 6, bottom: 2 },
      (kind) => kind === "water" || kind === "lava",
    );

    expect(result.loopCount).toBe(2);
    expect(commandCount(result.d, "M")).toBe(2);
  });

  it("includes a one-cell camera gutter so clipping does not invent an edge", () => {
    const result = createRoundedTerrainPath(
      level,
      { left: 2, top: 1, right: 2, bottom: 1 },
      "water",
    );

    // Water continues into x=1, outside the one-cell-wide camera at x=2.
    expect(result.d).toContain("M 1 1.12");
    expect(result.d).toContain("L 2.88 1");
  });

  it("passes stable world coordinates to a terrain predicate", () => {
    const coordinates: string[] = [];
    createRoundedTerrainPath(
      level,
      { left: 3, top: 1, right: 3, bottom: 1 },
      (_kind, x, y) => {
        coordinates.push(`${x},${y}`);
        return false;
      },
    );

    expect(coordinates).toEqual([
      "2,0", "3,0", "4,0",
      "2,1", "3,1", "4,1",
      "2,2", "3,2", "4,2",
    ]);
  });

  it("rejects a camera outside the level", () => {
    expect(() => createRoundedTerrainPath(
      level,
      { left: 0, top: 0, right: 7, bottom: 2 },
      "floor",
    )).toThrow(/inside/i);
  });
});
