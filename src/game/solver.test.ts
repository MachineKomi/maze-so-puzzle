import { describe, expect, it } from "vitest";
import { parseAsciiLevel } from "./levels";
import { solveLevel, validateLevel } from "./solver";

describe("solver interaction gates", () => {
  it("uses a paired flower portal to connect otherwise separate maze gardens", () => {
    const level = parseAsciiLevel({
      id: "portal-only-bridge",
      name: "Portal Only Bridge",
      objective: "Use the flower.",
      map: [
        "#########",
        "#@H######",
        "#########",
        "#####H.E#",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
      ],
    });

    const result = solveLevel(level);
    expect(result.solvable).toBe(true);
    expect(result.directions).toEqual(["right", "right", "right"]);
    expect(result.finalState).toMatchObject({ status: "won", steps: 3 });
  });

  it("rejects an unmatched flower portal before searching", () => {
    const level = parseAsciiLevel({
      id: "lonely-portal",
      name: "Lonely Portal",
      objective: "Test structural validation.",
      map: [
        "#########",
        "#@H...E.#",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
      ],
    });

    expect(validateLevel(level)).toMatchObject({
      valid: false,
      solvable: false,
      errors: ['Portal pair "rose-heart" must contain exactly two portals.'],
    });
  });

  it("includes a stationary combat interaction before entering the cleared tile", () => {
    const level = parseAsciiLevel({
      id: "winnable-enemy-gate",
      name: "Winnable Enemy Gate",
      objective: "Defeat the enemy, then walk forward.",
      initialPower: 2,
      map: [
        "#########",
        "#@s2..E.#",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
      ],
    });

    const result = solveLevel(level);
    expect(result).toMatchObject({
      solvable: true,
      reason: "solved",
      finalState: {
        status: "won",
        power: 4,
      },
    });
    expect(result.finalState?.defeatedEnemyIds).toHaveLength(1);
    // Sword, stationary battle, the cleared tile, two floor tiles, then exit.
    expect(result.directions).toEqual([
      "right", "right", "right", "right", "right", "right",
    ]);
  });

  it("does not treat contact with an underpowered enemy as movement or progress", () => {
    const level = parseAsciiLevel({
      id: "strong-enemy-gate",
      name: "Strong Enemy Gate",
      objective: "The enemy is deliberately unbeatable.",
      initialPower: 2,
      map: [
        "#########",
        "#@s4..E.#",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
      ],
    });

    const result = solveLevel(level);
    expect(result).toMatchObject({
      solvable: false,
      reason: "unsolvable",
    });
    expect(result.finalState).toBeUndefined();
  });

  it("recognizes poison as valid terrain and requires an antidote leaf route", () => {
    const corridor = parseAsciiLevel({
      id: "poison-gate",
      name: "Poison Gate",
      objective: "Find the antidote leaf.",
      initialPower: 1,
      map: [
        "#########",
        "#@....E.#",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
      ],
    });
    const terrain = corridor.terrain.map((row, y) => row.map((tile, x) => (
      y === 1 && (x === 3 || x === 4) ? "poison" as const : tile
    )));
    const leaf = {
      id: "poison-gate-antidote-leaf-1",
      kind: "antidote-leaf" as const,
      at: { x: 2, y: 1 },
    };
    const withLeaf = { ...corridor, terrain, objects: [leaf] };
    const withoutLeaf = { ...withLeaf, id: "poison-gate-without-leaf", objects: [] };

    expect(validateLevel(withLeaf).errors).toEqual([]);
    const solved = solveLevel(withLeaf);
    expect(solved.solvable).toBe(true);
    expect(solved.finalState).toMatchObject({
      hasAntidoteLeaf: true,
      collectedObjectIds: [leaf.id],
      status: "won",
    });
    expect(solveLevel(withoutLeaf)).toMatchObject({
      solvable: false,
      reason: "unsolvable",
    });
  });
});
