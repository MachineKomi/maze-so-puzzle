import { describe, expect, it } from "vitest";
import { MIMIC_ART } from "../artCatalog";
import {
  MIMIC_FAMILY_IDS,
  REWARD_RULES_VERSION,
  REWARD_TABLES,
  mimicOutcomeForBucket,
  resolveEnemyDrops,
  resolveMimic,
  resolveRescueDrop,
} from "./rewardRules";

describe("reward rules v1", () => {
  it("defines exactly 65 good-chest and 35 Mimic buckets", () => {
    const outcomes = Array.from({ length: 100 }, (_, bucket) => mimicOutcomeForBucket(bucket));
    expect(outcomes.filter((outcome) => outcome === "good-chest")).toHaveLength(65);
    expect(outcomes.filter((outcome) => outcome === "mimic")).toHaveLength(35);
    expect(() => mimicOutcomeForBucket(-1)).toThrow(RangeError);
    expect(() => mimicOutcomeForBucket(100)).toThrow(RangeError);
  });

  it("maps every gameplay Mimic family onto a complete static art triplet", () => {
    expect(Object.keys(MIMIC_ART).sort()).toEqual([...MIMIC_FAMILY_IDS].sort());
    for (const familyId of MIMIC_FAMILY_IDS) {
      expect(MIMIC_ART[familyId].closed.geometry.stateFamilyId).toBe(familyId);
      expect(MIMIC_ART[familyId]["good-open"].geometry.stateFamilyId).toBe(familyId);
      expect(MIMIC_ART[familyId].revealed.geometry.stateFamilyId).toBe(familyId);
    }
  });

  it("commits the same outcome and bounded reward for the same stable identity", () => {
    const identity = { runSeed: "run-ame-1", objectId: "chest-rose-1", familyId: "classic-mimic" } as const;
    const first = resolveMimic(identity);
    expect(resolveMimic(identity)).toEqual(first);
    expect(first.rulesVersion).toBe(REWARD_RULES_VERSION);
    expect(first.bucket).toBeGreaterThanOrEqual(0);
    expect(first.bucket).toBeLessThan(100);
    if (first.reward) {
      const range = REWARD_TABLES.goodChest[first.reward.currency];
      expect(first.reward.amount).toBeGreaterThanOrEqual(range.minimum);
      expect(first.reward.amount).toBeLessThanOrEqual(range.maximum);
    }
  });

  it("isolates object, family, and run identities without accepting empty IDs", () => {
    const base = { runSeed: "run-ame-2", objectId: "chest-1", familyId: "classic-mimic" } as const;
    const resolutions = [
      resolveMimic(base),
      resolveMimic({ ...base, objectId: "chest-2" }),
      resolveMimic({ ...base, runSeed: "run-ame-3" }),
      resolveMimic({ ...base, familyId: "candy-mimic" }),
    ];
    expect(new Set(resolutions.map((value) => `${value.bucket}:${value.reward?.amount ?? "m"}`)).size).toBeGreaterThan(1);
    expect(() => resolveMimic({ ...base, objectId: "" })).toThrow(TypeError);
  });

  it("keeps rescue and enemy drops positive, small, and deterministic", () => {
    const identity = { runSeed: "run-ame-4", objectId: "friend-fox-1" };
    expect(resolveRescueDrop(identity)).toEqual(resolveRescueDrop(identity));
    expect(resolveRescueDrop(identity).amount).toBeGreaterThanOrEqual(2);
    expect(resolveRescueDrop(identity).amount).toBeLessThanOrEqual(4);
    const enemy = resolveEnemyDrops({ ...identity, objectId: "enemy-slime-1" });
    expect(enemy).toHaveLength(2);
    expect(enemy[0]).toMatchObject({ currency: "gold" });
    expect(enemy[1]).toMatchObject({ currency: "science" });
    expect(enemy.every((drop) => drop.amount > 0)).toBe(true);
  });
});
