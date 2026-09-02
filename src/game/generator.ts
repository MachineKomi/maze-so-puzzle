import { pointKey } from "./engine";
import { solveLevel, validateLevel } from "./solver";
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
  ABSOLUTE_MAZE_SIZE_LIMIT,
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
   * unlocked band. Perfect-maze topology uses odd dimensions, so the largest
   * generated board is 23 × 23 beneath the game's absolute 24-tile ceiling.
   */
  readonly size?: number;
  readonly difficulty?: MazeDifficulty;
}

export const MIN_GENERATED_MAZE_SIZE = 9;
export const MAX_GENERATED_MAZE_SIZE = 23;
export { ABSOLUTE_MAZE_SIZE_LIMIT };

type RandomSource = () => number;

type RecipeEntry =
  | { readonly kind: "sword" }
  | { readonly kind: "boots" }
  | { readonly kind: "spring-boots" }
  | { readonly kind: "potion"; readonly amount: number }
  | { readonly kind: "enemy"; readonly power: number }
  | { readonly kind: "key"; readonly color: KeyColor }
  | { readonly kind: "door"; readonly color: KeyColor }
  | { readonly kind: "hazard"; readonly terrain: "water" | "lava" }
  | { readonly kind: "hole" };

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

interface GeneratedRoom {
  readonly doorway: Point;
  readonly tiles: readonly Point[];
  readonly width: number;
  readonly height: number;
}

function rectangleContains(
  left: number,
  top: number,
  width: number,
  height: number,
  point: Point,
): boolean {
  return point.x >= left
    && point.y >= top
    && point.x < left + width
    && point.y < top + height;
}

/**
 * Expands selected corridor ends into compact 2–4 tile-wide rooms. The complete
 * engine solver validates the result after progression objects are placed, so
 * a widened chamber can add useful loops without ever making a required route
 * impossible.
 */
