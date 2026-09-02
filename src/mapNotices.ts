import { ASSETS } from "./assets";
import { resolveKeyArt, resolveWeaponArt } from "./artCatalog";
import type { GameEvent, LevelDefinition, Point } from "./game/types";

export interface MapPickupToast {
  readonly id: number;
  readonly icon?: string;
  readonly text: string;
  readonly kind?: "pickup" | "power";
  readonly at?: Point;
}

/** Maps every collectible family to its actual rendered inventory sprite. */
export function pickupToastFor(
  events: readonly GameEvent[],
  level: LevelDefinition,
): Omit<MapPickupToast, "id"> | null {
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const event = events[index]!;
    switch (event.type) {
      case "sword-collected": {
        const object = level.objects.find((candidate) => candidate.id === event.objectId);
        const weapon = resolveWeaponArt(object?.kind === "sword" ? object.style : undefined);
        return { icon: weapon.src, text: `Picked up the ${weapon.label}!`, kind: "pickup" };
      }
      case "boots-collected":
        return { icon: ASSETS.boots, text: "Picked up the Splash Boots!", kind: "pickup" };
      case "spring-boots-collected":
        return { icon: ASSETS.springBoots, text: "Picked up the Spring Boots!", kind: "pickup" };
      case "antidote-leaf-collected":
        return { icon: ASSETS.antidoteLeaf, text: "Picked up the Antidote Leaf!", kind: "pickup" };
      case "potion-collected":
        return { icon: ASSETS.potion, text: `Picked up a Power Potion! +${event.amount} Power`, kind: "pickup" };
      case "key-collected":
        return { icon: resolveKeyArt(event.color).src, text: `Picked up the ${resolveKeyArt(event.color).label}!`, kind: "pickup" };
      case "treasure-collected":
        return event.currency === "gold"
          ? { icon: ASSETS.treasureGoldChest, text: `Collected ${event.amount} Gold Stars!`, kind: "pickup" }
          : { icon: ASSETS.treasureScienceGears, text: `Collected ${event.amount} Science Points!`, kind: "pickup" };
      default:
        break;
    }
  }
  return null;
}

/** Creates the short reward beat shown above Ame once combat has finished. */
export function combatPowerNotice(
  event: Extract<GameEvent, { type: "enemy-defeated" }>,
  at: Point,
): Omit<MapPickupToast, "id"> {
  return {
    text: `+${event.enemyPower}!`,
    kind: "power",
    at,
  };
}
