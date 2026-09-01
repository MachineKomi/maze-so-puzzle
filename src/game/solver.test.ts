import { describe, expect, it } from "vitest";
import { parseAsciiLevel } from "./levels";
import { solveLevel, validateLevel } from "./solver";

describe("solver interaction gates", () => {
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
