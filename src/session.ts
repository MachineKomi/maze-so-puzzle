import { pointsEqual } from "./game/engine";
import type { TileKey } from "./game/exploration";
import type {
  GameState,
  KeyColor,
  LevelDefinition,
  LevelObject,
  Point,
} from "./game/types";

/** Durable normal-run snapshots. Completion rewards remain in `progress.ts`. */
export const ACTIVE_RUN_SCHEMA_VERSION = 1 as const;
export const ACTIVE_RUN_STORAGE_KEY = "maze-so-puzzle-active-run-v1";

export type ActiveRunMode = "normal" | "tester";

export interface ActiveRunSnapshot {
  readonly schemaVersion: typeof ACTIVE_RUN_SCHEMA_VERSION;
  readonly levelId: string;
  readonly game: GameState;
  readonly revealedTiles: readonly TileKey[];
}

export interface ActiveRunInput {
  readonly mode: ActiveRunMode;
  readonly level: LevelDefinition;
  readonly game: GameState;
  readonly revealedTiles: Iterable<TileKey>;
}

/** The narrow localStorage surface used here also makes storage behavior testable. */
export interface ActiveRunStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

type ObjectKind = LevelObject["kind"];

const KEY_COLORS: readonly KeyColor[] = ["red", "blue", "yellow"];
const COLLECTABLE_KINDS: readonly ObjectKind[] = ["sword", "boots", "potion", "key"];
const TILE_KEY_PATTERN = /^(0|[1-9]\d*),(0|[1-9]\d*)$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function ownValue(value: Record<string, unknown>, key: string): unknown {
  return Object.hasOwn(value, key) ? value[key] : undefined;
}

function isSafeNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function sanitizePoint(value: unknown): Point | null {
  if (!isRecord(value)) return null;
  const x = ownValue(value, "x");
  const y = ownValue(value, "y");
  if (!isSafeNonNegativeInteger(x) || !isSafeNonNegativeInteger(y)) return null;
  return { x, y };
}

function isKeyColor(value: unknown): value is KeyColor {
  return typeof value === "string" && (KEY_COLORS as readonly string[]).includes(value);
}

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort();
}

function equalStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function sanitizeObjectIds(
  value: unknown,
  objectsById: ReadonlyMap<string, LevelObject>,
  allowedKinds: readonly ObjectKind[],
): string[] | null {
  if (!Array.isArray(value)) return null;
  const ids: string[] = [];

  for (const candidate of value) {
    if (typeof candidate !== "string") return null;
    const object = objectsById.get(candidate);
    if (!object || !allowedKinds.includes(object.kind)) return null;
    ids.push(candidate);
  }

  return sortedUnique(ids);
}

function sanitizeKeys(value: unknown): KeyColor[] | null {
  if (!Array.isArray(value)) return null;
  const keys: KeyColor[] = [];
  for (const candidate of value) {
    if (!isKeyColor(candidate)) return null;
    keys.push(candidate);
  }
  return [...new Set(keys)].sort() as KeyColor[];
}

function expectedPower(
  level: LevelDefinition,
  collectedIds: ReadonlySet<string>,
  defeatedIds: ReadonlySet<string>,
): number | null {
  let power = level.initialPower;
  for (const object of level.objects) {
    if (object.kind === "potion" && collectedIds.has(object.id)) power += object.amount;
    if (object.kind === "enemy" && defeatedIds.has(object.id)) power += object.power;
    if (!Number.isSafeInteger(power)) return null;
  }
  return power;
}

function objectAt(level: LevelDefinition, point: Point): LevelObject | undefined {
  return level.objects.find((object) => pointsEqual(object.at, point));
}

function positionObjectIsResolved(
  object: LevelObject | undefined,
  collectedIds: ReadonlySet<string>,
  rescuedIds: ReadonlySet<string>,
  defeatedIds: ReadonlySet<string>,
  openedIds: ReadonlySet<string>,
): boolean {
  if (!object) return true;
  switch (object.kind) {
    case "enemy": return defeatedIds.has(object.id);
    case "door": return openedIds.has(object.id);
    case "animal": return rescuedIds.has(object.id);
    case "sword":
    case "boots":
    case "potion":
    case "key":
      return collectedIds.has(object.id);
  }
}

