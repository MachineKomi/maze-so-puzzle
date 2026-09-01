import { describe, expect, it } from "vitest";
import { createInitialGameState, movePlayer } from "./engine";
import {
  CURATED_LEVELS,
  LANTERNLIGHT_LABYRINTH_LEVEL,
  MOVEMENT_LEVEL,
  parseAsciiLevel,
} from "./levels";
import { solveLevel, validateLevel } from "./solver";

describe("curated campaign levels", () => {
  it("starts with a movement-only teaching level", () => {
    expect(CURATED_LEVELS[0]).toBe(MOVEMENT_LEVEL);
    expect(MOVEMENT_LEVEL.objects.every((object) => object.kind === "animal")).toBe(true);
    expect(MOVEMENT_LEVEL.width).toBe(9);
  });

  it("grows gradually from readable whole-maze levels into one 25 by 25 exploration maze", () => {
    expect(CURATED_LEVELS.map((level) => [level.width, level.height])).toEqual([
      [9, 9],
      [11, 11],
      [13, 13],
      [13, 13],
      [15, 15],
      [15, 15],
      [17, 17],
      [17, 17],
      [25, 25],
    ]);
    expect(CURATED_LEVELS.map((level) => solveLevel(level).directions.length)).toEqual([
      26,
      36,
      62,
      66,
      78,
      90,
      108,
      114,
      288,
    ]);
  });

  it.each(CURATED_LEVELS.map((level) => [level.name, level] as const))(
    "%s is square, structurally valid, and safely solvable",
    (_name, level) => {
      const validation = validateLevel(level);
      expect(validation.errors).toEqual([]);
      expect(validation.valid).toBe(true);
      expect(validation.solution.length).toBeGreaterThan(0);
      expect(level.width).toBe(level.height);

      let state = createInitialGameState(level);
      for (const direction of validation.solution) {
        state = movePlayer(level, state, direction).state;
      }
      expect(state.status).toBe("won");
    },
  );

  it.each(CURATED_LEVELS.map((level) => [level.name, level] as const))(
    "%s has three optional animal rescues and all three can be saved safely",
    (_name, level) => {
      const animals = level.objects.filter((object) => object.kind === "animal");
      expect(animals.map((animal) => animal.species).sort()).toEqual([
        "bunny",
        "fox",
        "kitten",
      ]);

      const ordinaryWin = solveLevel(level);
      const perfectRescueWin = solveLevel(level, { requireAllAnimals: true });
      expect(ordinaryWin.finalState?.rescuedAnimalIds).toHaveLength(0);
      expect(perfectRescueWin.solvable).toBe(true);
      expect(perfectRescueWin.finalState?.rescuedAnimalIds).toHaveLength(3);
    },
  );

  it("keeps the giant exploration finale gentle, ordered, and rewarding to fully explore", () => {
    const ordinaryWin = solveLevel(LANTERNLIGHT_LABYRINTH_LEVEL);
    const perfectRescueWin = solveLevel(LANTERNLIGHT_LABYRINTH_LEVEL, {
      requireAllAnimals: true,
    });

    expect(ordinaryWin.directions).toHaveLength(288);
    expect(ordinaryWin.finalState).toMatchObject({
      power: 27,
      hasSword: true,
      hasBoots: true,
      keys: ["blue", "red", "yellow"],
      status: "won",
    });
    expect(ordinaryWin.finalState?.defeatedEnemyIds).toHaveLength(4);
    expect(ordinaryWin.finalState?.openedDoorIds).toHaveLength(3);
    expect(perfectRescueWin.directions).toHaveLength(320);
    expect(perfectRescueWin.finalState?.rescuedAnimalIds).toHaveLength(3);
  });

  it("keeps every required gate on the winning route", () => {
    const expectedKinds = [
      { animal: 3 },
      { animal: 3, sword: 1, enemy: 1, key: 1, door: 1 },
      { animal: 3, sword: 1, potion: 1, enemy: 2, boots: 1, key: 1, door: 1 },
      { animal: 3, sword: 1, potion: 1, enemy: 3, boots: 1, key: 2, door: 2 },
      { animal: 3, enemy: 2, door: 2, sword: 1, key: 2, boots: 1, potion: 1 },
      { animal: 3, key: 3, door: 3, enemy: 2, sword: 1, boots: 1, potion: 1 },
      { animal: 3, sword: 1, enemy: 3, key: 3, potion: 1, door: 3, boots: 1 },
      { animal: 3, key: 3, door: 3, enemy: 4, sword: 1, boots: 1, potion: 2 },
      { animal: 3, potion: 2, enemy: 4, boots: 1, key: 3, door: 3, sword: 1 },
    ] as const;
    const expectedEnemyCounts = [0, 1, 2, 3, 2, 2, 3, 4, 4] as const;
    const expectedDoorCounts = [0, 1, 1, 2, 2, 3, 3, 3, 3] as const;

    CURATED_LEVELS.forEach((level, index) => {
      const counts = Object.fromEntries(
        [...new Set(level.objects.map((object) => object.kind))].map((kind) => [
          kind,
          level.objects.filter((object) => object.kind === kind).length,
        ]),
      );
      expect(counts).toEqual(expectedKinds[index]);

      const result = solveLevel(level);
      expect(result.finalState?.hasSword).toBe(index > 0);
      expect(result.finalState?.hasBoots).toBe(index > 1);
      expect(result.finalState?.defeatedEnemyIds).toHaveLength(expectedEnemyCounts[index] ?? 0);
      expect(result.finalState?.openedDoorIds).toHaveLength(expectedDoorCounts[index] ?? 0);
    });
  });

  it("uses gameplay state rather than plain floor connectivity", () => {
    const impossible = parseAsciiLevel({
      id: "stateful-impossible",
      name: "Stateful Impossible",
      objective: "Test",
      map: [
        "#######",
        "#@4..E#",
        "#######",
        "#######",
        "#######",
        "#######",
        "#######",
      ],
    });

    const result = solveLevel(impossible);
    expect(result.solvable).toBe(false);
    expect(result.reason).toBe("unsolvable");
  });

  it("enforces a finite state cap without allowing invalid numeric options", () => {
    const capped = solveLevel(MOVEMENT_LEVEL, { maxStates: 1 });
    expect(capped.reason).toBe("state-limit");
    expect(capped.visitedStates).toBe(1);

    expect(solveLevel(MOVEMENT_LEVEL, { maxStates: Number.NaN }).reason).toBe("solved");
  });

  it("rejects unknown terrain data at the runtime validation boundary", () => {
    const terrain = MOVEMENT_LEVEL.terrain.map((row) => [...row]);
    (terrain[1] as unknown as string[])[1] = "cloud";
    const invalid = { ...MOVEMENT_LEVEL, terrain } as typeof MOVEMENT_LEVEL;

    const result = validateLevel(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Terrain tile 1,1 has an unknown kind.");
  });
});
