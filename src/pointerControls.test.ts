import { describe, expect, it } from "vitest";
import { createInitialGameState } from "./game/engine";
import type { LevelDefinition, LevelObject, TerrainKind } from "./game/types";
import {
  pointerIntentFromTileOffset,
  resolvePointerMoveDirection,
} from "./pointerControls";

function makeLevel(
  rows: readonly string[],
  objects: readonly LevelObject[] = [],
): LevelDefinition {
  const terrain = rows.map((row) => [...row].map((tile): TerrainKind => {
    if (tile === "#") return "wall";
    if (tile === "~") return "water";
    if (tile === "^") return "lava";
    return "floor";
  }));
  return {
    schemaVersion: 1,
    id: "pointer-test",
    name: "Pointer test",
    objective: "Test pointer movement",
    source: "curated",
    width: rows[0]?.length ?? 0,
    height: rows.length,
    initialPower: 2,
    start: { x: 1, y: 2 },
    exit: { x: 3, y: 3 },
    terrain,
    objects,
  };
}

describe("pointerIntentFromTileOffset", () => {
  it("stops inside Ame's dead zone", () => {
    expect(pointerIntentFromTileOffset(0.2, -0.3)).toBeNull();
    expect(pointerIntentFromTileOffset(0, 0, 0)).toBeNull();
  });

  it("chooses the dominant axis and preserves perpendicular pointer offset", () => {
    expect(pointerIntentFromTileOffset(2, -0.7)).toEqual({
      direction: "right",
      lateralOffset: -0.7,
    });
    expect(pointerIntentFromTileOffset(0.4, 1.8)).toEqual({
      direction: "down",
      lateralOffset: 0.4,
    });
  });

  it("uses the horizontal axis for an exact diagonal", () => {
    expect(pointerIntentFromTileOffset(-1, 1)?.direction).toBe("left");
  });
});

describe("resolvePointerMoveDirection", () => {
  const cornerRows = [
    "#####",
    "#...#",
    "#.###",
    "#...#",
    "#####",
  ] as const;

  it("leaves an ordinary intended move unchanged", () => {
    const level = makeLevel(cornerRows);
    const state = createInitialGameState(level);
    expect(resolvePointerMoveDirection(level, state, "up", 0.5)).toBe("up");
  });

  it("nudges exactly one tile around a wall corner using pointer preference", () => {
    const level = makeLevel(cornerRows);
    const state = createInitialGameState(level);
    expect(resolvePointerMoveDirection(level, state, "right", -0.6)).toBe("up");
    expect(resolvePointerMoveDirection(level, state, "right", 0.6)).toBe("down");
    expect(resolvePointerMoveDirection(
      level,
      { ...state, position: { x: 1, y: 1 } },
      "right",
      0.4,
    )).toBe("right");
  });

  it("uses horizontal pointer offset at a vertical corner", () => {
    const level = makeLevel([
      "#####",
      "#.#.#",
      "#...#",
      "#...#",
      "#####",
    ]);
    const state = { ...createInitialGameState(level), position: { x: 2, y: 2 } };
    expect(resolvePointerMoveDirection(level, state, "up", 0.8)).toBe("right");
  });

  it("takes the only valid one-tile slip even when the pointer is straight ahead", () => {
    const level = makeLevel([
      "#####",
      "##..#",
      "#..##",
      "#####",
      "#####",
    ]);
    const state = createInitialGameState(level);
    expect(resolvePointerMoveDirection(level, state, "up", 0)).toBe("right");
  });

  it("does not guess a branch without meaningful lateral pointer offset", () => {
    const level = makeLevel(cornerRows);
    const state = createInitialGameState(level);
    expect(resolvePointerMoveDirection(level, state, "right", 0)).toBe("right");
    expect(resolvePointerMoveDirection(level, state, "right", 0.05)).toBe("right");
  });

  it("does not wall-follow when the original direction is still blocked after one side tile", () => {
    const level = makeLevel([
      "#####",
      "#.###",
      "#.###",
      "#...#",
      "#####",
    ]);
    const state = createInitialGameState(level);
    expect(resolvePointerMoveDirection(level, state, "right", -1)).toBe("right");
  });

  it.each([
    ["water", "~"],
    ["lava", "^"],
  ] as const)("never auto-steers onto %s", (_label, unsafeTile) => {
    const level = makeLevel([
      "#####",
      `#${unsafeTile}..#`,
      "#.###",
      "#...#",
      "#####",
    ]);
    const state = { ...createInitialGameState(level), hasBoots: true };
    expect(resolvePointerMoveDirection(level, state, "right", -1)).toBe("right");
  });

  it.each([
    { id: "door", kind: "door", color: "red", at: { x: 1, y: 1 } },
    { id: "enemy", kind: "enemy", power: 1, at: { x: 1, y: 1 } },
  ] satisfies readonly LevelObject[])("never auto-steers through an unresolved blocker", (object) => {
    const level = makeLevel(cornerRows, [object]);
    const state = {
      ...createInitialGameState(level),
      hasSword: true,
      keys: ["red"] as const,
    };
    expect(resolvePointerMoveDirection(level, state, "right", -1)).toBe("right");
  });

  it.each([
    { id: "door", kind: "door", color: "red", at: { x: 2, y: 2 } },
    { id: "enemy", kind: "enemy", power: 1, at: { x: 2, y: 2 } },
  ] satisfies readonly LevelObject[])("does not route around an intended door or enemy", (blocker) => {
    const level = makeLevel([
      "#####",
      "#...#",
      "#...#",
      "#...#",
      "#####",
    ], [blocker]);
    const state = createInitialGameState(level);
    expect(resolvePointerMoveDirection(level, state, "right", -1)).toBe("right");
  });

  it.each(["~", "^"] as const)("does not route around an intended hazard", (hazard) => {
    const waterLevel = makeLevel([
      "#####",
      "#...#",
      `#.${hazard}.#`,
      "#...#",
      "#####",
    ]);
    expect(resolvePointerMoveDirection(
      waterLevel,
      createInitialGameState(waterLevel),
      "right",
      -1,
    )).toBe("right");
  });

  it.each([
    { id: "door", kind: "door", color: "red", at: { x: 2, y: 1 } },
    { id: "enemy", kind: "enemy", power: 1, at: { x: 2, y: 1 } },
  ] satisfies readonly LevelObject[])("requires the immediately-forward tile to be free of unresolved blockers", (blocker) => {
    const level = makeLevel(cornerRows, [blocker]);
    const state = { ...createInitialGameState(level), hasSword: true };
    expect(resolvePointerMoveDirection(level, state, "right", -1)).toBe("right");
  });
});
