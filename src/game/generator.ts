import { pointKey } from "./engine";
import { validateLevel } from "./solver";
import type {
  AnimalSpecies,
  KeyColor,
  LevelDefinition,
  LevelObject,
  Point,
  TerrainKind,
} from "./types";
import { ANIMAL_SPECIES } from "./types";

export type MazeDifficulty = "movement" | "gentle" | "growing" | "adventure";

export interface GenerateMazeOptions {
  readonly seed: string | number;
  /** Requested square dimension, normalized to a readable odd size from 9 to 17. */
  readonly size?: number;
  readonly difficulty?: MazeDifficulty;
}

type RandomSource = () => number;

type RecipeEntry =
  | { readonly kind: "sword" }
  | { readonly kind: "boots" }
  | { readonly kind: "potion"; readonly amount: number }
  | { readonly kind: "enemy"; readonly power: number }
  | { readonly kind: "key"; readonly color: KeyColor }
  | { readonly kind: "door"; readonly color: KeyColor }
  | { readonly kind: "hazard"; readonly terrain: "water" | "lava" };

const CARDINAL_STEPS: readonly Point[] = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

function hashSeed(value: string): number {
  let hash = 2_166_136_261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }
  return hash >>> 0;
}

/** Stable 128-bit-ish label so distinct text seeds do not share progress keys. */
function seedIdentity(value: string): string {
  return ["ame", "maze", "stars", "friends"]
    .map((salt) => hashSeed(`${salt}:${value}`).toString(16).padStart(8, "0"))
    .join("");
}

function mulberry32(seed: number): RandomSource {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6d2b79f5) | 0;
    let mixed = value;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function normalizeSize(requested: number | undefined): number {
  const rounded = Math.round(
    requested === undefined || !Number.isFinite(requested) ? 13 : requested,
  );
  const clamped = Math.max(9, Math.min(17, rounded));
  return clamped % 2 === 0 ? clamped + 1 : clamped;
}

function shuffle<T>(values: readonly T[], random: RandomSource): T[] {
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    const held = shuffled[index];
    const replacement = shuffled[other];
    if (held === undefined || replacement === undefined) {
      continue;
    }
    shuffled[index] = replacement;
    shuffled[other] = held;
  }
  return shuffled;
}

function carvePerfectMaze(size: number, random: RandomSource): TerrainKind[][] {
  const terrain = Array.from({ length: size }, () =>
    Array.from<TerrainKind>({ length: size }).fill("wall"),
  );
  const oddCoordinates = Array.from(
    { length: Math.floor((size - 1) / 2) },
    (_, index) => index * 2 + 1,
  );
  const startX = oddCoordinates[Math.floor(random() * oddCoordinates.length)] ?? 1;
  const startY = oddCoordinates[Math.floor(random() * oddCoordinates.length)] ?? 1;
  const start = { x: startX, y: startY };
  const stack: Point[] = [start];
  const visited = new Set<string>([pointKey(start)]);
  const startRow = terrain[start.y];
  if (startRow !== undefined) {
    startRow[start.x] = "floor";
  }

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    if (current === undefined) {
      break;
    }

    const candidates = shuffle(CARDINAL_STEPS, random)
      .map((step) => ({
        x: current.x + step.x * 2,
        y: current.y + step.y * 2,
      }))
      .filter(
        (point) =>
          point.x > 0 &&
          point.y > 0 &&
          point.x < size - 1 &&
          point.y < size - 1 &&
          !visited.has(pointKey(point)),
      );

    const next = candidates[0];
    if (next === undefined) {
      stack.pop();
      continue;
    }

    const between = {
      x: (current.x + next.x) / 2,
      y: (current.y + next.y) / 2,
    };
    const betweenRow = terrain[between.y];
    const nextRow = terrain[next.y];
    if (betweenRow !== undefined && nextRow !== undefined) {
      betweenRow[between.x] = "floor";
      nextRow[next.x] = "floor";
    }
    visited.add(pointKey(next));
    stack.push(next);
  }

  return terrain;
}

function floorNeighbors(terrain: readonly (readonly TerrainKind[])[], point: Point): Point[] {
  const height = terrain.length;
  const width = terrain[0]?.length ?? 0;
  return CARDINAL_STEPS.map((step) => ({
    x: point.x + step.x,
    y: point.y + step.y,
  })).filter(
    (candidate) =>
      candidate.x >= 0 &&
      candidate.y >= 0 &&
      candidate.x < width &&
      candidate.y < height &&
      terrain[candidate.y]?.[candidate.x] === "floor",
  );
}

