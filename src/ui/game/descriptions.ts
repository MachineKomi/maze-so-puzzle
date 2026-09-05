import type { LevelObject } from "../../game/types";
import { resolveEnemyArt, resolveWeaponArt, resolveKeyArt, resolveDoorArt, resolveAnimalArt, resolvePortalArt } from "../../artCatalog";

export function describeObject(object: LevelObject): string {
  switch (object.kind) {
    case "enemy": return `${resolveEnemyArt(object.style).label.toLowerCase()} with Power ${object.power}`;
    case "sword": return resolveWeaponArt(object.style).label.toLowerCase();
    case "boots": return "protective boots";
    case "spring-boots": return "spring boots";
    case "antidote-leaf": return "antidote leaf";
    case "potion": return `Power potion worth ${object.amount}`;
    case "key": return resolveKeyArt(object.color).label.toLowerCase();
    case "door": return `${resolveDoorArt(object.color).label.toLowerCase()}, locked`;
    case "animal": return `caged ${resolveAnimalArt(object.species).label.toLowerCase()}`;
    case "portal": return `${resolvePortalArt(object.pair).label.toLowerCase()} magic flower`;
    case "treasure": return object.currency === "gold"
      ? `${object.amount} bonus Gold Stars`
      : `${object.amount} Science Points`;
  }
}
