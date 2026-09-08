import { getObjectAt, isObjectResolved, movePlayer, pointKey } from "./engine";
import { fingerprintText } from "./contentIdentity";
import { getRequiredPath } from "./reachability";
import type { Direction, GameEvent, GameState, LevelDefinition, LevelObject } from "./types";

export const HINT_TIER_COUNT = 4;
export type HintTier = 0 | 1 | 2 | 3;
// Generic rule pictures only: never carry an unseen character or portal variant.
export type HintPicture = "goal" | "sword" | "boots" | "springBoots" | "antidoteLeaf" | "potion" | "navHelp" | "navMazes";

export interface ProgressiveHint {
  readonly tier: HintTier;
  readonly text: string;
  readonly picture: HintPicture;
  readonly direction?: Direction;
  readonly targetObjectId?: string;
  readonly routeLength: number;
}

function pictureFor(object: LevelObject | undefined, event?: GameEvent): HintPicture {
  if (!object) return event?.type === "hole-jumped" ? "springBoots" : "goal";
  switch (object.kind) {
    case "sword": case "boots": case "potion": return object.kind;
    case "spring-boots": return "springBoots";
    case "antidote-leaf": return "antidoteLeaf";
    case "key": case "door": return "navHelp";
    case "portal": return "navMazes";
    default: return "navHelp";
  }
}

export function nextHintTier(previousUses: number): HintTier {
  return Math.min(HINT_TIER_COUNT - 1, Math.max(0, Math.floor(previousUses))) as HintTier;
}

function labelFor(object: LevelObject | undefined, event?: GameEvent): string {
  if (!object && event?.type === "hole-jumped") return "the single-hole crossing";
  if (!object) return "the sparkling exit";
  switch (object.kind) {
    case "chest": return "the closed chest";
    case "sword": return "the maze weapon";
    case "boots": return "the Splash Boots";
    case "spring-boots": return "the Spring Boots";
    case "antidote-leaf": return "the Antidote Leaf";
    case "potion": return "a Power Potion";
    case "key": return "a matching key";
    case "door": return "a matching door";
    case "enemy": return "a guardian";
    case "portal": return "a matching flower portal";
    case "treasure": return "the treasure";
    case "animal": return "the optional friend";
  }
}

function principleFor(object: LevelObject | undefined, event?: GameEvent): string {
  if (!object && event?.type === "hole-jumped") {
    return "Spring Boots jump straight across one hole to a clear landing. Cross a long ditch across its narrow side.";
  }
  if (!object) return "The sparkling star finishes the maze. You can leave optional friends and treasure for another adventure.";
  switch (object.kind) {
    case "chest": return "Bump a closed chest to see what is inside. If a guardian is revealed, it waits while you prepare.";
    case "sword": return "Ame needs the maze weapon before she can ask a guardian to move.";
    case "boots": return "Splash Boots make both water and warm lava safe to cross.";
    case "spring-boots": return "Spring Boots cross exactly one hole when clear ground is immediately beyond it.";
    case "antidote-leaf": return "The Antidote Leaf makes the purple poison safe to cross.";
    case "potion": return "A Power Potion can make a guardian with a bigger number fair to challenge.";
    case "key": return "Keys are reusable. Match a key's colour and shape to its doors.";
    case "door": return "Doors wait for a matching key. Keys stay in your bag and can be used again.";
    case "enemy": return "Equal Power wins safely. Ame needs the maze weapon and at least as much Power as the guardian.";
    case "portal": return "Matching flower portals are a persistent pair: stepping on one always arrives at its twin.";
    case "treasure": return "Treasure is optional; it is never needed to reach the star.";
    case "animal": return "Friends are optional adventures; the star completes the maze.";
  }
}

function firstRequiredMoment(level: LevelDefinition, state: GameState, route: readonly Direction[]): {
  readonly object?: LevelObject;
  readonly event?: GameEvent;
  readonly direction?: Direction;
} {
  let cursor = state;
  for (const direction of route) {
    const before = cursor;
    const result = movePlayer(level, cursor, direction);
    const meaningful = result.events.find((event) => ![
      "moved",
      "level-won",
      "treasure-opened",
      "animal-rescued",
    ].includes(event.type));
    const target = result.events.find((event) => event.type === "moved");
    const destination = target?.type === "moved" ? target.to : {
      x: before.position.x + (direction === "left" ? -1 : direction === "right" ? 1 : 0),
      y: before.position.y + (direction === "up" ? -1 : direction === "down" ? 1 : 0),
    };
    const foundObject = getObjectAt(level, destination);
    const object = foundObject?.kind === "treasure"
      || foundObject?.kind === "animal"
      || (foundObject !== undefined && isObjectResolved(foundObject, before))
      ? undefined
      : foundObject;
    if (meaningful || object) return { object, event: meaningful, direction };
    cursor = result.state;
  }
  return { direction: route[0] };
}

/** Replayable four-tier help derived only from an engine-valid zero-rescue route. */
export function getProgressiveHint(
  level: LevelDefinition,
  state: GameState,
  usesAtThisState: number,
): ProgressiveHint {
  const tier = nextHintTier(usesAtThisState);
  const route = getRequiredPath(level, state);
  if (!route || route.length === 0) return { tier, picture: "navHelp", text: state.status === "won"
    ? "You found the star! You can stay to explore or move on."
    : "Let's look again. Check the explored map for a route to the sparkling exit, or ask someone to look with you.", routeLength: 0 };
  const moment = firstRequiredMoment(level, state, route);
  const picture = pictureFor(moment.object, moment.event);
  const targetLabel = labelFor(moment.object, moment.event);
  if (tier === 0) {
    return { tier, picture, text: `The next required goal is ${targetLabel}. Friends and treasure are optional adventures.`, routeLength: route.length };
  }
  if (tier === 1) {
    return { tier, picture, text: principleFor(moment.object, moment.event), routeLength: route.length };
  }
  if (tier === 2) {
    const first = route[0]!;
    return {
      tier,
      picture,
      text: `Explore ${first} from here. Your next useful landmark is ${targetLabel}.`,
      targetObjectId: moment.object?.id,
      routeLength: route.length,
    };
  }
  const first = route[0]!;
  return {
    tier,
    picture,
    text: `Try ${first} first. That begins a ${route.length}-move required path toward ${targetLabel}.`,
    direction: first,
    targetObjectId: moment.object?.id,
    routeLength: route.length,
  };
}

export function hintStateKey(state: GameState): string {
  // Persist a compact epoch key: semantic object IDs can be deliberately long
  // on later maps, while localStorage validation must accept every key the game
  // itself can produce. Optional rescue state is included because a resolved
  // friend may become safe to cross on an otherwise rescue-free hint route.
  return fingerprintText(JSON.stringify([
    pointKey(state.position),
    state.power,
    state.hasSword,
    state.hasBoots,
    state.hasSpringBoots,
    state.hasAntidoteLeaf,
    state.keys,
    state.collectedObjectIds,
    state.rescuedAnimalIds,
    state.defeatedEnemyIds,
    state.openedDoorIds,
    state.chests.map(c=>[c.objectId,c.phase]),
  ]));
}
