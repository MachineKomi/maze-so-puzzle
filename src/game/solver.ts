import { createInitialGameState, getTerrainAt, isInBounds, movePlayer, pointKey, pointsEqual } from "./engine";
import {
  ANIMAL_SPECIES,
  ABSOLUTE_MAZE_SIZE_LIMIT,
  DIRECTIONS,
  PORTAL_PAIR_IDS,
  type Direction,
  type GameState,
  type LevelDefinition,
} from "./types";

export interface SolveOptions {
  readonly maxStates?: number;
  /** Require a route that rescues every animal before entering the exit. */
  readonly requireAllAnimals?: boolean;
  /** Search from a validated live state instead of restarting the level. */
  readonly initialState?: GameState;
  /** Ordinary-path contract: never step onto an unresolved optional rescue. */
  readonly avoidAnimals?: boolean;
}

export type SolveReason = "solved" | "unsolvable" | "state-limit" | "invalid-level";

export interface SolveResult {
  readonly solvable: boolean;
  readonly reason: SolveReason;
  readonly directions: readonly Direction[];
  readonly visitedStates: number;
  readonly finalState?: GameState;
  readonly errors?: readonly string[];
}

export interface LevelValidation {
  readonly valid: boolean;
  readonly solvable: boolean;
  readonly errors: readonly string[];
  readonly solution: readonly Direction[];
  readonly visitedStates: number;
}

export function progressionStateSignature(
  state: GameState,
  includeAnimals: boolean,
  statefulCollectibleIds: ReadonlySet<string>,
): string {
  // Engine-owned arrays are kept sorted. Equipment and reusable keys already
  // have canonical capability fields. Door identity is retained because door
  // opening is now its own stationary interaction before traversal. Only
  // potions need individual collectible identity: equal current Power can
  // otherwise hide an uncollected potion that changes a later route.
  const progressionCollectibles = state.collectedObjectIds.filter((id) => (
    statefulCollectibleIds.has(id)
  ));
  return [
    state.position.x,
    state.position.y,
    state.power,
    state.hasSword ? 1 : 0,
    state.hasBoots ? 1 : 0,
    state.hasSpringBoots ? 1 : 0,
    state.hasAntidoteLeaf ? 1 : 0,
    state.keys.join(","),
    progressionCollectibles.join(","),
    includeAnimals ? state.rescuedAnimalIds.join(",") : "",
    state.defeatedEnemyIds.join(","),
    state.openedDoorIds.join(","),
    state.status,
  ].join("|");
}

function reconstructDirections(
  finalSignature: string,
  parents: ReadonlyMap<
    string,
    { readonly previous: string; readonly direction: Direction }
  >,
): readonly Direction[] {
  const reversed: Direction[] = [];
  let current = finalSignature;
  while (parents.has(current)) {
    const link = parents.get(current);
    if (link === undefined) {
      break;
    }
    reversed.push(link.direction);
    current = link.previous;
  }
  return reversed.reverse();
}

export function getLevelStructureErrors(level: LevelDefinition): readonly string[] {
  const errors: string[] = [];

  if (!Number.isSafeInteger(level.contentRevision) || level.contentRevision < 1) {
    errors.push("Content revision must be a positive integer.");
  }
  if (typeof level.gameplayFingerprint !== "string" || level.gameplayFingerprint.length === 0) {
    errors.push("Gameplay fingerprint must be present.");
  }

  if (!Number.isInteger(level.width) || !Number.isInteger(level.height) || level.width < 3 || level.height < 3) {
    errors.push("Level dimensions must be integers of at least 3 tiles.");
  }
  if (level.width !== level.height) {
    errors.push("The maze must be square.");
  }
  if (level.width > ABSOLUTE_MAZE_SIZE_LIMIT || level.height > ABSOLUTE_MAZE_SIZE_LIMIT) {
    errors.push(`Maze dimensions cannot exceed ${ABSOLUTE_MAZE_SIZE_LIMIT} tiles.`);
  }
  if (!Number.isInteger(level.initialPower) || level.initialPower <= 0) {
    errors.push("Initial Power must be a positive integer.");
  }
  if (level.terrain.length !== level.height) {
    errors.push("Terrain row count does not match level height.");
  }

  for (let y = 0; y < level.height; y += 1) {
    const row = level.terrain[y];
    if (row === undefined || row.length !== level.width) {
      errors.push(`Terrain row ${y} does not match level width.`);
      continue;
    }
    for (let x = 0; x < level.width; x += 1) {
      if (
        row[x] !== "wall" &&
        row[x] !== "floor" &&
        row[x] !== "water" &&
        row[x] !== "lava" &&
        row[x] !== "poison" &&
        row[x] !== "hole"
      ) {
        errors.push(`Terrain tile ${x},${y} has an unknown kind.`);
      }
      if ((x === 0 || y === 0 || x === level.width - 1 || y === level.height - 1) && row[x] !== "wall") {
        errors.push(`Border tile ${x},${y} must be a wall.`);
      }
    }
  }

  for (const [label, point] of [
    ["Start", level.start],
    ["Exit", level.exit],
  ] as const) {
    if (!isInBounds(level, point)) {
      errors.push(`${label} is outside the level.`);
    } else if (getTerrainAt(level, point) !== "floor") {
      errors.push(`${label} must be on floor terrain.`);
    }
  }
  if (pointsEqual(level.start, level.exit)) {
    errors.push("Start and exit must be different tiles.");
  }

  const ids = new Set<string>();
  const occupied = new Set<string>();
  for (const object of level.objects) {
    if (ids.has(object.id)) {
      errors.push(`Object id "${object.id}" is duplicated.`);
    }
    ids.add(object.id);

    const location = pointKey(object.at);
    if (occupied.has(location)) {
      errors.push(`More than one object occupies ${location}.`);
    }
    occupied.add(location);

    if (!isInBounds(level, object.at)) {
      errors.push(`Object "${object.id}" is outside the level.`);
    } else if (getTerrainAt(level, object.at) !== "floor") {
      errors.push(`Object "${object.id}" must be on floor terrain.`);
    }
    if (pointsEqual(object.at, level.start) || pointsEqual(object.at, level.exit)) {
      errors.push(`Object "${object.id}" cannot overlap the start or exit.`);
    }

    if (object.kind === "enemy" && (!Number.isInteger(object.power) || object.power <= 0)) {
      errors.push(`Enemy "${object.id}" must have positive integer Power.`);
    }
    if (object.kind === "potion" && (!Number.isInteger(object.amount) || object.amount <= 0)) {
      errors.push(`Potion "${object.id}" must add a positive integer.`);
    }
    if (
      object.kind === "animal" &&
      !(ANIMAL_SPECIES as readonly string[]).includes(object.species)
    ) {
      errors.push(`Animal "${object.id}" has an unknown species.`);
    }
  }


  for (const pair of PORTAL_PAIR_IDS) {
    const portals = level.objects.filter((object) => object.kind === "portal" && object.pair === pair);
    if (portals.length !== 0 && portals.length !== 2) {
      errors.push(`Portal pair "${pair}" must contain exactly two portals.`);
    }
  }

  return errors;
}

