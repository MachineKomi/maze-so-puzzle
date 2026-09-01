import { describe, expect, it } from "vitest";
import { createInitialGameState, movePlayer } from "./game/engine";
import { CURATED_LEVELS, parseAsciiLevel } from "./game/levels";
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
    expect(
      result.moved || result.events.some((event) => event.type === "enemy-defeated"),
    ).toBe(true);
    expect(result.state).not.toBe(state);
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
  it("migrates old snapshots without newer inventory flags and persists a completed jump", () => {
    const oldLevel = storyLevel();
    const legacyGame = Object.fromEntries(
      Object.entries(createInitialGameState(oldLevel))
        .filter(([key]) => key !== "hasSpringBoots" && key !== "hasAntidoteLeaf"),
    );
    const migrated = sanitizeActiveRunSnapshot({
      ...rawSnapshot(oldLevel),
      game: legacyGame,
    }, CURATED_LEVELS);
    expect(migrated?.game.hasSpringBoots).toBe(false);
    expect(migrated?.game.hasAntidoteLeaf).toBe(false);

    const changedTraversalLevel = storyLevel(6);
    const staleTraversalGame = Object.fromEntries(
      Object.entries(createInitialGameState(changedTraversalLevel))
        .filter(([key]) => key !== "hasSpringBoots"),
    );
    expect(sanitizeActiveRunSnapshot({
      ...rawSnapshot(changedTraversalLevel),
      game: staleTraversalGame,
    }, CURATED_LEVELS)).toBeNull();

    const jumpLevel = parseAsciiLevel({
      id: "saved-spring-jump",
      name: "Saved Spring Jump",
      objective: "Collect the spring boots and jump.",
      initialPower: 1,
      map: [
        "#########",
        "#@j.o..E#",
        "#########",
      ],
    });
    let game = createInitialGameState(jumpLevel);
    for (const direction of ["right", "right", "right"] as const) {
      game = movePlayer(jumpLevel, game, direction).state;
    }

    expect(game).toMatchObject({
      position: { x: 5, y: 1 },
      hasSpringBoots: true,
      status: "playing",
      steps: 3,
    });
    expect(sanitizeActiveRunSnapshot(
      rawSnapshot(jumpLevel, game),
      [jumpLevel],
    )?.game).toEqual(game);
  });

  it("round-trips a run immediately after a long flower-portal hop", () => {
    const portalLevel = parseAsciiLevel({
      id: "saved-portal-hop",
      name: "Saved Portal Hop",
      objective: "Use the flowers.",
      map: [
        "#########",
        "#@H######",
        "#########",
        "#####H.E#",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
      ],
    });
    const game = movePlayer(
      portalLevel,
      createInitialGameState(portalLevel),
      "right",
    ).state;

    expect(game).toMatchObject({ position: { x: 5, y: 3 }, steps: 1 });
    expect(sanitizeActiveRunSnapshot(rawSnapshot(portalLevel, game), [portalLevel])?.game)
      .toEqual(game);
  });

  it("rejects pre-poison snapshots for changed levels and round-trips an antidote run", () => {
    const corridor = parseAsciiLevel({
      id: "saved-antidote-run",
      name: "Saved Antidote Run",
      objective: "Collect the leaf and cross the poison.",
      initialPower: 1,
      map: [
        "#########",
        "#@....E.#",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
      ],
    });
    const terrain = corridor.terrain.map((row, y) => row.map((tile, x) => (
      y === 1 && (x === 3 || x === 4) ? "poison" as const : tile
    )));
    const leaf = {
      id: "saved-antidote-run-antidote-leaf-1",
      kind: "antidote-leaf" as const,
      at: { x: 2, y: 1 },
    };
    const poisonLevel = { ...corridor, terrain, objects: [leaf] };
    const legacyGame = Object.fromEntries(
      Object.entries(createInitialGameState(poisonLevel))
        .filter(([key]) => key !== "hasAntidoteLeaf"),
    );

    expect(sanitizeActiveRunSnapshot({
      ...rawSnapshot(poisonLevel),
      game: legacyGame,
    }, [poisonLevel])).toBeNull();

    let game = createInitialGameState(poisonLevel);
    for (const direction of ["right", "right", "right"] as const) {
      game = movePlayer(poisonLevel, game, direction).state;
    }
    expect(game).toMatchObject({
      position: { x: 4, y: 1 },
      hasAntidoteLeaf: true,
      collectedObjectIds: [leaf.id],
      status: "playing",
      steps: 3,
    });
    expect(sanitizeActiveRunSnapshot(
      rawSnapshot(poisonLevel, game),
      [poisonLevel],
    )?.game).toEqual(game);
  });

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
      { ...initial, hasAntidoteLeaf: true },
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
