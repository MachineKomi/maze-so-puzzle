import { describe, expect, it } from "vitest";
import {
  applyLevelCompletion,
  createDefaultPlayerProgress,
  hasUnsupportedProgressProfile,
  LEGACY_PLAYER_PROGRESS_STORAGE_KEY,
  migratePlayerProgress,
  PLAYER_PROGRESS_SCHEMA_VERSION,
  PLAYER_PROGRESS_STORAGE_KEY,
  readPlayerProgress,
  recordEnemyDiscoveries,
  VERSION_FIVE_PLAYER_PROGRESS_STORAGE_KEY,
  VERSION_FOUR_PLAYER_PROGRESS_STORAGE_KEY,
  VERSION_THREE_PLAYER_PROGRESS_STORAGE_KEY,
  VERSION_TWO_PLAYER_PROGRESS_STORAGE_KEY,
  writePlayerProgress,
  type PlayerProgress,
  type ProgressStorage,
} from "./progress";

class MemoryStorage implements ProgressStorage {
  readonly values = new Map<string, string>();
  getItem(key: string): string | null { return this.values.get(key) ?? null; }
  setItem(key: string, value: string): void { this.values.set(key, value); }
}

function rewardedProgress(): PlayerProgress {
  const first = applyLevelCompletion(createDefaultPlayerProgress(), {
    levelId: "little-star-trail", source: "curated", campaignIndex: 0,
    contentRevision: 1, gameplayFingerprint: "before-layout",
    rescuedCount: 3, totalRescueCount: 3, rescuedSpecies: ["bunny", "fox", "kitten"],
    steps: 24, power: 7, completionId: "test-first-receipt", bonusGold: 9, sciencePoints: 3,
  });
  return applyLevelCompletion(first, {
    levelId: "little-star-trail", source: "curated", campaignIndex: 0,
    contentRevision: 2, gameplayFingerprint: "current-layout",
    rescuedCount: 2, totalRescueCount: 3, rescuedSpecies: ["bunny", "fox"],
    steps: 30, power: 8, completionId: "test-second-receipt", bonusGold: 4, sciencePoints: 2,
  });
}

