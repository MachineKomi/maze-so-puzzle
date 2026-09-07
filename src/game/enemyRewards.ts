import type { TreasureCurrency } from "./types";

/** Rules 5: bounded optional rewards. Power remains the puzzle's own reward. */
export const ENEMY_REWARD_RULES = 5;
export const SIMULATION_RUN_ID = "run-simulation-fixed";
export const ENEMY_REWARD_BANDS = [
  { minimumPower: 1, gold: [1, 3], science: [1, 2] },
  { minimumPower: 4, gold: [2, 4], science: [1, 2] },
  { minimumPower: 9, gold: [3, 5], science: [2, 3] },
  { minimumPower: 20, gold: [4, 6], science: [2, 4] },
] as const;

export function enemyRewardRange(power: number, currency: TreasureCurrency): readonly [number, number] {
  if (!Number.isSafeInteger(power) || power < 1) throw Error("Enemy Power must be a positive safe integer");
  return ([...ENEMY_REWARD_BANDS].reverse().find(band => power >= band.minimumPower) ?? ENEMY_REWARD_BANDS[0])[currency];
}

/** Framed independent channels: adding a currency cannot perturb another roll. */
export function enemyRewardAmount(runId: string, levelId: string, objectId: string,
  power: number, currency: TreasureCurrency): number {
  let hash = 0x811c9dc5;
  for (const char of JSON.stringify([ENEMY_REWARD_RULES, runId, levelId, objectId, currency])) {
    hash = Math.imul(hash ^ char.charCodeAt(0), 0x01000193);
  }
  const [min, max] = enemyRewardRange(power, currency);
  return min + (hash >>> 0) % (max - min + 1);
}
