import { describe, expect, it } from "vitest";
import {
  areTerrainTexturesCompatible,
  resolveTerrainTheme,
} from "../artCatalog";
import { createInitialGameState, movePlayer } from "./engine";
import {
  MAX_GENERATED_MAZE_SIZE,
  MIN_GENERATED_MAZE_SIZE,
  generateSurpriseLevel,
  generateSurpriseMaze,
} from "./generator";
import { solveLevel, validateLevel } from "./solver";
import type { LevelDefinition, TerrainKind } from "./types";
import {
  ANIMALS_PER_LEVEL,
  ANIMAL_SPECIES,
  CAGE_STYLE_IDS,
  ENEMY_STYLE_IDS,
  TERRAIN_THEME_IDS,
  WEAPON_STYLE_IDS,
} from "./types";

function largestHazardRegion(level: LevelDefinition, terrainKind: TerrainKind): number {
  const seen = new Set<string>();
  let largest = 0;
  const key = (x: number, y: number) => `${x},${y}`;

  for (let y = 0; y < level.height; y += 1) {
    for (let x = 0; x < level.width; x += 1) {
      if (level.terrain[y]?.[x] !== terrainKind || seen.has(key(x, y))) continue;
      const queue = [{ x, y }];
      seen.add(key(x, y));
      for (let head = 0; head < queue.length; head += 1) {
        const point = queue[head];
        if (point === undefined) continue;
        for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]] as const) {
          const next = { x: point.x + dx, y: point.y + dy };
          if (level.terrain[next.y]?.[next.x] !== terrainKind || seen.has(key(next.x, next.y))) {
            continue;
          }
          seen.add(key(next.x, next.y));
          queue.push(next);
        }
      }
      largest = Math.max(largest, queue.length);
    }
  }

  return largest;
}

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
    expect(level.width).toBeGreaterThanOrEqual(MIN_GENERATED_MAZE_SIZE);
    expect(level.width).toBeLessThanOrEqual(19);
    expect(level.width % 2).toBe(1);
    expect(validateLevel(level).valid).toBe(true);
  });

  it("normalizes size hints into readable odd mazes below the 30-tile ceiling", () => {
    expect(generateSurpriseMaze({ seed: "tiny", size: 3 }).width).toBe(9);
    for (const options of [
      { seed: "even", size: 14 },
      { seed: "huge", size: 99, difficulty: "adventure" as const },
      { seed: "not-a-number", size: Number.NaN },
    ]) {
      const width = generateSurpriseMaze(options).width;
      expect(width).toBeGreaterThanOrEqual(MIN_GENERATED_MAZE_SIZE);
      expect(width).toBeLessThanOrEqual(MAX_GENERATED_MAZE_SIZE);
      expect(width % 2).toBe(1);
    }
    expect(MAX_GENERATED_MAZE_SIZE).toBeLessThanOrEqual(30);
  });

  it("varies later surprise sizes non-monotonically across the full unlocked band", () => {
    const sizes = Array.from({ length: 80 }, (_, index) => generateSurpriseMaze({
      seed: `size-variety-${index}`,
      size: 17,
      difficulty: "adventure",
    }).width);

    expect(new Set(sizes).size).toBeGreaterThanOrEqual(8);
    expect(Math.min(...sizes)).toBe(MIN_GENERATED_MAZE_SIZE);
    expect(Math.max(...sizes)).toBe(MAX_GENERATED_MAZE_SIZE);
    expect(sizes).not.toEqual([...sizes].sort((left, right) => left - right));
  }, 10_000);

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
          const terrainTheme = resolveTerrainTheme(generated.terrainThemeId);
          expect(
            areTerrainTexturesCompatible(terrainTheme.floor, terrainTheme.wall),
            `${label} should select a harmonious light-floor/dark-wall theme.`,
          ).toBe(true);
          for (const terrainKind of ["water", "lava"] as const) {
            const hazardCount = generated.terrain.flat().filter((tile) => tile === terrainKind).length;
            if (hazardCount > 0) {
              expect(largestHazardRegion(generated, terrainKind), label).toBeGreaterThanOrEqual(2);
            }
          }
        }
      }
    }
  }, 15_000);

  it("builds adventure detours with spring boots before connected hole jumps", () => {
    const generated = generateSurpriseMaze({
      seed: "skyhop-story-5",
      difficulty: "adventure",
      size: 17,
    });

    expect(generated.width).toBe(19);
    expect(generated.terrain.flat()).toContain("hole");
    expect(generated.objects.filter((object) => object.kind === "spring-boots"))
      .toHaveLength(1);
    expect(largestHazardRegion(generated, "hole")).toBeGreaterThanOrEqual(2);

    const solution = solveLevel(generated);
    let state = createInitialGameState(generated);
    const visited = new Set([`${state.position.x},${state.position.y}`]);
    let revisitedTiles = 0;
    const eventTypes: string[] = [];
    for (const direction of solution.directions) {
      const result = movePlayer(generated, state, direction);
      state = result.state;
      eventTypes.push(...result.events.map((event) => event.type));
      const position = `${state.position.x},${state.position.y}`;
      if (visited.has(position)) revisitedTiles += 1;
      visited.add(position);
    }

    expect(state).toMatchObject({ status: "won", hasSpringBoots: true });
    expect(revisitedTiles).toBeGreaterThan(0);
    expect(eventTypes.indexOf("spring-boots-collected")).toBeGreaterThanOrEqual(0);
    expect(eventTypes.indexOf("hole-jumped"))
      .toBeGreaterThan(eventTypes.indexOf("spring-boots-collected"));
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
    let generated: ReturnType<typeof generateSurpriseMaze> | undefined;
    for (let index = 0; index < 100 && generated === undefined; index += 1) {
      const candidate = generateSurpriseMaze({
        seed: `largest-friendly-maze-${index}`,
        difficulty: "adventure",
        size: 30,
      });
      if (candidate.width === MAX_GENERATED_MAZE_SIZE) generated = candidate;
    }

    expect(generated).toBeDefined();
    if (generated === undefined) throw new Error("Expected a deterministic 29x29 sample.");
    const result = solveLevel(generated, { requireAllAnimals: true });
    expect(generated.width).toBe(29);
    expect(result.reason).toBe("solved");
    expect(result.finalState?.rescuedAnimalIds).toHaveLength(ANIMALS_PER_LEVEL);
  });
});