describe("bestiary discovery persistence", () => {
  it("records first encounters once without touching rewards, campaign access or run receipts", () => {
    const before = rewardedProgress();
    const after = recordEnemyDiscoveries(before, ["moon-bat", "goblin", "moon-bat"]);
    expect(after).toEqual({ ...before, discoveredEnemyIds: ["moon-bat", "goblin"] });
    expect(before.discoveredEnemyIds).toEqual([]);
    expect(recordEnemyDiscoveries(after, ["goblin", "moon-bat"])).toBe(after);
    expect(recordEnemyDiscoveries(after, [])).toBe(after);
    expect(after.completionReceipts).toBe(before.completionReceipts);
    expect(after.bestResultsByLevel).toBe(before.bestResultsByLevel);
  });

  it("preserves unknown future catalogue IDs through sanitization, storage and completion", () => {
    const discovered = recordEnemyDiscoveries(rewardedProgress(), ["future-lantern-owl", "goblin"]);
    const completed = applyLevelCompletion(discovered, {
      levelId: "shiny-sword", source: "curated", campaignIndex: 1,
      rescuedCount: 0, steps: 40, power: 4, completionId: "test-third-receipt",
    });
    const storage = new MemoryStorage();
    expect(writePlayerProgress(completed, storage)).toBe(true);
    expect(readPlayerProgress(storage)).toEqual(completed);
    expect(completed.discoveredEnemyIds).toEqual(["future-lantern-owl", "goblin"]);
    expect(completed.completionReceipts).toContain("test-third-receipt");
  });

  it("sanitizes duplicate, blank, unsafe and non-string identifiers without guessing enemies", () => {
    const migrated = migratePlayerProgress({
      ...createDefaultPlayerProgress(),
      discoveredEnemyIds: [" goblin ", "goblin", "", "__proto__", "constructor", "prototype", 9, {}, "moon-bat"],
    });
    expect(migrated.discoveredEnemyIds).toEqual(["goblin", "moon-bat"]);
    expect(recordEnemyDiscoveries(migrated, ["", "constructor", "goblin"])).toBe(migrated);
    expect(migratePlayerProgress({ ...migrated, discoveredEnemyIds: "goblin" }).discoveredEnemyIds).toEqual([]);
  });

  it("migrates v5 without changing any existing reward, receipt or historical campaign record", () => {
    const before = rewardedProgress();
    const { discoveredEnemyIds: _discovery, ...oldFields } = before;
    const stored = JSON.stringify({ ...oldFields, schemaVersion: 5 });
    const storage = new MemoryStorage();
    storage.values.set(VERSION_FIVE_PLAYER_PROGRESS_STORAGE_KEY, stored);
    const after = readPlayerProgress(storage);
    expect(after).toEqual(before);
    expect(after.discoveredEnemyIds).toEqual([]);
    expect(storage.getItem(VERSION_FIVE_PLAYER_PROGRESS_STORAGE_KEY)).toBe(stored);
    expect(JSON.parse(storage.getItem(PLAYER_PROGRESS_STORAGE_KEY)!)).toEqual(after);
    expect(after.bestResultsByLevel["little-star-trail"]?.historicalBestSteps).toBe(24);
  });

  it.each([
    [5, VERSION_FIVE_PLAYER_PROGRESS_STORAGE_KEY],
    [4, VERSION_FOUR_PLAYER_PROGRESS_STORAGE_KEY],
    [3, VERSION_THREE_PLAYER_PROGRESS_STORAGE_KEY],
    [2, VERSION_TWO_PLAYER_PROGRESS_STORAGE_KEY],
  ])("migrates v%i with empty discovery even if it contains an experimental discovery field", (version, key) => {
    const storage = new MemoryStorage();
    const raw = JSON.stringify({
      ...rewardedProgress(), schemaVersion: version, discoveredEnemyIds: ["moon-bat"],
    });
    storage.values.set(key, raw);
    const migrated = readPlayerProgress(storage);
    expect(migrated.schemaVersion).toBe(PLAYER_PROGRESS_SCHEMA_VERSION);
    expect(migrated.discoveredEnemyIds).toEqual([]);
    expect(migrated.gold).toBe(rewardedProgress().gold);
    expect(migrated.sciencePoints).toBe(5);
    expect(migrated.completionReceipts).toEqual(version === 5 ? rewardedProgress().completionReceipts : []);
    expect(storage.getItem(key)).toBe(raw);
  });

  it("migrates numeric and object v1 access without inventing discoveries", () => {
    const storage = new MemoryStorage();
    storage.values.set(LEGACY_PLAYER_PROGRESS_STORAGE_KEY, "4");
    expect(readPlayerProgress(storage)).toMatchObject({ unlockedLevelCount: 4, discoveredEnemyIds: [] });
    expect(migratePlayerProgress({ schemaVersion: 1, unlocked: 3, discoveredEnemyIds: ["goblin"] }))
      .toMatchObject({ unlockedLevelCount: 3, discoveredEnemyIds: [] });
  });

  it("prefers a v6 discovery profile over an older v5 profile", () => {
    const storage = new MemoryStorage();
    storage.values.set(VERSION_FIVE_PLAYER_PROGRESS_STORAGE_KEY, JSON.stringify({ ...rewardedProgress(), schemaVersion: 5 }));
    const current = recordEnemyDiscoveries(rewardedProgress(), ["moon-bat"]);
    expect(writePlayerProgress(current, storage)).toBe(true);
    expect(readPlayerProgress(storage)).toEqual(current);
  });

  it("never replaces a newer schema with defaults or a stale legacy profile", () => {
    const storage = new MemoryStorage();
    const future = JSON.stringify({ schemaVersion: 99, gold: 876, futureReward: { secret: "preserve" } });
    storage.values.set(PLAYER_PROGRESS_STORAGE_KEY, future);
    storage.values.set(VERSION_FIVE_PLAYER_PROGRESS_STORAGE_KEY, JSON.stringify({ ...rewardedProgress(), schemaVersion: 5 }));
    expect(hasUnsupportedProgressProfile(storage)).toBe(true);
    expect(readPlayerProgress(storage)).toEqual(createDefaultPlayerProgress());
    expect(writePlayerProgress(recordEnemyDiscoveries(createDefaultPlayerProgress(), ["goblin"]), storage)).toBe(false);
    expect(storage.getItem(PLAYER_PROGRESS_STORAGE_KEY)).toBe(future);
    expect(storage.values.size).toBe(2);
  });

  it("rechecks the stored schema before every write and refuses a newer in-memory snapshot", () => {
    const storage = new MemoryStorage();
    const progress = readPlayerProgress(storage);
    const future = JSON.stringify({ schemaVersion: 7, futureReward: "from another tab" });
    storage.values.set(PLAYER_PROGRESS_STORAGE_KEY, future);
    expect(writePlayerProgress(progress, storage)).toBe(false);
    expect(storage.getItem(PLAYER_PROGRESS_STORAGE_KEY)).toBe(future);
    const emptyStorage = new MemoryStorage();
    expect(writePlayerProgress({ ...progress, schemaVersion: 7 } as unknown as PlayerProgress, emptyStorage)).toBe(false);
    expect(emptyStorage.values.size).toBe(0);
  });

  it("treats unavailable or malformed storage as unavailable/corrupt, without claiming a future profile", () => {
    expect(hasUnsupportedProgressProfile(null)).toBe(false);
    const storage = new MemoryStorage();
    storage.values.set(PLAYER_PROGRESS_STORAGE_KEY, "{broken");
    expect(hasUnsupportedProgressProfile(storage)).toBe(false);
    expect(writePlayerProgress(createDefaultPlayerProgress(), storage)).toBe(true);
  });
});
