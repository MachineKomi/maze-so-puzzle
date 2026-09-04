/** Versioned gameplay truth for future Mimics and reusable reward showers. */
export const REWARD_RULES_VERSION = 1 as const;

export const MIMIC_FAMILY_IDS = ["classic-mimic", "candy-mimic"] as const;
export type MimicFamilyId = typeof MIMIC_FAMILY_IDS[number];
export type RewardCurrency = "gold" | "science";

export interface RewardAmount {
  readonly currency: RewardCurrency;
  readonly amount: number;
}

export interface DeterministicRewardIdentity {
  readonly runSeed: string;
  readonly objectId: string;
}

export interface MimicResolution extends DeterministicRewardIdentity {
  readonly rulesVersion: typeof REWARD_RULES_VERSION;
  readonly familyId: MimicFamilyId;
  readonly bucket: number;
  readonly outcome: "good-chest" | "mimic";
  readonly reward?: RewardAmount;
}

export const REWARD_TABLES = Object.freeze({
  mimicOutcomeBuckets: Object.freeze({ goodChest: 65, mimic: 35 }),
  goodChestCurrencyBuckets: Object.freeze({ gold: 70, science: 30 }),
  goodChest: Object.freeze({
    gold: Object.freeze({ minimum: 8, maximum: 14 }),
    science: Object.freeze({ minimum: 3, maximum: 5 }),
  }),
  ordinaryTreasure: Object.freeze({
    "gold-bag": Object.freeze({ currency: "gold", amount: 3 }),
    "gold-chest": Object.freeze({ currency: "gold", amount: 8 }),
    "science-gears": Object.freeze({ currency: "science", amount: 2 }),
    "science-beaker": Object.freeze({ currency: "science", amount: 4 }),
  }),
  rescue: Object.freeze({
    gold: Object.freeze({ minimum: 2, maximum: 4 }),
  }),
  enemy: Object.freeze({
    gold: Object.freeze({ minimum: 1, maximum: 3 }),
    science: Object.freeze({ minimum: 1, maximum: 2 }),
  }),
} as const);

function safeIdentityPart(value: string, label: string): string {
  const normalized = value.trim();
  if (normalized.length === 0 || normalized.length > 256) {
    throw new TypeError(`${label} must be between 1 and 256 characters.`);
  }
  return normalized;
}

function stableHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function deterministicValue(
  identity: DeterministicRewardIdentity,
  channel: string,
  modulo: number,
): number {
  const runSeed = safeIdentityPart(identity.runSeed, "runSeed");
  const objectId = safeIdentityPart(identity.objectId, "objectId");
  return stableHash(`${REWARD_RULES_VERSION}\u0000${runSeed}\u0000${objectId}\u0000${channel}`) % modulo;
}

function amountInRange(
  identity: DeterministicRewardIdentity,
  channel: string,
  range: { readonly minimum: number; readonly maximum: number },
): number {
  return range.minimum
    + deterministicValue(identity, channel, range.maximum - range.minimum + 1);
}

/** The explicit 0–64 good / 65–99 Mimic partition is stable and auditable. */
export function mimicOutcomeForBucket(bucket: number): "good-chest" | "mimic" {
  if (!Number.isSafeInteger(bucket) || bucket < 0 || bucket > 99) {
    throw new RangeError("A Mimic outcome bucket must be an integer from 0 to 99.");
  }
  return bucket < REWARD_TABLES.mimicOutcomeBuckets.goodChest ? "good-chest" : "mimic";
}

export function resolveMimic(
  identity: DeterministicRewardIdentity & { readonly familyId: MimicFamilyId },
): MimicResolution {
  const bucket = deterministicValue(identity, `mimic:${identity.familyId}:outcome`, 100);
  const outcome = mimicOutcomeForBucket(bucket);
  if (outcome === "mimic") {
    return { ...identity, rulesVersion: REWARD_RULES_VERSION, bucket, outcome };
  }

  const currencyBucket = deterministicValue(identity, `mimic:${identity.familyId}:currency`, 100);
  const currency: RewardCurrency = currencyBucket < REWARD_TABLES.goodChestCurrencyBuckets.gold
    ? "gold"
    : "science";
  return {
    ...identity,
    rulesVersion: REWARD_RULES_VERSION,
    bucket,
    outcome,
    reward: {
      currency,
      amount: amountInRange(identity, `mimic:${identity.familyId}:${currency}:amount`, REWARD_TABLES.goodChest[currency]),
    },
  };
}

export function resolveRescueDrop(identity: DeterministicRewardIdentity): RewardAmount {
  return {
    currency: "gold",
    amount: amountInRange(identity, "rescue:gold", REWARD_TABLES.rescue.gold),
  };
}

export function resolveEnemyDrops(identity: DeterministicRewardIdentity): readonly RewardAmount[] {
  return Object.freeze([
    { currency: "gold", amount: amountInRange(identity, "enemy:gold", REWARD_TABLES.enemy.gold) },
    { currency: "science", amount: amountInRange(identity, "enemy:science", REWARD_TABLES.enemy.science) },
  ]);
}
