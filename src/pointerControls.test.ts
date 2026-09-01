import { describe, expect, it } from "vitest";
import { createInitialGameState, movePlayer } from "./game/engine";
import type { LevelDefinition, LevelObject, TerrainKind } from "./game/types";
import {
  normalizedBoardPoint,
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
    if (tile === "%") return "poison";
    if (tile === "o") return "hole";
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

  it("keeps the previous axis through small diagonal pointer wobble", () => {
    expect(pointerIntentFromTileOffset(1, 1.08, 0.34, "right")?.direction).toBe("right");
    expect(pointerIntentFromTileOffset(1, 1.26, 0.34, "right")?.direction).toBe("down");
    expect(pointerIntentFromTileOffset(-1.05, -1, 0.34, "up")?.direction).toBe("up");
  });

  it("still reverses immediately along the current axis", () => {
    expect(pointerIntentFromTileOffset(-1.2, 0.2, 0.34, "right")?.direction).toBe("left");
  });
});

describe("normalizedBoardPoint", () => {
  it.each([0.722, 1, 1.067])("tracks the same relative point at stage scale %s", (scale) => {
    const rect = { left: 18, top: 27, width: 600 * scale, height: 600 * scale };
    expect(normalizedBoardPoint(
      rect.left + rect.width * 0.73,
      rect.top + rect.height * 0.21,
      rect,
    )).toEqual({ x: 0.73, y: 0.21 });
  });

  it("clamps the guide to the board", () => {
    expect(normalizedBoardPoint(-100, 999, { left: 10, top: 20, width: 200, height: 100 }))
      .toEqual({ x: 0, y: 1 });
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

  it("takes the only valid slip despite a small pointer wobble toward the blocked side", () => {
    const level = makeLevel([
      "#####",
      "##..#",
      "#..##",
      "#####",
      "#####",
    ]);
    const state = createInitialGameState(level);
    expect(resolvePointerMoveDirection(level, state, "up", -0.4)).toBe("right");
  });

  it("does not guess a branch without meaningful lateral pointer offset", () => {
    const level = makeLevel(cornerRows);
    const state = createInitialGameState(level);
    expect(resolvePointerMoveDirection(level, state, "right", 0)).toBe("right");
    expect(resolvePointerMoveDirection(level, state, "right", 0.05)).toBe("right");
  });

  it("continues the previous perpendicular movement when a key is pressed just before a corner", () => {
    const level = makeLevel(cornerRows);
    const state = createInitialGameState(level);
    expect(resolvePointerMoveDirection(level, state, "right", 0, "up")).toBe("up");
    expect(resolvePointerMoveDirection(level, state, "right", 0, "down")).toBe("down");
    expect(resolvePointerMoveDirection(level, state, "right", 0, "left")).toBe("right");
  });

  it("corrects for one tile and then immediately follows the requested direction", () => {
    const level = makeLevel(cornerRows);
    const start = createInitialGameState(level);
    const correction = resolvePointerMoveDirection(level, start, "right", 0, "up");
    const aligned = movePlayer(level, start, correction).state;

    expect(correction).toBe("up");
    expect(aligned.position).toEqual({ x: 1, y: 1 });
    expect(resolvePointerMoveDirection(level, aligned, "right", 0, correction)).toBe("right");
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
    ["poison", "%"],
  ] as const)("never auto-steers onto %s", (_label, unsafeTile) => {
    const level = makeLevel([
      "#####",
      `#${unsafeTile}..#`,
      "#.###",
      "#...#",
      "#####",
    ]);
    const state = { ...createInitialGameState(level), hasBoots: true, hasAntidoteLeaf: true };
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

  it.each(["~", "^", "%", "o"] as const)("does not route around an intended hazard", (hazard) => {
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

  it("never uses a hole as the one-tile correction or its forward landing", () => {
    const sideHoleLevel = makeLevel([
      "#####",
      "#o..#",
      "#.###",
      "#...#",
      "#####",
    ]);
    const sideHoleState = {
      ...createInitialGameState(sideHoleLevel),
      hasSpringBoots: true,
    };
    expect(resolvePointerMoveDirection(sideHoleLevel, sideHoleState, "right", -1)).toBe("right");

    const forwardHoleLevel = makeLevel([
      "#####",
      "#.o.#",
      "#.###",
      "#...#",
      "#####",
    ]);
    const forwardHoleState = {
      ...createInitialGameState(forwardHoleLevel),
      hasSpringBoots: true,
    };
    expect(resolvePointerMoveDirection(forwardHoleLevel, forwardHoleState, "right", -1)).toBe("right");
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
