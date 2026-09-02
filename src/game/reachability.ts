import { movePlayer, pointKey } from "./engine";
import { progressionStateSignature, solveLevel } from "./solver";
import { DIRECTIONS, type Direction, type GameState, type LevelDefinition } from "./types";

export interface ReachabilityResult {
  readonly positions: ReadonlySet<string>;
  readonly visitedStates: number;
  /** False means the caller's state budget stopped the search before exhaustion. */
  readonly complete: boolean;
}

/** Current-state exploration through `movePlayer`, with explicit budget-completeness evidence. */
export function getEngineReachability(
  level: LevelDefinition,
  initialState: GameState,
  maxStates = 100_000,
): ReachabilityResult {
  const stateLimit = Number.isFinite(maxStates)
    ? Math.max(1, Math.floor(maxStates))
    : 100_000;
  const statefulCollectibleIds = new Set(
    level.objects.filter((object) => object.kind === "potion").map((object) => object.id),
  );
  const signature = (state: GameState) => progressionStateSignature(
    state,
    false,
    statefulCollectibleIds,
  );
  const queue = [initialState];
  const seen = new Set([signature(initialState)]);
  const positions = new Set([pointKey(initialState.position)]);
  let complete = true;
  search: for (let head = 0; head < queue.length; head += 1) {
    const state = queue[head]!;
    const currentSignature = signature(state);
    for (const direction of DIRECTIONS) {
      const next = movePlayer(level, state, direction).state;
      const key = signature(next);
      if (key === currentSignature || seen.has(key)) continue;
      if (seen.size >= stateLimit) {
        complete = false;
        break search;
      }
      seen.add(key);
      positions.add(pointKey(next.position));
      if (next.status === "playing") queue.push(next);
    }
  }
  return { positions, visitedStates: seen.size, complete };
}

export function getRequiredPath(
  level: LevelDefinition,
  state: GameState,
): readonly Direction[] | null {
  const result = solveLevel(level, {
    initialState: state,
    avoidAnimals: true,
    maxStates: 250_000,
  });
  return result.solvable ? result.directions : null;
}
