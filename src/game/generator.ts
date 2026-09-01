import { pointKey } from "./engine";
import { validateLevel } from "./solver";
import type {
  AnimalSpecies,
  CageStyle,
  EnemyStyle,
  KeyColor,
  LevelDefinition,
  LevelObject,
  Point,
  TerrainKind,
  TerrainThemeId,
  WeaponStyle,
} from "./types";
import {
  ANIMALS_PER_LEVEL,
  ANIMAL_SPECIES,
  CAGE_STYLE_IDS,
  ENEMY_STYLE_IDS,
  TERRAIN_THEME_IDS,
  WEAPON_STYLE_IDS,
} from "./types";

export type MazeDifficulty = "movement" | "gentle" | "growing" | "adventure";

export interface GenerateMazeOptions {
  readonly seed: string | number;
  /**
   * Progression size hint. The seed chooses a readable odd dimension from the
   * unlocked band, with an absolute 29-tile topology cap (below the 30-tile UI
   * ceiling).
   */
  readonly size?: number;
  readonly difficulty?: MazeDifficulty;
}

export const MIN_GENERATED_MAZE_SIZE = 9;
export const MAX_GENERATED_MAZE_SIZE = 29;

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

function normalizeSizeHint(requested: number | undefined): number {
  const rounded = Math.round(
    requested === undefined || !Number.isFinite(requested) ? 13 : requested,
  );
  const clamped = Math.max(
    MIN_GENERATED_MAZE_SIZE,
    Math.min(MAX_GENERATED_MAZE_SIZE, rounded),
  );
  const odd = clamped % 2 === 0 ? clamped + 1 : clamped;
  return Math.min(MAX_GENERATED_MAZE_SIZE, odd);
}

/**
 * Surprise mazes should stay surprising: a later chapter unlocks a wider size
 * band rather than permanently forcing every future maze to be larger. The
 * same seed and hint always select the same member of that band.
 */
