/**
 * UI-agnostic full-save reset for Maze so Puzzle.
 *
 * Keep the allow-list explicit: a reset must never clear unrelated browser or
 * desktop-webview storage owned by the player or by another application.
 */

import {
  createDefaultPlayerProgress,
  LEGACY_PLAYER_PROGRESS_STORAGE_KEY,
  PLAYER_PROGRESS_STORAGE_KEY,
  VERSION_THREE_PLAYER_PROGRESS_STORAGE_KEY,
  VERSION_TWO_PLAYER_PROGRESS_STORAGE_KEY,
  type PlayerProgress,
} from "./progress";
import { ACTIVE_RUN_STORAGE_KEY, LEGACY_ACTIVE_RUN_STORAGE_KEY } from "./session";

interface ResetStorage {
  removeItem(key: string): void;
}

const MAZE_SO_PUZZLE_STORAGE_KEYS = [
  PLAYER_PROGRESS_STORAGE_KEY,
  VERSION_THREE_PLAYER_PROGRESS_STORAGE_KEY,
  VERSION_TWO_PLAYER_PROGRESS_STORAGE_KEY,
  LEGACY_PLAYER_PROGRESS_STORAGE_KEY,
  ACTIVE_RUN_STORAGE_KEY,
  LEGACY_ACTIVE_RUN_STORAGE_KEY,
] as const;

export interface ResetGameProgressResult {
  readonly progress: PlayerProgress;
  readonly cleared: boolean;
  readonly failedKeys: readonly string[];
}

function browserStorage(): ResetStorage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Forget every released Maze so Puzzle save and active-run snapshot, then
 * return an independent new-game progress value for the caller to install in
 * React state. Storage failures are isolated per key and never escape.
 */
export function resetAllGameProgress(
  storage: ResetStorage | null | undefined = undefined,
): PlayerProgress {
  return resetAllGameProgressResult(storage).progress;
}

/** Reset with an explicit durability result so the UI never promises a reset that may reappear. */
export function resetAllGameProgressResult(
  storage: ResetStorage | null | undefined = undefined,
): ResetGameProgressResult {
  const freshProgress = createDefaultPlayerProgress();
  const target = storage === undefined ? browserStorage() : storage;
  if (target === null) {
    return {
      progress: freshProgress,
      cleared: false,
      failedKeys: [...MAZE_SO_PUZZLE_STORAGE_KEYS],
    };
  }

  const failedKeys: string[] = [];
  for (const key of MAZE_SO_PUZZLE_STORAGE_KEYS) {
    try {
      target.removeItem(key);
    } catch {
      // Keep attempting the remaining game-owned keys. The in-memory reset is
      // still safe and usable when storage is unavailable or read-only.
      failedKeys.push(key);
    }
  }

  return {
    progress: freshProgress,
    cleared: failedKeys.length === 0,
    failedKeys,
  };
}
