import { getVisibleTileKeys, toTileKey } from "./exploration";
import type { LevelDefinition, Point } from "./types";

/**
 * Bestiary exposure follows the authoritative six-tile gameplay view, never
 * the renderer's padded travel gutter or the whole authored object catalogue.
 * Call only while normal gameplay is visible, after dismissing the story.
 * Ordinary treasure/chests do not reveal a possible future mimic identity.
 */
export function enemyDiscoveriesForView(
  level: LevelDefinition,
  position: Point,
  defeatedEnemyIds: readonly string[] = [],
): readonly string[] {
  const visible = new Set(getVisibleTileKeys(level, position));
  const defeated = new Set(defeatedEnemyIds);
  return [...new Set(level.objects.flatMap(object => (
    object.kind === "enemy"
      && visible.has(toTileKey(object.at))
      && !defeated.has(object.id)
      ? [object.style ?? "goblin"]
      : []
  )))];
}
