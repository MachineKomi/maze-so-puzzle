import type { GameStatus } from "./game/types";

export interface StoryProgressSnapshot {
  readonly unlockedLevelCount: number;
  readonly unlockedLevelIds?: readonly string[];
  readonly bestResultsByLevel: Readonly<Record<string, unknown>>;
}

/** Pick the first open, undocumented story while preserving record-less v1 continuity. */
export function getNextStoryIndex(
  progress: StoryProgressSnapshot,
  storyIds: readonly string[],
): number {
  if (storyIds.length === 0) return 0;
  const explicitOpen = new Set(progress.unlockedLevelIds ?? []);
  const openIds = explicitOpen.size > 0
    ? storyIds.filter((id) => explicitOpen.has(id))
    : storyIds.slice(0, Math.min(storyIds.length, Math.max(1, progress.unlockedLevelCount)));
  if (openIds.length === 0) return 0;
  const documentedCount = openIds.filter((id) => (
    Object.hasOwn(progress.bestResultsByLevel, id)
  )).length;

  // V1 stored unlock position but not individual results, so resume its latest
  // open maze instead of pretending that the player has never begun.
  if (documentedCount === 0 && openIds.length > 1) {
    return storyIds.indexOf(openIds[openIds.length - 1]!);
  }

  const firstUnsolved = openIds.find((id) => (
    !Object.hasOwn(progress.bestResultsByLevel, id)
  ));
  return storyIds.indexOf(firstUnsolved ?? openIds[openIds.length - 1]!);
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
