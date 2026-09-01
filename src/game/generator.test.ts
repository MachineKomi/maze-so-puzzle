import { describe, expect, it } from "vitest";
import { generateSurpriseLevel, generateSurpriseMaze } from "./generator";
import { solveLevel, validateLevel } from "./solver";
import {
  ANIMALS_PER_LEVEL,
  ANIMAL_SPECIES,
  CAGE_STYLE_IDS,
  ENEMY_STYLE_IDS,
  TERRAIN_THEME_IDS,
  WEAPON_STYLE_IDS,
} from "./types";

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

  it.each(["movement", "gentle", "growing", "adventure"] as const)(
    "always includes exactly one styled weapon in %s mazes",
    (difficulty) => {
      const generated = generateSurpriseMaze({
        seed: `one-weapon-${difficulty}`,
        difficulty,
        size: 13,
      });
      const swords = generated.objects.filter((object) => object.kind === "sword");

      expect(swords).toHaveLength(1);
      expect(WEAPON_STYLE_IDS).toContain(swords[0]?.style);
      expect(solveLevel(generated).finalState?.hasSword).toBe(true);
    },
  );

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
          const swords = generated.objects.filter((object) => object.kind === "sword");
          const enemies = generated.objects.filter((object) => object.kind === "enemy");
          expect(validation.errors, label).toEqual([]);
          expect(validation.solvable, label).toBe(true);
          expect(ordinaryWin.finalState?.rescuedAnimalIds, label).toHaveLength(0);
          expect(perfectRescueWin.solvable, label).toBe(true);
          expect(perfectRescueWin.finalState?.rescuedAnimalIds, label)
            .toHaveLength(ANIMALS_PER_LEVEL);
          expect(animals, label).toHaveLength(ANIMALS_PER_LEVEL);
          expect(new Set(animals.map((animal) => animal.species)).size, label)
            .toBe(ANIMALS_PER_LEVEL);
          expect(animals.every((animal) => ANIMAL_SPECIES.includes(animal.species)), label)
            .toBe(true);
          expect(animals.every((animal) => CAGE_STYLE_IDS.includes(animal.cageStyle!)), label)
            .toBe(true);
          expect(swords, label).toHaveLength(1);
          expect(WEAPON_STYLE_IDS, label).toContain(swords[0]?.style);
          expect(enemies.every((enemy) => ENEMY_STYLE_IDS.includes(enemy.style!)), label)
            .toBe(true);
          expect(TERRAIN_THEME_IDS, label).toContain(generated.terrainThemeId);
        }
      }
    }
  });

  it("selects varied art and animal trios deterministically without changing level identity", () => {
    const terrainThemes = new Set<string>();
    const weaponStyles = new Set<string>();
    const enemyStyles = new Set<string>();
    const cageStyles = new Set<string>();
    const animalSpecies = new Set<string>();

    for (let index = 0; index < 40; index += 1) {
      const options = {
        seed: `visual-variety-${index}`,
        difficulty: "adventure" as const,
        size: 13,
      };
      const first = generateSurpriseMaze(options);
      const second = generateSurpriseMaze(options);
      const sword = first.objects.find((object) => object.kind === "sword");
      const enemy = first.objects.find((object) => object.kind === "enemy");
      const animals = first.objects.filter((object) => object.kind === "animal");

      expect(second).toEqual(first);
      expect(second.id).toBe(first.id);
      if (first.terrainThemeId) terrainThemes.add(first.terrainThemeId);
      if (sword?.style) weaponStyles.add(sword.style);
      if (enemy?.style) enemyStyles.add(enemy.style);
      if (animals[0]?.cageStyle) cageStyles.add(animals[0].cageStyle);
      for (const animal of animals) animalSpecies.add(animal.species);
    }

    expect(terrainThemes.size).toBeGreaterThan(1);
    expect(weaponStyles.size).toBeGreaterThan(1);
    expect(enemyStyles.size).toBeGreaterThan(1);
    expect(cageStyles.size).toBeGreaterThan(1);
    expect(animalSpecies.size).toBeGreaterThan(ANIMALS_PER_LEVEL);
  });

  it("keeps rescues optional for a previously failing adventure seed", () => {
    const generated = generateSurpriseMaze({
      seed: "stress-13-adventure-411",
      difficulty: "adventure",
      size: 13,
    });

    expect(solveLevel(generated).finalState?.rescuedAnimalIds).toHaveLength(0);
    expect(solveLevel(generated, { requireAllAnimals: true }).finalState?.rescuedAnimalIds)
      .toHaveLength(ANIMALS_PER_LEVEL);
  });

  it("proves perfect-rescue routes at the largest supported size", () => {
    const generated = generateSurpriseMaze({
      seed: "big-friendly-maze",
      difficulty: "adventure",
      size: 17,
    });

    const result = solveLevel(generated, { requireAllAnimals: true });
    expect(result.reason).toBe("solved");
    expect(result.finalState?.rescuedAnimalIds).toHaveLength(ANIMALS_PER_LEVEL);
  });
});
