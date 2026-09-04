import { movePlayer, pointKey } from "./engine";
import { solveLevel } from "./solver";
import { DIRECTIONS, type Direction, type GameState, type LevelDefinition } from "./types";

export interface RouteQualityMetrics {
  readonly ordinaryMoves: number;
  readonly perfectMoves: number;
  readonly rescueCost: number;
  readonly rawBranchPoints: number;
  readonly meaningfulStateChanges: number;
  /** Pending a counterfactual dependency analysis; never inferred from route event count. */
  readonly prerequisiteDepth: null;
  readonly retraversalMoves: number;
  readonly retraversalRatio: number;
  readonly longestQuietRun: number;
  readonly routeActivityDensity: number;
  readonly ordinaryRescues: number;
  readonly perfectRescues: number;
}

function nextStates(level: LevelDefinition, state: GameState): readonly GameState[] {
  const signatures = new Set<string>();
  const result: GameState[] = [];
  for (const direction of DIRECTIONS) {
    const next = movePlayer(level, state, direction).state;
    const signature = JSON.stringify(next);
    if (signature === JSON.stringify(state) || signatures.has(signature)) continue;
    signatures.add(signature);
    result.push(next);
  }
  return result;
}

function analyseRoute(level: LevelDefinition, directions: readonly Direction[]): {
  readonly decisions: number;
  readonly changes: number;
  readonly retraversal: number;
  readonly quiet: number;
  readonly final: GameState;
} {
  let state = { ...solveInitial(level) };
  const visits = new Map([[pointKey(state.position), 1]]);
  let decisions = 0;
  const decisionCoordinates = new Set<string>();
  let changes = 0;
  let retraversal = 0;
  let quiet = 0;
  let quietRun = 0;
  let previousPosition: string | null = null;
  for (const direction of directions) {
    const choices = nextStates(level, state).filter((candidate) => (
      candidate.status === "won" || pointKey(candidate.position) !== previousPosition
    ));
    if (choices.length >= 2) decisionCoordinates.add(pointKey(state.position));
    const result = movePlayer(level, state, direction);
    const meaningful = result.events.some((event) => ![
      "moved",
      "level-won",
      "portal-warped",
      "hole-jumped",
      "treasure-collected",
      "animal-rescued",
    ].includes(event.type));
    const eventBoundary = result.events.some((event) => !["moved", "level-won"].includes(event.type));
    if (meaningful) {
      changes += 1;
    }
    if (eventBoundary) {
      quietRun = 0;
    } else {
      quietRun += 1;
      quiet = Math.max(quiet, quietRun);
    }
    previousPosition = pointKey(state.position);
    state = result.state;
    if (result.moved) {
      const key = pointKey(state.position);
      if ((visits.get(key) ?? 0) > 0) retraversal += 1;
      visits.set(key, (visits.get(key) ?? 0) + 1);
    }
  }
  decisions = decisionCoordinates.size;
  return { decisions, changes, retraversal, quiet, final: state };
}

function solveInitial(level: LevelDefinition): GameState {
  // Lazy local import avoided: an initial solve always exposes a valid starting state shape.
  return {
    levelId: level.id, position: { ...level.start }, power: level.initialPower,
    hasSword: false, hasBoots: false, hasSpringBoots: false, hasAntidoteLeaf: false,
    keys: [], collectedObjectIds: [], rescuedAnimalIds: [], defeatedEnemyIds: [], openedDoorIds: [],
    goldStarsCollected: 0, sciencePointsCollected: 0, exitArmed: true, status: "playing", steps: 0,
  };
}

export function measureLevel(level: LevelDefinition): RouteQualityMetrics {
  const ordinary = solveLevel(level, { avoidAnimals: true });
  const perfect = solveLevel(level, { requireAllAnimals: true });
  if (!ordinary.solvable || !perfect.solvable || !ordinary.finalState || !perfect.finalState) {
    throw new Error(`Cannot measure unsolved level ${level.id}.`);
  }
  const route = analyseRoute(level, ordinary.directions);
  const weightedActivity = route.decisions + route.changes * 2;
  return {
    ordinaryMoves: ordinary.directions.length,
    perfectMoves: perfect.directions.length,
    rescueCost: perfect.directions.length - ordinary.directions.length,
    rawBranchPoints: route.decisions,
    meaningfulStateChanges: route.changes,
    prerequisiteDepth: null,
    retraversalMoves: route.retraversal,
    retraversalRatio: ordinary.directions.length === 0 ? 0 : route.retraversal / ordinary.directions.length,
    longestQuietRun: route.quiet,
    routeActivityDensity: ordinary.directions.length === 0 ? 0 : weightedActivity / ordinary.directions.length * 10,
    ordinaryRescues: ordinary.finalState.rescuedAnimalIds.length,
    perfectRescues: perfect.finalState.rescuedAnimalIds.length,
  };
}

export function campaignMetricReport(levels: readonly LevelDefinition[]): Readonly<Record<string, RouteQualityMetrics>> {
  return Object.fromEntries(levels.map((level) => [level.id, measureLevel(level)]));
}

export function traceOrdinaryRoute(level: LevelDefinition): readonly string[] {
  const solved = solveLevel(level, { avoidAnimals: true });
  if (!solved.solvable) return [];
  let state = solveInitial(level);
  const points = [pointKey(state.position)];
  for (const direction of solved.directions) {
    state = movePlayer(level, state, direction).state;
    points.push(pointKey(state.position));
  }
  return points;
}