function sanitizeGameState(value: unknown, level: LevelDefinition): GameState | null {
  if (!isRecord(value)) return null;
  if (ownValue(value, "levelId") !== level.id || ownValue(value, "status") !== "playing") return null;

  const position = sanitizePoint(ownValue(value, "position"));
  const power = ownValue(value, "power");
  const steps = ownValue(value, "steps");
  const hasSword = ownValue(value, "hasSword");
  const hasBoots = ownValue(value, "hasBoots");
  if (
    !position
    || !isSafeNonNegativeInteger(power)
    || !isSafeNonNegativeInteger(steps)
    || typeof hasSword !== "boolean"
    || typeof hasBoots !== "boolean"
  ) {
    return null;
  }

  const terrain = level.terrain[position.y]?.[position.x];
  if (!terrain || terrain === "wall" || pointsEqual(position, level.exit)) return null;

  const objectIds = level.objects.map((object) => object.id);
  const objectsById = new Map(level.objects.map((object) => [object.id, object] as const));
  if (objectsById.size !== objectIds.length) return null;

  const keys = sanitizeKeys(ownValue(value, "keys"));
  const collectedObjectIds = sanitizeObjectIds(
    ownValue(value, "collectedObjectIds"),
    objectsById,
    COLLECTABLE_KINDS,
  );
  const rescuedAnimalIds = sanitizeObjectIds(
    ownValue(value, "rescuedAnimalIds"),
    objectsById,
    ["animal"],
  );
  const defeatedEnemyIds = sanitizeObjectIds(
    ownValue(value, "defeatedEnemyIds"),
    objectsById,
    ["enemy"],
  );
  const openedDoorIds = sanitizeObjectIds(
    ownValue(value, "openedDoorIds"),
    objectsById,
    ["door"],
  );
  if (!keys || !collectedObjectIds || !rescuedAnimalIds || !defeatedEnemyIds || !openedDoorIds) {
    return null;
  }

  const collected = new Set(collectedObjectIds);
  const rescued = new Set(rescuedAnimalIds);
  const defeated = new Set(defeatedEnemyIds);
  const opened = new Set(openedDoorIds);
  const derivedKeys = sortedUnique(level.objects.flatMap((object) => (
    object.kind === "key" && collected.has(object.id) ? [object.color] : []
  ))) as KeyColor[];
  const collectedSword = level.objects.some((object) => object.kind === "sword" && collected.has(object.id));
  const collectedBoots = level.objects.some((object) => object.kind === "boots" && collected.has(object.id));
  const calculatedPower = expectedPower(level, collected, defeated);
  if (
    hasSword !== collectedSword
    || hasBoots !== collectedBoots
    || !equalStrings(keys, derivedKeys)
    || calculatedPower === null
    || power !== calculatedPower
    || ((terrain === "water" || terrain === "lava") && !hasBoots)
    || !positionObjectIsResolved(objectAt(level, position), collected, rescued, defeated, opened)
  ) {
    return null;
  }

  const distanceFromStart = Math.abs(position.x - level.start.x) + Math.abs(position.y - level.start.y);
  const resolvedCount = collected.size + rescued.size + defeated.size + opened.size;
  if (
    distanceFromStart > steps
    || (steps - distanceFromStart) % 2 !== 0
    || resolvedCount > steps
  ) {
    return null;
  }

  return {
    levelId: level.id,
    position,
    power,
    hasSword,
    hasBoots,
    keys,
    collectedObjectIds,
    rescuedAnimalIds,
    defeatedEnemyIds,
    openedDoorIds,
    status: "playing",
    steps,
  };
}

function parseTileKey(value: unknown, level: LevelDefinition): { readonly key: TileKey; readonly x: number; readonly y: number } | null {
  if (typeof value !== "string") return null;
  const match = TILE_KEY_PATTERN.exec(value);
  if (!match) return null;
  const x = Number(match[1]);
  const y = Number(match[2]);
  if (!Number.isSafeInteger(x) || !Number.isSafeInteger(y) || x >= level.width || y >= level.height) {
    return null;
  }
  return { key: `${x},${y}`, x, y };
}

