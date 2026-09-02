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
export const ACTIVE_RUN_SCHEMA_VERSION = 2 as const;
export const ACTIVE_RUN_STORAGE_KEY = "maze-so-puzzle-active-run-v2";
export const LEGACY_ACTIVE_RUN_STORAGE_KEY = "maze-so-puzzle-active-run-v1";

export type ActiveRunMode = "normal" | "tester";

export interface ActiveRunSnapshot {
  readonly schemaVersion: typeof ACTIVE_RUN_SCHEMA_VERSION;
  readonly levelId: string;
  readonly contentRevision: number;
  readonly gameplayFingerprint: string;
  readonly game: GameState;
  readonly revealedTiles: readonly TileKey[];
  readonly hintUsesByState: Readonly<Record<string, number>>;
}

export interface ActiveRunInput {
  readonly mode: ActiveRunMode;
  readonly level: LevelDefinition;
  readonly game: GameState;
  readonly revealedTiles: Iterable<TileKey>;
  readonly hintUsesByState?: Readonly<Record<string, number>>;
}

/** The narrow localStorage surface used here also makes storage behavior testable. */
export interface ActiveRunStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface ActiveRunReadResult {
  readonly snapshot: ActiveRunSnapshot | null;
  /** True only when a known maze existed but its persisted content identity was obsolete. */
  readonly discardedUpdatedRun: boolean;
}

type ObjectKind = LevelObject["kind"];

const KEY_COLORS: readonly KeyColor[] = ["red", "blue", "yellow"];
const COLLECTABLE_KINDS: readonly ObjectKind[] = [
  "sword",
  "boots",
  "spring-boots",
  "antidote-leaf",
  "potion",
  "key",
  "treasure",
];
const TILE_KEY_PATTERN = /^(0|[1-9]\d*),(0|[1-9]\d*)$/;
const MAX_SAVED_HINT_USES_PER_STATE = 4;
const MAX_SAVED_HINT_STATES = 256;

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
    case "portal": return true;
    case "treasure":
    case "sword":
    case "boots":
    case "spring-boots":
    case "antidote-leaf":
    case "potion":
    case "key":
      return collectedIds.has(object.id);
  }
}

/** One input can clear a straight run of holes and land on the following tile. */
function maximumMovementStride(level: LevelDefinition): number {
  let maximumHoleRun = 0;

  for (const row of level.terrain) {
    let run = 0;
    for (const terrain of row) {
      run = terrain === "hole" ? run + 1 : 0;
      maximumHoleRun = Math.max(maximumHoleRun, run);
    }
  }

  for (let x = 0; x < level.width; x += 1) {
    let run = 0;
    for (let y = 0; y < level.height; y += 1) {
      run = level.terrain[y]?.[x] === "hole" ? run + 1 : 0;
      maximumHoleRun = Math.max(maximumHoleRun, run);
    }
  }

  let maximumPortalStride = 1;
  const portals = level.objects.filter(
    (object): object is Extract<LevelObject, { kind: "portal" }> => object.kind === "portal",
  );
  for (const entrance of portals) {
    const destination = portals.find(
      (candidate) => candidate.id !== entrance.id && candidate.pair === entrance.pair,
    );
    if (!destination) continue;
    maximumPortalStride = Math.max(
      maximumPortalStride,
      Math.abs(entrance.at.x - destination.at.x)
        + Math.abs(entrance.at.y - destination.at.y)
        + 1,
    );
  }

  return Math.max(maximumHoleRun + 1, maximumPortalStride);
}

