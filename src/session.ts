import { pointsEqual } from "./game/engine";
import { CURATED_LEVELS } from "./game/levels";
import { gameplayFingerprintForRules } from "./game/contentIdentity";
import { emptyLoot, legacyCreditedLoot, migrateAuthoredLoot, sanitizeLoot, finishLootClaims } from "./game/loot";
import type { TileKey } from "./game/exploration";
import type {
  GameState,
  KeyColor,
  LevelDefinition,
  LevelObject,
  Point,
} from "./game/types";

/** Durable normal-run snapshots, including a recoverable pending exit choice. */
export const ACTIVE_RUN_SCHEMA_VERSION = 5 as const;
export const ACTIVE_RUN_STORAGE_KEY = "maze-so-puzzle-active-run-v5";
export const VERSION_FOUR_ACTIVE_RUN_STORAGE_KEY = "maze-so-puzzle-active-run-v4";
export const VERSION_THREE_ACTIVE_RUN_STORAGE_KEY = "maze-so-puzzle-active-run-v3";
export const VERSION_TWO_ACTIVE_RUN_STORAGE_KEY = "maze-so-puzzle-active-run-v2";
export const LEGACY_ACTIVE_RUN_STORAGE_KEY = "maze-so-puzzle-active-run-v1";

export type ActiveRunMode = "normal" | "tester";

export interface ActiveRunSnapshot {
  readonly schemaVersion: typeof ACTIVE_RUN_SCHEMA_VERSION;
  /** Stable for this attempt and reused as the exactly-once completion receipt. */
  readonly runId: string;
  readonly levelId: string;
  readonly contentRevision: number;
  readonly gameplayFingerprint: string;
  readonly game: GameState;
  readonly revealedTiles: readonly TileKey[];
  readonly hintUsesByState: Readonly<Record<string, number>>;
}

export interface ActiveRunInput {
  readonly runId: string;
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
  readonly persistence?: "protected" | "migration-unsaved" | "cleanup-failed";
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
const RUN_ID_PATTERN = /^(?:run|migrated)-[a-zA-Z0-9-]{8,160}$/;

export function createActiveRunId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `run-${crypto.randomUUID()}`;
  }
  return `run-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`;
}

