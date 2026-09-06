import { movePlayer, pointKey } from "./engine";
import { progressionStateSignature, solveLevel } from "./solver";
import { DIRECTIONS, DIRECTION_DELTAS, type Direction, type GameState, type LevelDefinition } from "./types";

export interface ReachabilityResult {
  readonly positions: ReadonlySet<string>;
  /** Monotonic admitted-state count; dominated states remain counted. */
  readonly visitedStates: number;
  /** Exact engine transitions, including stationary rescue normalization. */
  readonly processedTransitions: number;
  /** False means the caller's state budget stopped the search before exhaustion. */
  readonly complete: boolean;
}

/**
 * Rescue has no negative traversal effect. Canonically accept every currently
 * adjacent rescue before exploring so reachability retains the engine's rescue
 * signature without enumerating every optional rescue ordering.
 */
function settleAdjacentRescues(
  level: LevelDefinition,
  input: GameState,
  move: (state: GameState, direction: Direction) => GameState | undefined,
): GameState | undefined {
  let state = input;
  for (const direction of DIRECTIONS) {
    const delta = DIRECTION_DELTAS[direction];
    const target = { x: state.position.x + delta.x, y: state.position.y + delta.y };
    const animal = level.objects.find((object) => (
      object.kind === "animal"
      && object.at.x === target.x
      && object.at.y === target.y
      && !state.rescuedAnimalIds.includes(object.id)
    ));
    if (!animal) continue;
    const next = move(state, direction);
    if (!next) return undefined;
    state = next;
  }
  return state;
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
  const transitionLimit = stateLimit * DIRECTIONS.length;
  let processedTransitions = 0;
  const boundedMove = (state: GameState, direction: Direction): GameState | undefined => {
    if (processedTransitions >= transitionLimit) return undefined;
    processedTransitions += 1;
    return movePlayer(level, state, direction).state;
  };
  const statefulCollectibleIds = new Set(
    level.objects.filter((object) => object.kind === "potion").map((object) => object.id),
  );
  const signature = (state: GameState) => progressionStateSignature(
    state,
    statefulCollectibleIds,
  );
  const traversalSignature = (state: GameState) => progressionStateSignature(
    { ...state, rescuedAnimalIds: [] },
    statefulCollectibleIds,
  );
  const initial = settleAdjacentRescues(level, initialState, boundedMove);
  if (!initial) {
    return { positions: new Set([pointKey(initialState.position)]), visitedStates: 1, processedTransitions, complete: false };
  }
  const initialSignature = signature(initial);
  const queue = [{ state: initial, signature: initialSignature }];
  const activeSignatures = new Set([initialSignature]);
  const rescueStates = new Map<string, Map<string, ReadonlySet<string>>>([[
    traversalSignature(initial),
    new Map([[initialSignature, new Set(initial.rescuedAnimalIds)]]),
  ]]);
  const positions = new Set([pointKey(initialState.position)]);
  let visitedStates = 1;
  let complete = true;
  search: for (let head = 0; head < queue.length; head += 1) {
    const queued = queue[head]!;
    if (!activeSignatures.has(queued.signature)) continue;
    const state = queued.state;
    const currentSignature = signature(state);
    for (const direction of DIRECTIONS) {
      const moved = boundedMove(state, direction);
      if (!moved) {
        complete = false;
        break search;
      }
      const next = settleAdjacentRescues(level, moved, boundedMove);
      if (!next) {
        complete = false;
        break search;
      }
      const key = signature(next);
      if (key === currentSignature || activeSignatures.has(key)) continue;

      // At equal traversal state, a rescue superset can do everything a subset
      // can. Keep only non-dominated states so optional rescue order does not
      // multiply the reachability graph while exact solver routes stay intact.
      const base = traversalSignature(next);
      const rescued = new Set(next.rescuedAnimalIds);
      const alternatives = rescueStates.get(base) ?? new Map<string, ReadonlySet<string>>();
      if ([...alternatives.values()].some((ids) => [...rescued].every((id) => ids.has(id)))) continue;
      for (const [otherKey, ids] of alternatives) {
        if ([...ids].every((id) => rescued.has(id))) {
          alternatives.delete(otherKey);
          activeSignatures.delete(otherKey);
        }
      }
      if (visitedStates >= stateLimit) {
        complete = false;
        break search;
      }
      alternatives.set(key, rescued);
      rescueStates.set(base, alternatives);
      activeSignatures.add(key);
      visitedStates += 1;
      positions.add(pointKey(next.position));
      if (next.status === "playing") queue.push({ state: next, signature: key });
    }
  }
  return { positions, visitedStates, processedTransitions, complete };
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