function carveDeadEndRooms(
  terrain: TerrainKind[][],
  random: RandomSource,
  forbidden: ReadonlySet<string>,
): readonly GeneratedRoom[] {
  const size = terrain.length;
  const targetCount = size >= 21 ? 4 : size >= 17 ? 3 : size >= 13 ? 2 : 1;
  const deadEnds: Point[] = [];
  for (let y = 1; y < size - 1; y += 1) {
    for (let x = 1; x < (terrain[y]?.length ?? 1) - 1; x += 1) {
      const at = { x, y };
      if (
        terrain[y]?.[x] === "floor"
        && !forbidden.has(pointKey(at))
        && floorNeighbors(terrain, at).length === 1
      ) {
        deadEnds.push(at);
      }
    }
  }

  const rooms: GeneratedRoom[] = [];
  const roomTiles = new Set<string>();
  const dimensions = shuffle([
    [2, 2], [2, 3], [3, 2], [3, 3], [2, 4], [4, 2], [3, 4], [4, 3], [4, 4],
  ] as const, random);

  for (const doorway of shuffle(deadEnds, random)) {
    if (rooms.length >= targetCount) break;
    const connection = floorNeighbors(terrain, doorway)[0];
    if (connection === undefined) continue;

    let carved: GeneratedRoom | undefined;
    for (const [width, height] of dimensions) {
      const origins: Point[] = [];
      for (let top = doorway.y - height + 1; top <= doorway.y; top += 1) {
        for (let left = doorway.x - width + 1; left <= doorway.x; left += 1) {
          origins.push({ x: left, y: top });
        }
      }

      for (const origin of shuffle(origins, random)) {
        const { x: left, y: top } = origin;
        if (
          left < 1
          || top < 1
          || left + width >= size
          || top + height >= size
          || rectangleContains(left, top, width, height, connection)
        ) {
          continue;
        }

        const tiles: Point[] = [];
        let newFloorCount = 0;
        let compatible = true;
        for (let y = top; y < top + height && compatible; y += 1) {
          for (let x = left; x < left + width; x += 1) {
            const tile = { x, y };
            const key = pointKey(tile);
            if (forbidden.has(key) || roomTiles.has(key)) {
              compatible = false;
              break;
            }
            if (terrain[y]?.[x] === "wall") newFloorCount += 1;
            tiles.push(tile);
          }
        }
        if (!compatible || newFloorCount < 2) {
          continue;
        }

        for (const tile of tiles) {
          const row = terrain[tile.y];
          if (row !== undefined) row[tile.x] = "floor";
        }
        for (const tile of tiles) roomTiles.add(pointKey(tile));
        carved = { doorway, tiles, width, height };
        break;
      }
      if (carved !== undefined) break;
    }
    if (carved !== undefined) rooms.push(carved);
  }

  return rooms;
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

function buildRecipe(
  difficulty: MazeDifficulty,
  random: RandomSource,
  size: number,
): readonly RecipeEntry[] {
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
  if (difficulty === "adventure" && size >= 13) {
    recipe.push(
      { kind: "spring-boots" },
      { kind: "hole" },
    );
  }
  if (difficulty === "adventure") recipe.push({ kind: "enemy", power: 8 });
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

interface BranchCandidate {
  readonly at: Point;
  readonly attachmentIndex: number;
  readonly distance: number;
  /** Off-critical-path tiles from the candidate back toward its attachment. */
  readonly route: readonly Point[];
}

/**
 * Finds dead-end treasure branches and records where each one rejoins the
 * start-to-exit route. Perfect-maze topology guarantees every branch has one
 * unambiguous attachment.
 */
function findBranchCandidates(
  terrain: readonly (readonly TerrainKind[])[],
  criticalPath: readonly Point[],
): readonly BranchCandidate[] {
  const criticalPathIndex = new Map(
    criticalPath.map((point, index) => [pointKey(point), index] as const),
  );
  const queue = [...criticalPath];
  const parentTowardPath = new Map<string, Point>();
  const attachmentByTile = new Map<string, number>(criticalPathIndex);
  const distanceByTile = new Map<string, number>(
    criticalPath.map((point) => [pointKey(point), 0] as const),
  );

  for (let head = 0; head < queue.length; head += 1) {
    const current = queue[head];
    if (current === undefined) continue;
    const currentKey = pointKey(current);
    const attachmentIndex = attachmentByTile.get(currentKey);
    const distance = distanceByTile.get(currentKey);
    if (attachmentIndex === undefined || distance === undefined) continue;

    for (const neighbor of floorNeighbors(terrain, current)) {
      const key = pointKey(neighbor);
      if (attachmentByTile.has(key)) continue;
      attachmentByTile.set(key, attachmentIndex);
      distanceByTile.set(key, distance + 1);
      parentTowardPath.set(key, current);
      queue.push(neighbor);
    }
  }

  const candidates: BranchCandidate[] = [];
  for (let y = 0; y < terrain.length; y += 1) {
    const row = terrain[y];
    if (row === undefined) continue;
    for (let x = 0; x < row.length; x += 1) {
      const at = { x, y };
      const key = pointKey(at);
      if (
        row[x] !== "floor" ||
        criticalPathIndex.has(key) ||
        floorNeighbors(terrain, at).length !== 1
      ) {
        continue;
      }
      const attachmentIndex = attachmentByTile.get(key);
      const distance = distanceByTile.get(key);
      if (attachmentIndex === undefined || distance === undefined) continue;

      const route: Point[] = [];
      let current = at;
      while (!criticalPathIndex.has(pointKey(current))) {
        route.push(current);
        const parent = parentTowardPath.get(pointKey(current));
        if (parent === undefined) break;
        current = parent;
      }
      if (route.length === distance) {
        candidates.push({ at, attachmentIndex, distance, route });
      }
    }
  }
  return candidates;
}

interface BranchedPlacements {
  readonly placements: readonly Point[];
  readonly reservedBranchTiles: ReadonlySet<string>;
  readonly attachmentIndexByRecipe: ReadonlyMap<number, number>;
}

/** Moves prerequisites off the obvious route, so Ame must explore and return. */
function movePrerequisitesOntoBranches(
  terrain: readonly (readonly TerrainKind[])[],
  criticalPath: readonly Point[],
  recipe: readonly RecipeEntry[],
  orderedPlacements: readonly Point[],
  difficulty: MazeDifficulty,
  random: RandomSource,
): BranchedPlacements | undefined {
  const placements = [...orderedPlacements];
  const pathIndex = new Map(
    criticalPath.map((point, index) => [pointKey(point), index] as const),
  );
  const attachmentIndexByRecipe = new Map<number, number>();
  orderedPlacements.forEach((point, index) => {
    const attachmentIndex = pathIndex.get(pointKey(point));
    if (attachmentIndex !== undefined) attachmentIndexByRecipe.set(index, attachmentIndex);
  });
  if (
    difficulty === "movement" ||
    difficulty === "gentle" ||
    terrain.length < 13
  ) {
    return {
      placements,
      reservedBranchTiles: new Set<string>(),
      attachmentIndexByRecipe,
    };
  }

  const firstIndex = (predicate: (entry: RecipeEntry) => boolean): number =>
    recipe.findIndex(predicate);
  const desiredDetours = [
    {
      itemIndex: firstIndex((entry) => entry.kind === "sword"),
      gateIndex: firstIndex((entry) => entry.kind === "enemy"),
    },
    {
      itemIndex: firstIndex((entry) => entry.kind === "potion"),
      gateIndex: firstIndex((entry) => entry.kind === "enemy" && entry.power === 4),
    },
    {
      itemIndex: firstIndex((entry) => entry.kind === "boots"),
      gateIndex: firstIndex((entry) => entry.kind === "hazard"),
    },
    {
      itemIndex: firstIndex((entry) => entry.kind === "spring-boots"),
      gateIndex: firstIndex((entry) => entry.kind === "hole"),
    },
    {
      itemIndex: firstIndex((entry) => entry.kind === "key"),
      gateIndex: firstIndex((entry) => entry.kind === "door"),
    },
  ].filter(({ itemIndex, gateIndex }) => itemIndex >= 0 && gateIndex > itemIndex);

  const branchCandidates = findBranchCandidates(terrain, criticalPath);
  const reservedBranchTiles = new Set<string>();
  let detourCount = 0;

  for (const { itemIndex, gateIndex } of desiredDetours) {
    const gatePoint = orderedPlacements[gateIndex];
    const previousPoint = itemIndex > 0 ? orderedPlacements[itemIndex - 1] : criticalPath[0];
    if (gatePoint === undefined || previousPoint === undefined) continue;
    const upperBound = pathIndex.get(pointKey(gatePoint));
    const lowerBound = pathIndex.get(pointKey(previousPoint));
    if (upperBound === undefined || lowerBound === undefined) continue;

    const eligible = shuffle(branchCandidates, random)
      .filter((candidate) =>
        candidate.attachmentIndex >= lowerBound &&
        candidate.attachmentIndex < upperBound &&
        candidate.route.every((point) => !reservedBranchTiles.has(pointKey(point))),
      )
      .sort((left, right) => right.distance - left.distance);
    const candidate = eligible[0];
    if (candidate === undefined) continue;

    placements[itemIndex] = candidate.at;
    attachmentIndexByRecipe.set(itemIndex, candidate.attachmentIndex);
    for (const point of candidate.route) reservedBranchTiles.add(pointKey(point));
    detourCount += 1;
  }

  const minimumDetours = criticalPath.length >= 45 ? 2 : criticalPath.length >= 25 ? 1 : 0;
  return detourCount >= minimumDetours
    ? { placements, reservedBranchTiles, attachmentIndexByRecipe }
    : undefined;
}

interface HoleSegment {
  readonly holes: readonly Point[];
  readonly landing: Point;
}

/** Selects a straight, safely landable one- or two-tile jump on the main route. */
function chooseHoleSegment(
  criticalPath: readonly Point[],
  minimumPathIndex: number,
  preferredPathIndex: number,
  reserved: ReadonlySet<string>,
  random: RandomSource,
): HoleSegment | undefined {
  for (const length of [2, 1] as const) {
    const candidates: Array<HoleSegment & { readonly startIndex: number }> = [];
    for (
      let startIndex = Math.max(1, minimumPathIndex);
      startIndex + length < criticalPath.length;
      startIndex += 1
    ) {
      const approach = criticalPath[startIndex - 1];
      const firstHole = criticalPath[startIndex];
      const landing = criticalPath[startIndex + length];
      if (approach === undefined || firstHole === undefined || landing === undefined) continue;
      const dx = firstHole.x - approach.x;
      const dy = firstHole.y - approach.y;
      const holes = criticalPath.slice(startIndex, startIndex + length);
      const isStraight = holes.every((point, index) => {
        const previous = index === 0 ? approach : holes[index - 1];
        return previous !== undefined && point.x - previous.x === dx && point.y - previous.y === dy;
      }) && landing.x - (holes.at(-1)?.x ?? landing.x) === dx
        && landing.y - (holes.at(-1)?.y ?? landing.y) === dy;
      if (
        !isStraight ||
        holes.some((point) => reserved.has(pointKey(point))) ||
        reserved.has(pointKey(landing))
      ) {
        continue;
      }
      candidates.push({ holes, landing, startIndex });
    }

    const selected = shuffle(candidates, random)
      .sort(
        (left, right) =>
          Math.abs(left.startIndex - preferredPathIndex) -
          Math.abs(right.startIndex - preferredPathIndex),
      )[0];
    if (selected !== undefined) {
      return { holes: selected.holes, landing: selected.landing };
    }
  }
  return undefined;
}

function chooseAnimalPoints(
  terrain: readonly (readonly TerrainKind[])[],
  criticalPath: readonly Point[],
  unavailable: ReadonlySet<string>,
  rooms: readonly GeneratedRoom[],
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

  const roomPriority = shuffle(rooms, random).flatMap((room) => {
    const available = room.tiles
      .filter((point) => !unavailable.has(pointKey(point)))
      .sort((left, right) => {
        const leftDistance = Math.abs(left.x - room.doorway.x) + Math.abs(left.y - room.doorway.y);
        const rightDistance = Math.abs(right.x - room.doorway.x) + Math.abs(right.y - room.doorway.y);
        return rightDistance - leftDistance;
      });
    return available[0] === undefined ? [] : [available[0]];
  });
  const roomKeys = new Set(roomPriority.map(pointKey));
  const shuffled = shuffle(candidates.filter((point) => !roomKeys.has(pointKey(point))), random);
  const priority = (point: Point): number => {
    return floorNeighbors(terrain, point).length === 1 ? 0 : 1;
  };
  shuffled.sort((left, right) => priority(left) - priority(right));
  return [...roomPriority, ...shuffled].slice(0, ANIMALS_PER_LEVEL);
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
  const rooms = (difficulty === "movement" || difficulty === "gentle" || size < 13)
    ? []
    : carveDeadEndRooms(
      terrain,
      random,
      new Set([pointKey(start), pointKey(exit)]),
    );
  const minimumRoomCount = difficulty === "adventure" && size >= 17
    ? 2
    : difficulty === "growing" && size >= 13
      ? 1
      : 0;
  if (rooms.length < minimumRoomCount) return undefined;
  const criticalPath = findFloorPath(terrain, start, exit);
  const visuals = selectGeneratedVisuals(seedText, difficulty, size);
  const recipe = buildRecipe(difficulty, random, size);
  const orderedPlacements = chooseOrderedPoints(criticalPath, recipe.length);
  if (orderedPlacements.length !== recipe.length) {
    return undefined;
  }
  const branched = movePrerequisitesOntoBranches(
    terrain,
    criticalPath,
    recipe,
    orderedPlacements,
    difficulty,
    random,
  );
  if (branched === undefined) {
    return undefined;
  }
  const placements = branched.placements;

  // v5 adds single-door rooms and room encounters without changing the safely
  // ordered main progression recipe.
  const id = `surprise-v5-${seedIdentity(seedText)}-${difficulty}-${size}`;
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
    if (entry.kind === "hole") continue;

    const objectId = `${id}-${entry.kind}-${index + 1}`;
    switch (entry.kind) {
      case "sword":
        objects.push({ id: objectId, kind: "sword", at, style: visuals.weaponStyle });
        break;
      case "boots":
        objects.push({ id: objectId, kind: "boots", at });
        break;
      case "spring-boots":
        objects.push({ id: objectId, kind: "spring-boots", at });
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

  const pathIndex = new Map(
    criticalPath.map((point, index) => [pointKey(point), index] as const),
  );
  const holeRecipeIndex = recipe.findIndex((entry) => entry.kind === "hole");
  const springBootsRecipeIndex = recipe.findIndex(
    (entry) => entry.kind === "spring-boots",
  );
  const reservedBeforeTerrain = new Set<string>([
    pointKey(start),
    pointKey(exit),
    ...objects.map((object) => pointKey(object.at)),
    ...hazards.map((hazard) => pointKey(hazard.at)),
    ...branched.reservedBranchTiles,
  ]);
  let holeSegment: HoleSegment | undefined;
  if (holeRecipeIndex >= 0 && springBootsRecipeIndex >= 0) {
    const preferredPoint = orderedPlacements[holeRecipeIndex];
    const springAttachment = branched.attachmentIndexByRecipe.get(
      springBootsRecipeIndex,
    );
    if (preferredPoint === undefined || springAttachment === undefined) return undefined;
    const preferredPathIndex = pathIndex.get(pointKey(preferredPoint));
    if (preferredPathIndex === undefined) return undefined;
    holeSegment = chooseHoleSegment(
      criticalPath,
      springAttachment + 1,
      preferredPathIndex,
      reservedBeforeTerrain,
      random,
    );
    if (holeSegment === undefined) return undefined;
    for (const hole of holeSegment.holes) {
      const row = terrain[hole.y];
      if (row === undefined || row[hole.x] !== "floor") return undefined;
      row[hole.x] = "hole";
      reservedBeforeTerrain.add(pointKey(hole));
    }
    reservedBeforeTerrain.add(pointKey(holeSegment.landing));
  }

  if (hazards.length > 0) {
    const bootsPlacementIndex = recipe.findIndex((entry) => entry.kind === "boots");
    const bootsPathIndex = branched.attachmentIndexByRecipe.get(bootsPlacementIndex);
    if (bootsPathIndex === undefined) return undefined;
    const reserved = new Set<string>([
      ...reservedBeforeTerrain,
      ...placements.map(pointKey),
    ]);
    for (const hazard of hazards) {
      if (!growHazardCluster(
        terrain,
        hazard,
        pathIndex,
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
    ...branched.reservedBranchTiles,
  ]);
  const animalPoints = chooseAnimalPoints(
    terrain,
    criticalPath,
    unavailable,
    rooms,
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

  const occupied = new Set<string>([
    pointKey(start),
    pointKey(exit),
    ...objects.map((object) => pointKey(object.at)),
  ]);
  const bonusDeadEnds: Point[] = [];
  for (let y = 1; y < terrain.length - 1; y += 1) {
    for (let x = 1; x < (terrain[y]?.length ?? 1) - 1; x += 1) {
      const at = { x, y };
      if (
        terrain[y]?.[x] === "floor"
        && floorNeighbors(terrain, at).length === 1
        && !occupied.has(pointKey(at))
      ) bonusDeadEnds.push(at);
    }
  }
  const roomRewardPoints = shuffle(rooms, random).flatMap((room) => room.tiles
    .filter((point) => pointKey(point) !== pointKey(room.doorway) && !occupied.has(pointKey(point)))
    .sort((left, right) => {
      const leftDistance = Math.abs(left.x - room.doorway.x) + Math.abs(left.y - room.doorway.y);
      const rightDistance = Math.abs(right.x - room.doorway.x) + Math.abs(right.y - room.doorway.y);
      return rightDistance - leftDistance;
    })
    .slice(0, 1));
  const roomRewardKeys = new Set(roomRewardPoints.map(pointKey));
  const shuffledBonuses = [
    ...roomRewardPoints,
    ...shuffle(bonusDeadEnds.filter((point) => !roomRewardKeys.has(pointKey(point))), random),
  ];
  const treasureCount = difficulty === "movement" ? 0 : Math.min(
    shuffledBonuses.length,
    size >= 17 ? 4 : size >= 13 ? 3 : 2,
  );
  const treasureStyles = ["gold-bag", "science-gears", "gold-chest", "science-beaker"] as const;
  for (let index = 0; index < treasureCount; index += 1) {
    const at = shuffledBonuses[index];
    const style = treasureStyles[index % treasureStyles.length]!;
    if (!at) continue;
    objects.push({
      id: `${id}-treasure-${index + 1}`,
      kind: "treasure",
      at,
      currency: style.startsWith("gold") ? "gold" : "science",
      amount: style === "gold-chest" || style === "science-beaker" ? 4 : 2,
      style,
    });
    occupied.add(pointKey(at));
  }

  const occupiedRoomIndexes = rooms.flatMap((room, index) => (
    room.tiles.some((point) => occupied.has(pointKey(point))) ? [index] : []
  ));
  const guardianCount = difficulty === "adventure"
    ? Math.min(2, occupiedRoomIndexes.length)
    : difficulty === "growing"
      ? Math.min(1, occupiedRoomIndexes.length)
      : 0;
  const guardianPowers = difficulty === "adventure" ? [6, 10] : [6];
  for (let index = 0; index < guardianCount; index += 1) {
    const room = rooms[occupiedRoomIndexes[index] ?? -1];
    if (room === undefined || occupied.has(pointKey(room.doorway))) continue;
    objects.push({
      id: `${id}-room-guardian-${index + 1}`,
      kind: "enemy",
      at: room.doorway,
      power: guardianPowers[index] ?? 6,
      style: visuals.enemyStyle,
    });
    occupied.add(pointKey(room.doorway));
  }
  const bonusEnemyCount = difficulty === "adventure"
    ? Math.min(1, shuffledBonuses.length - treasureCount)
    : 0;
  for (let index = 0; index < bonusEnemyCount; index += 1) {
    const at = shuffledBonuses[treasureCount + index];
    if (!at || occupied.has(pointKey(at))) continue;
    objects.push({
      id: `${id}-bonus-enemy-${index + 1}`,
      kind: "enemy",
      at,
      power: 1 + index,
      style: visuals.enemyStyle,
    });
  }

  return {
    schemaVersion: 1,
    id,
    name: "Surprise Maze",
    objective: difficulty === "movement"
      ? "Find the sparkly star!"
      : recipe.some((entry) => entry.kind === "hole")
        ? "Explore the side paths, grow stronger, and bounce to the star!"
        : "Collect, grow, and find the star!",
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
    lightDirection: (["top", "right", "bottom", "left"] as const)[seedHash % 4],
    introducedMechanics: [...new Set([
      ...(difficulty === "movement"
        ? ["movement", "exit", ...recipe.map((entry) => entry.kind)]
        : recipe.map((entry) => entry.kind)),
      "animal-rescue",
      ...(rooms.length > 0 ? ["room-layout", "treasure-room"] : []),
      ...(guardianCount > 0 ? ["monster-room", "come-back-stronger"] : []),
    ])],
  };
}

/**
 * Produces the same validated perfect maze for the same seed/options on every
 * run. Progression gates are ordered safely, while adventure mazes may place a
 * prerequisite on a side branch so the player has to explore and backtrack.
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
    if (level !== undefined) {
      const ordinary = solveLevel(level);
      if (
        ordinary.solvable
        && ordinary.finalState?.rescuedAnimalIds.length === 0
        && validateLevel(level, { requireAllAnimals: true }).valid
      ) {
        return level;
      }
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
