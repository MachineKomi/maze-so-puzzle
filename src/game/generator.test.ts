import { describe, expect, it } from "vitest";
import { generateSurpriseLevel, generateSurpriseMaze } from "./generator";
import { solveLevel, validateLevel } from "./solver";

describe("deterministic surprise mazes", () => {
  it("reproduces exactly for the same seed and options", () => {
    const first = generateSurpriseMaze({
      seed: "Ame loves stars",
      difficulty: "growing",
      size: 13,
    });
    const second = generateSurpriseMaze({
      seed: "Ame loves stars",
      difficulty: "growing",
      size: 13,
    });

    expect(second).toEqual(first);
  });

  it("provides the numeric-difficulty UI wrapper", () => {
    const level = generateSurpriseLevel("ui-seed", 2);
    expect(level.source).toBe("generated");
    expect(level.seed).toBe("ui-seed");
    expect(level.width).toBe(13);
    expect(validateLevel(level).valid).toBe(true);
  });

  it("keeps generated maze sizes within the readable odd 9-to-17 range", () => {
    expect(generateSurpriseMaze({ seed: "tiny", size: 3 }).width).toBe(9);
    expect(generateSurpriseMaze({ seed: "even", size: 14 }).width).toBe(15);
    expect(generateSurpriseMaze({ seed: "huge", size: 99 }).width).toBe(17);
    expect(generateSurpriseMaze({ seed: "not-a-number", size: Number.NaN }).width).toBe(13);
  });

  it("generates validated levels across seeds and difficulties", () => {
    for (const difficulty of ["movement", "gentle", "growing", "adventure"] as const) {
      for (const size of [9, 11, 13, 15, 17] as const) {
        for (let seed = 0; seed < 5; seed += 1) {
          const label = `${difficulty}-${size}-${seed}`;
          const generated = generateSurpriseMaze({
            seed: label,
            difficulty,
            size,
          });
          const validation = validateLevel(generated);
          const ordinaryWin = solveLevel(generated);
          const perfectRescueWin = solveLevel(generated, { requireAllAnimals: true });
          const animals = generated.objects.filter((object) => object.kind === "animal");
          expect(validation.errors, label).toEqual([]);
          expect(validation.solvable, label).toBe(true);
          expect(ordinaryWin.finalState?.rescuedAnimalIds, label).toHaveLength(0);
          expect(perfectRescueWin.solvable, label).toBe(true);
          expect(perfectRescueWin.finalState?.rescuedAnimalIds, label).toHaveLength(3);
          expect(animals, label).toHaveLength(3);
          expect(
            animals.map((animal) => animal.species).sort(),
            label,
          ).toEqual(["bunny", "fox", "kitten"]);
        }
      }
    }
  });

  it("keeps rescues optional for a previously failing adventure seed", () => {
    const generated = generateSurpriseMaze({
      seed: "stress-13-adventure-411",
      difficulty: "adventure",
      size: 13,
    });

    expect(solveLevel(generated).finalState?.rescuedAnimalIds).toHaveLength(0);
    expect(solveLevel(generated, { requireAllAnimals: true }).finalState?.rescuedAnimalIds).toHaveLength(3);
  });

  it("proves perfect-rescue routes at the largest supported size", () => {
    const generated = generateSurpriseMaze({
      seed: "big-friendly-maze",
      difficulty: "adventure",
      size: 17,
    });

    const result = solveLevel(generated, { requireAllAnimals: true });
    expect(result.reason).toBe("solved");
    expect(result.finalState?.rescuedAnimalIds).toHaveLength(3);
  });
});