/** Finds a safe route using the exact same item, door, hazard and combat rules as play. */
export function solveLevel(
  level: LevelDefinition,
  options: SolveOptions = {},
): SolveResult {
  const structuralErrors = getLevelStructureErrors(level);
  if (structuralErrors.length > 0) {
    return {
      solvable: false,
      reason: "invalid-level",
      directions: [],
      visitedStates: 0,
      errors: structuralErrors,
    };
  }

  const maxStates = options.maxStates === undefined || !Number.isFinite(options.maxStates)
    ? 250_000
    : Math.max(1, Math.floor(options.maxStates));
  const requireAllAnimals = options.requireAllAnimals ?? false;
  const animalCount = level.objects.filter((object) => object.kind === "animal").length;
  const statefulCollectibleIds = new Set(
    level.objects.filter((object) => object.kind === "potion").map((object) => object.id),
  );
  const initial = options.initialState ?? createInitialGameState(level);
  if (initial.levelId !== level.id || initial.status !== "playing") {
    return {
      solvable: false,
      reason: "invalid-level",
      directions: [],
      visitedStates: 0,
      errors: ["Initial solver state must be a playing state for this level."],
    };
  }
  const initialSignature = progressionStateSignature(initial, requireAllAnimals, statefulCollectibleIds);
  const queue: GameState[] = [initial];
  const signatures: string[] = [initialSignature];
  const seen = new Set<string>([initialSignature]);
  const parents = new Map<
    string,
    { readonly previous: string; readonly direction: Direction }
  >();

  for (let head = 0; head < queue.length; head += 1) {
    const state = queue[head];
    const currentSignature = signatures[head];
    if (state === undefined || currentSignature === undefined) {
      continue;
    }

    for (const direction of DIRECTIONS) {
      const result = movePlayer(level, state, direction);
      if (result.state.status === "lost") {
        continue;
      }
      if (
        options.avoidAnimals
        && result.state.rescuedAnimalIds.length > state.rescuedAnimalIds.length
      ) {
        continue;
      }

      const nextSignature = progressionStateSignature(result.state, requireAllAnimals, statefulCollectibleIds);
      // A successful combat changes Power and clears the enemy without moving
      // Ame. Treat any genuine state transition as a searchable edge; blocked
      // movement and too-strong encounters retain the current signature.
      if (nextSignature === currentSignature) {
        continue;
      }
      if (seen.has(nextSignature)) {
        continue;
      }
      if (seen.size >= maxStates) {
        return {
          solvable: false,
          reason: "state-limit",
          directions: [],
          visitedStates: seen.size,
        };
      }
      seen.add(nextSignature);
      parents.set(nextSignature, { previous: currentSignature, direction });

      if (result.state.status === "won") {
        if (requireAllAnimals && result.state.rescuedAnimalIds.length !== animalCount) {
          continue;
        }
        return {
          solvable: true,
          reason: "solved",
          directions: reconstructDirections(nextSignature, parents),
          visitedStates: seen.size,
          finalState: result.state,
        };
      }

      queue.push(result.state);
      signatures.push(nextSignature);
    }
  }

  return {
    solvable: false,
    reason: "unsolvable",
    directions: [],
    visitedStates: seen.size,
  };
}

export function validateLevel(
  level: LevelDefinition,
  options: SolveOptions = {},
): LevelValidation {
  const result = solveLevel(level, options);
  const errors = [...(result.errors ?? [])];
  if (result.reason === "unsolvable") {
    errors.push(options.requireAllAnimals
      ? "No safe route rescues every animal and then reaches the exit."
      : "No safe route reaches the exit under the gameplay rules.");
  } else if (result.reason === "state-limit") {
    errors.push("Solvability search exceeded its state limit.");
  }
  return {
    valid: result.solvable && errors.length === 0,
    solvable: result.solvable,
    errors,
    solution: result.directions,
    visitedStates: result.visitedStates,
  };
}

export function isLevelSolvable(level: LevelDefinition): boolean {
  return solveLevel(level).solvable;
}