function sanitizeRevealedTiles(value: unknown, level: LevelDefinition): TileKey[] | null {
  if (!Array.isArray(value)) return null;
  const tiles = new Map<TileKey, { readonly x: number; readonly y: number }>();
  for (const candidate of value) {
    const parsed = parseTileKey(candidate, level);
    if (!parsed) return null;
    tiles.set(parsed.key, parsed);
  }
  return [...tiles.entries()]
    .sort((left, right) => left[1].y - right[1].y || left[1].x - right[1].x)
    .map(([key]) => key);
}

/**
 * Pure runtime boundary for untrusted persisted data. A snapshot is accepted
 * only when it identifies exactly one supplied curated level and represents a
 * coherent, still-playing engine state.
 */
export function sanitizeActiveRunSnapshot(
  value: unknown,
  curatedLevels: readonly LevelDefinition[],
): ActiveRunSnapshot | null {
  if (!isRecord(value) || ownValue(value, "schemaVersion") !== ACTIVE_RUN_SCHEMA_VERSION) return null;
  const levelId = ownValue(value, "levelId");
  if (typeof levelId !== "string" || levelId.length === 0 || levelId !== levelId.trim()) return null;
  const matches = curatedLevels.filter((level) => level.id === levelId && level.source === "curated");
  if (matches.length !== 1) return null;
  const level = matches[0];
  if (!level) return null;

  const game = sanitizeGameState(ownValue(value, "game"), level);
  const revealedTiles = sanitizeRevealedTiles(ownValue(value, "revealedTiles"), level);
  if (!game || !revealedTiles) return null;

  return {
    schemaVersion: ACTIVE_RUN_SCHEMA_VERSION,
    levelId,
    game,
    revealedTiles,
  };
}

/** Build a sanitized snapshot. Tester and generated runs deliberately return null. */
export function createActiveRunSnapshot(input: ActiveRunInput): ActiveRunSnapshot | null {
  if (input.mode !== "normal" || input.level.source !== "curated") return null;
  let revealedTiles: unknown[];
  try {
    revealedTiles = [...input.revealedTiles];
  } catch {
    return null;
  }
  return sanitizeActiveRunSnapshot({
    schemaVersion: ACTIVE_RUN_SCHEMA_VERSION,
    levelId: input.level.id,
    game: input.game,
    revealedTiles,
  }, [input.level]);
}

function browserStorage(): ActiveRunStorage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function safelyRemove(storage: ActiveRunStorage): boolean {
  try {
    storage.removeItem(ACTIVE_RUN_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/**
 * Persist the current normal curated run. Non-persistable or invalid inputs
 * clear any stale run so a later reload can never resume the wrong adventure.
 */
export function writeActiveRun(
  input: ActiveRunInput,
  storage: ActiveRunStorage | null | undefined = undefined,
): boolean {
  const target = storage === undefined ? browserStorage() : storage;
  if (target === null) return false;
  const snapshot = createActiveRunSnapshot(input);
  if (!snapshot) {
    safelyRemove(target);
    return false;
  }
  try {
    target.setItem(ACTIVE_RUN_STORAGE_KEY, JSON.stringify(snapshot));
    return true;
  } catch {
    return false;
  }
}

/** Read and validate a run. Corrupt or obsolete data is removed and ignored. */
export function readActiveRun(
  curatedLevels: readonly LevelDefinition[],
  storage: ActiveRunStorage | null | undefined = undefined,
): ActiveRunSnapshot | null {
  const target = storage === undefined ? browserStorage() : storage;
  if (target === null) return null;
  try {
    const stored = target.getItem(ACTIVE_RUN_STORAGE_KEY);
    if (stored === null) return null;
    let parsed: unknown;
    try {
      parsed = JSON.parse(stored) as unknown;
    } catch {
      safelyRemove(target);
      return null;
    }
    const snapshot = sanitizeActiveRunSnapshot(parsed, curatedLevels);
    if (!snapshot) safelyRemove(target);
    return snapshot;
  } catch {
    return null;
  }
}

/** Remove an active-run snapshot without allowing storage errors to escape. */
export function clearActiveRun(
  storage: ActiveRunStorage | null | undefined = undefined,
): boolean {
  const target = storage === undefined ? browserStorage() : storage;
  return target === null ? false : safelyRemove(target);
}
