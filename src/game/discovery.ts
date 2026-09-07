import { getVisibleTileKeys, toTileKey, type TileKey } from "./exploration";
import type { LevelDefinition, Point } from "./types";

/**
 * Bestiary exposure follows the supplied authoritative gameplay view, never
 * the renderer's padded travel gutter or the whole authored object catalogue.
 * Call only while normal gameplay is visible, after dismissing the story.
 * Ordinary treasure/chests do not reveal a possible future mimic identity.
 * Legacy callers without keys retain the six-square view.
 */
export function enemyDiscoveriesForView(
  level: LevelDefinition,
  position: Point,
  defeatedEnemyIds: readonly string[] = [],
  visibleKeys?: Iterable<TileKey>,
): readonly string[] {
  const visible = new Set(visibleKeys ?? getVisibleTileKeys(level, position));
  const defeated = new Set(defeatedEnemyIds);
  return [...new Set(level.objects.flatMap(object => (
    object.kind === "enemy"
      && visible.has(toTileKey(object.at))
      && !defeated.has(object.id)
      ? [object.style ?? "goblin"]
      : []
  )))];
}

/** Same gameplay exposure as guardians; rescues also prove the specific friend. */
export function friendDiscoveriesForView(level: LevelDefinition, position: Point, rescuedAnimalIds: readonly string[] = [], visibleKeys?: Iterable<TileKey>): readonly string[] {
  const visible = new Set(visibleKeys ?? getVisibleTileKeys(level, position));
  const rescued = new Set(rescuedAnimalIds);
  return [...new Set(level.objects.flatMap(object => object.kind === "animal"
    && (visible.has(toTileKey(object.at)) || rescued.has(object.id)) ? [object.species] : []))];
}
