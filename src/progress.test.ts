import { describe, expect, it } from "vitest";
import {
  ACHIEVEMENT_LABELS,
  BADGE_LABELS,
  applyLevelCompletion,
  calculateLevelReward,
  createDefaultPlayerProgress,
  LEGACY_PLAYER_PROGRESS_STORAGE_KEY,
  migratePlayerProgress,
  PLAYER_PROGRESS_STORAGE_KEY,
  readPlayerProgress,
  REWARD_LABELS,
  STICKER_LABELS,
  VERSION_TWO_PLAYER_PROGRESS_STORAGE_KEY,
  writePlayerProgress,
  type LevelCompletionInput,
  type ProgressStorage,
} from "./progress";
import { ANIMAL_SPECIES, type AnimalSpecies } from "./game/types";

const SPECIES = ["bunny", "fox", "kitten"] as const;

function rescueTotals(
  overrides: Partial<Record<AnimalSpecies, number>> = {},
): Record<AnimalSpecies, number> {
  const totals = Object.fromEntries(
    ANIMAL_SPECIES.map((species) => [species, 0]),
  ) as Record<AnimalSpecies, number>;
  return { ...totals, ...overrides };
}

class MemoryStorage implements ProgressStorage {
  readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

const completion = (
  levelId: string,
  campaignIndex: number,
  rescuedCount: number,
  overrides: Partial<LevelCompletionInput> = {},
): LevelCompletionInput => ({
  levelId,
  source: "curated",
  campaignIndex,
  rescuedCount,
  rescuedSpecies: SPECIES.slice(0, rescuedCount),
  steps: 30,
  power: 5,
  ...overrides,
});

describe("player progress migration and persistence", () => {
  it("creates independent default saves", () => {
    const first = createDefaultPlayerProgress();
    const second = createDefaultPlayerProgress();

    expect(first).toEqual({
      schemaVersion: 3,
      unlockedLevelCount: 1,
      gold: 0,
      sciencePoints: 0,
      stickers: [],
      medals: [],
      badges: [],
      bestResultsByLevel: {},
      totalMazesCompleted: 0,
      totalCompletions: 0,
      generatedCompletions: 0,
      generatedMazesCompleted: 0,
      totalAnimalsRescued: 0,
      rescuesBySpecies: rescueTotals(),
      perfectRescueMazeCount: 0,
      currentPerfectRescueStreak: 0,
      bestPerfectRescueStreak: 0,
    });
    expect(first.stickers).not.toBe(second.stickers);
    expect(first.bestResultsByLevel).not.toBe(second.bestResultsByLevel);
    expect(first.rescuesBySpecies).not.toBe(second.rescuesBySpecies);
  });

  it.each([
    [4, 4],
    ["3", 3],
    ["0", 1],
    ["not a save", 1],
  ])("migrates a v1 value %j", (stored, expectedUnlocked) => {
    const migrated = migratePlayerProgress(stored);

    expect(migrated.schemaVersion).toBe(3);
    expect(migrated.unlockedLevelCount).toBe(expectedUnlocked);
    expect(migrated.gold).toBe(0);
  });

  it("reads and transparently copies the released numeric v1 save", () => {
    const storage = new MemoryStorage();
    storage.values.set(LEGACY_PLAYER_PROGRESS_STORAGE_KEY, "4");

    const loaded = readPlayerProgress(storage);
    const copied = JSON.parse(storage.values.get(PLAYER_PROGRESS_STORAGE_KEY) ?? "null") as {
      schemaVersion?: number;
      unlockedLevelCount?: number;
    };

    expect(loaded.unlockedLevelCount).toBe(4);
    expect(copied).toMatchObject({ schemaVersion: 3, unlockedLevelCount: 4 });
  });

  it("prefers a valid v2 save and sanitizes unsafe values", () => {
    const storage = new MemoryStorage();
    storage.values.set(LEGACY_PLAYER_PROGRESS_STORAGE_KEY, "4");
    storage.values.set(VERSION_TWO_PLAYER_PROGRESS_STORAGE_KEY, JSON.stringify({
      schemaVersion: 2,
      unlockedLevelCount: -8,
      gold: 14.9,
      stickers: ["animal-friend", "animal-friend", "made-up"],
      medals: [],
      totalAnimalsRescued: -1,
      perfectRescueMazeCount: 5,
      currentPerfectRescueStreak: 99,
      bestPerfectRescueStreak: 2,
      bestResultsByLevel: {
        meadow: {
          completions: 2.8,
          bestSteps: 21.7,
          bestPower: 9.9,
          bestRescuedCount: 99,
        },
      },
    }));

    const loaded = readPlayerProgress(storage);

    expect(loaded).toMatchObject({
      schemaVersion: 3,
      unlockedLevelCount: 1,
      gold: 14,
      stickers: ["animal-friend"],
      medals: ["perfect-rescue-5"],
      totalAnimalsRescued: ANIMAL_SPECIES.length,
      perfectRescueMazeCount: 5,
      currentPerfectRescueStreak: 5,
      bestPerfectRescueStreak: 5,
      badges: ["twinkle-toes"],
      totalMazesCompleted: 1,
      totalCompletions: 2,
      generatedCompletions: 0,
      generatedMazesCompleted: 0,
      rescuesBySpecies: { bunny: 0, fox: 0, kitten: 0 },
    });
    expect(loaded.bestResultsByLevel.meadow).toEqual({
      completions: 2,
      bestSteps: 21,
      bestPower: 9,
      bestRescuedCount: ANIMAL_SPECIES.length,
      totalRescueCount: 3,
      perfectRescue: true,
      source: null,
      bestRescuedSpecies: [],
    });
    expect(JSON.parse(storage.values.get(PLAYER_PROGRESS_STORAGE_KEY) ?? "null"))
      .toMatchObject({ schemaVersion: 3 });
  });

  it("migrates v2 species and generated history conservatively", () => {
    const migrated = migratePlayerProgress({
      schemaVersion: 2,
      unlockedLevelCount: 3,
      totalAnimalsRescued: 7,
      generatedCompletions: 99,
      generatedMazesCompleted: 99,
      rescuesBySpecies: { bunny: 99, fox: 99, kitten: 99 },
      badges: ["maze-explorer-20"],
      bestResultsByLevel: {
        meadow: {
          completions: 2,
          bestSteps: 80,
          bestPower: 4,
          bestRescuedCount: 2,
          source: "generated",
          bestRescuedSpecies: ["bunny", "fox"],
        },
      },
    });

    expect(migrated).toMatchObject({
      schemaVersion: 3,
      totalMazesCompleted: 1,
      totalCompletions: 2,
      generatedCompletions: 0,
      generatedMazesCompleted: 0,
      totalAnimalsRescued: 7,
      rescuesBySpecies: { bunny: 0, fox: 0, kitten: 0 },
      badges: [],
    });
    expect(migrated.bestResultsByLevel.meadow).toMatchObject({
      source: null,
      bestRescuedSpecies: [],
    });
  });

  it("sanitizes v3 stats, species, sources, and known badge ids", () => {
    const migrated = migratePlayerProgress({
      schemaVersion: 3,
      unlockedLevelCount: 2,
      totalAnimalsRescued: 1,
      generatedCompletions: 99,
      generatedMazesCompleted: 99,
      rescuesBySpecies: { bunny: 10.8, fox: -4, kitten: 11, dragon: 100 },
      badges: ["maze-explorer-20", "maze-explorer-20", "not-real"],
      bestResultsByLevel: {
        surprise: {
          completions: 2,
          bestSteps: 20,
          bestPower: 16,
          bestRescuedCount: 3,
          source: "generated",
          bestRescuedSpecies: ["kitten", "kitten", "fox", "bunny", "dragon"],
        },
        meadow: {
          completions: 1,
          bestSteps: 45,
          bestPower: 7,
          bestRescuedCount: 1,
          source: "curated",
          bestRescuedSpecies: ["fox", "kitten"],
        },
      },
    });

    expect(migrated).toMatchObject({
      totalMazesCompleted: 2,
      totalCompletions: 3,
      generatedCompletions: 2,
      generatedMazesCompleted: 1,
      totalAnimalsRescued: 21,
      rescuesBySpecies: { bunny: 10, fox: 0, kitten: 11 },
      badges: [
        "maze-explorer-20",
        "mighty-adventurer",
        "twinkle-toes",
        "bunny-buddy-10",
        "kitten-pal-10",
      ],
    });
    expect(migrated.bestResultsByLevel.surprise!.bestRescuedSpecies)
      .toEqual(["bunny", "fox", "kitten"]);
    expect(migrated.bestResultsByLevel.meadow!.bestRescuedSpecies).toEqual(["fox"]);
  });

  it("preserves legacy species totals while initializing every newer species", () => {
    const migrated = migratePlayerProgress({
      schemaVersion: 3,
      rescuesBySpecies: { bunny: 4, fox: 2, kitten: 3 },
      totalAnimalsRescued: 9,
      bestResultsByLevel: {},
    });

    expect(migrated.rescuesBySpecies).toEqual(rescueTotals({
      bunny: 4,
      fox: 2,
      kitten: 3,
    }));
    expect(migrated.totalAnimalsRescued).toBe(9);
  });

  it("prefers v3, but falls back to v2 before v1 when newer data is corrupt", () => {
    const storage = new MemoryStorage();
    storage.values.set(PLAYER_PROGRESS_STORAGE_KEY, JSON.stringify({
      schemaVersion: 3,
      unlockedLevelCount: 6,
    }));
    storage.values.set(VERSION_TWO_PLAYER_PROGRESS_STORAGE_KEY, JSON.stringify({
      schemaVersion: 2,
      unlockedLevelCount: 4,
    }));
    storage.values.set(LEGACY_PLAYER_PROGRESS_STORAGE_KEY, "2");

    expect(readPlayerProgress(storage).unlockedLevelCount).toBe(6);

    storage.values.set(PLAYER_PROGRESS_STORAGE_KEY, "{broken");
    expect(readPlayerProgress(storage).unlockedLevelCount).toBe(4);
    expect(JSON.parse(storage.values.get(PLAYER_PROGRESS_STORAGE_KEY) ?? "null"))
      .toMatchObject({ schemaVersion: 3, unlockedLevelCount: 4 });
  });

  it("ignores inherited save data and prototype-sensitive level ids", () => {
    const inheritedTotals = Object.create({ bunny: 99 }) as Record<string, unknown>;
    inheritedTotals.fox = 2;
    const inheritedSave = Object.create({ schemaVersion: 3, unlockedLevelCount: 99 }) as Record<string, unknown>;
    inheritedSave.schemaVersion = 3;
    inheritedSave.rescuesBySpecies = inheritedTotals;
    inheritedSave.bestResultsByLevel = JSON.parse(`{
      "__proto__":{"completions":9},
      "constructor":{"completions":9},
      "safe":{"completions":1,"bestSteps":40,"bestPower":4,"bestRescuedCount":0}
    }`) as unknown;

    const migrated = migratePlayerProgress(inheritedSave);

    expect(migrated.unlockedLevelCount).toBe(1);
    expect(migrated.rescuesBySpecies).toEqual(rescueTotals({ fox: 2 }));
    expect(Object.keys(migrated.bestResultsByLevel)).toEqual(["safe"]);
    expect(Object.getPrototypeOf(migrated.bestResultsByLevel)).toBe(Object.prototype);
  });

  it("falls back to v1 when newer JSON is corrupt", () => {
    const storage = new MemoryStorage();
    storage.values.set(PLAYER_PROGRESS_STORAGE_KEY, "{not json");
    storage.values.set(LEGACY_PLAYER_PROGRESS_STORAGE_KEY, "2");

    expect(readPlayerProgress(storage).unlockedLevelCount).toBe(2);
  });

  it("never throws when storage access fails", () => {
    const broken: ProgressStorage = {
      getItem: () => { throw new DOMException("blocked"); },
      setItem: () => { throw new DOMException("full"); },
    };

    expect(readPlayerProgress(broken)).toEqual(createDefaultPlayerProgress());
    expect(writePlayerProgress(createDefaultPlayerProgress(), broken)).toBe(false);
    expect(readPlayerProgress(null)).toEqual(createDefaultPlayerProgress());
  });

  it("round-trips a v3 save", () => {
    const storage = new MemoryStorage();
    const progress = applyLevelCompletion(
      createDefaultPlayerProgress(),
      completion("little-star-trail", 0, 3),
    );

    expect(writePlayerProgress(progress, storage)).toBe(true);
    expect(readPlayerProgress(storage)).toEqual(progress);
  });

  it("round-trips a five-friend rescue target without truncating it", () => {
    const storage = new MemoryStorage();
    const progress = applyLevelCompletion(
      createDefaultPlayerProgress(),
      completion("five-friend-fort", 4, 5, {
        totalRescueCount: 5,
        rescuedSpecies: ANIMAL_SPECIES.slice(0, 5),
      }),
    );

    expect(writePlayerProgress(progress, storage)).toBe(true);
    const reloaded = readPlayerProgress(storage);
    expect(reloaded).toEqual(progress);
    expect(reloaded.bestResultsByLevel["five-friend-fort"]).toMatchObject({
      bestRescuedCount: 5,
      totalRescueCount: 5,
      perfectRescue: true,
    });
  });
});

describe("level rewards", () => {
  it("awards gold plus first-maze and perfect-rescue stickers", () => {
    expect(calculateLevelReward({
      levelId: "little-star-trail",
      source: "curated",
      campaignIndex: 0,
      rescuedCount: 3,
      firstCompletion: true,
    })).toEqual({
      levelId: "little-star-trail",
      gold: 30,
      goldBreakdown: {
        completion: 10,
        firstCompletion: 5,
        animalRescue: 9,
        perfectRescue: 6,
      },
      stickerIds: ["first-star", "animal-friend"],
    });
  });

  it("uses generated-maze rewards and clamps impossible rescue counts", () => {
    const reward = calculateLevelReward({
      levelId: "surprise-1",
      source: "generated",
      campaignIndex: -1,
      rescuedCount: 99,
      firstCompletion: true,
    });

    expect(reward.gold).toBe(28);
    expect(reward.goldBreakdown).toEqual({
      completion: 8,
      firstCompletion: 5,
      animalRescue: 9,
      perfectRescue: 6,
    });
    expect(reward.stickerIds).toEqual(["animal-friend", "surprise-sparkle"]);
  });

  it.each([1, 2, 4, 5])(
    "recognizes a perfect rescue when all %i available friends are saved",
    (totalRescueCount) => {
      const reward = calculateLevelReward({
        levelId: `friends-${totalRescueCount}`,
        source: "curated",
        campaignIndex: 0,
        rescuedCount: totalRescueCount,
        totalRescueCount,
        firstCompletion: false,
      });

      expect(reward.goldBreakdown).toMatchObject({
        animalRescue: totalRescueCount * 3,
        perfectRescue: 6,
      });
      expect(reward.stickerIds).toEqual(["animal-friend"]);
    },
  );

  it("does not award an all-friends bonus for an incomplete variable rescue target", () => {
    const reward = calculateLevelReward({
      levelId: "five-friends",
      source: "curated",
      campaignIndex: 0,
      rescuedCount: 4,
      totalRescueCount: 5,
      firstCompletion: false,
    });

    expect(reward.goldBreakdown.animalRescue).toBe(12);
    expect(reward.goldBreakdown.perfectRescue).toBe(0);
    expect(reward.stickerIds).toEqual([]);
  });

  it("keeps three friends as the reward target for legacy callers", () => {
    const incomplete = calculateLevelReward({
      levelId: "legacy-two",
      source: "curated",
      campaignIndex: 0,
      rescuedCount: 2,
      firstCompletion: false,
    });
    const perfect = calculateLevelReward({
      levelId: "legacy-three",
      source: "curated",
      campaignIndex: 0,
      rescuedCount: 3,
      firstCompletion: false,
    });

    expect(incomplete.goldBreakdown.perfectRescue).toBe(0);
    expect(perfect.goldBreakdown.perfectRescue).toBe(6);
  });

  it("gently increases completion gold after each five story mazes", () => {
    const reward = calculateLevelReward({
      levelId: "story-7",
      source: "curated",
      campaignIndex: 6,
      rescuedCount: 0,
      firstCompletion: false,
    });

    expect(reward.goldBreakdown.completion).toBe(12);
    expect(reward.gold).toBe(12);
  });

  it("exports child-friendly label metadata for every prize", () => {
    expect(REWARD_LABELS.gold.label).toBe("Gold stars");
    expect(STICKER_LABELS["animal-friend"].description).toContain("every");
    expect(ACHIEVEMENT_LABELS["perfect-rescue-15"].shortLabel).toContain("15");
    expect(BADGE_LABELS["maze-explorer-5"].description).toContain("five");
  });
});

describe("applying level completions", () => {
  it("immutably applies unlocks, rewards, and the first best result", () => {
    const before = createDefaultPlayerProgress();
    const beforeSnapshot = JSON.stringify(before);
    const after = applyLevelCompletion(
      before,
      completion("little-star-trail", 0, 0, { steps: 42, power: 4 }),
    );

    expect(JSON.stringify(before)).toBe(beforeSnapshot);
    expect(after).not.toBe(before);
    expect(after).toMatchObject({
      unlockedLevelCount: 2,
      gold: 15,
      stickers: ["first-star"],
      totalAnimalsRescued: 0,
      perfectRescueMazeCount: 0,
      currentPerfectRescueStreak: 0,
    });
    expect(after.bestResultsByLevel["little-star-trail"]).toEqual({
      completions: 1,
      bestSteps: 42,
      bestPower: 4,
      bestRescuedCount: 0,
      totalRescueCount: 3,
      perfectRescue: false,
      source: "curated",
      bestRescuedSpecies: [],
    });
  });

  it("updates best fields independently and never repeats first-completion gold", () => {
    const first = applyLevelCompletion(
      createDefaultPlayerProgress(),
      completion("meadow", 0, 0, { steps: 40, power: 8 }),
    );
    const replay = applyLevelCompletion(
      first,
      completion("meadow", 0, 3, { steps: 32, power: 6 }),
    );
    const slowerStrongReplay = applyLevelCompletion(
      replay,
      completion("meadow", 0, 2, { steps: 50, power: 12 }),
    );

    expect(replay.gold - first.gold).toBe(25);
    expect(slowerStrongReplay.bestResultsByLevel.meadow).toEqual({
      completions: 3,
      bestSteps: 32,
      bestPower: 12,
      bestRescuedCount: 3,
      totalRescueCount: 3,
      perfectRescue: true,
      source: "curated",
      bestRescuedSpecies: ["bunny", "fox", "kitten"],
    });
    expect(slowerStrongReplay.totalAnimalsRescued).toBe(5);
    expect(slowerStrongReplay.perfectRescueMazeCount).toBe(1);
    expect(slowerStrongReplay.currentPerfectRescueStreak).toBe(0);
    expect(slowerStrongReplay.stickers).toEqual(["first-star", "animal-friend"]);
  });

  it("tracks cumulative species, completion, and generated-maze stats", () => {
    let progress = createDefaultPlayerProgress();
    progress = applyLevelCompletion(
      progress,
      completion("story", 0, 2, { rescuedSpecies: ["kitten", "bunny"] }),
    );
    progress = applyLevelCompletion(progress, completion("surprise-a", -1, 1, {
      source: "generated",
      rescuedSpecies: ["fox"],
    }));
    progress = applyLevelCompletion(progress, completion("surprise-a", -1, 2, {
      source: "generated",
      rescuedSpecies: ["fox", "kitten"],
    }));
    progress = applyLevelCompletion(progress, completion("surprise-b", -1, 0, {
      source: "generated",
    }));

    expect(progress).toMatchObject({
      totalMazesCompleted: 3,
      totalCompletions: 4,
      generatedCompletions: 3,
      generatedMazesCompleted: 2,
      totalAnimalsRescued: 5,
      rescuesBySpecies: { bunny: 1, fox: 2, kitten: 2 },
    });
    expect(progress.bestResultsByLevel.story).toMatchObject({
      source: "curated",
      bestRescuedSpecies: ["bunny", "kitten"],
    });
    expect(progress.bestResultsByLevel["surprise-a"]).toMatchObject({
      completions: 2,
      source: "generated",
      bestRescuedSpecies: ["fox", "kitten"],
    });
  });

  it("records rescues for the expanded animal roll-call", () => {
    const progress = applyLevelCompletion(
      createDefaultPlayerProgress(),
      completion("new-friends", 0, 3, {
        rescuedSpecies: ["puppy", "fawn", "red-panda"],
      }),
    );

    expect(progress.rescuesBySpecies).toEqual(rescueTotals({
      puppy: 1,
      fawn: 1,
      "red-panda": 1,
    }));
    expect(progress.bestResultsByLevel["new-friends"]?.bestRescuedSpecies)
      .toEqual(["puppy", "fawn", "red-panda"]);
  });

  it("banks optional maze Gold Stars and Science Points on completion", () => {
    const progress = applyLevelCompletion(
      createDefaultPlayerProgress(),
      completion("treasure-lab", 0, 3, { bonusGold: 7, sciencePoints: 4 }),
    );

    expect(progress.gold).toBe(37);
    expect(progress.sciencePoints).toBe(4);
  });

  it("persists perfect results for mazes with one, two, four, or five friends", () => {
    const rescueTargets = [1, 2, 4, 5] as const;
    let progress = createDefaultPlayerProgress();

    rescueTargets.forEach((totalRescueCount, campaignIndex) => {
      progress = applyLevelCompletion(
        progress,
        completion(`variable-${totalRescueCount}`, campaignIndex, totalRescueCount, {
          totalRescueCount,
          rescuedSpecies: ANIMAL_SPECIES.slice(0, totalRescueCount),
        }),
      );
      expect(progress.bestResultsByLevel[`variable-${totalRescueCount}`]).toMatchObject({
        bestRescuedCount: totalRescueCount,
        totalRescueCount,
        perfectRescue: true,
      });
    });

    expect(progress.perfectRescueMazeCount).toBe(4);
    expect(progress.currentPerfectRescueStreak).toBe(4);
    expect(progress.bestPerfectRescueStreak).toBe(4);
    expect(progress.totalAnimalsRescued).toBe(12);
  });

  it("increments a variable-target perfect counter once, only after a perfect replay", () => {
    const first = applyLevelCompletion(
      createDefaultPlayerProgress(),
      completion("five-friend-fort", 0, 4, {
        totalRescueCount: 5,
        rescuedSpecies: ANIMAL_SPECIES.slice(0, 4),
      }),
    );
    const perfectReplay = applyLevelCompletion(
      first,
      completion("five-friend-fort", 0, 5, {
        totalRescueCount: 5,
        rescuedSpecies: ANIMAL_SPECIES.slice(0, 5),
      }),
    );
    const laterIncompleteReplay = applyLevelCompletion(
      perfectReplay,
      completion("five-friend-fort", 0, 3, {
        totalRescueCount: 5,
        rescuedSpecies: ANIMAL_SPECIES.slice(0, 3),
      }),
    );

    expect(first.perfectRescueMazeCount).toBe(0);
    expect(perfectReplay.perfectRescueMazeCount).toBe(1);
    expect(laterIncompleteReplay.perfectRescueMazeCount).toBe(1);
    expect(laterIncompleteReplay.bestResultsByLevel["five-friend-fort"]).toMatchObject({
      bestRescuedCount: 5,
      totalRescueCount: 5,
      perfectRescue: true,
    });
  });

  it("deduplicates and validates reported species without changing reward counts", () => {
    const suppliedSpecies = ["kitten", "kitten", "dragon", "bunny"];
    const progress = applyLevelCompletion(
      createDefaultPlayerProgress(),
      completion("messy-report", 0, 3, {
        rescuedSpecies: suppliedSpecies as unknown as LevelCompletionInput["rescuedSpecies"],
      }),
    );
    suppliedSpecies.push("fox");

    expect(progress.totalAnimalsRescued).toBe(3);
    expect(progress.rescuesBySpecies).toEqual(rescueTotals({ bunny: 1, kitten: 1 }));
    expect(progress.bestResultsByLevel["messy-report"]!.bestRescuedSpecies)
      .toEqual(["bunny", "kitten"]);
    expect(progress.gold).toBe(30);
  });

  it("fills documented species on a v2 replay without inventing older rescues", () => {
    const migrated = migratePlayerProgress({
      schemaVersion: 2,
      gold: 50,
      totalAnimalsRescued: 6,
      bestResultsByLevel: {
        "old-maze": {
          completions: 2,
          bestSteps: 40,
          bestPower: 8,
          bestRescuedCount: 3,
        },
      },
    });
    const replay = applyLevelCompletion(migrated, completion("old-maze", 0, 3));

    expect(replay.gold - migrated.gold).toBe(25);
    expect(replay.totalCompletions).toBe(3);
    expect(replay.totalAnimalsRescued).toBe(9);
    expect(replay.rescuesBySpecies).toEqual(rescueTotals({ bunny: 1, fox: 1, kitten: 1 }));
    expect(replay.bestResultsByLevel["old-maze"]).toMatchObject({
      completions: 3,
      source: "curated",
      bestRescuedSpecies: ["bunny", "fox", "kitten"],
    });
  });

  it("refreshes an equal perfect-rescue trio after a level's animals change", () => {
    const oldVersion = applyLevelCompletion(
      createDefaultPlayerProgress(),
      completion("changing-friends", 0, 3),
    );
    const currentTrio = ["puppy", "duckling", "fawn"] as const;
    const replay = applyLevelCompletion(
      oldVersion,
      completion("changing-friends", 0, 3, { rescuedSpecies: currentTrio }),
    );

    expect(oldVersion.bestResultsByLevel["changing-friends"]?.bestRescuedSpecies)
      .toEqual(["bunny", "fox", "kitten"]);
    expect(replay.bestResultsByLevel["changing-friends"]?.bestRescuedSpecies)
      .toEqual(currentTrio);
    expect(replay.bestResultsByLevel["changing-friends"]?.bestRescuedCount).toBe(3);
  });

  it("unlocks explorer, surprise, power, step, and species badges", () => {
    let explorer = createDefaultPlayerProgress();
    for (let index = 0; index < 20; index += 1) {
      explorer = applyLevelCompletion(
        explorer,
        completion(`maze-${index}`, index, 0, { steps: 50, power: 5 }),
      );
    }
    expect(explorer.badges).toEqual([
      "maze-explorer-5",
      "maze-explorer-10",
      "maze-explorer-20",
    ]);

    let surprise = createDefaultPlayerProgress();
    for (let index = 0; index < 3; index += 1) {
      surprise = applyLevelCompletion(surprise, completion(`surprise-${index}`, -1, 0, {
        source: "generated",
        steps: 50,
        power: 5,
      }));
    }
    expect(surprise.badges).toContain("surprise-explorer-3");

    let feats = createDefaultPlayerProgress();
    feats = applyLevelCompletion(feats, completion("strong", 0, 0, { steps: 50, power: 15 }));
    feats = applyLevelCompletion(feats, completion("quick", 1, 0, { steps: 30, power: 5 }));
    for (const species of SPECIES) {
      for (let index = 0; index < 10; index += 1) {
        feats = applyLevelCompletion(feats, completion(`friend-${species}`, 2, 1, {
          rescuedSpecies: [species],
          steps: 50,
          power: 5,
        }));
      }
    }
    expect(feats.badges).toEqual(expect.arrayContaining([
      "mighty-adventurer",
      "twinkle-toes",
      "bunny-buddy-10",
      "fox-friend-10",
      "kitten-pal-10",
    ]));
  });

  it("tracks first-completion perfect rescue streaks and their best", () => {
    let progress = createDefaultPlayerProgress();
    progress = applyLevelCompletion(progress, completion("one", 0, 3));
    progress = applyLevelCompletion(progress, completion("two", 1, 3));
    progress = applyLevelCompletion(progress, completion("three", 2, 2));

    expect(progress.currentPerfectRescueStreak).toBe(0);
    expect(progress.bestPerfectRescueStreak).toBe(2);

    progress = applyLevelCompletion(progress, completion("four", 3, 3));
    expect(progress.currentPerfectRescueStreak).toBe(1);
    expect(progress.bestPerfectRescueStreak).toBe(2);
  });

  it("unlocks 5, 10, and 15-rescue medals on distinct perfect mazes", () => {
    let progress = createDefaultPlayerProgress();

    for (let index = 0; index < 15; index += 1) {
      progress = applyLevelCompletion(
        progress,
        completion(`perfect-${index + 1}`, index, 3),
      );
      if (index === 4) expect(progress.medals).toEqual(["perfect-rescue-5"]);
      if (index === 9) {
        expect(progress.medals).toEqual(["perfect-rescue-5", "perfect-rescue-10"]);
      }
    }

    expect(progress.perfectRescueMazeCount).toBe(15);
    expect(progress.currentPerfectRescueStreak).toBe(15);
    expect(progress.bestPerfectRescueStreak).toBe(15);
    expect(progress.medals).toEqual([
      "perfect-rescue-5",
      "perfect-rescue-10",
      "perfect-rescue-15",
    ]);

    const replay = applyLevelCompletion(progress, completion("perfect-1", 0, 3));
    expect(replay.perfectRescueMazeCount).toBe(15);
    expect(replay.medals).toEqual(progress.medals);
  });

  it("rejects an empty level id instead of corrupting the results map", () => {
    expect(() => applyLevelCompletion(
      createDefaultPlayerProgress(),
      completion("   ", 0, 0),
    )).toThrow(/levelId/);
  });

  it("normalizes safe level ids and rejects reserved object keys", () => {
    const progress = applyLevelCompletion(
      createDefaultPlayerProgress(),
      completion("  meadow-path  ", 0, 0),
    );
    expect(Object.keys(progress.bestResultsByLevel)).toEqual(["meadow-path"]);

    for (const reserved of ["__proto__", " prototype ", "constructor"]) {
      expect(() => applyLevelCompletion(
        createDefaultPlayerProgress(),
        completion(reserved, 0, 0),
      )).toThrow(/levelId/);
    }
  });
});
