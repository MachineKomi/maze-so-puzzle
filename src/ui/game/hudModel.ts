import { resolveAnimalArt, resolveCageArt, resolveKeyArt, resolveWeaponArt, PICKUP_ART } from "../../artCatalog";
import type { GameState, LevelDefinition, LevelObject, KeyColor } from "../../game/types";
import type { UiArt } from "../art";

export interface EquipmentSlot { readonly id: string; readonly label: string; readonly art: UiArt; readonly found: boolean; readonly description: string }
export interface EquipmentDefinition {
  readonly id: string;
  readonly matches: (object: LevelObject) => boolean;
  readonly art: (object: LevelObject) => UiArt;
  readonly found: (game: GameState, object: LevelObject) => boolean;
  readonly description: string;
}
export const EQUIPMENT_REGISTRY: readonly EquipmentDefinition[] = [
  { id: "weapon", matches: o => o.kind === "sword", art: o => resolveWeaponArt(o.kind === "sword" ? o.style : undefined) as UiArt, found: g => g.hasSword, description: "A maze weapon lets Ame challenge guardians. Match or beat their Power to win." },
  { id: "boots", matches: o => o.kind === "boots", art: () => PICKUP_ART.boots, found: g => g.hasBoots, description: "Splash Boots make water and warm magical lava safe to cross." },
  { id: "spring-boots", matches: o => o.kind === "spring-boots", art: () => PICKUP_ART.springBoots, found: g => g.hasSpringBoots, description: "Spring Boots jump straight across a whole run of holes to a safe landing." },
  { id: "antidote-leaf", matches: o => o.kind === "antidote-leaf", art: () => PICKUP_ART.antidoteLeaf, found: g => g.hasAntidoteLeaf, description: "The Antidote Leaf makes purple poison safe to cross." },
  ...(["red", "yellow", "blue"] as const).map((color: KeyColor): EquipmentDefinition => ({ id: `key-${color}`, matches: o => o.kind === "key" && o.color === color, art: () => resolveKeyArt(color), found: g => g.keys.includes(color), description: "This reusable key opens doors with the same colour and shape. It stays in your bag." })),
];
export function buildAdventureHudModel(level: LevelDefinition, game: GameState, registry = EQUIPMENT_REGISTRY) {
  const slots = registry.flatMap((entry): EquipmentSlot[] => {
    const object = level.objects.find(entry.matches);
    if (!object) return [];
    const art = entry.art(object);
    return [{ id: entry.id, label: art.label, art, found: entry.found(game, object), description: entry.description }];
  });
  const friends = level.objects.flatMap(object => object.kind === "animal" ? [{
    id: object.id, species: object.species, label: resolveAnimalArt(object.species).label,
    art: resolveAnimalArt(object.species), cage: resolveCageArt(object.cageStyle), rescued: game.rescuedAnimalIds.includes(object.id),
  }] : []);
  return { objective: level.objective, slots, bagFound: slots.filter(s => s.found).length, bagTotal: slots.length,
    friends, rescued: friends.filter(f => f.rescued).length, rescueTotal: friends.length };
}
export type AdventureHudModel = ReturnType<typeof buildAdventureHudModel>;
