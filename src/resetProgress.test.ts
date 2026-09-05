import { describe, expect, it } from "vitest";
import {
  createDefaultPlayerProgress,
  LEGACY_PLAYER_PROGRESS_STORAGE_KEY,
  PLAYER_PROGRESS_STORAGE_KEY,
  VERSION_FIVE_PLAYER_PROGRESS_STORAGE_KEY,
  VERSION_FOUR_PLAYER_PROGRESS_STORAGE_KEY,
  VERSION_THREE_PLAYER_PROGRESS_STORAGE_KEY,
  VERSION_TWO_PLAYER_PROGRESS_STORAGE_KEY,
} from "./progress";
import { resetAllGameProgress, resetAllGameProgressResult } from "./resetProgress";
import {
  ACTIVE_RUN_STORAGE_KEY,
  LEGACY_ACTIVE_RUN_STORAGE_KEY,
  VERSION_TWO_ACTIVE_RUN_STORAGE_KEY,
} from "./session";

const GAME_KEYS = [
  PLAYER_PROGRESS_STORAGE_KEY,
  VERSION_FIVE_PLAYER_PROGRESS_STORAGE_KEY,
  VERSION_FOUR_PLAYER_PROGRESS_STORAGE_KEY,
  VERSION_THREE_PLAYER_PROGRESS_STORAGE_KEY,
  VERSION_TWO_PLAYER_PROGRESS_STORAGE_KEY,
  LEGACY_PLAYER_PROGRESS_STORAGE_KEY,
  ACTIVE_RUN_STORAGE_KEY,
  VERSION_TWO_ACTIVE_RUN_STORAGE_KEY,
  LEGACY_ACTIVE_RUN_STORAGE_KEY,
] as const;

class MemoryStorage {
  readonly values = new Map<string, string>();
  readonly removedKeys: string[] = [];

  removeItem(key: string): void {
    this.removedKeys.push(key);
    this.values.delete(key);
  }
}

describe("full game progress reset", () => {
  it("removes every released game save while preserving unrelated storage", () => {
    const storage = new MemoryStorage();
    for (const key of GAME_KEYS) storage.values.set(key, `saved:${key}`);
    storage.values.set("another-app-progress", "keep me");

    const progress = resetAllGameProgress(storage);

    expect(progress).toEqual(createDefaultPlayerProgress());
    expect(storage.removedKeys).toEqual(GAME_KEYS);
    expect([...storage.values.entries()]).toEqual([
      ["another-app-progress", "keep me"],
    ]);
  });

  it("continues clearing later keys when one removal throws", () => {
    const attemptedKeys: string[] = [];
    const storage = {
      removeItem(key: string): void {
        attemptedKeys.push(key);
        if (key === VERSION_TWO_PLAYER_PROGRESS_STORAGE_KEY) {
          throw new Error("storage is temporarily read-only");
        }
      },
    };

    const result = resetAllGameProgressResult(storage);
    expect(result.cleared).toBe(false);
    expect(result.failedKeys).toEqual([VERSION_TWO_PLAYER_PROGRESS_STORAGE_KEY]);
    expect(result.progress).toEqual(createDefaultPlayerProgress());
    expect(attemptedKeys).toEqual(GAME_KEYS);
  });

  it("reports unavailable storage instead of claiming a durable reset", () => {
    const result = resetAllGameProgressResult(null);

    expect(result.cleared).toBe(false);
    expect(result.failedKeys).toEqual(GAME_KEYS);
  });

  it("returns a clean default when browser storage is unavailable", () => {
    expect(resetAllGameProgress(null)).toEqual(createDefaultPlayerProgress());
  });

  it("returns independent progress objects for consecutive resets", () => {
    const first = resetAllGameProgress(null);
    const second = resetAllGameProgress(null);

    expect(first).not.toBe(second);
    expect(first.badges).not.toBe(second.badges);
    expect(first.bestResultsByLevel).not.toBe(second.bestResultsByLevel);
    expect(first.rescuesBySpecies).not.toBe(second.rescuesBySpecies);
  });
});
