import type { GameStatus } from "./game/types";

export interface StoryProgressSnapshot {
  readonly unlockedLevelCount: number;
  readonly bestResultsByLevel: Readonly<Record<string, unknown>>;
}

/** Pick the first open, undocumented story while preserving record-less v1 continuity. */
export function getNextStoryIndex(
  progress: StoryProgressSnapshot,
  storyIds: readonly string[],
): number {
  if (storyIds.length === 0) return 0;
  const openCount = Math.min(storyIds.length, Math.max(1, progress.unlockedLevelCount));
  const openIds = storyIds.slice(0, openCount);
  const documentedCount = openIds.filter((id) => (
    Object.hasOwn(progress.bestResultsByLevel, id)
  )).length;

  // V1 stored unlock position but not individual results, so resume its latest
  // open maze instead of pretending that the player has never begun.
  if (documentedCount === 0 && openCount > 1) return openCount - 1;

  const firstUnsolved = openIds.findIndex((id) => (
    !Object.hasOwn(progress.bestResultsByLevel, id)
  ));
  return firstUnsolved >= 0 ? firstUnsolved : openCount - 1;
}

export interface MazeSwitchSnapshot {
  readonly hasActiveRun: boolean;
  readonly status: GameStatus;
  readonly steps: number;
  readonly currentLevelId: string;
}

/** A moved, still-playable run must not be replaced silently. */
export function shouldConfirmMazeSwitch(
  current: MazeSwitchSnapshot,
  nextLevelId: string,
): boolean {
  return current.hasActiveRun
    && current.status === "playing"
    && current.steps > 0
    && current.currentLevelId !== nextLevelId;
}