function sanitizeGameState(value: unknown, level: LevelDefinition): GameState | null {
  if (!isRecord(value)) return null;
  if (ownValue(value, "levelId") !== level.id || ownValue(value, "status") !== "playing") return null;

  const position = sanitizePoint(ownValue(value, "position"));
  const power = ownValue(value, "power");
  const steps = ownValue(value, "steps");
  const hasSword = ownValue(value, "hasSword");
  const hasBoots = ownValue(value, "hasBoots");
  // Pre-0.9 active runs did not contain this field; migrate them as not found.
  const rawHasSpringBoots = ownValue(value, "hasSpringBoots");
  // Pre-poison active runs did not contain this field. Any level now using
  // poison or its antidote has changed traversal rules, so its old in-progress
  // snapshot cannot be restored safely.
  const rawHasAntidoteLeaf = ownValue(value, "hasAntidoteLeaf");
  const rawGoldStarsCollected = ownValue(value, "goldStarsCollected");
  const rawSciencePointsCollected = ownValue(value, "sciencePointsCollected");
  // Levels containing Spring Boots changed topology in 0.9. An older snapshot
  // cannot prove which side of the new hole gate it belongs on, so discard only
  // that active run while preserving the player's separate campaign progress.
  if (
    rawHasSpringBoots === undefined
    && level.objects.some((object) => object.kind === "spring-boots")
  ) {
    return null;
  }
  const hasSpringBoots = rawHasSpringBoots === undefined ? false : rawHasSpringBoots;
  if (
    rawHasAntidoteLeaf === undefined
    && (
      level.objects.some((object) => object.kind === "antidote-leaf")
      || level.terrain.some((row) => row.includes("poison"))
    )
  ) {
    return null;
  }
  const hasAntidoteLeaf = rawHasAntidoteLeaf === undefined ? false : rawHasAntidoteLeaf;
  const goldStarsCollected = rawGoldStarsCollected === undefined ? 0 : rawGoldStarsCollected;
  const sciencePointsCollected = rawSciencePointsCollected === undefined ? 0 : rawSciencePointsCollected;
  if (
    !position
    || !isSafeNonNegativeInteger(power)
    || !isSafeNonNegativeInteger(steps)
    || typeof hasSword !== "boolean"
    || typeof hasBoots !== "boolean"
    || typeof hasSpringBoots !== "boolean"
    || typeof hasAntidoteLeaf !== "boolean"
    || !isSafeNonNegativeInteger(goldStarsCollected)
    || !isSafeNonNegativeInteger(sciencePointsCollected)
  ) {
    return null;
  }

  const terrain = level.terrain[position.y]?.[position.x];
  if (!terrain || terrain === "wall" || terrain === "hole" || pointsEqual(position, level.exit)) return null;

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
  const collectedSpringBoots = level.objects.some(
    (object) => object.kind === "spring-boots" && collected.has(object.id),
  );
  const collectedAntidoteLeaf = level.objects.some(
    (object) => object.kind === "antidote-leaf" && collected.has(object.id),
  );
  const calculatedPower = expectedPower(level, collected, defeated);
  const calculatedGoldStars = level.objects.reduce((sum, object) => (
    object.kind === "treasure" && object.currency === "gold" && collected.has(object.id)
      ? sum + object.amount
      : sum
  ), 0);
  const calculatedSciencePoints = level.objects.reduce((sum, object) => (
    object.kind === "treasure" && object.currency === "science" && collected.has(object.id)
      ? sum + object.amount
      : sum
  ), 0);
  if (
    hasSword !== collectedSword
    || hasBoots !== collectedBoots
    || hasSpringBoots !== collectedSpringBoots
    || hasAntidoteLeaf !== collectedAntidoteLeaf
    || !equalStrings(keys, derivedKeys)
    || calculatedPower === null
    || power !== calculatedPower
    || goldStarsCollected !== calculatedGoldStars
    || sciencePointsCollected !== calculatedSciencePoints
    || ((terrain === "water" || terrain === "lava") && !hasBoots)
    || (terrain === "poison" && !hasAntidoteLeaf)
    || !positionObjectIsResolved(objectAt(level, position), collected, rescued, defeated, opened)
  ) {
    return null;
  }

  const distanceFromStart = Math.abs(position.x - level.start.x) + Math.abs(position.y - level.start.y);
  // Pickups, rescues and doors resolve on movement steps. Combat deliberately
  // resolves in place without increasing `steps`, so defeated enemies cannot
  // participate in this movement-only plausibility bound.
  const movementResolvedCount = collected.size + rescued.size + opened.size;
  if (
    distanceFromStart > steps * maximumMovementStride(level)
    || movementResolvedCount > steps
  ) {
    return null;
  }

  return {
    levelId: level.id,
    position,
    power,
    hasSword,
    hasBoots,
    hasSpringBoots,
    hasAntidoteLeaf,
    keys,
    collectedObjectIds,
    rescuedAnimalIds,
    defeatedEnemyIds,
    openedDoorIds,
    goldStarsCollected,
    sciencePointsCollected,
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
  if (
    ownValue(value, "contentRevision") !== level.contentRevision
    || ownValue(value, "gameplayFingerprint") !== level.gameplayFingerprint
  ) return null;

  const game = sanitizeGameState(ownValue(value, "game"), level);
  const revealedTiles = sanitizeRevealedTiles(ownValue(value, "revealedTiles"), level);
  if (!game || !revealedTiles) return null;
  const rawHintUses = ownValue(value, "hintUsesByState");
  if (!isRecord(rawHintUses)) return null;
  if (Object.keys(rawHintUses).length > MAX_SAVED_HINT_STATES) return null;
  const hintUsesByState: Record<string, number> = {};
  for (const [key, candidate] of Object.entries(rawHintUses)) {
    if (
      key.length > 300
      || !isSafeNonNegativeInteger(candidate)
      || candidate > MAX_SAVED_HINT_USES_PER_STATE
    ) return null;
    hintUsesByState[key] = candidate;
  }

  return {
    schemaVersion: ACTIVE_RUN_SCHEMA_VERSION,
    levelId,
    contentRevision: level.contentRevision,
    gameplayFingerprint: level.gameplayFingerprint,
    game,
    revealedTiles,
    hintUsesByState,
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
  const boundedHintUses = Object.fromEntries(
    Object.entries(input.hintUsesByState ?? {}).slice(-MAX_SAVED_HINT_STATES),
  );
  return sanitizeActiveRunSnapshot({
    schemaVersion: ACTIVE_RUN_SCHEMA_VERSION,
    levelId: input.level.id,
    contentRevision: input.level.contentRevision,
    gameplayFingerprint: input.level.gameplayFingerprint,
    game: input.game,
    revealedTiles,
    hintUsesByState: boundedHintUses,
  }, [input.level]);
}

function browserStorage(): ActiveRunStorage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function safelyRemove(storage: ActiveRunStorage, key = ACTIVE_RUN_STORAGE_KEY): boolean {
  try {
    storage.removeItem(key);
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
    safelyRemove(target, LEGACY_ACTIVE_RUN_STORAGE_KEY);
    return false;
  }
  try {
    target.setItem(ACTIVE_RUN_STORAGE_KEY, JSON.stringify(snapshot));
    safelyRemove(target, LEGACY_ACTIVE_RUN_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

function referencesUpdatedContent(
  value: Record<string, unknown>,
  curatedLevels: readonly LevelDefinition[],
): boolean {
  const levelId = ownValue(value, "levelId");
  const level = typeof levelId === "string"
    ? curatedLevels.find((candidate) => candidate.id === levelId && candidate.source === "curated")
    : undefined;
  if (!level) return false;
  const schemaVersion = ownValue(value, "schemaVersion");
  return schemaVersion === 1
    ? level.contentRevision !== 1
    : schemaVersion === ACTIVE_RUN_SCHEMA_VERSION
      && (
        ownValue(value, "contentRevision") !== level.contentRevision
        || ownValue(value, "gameplayFingerprint") !== level.gameplayFingerprint
      );
}

/** Read, validate, and report the narrow user-visible updated-maze restart case. */
export function readActiveRunResult(
  curatedLevels: readonly LevelDefinition[],
  storage: ActiveRunStorage | null | undefined = undefined,
): ActiveRunReadResult {
  const target = storage === undefined ? browserStorage() : storage;
  if (target === null) return { snapshot: null, discardedUpdatedRun: false };
  try {
    const stored = target.getItem(ACTIVE_RUN_STORAGE_KEY);
    if (stored !== null) {
      let parsed: unknown;
      try {
        parsed = JSON.parse(stored) as unknown;
      } catch {
        safelyRemove(target);
        parsed = null;
      }
      if (parsed !== null) {
        const snapshot = sanitizeActiveRunSnapshot(parsed, curatedLevels);
        if (snapshot) return { snapshot, discardedUpdatedRun: false };
        const discardedUpdatedRun = isRecord(parsed)
          && referencesUpdatedContent(parsed, curatedLevels);
        safelyRemove(target);
        if (discardedUpdatedRun) {
          safelyRemove(target, LEGACY_ACTIVE_RUN_STORAGE_KEY);
          return { snapshot: null, discardedUpdatedRun: true };
        }
      }
    }

    const legacyStored = target.getItem(LEGACY_ACTIVE_RUN_STORAGE_KEY);
    if (legacyStored === null) return { snapshot: null, discardedUpdatedRun: false };
    try {
      const legacy = JSON.parse(legacyStored) as unknown;
      if (!isRecord(legacy) || ownValue(legacy, "schemaVersion") !== 1) {
        safelyRemove(target, LEGACY_ACTIVE_RUN_STORAGE_KEY);
        return { snapshot: null, discardedUpdatedRun: false };
      }
      const levelId = ownValue(legacy, "levelId");
      const level = typeof levelId === "string"
        ? curatedLevels.find((candidate) => candidate.id === levelId && candidate.source === "curated")
        : undefined;
      // Revision 1 is the only content whose old snapshot did not need a
      // fingerprint. Revised maps fail closed and retain durable progress.
      if (!level || level.contentRevision !== 1) {
        const discardedUpdatedRun = referencesUpdatedContent(legacy, curatedLevels);
        safelyRemove(target, LEGACY_ACTIVE_RUN_STORAGE_KEY);
        return { snapshot: null, discardedUpdatedRun };
      }
      const migrated = sanitizeActiveRunSnapshot({
        ...legacy,
        schemaVersion: ACTIVE_RUN_SCHEMA_VERSION,
        contentRevision: level.contentRevision,
        gameplayFingerprint: level.gameplayFingerprint,
        hintUsesByState: {},
      }, curatedLevels);
      if (!migrated) {
        safelyRemove(target, LEGACY_ACTIVE_RUN_STORAGE_KEY);
        return { snapshot: null, discardedUpdatedRun: false };
      }
      try {
        target.setItem(ACTIVE_RUN_STORAGE_KEY, JSON.stringify(migrated));
        safelyRemove(target, LEGACY_ACTIVE_RUN_STORAGE_KEY);
      } catch {
        // Keep the valid v1 source intact and still resume it in memory.
      }
      return { snapshot: migrated, discardedUpdatedRun: false };
    } catch {
      safelyRemove(target, LEGACY_ACTIVE_RUN_STORAGE_KEY);
      return { snapshot: null, discardedUpdatedRun: false };
    }
  } catch {
    return { snapshot: null, discardedUpdatedRun: false };
  }
}

/** Compatibility helper for callers that need only the validated snapshot. */
export function readActiveRun(
  curatedLevels: readonly LevelDefinition[],
  storage: ActiveRunStorage | null | undefined = undefined,
): ActiveRunSnapshot | null {
  return readActiveRunResult(curatedLevels, storage).snapshot;
}

/** Remove an active-run snapshot without allowing storage errors to escape. */
export function clearActiveRun(
  storage: ActiveRunStorage | null | undefined = undefined,
): boolean {
  const target = storage === undefined ? browserStorage() : storage;
  if (target === null) return false;
  const currentRemoved = safelyRemove(target);
  try {
    target.removeItem(LEGACY_ACTIVE_RUN_STORAGE_KEY);
  } catch {
    return false;
  }
  return currentRemoved;
}