function farthestFloor(
  terrain: readonly (readonly TerrainKind[])[],
  start: Point,
): Point {
  const queue: Point[] = [start];
  const distances = new Map<string, number>([[pointKey(start), 0]]);
  let farthest = start;

  for (let head = 0; head < queue.length; head += 1) {
    const current = queue[head];
    if (current === undefined) {
      continue;
    }
    const currentDistance = distances.get(pointKey(current)) ?? 0;
    const farthestDistance = distances.get(pointKey(farthest)) ?? 0;
    if (currentDistance > farthestDistance) {
      farthest = current;
    }

    for (const neighbor of floorNeighbors(terrain, current)) {
      const key = pointKey(neighbor);
      if (distances.has(key)) {
        continue;
      }
      distances.set(key, currentDistance + 1);
      queue.push(neighbor);
    }
  }

  return farthest;
}

function findFloorPath(
  terrain: readonly (readonly TerrainKind[])[],
  start: Point,
  end: Point,
): readonly Point[] {
  const queue: Point[] = [start];
  const parents = new Map<string, Point>();
  const seen = new Set<string>([pointKey(start)]);

  for (let head = 0; head < queue.length; head += 1) {
    const current = queue[head];
    if (current === undefined) {
      continue;
    }
    if (current.x === end.x && current.y === end.y) {
      break;
    }
    for (const neighbor of floorNeighbors(terrain, current)) {
      const key = pointKey(neighbor);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      parents.set(key, current);
      queue.push(neighbor);
    }
  }

  if (!seen.has(pointKey(end))) {
    return [];
  }
  const reversed: Point[] = [end];
  let current = end;
  while (current.x !== start.x || current.y !== start.y) {
    const parent = parents.get(pointKey(current));
    if (parent === undefined) {
      return [];
    }
    reversed.push(parent);
    current = parent;
  }
  return reversed.reverse();
}

function buildRecipe(difficulty: MazeDifficulty, random: RandomSource): readonly RecipeEntry[] {
  if (difficulty === "movement") {
    return [];
  }

  const colors: readonly KeyColor[] = ["red", "blue", "yellow"];
  const color = colors[Math.floor(random() * colors.length)] ?? "red";
  if (difficulty === "gentle") {
    return [
      { kind: "sword" },
      { kind: "enemy", power: 1 },
      { kind: "key", color },
      { kind: "door", color },
    ];
  }

  const firstHazard: "water" | "lava" = random() < 0.5 ? "water" : "lava";
  const recipe: RecipeEntry[] = [
    { kind: "sword" },
    { kind: "enemy", power: 1 },
    { kind: "potion", amount: 2 },
    { kind: "enemy", power: 4 },
    { kind: "boots" },
    { kind: "hazard", terrain: firstHazard },
  ];
  if (difficulty === "adventure") {
    recipe.push({ kind: "enemy", power: 8 });
  }
  recipe.push({ kind: "key", color }, { kind: "door", color });
  if (difficulty === "adventure") {
    recipe.push({
      kind: "hazard",
      terrain: firstHazard === "water" ? "lava" : "water",
    });
  }
  return recipe;
}

function chooseOrderedPoints(path: readonly Point[], count: number): readonly Point[] {
  if (count === 0) {
    return [];
  }
  if (path.length < count + 4) {
    return [];
  }

  const available = path.length - 4;
  const chosen: Point[] = [];
  let previousIndex = 0;
  for (let index = 0; index < count; index += 1) {
    const ideal = 2 + Math.floor(((index + 1) * available) / (count + 1));
    const pathIndex = Math.max(previousIndex + 1, Math.min(path.length - 3, ideal));
    const point = path[pathIndex];
    if (point === undefined) {
      return [];
    }
    chosen.push(point);
    previousIndex = pathIndex;
  }
  if (new Set(chosen.map(pointKey)).size !== count) {
    return [];
  }
  return chosen;
}

function chooseAnimalPoints(
  terrain: readonly (readonly TerrainKind[])[],
  criticalPath: readonly Point[],
  unavailable: ReadonlySet<string>,
  random: RandomSource,
): readonly Point[] {
  const criticalPathKeys = new Set(criticalPath.map(pointKey));
  const candidates: Point[] = [];

  for (let y = 0; y < terrain.length; y += 1) {
    const row = terrain[y];
    if (row === undefined) {
      continue;
    }
    for (let x = 0; x < row.length; x += 1) {
      const point = { x, y };
      const key = pointKey(point);
      if (row[x] === "floor" && !unavailable.has(key) && !criticalPathKeys.has(key)) {
        candidates.push(point);
      }
    }
  }

  const shuffled = shuffle(candidates, random);
  const priority = (point: Point): number => {
    return floorNeighbors(terrain, point).length === 1 ? 0 : 1;
  };
  shuffled.sort((left, right) => priority(left) - priority(right));
  return shuffled.slice(0, ANIMAL_SPECIES.length);
}

