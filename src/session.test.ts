import { describe, expect, it } from "vitest";
import { createInitialGameState, movePlayer } from "./game/engine";
import { CURATED_LEVELS } from "./game/levels";
import { solveLevel } from "./game/solver";
import type { GameState, LevelDefinition } from "./game/types";
import {
  ACTIVE_RUN_STORAGE_KEY,
  clearActiveRun,
  createActiveRunSnapshot,
  readActiveRun,
  sanitizeActiveRunSnapshot,
  writeActiveRun,
  type ActiveRunSnapshot,
  type ActiveRunStorage,
} from "./session";

class MemoryStorage implements ActiveRunStorage {
  readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

function storyLevel(index = 0): LevelDefinition {
  const level = CURATED_LEVELS[index];
  if (!level) throw new Error(`Missing test story level ${index}.`);
  return level;
}

function progressedPlayingState(level: LevelDefinition): GameState {
  const solution = solveLevel(level);
  expect(solution.solvable).toBe(true);
  let state = createInitialGameState(level);
  for (const direction of solution.directions.slice(0, -1)) {
    const result = movePlayer(level, state, direction);
    expect(result.moved).toBe(true);
    state = result.state;
  }
  expect(state.status).toBe("playing");
  return state;
}

function rawSnapshot(level: LevelDefinition, game: GameState = createInitialGameState(level)): ActiveRunSnapshot {
  return {
    schemaVersion: 1,
    levelId: level.id,
    game,
    revealedTiles: [`${level.start.x},${level.start.y}`],
  };
}

describe("active run persistence", () => {
  it("round-trips a validated normal curated run", () => {
    const storage = new MemoryStorage();
    const level = storyLevel(1);
    const game = progressedPlayingState(level);

    expect(writeActiveRun({
      mode: "normal",
      level,
      game,
      revealedTiles: [`${game.position.x},${game.position.y}`, `${level.start.x},${level.start.y}`],
    }, storage)).toBe(true);

    expect(readActiveRun(CURATED_LEVELS, storage)).toEqual({
      schemaVersion: 1,
      levelId: level.id,
      game,
      revealedTiles: [`${game.position.x},${game.position.y}`, `${level.start.x},${level.start.y}`],
    });
  });

  it("fails closed and removes malformed JSON or the wrong schema", () => {
    const storage = new MemoryStorage();
    storage.setItem(ACTIVE_RUN_STORAGE_KEY, "{broken");
    expect(readActiveRun(CURATED_LEVELS, storage)).toBeNull();
    expect(storage.getItem(ACTIVE_RUN_STORAGE_KEY)).toBeNull();

    storage.setItem(ACTIVE_RUN_STORAGE_KEY, JSON.stringify({
      ...rawSnapshot(storyLevel()),
      schemaVersion: 2,
    }));
    expect(readActiveRun(CURATED_LEVELS, storage)).toBeNull();
    expect(storage.getItem(ACTIVE_RUN_STORAGE_KEY)).toBeNull();
  });

  it("rejects foreign level and object ids instead of partially restoring them", () => {
    const level = storyLevel(1);
    expect(sanitizeActiveRunSnapshot({
      ...rawSnapshot(level),
      levelId: "not-a-story",
      game: { ...createInitialGameState(level), levelId: "not-a-story" },
    }, CURATED_LEVELS)).toBeNull();

    expect(sanitizeActiveRunSnapshot({
      ...rawSnapshot(level),
      game: {
        ...createInitialGameState(level),
        collectedObjectIds: ["foreign-object"],
      },
    }, CURATED_LEVELS)).toBeNull();

    const enemyId = level.objects.find((object) => object.kind === "enemy")?.id;
    expect(enemyId).toBeDefined();
    expect(sanitizeActiveRunSnapshot({
      ...rawSnapshot(level),
      game: {
        ...createInitialGameState(level),
        collectedObjectIds: [enemyId],
      },
    }, CURATED_LEVELS)).toBeNull();
  });

  it("rejects invalid positions, power, steps, statuses, keys, and reveal coordinates", () => {
    const level = storyLevel(1);
    const initial = createInitialGameState(level);
    const invalidGames: unknown[] = [
      { ...initial, position: { x: 0, y: 0 } },
      { ...initial, position: { x: level.width, y: 1 } },
      { ...initial, power: Number.POSITIVE_INFINITY },
      { ...initial, power: initial.power + 1 },
      { ...initial, steps: -1 },
      { ...initial, steps: 0.5 },
      { ...initial, status: "won" },
      { ...initial, status: "paused" },
      { ...initial, keys: ["green"] },
      { ...initial, position: { ...level.exit } },
    ];

    for (const game of invalidGames) {
      expect(sanitizeActiveRunSnapshot({ ...rawSnapshot(level), game }, CURATED_LEVELS)).toBeNull();
    }

    for (const revealedTiles of [["bad"], ["-1,2"], [`${level.width},1`], [1]]) {
      expect(sanitizeActiveRunSnapshot({
        ...rawSnapshot(level),
        revealedTiles,
      }, CURATED_LEVELS)).toBeNull();
    }
  });

  it("deduplicates and normalizes valid state and revealed arrays against the level", () => {
    const level = storyLevel(1);
    const game = progressedPlayingState(level);
    const duplicate = <T,>(values: readonly T[]): T[] => [...values].reverse().flatMap((value) => [value, value]);
    const sanitized = sanitizeActiveRunSnapshot({
      schemaVersion: 1,
      levelId: level.id,
      game: {
        ...game,
        keys: duplicate(game.keys),
        collectedObjectIds: duplicate(game.collectedObjectIds),
        rescuedAnimalIds: duplicate(game.rescuedAnimalIds),
        defeatedEnemyIds: duplicate(game.defeatedEnemyIds),
        openedDoorIds: duplicate(game.openedDoorIds),
      },
      revealedTiles: [
        `${game.position.x},${game.position.y}`,
        `${level.start.x},${level.start.y}`,
        `${game.position.x},${game.position.y}`,
      ],
    }, CURATED_LEVELS);

    expect(sanitized?.game.keys).toEqual([...game.keys].sort());
    expect(sanitized?.game.collectedObjectIds).toEqual([...game.collectedObjectIds].sort());
    expect(sanitized?.game.rescuedAnimalIds).toEqual([...game.rescuedAnimalIds].sort());
    expect(sanitized?.game.defeatedEnemyIds).toEqual([...game.defeatedEnemyIds].sort());
    expect(sanitized?.game.openedDoorIds).toEqual([...game.openedDoorIds].sort());
    expect(sanitized?.revealedTiles).toEqual([
      `${game.position.x},${game.position.y}`,
      `${level.start.x},${level.start.y}`,
    ]);
  });

  it("never persists tester or generated runs and clears stale normal data", () => {
    const storage = new MemoryStorage();
    const level = storyLevel();
    storage.setItem(ACTIVE_RUN_STORAGE_KEY, JSON.stringify(rawSnapshot(level)));
    expect(writeActiveRun({
      mode: "tester",
      level,
      game: createInitialGameState(level),
      revealedTiles: [],
    }, storage)).toBe(false);
    expect(storage.getItem(ACTIVE_RUN_STORAGE_KEY)).toBeNull();

    const generated = { ...level, id: "generated-test", source: "generated" as const };
    expect(createActiveRunSnapshot({
      mode: "normal",
      level: generated,
      game: { ...createInitialGameState(generated), levelId: generated.id },
      revealedTiles: [],
    })).toBeNull();
  });

  it("clears snapshots and makes every storage failure harmless", () => {
    const storage = new MemoryStorage();
    storage.setItem(ACTIVE_RUN_STORAGE_KEY, JSON.stringify(rawSnapshot(storyLevel())));
    expect(clearActiveRun(storage)).toBe(true);
    expect(storage.getItem(ACTIVE_RUN_STORAGE_KEY)).toBeNull();

    const broken: ActiveRunStorage = {
      getItem: () => { throw new Error("blocked"); },
      setItem: () => { throw new Error("full"); },
      removeItem: () => { throw new Error("blocked"); },
    };
    const level = storyLevel();
    expect(() => readActiveRun(CURATED_LEVELS, broken)).not.toThrow();
    expect(readActiveRun(CURATED_LEVELS, broken)).toBeNull();
    expect(() => writeActiveRun({
      mode: "normal",
      level,
      game: createInitialGameState(level),
      revealedTiles: [],
    }, broken)).not.toThrow();
    expect(writeActiveRun({
      mode: "normal",
      level,
      game: createInitialGameState(level),
      revealedTiles: [],
    }, broken)).toBe(false);
    expect(clearActiveRun(broken)).toBe(false);
  });
});
