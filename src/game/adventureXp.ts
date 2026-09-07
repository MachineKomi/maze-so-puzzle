/** Recognition only. Neither this curve nor these drops affect puzzle Power. */
export const ADVENTURE_XP_RULES = 1;
export const MAX_ADVENTURE_LEVEL = 99;
export const COMPLETION_XP = 10;
export const xpThreshold = (level: number): number => 5 * (level - 1) * (level + 2);
export const MAX_ADVENTURE_XP = xpThreshold(MAX_ADVENTURE_LEVEL);
export function boundedXp(value: unknown): number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0
    ? Math.min(MAX_ADVENTURE_XP, value) : 0;
}
export function enemyXp(power: number, mimic = false): number {
  return (power >= 20 ? 10 : power >= 9 ? 6 : power >= 4 ? 4 : 2) * (mimic ? 2 : 1);
}
export function adventureProgress(value: number) {
  const xp = boundedXp(value);
  let level = 1;
  while (level < MAX_ADVENTURE_LEVEL && xp >= xpThreshold(level + 1)) level++;
  const start = xpThreshold(level), max = level === MAX_ADVENTURE_LEVEL;
  const needed = max ? 0 : xpThreshold(level + 1) - start;
  return { xp, level, max, earned: max ? 0 : xp - start, needed };
}