function buildGeneratedLevel(
  seedText: string,
  seedHash: number,
  size: number,
  difficulty: MazeDifficulty,
  attempt: number,
): LevelDefinition | undefined {
  const attemptSeed = hashSeed(`maze-v1:${seedHash}:${difficulty}:${size}:${attempt}`);
  const random = mulberry32(attemptSeed);
  const terrain = carvePerfectMaze(size, random);
  const firstFloor = { x: 1, y: 1 };
  const start = farthestFloor(terrain, firstFloor);
  const exit = farthestFloor(terrain, start);
  const criticalPath = findFloorPath(terrain, start, exit);
  const recipe = buildRecipe(difficulty, random);
  const placements = chooseOrderedPoints(criticalPath, recipe.length);
  if (placements.length !== recipe.length) {
    return undefined;
  }

  const id = `surprise-v2-${seedIdentity(seedText)}-${difficulty}-${size}`;
  const objects: LevelObject[] = [];
  for (let index = 0; index < recipe.length; index += 1) {
    const entry = recipe[index];
    const at = placements[index];
    if (entry === undefined || at === undefined) {
      return undefined;
    }
    if (entry.kind === "hazard") {
      const row = terrain[at.y];
      if (row === undefined) {
        return undefined;
      }
      row[at.x] = entry.terrain;
      continue;
    }

    const objectId = `${id}-${entry.kind}-${index + 1}`;
    switch (entry.kind) {
      case "sword":
      case "boots":
        objects.push({ id: objectId, kind: entry.kind, at });
        break;
      case "enemy":
        objects.push({ id: objectId, kind: "enemy", at, power: entry.power });
        break;
      case "potion":
        objects.push({ id: objectId, kind: "potion", at, amount: entry.amount });
        break;
      case "key":
      case "door":
        objects.push({ id: objectId, kind: entry.kind, at, color: entry.color });
        break;
    }
  }

  const unavailable = new Set<string>([
    pointKey(start),
    pointKey(exit),
    ...objects.map((object) => pointKey(object.at)),
  ]);
  const animalPoints = chooseAnimalPoints(
    terrain,
    criticalPath,
    unavailable,
    random,
  );
  if (animalPoints.length !== ANIMAL_SPECIES.length) {
    return undefined;
  }
  const species = shuffle<AnimalSpecies>(ANIMAL_SPECIES, random);
  for (let index = 0; index < ANIMAL_SPECIES.length; index += 1) {
    const at = animalPoints[index];
    const animalSpecies = species[index];
    if (at === undefined || animalSpecies === undefined) {
      return undefined;
    }
    objects.push({
      id: `${id}-animal-${index + 1}`,
      kind: "animal",
      at,
      species: animalSpecies,
    });
  }

  return {
    schemaVersion: 1,
    id,
    name: "Surprise Maze",
    objective: difficulty === "movement" ? "Find the sparkly star!" : "Collect, grow, and find the star!",
    source: "generated",
    seed: seedText,
    width: size,
    height: size,
    initialPower: 2,
    start,
    exit,
    terrain,
    objects,
    introducedMechanics: [...new Set([
      ...(difficulty === "movement"
        ? ["movement", "exit"]
        : recipe.map((entry) => entry.kind)),
      "animal-rescue",
    ])],
  };
}

/**
 * Produces the same validated perfect maze for the same seed/options on every
 * run. Every progression gate lies on the unique start-to-exit path, with its
 * prerequisite earlier on that path.
 */
export function generateSurpriseMaze(options: GenerateMazeOptions): LevelDefinition {
  const seedText = String(options.seed);
  const seedHash = hashSeed(seedText);
  const size = normalizeSize(options.size);
  const difficulty = options.difficulty ?? "growing";

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const level = buildGeneratedLevel(
      seedText,
      seedHash,
      size,
      difficulty,
      attempt,
    );
    if (level !== undefined && validateLevel(level, { requireAllAnimals: true }).valid) {
      return level;
    }
  }

  throw new Error(
    `Could not generate a solvable ${size}x${size} maze for seed "${seedText}".`,
  );
}

export const generateLevel = generateSurpriseMaze;

/** Small UI-friendly wrapper: 0 = movement, 1 = gentle, 2 = growing, 3+ = adventure. */
export function generateSurpriseLevel(
  seed: string,
  difficulty = 2,
): LevelDefinition {
  const difficultyName: MazeDifficulty =
    difficulty <= 0
      ? "movement"
      : difficulty === 1
        ? "gentle"
        : difficulty === 2
          ? "growing"
          : "adventure";
  return generateSurpriseMaze({ seed, difficulty: difficultyName });
}
