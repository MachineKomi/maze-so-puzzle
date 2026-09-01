import {
  DIRECTION_DELTAS,
  type Direction,
  type GameEvent,
  type GameState,
  type KeyColor,
  type LevelDefinition,
  type LevelObject,
  type MoveResult,
  type Point,
  type TerrainKind,
} from "./types";

export function pointsEqual(left: Point, right: Point): boolean {
  return left.x === right.x && left.y === right.y;
}

export function pointKey(point: Point): string {
  return `${point.x},${point.y}`;
}

export function isInBounds(level: LevelDefinition, point: Point): boolean {
  return point.x >= 0 && point.y >= 0 && point.x < level.width && point.y < level.height;
}

export function getTerrainAt(level: LevelDefinition, point: Point): TerrainKind | undefined {
  if (!isInBounds(level, point)) {
    return undefined;
  }
  return level.terrain[point.y]?.[point.x];
}

export function getObjectAt(
  level: LevelDefinition,
  point: Point,
): LevelObject | undefined {
  return level.objects.find((object) => pointsEqual(object.at, point));
}

export function isObjectResolved(object: LevelObject, state: GameState): boolean {
  switch (object.kind) {
    case "enemy":
      return state.defeatedEnemyIds.includes(object.id);
    case "door":
      return state.openedDoorIds.includes(object.id);
    case "animal":
      return state.rescuedAnimalIds.includes(object.id);
    case "sword":
    case "boots":
    case "spring-boots":
    case "antidote-leaf":
    case "potion":
    case "key":
      return state.collectedObjectIds.includes(object.id);
  }
}

export function createInitialGameState(level: LevelDefinition): GameState {
  return {
    levelId: level.id,
    position: { ...level.start },
    power: level.initialPower,
    hasSword: false,
    hasBoots: false,
    hasSpringBoots: false,
    hasAntidoteLeaf: false,
    keys: [],
    collectedObjectIds: [],
    rescuedAnimalIds: [],
    defeatedEnemyIds: [],
    openedDoorIds: [],
    status: "playing",
    steps: 0,
  };
}

export const restartLevel = createInitialGameState;

function addSorted<T extends string>(values: readonly T[], value: T): readonly T[] {
  if (values.includes(value)) {
    return values;
  }
  return [...values, value].sort() as T[];
}

function blocked(
  state: GameState,
  event: Extract<GameEvent, { readonly type: "blocked" }>,
): MoveResult {
  return { state, moved: false, events: [event] };
}

/**
 * Resolves one cardinal movement attempt. It never mutates the supplied level
 * or state, and every combat/pickup is committed at most once.
 */