function selectGeneratedSize(
  requested: number | undefined,
  seedText: string,
  difficulty: MazeDifficulty,
): number {
  const hint = normalizeSizeHint(requested);
  const unlockedCeiling = hint <= 9
    ? 9
    : hint <= 11
      ? 13
      : hint <= 13
        ? 19
        : hint <= 15
          ? 23
          : MAX_GENERATED_MAZE_SIZE;
  const difficultyCeiling: Record<MazeDifficulty, number> = {
    movement: 11,
    gentle: 15,
    growing: 23,
    adventure: MAX_GENERATED_MAZE_SIZE,
  };
  const ceiling = Math.min(unlockedCeiling, difficultyCeiling[difficulty]);
  const candidates = Array.from(
    { length: Math.floor((ceiling - MIN_GENERATED_MAZE_SIZE) / 2) + 1 },
    (_, index) => MIN_GENERATED_MAZE_SIZE + index * 2,
  );
  return selectByHash(candidates, `maze-size-v2:${seedText}:${difficulty}:${hint}`);
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

function selectByHash<T>(values: readonly T[], key: string): T {
  const selected = values[hashSeed(key) % values.length];
  if (selected === undefined) {
    throw new RangeError("A generated visual catalogue cannot be empty.");
  }
  return selected;
}

interface GeneratedVisuals {
  readonly terrainThemeId: TerrainThemeId;
  readonly weaponStyle: WeaponStyle;
  readonly enemyStyle: EnemyStyle;
  readonly cageStyle: CageStyle;
  readonly animalSpecies: readonly AnimalSpecies[];
}

/**
 * Select presentation from a dedicated deterministic stream. Keeping these
 * choices separate means adding art never perturbs the maze-layout PRNG.
 */
function selectGeneratedVisuals(
  seedText: string,
  difficulty: MazeDifficulty,
  size: number,
): GeneratedVisuals {
  const identity = `${seedText}:${difficulty}:${size}`;
  const speciesRandom = mulberry32(hashSeed(`visual-animals:${identity}`));
  return {
    terrainThemeId: selectByHash(TERRAIN_THEME_IDS, `visual-terrain:${identity}`),
    weaponStyle: selectByHash(WEAPON_STYLE_IDS, `visual-weapon:${identity}`),
    enemyStyle: selectByHash(ENEMY_STYLE_IDS, `visual-enemy:${identity}`),
    cageStyle: selectByHash(CAGE_STYLE_IDS, `visual-cage:${identity}`),
    animalSpecies: shuffle<AnimalSpecies>(ANIMAL_SPECIES, speciesRandom)
      .slice(0, ANIMALS_PER_LEVEL),
  };
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
    return [{ kind: "sword" }];
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
  return shuffled.slice(0, ANIMALS_PER_LEVEL);
}

interface HazardSeed {
  readonly at: Point;
  readonly terrain: "water" | "lava";
}

/**
 * Grow a small connected pool from a gated critical-path tile. The perfect-maze
 * topology is a tree, so off-path cells reached from this post-boots seed cannot
 * provide a shortcut around an earlier gate. Reserved progression tiles remain
 * ordinary floor and every generated pool contains at least two cells.
 */
function growHazardCluster(
  terrain: TerrainKind[][],
  hazard: HazardSeed,
  criticalPathIndex: ReadonlyMap<string, number>,
  bootsPathIndex: number,
  reserved: ReadonlySet<string>,
  random: RandomSource,
): boolean {
  const seedRow = terrain[hazard.at.y];
  if (seedRow?.[hazard.at.x] !== "floor") {
    return false;
  }

  const targetSize = 2 + Math.floor(random() * 3);
  const cluster: Point[] = [hazard.at];
  const clusterKeys = new Set<string>([pointKey(hazard.at)]);
  seedRow[hazard.at.x] = hazard.terrain;

  for (let head = 0; head < cluster.length && cluster.length < targetSize; head += 1) {
    const current = cluster[head];
    if (current === undefined) continue;
    const candidates = shuffle(CARDINAL_STEPS, random)
      .map((step) => ({ x: current.x + step.x, y: current.y + step.y }))
      .filter((candidate) => {
        const key = pointKey(candidate);
        const pathIndex = criticalPathIndex.get(key);
        return terrain[candidate.y]?.[candidate.x] === "floor"
          && !clusterKeys.has(key)
          && !reserved.has(key)
          && (pathIndex === undefined || pathIndex > bootsPathIndex);
      });

    for (const candidate of candidates) {
      const row = terrain[candidate.y];
      if (row === undefined || cluster.length >= targetSize) break;
      row[candidate.x] = hazard.terrain;
      cluster.push(candidate);
      clusterKeys.add(pointKey(candidate));
    }
  }

  return cluster.length >= 2;
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
  const visuals = selectGeneratedVisuals(seedText, difficulty, size);
  const recipe = buildRecipe(difficulty, random);
  const placements = chooseOrderedPoints(criticalPath, recipe.length);
  if (placements.length !== recipe.length) {
    return undefined;
  }

  const id = `surprise-v2-${seedIdentity(seedText)}-${difficulty}-${size}`;
  const objects: LevelObject[] = [];
  const hazards: HazardSeed[] = [];
  for (let index = 0; index < recipe.length; index += 1) {
    const entry = recipe[index];
    const at = placements[index];
    if (entry === undefined || at === undefined) {
      return undefined;
    }
    if (entry.kind === "hazard") {
      hazards.push({ at, terrain: entry.terrain });
      continue;
    }

    const objectId = `${id}-${entry.kind}-${index + 1}`;
    switch (entry.kind) {
      case "sword":
        objects.push({ id: objectId, kind: "sword", at, style: visuals.weaponStyle });
        break;
      case "boots":
        objects.push({ id: objectId, kind: "boots", at });
        break;
      case "enemy":
        objects.push({
          id: objectId,
          kind: "enemy",
          at,
          power: entry.power,
          style: visuals.enemyStyle,
        });
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

  if (hazards.length > 0) {
    const bootsPlacementIndex = recipe.findIndex((entry) => entry.kind === "boots");
    const bootsPoint = placements[bootsPlacementIndex];
    if (bootsPoint === undefined) return undefined;
    const criticalPathIndex = new Map(
      criticalPath.map((point, index) => [pointKey(point), index] as const),
    );
    const bootsPathIndex = criticalPathIndex.get(pointKey(bootsPoint));
    if (bootsPathIndex === undefined) return undefined;
    const reserved = new Set<string>([
      pointKey(start),
      pointKey(exit),
      ...placements.map(pointKey),
    ]);
    for (const hazard of hazards) {
      if (!growHazardCluster(
        terrain,
        hazard,
        criticalPathIndex,
        bootsPathIndex,
        reserved,
        random,
      )) {
        return undefined;
      }
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
  if (animalPoints.length !== ANIMALS_PER_LEVEL) {
    return undefined;
  }
  for (let index = 0; index < ANIMALS_PER_LEVEL; index += 1) {
    const at = animalPoints[index];
    const animalSpecies = visuals.animalSpecies[index];
    if (at === undefined || animalSpecies === undefined) {
      return undefined;
    }
    objects.push({
      id: `${id}-animal-${index + 1}`,
      kind: "animal",
      at,
      species: animalSpecies,
      cageStyle: visuals.cageStyle,
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
    terrainThemeId: visuals.terrainThemeId,
    introducedMechanics: [...new Set([
      ...(difficulty === "movement"
        ? ["movement", "exit", ...recipe.map((entry) => entry.kind)]
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
  const difficulty = options.difficulty ?? "growing";
  const size = selectGeneratedSize(options.size, seedText, difficulty);

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