function migratedRunId(value: unknown): string {
  const source = JSON.stringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `migrated-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

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

/** A one-hole approach may immediately activate a portal: compose, don't max. */
function maximumMovementStride(level: LevelDefinition): number {
  const approachStride = level.terrain.some((row) => row.includes("hole")) ? 2 : 1;

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
        + approachStride,
    );
  }

  return Math.max(approachStride, maximumPortalStride);
}

function sanitizeGameState(value: unknown, level: LevelDefinition,
  prior?: { version: number; runId: string }): GameState | null {
  if (!isRecord(value)) return null;
  const status = ownValue(value, "status");
  if (
    ownValue(value, "levelId") !== level.id
    || (status !== "playing" && status !== "won")
  ) return null;

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
  const rawExitArmed = ownValue(value, "exitArmed");
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
  const exitArmed = rawExitArmed === undefined ? true : rawExitArmed;
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
    || typeof exitArmed !== "boolean"
  ) {
    return null;
  }

  const terrain = level.terrain[position.y]?.[position.x];
  const onExit = pointsEqual(position, level.exit);
  if (
    !terrain
    || terrain === "wall"
    || terrain === "hole"
    || (status === "won" && (!onExit || exitArmed))
    || (status === "playing" && onExit !== !exitArmed)
  ) return null;

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
  if (
    hasSword !== collectedSword
    || hasBoots !== collectedBoots
    || hasSpringBoots !== collectedSpringBoots
    || hasAntidoteLeaf !== collectedAntidoteLeaf
    || !equalStrings(keys, derivedKeys)
    || calculatedPower === null
    || power !== calculatedPower
    || ((terrain === "water" || terrain === "lava") && !hasBoots)
    || (terrain === "poison" && !hasAntidoteLeaf)
    || !positionObjectIsResolved(objectAt(level, position), collected, rescued, defeated, opened)
  ) {
    return null;
  }

  const distanceFromStart = Math.abs(position.x - level.start.x) + Math.abs(position.y - level.start.y);
  const movementStride = maximumMovementStride(level);
  const stationaryObjectsArePlausible = [...rescued, ...defeated, ...opened].every((id) => {
    const object = objectsById.get(id);
    return object !== undefined
      && Math.abs(object.at.x - level.start.x) + Math.abs(object.at.y - level.start.y)
        <= steps * movementStride + 1;
  });
  const openedDoorsMatchKeys = [...opened].every((id) => {
    const object = objectsById.get(id);
    return object?.kind === "door" && keys.includes(object.color);
  });
  if (
    distanceFromStart > steps * movementStride
    || collected.size > steps
    || !stationaryObjectsArePlausible
    || !openedDoorsMatchKeys
    || (defeated.size > 0 && !hasSword)
  ) {
    return null;
  }

  const game: GameState = {
    loot: emptyLoot(),
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
    exitArmed,
    status,
    steps,
  };
  if (prior?.version === 4) return migrateAuthoredLoot(ownValue(value,"loot"),level,game,prior.runId);
  const loot = prior ? sanitizeLoot(legacyCreditedLoot(level,game,prior.runId),level,game)
    : sanitizeLoot(ownValue(value, "loot"), level, game);
  return loot ? { ...game, loot } : null;
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
  const runId = ownValue(value, "runId");
  if (typeof runId !== "string" || !RUN_ID_PATTERN.test(runId)) return null;
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
  if (!game || game.loot.runId !== runId || !revealedTiles) return null;
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
    runId,
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
    runId: input.runId,
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

/** Exact historical fingerprints only. v4 preserves pending treasure; all old
 * defeated enemies retire without retroactive drops. */
function migratePrior(value: unknown, levels: readonly LevelDefinition[]): ActiveRunSnapshot | null {
  if (!isRecord(value) || ![2,3,4].includes(value.schemaVersion as number)) return null;
  const matches = levels.filter(l => l.id === value.levelId && l.source === "curated");
  const level = matches.length === 1 ? matches[0] : undefined;
  if (!level || value.contentRevision !== level.contentRevision
    || value.gameplayFingerprint !== gameplayFingerprintForRules(level, value.schemaVersion === 4 ? 4 : 3)) return null;
  const runId = value.schemaVersion === 2 ? migratedRunId(value) : value.runId;
  if (typeof runId !== "string" || !RUN_ID_PATTERN.test(runId)) return null;
  const game = sanitizeGameState(value.game,level,{ version: value.schemaVersion as number, runId });
  if (!game) return null;
  return sanitizeActiveRunSnapshot({
    ...value, schemaVersion: ACTIVE_RUN_SCHEMA_VERSION,
    runId,
    gameplayFingerprint: level.gameplayFingerprint,
    game: finishLootClaims(game),
  }, levels);
}

function updatedContent(value: unknown, levels: readonly LevelDefinition[]): boolean {
  if (!isRecord(value) || ![1,2,3,4,5].includes(value.schemaVersion as number)) return false;
  const level = levels.find(l => l.id === value.levelId && l.source === "curated");
  return !!level && (value.schemaVersion === 1 || value.contentRevision !== level.contentRevision
    || value.gameplayFingerprint !== (value.schemaVersion === 5
      ? level.gameplayFingerprint : gameplayFingerprintForRules(level, value.schemaVersion === 4 ? 4 : 3)));
}

const PRIOR_KEYS = [VERSION_FOUR_ACTIVE_RUN_STORAGE_KEY, VERSION_THREE_ACTIVE_RUN_STORAGE_KEY, VERSION_TWO_ACTIVE_RUN_STORAGE_KEY, LEGACY_ACTIVE_RUN_STORAGE_KEY] as const;
function removePrior(target: ActiveRunStorage): boolean {
  // Remove oldest first, stopping on failure. An authoritative newer record
  // remains to shadow every older key that could not be removed.
  for (const key of [...PRIOR_KEYS].reverse()) if (!safelyRemove(target,key)) return false;
  return true;
}

/** An authoritative malformed/future record blocks routine overwrites and
 * deletion. Do not fall back to an older run hidden underneath it. */
function protectedRecord(target: ActiveRunStorage, levels: readonly LevelDefinition[]): boolean {
  try {
    const raw = target.getItem(ACTIVE_RUN_STORAGE_KEY);
    if (raw !== null) {
      const value: unknown = JSON.parse(raw);
      return !sanitizeActiveRunSnapshot(value, levels)
        && !(isRecord(value) && value.schemaVersion === 5 && updatedContent(value, levels));
    }
    for (const key of PRIOR_KEYS) {
      const prior = target.getItem(key);
      if (prior === null) continue;
      const value: unknown = JSON.parse(prior);
      return !migratePrior(value, levels) && !updatedContent(value, levels);
    }
    return false;
  } catch { return true; }
}

/** Persist only coherent normal runs. Invalid inputs never erase a save. */
export function writeActiveRun(input: ActiveRunInput,
  storage: ActiveRunStorage | null | undefined = undefined): boolean {
  const target = storage === undefined ? browserStorage() : storage;
  if (target === null) return false;
  const levels = [...CURATED_LEVELS.filter(l => l.id !== input.level.id), input.level];
  if (protectedRecord(target, levels)) return false;
  const snapshot = createActiveRunSnapshot(input);
  if (!snapshot) return false;
  try {
    target.setItem(ACTIVE_RUN_STORAGE_KEY, JSON.stringify(snapshot));
    return removePrior(target);
  } catch { return false; }
}

/** Current key is authoritative, even when unreadable. A migration writes v5
 * before attempting old-key cleanup; denied writes preserve the original bytes. */
export function readActiveRunResult(curatedLevels: readonly LevelDefinition[],
  storage: ActiveRunStorage | null | undefined = undefined): ActiveRunReadResult {
  const target = storage === undefined ? browserStorage() : storage;
  const empty = { snapshot: null, discardedUpdatedRun: false } as const;
  if (target === null) return empty;
  try {
    const stored = target.getItem(ACTIVE_RUN_STORAGE_KEY);
    if (stored !== null) {
      const parsed: unknown = JSON.parse(stored);
      const snapshot = sanitizeActiveRunSnapshot(parsed, curatedLevels);
      if (snapshot) {
        const game = finishLootClaims(snapshot.game);
        if (game === snapshot.game) return { snapshot, discardedUpdatedRun: false };
        const settled = { ...snapshot, game };
        try { target.setItem(ACTIVE_RUN_STORAGE_KEY, JSON.stringify(settled)); }
        catch { return { snapshot: settled, discardedUpdatedRun: false, persistence: "migration-unsaved" }; }
        return { snapshot: settled, discardedUpdatedRun: false };
      }
      if (isRecord(parsed) && parsed.schemaVersion === 5 && updatedContent(parsed, curatedLevels)) {
        const removed = removePrior(target) && safelyRemove(target);
        return { snapshot: null, discardedUpdatedRun: true, ...(!removed ? { persistence: "protected" as const } : {}) };
      }
      return { ...empty, persistence: "protected" };
    }
    for (const key of PRIOR_KEYS) {
      const storedPrior = target.getItem(key);
      if (storedPrior === null) continue;
      const prior: unknown = JSON.parse(storedPrior);
      const snapshot = migratePrior(prior, curatedLevels);
      if (snapshot) {
        try { target.setItem(ACTIVE_RUN_STORAGE_KEY, JSON.stringify(snapshot)); }
        catch { return { snapshot, discardedUpdatedRun: false, persistence: "migration-unsaved" }; }
        const removed = removePrior(target);
        return { snapshot, discardedUpdatedRun: false, ...(!removed ? { persistence: "cleanup-failed" as const } : {}) };
      }
      if (updatedContent(prior, curatedLevels)) {
        const removed = removePrior(target);
        return { snapshot: null, discardedUpdatedRun: true, ...(!removed ? { persistence: "protected" as const } : {}) };
      }
      return { ...empty, persistence: "protected" };
    }
    return empty;
  } catch { return { ...empty, persistence: "protected" }; }
}

export function readActiveRun(curatedLevels: readonly LevelDefinition[],
  storage: ActiveRunStorage | null | undefined = undefined): ActiveRunSnapshot | null {
  return readActiveRunResult(curatedLevels, storage).snapshot;
}

/** Routine navigation preserves protected records. Explicit profile reset owns
 * the separate, confirmed application-key removal allowlist. */
export function clearActiveRun(storage: ActiveRunStorage | null | undefined = undefined): boolean {
  const target = storage === undefined ? browserStorage() : storage;
  if (target === null || protectedRecord(target, CURATED_LEVELS)) return false;
  // Do not discard the sole durable copy after a failed migration write.
  try {
    if (target.getItem(ACTIVE_RUN_STORAGE_KEY) === null
      && [VERSION_FOUR_ACTIVE_RUN_STORAGE_KEY,VERSION_THREE_ACTIVE_RUN_STORAGE_KEY,VERSION_TWO_ACTIVE_RUN_STORAGE_KEY].some(key=>{
        const raw=target.getItem(key);
        return raw!==null && migratePrior(JSON.parse(raw),CURATED_LEVELS)!==null;
      })) return false;
  } catch { return false; }
  return removePrior(target) && safelyRemove(target);
}
