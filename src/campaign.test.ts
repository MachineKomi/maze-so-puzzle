import { describe, expect, it } from "vitest";
import { CURRENT_CAMPAIGN_ORDER, contiguousUnlockedCount, migrateCampaignAccess } from "./campaign";
import { CURATED_LEVELS } from "./game/levels";

describe("versioned campaign access", () => {
  it("preserves partial access by stable ID when chapters are inserted", () => {
    const previous = ["a", "b", "c", "final"];
    const current = ["a", "new-1", "b", "c", "new-2", "final", "encore"];
    expect(migrateCampaignAccess({ previousOrder: previous, currentOrder: current, unlockedCount: 3 }))
      .toEqual(["a", "new-1", "b", "c"]);
  });

  it("opens the first post-finale chapter for a legacy-complete player", () => {
    const previous = ["a", "final"];
    const current = ["a", "inserted", "final", "encore-1", "encore-2"];
    expect(migrateCampaignAccess({
      previousOrder: previous,
      currentOrder: current,
      unlockedCount: 2,
      completedLevelIds: previous,
    })).toEqual(["a", "inserted", "final", "encore-1"]);
  });

  it("keeps the current campaign count bounded", () => {
    expect(contiguousUnlockedCount(CURRENT_CAMPAIGN_ORDER, [...CURRENT_CAMPAIGN_ORDER, "future"])).toBe(16);
  });

  it("keeps runtime level order identical to the versioned campaign authority", () => {
    expect(CURATED_LEVELS.map((level) => level.id)).toEqual(CURRENT_CAMPAIGN_ORDER);
  });

  it("fills inserted chapters before the furthest stable unlocked ID", () => {
    expect(migrateCampaignAccess({
      previousOrder: ["a", "b", "c"],
      currentOrder: ["a", "new", "b", "c"],
      unlockedCount: 99,
      unlockedLevelIds: ["a", "b"],
    })).toEqual(["a", "new", "b"]);
  });

  it("clamps oversized legacy counts before locating an insertion frontier", () => {
    expect(migrateCampaignAccess({
      previousOrder: ["a", "b", "c"],
      currentOrder: ["a", "new", "b", "c"],
      unlockedCount: 99,
    })).toEqual(["a", "new", "b", "c"]);
  });
});