export function movePlayer(
  level: LevelDefinition,
  state: GameState,
  direction: Direction,
): MoveResult {
  if (state.levelId !== level.id) {
    throw new Error(
      `State belongs to level "${state.levelId}", not "${level.id}".`,
    );
  }

  const delta = DIRECTION_DELTAS[direction];
  const attemptedTarget = {
    x: state.position.x + delta.x,
    y: state.position.y + delta.y,
  };

  if (state.status !== "playing") {
    return blocked(state, { type: "blocked", reason: "game-over", target: attemptedTarget });
  }

  let target = attemptedTarget;
  let terrain = getTerrainAt(level, target);
  if (terrain === undefined) {
    return blocked(state, { type: "blocked", reason: "out-of-bounds", target });
  }
  if (terrain === "wall") {
    return blocked(state, { type: "blocked", reason: "wall", target });
  }
  const jumpedHoles: Point[] = [];
  if (terrain === "hole") {
    if (!state.hasSpringBoots) {
      return blocked(state, {
        type: "blocked",
        reason: "needs-spring-boots",
        target,
        terrain,
      });
    }

    while (terrain === "hole") {
      jumpedHoles.push(target);
      target = {
        x: target.x + delta.x,
        y: target.y + delta.y,
      };
      terrain = getTerrainAt(level, target);
    }

    if (terrain === undefined) {
      return blocked(state, { type: "blocked", reason: "out-of-bounds", target });
    }
    if (terrain === "wall") {
      return blocked(state, { type: "blocked", reason: "wall", target });
    }
  }
  if ((terrain === "water" || terrain === "lava") && !state.hasBoots) {
    return blocked(state, {
      type: "blocked",
      reason: "needs-boots",
      target,
      terrain,
    });
  }
  if (terrain === "poison" && !state.hasAntidoteLeaf) {
    return blocked(state, {
      type: "blocked",
      reason: "needs-antidote-leaf",
      target,
      terrain,
    });
  }

  const object = getObjectAt(level, target);
  const events: GameEvent[] = [];
  if (jumpedHoles.length > 0) {
    events.push({
      type: "hole-jumped",
      from: state.position,
      over: jumpedHoles,
      to: target,
    });
  }
  let power = state.power;
  let hasSword = state.hasSword;
  let hasBoots = state.hasBoots;
  let hasSpringBoots = state.hasSpringBoots;
  let hasAntidoteLeaf = state.hasAntidoteLeaf;
  let keys = state.keys;
  let collectedObjectIds = state.collectedObjectIds;
  let rescuedAnimalIds = state.rescuedAnimalIds;
  let defeatedEnemyIds = state.defeatedEnemyIds;
  let openedDoorIds = state.openedDoorIds;

  if (object?.kind === "door" && !openedDoorIds.includes(object.id)) {
    if (!keys.includes(object.color)) {
      return blocked(state, {
        type: "blocked",
        reason: "needs-key",
        target,
        color: object.color,
      });
    }
    openedDoorIds = addSorted(openedDoorIds, object.id);
    events.push({
      type: "door-opened",
      objectId: object.id,
      color: object.color,
    });
  }

  if (object?.kind === "enemy" && !defeatedEnemyIds.includes(object.id)) {
    if (!hasSword) {
      return blocked(state, {
        type: "blocked",
        reason: "needs-sword",
        target,
      });
    }

    if (power < object.power) {
      return {
        state,
        moved: false,
        events: [
          {
            type: "enemy-too-strong",
            objectId: object.id,
            playerPower: power,
            enemyPower: object.power,
          },
        ],
      };
    }

    const powerBefore = power;
    power += object.power;
    defeatedEnemyIds = addSorted(defeatedEnemyIds, object.id);
    const defeatedEvent: Extract<GameEvent, { readonly type: "enemy-defeated" }> = {
      type: "enemy-defeated",
      objectId: object.id,
      enemyPower: object.power,
      powerBefore,
      powerAfter: power,
    };

    // Combat is an interaction at the edge of Ame's tile, not a movement into
    // the enemy's tile. Keeping her in place avoids the jarring post-battle
    // teleport and makes entering the newly cleared square a deliberate next
    // input. A combat interaction also does not increase the movement-based
    // step counter.
    return {
      state: {
        ...state,
        power,
        defeatedEnemyIds,
      },
      moved: false,
      events: [defeatedEvent],
    };
  }

  if (object?.kind === "animal" && !rescuedAnimalIds.includes(object.id)) {
    rescuedAnimalIds = addSorted(rescuedAnimalIds, object.id);
    events.push({
      type: "animal-rescued",
      objectId: object.id,
      species: object.species,
    });
  }

  if (
    object !== undefined &&
    object.kind !== "enemy" &&
    object.kind !== "door" &&
    object.kind !== "animal" &&
    !collectedObjectIds.includes(object.id)
  ) {
    collectedObjectIds = addSorted(collectedObjectIds, object.id);
    switch (object.kind) {
      case "sword":
        hasSword = true;
        events.push({ type: "sword-collected", objectId: object.id });
        break;
      case "boots":
        hasBoots = true;
        events.push({ type: "boots-collected", objectId: object.id });
        break;
      case "spring-boots":
        hasSpringBoots = true;
        events.push({ type: "spring-boots-collected", objectId: object.id });
        break;
      case "antidote-leaf":
        hasAntidoteLeaf = true;
        events.push({ type: "antidote-leaf-collected", objectId: object.id });
        break;
      case "key":
        keys = addSorted<KeyColor>(keys, object.color);
        events.push({
          type: "key-collected",
          objectId: object.id,
          color: object.color,
        });
        break;
      case "potion": {
        const powerBefore = power;
        power += object.amount;
        events.push({
          type: "potion-collected",
          objectId: object.id,
          amount: object.amount,
          powerBefore,
          powerAfter: power,
        });
        break;
      }
    }
  }

  const nextSteps = state.steps + 1;
  const won = pointsEqual(target, level.exit);
  const nextState: GameState = {
    ...state,
    position: target,
    power,
    hasSword,
    hasBoots,
    hasSpringBoots,
    hasAntidoteLeaf,
    keys,
    collectedObjectIds,
    rescuedAnimalIds,
    defeatedEnemyIds,
    openedDoorIds,
    status: won ? "won" : "playing",
    steps: nextSteps,
  };

  events.push({ type: "moved", from: state.position, to: target });
  if (won) {
    events.push({ type: "level-won", steps: nextSteps, power });
  }

  return { state: nextState, moved: true, events };
}
