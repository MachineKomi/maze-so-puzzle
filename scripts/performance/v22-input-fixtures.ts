/** Real authored-run checkpoints; every state is replayed through today's engine. */
import { createInitialGameState, movePlayer } from "../../src/game/engine";
import { revealVisibleTiles, type TileKey } from "../../src/game/exploration";
import { CURATED_LEVELS } from "../../src/game/levels";
import { solveLevel } from "../../src/game/solver";
import { DIRECTIONS, type Direction, type GameEvent, type GameState, type LevelDefinition, type MoveResult } from "../../src/game/types";
import { createActiveRunSnapshot, type ActiveRunSnapshot } from "../../src/session";

export const SUCCESS_EVENTS = ["door-opened", "enemy-defeated", "animal-rescued", "portal-warped", "hole-jumped"] as const;
export type SuccessEvent = typeof SUCCESS_EVENTS[number];
export interface InputFixture {
  level: LevelDefinition;
  prefix: readonly Direction[];
  before: GameState;
  direction: Direction;
  result: MoveResult;
  revealed: ReadonlySet<TileKey>;
}
interface RouteCheckpoint { level: LevelDefinition; prefix: readonly Direction[]; before: GameState; revealed: ReadonlySet<TileKey> }
let cached: RouteCheckpoint[] | undefined;
const blockerCache = new Map<"power" | "capability", InputFixture>();

export function routeCheckpoints(): readonly RouteCheckpoint[] {
  if (cached) return cached;
  const checkpoints: RouteCheckpoint[] = [];
  for (const level of CURATED_LEVELS) {
    const solved = solveLevel(level, { requireAllAnimals: true });
    if (!solved.solvable) throw new Error(`Input fixture solver failed: ${level.id}: ${solved.reason}`);
    let before = createInitialGameState(level);
    let revealed = revealVisibleTiles([], level, before.position);
    const prefix: Direction[] = [];
    for (const direction of solved.directions) {
      checkpoints.push({ level, prefix: [...prefix], before, revealed });
      before = movePlayer(level, before, direction).state;
      revealed = revealVisibleTiles(revealed, level, before.position);
      prefix.push(direction);
    }
    if (before.status !== "won") throw new Error(`Input fixture did not solve ${level.id}`);
  }
  cached = checkpoints;
  return checkpoints;
}

export function isOrdinaryMove(result: MoveResult): boolean {
  return result.moved && result.state.status === "playing" && result.events.every(event => event.type === "moved");
}

export function continuationDirections(fixture: InputFixture): Direction[] {
  return DIRECTIONS.filter(direction => isOrdinaryMove(movePlayer(fixture.level, fixture.result.state, direction)));
}

export function findInputFixture(
  accepts: (events: readonly GameEvent[]) => boolean,
  options: { sameDirectionContinuation?: boolean; differentDirectionContinuation?: boolean } = {},
): InputFixture | undefined {
  // The shortest honest saved prefix makes review and reproduction inexpensive.
  const ordered = [...routeCheckpoints()].sort((a, b) => a.prefix.length - b.prefix.length);
  for (const checkpoint of ordered) {
    for (const direction of DIRECTIONS) {
      const result = movePlayer(checkpoint.level, checkpoint.before, direction);
      if (!accepts(result.events) || result.state.status !== "playing") continue;
      const fixture = { ...checkpoint, direction, result };
      const continuations = continuationDirections(fixture);
      if (options.sameDirectionContinuation && !continuations.includes(direction)) continue;
      if (options.differentDirectionContinuation && !continuations.some(candidate => candidate !== direction)) continue;
      return fixture;
    }
  }
  return undefined;
}

export function successFixture(kind: SuccessEvent, differentDirectionContinuation = false): InputFixture {
  const fixture = findInputFixture(events => events.some(event => event.type === kind), {
    sameDirectionContinuation: !differentDirectionContinuation,
    differentDirectionContinuation,
  });
  if (!fixture) throw new Error(`No real campaign fixture with an ordinary continuation for ${kind}`);
  return fixture;
}

export function deliberateBlockerFixture(kind: "power" | "capability"): InputFixture {
  const existing = blockerCache.get(kind);
  if (existing) return existing;
  const accepts = (events: readonly GameEvent[]) => events.some(event => kind === "power" ? event.type === "enemy-too-strong"
    : event.type === "blocked" && ["needs-key", "needs-sword", "needs-boots", "needs-antidote-leaf", "needs-spring-boots"].includes(event.reason));
  const onRoute = findInputFixture(accepts);
  if (onRoute) { blockerCache.set(kind, onRoute); return onRoute; }
  // A successful solver deliberately avoids stronger guardians. Explore real
  // legal detours, rather than lowering Power or planting an impossible save.
  for (const level of CURATED_LEVELS) {
    const initial = createInitialGameState(level);
    const queue: RouteCheckpoint[] = [{ level, prefix: [], before: initial, revealed: revealVisibleTiles([], level, initial.position) }];
    const key = (state: GameState) => JSON.stringify({ ...state, steps: 0,
      collectedObjectIds: [...state.collectedObjectIds].sort(), rescuedAnimalIds: [...state.rescuedAnimalIds].sort(),
      defeatedEnemyIds: [...state.defeatedEnemyIds].sort(), openedDoorIds: [...state.openedDoorIds].sort() });
    const seen = new Set([key(initial)]);
    for (let index = 0; index < queue.length && index < 4000; index++) {
      const checkpoint = queue[index]!;
      for (const direction of DIRECTIONS) {
        const result = movePlayer(level, checkpoint.before, direction);
        if (accepts(result.events)) {
          const fixture = { ...checkpoint, direction, result };
          blockerCache.set(kind, fixture);
          return fixture;
        }
        if (result.state.status !== "playing" || (!result.moved && !result.events.some(event => event.type === "door-opened"))) continue;
        const nextKey = key(result.state);
        if (seen.has(nextKey)) continue;
        seen.add(nextKey);
        queue.push({ level, prefix: [...checkpoint.prefix, direction], before: result.state,
          revealed: revealVisibleTiles(checkpoint.revealed, level, result.state.position) });
      }
    }
  }
  throw new Error(`No current authored legal route found for the ${kind} blocker within the bounded fixture search`);
}

export function savedFixture(fixture: Pick<InputFixture, "level" | "before" | "revealed">, suffix: string): ActiveRunSnapshot {
  const snapshot = createActiveRunSnapshot({
    runId: `run-v22-input-${suffix.replace(/[^a-zA-Z0-9-]/g, "-")}`,
    mode: "normal", level: fixture.level, game: fixture.before, revealedTiles: fixture.revealed,
  });
  if (!snapshot) throw new Error(`Current snapshot normalizer rejected ${fixture.level.id} at ${fixture.before.steps}`);
  return snapshot;
}

export function finalMazeFixture(): InputFixture {
  const level = CURATED_LEVELS.at(-1)!;
  const checkpoint = [...routeCheckpoints()].reverse().find(candidate => candidate.level.id === level.id)!;
  const direction = DIRECTIONS.find(candidate => movePlayer(level, checkpoint.before, candidate).state.status === "won");
  if (!direction) throw new Error("Final campaign fixture has no legal exit step");
  return { ...checkpoint, direction, result: movePlayer(level, checkpoint.before, direction) };
}
